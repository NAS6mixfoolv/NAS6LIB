//Programed by NAS6
//BigIntCalculator.js

class N6LBigIntCalculator {
  // 文字列または数値から任意桁数を生成する
  constructor(value = "0") {
    this.parse(String(value));
  }

  // 符号と各桁の配列に分解する（リトルエンディアン：下位桁がインデックス0）
  parse(str) {
    str = str.trim();
    if (str.startsWith("-")) {
      this.isNegative = true;
      str = str.slice(1);
    } else if (str.startsWith("+")) {
      this.isNegative = false;
      str = str.slice(1);
    } else {
      this.isNegative = false;
    }

    // 数字以外の文字を除外（必要に応じて）
    str = str.replace(/^0+/, "") || "0";
    if (str === "0") this.isNegative = false;

    this.digits = str.split("").reverse().map(Number);
  }

  // 文字列への変換
  toString() {
    if (this.digits.length === 1 && this.digits[0] === 0) return "0";
    const sign = this.isNegative ? "-" : "";
    return sign + this.digits.slice().reverse().join("");
  }

  // 絶対値の大小比較 (this vs other) 
  // 戻り値: 1 (this > other), 0 (this == other), -1 (this < other)
  static compareAbsolute(a, b) {
    if (a.digits.length !== b.digits.length) {
      return a.digits.length > b.digits.length ? 1 : -1;
    }
    for (let i = a.digits.length - 1; i >= 0; i--) {
      if (a.digits[i] !== b.digits[i]) {
        return a.digits[i] > b.digits[i] ? 1 : -1;
      }
    }
    return 0;
  }

  // 絶対値の加算: |a| + |b|
  static addAbsolute(d1, d2) {
    const result = [];
    let carry = 0;
    const maxLength = Math.max(d1.length, d2.length);

    for (let i = 0; i < maxLength || carry > 0; i++) {
      const sum = (d1[i] || 0) + (d2[i] || 0) + carry;
      result.push(sum % 10);
      carry = Math.floor(sum / 10);
    }
    return result;
  }

  // 絶対値の減算: |a| - |b| (前提: |a| >= |b|)
  static subAbsolute(d1, d2) {
    const result = [];
    let borrow = 0;

    for (let i = 0; i < d1.length; i++) {
      let diff = d1[i] - (d2[i] || 0) - borrow;
      if (diff < 0) {
        diff += 10;
        borrow = 1;
      } else {
        borrow = 0;
      }
      result.push(diff);
    }

    // 冗長な上位の0をトリム
    while (result.length > 1 && result[result.length - 1] === 0) {
      result.pop();
    }
    return result;
  }

  // 加算 (A + B)
  add(other) {
    const o = typeof other === "string" || typeof other === "number" ? new N6LBigIntCalculator(other) : other;

    if (this.isNegative === o.isNegative) {
      // 同符号なら絶対値の足し算
      this.digits = N6LBigIntCalculator.addAbsolute(this.digits, o.digits);
    } else {
      // 異符号なら絶対値の引き算
      const cmp = N6LBigIntCalculator.compareAbsolute(this, o);
      if (cmp === 0) {
        this.digits = [0];
        this.isNegative = false;
      } else if (cmp > 0) {
        this.digits = N6LBigIntCalculator.subAbsolute(this.digits, o.digits);
      } else {
        this.digits = N6LBigIntCalculator.subAbsolute(o.digits, this.digits);
        this.isNegative = !this.isNegative;
      }
    }
    if (this.digits.length === 1 && this.digits[0] === 0) this.isNegative = false;
    return this;
  }

  // 減算 (A - B)
  sub(other) {
    const o = typeof other === "string" || typeof other === "number" ? new N6LBigIntCalculator(other) : other;
    // Bの符号を反転させて加算に持ち込む
    const temp = new N6LBigIntCalculator(o.toString());
    temp.isNegative = !temp.isNegative;
    return this.add(temp);
  }

  // 乗算 (A × B) - 筆算アルゴリズム
  mul(other) {
    const o = typeof other === "string" || typeof other === "number" ? new N6LBigIntCalculator(other) : other;
    
    if ((this.digits.length === 1 && this.digits[0] === 0) || (o.digits.length === 1 && o.digits[0] === 0)) {
      this.digits = [0];
      this.isNegative = false;
      return this;
    }

    const result = new Array(this.digits.length + o.digits.length).fill(0);

    for (let i = 0; i < this.digits.length; i++) {
      for (let j = 0; j < o.digits.length; j++) {
        const prod = this.digits[i] * o.digits[j] + result[i + j];
        result[i + j] = prod % 10;
        result[i + j + 1] += Math.floor(prod / 10);
      }
    }

    // 末尾の0をトリム
    while (result.length > 1 && result[result.length - 1] === 0) {
      result.pop();
    }

    this.digits = result;
    this.isNegative = (this.isNegative !== o.isNegative);
    if (this.digits.length === 1 && this.digits[0] === 0) this.isNegative = false;
    return this;
  }

  // 除算 (A ÷ B) - 商を求める（余りは切り捨て）
  div(other) {
    const o = typeof other === "string" || typeof other === "number" ? new N6LBigIntCalculator(other) : other;
    
    if (o.digits.length === 1 && o.digits[0] === 0) {
      throw new Error("Division by zero");
    }

    const cmp = N6LBigIntCalculator.compareAbsolute(this, o);
    if (cmp < 0) {
      this.digits = [0];
      this.isNegative = false;
      return this;
    }
    if (cmp === 0) {
      this.digits = [1];
      this.isNegative = (this.isNegative !== o.isNegative);
      return this;
    }

    // 筆算ベースの長除算（Long Division）
    let quotientDigits = [];
    let remainder = new N6LBigIntCalculator("0");

    for (let i = this.digits.length - 1; i >= 0; i--) {
      // 余りを10倍して次の桁を下ろす
      remainder.digits.unshift(this.digits[i]);
      // 0埋め整形とトリム
      remainder.digits = remainder.digits.reverse().join("").replace(/^0+/, "").split("").reverse().map(Number);
      if (remainder.digits.length === 0) remainder.digits = [0];

      let count = 0;
      while (N6LBigIntCalculator.compareAbsolute(remainder, o) >= 0) {
        remainder.digits = N6LBigIntCalculator.subAbsolute(remainder.digits, o.digits);
        count++;
      }
      quotientDigits.push(count);
    }

    // 商の桁を反転し、先頭の不要な0を削除
    quotientDigits.reverse();
    while (quotientDigits.length > 1 && quotientDigits[quotientDigits.length - 1] === 0) {
      quotientDigits.pop();
    }

    this.digits = quotientDigits;
    this.isNegative = (this.isNegative !== o.isNegative);
    if (this.digits.length === 1 && this.digits[0] === 0) this.isNegative = false;
    return this;
  }

  // 剰余 (A % B)
  mod(other) {
    const o = typeof other === "string" || typeof other === "number" ? new N6LBigIntCalculator(other) : other;
    
    if (o.digits.length === 1 && o.digits[0] === 0) {
      throw new Error("Division by zero");
    }

    const cmp = N6LBigIntCalculator.compareAbsolute(this, o);
    if (cmp < 0) {
      // 絶対値が小さければ余りはそのまま自身（符号は維持）
      return this;
    }
    if (cmp === 0) {
      this.digits = [0];
      this.isNegative = false;
      return this;
    }

    let remainder = new N6LBigIntCalculator("0");

    for (let i = this.digits.length - 1; i >= 0; i--) {
      remainder.digits.unshift(this.digits[i]);
      remainder.digits = remainder.digits.reverse().join("").replace(/^0+/, "").split("").reverse().map(Number);
      if (remainder.digits.length === 0) remainder.digits = [0];

      while (N6LBigIntCalculator.compareAbsolute(remainder, o) >= 0) {
        remainder.digits = N6LBigIntCalculator.subAbsolute(remainder.digits, o.digits);
      }
    }

    this.digits = remainder.digits;
    // 割られる数（this）の符号を引き継ぐ（JSの標準仕様に準拠）
    if (this.digits.length === 1 && this.digits[0] === 0) {
      this.isNegative = false;
    }
    return this;
  }
}

/*
// --- 動作確認 ---
const calc1 = new N6LBigIntCalculator("9876543210987654321098765432109876543210");
const calc2 = new N6LBigIntCalculator("4567890123");

console.log("初期値A:", calc1.toString());//初期値A: 9876543210987654321098765432109876543210
console.log("初期値B:", calc2.toString());//初期値B: 4567890123

// 足し算
let cAdd = new N6LBigIntCalculator(calc1.toString());
console.log("A + B =", cAdd.add(calc2).toString());//A + B = 9876543210987654321098765432114444433333

// 引き算
let cSub = new N6LBigIntCalculator(cAdd.toString());
console.log("A + B - B =", cSub.sub(calc2).toString());//A + B - B = 9876543210987654321098765432109876543210

// 割り算 (商を求める)
let cDiv = new N6LBigIntCalculator(calc1.toString());
cDiv.div(calc2);
console.log("A ÷ B (商) =", cDiv.toString());//A ÷ B (商) = 2162167421947783642233367580525

// 剰余 (余りを求める)
let cMod = new N6LBigIntCalculator(calc1.toString());
cMod.mod(calc2);
console.log("A ％ B (余り) =", cMod.toString());//A ％ B (余り) = 1321888635

// 検算: (商 × B) + 余り ＝ A に戻るか？
let check = new N6LBigIntCalculator(cDiv.toString());
check.mul(calc2).add(cMod);
console.log("(A ÷ B) × B + (A ％ B) =", check.toString());//(A ÷ B) × B + (A ％ B) = 9876543210987654321098765432109876543210
console.log("一致判定:", check.toString() === calc1.toString());//一致判定: true

*/
