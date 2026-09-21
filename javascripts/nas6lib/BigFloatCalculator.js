//Programed by NAS6
//BigFloatCalculator.js

class N6LBigFloatCalculator {
  constructor(value = "0") {
    this.parse(String(value));
  }

  clone() { return new N6LBigFloatCalculator(this.toString()); }

  parse(str) {
    str = str.trim();
    this.isNegative = false;
    if (str.startsWith("-")) {
      this.isNegative = true;
      str = str.slice(1);
    } else if (str.startsWith("+")) {
      str = str.slice(1);
    }

    let expOffset = 0;
    let eIdx = str.search(/[eE]/);
    if (eIdx !== -1) {
      expOffset = parseInt(str.slice(eIdx + 1), 10);
      str = str.slice(0, eIdx);
    }

    let scale = 0;
    let dotIdx = str.indexOf(".");
    if (dotIdx !== -1) {
      let intPart = str.slice(0, dotIdx);
      let fracPart = str.slice(dotIdx + 1);
      scale = fracPart.length;
      str = intPart + fracPart;
    }

    str = str.replace(/^0+/, "") || "0";
    if (str === "0") this.isNegative = false;

    this.digits = str.split("").reverse().map(Number);
    this.scale = scale - expOffset;
  }

  // AAA.BBBe+CCC 形式（科学用表記・末尾の0を削除）への変換
  toStringScientific() {
    // 0 の特別扱い
    if (this.digits.length === 1 && this.digits[0] === 0) {
      return "0.0e+0";
    }

    // digits を上位→下位に並べ直す
    let full = this.digits.slice().reverse().join("");  // 例: "0001"

    // 小数点位置（右から scale 桁が小数）
    let L = full.length;
    let intLen = L - this.scale;   // 整数部の桁数（0 もあり得る）

    // 正規化：最初の非 0 桁を探す
    let firstNonZero = full.search(/[1-9]/);
    if (firstNonZero === -1) {
      // 全部 0 の場合（理論上ここには来ない）
      return "0.0e+0";
    }

    // 指数：正規化後の位置
    let exp = intLen - 1 - firstNonZero;

    // マンティッサ生成
    let mantissaDigits = full.slice(firstNonZero);
    let mantissa = mantissaDigits[0];

    if (mantissaDigits.length > 1) {
      mantissa += "." + mantissaDigits.slice(1);
    } else {
      mantissa += ".0";
    }

    // 末尾の 0 を削除（ただし ".0" は残す）
    mantissa = mantissa.replace(/(\.\d*?)0+$/, "$1");
    if (mantissa.endsWith(".")) mantissa += "0";

    let sign = this.isNegative ? "-" : "";
    let expSign = exp >= 0 ? "+" : "";

    return `${sign}${mantissa}e${expSign}${exp}`;
  }

  toString() {
    if (this.digits.length === 1 && this.digits[0] === 0) return "0";
    
    let intStr = this.digits.slice().reverse().join("");
    
    if (this.scale > 0) {
      if (intStr.length <= this.scale) {
        intStr = "0".repeat(this.scale - intStr.length + 1) + intStr;
      }
      let splitIdx = intStr.length - this.scale;
      intStr = intStr.slice(0, splitIdx) + "." + intStr.slice(splitIdx);
    } else if (this.scale < 0) {
      intStr = intStr + "0".repeat(-this.scale);
    }

    if (intStr.includes(".")) {
      intStr = intStr.replace(/\.?0+$/, "");
      if (intStr === "") intStr = "0";
    }

    let sign = this.isNegative ? "-" : "";
    return sign + intStr;
  }

 // ------------------------------------------------------------
  // 許容誤差（イプシロン）による近似一致判定（高精度完全対応版）
  // ------------------------------------------------------------
  epsCmp(other, eps = "1e-10") {
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    let e =
      (typeof eps === "string")
        ? new N6LBigFloatCalculator(eps)
        : (typeof eps === "number")
            ? new N6LBigFloatCalculator(String(eps))
            : eps;

    // 差分を計算: diff = |this - other|
    let diff = new N6LBigFloatCalculator(this.toString());
    diff = diff.sub(o);
    diff.isNegative = false; // 絶対値化

    // diff <= e を高精度な compareTo で判定
    // (diff.compareTo(e) が 0 以下なら diff <= e)
    return diff.compareTo(e) <= 0;
  }

  // 内部整数値の文字列を取得するヘルパー
  _getIntString() {
    return this.digits.slice().reverse().join("");
  }

  // ============================================================
  // 絶対値の大小比較（小数点・スケールを完全考慮した版）
  // ============================================================
  static compareAbsoluteWithScale(A, B) {
    let scaleA = A.digits.length - A.scale;
    let scaleB = B.digits.length - B.scale;
    let aDigitsPadded = A.digits.slice().reverse();
    let bDigitsPadded = B.digits.slice().reverse();

    if (scaleA < scaleB) {
      let pad = scaleB - scaleA;
      scaleA += pad;
      for (let z = 0; z < pad; z++) {
        aDigitsPadded.unshift(0);
      }
    } else if (scaleB < scaleA) {
      let pad = scaleA - scaleB;
      scaleB += pad;
      for (let z = 0; z < pad; z++) {
        bDigitsPadded.unshift(0);
      }
    }

    // 小数部も含めて長さを揃えるため、短い方の末尾に0をパディング
    while (aDigitsPadded.length < bDigitsPadded.length) {
      aDigitsPadded.push(0);
    }
    while (bDigitsPadded.length < aDigitsPadded.length) {
      bDigitsPadded.push(0);
    }

    // 上位桁から順に比較
    for (let i = 0; i < aDigitsPadded.length; i++) {
      let valA = aDigitsPadded[i] || 0;
      let valB = bDigitsPadded[i] || 0;
      if (valA !== valB) {
        return valA > valB ? 1 : -1;
      }
    }
    return 0;
  }

  // ============================================================
  // 符号を考慮した全体の大小比較（this と other）
  // 戻り値: 1 (this > other), 0 (this == other), -1 (this < other)
  // ============================================================
  compareTo(other) {
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    let isZeroThis = this.digits.length === 1 && this.digits[0] === 0;
    let isZeroOther = o.digits.length === 1 && o.digits[0] === 0;

    if (isZeroThis && isZeroOther) return 0;

    // 符号が異なる場合
    if (this.isNegative && !o.isNegative) return -1;
    if (!this.isNegative && o.isNegative) return 1;

    // 符号が同じ場合、絶対値で比較して符号で反転
    let absComp = N6LBigFloatCalculator.compareAbsoluteWithScale(this, o);
    if (this.isNegative) {
      return -absComp;
    } else {
      return absComp;
    }
  }

  static compareAbsolute(aDigits, bDigits) {
    if (aDigits.length !== bDigits.length) {
      return aDigits.length > bDigits.length ? 1 : -1;
    }
    for (let i = aDigits.length - 1; i >= 0; i--) {
      if (aDigits[i] !== bDigits[i]) {
        return aDigits[i] > bDigits[i] ? 1 : -1;
      }
    }
    return 0;
  }

  static addAbsolute(d1, d2) {
    let result = [];
    let carry = 0;
    let maxLength = Math.max(d1.length, d2.length);
    for (let i = 0; i < maxLength || carry > 0; i++) {
      let sum = (d1[i] || 0) + (d2[i] || 0) + carry;
      result.push(sum % 10);
      carry = Math.floor(sum / 10);
    }
    return result;
  }

  static subAbsolute(d1, d2) {
    let result = [];
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
    while (result.length > 1 && result[result.length - 1] === 0) {
      result.pop();
    }
    return result;
  }

  _alignScale(other) {
    let d1 = [...this.digits];
    let d2 = [...other.digits];
    let s1 = this.scale;
    let s2 = other.scale;

    if (s1 < s2) {
      let diff = s2 - s1;
      d1 = "0".repeat(diff).split("").reverse().map(Number).concat(d1);
      s1 = s2;
    } else if (s2 < s1) {
      let diff = s1 - s2;
      d2 = "0".repeat(diff).split("").reverse().map(Number).concat(d2);
      s2 = s1;
    }
    return { d1, d2, scale: s1 };
  }



  // ------------------------------------------------------------
  // 小数部の桁数を maxScale に揃える
  // digits = [下位桁, ..., 上位桁]
  // scale = 小数部の桁数
  // ------------------------------------------------------------
  _padFraction(maxScale) {
    maxScale = Number(maxScale);   // ★これが必須
    let d = this.digits.slice();  // コピー
    let diff = maxScale - this.scale;

    // 小数部が足りない分だけ「下位桁側」に 0 を追加する
    // 下位桁が digits[0] なので unshift(0) が正しい
    for (let i = 0; i < diff; i++) {
      d.unshift(0);
    }

    return d;
  }

  // ------------------------------------------------------------
  // 加算（符号あり・scale 揃え・fp 丸め）
  // ------------------------------------------------------------
  add(other, fp = 30) {
    fp = Number(fp);   // ★これが必須
    let me = this.clone();
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    // anything + 0 = anything
    if (o.digits.length === 1 && o.digits[0] === 0) {
      return me;
    }

    // 0 + anything = anything
    if (me.digits.length === 1 && me.digits[0] === 0) {
      let res = new N6LBigFloatCalculator(o.toString());
      // 0 のときの -0 防止
      if (res.digits.length === 1 && res.digits[0] === 0) {
        res.isNegative = false;
      }
      me.digits = res.digits;
      me.scale = res.scale;
      me.isNegative = res.isNegative;
      if (me.digits.length === 1 && me.digits[0] === 0) {
        me.isNegative = false;
      }
      return me;
    }

    // ------------------------------
    // 1) scale を揃える（小数部の桁数を一致させる）
    // ------------------------------
    let maxScale = Math.max(me.scale, o.scale);

    let d1 = me._padFraction(maxScale);  // me.digits を maxScale に合わせる
    let d2 = o._padFraction(maxScale);     // o.digits を maxScale に合わせる

    // ------------------------------
    // 2) 符号処理
    // ------------------------------
    let resultDigits;
    let resultSign;

    if (me.isNegative === o.isNegative) {
      // 同符号 → 絶対値加算
      resultDigits = N6LBigFloatCalculator.addAbsolute(d1, d2);
      resultSign = me.isNegative;
    } else {
      // 異符号 → 絶対値比較して大きい方から引く
      let cmp = N6LBigFloatCalculator.compareAbsolute(d1, d2);

      if (cmp === 0) {
        // 完全に同じ → 0
        me.digits = [0];
        me.scale = 0;
        me.isNegative = false;
        return me;
      }

      if (cmp > 0) {
        // |this| > |other|
        resultDigits = N6LBigFloatCalculator.subAbsolute(d1, d2);
        resultSign = me.isNegative;
      } else {
        // |other| > |this|
        resultDigits = N6LBigFloatCalculator.subAbsolute(d2, d1);
        resultSign = o.isNegative;
      }
    }

    // ------------------------------
    // 3) 上位の 0 を削る
    // ------------------------------
    while (resultDigits.length > 1 && resultDigits[resultDigits.length - 1] === 0) {
      resultDigits.pop();
    }

    // ------------------------------
    // 4) fp（有効桁）で丸める
    // digits は下位→上位なので、下位桁を捨てる
    // ------------------------------
    if (resultDigits.length > fp) {
      if(fp < me.scale) {
        let cut = me.scale - fp;
        resultDigits.splice(0, cut);  // 下位桁を捨てる
        // scale は小数部の桁数なので、下位桁を捨てた分だけ減らす
        me.scale = maxScale - cut;
      }
    } else {
      me.scale = maxScale;
    }

    // ------------------------------
    // 5) 結果を反映
    // ------------------------------
    me.digits = resultDigits;
    me.isNegative = resultSign;

    if (me.digits.length === 1 && me.digits[0] === 0) {
      me.isNegative = false;
    }

    return me;
  }

  // ------------------------------------------------------------
  // 減算（符号あり・scale 揃え・fp 丸め）
  // ------------------------------------------------------------
  sub(other, fp = 30) {
    fp = Number(fp);   // ★これが必須
    let me = this.clone();
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    // anything - 0 = anything
    if (o.digits.length === 1 && o.digits[0] === 0) {
      return me;
    }

    // 0 - anything = -anything
    if (me.digits.length === 1 && me.digits[0] === 0) {
      let res = new N6LBigFloatCalculator(o.toString());
      res.isNegative = !res.isNegative;
      // 0 のときの -0 防止
      if (res.digits.length === 1 && res.digits[0] === 0) {
        res.isNegative = false;
      }
      me.digits = res.digits;
      me.scale = res.scale;
      me.isNegative = res.isNegative;
      if (me.digits.length === 1 && me.digits[0] === 0) {
        me.isNegative = false;
      }
      return me;
    }


    // ------------------------------
    // 1) scale を揃える（小数部の桁数を一致させる）
    // ------------------------------
    let maxScale = Math.max(me.scale, o.scale);

    let d1 = me._padFraction(maxScale);  // me.digits を maxScale に合わせる
    let d2 = o._padFraction(maxScale);     // o.digits を maxScale に合わせる

    // ------------------------------
    // 2) 符号処理
    // ------------------------------
    let resultDigits;
    let resultSign;

    if (me.isNegative !== o.isNegative) {
      // 異符号 → 絶対値加算
      resultDigits = N6LBigFloatCalculator.addAbsolute(d1, d2);
      resultSign = me.isNegative;
    } else {
      // 同符号 → 絶対値比較して大きい方から引く
      let cmp = N6LBigFloatCalculator.compareAbsolute(d1, d2);

      if (cmp === 0) {
        // 完全に同じ → 0
        me.digits = [0];
        me.scale = 0;
        me.isNegative = false;
        return me;
      }

      if (cmp > 0) {
        // |me| > |other|
        resultDigits = N6LBigFloatCalculator.subAbsolute(d1, d2);
        resultSign = me.isNegative;
      } else {
        // |other| > |me|
        resultDigits = N6LBigFloatCalculator.subAbsolute(d2, d1);
        resultSign = !o.isNegative;
      }
    }

    // ------------------------------
    // 3) 上位の 0 を削る
    // ------------------------------
    while (resultDigits.length > 1 && resultDigits[resultDigits.length - 1] === 0) {
      resultDigits.pop();
    }

    // ------------------------------
    // 4) fp（有効桁）で丸める
    // digits は下位→上位なので、下位桁を捨てる
    // ------------------------------
    if (resultDigits.length > fp) {
      if(fp < me.scale) {
        let cut = me.scale - fp;
        resultDigits.splice(0, cut);  // 下位桁を捨てる
        // scale は小数部の桁数なので、下位桁を捨てた分だけ減らす
        me.scale = maxScale - cut;
      }
    } else {
      me.scale = maxScale;
    }

    // ------------------------------
    // 5) 結果を反映
    // ------------------------------
    me.digits = resultDigits;
    me.isNegative = resultSign;

    if (me.digits.length === 1 && me.digits[0] === 0) {
      me.isNegative = false;
    }

    return me;
  }

  // ------------------------------------------------------------
  // 乗算（整数化 → 畳み込み積 → 小数桁復元 → fp 丸め）
  // ------------------------------------------------------------
  mul(other, fp = 30) {
    fp = Number(fp);
    let me = this.clone();
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    // 0 × anything = 0
    if ((me.digits.length === 1 && me.digits[0] === 0) ||
        (o.digits.length === 1 && o.digits[0] === 0)) {
      me.digits = [0];
      me.scale = 0;
      me.isNegative = false;
      return me;
    }

    // ------------------------------
    // 1) 整数化
    // ------------------------------
    let scaleA = me.scale; 
    let scaleB = o.scale;    
    let A = me._toIntegerLike(); 
    let B = o._toIntegerLike();    

    let d1 = A.intDigits; 
    let d2 = B.intDigits;

    // ------------------------------
    // 2) 畳み込み積（整数同士の乗算）
    // ------------------------------
    let result = new Array(d1.length + d2.length).fill(0);

    for (let i = 0; i < d1.length; i++) {
      for (let j = 0; j < d2.length; j++) {
        let prod = d1[i] * d2[j] + result[i + j];
        result[i + j] = prod % 10;
        result[i + j + 1] += Math.floor(prod / 10);
      }
    }

    // 上位の 0 を削る
    while (result.length > 1 && result[result.length - 1] === 0) {
      result.pop();
    }

    // ------------------------------
    // 3) 小数桁（scale）の復元
    // ------------------------------
    let newScale = scaleA + scaleB;
    let digits = result;

    // ------------------------------
    // 4) 下位の不要な 0 を削る（正規化）
    // 配列の先頭（index 0）側にある不要な 0 と scale を同時に減らす
    // ------------------------------
    while (newScale > 0 && digits.length > 1 && digits[0] === 0) {
      digits.shift();
      newScale--;
    }

    // ------------------------------
    // 5) 指定された有効桁・小数桁（fp）による丸め・切り詰め
    // 小数部の桁数が fp を超えている場合、下位側をカットする
    // ------------------------------
    if (newScale > fp) {
      let cut = newScale - fp;
      digits.splice(0, cut);
      newScale = fp;
    }

    // ------------------------------
    // 6) 結果反映
    // ------------------------------
    me.digits = digits;
    me.scale = newScale;
    me.isNegative = (me.isNegative !== o.isNegative);

    if (me.digits.length === 1 && me.digits[0] === 0) {
      me.isNegative = false;
      me.scale = 0;
    }

    return me;
  }

  // ============================================================
  // 除算（商と剰余を同時に返す版）
  // ============================================================
  div(other, fp = 30) {
    fp = Number(fp);
    let me = this.clone();
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    // 0 / something = 0
    if (me.digits.length === 1 && me.digits[0] === 0) {
      let modVal = new N6LBigFloatCalculator("0");
      me.scale = 0;
      me.isNegative = false;
      return { quot: me, mod: modVal };
    }

    if (o.digits.length === 1 && o.digits[0] === 0) {
      throw new Error("Division by zero");
    }

    // 演算前の元データ（me）をコピー保存しておく（剰余計算用）
    let meCopy = new N6LBigFloatCalculator();
    meCopy.digits = [...me.digits];
    meCopy.scale = me.scale;
    meCopy.isNegative = me.isNegative;

    // 1) 自身の値 (A) と 相手の値 (B) の整数表現と scale を取得
    let scaleA = me.scale;
    let scaleB = o.scale;
    let A = me._toIntegerLike();
    let B = o._toIntegerLike();

    let d1 = A.intDigits.slice(); 
    let d2 = B.intDigits.slice(); 

    let expDiff = scaleB - scaleA + fp;

    if (expDiff >= 0) {
      for (let k = 0; k < expDiff; k++) {
        d1.unshift(0);
      }
    } else {
      for (let k = 0; k < -expDiff; k++) {
        d2.unshift(0);
      }
    }

    // 3) 整数同士の長除算
    let { quotient } = N6LBigFloatCalculator.divInteger(d1, d2);

    let newScale = fp;
    let digits = quotient;

    // 4) 下位の不要な 0 を削る（正規化）
    while (newScale > 0 && digits.length > 1 && digits[0] === 0) {
      digits.shift();
      newScale--;
    }

    // 5) fp を超える場合の丸め
    if (newScale > fp) {
      let cut = newScale - fp;
      digits.splice(0, cut);
      newScale = fp;
    }

    // 6) 結果（商）を me に反映
    me.digits = digits;
    me.scale = newScale;
    me.isNegative = (me.isNegative !== o.isNegative);

    if (me.digits.length === 1 && me.digits[0] === 0) {
      me.isNegative = false;
      me.scale = 0;
    }

    // ============================================================
    // 剰余計算
    // ============================================================
    let zero = new N6LBigFloatCalculator("0");
    let wni = N6LBigFloatCalculator.getInteger(me); // 商の整数部
    
    let tmp3 = new N6LBigFloatCalculator(o);
    tmp3 = tmp3.mul(wni, fp);
    tmp3.isNegative = false; // abs(tmp3) 相当

    let modVal = new N6LBigFloatCalculator();
    
    // zero < me （元の me が 0 より大きいか）の判定
    let isMePositive = meCopy.compareTo("0");

    if (0 <= isMePositive) {
      // mod = me - tmp3
      let subWork = new N6LBigFloatCalculator(meCopy);
      subWork = subWork.sub(tmp3, fp);
      modVal.digits = [...subWork.digits];
      modVal.scale = subWork.scale;
      modVal.isNegative = subWork.isNegative;
    } else {
      // mod = me + tmp3
      let addWork = new N6LBigFloatCalculator(meCopy);
      addWork = addWork.add(tmp3, fp);
      modVal.digits = [...addWork.digits];
      modVal.scale = addWork.scale;
      modVal.isNegative = addWork.isNegative;
    }

    return { quot: me, mod: modVal };
  }

  // ============================================================
  // 剰余演算子 (mod) メソッド
  // ============================================================
  mod(other, fp = 30) {
    fp = Number(fp);
    let me = this.clone();
    let b =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    let a = new N6LBigFloatCalculator(me.toString());
    if (b.digits.length === 1 && b.digits[0] === 0) {
      throw new Error("Division by zero");
    }

    let zero = new N6LBigFloatCalculator("0");

    // toFraction(..., true) で確実に分数化・小数化情報を取得する
    let x = N6LBigFloatCalculator.toFraction(a, true, fp);
    let aa = x.num;
    let ab = x.denomi;

    let y = N6LBigFloatCalculator.toFraction(b, true, fp);
    let ba = y.num;
    let bb = y.denomi;

    let ret = new N6LBigFloatCalculator();
    let tmp = new N6LBigFloatCalculator();

    if (!x.success && !y.success) {
        let retDiv = a.div(b, fp);
        return retDiv.mod;
    } 
    else if (!x.success) {
        // c = a * bb
        let c = new N6LBigFloatCalculator(a);
        c = c.mul(bb, fp);

        // ret / modVal = c / ba
        let divRes = c.div(ba, fp);
        ret = divRes.quot;
        let modVal = divRes.mod;

        let wni = N6LBigFloatCalculator.getInteger(ret);
        
        // tmp = ba * wni
        tmp = new N6LBigFloatCalculator(ba);
        tmp = tmp.mul(wni, fp);

        // tmp = tmp / bb
        let divRes2 = tmp.div(bb, fp);
        tmp = divRes2.quot;
        
        // abs(tmp) 相当（符号を正にする）
        tmp.isNegative = false;

        if (zero.compareTo(a) < 0) {
            // ret = a - tmp
            let subWork = new N6LBigFloatCalculator(a);
            subWork = subWork.sub(tmp, fp);
            ret = subWork;
        } else {
            // ret = a + tmp
            let addWork = new N6LBigFloatCalculator(a);
            addWork = addWork.add(tmp, fp);
            ret = addWork;
        }
    } 
    else if (!y.success) {
        // c = b * ab
        let c = new N6LBigFloatCalculator(b);
        c = c.mul(ab, fp);

        // ret / modVal = aa / c
        let divRes = aa.div(c, fp);
        ret = divRes.quot;
        let modVal = divRes.mod;

        let wni = N6LBigFloatCalculator.getInteger(ret);
        
        // tmp = b * wni
        tmp = new N6LBigFloatCalculator(b);
        tmp = tmp.mul(wni, fp);
        tmp.isNegative = false;

        if (zero.compareTo(a) < 0) {
            let subWork = new N6LBigFloatCalculator(a);
            subWork = subWork.sub(tmp, fp);
            ret = subWork;
        } else {
            let addWork = new N6LBigFloatCalculator(a);
            addWork = addWork.add(tmp, fp);
            ret = addWork;
        }
    } 
    else {
        // 最小公倍数 (lcmInt)
        let l = N6LBigFloatCalculator.lcmInt(ab, bb, fp);
        
        if (ab.compareTo(bb) < 0) {
            aa = aa.mul(l, fp);
            ab = ab.mul(l, fp);
        } else if (bb.compareTo(ab) < 0) {
            ba = ba.mul(l, fp);
            bb = bb.mul(l, fp);
        }

        // c = aa * bb
        let c = new N6LBigFloatCalculator(aa);
        c = c.mul(bb, fp);

        // d = ab * ba
        let d = new N6LBigFloatCalculator(ab);
        d = d.mul(ba, fp);

        let divRes = c.div(d, fp);
        ret = divRes.quot;
        let modVal = divRes.mod;

        let wni = N6LBigFloatCalculator.getInteger(ret);
        
        // tmp = ba * wni
        tmp = new N6LBigFloatCalculator(ba);
        tmp = tmp.mul(wni, fp);

        let divRes2 = tmp.div(bb, fp);
        tmp = divRes2.quot;
        tmp.isNegative = false;

        if (zero.compareTo(a) < 0) {
            let subWork = new N6LBigFloatCalculator(a);
            subWork = subWork.sub(tmp, fp);
            ret = subWork;
        } else {
            let addWork = new N6LBigFloatCalculator(a);
            addWork = addWork.add(tmp, fp);
            ret = addWork;
        }
    }

    return ret;
  }

  static divInteger(numDigits, denDigits) {
    if (denDigits.length === 1 && denDigits[0] === 0)
      throw new Error("Division by zero");

    // 上位桁から扱うために逆順にする [上位桁, ..., 下位桁]
    let num = numDigits.slice().reverse(); 
    let den = denDigits.slice().reverse(); 

    let qRev = []; // quotient（上位→下位）
    let cur = [];    // 現在の被除数（上位→下位）

    for (let i = 0; i < num.length; i++) {
      // 桁を降ろす
      cur.push(num[i]);

      // ★追加: cur の先頭（上位）に不要な 0 があれば削る
      while (cur.length > 1 && cur[0] === 0) {
        cur.shift();
      }

      // cur < den → 商は 0
      // compareAbsolute は [下位→上位] を期待するため reverse する
      let curRev = cur.slice().reverse();
      if (N6LBigFloatCalculator.compareAbsolute(curRev, denDigits) < 0) {
        qRev.push(0);
        continue;
      }

      // cur >= den → 商を 0?9 で探す（最大 9 回の引き算）
      let qDigit = 0;
      let tmp = curRev; // [下位→上位]

      while (N6LBigFloatCalculator.compareAbsolute(tmp, denDigits) >= 0) {
        tmp = N6LBigFloatCalculator.subAbsolute(tmp, denDigits);
        qDigit++;
      }

      qRev.push(qDigit);

      // cur を更新（tmp は [下位→上位] → reverse して上位→下位に戻す）
      cur = tmp.reverse();

      // ★追加: 更新後の cur の先頭（上位）にある不要な 0 を削る
      while (cur.length > 1 && cur[0] === 0) {
        cur.shift();
      }
    }

    // 上位の 0 を削る
    while (qRev.length > 1 && qRev[0] === 0) {
      qRev.shift();
    }

    // quotient を [下位桁, ..., 上位桁] に戻す
    let quotient = qRev.slice().reverse();

    return { quotient };
  }

  // ============================================================
  // 小数・実数を分数（b / c）に変換する関数
  // 戻り値: { success: boolean, b: N6LBigFloatCalculator, c: N6LBigFloatCalculator }
  // ============================================================
  static toFraction(other, f = true, fp = 30) {
    let aa =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;
    let wni = N6LBigFloatCalculator.getInteger(aa);
    let wnd = N6LBigFloatCalculator.getDecimal(aa);
    
    let cd = new N6LBigFloatCalculator("10");
    let one = new N6LBigFloatCalculator("1");
    
    let b = new N6LBigFloatCalculator();
    let c = new N6LBigFloatCalculator();

    // 整数部のみ（小数部がゼロ）の場合
    if (wnd.toString() === "0" || (wnd.digits.length === 1 && wnd.digits[0] === 0)) {
      if (f) {
        b = new N6LBigFloatCalculator(wni.toString());
        b.isNegative = aa.isNegative;
        c = new N6LBigFloatCalculator("1");
      }
      return { success: false, num: b, denomi: c };
    }

    let scale = wnd.scale || 0;
    let digits = wnd.digits || [];
    
    // 10進法の純循環小数チェック (例: .111... -> 1/9, .999... -> 9/9 -> 1)
    if (0 < scale && digits.length >= scale) {
      for (let i = 1; i <= 9; i++) {
        let isAllSame = true;
        
        // 下位から上位へ並ぶ digits の小数部範囲をチェック
        for (let j = 0; j < scale; j++) {
          if (Number(digits[j]) !== i) {
            isAllSame = false;
            break;
          }
        }

        if (isAllSame) {
          // 10進法なので分母は 10 - 1 = 9
          c = new N6LBigFloatCalculator("9");
          b = new N6LBigFloatCalculator(i.toString());

          let g = N6LBigFloatCalculator.gcdInt(b, c);
          b = b.div(g, fp).quot;
          c = c.div(g, fp).quot;

          // 整数部を反映: b = b + (c * wni)
          let term = new N6LBigFloatCalculator(c.toString());
          term = term.mul(wni, fp);
          b = b.add(term, fp);

          b.isNegative = aa.isNegative;

          return { success: true, num: b, denomi: c };
        }
      }
    }

    // 有限小数としての通常の分数変換処理
    if (f) {
      let x = new N6LBigFloatCalculator("1");
      for (let i = 0; i < scale; i++) {
        x = x.mul(cd, fp);
      }

      b = new N6LBigFloatCalculator(wnd.toString());
      b = b.mul(x, fp);
      c = new N6LBigFloatCalculator(x.toString());

      let g = N6LBigFloatCalculator.gcdInt(b, c);
      
      let bbb = new N6LBigFloatCalculator(b.toString());
      let mod1 = new N6LBigFloatCalculator(bbb.toString());
      mod1 = mod1.modInt(g);

      let ccc = new N6LBigFloatCalculator(c.toString());
      let mod2 = new N6LBigFloatCalculator(ccc.toString());
      mod2 = mod2.modInt(g);

      bbb = bbb.div(g, fp).quot;
      ccc = ccc.div(g, fp).quot;

      if (mod1.toString() === "0" && mod2.toString() === "0") {
        b = bbb;
        c = ccc;
      }

      // 整数部を反映: b = b + (c * wni)
      let term = new N6LBigFloatCalculator(c.toString());
      term = term.mul(wni, fp);
      b = b.add(term, fp);

      b.isNegative = aa.isNegative;
    }

    return { success: false, num: b, denomi: c };
  }

  // --- 整数専用ヘルパー: 絶対値を整数として取得 ---
  _toIntegerDigits() {
    if (this.scale !== 0) {
      throw new Error("整数専用メソッドで小数を扱うことはできません");
    }
    // 先頭の不要な 0 を削る
    let d = this.digits.slice();
    while (d.length > 1 && d[d.length - 1] === 0) {
      d.pop();
    }
    return d;
  }

  _toIntegerLike() {
    // digits はそのまま使える
    let intDigits = this.digits.slice();

    // scale を 0 にした整数として扱う
    return {
      intDigits: intDigits,
      scale: 0                         // ★必ず 0 にする
    };
  }

  static mulBy10(digits) {
    let d = digits.slice();
    d.unshift(0);  // 下位桁側に 0 を追加 → 10倍
    return d;
  }

  // ------------------------------------------------------------
  // getInteger（整数部取得）
  // ------------------------------------------------------------
  static getInteger(other) {
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    let ret = new N6LBigFloatCalculator();
    ret.isNegative = o.isNegative;
    ret.scale = 0;

    if (o.scale <= 0) {
      // 小数部がない場合、そのままコピー
      ret.digits = [...o.digits];
    } else {
      // 下位から上位の配列において、scale分（小数部分）を切り捨て、
      // 整数部（scale以降の要素）を抽出する
      if (o.scale < o.digits.length) {
        ret.digits = o.digits.slice(o.scale);
      } else {
        ret.digits = [0]; // 整数部が0の場合
      }
    }
    
    return ret;
  }

  // ------------------------------------------------------------
  // getDecimal（小数部取得）
  // ------------------------------------------------------------
  static getDecimal(other) {
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    let ret = new N6LBigFloatCalculator();
    ret.isNegative = o.isNegative;
    ret.scale = o.scale;

    if (o.scale <= 0) {
      ret.digits = [0];
      ret.scale = 0;
    } else {
      // 下位から上位の配列において、小数部（先頭から scale 分）を抽出する
      ret.digits = o.digits.slice(0, o.scale);
    }

    return ret;
  }

  // ============================================================
  // 整数専用 mod（剰余）- 自動floor機能付き
  // digits は「末尾が最上位」方式に完全対応
  // ============================================================
  modInt(other) {
    let me = this.clone();
    let o =
      (typeof other === "string")
        ? new N6LBigFloatCalculator(other)
        : (typeof other === "number")
            ? new N6LBigFloatCalculator(String(other))
            : other;

    // 0 除算チェック
    if (o.digits.length === 1 && o.digits[0] === 0)
      throw new Error("Division by zero");

    // 除数（o）は整数である必要があるため、もし小数ならfloorして整数化する
    if (o.scale !== 0) {
      o = N6LBigFloatCalculator.getInteger(o);
    }

    // 自身（me）に小数がある場合は自動で floor（切り捨て）して整数にする
    if (me.scale !== 0) {
      me = N6LBigFloatCalculator.getInteger(me);
    }
    else {
      me = new N6LBigFloatCalculator(me.toString());
    }

    // 被除数（A）と除数（B）
    let A = me.digits.slice();   // [下位桁..., 上位桁]
    let B = o.digits.slice();

    // remainder を digits で保持
    let remainder = [0];

    // 長剰余（筆算の余り計算）
    for (let i = A.length - 1; i >= 0; i--) {

      // 桁を降ろす
      remainder.unshift(A[i]);

      // 先頭の不要 0 を削る
      while (remainder.length > 1 && remainder[remainder.length - 1] === 0) {
        remainder.pop();
      }

      // remainder >= B の間、B を引く
      while (N6LBigFloatCalculator.compareAbsolute(remainder, B) >= 0) {
        remainder = N6LBigFloatCalculator.subAbsolute(remainder, B);
      }
    }

    // remainder を me に反映
    me.digits = remainder;
    me.scale = 0;
    me.isNegative = false; // 剰余は常に非負

    return me;
  }

  // ============================================================
  // 整数専用: 最大公約数 (gcdInt)
  // ============================================================
  // BigFloat 版 gcd（整数専用）
  static gcdInt(a, b) {
    let aa = a.clone();
    let bb = b.clone();
    let zero = new N6LBigFloatCalculator("0");

    while (bb.compareTo(zero) !== 0) {
        let r = aa.mod(bb);
        aa = bb;
        bb = r;
    }
    return aa;
  }

  // ============================================================
  // 整数専用: 最小公倍数 (lcmInt)
  // ============================================================
  static lcmInt(a, b, fp = 30) {
    fp = Number(fp);
    let A = 
      (typeof a === "string")
        ? new N6LBigFloatCalculator(a)
        : (typeof a === "number")
            ? new N6LBigFloatCalculator(String(a))
            : a;
    let B = 
      (typeof b === "string")
        ? new N6LBigFloatCalculator(b)
        : (typeof b === "number")
            ? new N6LBigFloatCalculator(String(b))
            : b;

    let zero = new N6LBigFloatCalculator("0");
    if (A.toString() === "0" || B.toString() === "0") return zero;

    let g = N6LBigFloatCalculator.gcdInt(A, B);
    let t = new N6LBigFloatCalculator(A.toString());
    t = t.div(g, fp).quot.mul(B, fp);
    return t;
  }


  // --- 整数専用: 階乗 (factorialInt) ---
  static factorialInt(n, fp = 30) {
    fp = Number(fp);   // ★これが必須
    let N = 
      (typeof n === "string")
        ? new N6LBigFloatCalculator(n)
        : (typeof n === "number")
            ? new N6LBigFloatCalculator(String(n))   // ★ここが重要
            : n;
    if (N.scale !== 0) throw new Error("factorialInt は整数専用です");

    let zero = new N6LBigFloatCalculator("0");
    let one = new N6LBigFloatCalculator("1");

    // 負数は未定義とする
    if (N.isNegative) throw new Error("factorialInt は非負整数のみ定義します");

    let ret = new N6LBigFloatCalculator("1");
    let i = new N6LBigFloatCalculator("1");

    while (N6LBigFloatCalculator.compareAbsolute(i.digits, N.digits) <= 0) {
      ret = ret.mul(i, fp);
      // i++
      i = i.add(one, fp);
    }
    return ret;
  }

  // --- 定数版: PI, E, Euler（50桁） ---
  static PI50() {
    return new N6LBigFloatCalculator("3.14159265358979323846264338327950288419716939937510");
  }

  static E50() {
    return new N6LBigFloatCalculator("2.71828182845904523536028747135266249775724709369995");
  }

  static Euler50() {
    return new N6LBigFloatCalculator("0.57721566490153286060651209008240243104215933593992");
  }

  static LN1050() {
    return new N6LBigFloatCalculator("2.30258509299404568401799145468436420760110148862877");
  }

  // ------------------------------------------------------------
  // 任意精度 π（アルキメデス＆ピタゴラスの多角形近似 漸化式：上下限ガードレール版）
  // 3.141592653647406523266274689024
  // ------------------------------------------------------------
  static calcPI(fp = 30, maxSteps = 50) {
    fp = Number(fp);
    maxSteps = Number(maxSteps);

    let two = new N6LBigFloatCalculator("2");
    let one = new N6LBigFloatCalculator("1");
    let zero = new N6LBigFloatCalculator("0");

    // 初期設定：正4角形（第一象限ベース）
    let an = new N6LBigFloatCalculator("0");
    let edges = new N6LBigFloatCalculator("1"); // 使用辺数
    
    let pi = new N6LBigFloatCalculator("0");
    
    // 第一象限の限界値（π/2 ≒ 1.570796... を安全に挟む防壁）
    let up = new N6LBigFloatCalculator("1.570796327");
    let low = new N6LBigFloatCalculator("1.570796325");
    let bpi = null;

    let ffp = fp - Math.floor(fp / 10);
    let eeps = Number("1e-"+String(ffp));

    for (let step = 1; step <= maxSteps; step++) {
      // 変化検知用の前ステップ保存
      bpi = pi.clone();

      // 辺の倍加（edges *= 2）
      edges = edges.mul("2", fp);

      // an = sqrt(2 + an)
      let twoPlusAn = two.add(an, fp);
      an = N6LBigFloatCalculator.sqrt(twoPlusAn, fp);

      // sn = sqrt(2 - an) （新しい一辺）
      let twoSubAn = two.sub(an, fp);
      
      // 万が一、桁落ちや丸め誤差で 2 - an がマイナス（または不正値）になった瞬間の防御
      // （※もし負数になったらこれ以上進めないため安全にbreak）
      let sn = N6LBigFloatCalculator.sqrt(twoSubAn, fp);

      // pi = sn * edges （第一象限の累積長）
      pi = sn.mul(edges, fp);

      // 【ガードレール】計算結果が許容範囲（1.56 ? 1.58）を超えて狂い始めたら即座にストップ
      if (17 < step && (pi.compareTo(low) < 0 || 0 < pi.compareTo(up))) {
        pi = bpi; // 壊れる直前の安全な値に戻す
        break;
      }

      // 収束判定（前回値との差がイプシロン以下になったらブレイク）
      if (bpi !== null) {
        let diff = pi.sub(bpi, fp);
        if (zero.epsCmp(diff, eeps)) {
          break;
        }
      }
    }

    // 第一象限の弧長（π/2）を求めているため、最後に 2 を掛けて全体の π にする
    return pi.mul("2", fp);
  }
  // ------------------------------------------------------------
  // 任意精度 π（マクローリン展開）
  // 3.108268566698946130001699549352
  // ------------------------------------------------------------
  static calcPI2(fp = 30, mac = 100) {
    fp = Number(fp);
    mac = Number(mac);
    let sum = new N6LBigFloatCalculator("0");

    for (let i = 0; i < mac; i++) {
      let nBig = new N6LBigFloatCalculator(String(2 * i + 1));
      let term = new N6LBigFloatCalculator("1").div(nBig, fp).quot; // 毎回新規生成して割る

      let ffp = fp - Math.floor(fp / 10);
      let eeps = N6LBigFloatCalculator.epsilon(ffp);
      if(new N6LBigFloatCalculator("0").epsCmp(term, eeps)) break;

      if (i % 2 === 0) {
        sum = sum.add(term, fp);
      } else {
        sum = sum.sub(term, fp);
      }
    }

    return sum.mul("4", fp);
  }

  // ------------------------------------------------------------
  // 任意精度 e（マクローリン展開）//  2.71828182845904523536028747114e+0
  // ------------------------------------------------------------
  static calcE(fp = 30, mac = 50) {
    fp = Number(fp);
    mac = Number(mac);
    let sum = new N6LBigFloatCalculator("1");
    let term = new N6LBigFloatCalculator("1");

    for (let i = 1; i < mac; i++) {
      let iBig = new N6LBigFloatCalculator(String(i));
      term = term.div(iBig, fp).quot;

      let ffp = fp - Math.floor(fp / 10);
      let eeps = N6LBigFloatCalculator.epsilon(ffp);
      if(new N6LBigFloatCalculator("0").epsCmp(term, eeps)) break;

      sum = sum.add(term, fp);
    }

    return sum;
  }

  // -------------------------
  // 絶対値
  // -------------------------
  static abs(x) {
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))   // ★ここが重要
            : x;
    if (!X.isNegative) return X;
    let r = new N6LBigFloatCalculator(X.toString());
    r.isNegative = false;
    return r;
  }

  // -------------------------
  // epsilon（精度）
  // -------------------------
  static epsilon(fp) {
    fp = Number(fp);   // ★これが必須
    return new N6LBigFloatCalculator("1e-" + fp);
  }

  // -------------------------
  // sqrt（ニュートン法）
  // -------------------------
  static sqrt(x, fp = 30, iter = 20) {
    fp = Number(fp);   // ★これが必須
    iter = Number(iter);   // ★これが必須
    let X =
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    if (X.isNegative) throw new Error("sqrt は負数に使えません");
    if (X.digits.length === 1 && X.digits[0] === 0) {
      return new N6LBigFloatCalculator("0");
    }

    let one = new N6LBigFloatCalculator("1");

    // 初期値：x > 1 なら x/2、そうでなければ 1
    // compareTo を使って安全に比較
    let y = (X.compareTo(one) > 0)
            ? new N6LBigFloatCalculator(x.toString()).div("2", fp).quot
            : new N6LBigFloatCalculator("1");

    // ニュートン反復: y = (y + x / y) / 2
    for (let i = 0; i < iter; i++) {
      let t = new N6LBigFloatCalculator(x.toString()).div(y, fp).quot;   // x / y
      y = y.add(t).div("2", fp).quot;        // (y + x/y) / 2
    }

    return y;
  }

  // -------------------------
  // power
  // -------------------------
  static pow(base, exp, fp = 30) {
    fp = Number(fp);
    let B = 
      (typeof base === "string") ? new N6LBigFloatCalculator(base) :
      (typeof base === "number") ? new N6LBigFloatCalculator(String(base)) : base;
    let E = 
      (typeof exp === "string") ? new N6LBigFloatCalculator(exp) :
      (typeof exp === "number") ? new N6LBigFloatCalculator(String(exp)) : exp;

    let zero = new N6LBigFloatCalculator("0");
    let one = new N6LBigFloatCalculator("1");
    let two = new N6LBigFloatCalculator("2");

    // 【修正】厳密な0比較ではなく、誤差を許容した比較が望ましい場合
    if (B.compareTo(zero) === 0) return new N6LBigFloatCalculator("0");

    let isNegBase = false;
    let isNegExp = false;
    let negateResult = false;

    // 底が負の場合の処理
    let workB = new N6LBigFloatCalculator(B);
    if (workB.isNegative) {
      let bi = N6LBigFloatCalculator.getInteger(E);
      let bd = N6LBigFloatCalculator.getDecimal(E);
      if (bd.compareTo(zero) < 0) {
        throw new Error("負の数の小数乗（複素数域）は未対応です");
      }
      // 奇数乗なら結果をマイナスにする
      if (bi.mod(two).compareTo(zero) !== 0) {
        negateResult = !negateResult;
      }
      workB.isNegative = !workB.isNegative;
    }

    // 指数が負の場合の処理
    let workE = new N6LBigFloatCalculator(E);
    if (workE.isNegative) {
      workE.isNegative = !workE.isNegative;
      isNegExp = true;
    }

    let ret;
    let intE = N6LBigFloatCalculator.getInteger(workE);
    let decE = N6LBigFloatCalculator.getDecimal(workE);

    // 指数が整数のみの場合
    if (decE.compareTo(zero) === 0) {
      ret = N6LBigFloatCalculator._integerPower(workB, intE, fp);
    } else {
      // 指数が小数の場合: a^b = a^int * exp(dec * ln(a))
      let lnA = N6LBigFloatCalculator.log(workB, fp);
      let d = decE.mul(lnA, fp);
      let expPart = N6LBigFloatCalculator.exp(d, fp);
      let intPart = N6LBigFloatCalculator._integerPower(workB, intE, fp);

      ret = expPart.mul(intPart, fp);
    }

    // 負数指数の場合は逆数に
    if (isNegExp) {
      ret = one.div(ret, fp).quot;
    }

    // 負底の奇数乗の場合は符号反転
    if (negateResult) {
      ret.isNegative = !ret.isNegative;
    }

    return ret;
  }

  // 内部用の整数べき乗ヘルパー（繰り返し二乗法）
  static _integerPower(base, exp, fp) {
    let n = parseInt(exp.toString(), 10);
    if (n === 0) return new N6LBigFloatCalculator("1");

    let r = new N6LBigFloatCalculator("1");
    let b = new N6LBigFloatCalculator(base);
    let absN = Math.abs(n);

    let currentAbs = absN;
    while (currentAbs > 0) {
      if (currentAbs % 2 === 1) {
        r = r.mul(b, fp);
      }
      b = b.mul(b, fp);
      currentAbs = Math.floor(currentAbs / 2);
    }

    if (n < 0) {
      let one = new N6LBigFloatCalculator("1");
      return one.div(r, fp).quot;
    }

    return r;
  }

  // -------------------------
  // nthroot（ニュートン法）- epsCmp対応版
  // -------------------------
  static nthroot(base, n, fp = 30) {
    fp = Number(fp);
    let B = 
      (typeof base === "string") ? new N6LBigFloatCalculator(base) :
      (typeof base === "number") ? new N6LBigFloatCalculator(String(base)) : base;
    let N = 
      (typeof n === "string") ? new N6LBigFloatCalculator(n) :
      (typeof n === "number") ? new N6LBigFloatCalculator(String(n)) : n;

    let zero = new N6LBigFloatCalculator("0");
    let one = new N6LBigFloatCalculator("1");
    
    // 許容誤差（イプシロン）の設定
    let eps = typeof N6LBigFloatCalculator.EPSILON === "function" 
      ? N6LBigFloatCalculator.EPSILON(fp) 
      : new N6LBigFloatCalculator("1e-" + fp);

    if (B.compareTo(zero) <= 0 || N.compareTo(zero) < 0) {
      throw new Error("Domain error: 負の数または0の累乗根");
    }
    if (N.compareTo(zero) === 0) {
      return new N6LBigFloatCalculator("1");
    }

    let N2 = new N6LBigFloatCalculator(N.toString())

    let c = N2.sub(one, fp); // n - 1
    
    // 初期値の設定
    let y = (B.compareTo(one) > 0) ? new N6LBigFloatCalculator(B.toString()) : new N6LBigFloatCalculator("1");
    let x = new N6LBigFloatCalculator();

    // ニュートン法による収束ループ
    let maxIter = 100; 
    while (maxIter-- > 0) {
      x = new N6LBigFloatCalculator(y);

      let c2 = new N6LBigFloatCalculator(c.toString())
      // d = (n - 1) * x
      let d = c2.mul(x, fp);
      
      // epsCmp を使って「実質的にゼロ」とみなせるかを判定
      if (x.epsCmp(zero, eps)) break;

      // f = x^(n - 1)
      let f = N6LBigFloatCalculator.pow(x, c, fp);
      if (f.epsCmp(zero, eps)) break;

      let B2 = new N6LBigFloatCalculator(B.toString())
      // d = (n - 1) * x
      // e = b / f
      let e = B2.div(f, fp).quot;

      let d2 = new N6LBigFloatCalculator(d.toString())
      // y = (d + e) / n
      let sum = d2.add(e, fp);
      let sum2 = new N6LBigFloatCalculator(sum.toString())
      y = sum2.div(N, fp).quot;

      // 収束判定：y と x の差が eps 以下、または大小が逆転・安定したら抜ける
      if (y.epsCmp(x, eps) || y.compareTo(x) >= 0) {
        break;
      }
    }

    return y;
  }

  // BigFloat 版 Lanczos Gamma
  static gammaBF(z, fp = 50) {
    let PI = new N6LBigFloatCalculator("3.141592653589793238462643383279502884");
    let ONE = new N6LBigFloatCalculator("1");
    let HALF = new N6LBigFloatCalculator("0.5");

    // Lanczos 係数（BigFloat 化）
    let p = [
        "0.99999999999980993",
        "676.5203681218851",
        "-1259.1392167224028",
        "771.32342877765313",
        "-176.61502916214059",
        "12.507343278693805",
        "-0.13857109526572012",
        "9.9843695780195716e-6",
        "1.5056327351493116e-7"
    ].map(v => new N6LBigFloatCalculator(v));

    let Z = new N6LBigFloatCalculator(z.toString());

    // 反射公式
    if (Z.compareTo(HALF) < 0) {
        let sinTerm = N6LBigFloatCalculator.sin(
            PI.mul(Z, fp),
            fp
        );
        let gammaTerm = N6LBigFloatCalculator.gammaBF(ONE.sub(Z), fp);
        return PI.div(sinTerm.mul(gammaTerm, fp), fp).quot;
    }

    // Lanczos 本体
    Z = Z.sub(ONE, fp);  // z -= 1

    let x = p[0].clone();
    for (let i = 1; i < p.length; i++) {
        let denom = Z.add(new N6LBigFloatCalculator(String(i)), fp);
        x = x.add(p[i].div(denom, fp).quot, fp);
    }

    let t = Z.add(new N6LBigFloatCalculator(String(p.length - 1.5)), fp);

    let sqrt2pi = N6LBigFloatCalculator.sqrt(
        PI.mul(new N6LBigFloatCalculator("2"), fp),
        fp
    );

    let powTerm = N6LBigFloatCalculator.pow(
        t,
        Z.add(HALF, fp),
        fp
    );

    let expTerm = N6LBigFloatCalculator.exp(
        t.mul(new N6LBigFloatCalculator("-1"), fp),
        fp
    );

    return sqrt2pi.mul(powTerm, fp).mul(expTerm, fp).mul(x, fp);
  }

  // BigFloat 版 実数階乗
  static realFactorialBF(x, fp = 50) {
    let X = new N6LBigFloatCalculator(x.toString());
    X = X.add(new N6LBigFloatCalculator("1"), fp);
    return N6LBigFloatCalculator.gammaBF(X, fp);
  }

  // ============================================================
  // 2. ベルヌーイ数（必要最小限：B2, B4, B6, B8, B10）
  // ============================================================
  static bernoulliSmall(k) {
    let table = {
      2:  new N6LBigFloatCalculator("1/6"),
      4:  new N6LBigFloatCalculator("-1/30"),
      6:  new N6LBigFloatCalculator("1/42"),
      8:  new N6LBigFloatCalculator("-1/30"),
      10: new N6LBigFloatCalculator("5/66")
    };
    return table[k] || new N6LBigFloatCalculator("0");
  }

  // -------------------------
  // ベルヌーイ数計算 (Bernoulli)
  // -------------------------

  // BigFloat 版 nCr
  static nCrBF(n, r) {
    let zero = new N6LBigFloatCalculator("0");
    let one  = new N6LBigFloatCalculator("1");

    if (r.compareTo(zero) < 0 || r.compareTo(n) > 0) return zero.clone();
    if (r.compareTo(zero) === 0 || r.compareTo(n) === 0) return one.clone();

    let rr = r.clone();
    let nn = n.clone();

    // r > n/2 の場合 r = n - r
    let half = nn.div(new N6LBigFloatCalculator("2")).quot;
    if (rr.compareTo(half) > 0) rr = nn.sub(rr);

    let res = one.clone();
    let i = one.clone();

    while (i.compareTo(rr) <= 0) {
        let num = nn.sub(i).add(one);
        res = res.mul(num).div(i).quot;
        i = i.add(one);
    }
    return res;
  }

  // BigFloat 版 Bernoulli（完全移植）
  static bernoulliBF(n, fp = 30) {
    let B = new Array(n + 1);

    B[0] = {
        num: new N6LBigFloatCalculator("1"),
        den: new N6LBigFloatCalculator("1")
    };

    for (let m = 1; m <= n; m++) {
        let sumNum = new N6LBigFloatCalculator("0");
        let sumDen = new N6LBigFloatCalculator("1");

        for (let k = 0; k < m; k++) {
            let coef = N6LBigFloatCalculator.nCrBF(
                new N6LBigFloatCalculator(String(m + 1)),
                new N6LBigFloatCalculator(String(k))
            );

            let termNum = coef.mul(B[k].num);
            let termDen = B[k].den.clone();

            // sum += termNum / termDen
            sumNum = sumNum.mul(termDen).add(termNum.mul(sumDen));
            sumDen = sumDen.mul(termDen);

            // 約分
            let d = N6LBigFloatCalculator.gcdInt(sumNum, sumDen);
            sumNum = sumNum.div(d).quot;
            sumDen = sumDen.div(d).quot;
        }

        // B[m] = -sum / (m+1)
        let mPlus1 = new N6LBigFloatCalculator(String(m + 1));
        let bNum = sumNum.mul(new N6LBigFloatCalculator("-1"));
        let bDen = sumDen.mul(mPlus1);

        let d = N6LBigFloatCalculator.gcdInt(bNum, bDen);
        B[m] = {
            num: bNum.div(d).quot,
            den: bDen.div(d).quot
        };
    }

    return B[n];
  }

  // ============================================================
  // 4. 素数判定（簡易版） - fp引数追加の修正版
  // ============================================================
  static isPrimeInt(n, fp = 30) {
    fp = Number(fp);
    let N = 
      (typeof n === "string")
        ? new N6LBigFloatCalculator(n)
        : (typeof n === "number")
            ? new N6LBigFloatCalculator(String(n))
            : n;

    if (N.scale !== 0) return false;
    if (N.isNegative) return false;

    if (N.toString() === "0" || N.toString() === "1") return false;
    if (N.toString() === "2") return true;

    let two = new N6LBigFloatCalculator("2");
    let mod2 = new N6LBigFloatCalculator(N.toString());
    mod2 = mod2.modInt(two);
    if (mod2.toString() === "0") return false;

    let sqrtN = N6LBigFloatCalculator.sqrt(N, fp);
    let i = new N6LBigFloatCalculator("3");

    while (N6LBigFloatCalculator.compareAbsolute(i.digits, sqrtN.digits) <= 0) {
      let r = new N6LBigFloatCalculator(N.toString());
      r = r.modInt(i);
      if (r.toString() === "0") return false;
      i = i.add(two, fp);
    }
    return true;
  }

  // ============================================================
  // 5. 素因数分解（簡易版） - fp引数追加の修正版
  // ============================================================
  static factorInt(n, fp = 30) {
    fp = Number(fp);
    let N = 
      (typeof n === "string")
        ? new N6LBigFloatCalculator(n)
        : (typeof n === "number")
            ? new N6LBigFloatCalculator(String(n))
            : n;

    if (N.scale !== 0) throw new Error("factorInt は整数専用です");

    let factors = [];
    let x = new N6LBigFloatCalculator(N.toString());
    let two = new N6LBigFloatCalculator("2");

    while (true) {
      let r = new N6LBigFloatCalculator(x.toString());
      r = r.modInt(two);
      if (r.toString() !== "0") break;
      factors.push("2");
      x = x.div(two, fp).quot;
    }

    let i = new N6LBigFloatCalculator("3");
    while (N6LBigFloatCalculator.compareAbsolute(i.digits, x.digits) <= 0) {
      let r = new N6LBigFloatCalculator(x.toString());
      r = r.modInt(i);
      if (r.toString() === "0") {
        factors.push(i.toString());
        x = x.div(i, fp).quot;
      } else {
        i = i.add(two, fp);
      }
    }

    if (x.toString() !== "1") factors.push(x.toString());
    return factors;
  }

  // ============================================================
  // 6. 二項係数 nCk
  // ============================================================
  static binomial(n, k, fp = 30) {
    fp = Number(fp);
    let N = 
      (typeof n === "string")
        ? new N6LBigFloatCalculator(n)
        : (typeof n === "number")
            ? new N6LBigFloatCalculator(String(n))
            : n;
    let K = 
      (typeof k === "string")
        ? new N6LBigFloatCalculator(k)
        : (typeof k === "number")
            ? new N6LBigFloatCalculator(String(k))
            : k;

    let fN = N6LBigFloatCalculator.factorialReal(N, fp);
    let fK = N6LBigFloatCalculator.factorialReal(K, fp);

    let NK = new N6LBigFloatCalculator(N.toString());
    NK = NK.sub(K, fp);
    let fNK = N6LBigFloatCalculator.factorialReal(NK, fp);

    return fN.div(fK.mul(fNK, fp), fp).quot;
  }

  // ============================================================
  // exp（マクローリン展開・安全版）
  // ============================================================
  static exp(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    // 負数の場合は e^(-x) = 1 / e^x として計算する（負数を直接展開すると桁落ちするため）
    let isNeg = X.isNegative;
    let absX = new N6LBigFloatCalculator(X.toString());
    absX.isNegative = false;

    let sum = new N6LBigFloatCalculator("1");
    let term = new N6LBigFloatCalculator("1");

    for (let k = 1; k <= mac; k++) {
      // term = term * absX / k
      term = term.mul(absX, fp);
      let kBig = new N6LBigFloatCalculator(String(k));
      term = term.div(kBig, fp).quot;

      let ffp = fp - Math.floor(fp / 10);
      let eeps = N6LBigFloatCalculator.epsilon(ffp);
      if(new N6LBigFloatCalculator("0").epsCmp(term, eeps)) break;

      sum = sum.add(term, fp);
    }

    if (isNeg) {
      let one = new N6LBigFloatCalculator("1");
      return one.div(sum, fp).quot;
    }
    return sum;
  }

  // ============================================================
  // log (自然対数・科学用表記分解による全区間高精度・高速版)
  // ============================================================
  static log(x, fp = 30, mac = 200) {
    fp = Number(fp);
    mac = Number(mac);
    mac = Math.max(mac, 200);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let zero = new N6LBigFloatCalculator("0");
    let one = new N6LBigFloatCalculator("1");
    let two = new N6LBigFloatCalculator("2");

    // 1 の判定
    if (X.compareTo(one) === 0 || (X.digits.length === 1 && X.digits[0] === 0 && !X.isNegative)) {
      return new N6LBigFloatCalculator("0");
    }
    if (X.isNegative || (X.digits.length === 1 && X.digits[0] === 0)) {
      throw new Error("log の定義域外 (0 以下は指定できません)");
    }

    // ------------------------------------------------------------
    // 巨大な数・小さな数対策：科学用表記に一度バラして ln(A) + B * ln(10) に変換する
    // ------------------------------------------------------------
    let sciStr = X.toStringScientific(); // 例: "1.23456e+12"
    // パース: "AAAeBBB" から仮数部と指数部を抽出
    let parts = sciStr.split('e');
    let mantissaStr = parts[0];
    let expVal = parseInt(parts[1], 10); // 指数 B

    // もし指数 B が 0 以外、または仮数部が 1 に近い安全圏 ($0.1 < X < 10$) から外れている場合は分解公式を使う
    if (expVal !== 0) {
      // 1. 1?10未満の仮数部だけの log を計算 (これはすぐ収束する)
      let logMantissa = N6LBigFloatCalculator.log(mantissaStr, fp, mac);

      // 2. B * ln(10) を計算
      // ln(10) の高精度定数
      let ln10 = N6LBigFloatCalculator.LN1050();
      let expTerm = ln10.mul(new N6LBigFloatCalculator(String(expVal)), fp);

      // 3. 足し合わせる: log(A) + B * ln(10)
      return logMantissa.add(expTerm, fp);
    }

    // --- 以下、1?10付近の通常計算（逆双曲線関数ベース） ---
    // num = x - 1
    let num = new N6LBigFloatCalculator(X.toString());
    num = num.sub(one, fp);

    // den = x + 1
    let den = new N6LBigFloatCalculator(X.toString());
    den = den.add(one, fp);

    // z = (x - 1) / (x + 1)
    let z = num.div(den, fp).quot;

    let sum = new N6LBigFloatCalculator(z.toString());
    let term = new N6LBigFloatCalculator(z.toString());

    // z の 2乗
    let z2 = new N6LBigFloatCalculator(z.toString()).mul(z, fp);

    let ffp = fp - Math.floor(fp / 10);
    let eeps = N6LBigFloatCalculator.epsilon(ffp);

    for (let k = 1; k < mac; k++) {
      term = term.mul(z2, fp);
      let denomVal = 2 * k + 1;
      let denom = new N6LBigFloatCalculator(String(denomVal));

      let t = new N6LBigFloatCalculator(term.toString());
      t = t.div(denom, fp).quot;

      if (zero.epsCmp(t, eeps)) break;

      sum = sum.add(t, fp);
    }

    // 最後に 2 を掛ける (ln(x) = 2 * sum)
    sum = sum.mul(two, fp);

    return sum;
  }

  // ============================================================
  // logBase
  // ============================================================
  static logBase(x, y, fp = 30, mac = 50) {
    fp = Number(fp);
    mac = Number(mac);
    let ten = new N6LBigFloatCalculator("10");
    if(ten.compareTo(y) === 0) {
      let ln = N6LBigFloatCalculator.LN1050();
      return N6LBigFloatCalculator.log(x, fp, mac).div(ln, fp).quot;
    }
    return N6LBigFloatCalculator.log(x, fp, mac).div(N6LBigFloatCalculator.log(y, fp, mac), fp).quot;
  }

  static LN1050() {
    return new N6LBigFloatCalculator("2.30258509299404568401799145468436420760110148862877");
  }  // ============================================================
  // logBase
  // ============================================================
  static logBase(x, y, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let ten = new N6LBigFloatCalculator("10");
    if(ten.compareTo(y) === 0) {
      let ln = N6LBigFloatCalculator.LN1050();
      return N6LBigFloatCalculator.log(x, fp, mac).div(ln, fp).quot;
    }
    return N6LBigFloatCalculator.log(x, fp, mac).div(N6LBigFloatCalculator.log(y, fp, mac), fp).quot;
  }

  // ============================================================
  // sin (マクローリン展開・漸化式版)
  // ============================================================
  static sin(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let pi = N6LBigFloatCalculator.PI50();
    let piVal = new N6LBigFloatCalculator(pi.toString());
    let negPi = new N6LBigFloatCalculator("-1").mul(piVal, fp);
    let halfPi = new N6LBigFloatCalculator(pi.toString()).div(new N6LBigFloatCalculator("2"), fp).quot;
    let neghalfPi = new N6LBigFloatCalculator(pi.toString()).div(new N6LBigFloatCalculator("-2"), fp).quot;
    let threeHalfPi = new N6LBigFloatCalculator("3").mul(halfPi, fp);
    let negthreeHalfPi = new N6LBigFloatCalculator("-3").mul(halfPi, fp);
    let twoPi = new N6LBigFloatCalculator("2").mul(piVal, fp);
    let zero = new N6LBigFloatCalculator("0");


    let xx = new N6LBigFloatCalculator(X.toString());
    
    // div().mod を使って 2π で割った余り（周期削減）を一発で取得
    // xx を twoPi で割ると、商 quot と 余り mod が返る
    let divResult = xx.div(twoPi, fp);
    xx = divResult.mod; // 余りが新しい xx になる（通常は [0, 2π) の範囲）

    let negate = xx.isNegative;

    // 1. 範囲の判定（divResult.mod が [0, 2π) の範囲で返ってくる場合の対称性マッピング）
    // ※もし divResult.mod が負の余りを含む仕様であればそれに合わせますが、
    //   一般的に正の余りまたは対称な余りになるため、ここでは直感的な比較を適用します。
    if (xx.compareTo(pi) >= 0) {
      xx = xx.sub(piVal, fp);
      negate = !negate;
    }
    else if (xx.compareTo(negPi) < 0) {
      xx = xx.add(piVal, fp);
    }
    // 2. [-π/2, π/2] の範囲に収めるための象限調整
    else if (xx.compareTo(threeHalfPi) >= 0) {
      xx = xx.sub(twoPi, fp);
    } 
    else if (xx.compareTo(negthreeHalfPi) < 0) {
      xx = xx.add(twoPi, fp);
    } 
    else if (xx.compareTo(halfPi) >= 0) {
      xx = xx.sub(piVal, fp);
      negate = !negate;
    }
    else if (xx.compareTo(neghalfPi) < 0) {
      xx = xx.add(piVal, fp);
    } 
    else if (xx.compareTo(zero) < 0) {
      if (xx.compareTo(neghalfPi) >= 0) {
        negate = !negate;
      }
    } 

    // ※ この時点で xx は確実に [-π/2, π/2] の範囲に収まります。

    // 第1項: sum = x, term = x
    let sum = new N6LBigFloatCalculator(xx.toString());
    let term = new N6LBigFloatCalculator(xx.toString());

    // xx の 2乗
    let xx2 = new N6LBigFloatCalculator(xx.toString()).mul(xx, fp);

    let ffp = fp - Math.floor(fp / 10);
    let eeps = N6LBigFloatCalculator.epsilon(ffp);

    for (let k = 1; k < mac; k++) {
      let d1 = new N6LBigFloatCalculator(String(2 * k));
      let d2 = new N6LBigFloatCalculator(String(2 * k + 1));
      let denom = d1.mul(d2, fp);

      term = term.mul(xx2, fp);
      term = term.div(denom, fp).quot;

      if (k % 2 === 1) {
        sum = sum.sub(term, fp);
      } else {
        sum = sum.add(term, fp);
      }

      if (zero.epsCmp(term, eeps)) break;
    }

    // 対称性による符号反転の適用
    if (negate) {
      sum.isNegative = !sum.isNegative;
    }

    return sum;
  }

  // ============================================================
  // cos (公式 cos(x) = sin(π/2 - x) を利用した簡潔版)
  // ============================================================
  static cos(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let pi = N6LBigFloatCalculator.PI50();
    let piVal = new N6LBigFloatCalculator(pi.toString());
    let halfPi = new N6LBigFloatCalculator(pi.toString()).div(new N6LBigFloatCalculator("2"), fp).quot;
    let negthreeHalfPi = new N6LBigFloatCalculator("-3").mul(halfPi, fp);
    let twoPi = new N6LBigFloatCalculator("2").mul(piVal, fp);

    let xx = new N6LBigFloatCalculator(X.toString());
    let divResult = xx.div(twoPi, fp);
    xx = divResult.mod; // 余りが新しい xx になる（通常は [0, 2π]) の範囲）

    // π/2 - x を計算
    let target = new N6LBigFloatCalculator(halfPi.toString());
    target = target.sub(X, fp);

    // 完成した sin をそのまま利用
    return N6LBigFloatCalculator.sin(target, fp, mac);
  }

  // ============================================================
  // tan = sin / cos
  // ============================================================
  static tan(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let s = N6LBigFloatCalculator.sin(x, fp, mac);
    let c = N6LBigFloatCalculator.cos(x, fp, mac);
    // 分母 (cos) がほぼ 0 かどうかをチェック
    let zero = new N6LBigFloatCalculator("0");
    let ffp = fp - Math.floor(fp / 10);
    let eeps = N6LBigFloatCalculator.epsilon(ffp);
    if (zero.epsCmp(c, eeps)) {
      // ゼロ除算（極）に非常に近い場合の処理
      // 例: 無限大を表す値を返す、あるいはエラーとするなど
      throw new Error("Division by zero in tan(x): x is too close to an asymptote (odd multiples of π/2).");
    }
    let ret = s.div(c, fp).quot;
    //if(x.isNegative) ret.isNegative = !ret.isNegative;
    return ret;
  }

  // ============================================================
  // atan (マクローリン展開・compareTo 活用全区間対応版)
  // ============================================================
  static atan(x, fp = 30, mac = 500) {
    fp = Number(fp);
    mac = Number(mac);
    mac = Math.max(mac, 500);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let zero = new N6LBigFloatCalculator("0");
    let one = new N6LBigFloatCalculator("1");
    let negOne = new N6LBigFloatCalculator("-1");

    if (X.digits.length === 1 && X.digits[0] === 0) {
      return new N6LBigFloatCalculator("0");
    }

    // |x| > 1 の判定を compareTo(1) で行う
    // X の絶対値を取るための一時オブジェクト
    let absX = new N6LBigFloatCalculator(X.toString());
    absX.isNegative = false;

    if (absX.compareTo(one) > 0) {
      // atan(x) = sign(x) * π/2 - atan(1/x)
      let invX = one.div(X, fp).quot;
      let subAtan = N6LBigFloatCalculator.atan(invX, fp, mac);
      let halfPi = N6LBigFloatCalculator.PI50().div("2", fp).quot;

      let res = new N6LBigFloatCalculator(halfPi.toString());
      res = res.sub(subAtan, fp);

      if (X.isNegative) {
        res = res.sub(N6LBigFloatCalculator.PI50());
      }

      return res;
    }

    let xx2 = new N6LBigFloatCalculator(X.toString()).mul(X, fp);

    // 第1項: sum = x, term = x
    let sum = new N6LBigFloatCalculator(X.toString());
    let term = new N6LBigFloatCalculator(X.toString());

    let ffp = fp - Math.floor(fp / 10);
    let eeps = N6LBigFloatCalculator.epsilon(ffp);

    for (let k = 1; k < mac; k++) {
      term = term.mul(xx2, fp);

      let denomVal = 2 * k + 1;
      let denom = new N6LBigFloatCalculator(String(denomVal));

      let currentTerm = new N6LBigFloatCalculator(term.toString());
      currentTerm = currentTerm.div(denom, fp).quot;

      if (zero.epsCmp(currentTerm, eeps)) break;

      if (k % 2 === 1) {
        sum = sum.sub(currentTerm, fp);
      } else {
        sum = sum.add(currentTerm, fp);
      }
    }
    return sum;
  }

  // ============================================================
  // asin
  // ============================================================
  static asin(x, fp = 30, mac = 500) {
    fp = Number(fp);
    mac = Number(mac);
    mac = Math.max(mac, 500);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;
    let one = new N6LBigFloatCalculator("1");

    // |x| > 1 の定義域チェックを compareTo(1) で行う
    let absX = new N6LBigFloatCalculator(X.toString());
    absX.isNegative = false;
    if (absX.compareTo(one) === 0) {
        // asin(±1) = ±π/2
        // acos(±1) = 0 or π
        let halfpi = N6LBigFloatCalculator.PI50().mul("0.5", fp);
        halfpi.isNegative = X.isNegative;
        return halfpi;
    }
    if (absX.compareTo(one) > 0) {
      throw new Error("asin の定義域外 (-1 から 1 の間で指定してください)");
    }

    let t = X.mul(X, fp);
    let u = new N6LBigFloatCalculator("1").sub(t, fp);
    let s = N6LBigFloatCalculator.sqrt(u);

    let divRes = X.div(s, fp).quot;
    return N6LBigFloatCalculator.atan(divRes, fp, mac);
  }

  // ============================================================
  // acos
  // ============================================================
  static acos(x, fp = 30, mac = 500) {
    fp = Number(fp);
    mac = Number(mac);
    mac = Math.max(mac, 500);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;
    let one = new N6LBigFloatCalculator("1");
    let negone = new N6LBigFloatCalculator("-1");

    if (X.compareTo(one) === 0) {
      return new N6LBigFloatCalculator("0");
    }
    if (X.compareTo(negone) === 0) {
      return N6LBigFloatCalculator.PI50();
    }
    // |x| > 1 の定義域チェックを compareTo(1) で行う
    let absX = new N6LBigFloatCalculator(X.toString());
    absX.isNegative = false;
    if (absX.compareTo(one) === 0) {
        // asin(±1) = ±π/2
        // acos(±1) = 0 or π
        if(X.isNegative) return new N6LBigFloatCalculator("0");
        else return N6LBigFloatCalculator.PI50();
    }
    if (absX.compareTo(one) > 0) {
      throw new Error("acos の定義域外 (-1 から 1 の間で指定してください)");
    }

    let pi = N6LBigFloatCalculator.PI50();
    let halfPi = new N6LBigFloatCalculator(pi).div("2", fp).quot;
    let asinVal = N6LBigFloatCalculator.asin(X, fp, mac);

    let res = new N6LBigFloatCalculator(halfPi.toString());
    res = res.sub(asinVal, fp);
    return res;
  }

  // ============================================================
  // atan2
  // ============================================================
  static atan2(y, x, fp = 30, mac = 500) {
    fp = Number(fp);
    mac = Number(mac);
    mac = Math.max(mac, 500);
    let Y = 
      (typeof y === "string")
        ? new N6LBigFloatCalculator(y)
        : (typeof y === "number")
            ? new N6LBigFloatCalculator(String(y))
            : y;
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let zero = new N6LBigFloatCalculator("0");
    let pi = N6LBigFloatCalculator.PI50();
    let halfPi = new N6LBigFloatCalculator(pi).div("2", fp).quot;

    let isZeroX = X.digits.length === 1 && X.digits[0] === 0;
    let isZeroY = Y.digits.length === 1 && Y.digits[0] === 0;

    if (isZeroX) {
      if (isZeroY) return new N6LBigFloatCalculator("0");
      if (Y.isNegative) {
        let res = new N6LBigFloatCalculator(halfPi.toString());
        res.isNegative = !res.isNegative;
        return res;
      } else {
        return new N6LBigFloatCalculator(halfPi.toString());
      }
    }

    let divRes = Y.div(X, fp).quot;
    let a = N6LBigFloatCalculator.atan(divRes, fp, mac);

    if (X.isNegative) {
      if (Y.isNegative) {
        return a.sub(pi, fp);
      } else {
        return a.add(pi, fp);
      }
    }
    return a;
  }

// ============================================================
  // sinh
  // ============================================================
  static sinh(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let e1 = N6LBigFloatCalculator.exp(X, fp, mac);
    
    let negX = new N6LBigFloatCalculator(X.toString());
    negX.isNegative = !negX.isNegative;
    if (negX.digits.length === 1 && negX.digits[0] === 0) {
      negX.isNegative = false;
    }

    let e2 = N6LBigFloatCalculator.exp(negX, fp, mac);
    let ret = e1.sub(e2, fp).div("2", fp).quot;
//    if(X.isNegative) ret.isNegative = !ret.isNegative;
    return ret;
  }

  // ============================================================
  // cosh
  // ============================================================
  static cosh(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let e1 = N6LBigFloatCalculator.exp(X, fp, mac);
    
    let negX = new N6LBigFloatCalculator(X.toString());
    negX.isNegative = !negX.isNegative;
    if (negX.digits.length === 1 && negX.digits[0] === 0) {
      negX.isNegative = false;
    }

    let e2 = N6LBigFloatCalculator.exp(negX, fp, mac);
    return e1.add(e2, fp).div("2", fp).quot;
  }

  // ============================================================
  // tanh = sinh / cosh
  // ============================================================
  static tanh(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;
    let s = N6LBigFloatCalculator.sinh(X, fp, mac);
    let c = N6LBigFloatCalculator.cosh(X, fp, mac);
    let ret = s.div(c, fp).quot;
    return ret;
  }

  // ============================================================
  // asinh
  // ============================================================
  static asinh(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;
    let one = new N6LBigFloatCalculator("1");
    let t = N6LBigFloatCalculator.pow(X, 2).add(one, fp);
    let s = N6LBigFloatCalculator.sqrt(t);
    let ret = N6LBigFloatCalculator.log(X.add(s, fp), fp, mac);
    ret.isNegative = X.isNegative;
    return ret;
  }

  // ============================================================
  // acosh
  // ============================================================
  static acosh(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;
    let one = new N6LBigFloatCalculator("1");

    // compareTo(one) を使って x >= 1 かを正確にチェック
    if (X.compareTo(one) < 0) {
      throw new Error("acosh の定義域外 (x >= 1 が必要です)");
    }

    let t = N6LBigFloatCalculator.pow(X, 2).sub(one, fp);
    let s = N6LBigFloatCalculator.sqrt(t);

    return N6LBigFloatCalculator.log(X.add(s, fp), fp, mac);
  }

  // ============================================================
  // atanh
  // ============================================================
  static atanh(x, fp = 30, mac = 30) {
    fp = Number(fp);
    mac = Number(mac);
    let X = 
      (typeof x === "string")
        ? new N6LBigFloatCalculator(x)
        : (typeof x === "number")
            ? new N6LBigFloatCalculator(String(x))
            : x;

    let one = new N6LBigFloatCalculator("1");
    // compareTo(one) を使って |x| >= 1 をチェック
    let absX = new N6LBigFloatCalculator(X.toString());
    absX.isNegative = false;
    if (absX.compareTo(one) >= 0) {
      throw new Error("atanh の定義域外 (-1 < x < 1 が必要です)");
    }

    let a = new N6LBigFloatCalculator("1").add(X, fp);
    let b = new N6LBigFloatCalculator("1").sub(X, fp);

    return N6LBigFloatCalculator.log(a.div(b, fp).quot, fp, mac).div("2", fp).quot;
  }

  // cosec (csc)
  static csc(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let s = N6LBigFloatCalculator.sin(X, fp, mac);
    return one.div(s, fp).quot;
  }

  // sec
  static sec(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let c = N6LBigFloatCalculator.cos(X, fp, mac);
    return one.div(c, fp).quot;
  }

  // cot
  static cot(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let t = N6LBigFloatCalculator.tan(X, fp, mac);
    return one.div(t, fp).quot;
  }

  // acosec (acsc) -> asin(1 / x)
  static acsc(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let a = one.div(X, fp).quot;
    return N6LBigFloatCalculator.asin(a, fp, mac);
  }

  // asec -> acos(1 / x)
  static asec(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let a = one.div(X, fp).quot;
    return N6LBigFloatCalculator.acos(a, fp, mac);
  }

  // acot -> atan(1 / x)
  static acot(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let a = one.div(X, fp).quot;
    return N6LBigFloatCalculator.atan(a, fp, mac);
  }

  // csch
  static csch(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let s = N6LBigFloatCalculator.sinh(X, fp, mac);
    return one.div(s, fp).quot;
  }

  // sech
  static sech(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let c = N6LBigFloatCalculator.cosh(X, fp, mac);
    return one.div(c, fp).quot;
  }

  // coth
  static coth(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let t = N6LBigFloatCalculator.tanh(X, fp, mac);
    return one.div(t, fp).quot;
  }

  // acsch -> asinh(1 / x)
  static acsch(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let a = one.div(X, fp).quot;
    return N6LBigFloatCalculator.asinh(a, fp, mac);
  }

  // asech -> acosh(1 / x)
  static asech(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let a = one.div(X, fp).quot;
    return N6LBigFloatCalculator.acosh(a, fp, mac);
  }

  // acoth -> atanh(1 / x)
  static acoth(x, fp = 30, mac = 30) {
    let X = (typeof x === "string") ? new N6LBigFloatCalculator(x) : (typeof x === "number") ? new N6LBigFloatCalculator(String(x)) : x;
    let one = new N6LBigFloatCalculator("1");
    let a = one.div(X, fp).quot;
    return N6LBigFloatCalculator.atanh(a, fp, mac);
  }


}


/*
//################################################################################################################################################
// --- 動作確認 ---
let f1 = new N6LBigFloatCalculator("123.456e+10");
let f2 = new N6LBigFloatCalculator("0.000789e-5");

console.log("f1 (科学用):", f1.toStringScientific());
console.log("f2 (科学用):", f2.toStringScientific());

let fAdd = new N6LBigFloatCalculator(f1.toString());
fAdd = fAdd.add(f2);
console.log("f1 + f2 (通常):", fAdd.toString());
console.log("f1 + f2 (科学用):", fAdd.toStringScientific());

let fSub = new N6LBigFloatCalculator(fAdd.toString());
fSub = fSub.sub(f2);
console.log("f1 - f2 (通常):", fSub.toString());
console.log("f1 - f2 (科学用):", fSub.toStringScientific());


// 割り算 (商を求める)
let fDiv = new N6LBigFloatCalculator(f1.toString());
fDiv = fDiv.div(f2).quot;
console.log("f1 ÷ f2 (通常):", fDiv.toString());
console.log("f1 ÷ f2 (科学用):", fDiv.toStringScientific());


// 検算: (商 × f2) ＝ f1 に戻るか？
let fcheck = new N6LBigFloatCalculator(fDiv.toString());
fcheck = fcheck.mul(f2);
console.log("(f1 ÷ f2) × f2 =", fcheck.toString());
console.log("一致判定:", fcheck.epsCmp(f1));

//f1 (科学用): 1.23456e+12
//f2 (科学用): 7.89e-9
//f1 + f2 (通常): 1234560000000.00000000789
//f1 + f2 (科学用): 1.23456000000000000000789e+12
//f1 - f2 (通常): 1234560000000
//f1 - f2 (科学用): 1.23456e+12
//f1 ÷ f2 (通常): 156471482889733840304.182509505703422053231939163498
//f1 ÷ f2 (科学用): 1.56471482889733840304182509505703422053231939163498e+20
//(f1 ÷ f2) × f2 = 1234559999999.999999999999999999999999999999
//一致判定: true
*/
