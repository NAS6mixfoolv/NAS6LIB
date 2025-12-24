//Programed by NAS6
//vector.js

//デバッグ時true
var N6L_DEBUG_MODE = false;

function DefinedToNum(val) {
  if(val === undefined)　return 0;
  if(val === false) return 0;
  if(val === true) return 1;
  return val;
}

//vector//ベクトル
//construction ex//構築例
//vector 4//4次ベクトル
//var veca = new N6LVector(4);
//homo vector//同次ベクトル
//var veca = new N6LVector(4, true);
//x axis unit homo vector//x軸単位同次ベクトル
//var veca = new N6LVector(new Array(1, 1, 0, 0), true);
//var veca = new N6LVector([1, 1, 0, 0], true);
//var vecb = new N6LVector(veca); //deep copy
//veca.x[0]:w veca.x[1]:x veca.x[2]:y veca.x[3]:z 

class N6LVector {

  constructor(rh, bh) {

    this.typename = "N6LVector";
    this.x = new Array();
    this.x[0] = 0.0;
    this.bHomo = false;

    var i;
    if(rh && rh.typename == "N6LVector"){
        this.x.length = rh.x.length;
        for(i = 0; i < rh.x.length; i++) this.x[i] = rh.x[i];
        this.bHomo = rh.bHomo;
    }
    else if(Array.isArray(rh)) {
        this.x.length = rh.length;
        for(i = 0; i < rh.length; i++) this.x[i] = rh[i];
        if(bh != undefined) this.bHomo = bh;
        else this.bHomo = false;
    }
    else if(typeof(rh) == "number"){
        this.x.length = rh;
        for(i = 0; i < rh; i++) this.x[i] = 0.0;
        if(bh != undefined) this.bHomo = bh;
        else this.bHomo = false;
    }
  } 

    // --- Bit flag constants for comparison result ---
    // --- 比較結果のビットフラグ定数 ---
    static get DIFF_TYPE() { return 0x80000000; } // If the types are different // 型が異なる場合
    static get DIFF_BHOMO() { return 0x00000001; } // If the bHomo are different // bHomoが異なる場合
    static get DIFF_LENGTH() { return 0x00000002; } // If the array lengths are different // 配列の長さが異なる場合
    DIFF_X(i) { return (0x00000004 << i); } // If the x[i] are different // x[i]が異なる場合

    Comp(rh) {
        var ret = 0;
        var i;
        if(rh.typename === "N6LVector"){
            if(this.bHomo !== rh.bHomo) ret |= N6LVector.DIFF_BHOMO;
            if(this.x.length !== rh.x.length) ret |= N6LVector.DIFF_LENGTH;
            for(i = 0; i < this.x.length; i++) if(this.x[i] !== rh.x[i]) ret |= this.DIFF_X(i);
        }
        else ret |= N6LVector.DIFF_TYPE;
        return ret;
    };

    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret === 0) return true;
        return false;
    };

    EpsComp(rh, eps, bbb) {
        if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        var j = 0;
        // If bbb is true, skip comparing x[0] (e.g. for the W component of a homogeneous coordinate system)
        // bbbがtrueの場合、x[0]の比較をスキップする (例: 同次座標系のW成分のため)
        if(bbb) j = 1;
        if(rh.typename === "N6LVector"){
            if(this.bHomo !== rh.bHomo) ret |= N6LVector.DIFF_BHOMO;
            if(this.x.length !== rh.x.length) ret |= N6LVector.DIFF_LENGTH;
            for(i = j; i < this.x.length; i++) if(this.x[i] < rh.x[i] - eps || rh.x[i] + eps < this.x[i]) ret |= this.DIFF_X(i);
        }
        else ret |= N6LVector.DIFF_TYPE;
        return ret;
    };

    EpsEqual(rh, eps, bbb) {
        var ret = this.EpsComp(rh, eps, bbb);
        if(ret === 0) return true;
        return false;
    };

    clone() {
      return new N6LVector(this);
    };

    Str() {
        var ret = '';
        var i;
        ret += String(this.bHomo);
        ret += ',' + String(this.x.length);
        for(i = 0; i < this.x.length; i++) ret += ',' + String(this.x[i]);
        return ret;
    };

    Parse(str) {
        var token = str.split(',');
        var ret = new N6LVector(Number(token[1]), Boolean(token[0]));
        if(token.length < ret.x.length + 2){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Parse: Invalid str. Returning N6LVector([1,0,0,0], true).");
          }
          return new N6LVector([1,0,0,0], true);
        }
        var i;
        for(i = 0; i < ret.x.length; i++) ret.x[i] = Number(token[i + 2]);
        return ret;
    };


    ToX3DOM(b) {
        var wk = new N6LVector(this);
        if(wk.bHomo) {
            if(b){
                wk = wk.Homogeneous();
                switch(wk.x.length) {
                case 3: return new x3dom.fields.SFVec2f(wk.x[1], wk.x[2]);
                case 4: return new x3dom.fields.SFVec3f(wk.x[1], wk.x[2], wk.x[3]);
                default:if(N6L_DEBUG_MODE){
                          console.warn("N6LVector.ToX3DOM: Invalid vector dimensions. Returning this.");
                        }
                        return new N6LVector(this);
                }
            }
            else if(wk.x.length == 4) return new x3dom.fields.SFVec4f(wk.x[1], wk.x[2], wk.x[3], wk.x[0]);
            wk = wk.ToNormal();
        }
        switch(wk.x.length) {
        case 2: return new x3dom.fields.SFVec2f(wk.x[0], wk.x[1]);
        case 3: return new x3dom.fields.SFVec3f(wk.x[0], wk.x[1], wk.x[2]);
        default:if(N6L_DEBUG_MODE){
                  console.warn("N6LVector.ToX3DOM: Invalid vector dimensions. Returning this.");
                }
                return new N6LVector(this);
        }
    };

    FromX3DOM(sf) {
        var str = sf.toString();
        var token = str.split(' ');
        switch(token.length) {
        case 2: return new N6LVector([Number(token.x[0]), Number(token.x[1])], false);
        case 3: return new N6LVector([Number(token.x[0]), Number(token.x[1]), Number(token.x[2])], false);
        case 4: return new N6LVector([Number(token.x[3]), Number(token.x[0]), Number(token.x[1]), Number(token.x[2])], true);
        default:if(N6L_DEBUG_MODE){
                  console.warn("N6LVector.FromX3DOM: Invalid vector dimensions. Returning this.");
                }
                return new N6LVector(this);
        }
    };

    To3JS(b) {
        var wk = new N6LVector(this);
        if(wk.bHomo) {
            if(b){
                wk = wk.Homogeneous();
                switch(wk.x.length) {
                case 3: return new THREE.Vector2(wk.x[1], wk.x[2]);
                case 4: return new THREE.Vector3(wk.x[1], wk.x[2], wk.x[3]);
                default:if(N6L_DEBUG_MODE){
                  console.warn("N6LVector.To3JS: Invalid vector dimensions. Returning this.");
                }
                return new N6LVector(this);
                }
            }
            else if(wk.x.length == 4) return new THREE.Vector4(wk.x[1], wk.x[2], wk.x[3], wk.x[0]);
            wk = wk.ToNormal();
        }
        switch(wk.x.length) {
        case 2: return new THREE.Vector2(wk.x[0], wk.x[1]);
        case 3: return new THREE.Vector3(wk.x[0], wk.x[1], wk.x[2]);
        default:if(N6L_DEBUG_MODE){
          console.warn("N6LVector.To3JS: Invalid vector dimensions. Returning this.");
        }
        return new N6LVector(this);
        }
    };

    From3JS(ary) {
        switch(ary.length) {
        case 2: return new N6LVector([Number(ary[0]), Number(ary[1])], false);
        case 3: return new N6LVector([Number(ary[0]), Number(ary[1]), Number(ary[2])], false);
        case 4: return new N6LVector([Number(ary[3]), Number(ary[0]), Number(ary[1]), Number(ary[2])], true);
        default:if(N6L_DEBUG_MODE){
          console.warn("N6LVector.From3JS: Invalid vector dimensions. Returning N6LVector([1,0,0,0],true).");
        }
        return new N6LVector([1,0,0,0],true);
        }
    };

    //"w","x","y","z"でアクセサを取得
    GetAccessor(it) {
      var ret = -1;
      var h = 0;
      if(this.bHomo) h = 1;//this.bHomo | false: h=0 true: h=1 //なのでthis.bHomoの状態によりw要素の転置を行う
      if(typeof it == "string"){
        if((it == "w")||(it == "W")) { if(this.bHomo) ret = 0; }
        else if((it == "x")||(it == "X")) ret = 0 + h;
        else if((it == "y")||(it == "Y")) ret = 1 + h;
        else if((it == "z")||(it == "Z")) ret = 2 + h;
      }
      return ret;
    }

    //"w","x","y","z","length","dimension"で各値を取得//"array"で内部配列への参照を返す
    Get(it) {
      if(typeof it == "string"){
        if((it == "length")||(it == "Length")) return this.x.length;
        else if((it == "array")||(it == "Array")) return this.x;
        else if((it == "dimension")||(it == "Dimension")) {
          var dms = this.x.length;
          if(this.bHomo) dms--;
          return dms;
        }
      }
      else {
        if(N6L_DEBUG_MODE){
          console.warn("N6LVector.Get(it): Invalid type.(it). Returning 0.0.");
        }
        return 0.0;
      }
      var ac = this.GetAccessor(it);
      if(0 <= ac) return this.x[ac];
      if(N6L_DEBUG_MODE){
        console.warn("N6LVector.Get(it): Invalid string.(it). Returning 0.0.");
      }
      return 0.0;
    }

    // { "w","x","y", or "z"} , val で各値にvalをセット
    Set(it, val) {
      var ac = this.GetAccessor(it);
      if(typeof val == "number") {
        if(0 <= ac) { this.x[ac] = val; return val; }
        if(N6L_DEBUG_MODE){
          console.warn("N6LVector.Set(it, val): Invalid string.(it). Returning 0.0.");
        }
        return 0.0;
      }
      if(N6L_DEBUG_MODE){
        console.warn("N6LVector.Set(it, val): Invalid type.(val). Returning 0.0.");
      }
      return 0.0;
    }

  //一般的な慣例の配置規則による構築
  Create(rh, bh){
    var ret = new N6LVector();
    var i = 0;
    var h = 0;//bh | false: h=0 true: h=1 //なのでbhの状態によりw要素の転置を行う
    if(Array.isArray(rh)) {
        ret.x.length = rh.length;
        if(bh) {
          h++;
          ret.x[0] = rh[rh.length - 1];
        }
        for(i = h; i < rh.length; i++) ret.x[i] = rh[i - h];
        if(bh != undefined) ret.bHomo = bh;
        else ret.bHomo = false;
    }
    return ret;
  }


    //four arithmetic operations(contain convenience)//四則演算(便宜上も含む)
    Add(rh) {
        var ret = new N6LVector();
        if(rh && rh.typename == "N6LVector"){
            ret = new N6LVector(this);
            if(this.x.length != rh.x.length) return "Error";
            var i = 0;
            var l = new N6LVector(this);
            var r = new N6LVector(rh);
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
                r = r.Homogeneous();
            }
            for(; i < l.x.length; i++) {
                ret.x[i] = l.x[i] + r.x[i];
            }
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LVector(this);
            var i = 0;
            var l = new N6LVector(this);
            var r = rh;
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
            }
            for(; i < l.x.length; i++) {
                ret.x[i] = l.x[i] + r;
            }
            return ret;
        }
        return ret;
    };

    Sub(rh) {
        var ret = new N6LVector();
        if(rh && rh.typename == "N6LVector"){
            ret = new N6LVector(this);
            if(this.x.length != rh.x.length){
              if(N6L_DEBUG_MODE){
                console.warn("N6LVector.Sub(rh): Invalid vector dimensions.(this, rh). Returning this.");
              }
              return new N6LVector(this);
            }
            var i = 0;
            var l = new N6LVector(this);
            var r = new N6LVector(rh);
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
                r = r.Homogeneous();
            }
            for(; i < l.x.length; i++) {
                ret.x[i] = l.x[i] - r.x[i];
            }
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LVector(this);
            var i = 0;
            var l = new N6LVector(this);
            var r = rh;
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
            }
            for(; i < l.x.length; i++) {
                ret.x[i] = l.x[i] - r;
            }
            return ret;
        }
        return ret;
    };

    //convenience//便宜上
    Mul(rh) {
        var ret = 0.0;
        if(rh && rh.typename == "N6LVector"){
            if(this.x.length != rh.x.length){
              if(N6L_DEBUG_MODE){
                console.warn("N6LVector.Mul(rh): Invalid vector dimensions.(this, rh). Returning this.");
              }
              return new N6LVector(this);
            }
            var i = 0;
            var l = new N6LVector(this);
            var r = new N6LVector(rh);
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
                r = r.Homogeneous();
            }
            for(; i < l.x.length; i++) {
                ret += l.x[i] * r.x[i];
            }
            return ret;
        }
        else if(rh && rh.typename == "N6LMatrix"){
            ret = new N6LVector(this);
            if((this.x.length != rh.x.length) || (this.x.length != rh.x[0].x.length)){
              if(N6L_DEBUG_MODE){
                console.warn("N6LVector.Mul(rh): Invalid vector dimensions.(this, rh). Returning this.");
              }
              return new N6LVector(this);
            }
            var l = new N6LVector(this);
            if(l.bHomo) {
                l = l.Homogeneous();
                l.bHomo = false;
                ret.bHomo = true;
            }
            var i;
            var t = new N6LMatrix(rh).TransposedMat().Homogeneous();
            for(i = 0; i < l.x.length; i++) {
                ret.x[i] = l.Mul(t.x[i]);
            }
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LVector(this);
            var i = 0;
            var l = new N6LVector(this);
            var r = rh;
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
            }
            for(; i < l.x.length; i++) {
                ret.x[i] = l.x[i] * r;
            }
            return ret;
        }
        return ret;
    };

    //convenience//便宜上
    Div(rh) {
        var ret = 0.0;
        if(rh && rh.typename == "N6LVector"){
            if(this.x.length != rh.x.length) return "Error";
            var i = 0;
            var l = new N6LVector(this);
            var r = new N6LVector(rh);
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
                r = r.Homogeneous();
            }
            for(; i < l.x.length; i++) {
                if(r.x[i]) ret += l.x[i] / r.x[i];
                else ret += l.x[i];
            }
            return ret;
        }
        else if(rh && rh.typename == "N6LMatrix"){
            ret = new N6LVector(this);
            if((this.x.length != rh.x.length) || (this.x.length != rh.x[0].x.length)){
              if(N6L_DEBUG_MODE){
                console.warn("N6LVector.Mul(rh): Invalid vector dimensions.(this, rh). Returning this.");
              }
              return new N6LVector(this);
            }
            var l = new N6LVector(this);
            if(l.bHomo) {
                l = l.Homogeneous();
                l.bHomo = false;
                ret.bHomo = true;
            }
            var i;
            var t = new N6LMatrix(rh).TransposedMat().Homogeneous();
            for(i = 0; i < l.x.length; i++) {
                ret.x[i] = l.Div(t.x[i]);
            }
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LVector(this);
            var i = 0;
            var l = new N6LVector(this);
            var r = rh;
            if(l.bHomo) {
                i = 1;
                l = l.Homogeneous();
            }
            if(rh == 0.0) return l;
            for(; i < l.x.length; i++) {
                ret.x[i] = l.x[i] / r;
            }
            return ret;
        }
        return ret;
     };

    //set bHomo property//bHomoプロパティ強制セット
    SetHomo(rh) {
        var ret = new N6LVector(this);
        ret.bHomo = rh;
        return ret;
    };

    //repair//修正
    Repair(eps) {
        if(!eps) eps = 1e-6;
        var ret = new N6LVector(this);
        var i;
        for(i = 0; i < ret.x.length; i++) {
            if(Math.abs(ret.x[i]) < eps) ret.x[i] = 0.0;
            if(1.0 - eps < ret.x[i] && ret.x[i] < 1.0 + eps) ret.x[i] = 1.0;
            if(-1.0 - eps < ret.x[i] && ret.x[i] < -1.0 + eps) ret.x[i] = -1.0;
        }
        return ret;
    };

    //dot//内積
    Dot(rh) {
        if(!rh || rh.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Dot(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LVector(this);
        }
        var sum = 0.0;
        var i = 0;
        var l = new N6LVector(this);
        var r = new N6LVector(rh);
        if(l.bHomo == true) {
            i = 1;
            l = l.Homogeneous();
            r = r.Homogeneous();
        }
        for(; i < l.x.length; i++) sum = sum + l.x[i] * r.x[i];
        return sum;
    };

    //cross//外積
    Cross(rh) {
        if(!rh || rh.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Cross(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LVector(this);
        }
        if(!this.bHomo) {
            if(this.x.length == 2 && this.x.length == rh.x.length) return this.x[0] * rh.x[1] - this.x[1] * rh.x[0];
            else if(this.x.length == 3 && this.x.length == rh.x.length) {
                var l = new N6LVector(this);
                var r = new N6LVector(rh);
                var ret = new N6LVector([
                    l.x[1] * r.x[2] - l.x[2] * r.x[1],
                    l.x[2] * r.x[0] - l.x[0] * r.x[2],
                    l.x[0] * r.x[1] - l.x[1] * r.x[0]]);
                return ret;
            }
        }
        else {
            if(this.x.length == 3 && this.x.length == rh.x.length) return this.x[1] * rh.x[2] - this.x[2] * rh.x[1];
            else if(this.x.length == 4 && this.x.length == rh.x.length) {
                var l = new N6LVector(this).ToNormal();
                var r = new N6LVector(rh).ToNormal();
                var ret = new N6LVector([
                    l.x[1] * r.x[2] - l.x[2] * r.x[1],
                    l.x[2] * r.x[0] - l.x[0] * r.x[2],
                    l.x[0] * r.x[1] - l.x[1] * r.x[0]]).ToHomo();
                return ret;
            }
        }
        return 0.0;
    };

    //is parallel//平行かどうか
    isParallel(rh) {
        if(!rh || rh.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.isParallel(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LVector(this);
        }
        var l = new N6LVector(this).NormalVec();
        var r = new N6LVector(rh).NormalVec();
        return (l.EpsEqual(r) || l.EpsEqual(r.Mul(-1)));
    };

    //max absolute of element//要素の最大絶対値
    Max() {
        var ret = 0.0;
        var i;
        var j = 0;
        var l = new N6LVector(this);
        if(this.bHomo) {
            l = l.Homogeneous();
            j = 1;
        }
        for(i = j; i < l.x.length; i++) if(Math.abs(ret) < Math.abs(l.x[i])) ret = l.x[i];
        return ret;
    };

    DivMax(eps) {
        if(!eps) eps = 1e-6;
        var l = new N6LVector(this);
        var max = Math.abs(l.Max());
        if(max < 1.0 - eps) return l;
        return l.Div(max);
    };

    //look at matrix//注視
    LookAtMat2(rh) {
        if(!rh){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.LookAtMat2(rh): Invalid rh. Returning this.");
          }
          return new N6LVector(this);
        }
        var eye = new N6LVector(this).Mul(-1);
        var lookat;
        if(rh.typename == "N6LMatrix") lookat = rh.Pos().Mul(-1); //注視目標セット
        else if(rh.typename == "N6LVector") lookat = new N6LVector(rh).Mul(-1); //注視目標セット
        else {
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.LookAtMat2(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LVector(this);
        }
        var ez = lookat.Sub(eye).NormalVec(); //視線ベクトル
        var axis; //各軸宣言
        var ax = new N6LVector(4, true).UnitVec(1);
        var ay = new N6LVector(4, true).UnitVec(2);
        var az = new N6LVector(4, true).UnitVec(3);
        //横向きベクトル
        if (!ez.isParallel(ax)) axis = new N6LVector(ax);
        else axis = new N6LVector(az);
        var up = ez.Cross(axis); //上方ベクトル
        eye = eye.Homogeneous();
        lookat = lookat.Homogeneous();
        up = up.Homogeneous().NormalVec();
        var dt = [];
        var LAM = new N6LMatrix(4).UnitMat();

        LAM = LAM.LookAtMat(eye, lookat, up).InverseMat(dt); //目的の関数

        return LAM;
    };

    //RotationArc(ArcBall)//球面回転(アークボール)
    RotArcQuat(rh) {
        if(!rh || rh.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.RotArcQuat(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LVector(this);
        }
        var v0 = this.NormalVec();
        var v1 = rh.NormalVec();
        var cross = v0.Cross(v1);
        var dot = v0.Dot(v1);
        var s = Math.sqrt((1.0 + dot) * 2.0);
        var s2 = s;
        if(!s) s = 1.0;
        return new N6LQuaternion([s2 / 2.0, cross.x[1] / s, cross.x[2] / s, cross.x[3] / s]);
    };

    //zero vector//ゼロ
    ZeroVec() {
        var i = 0; 
        var d0 = new Array();
        if(this.bHomo) {
            i = 1;
            d0[0] = 1.0;            
        }
        for(; i < this.x.length; i++) d0[i] = 0.0;
        var ret = new N6LVector(d0, this.bHomo);
        return ret;
    };

    //unit vector//単位ベクトル
    UnitVec(a) {
        var ret = new N6LVector(this).ZeroVec();
        if(a < 0 && ret.x.length - 1 < a) return ret;
        ret.x[a] = 1.0;
        if(ret.bHomo) ret.x[0] = 1.0;
        return ret;
    };

    //normalize//ノーマライズ
    NormalVec(a) {
        if(a != undefined) {
            var ab = a.Sub(this);
            return ab.NormalVec();
        }
        if(!this.Abs()) return new N6LVector(this);
        return this.Div(this.Abs());
    };

    //square absolute//絶対値2乗
    SquareAbs() {
        var sum = 0.0;
        var i = 0;
        var l = new N6LVector(this);
        if(l.bHomo) {
            i = 1;
            l = l.Homogeneous();
        }
        for(; i < l.x.length; i++) sum += l.x[i] * l.x[i];
        return sum;
    };

    //absolute//絶対値
    Abs() {
        return Math.sqrt(this.SquareAbs());
    };

    //direction cosine//方向余弦
    DirectionCosine() {
        var r = this.Abs();
        var i = 0;
        var ret = new N6LVector(this);
        var l = new N6LVector(this);
        if(l.bHomo) {
            i = 1;
            l = l.Homogeneous();
        }
        if(r == 0.0) return l;
        for(; i < l.x.length; i++) ret.x[i] = l.x[i] / r;
        return ret;
    };


    //angle//なす角
    Theta(rh) {
        if(!rh || rh.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Theta(rh): Invalid rh.typename. Returning 0.");
          }
          return 0;
        }
        var s = 1.0;
        var dc = 0.0;
        if((!this.bHomo && this.x.length == 2) || (this.bHomo && this.x.length == 3)) {
            var crs = this.Cross(rh);
            if(crs < 0.0) s = -1.0;
        }
        if(this.Abs() == 0.0 || rh.Abs() == 0.0) return 0.0; //provisional//暫定値
        dc = this.Dot(rh) / (this.Abs() * rh.Abs());
        return Math.acos(dc) * s;
    };

    //angle//なす角
    ThetaN(rh) {
        if(!rh || rh.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Theta(rh): Invalid rh.typename. Returning 0.");
          }
          return 0;
        }
        var th = this.Theta(rh);
        if(th <= -Math.PI / 2.0 || Math.PI / 2.0 < th) return false;
        return true;
    };

    //rotate//回転
    Rot2D(theta) {
        if((!this.bHomo && this.x.length != 2) || (this.bHomo && this.x.length != 3)){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Rot2D(theta): Invalid vector dimensions.(this). Returning this.");
          }
          return new N6LVector(this);
        }
        var ret = new N6LVector([this.x[0]*Math.cos(theta)-this.x[1]*Math.sin(theta),    this.x[0]*Math.sin(theta)+this.x[1]*Math.cos(theta)]);
        if(this.bHomo) ret = ret.ToHomo();
        return ret;
    };

    //rotate axis//軸に対する回転
    RotAxis(axis, theta) {
        if(!axis || axis.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.RotAxis(axis,theta): Invalid axis.typename Returning this.");
          }
          return new N6LVector(this);
        }
        if((this.x.length != 3 && this.x.length != 4) || this.x.length != axis.x.length){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.RotAxis(axis,theta): Invalid vector dimensions.(this,axis). Returning this.");
          }
          return new N6LVector(this);
        }
        var l = new N6LVector(this);
        if(l.bHomo){ l = l.ToNormal(); axis = axis.ToNormal(); }
        axis = axis.NormalVec();
        var v0 = new N6LVector([l.x[0], l.x[1], l.x[2]]);
        v0 = v0.Mul(Math.cos(theta));
        var v1 = new N6LVector([
            0.0 - axis.x[2] * l.x[1] + axis.x[1] * l.x[2],
            axis.x[2] * l.x[0] + 0.0 - axis.x[0] * l.x[2],
            -axis.x[1] * l.x[0] + axis.x[0] * l.x[1] + 0.0]);
        v1 = v1.Mul(Math.sin(theta));
        var v2 = new N6LVector([
            axis.x[0] * axis.x[0] * l.x[0] + axis.x[0] * axis.x[1] * l.x[1] + axis.x[0] * axis.x[2] * l.x[2],
            axis.x[1] * axis.x[0] * l.x[0] + axis.x[1] * axis.x[1] * l.x[1] + axis.x[1] * axis.x[2] * l.x[2],
            axis.x[2] * axis.x[0] * l.x[0] + axis.x[2] * axis.x[1] * l.x[1] + axis.x[2] * axis.x[2] * l.x[2]]);
        v2 = v2.Mul(1.0 - Math.cos(theta));
        var ret = v0.Add(v1).Add(v2);
        if(this.bHomo) ret = ret.ToHomo();
        return ret;
    };

    //rotate axis calc quarterion//軸に対する回転
    RotAxisQuat(axis, theta) {
        if(!axis || axis.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.RotAxisQuat(axis,theta): Invalid axis.typename Returning this.");
          }
          return new N6LVector(this);
        }
        if((this.x.length != 3 && this.x.length != 4) || (this.x.length != axis.x.length)){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.RotAxisQuat(axis,theta): Invalid vector dimensions.(this,axis). Returning this.");
          }
          return new N6LVector(this);
        }
        axis = axis.NormalVec();
        var q = new N6LQuaternion(1, 0, 0, 0);
        var VecWK = new N6LVector(this);
        if(!this.bHomo) VecWK = VecWK.ToHomo();
        var MatWK = new N6LMatrix(4).UnitMat();
        MatWK = q.RotAxisQuat(axis, theta).Matrix();
        VecWK = MatWK.Mul(VecWK);
        if(!this.bHomo) VecWK = VecWK.ToNormal();
        return VecWK;
    };

    //rotate axis calc quarterion & rotvec//軸に対する回転
    RotAxisVec(rotvec) {
        if(!rotvec || rotvec.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.RotAxisVec(rotvec): Invalid rotvec.typename Returning this.");
          }
          return new N6LVector(this);
        }
        if((this.x.length != 3 && this.x.length != 4) || (this.x.length != rotvec.x.length)){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.RotAxisVec(rotvec): Invalid vector dimensions.(this,rotvec). Returning this.");
          }
          return new N6LVector(this);
        }
        axis = axis.NormalVec();
        var q = new N6LQuaternion(1, 0, 0, 0);
        var VecWK = new N6LVector(this);
        if(!this.bHomo) VecWK = VecWK.ToHomo();
        var MatWK = new N6LMatrix(4).UnitMat();
        MatWK = q.RotAxisVec(rotvec).Matrix();
        VecWK = MatWK.Mul(VecWK);
        if(!this.bHomo) VecWK = VecWK.ToNormal();
        return VecWK;
    }

    //project axis//軸に対する射影
    ProjectAxis(axis) {
        if(!axis || axis.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.ProjectAxis(axis): Invalid axis.typename Returning this.");
          }
          return new N6LVector(this);
        }
        if(this.x.length != axis.x.length){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.ProjectAxis(axis): Invalid vector dimensions.(this,axis). Returning this.");
          }
          return new N6LVector(this);
        }
        axis = axis.NormalVec();
        if(!axis.SquareAbs()) return axis.Mul(this.Dot(axis));
        return ((axis.Mul(this.Dot(axis))).Div(axis.SquareAbs()));
    };

    //all param is N6LVector//点と直線の距離
    DistanceDotLine(p, a, b) {
        if(!p || p.typename != "N6LVector" || !a || a.typename != "N6LVector" || !b || b.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.DistanceDotLine(p,a,b): Invalid p,a,b.typename Returning 0.");
          }
          return 0;
        }
        var ab = b.Sub(a);
        var ap = p.Sub(a);
        var aab = ab.Abs();
        var pab = (ab.ProjectAxis(ap)).Abs();
        if(aab < pab) return 0.0;
        return Math.sqrt(aab * aab - pab * pab);
    };

    //all param is N6LVector // reta & retb is Array//直線と直線の距離と最接近位置
    DistancePointLineLine(reta, retb, a0, a1, b0, b1) {
        if(!a0 || a0.typename != "N6LVector" || !a1 || a1.typename != "N6LVector" || !b0 || b0.typename != "N6LVector" || !b1 || b1.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.DistancePointLineLine(reta, retb, a0, a1, b0, b1): Invalid a0,a1,b0,b1.typename Returning 0.");
          }
          return 0;
        }
        var f = 0.0;
        var s;
        var t;
        var ab = b0.Sub(a0);
        var ba = a0.Sub(b0);
        var nva = a0.NormalVec(a1);
        var nvb;
        if(b0.EpsEqual(b1)) nvb = nva.Mul(-1.0);
        else nvb = b0.NormalVec(b1);
        if(a0.EpsEqual(a1)){
            if(b0.EpsEqual(b1)){
                reta[0] = new N6LVector(a0);
                retb[0] = new N6LVector(b0);
                return ab.Abs();
            }
            else nva = nvb.Mul(-1.0);
        }
        if((nva.Dot(nvb)) * (nva.Dot(nvb)) == 1.0){
            reta[0] = new N6LVector(a0);
            retb[0] = new N6LVector(b0);
            return this.DistanceDotLine(b0, a0, a1);
        }
        else{
            s = (1.0 / (1.0 - (nva.Dot(nvb)) * (nva.Dot(nvb)))) * (nva.Dot(ab) + nva.Dot(nvb) * nvb.Dot(ba));
            t = (1.0 / (1.0 - (nva.Dot(nvb)) * (nva.Dot(nvb)))) * (nvb.Dot(ba) + nva.Dot(nvb) * nva.Dot(ab));
            f = a0.Abs() * a0.Abs() + s * s + 2.0 * s * nva.Dot(a0) + b0.Abs() * b0.Abs() + t * t + 2.0 * t * nvb.Dot(b0) - 2.0 * a0.Dot(b0) - 2.0 * s * nva.Dot(b0) - 2.0 * t * nvb.Dot(a0) - 2.0 * s * t * nva.Dot(nvb);
        }
        reta[0] = new N6LVector(a0.Add(nva.Mul(s)));
        retb[0] = new N6LVector(b0.Add(nvb.Mul(t)));
        return Math.sqrt(f);
    };

    //closest approach  //all param is N6LVector // reta & retb is Array//直線と直線の最接近位置
    PointLineLine(reta, retb, a0, a1, b0, b1) {
        var d = this.DistancePointLineLine(reta, retb, a0, a1, b0, b1);
        if(d != 0.0) return false;
        return true
    };

    //all param is N6LVector//直線と直線の距離
    DistanceLineLine(a0, a1, b0, b1) {
        var reta = [new N6LVector(a0)];
        var retb = [new N6LVector(a0)];
        return this.DistancePointLineLine(reta, retb, a0, a1, b0, b1);
    };


    //homogeneous//同次座標
    Homogeneous() {
        if(!this.bHomo) return new N6LVector(this);
        var i;
        var ret = new N6LVector(this);
        var w = this.x[0];
        if(this.x[0] == 0.0) w = 1.0;
        for(i = 0; i < this.x.length; i++) ret.x[i] = ret.x[i] / w;
        return ret;
    };

    //to homogeneous//同次ベクトルに変換
    ToHomo() {
        if(this.bHomo) return new N6LVector(this);
        var n = this.x.length;
        var ret = new N6LVector(n + 1, true);
        var i;
        ret.x[0] = 1.0;
        for(i = 0; i < n; i++) ret.x[i + 1] = this.x[i];
        return ret;
    };

    //to normal//通常ベクトルに変換
    ToNormal(bbb) {
        if(!this.bHomo) return new N6LVector(this);
        var ret = new N6LVector(this.x.length - 1);
        var i;
        var w = this.x[0];
        if(bbb || this.x[0] == 0.0) w = 1.0;
         for(i = 1; i < this.x.length; i++) ret.x[i - 1] = this.x[i] / w;
        return ret;
    };

    //rotate vector to rotate matrix//回転ベクトルから回転行列
    Matrix() {
        var eps = 1e-6;
        if(this.x.length != 4){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Matrix(): Invalid vector dimensions.(this) Returning N6LMatrix(4).UnitMat().SetHomo(true).");
          }
          return new N6LMatrix(4).UnitMat().SetHomo(true);
        }
        if(this.EpsEqual(this.ZeroVec(), eps, true)){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.Matrix(): Invalid zero vector. Returning N6LMatrix(4).UnitMat().SetHomo(true).");
          }
          return new N6LMatrix(4).UnitMat().SetHomo(true);
        }
        var rv = this.ToNormal(true).NormalVec();
        var th;
        if(this.x[0] % (Math.PI * 2.0)) th = this.x[0] % (Math.PI * 2.0);
        else if(!(this.x[0] % (Math.PI * 2.0))) th = 0.0;
        else if(0.0 < (this.x[0] % Math.PI)) th = Math.PI;
        else th = -Math.PI;
        var s = Math.sin(th);
        var c = Math.cos(th);
        var c1 = 1.0 - c;
        var ret = new N6LMatrix([
            [1,     0,                                 0,                                 0                             ],
            [0,     (c+c1*rv.x[0]*rv.x[0]),            (c1*rv.x[0]*rv.x[1]-s*rv.x[2]),    (c1*rv.x[2]*rv.x[0]+s*rv.x[1])],
            [0,     (c1*rv.x[0]*rv.x[1]+s*rv.x[2]),    (c+c1*rv.x[1]*rv.x[1]),            (c1*rv.x[1]*rv.x[2]-s*rv.x[0])],
            [0,     (c1*rv.x[2]*rv.x[0]-s*rv.x[1]),    (c1*rv.x[1]*rv.x[2]+s*rv.x[0]),    (c+c1*rv.x[2]*rv.x[2])        ]]);
        if(ret.EpsEqual(ret.ZeroMat())) ret = ret.UnitMat();
        //ret = ret.SetCol(0, new N6LVector([1,1,1,1]));
        //ret = ret.SetHomo(true);
        //return ret.SetCol(0, new N6LVector([1,1,1,1])).NormalMat().Repair();
        return ret.NormalMat().Repair();
    };

    //get position vector to translated and quaternion //姿勢ベクトルから四元数と平行移動
    PosVecGetTQ(out) {
        var eps = 1e-6;
        if(this.x.length != 8){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.PosVecGetTQ(out): Invalid vector dimensions. Output ZeroVec ZeroQuat.");
          }
          out[0] = new N6LVector(4, true).ZeroVec();
          out[1] = new N6LQuaternion().ZeroQuat();
          return;
        }
        if(this.EpsEqual(this.ZeroVec(), eps, true)) return "Error";
        out[0] = new N6LVector([this.x[0], this.x[1], this.x[2], this.x[3]], true);
        out[1] = new N6LQuaternion(this.x[4], this.x[5], this.x[6], this.x[7]);
    };

    //set position vector to translated and quaternion //姿勢ベクトルに四元数と平行移動をセット
    PosVecSetTQ(t,q) {
        if(t.x.length != 4 || q.q.x.length != 4){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.PosVecSetTQ(t,q): Invalid vector dimensions.(t,q) Returning N6LVector([1,0,0,0,0,0,0,0], true).");
          }
          return new N6LVector([1,0,0,0,0,0,0,0], true);
        }
        var ret = new N6LVector([t.x[0], t.x[1], t.x[2], t.x[3], q.q.x[0], q.q.x[1], q.q.x[2], q.q.x[3]], true); 
        return ret;
    };

    //position vector to rotate matrix//姿勢ベクトルから回転行列
    PosVecMatrix() {
        var eps = 1e-6;
        if(this.x.length != 8){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.PosVecMatrix(): Invalid vector dimensions. Returning N6LMatrix(4).UnitMat().SetHomo(true).");
          }
          return new N6LMatrix(4).UnitMat().SetHomo(true);
        }
        if(this.EpsEqual(this.ZeroVec(), eps, true)){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.PosVecMatrix(): Invalid zero vector. Returning N6LMatrix(4).UnitMat().SetHomo(true).");
          }
          return new N6LMatrix(4).UnitMat().SetHomo(true);
        }
        var tq = [];
        this.PosVecGetTQ(tq);
        var ret = tq[1].Matrix().TranslatedMat(tq[0]);
        return ret;
    };

    //multiple position vector//姿勢ベクトルの積
    PosVecMul(rh) {
        var eps = 1e-6;
        if(this.x.length != 8 || rh.x.length != 8){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.PosVecMul(): Invalid vector dimensions. Returning N6LVector([1,0,0,0,0,0,0,0], true).");
          }
          return new N6LVector([1,0,0,0,0,0,0,0], true);
        }
        if(this.EpsEqual(this.ZeroVec(), eps, true) || rh.EpsEqual(rh.ZeroVec(), eps, true)){
          if(N6L_DEBUG_MODE){
            console.warn("N6LVector.PosVecMatrix(): Invalid zero posvector. Returning N6LVector([1,0,0,0,0,0,0,0], true).");
          }
          return new N6LVector([1,0,0,0,0,0,0,0], true);
        }
        var tq = [];
        this.PosVecGetTQ(tq);
        var rtq = [];
        rh.PosVecGetTQ(rtq);
        var t = tq[0].Add(tq[1].Matrix().Mul(rtq[0]));
        var q = tq[1].Mul(rtq[1]);
        var ret = new N6LVector().PosVecSetTQ(t, q).Repair(); 
        return ret;
    };


    //sphere 4d//四次元球
    Sphere4D() {
        var ret = new N6LQuaternion(0, 0, 0, 0);
        var i;
        var d = 0.0;
        for(i = 0; i < 4; i++) d += this.x[i] * this.x[i];
        ret.q.x[0] = -this.x[0] * this.x[0];
        for(i = 1; i < 4; i++) d += this.x[i] * this.x[i];
        if(d == 0.0) d = 1.0;
        ret.q.x[0] /= d;
        for(i = 1; i < 4; i++) ret.q.x[i] = 2.0 * this.x[0] * this.x[i] / d;
        if(ret.Eqaul(ret.ZeroQuat)) ret = ret.UnitQuat();
        return ret;
    };

    //無限対数軸から通常軸へ
    FromLogAxis(base, range, x) {
        var ret;
        if(isNaN(x) || range <= Math.abs(x)) ret = Number.POSITIVE_INFINITY;
        else {
            ret = range / (Math.log(Math.abs(x) / range) / Math.log(1.0 / base));
            if(isNaN(ret) || !isFinite(ret)) ret = Number.POSITIVE_INFINITY;
        }
        if(x < 0.0) ret *= -1.0;
        return ret;
    };

    //通常軸から無限対数軸へ
    ToLogAxis(base, range, x) {
        var ret;
        var c = range / Math.abs(x);
        if(isNaN(c) || !isFinite(c)) ret = 0.0;
        else {
            ret = range * (Math.pow(1.0 / base, c));
            if(isNaN(ret) || !isFinite(ret)) ret = 0.0;
        }
        if(x < 0.0) ret *= -1.0;
        return ret;
    };

    //frustum infinity//無限遠透視射影
    FrustumInfVec0(base, range, v) {
        var VecWK2 = new N6LVector(v).Homogeneous();
        var VecWK = new N6LVector([
            1.0,
            (range - this.ToLogAxis(base, range, VecWK2.x[3])) * VecWK2.x[1] / range,
            (range - this.ToLogAxis(base, range, VecWK2.x[3])) * VecWK2.x[2] / range,
            0.0], true);

        return VecWK;
    };

    //inverse frustum infinity//逆無限遠透視射影
    InvFrustumInfVec0(base, range, v, z) {
        var VecWK2 = new N6LVector(v).Homogeneous();
        var VecWK = new N6LVector([
            1.0,
            range * VecWK2.x[1] / (range - this.ToLogAxis(base, range, z)),
            range * VecWK2.x[2] / (range - this.ToLogAxis(base, range, z)),
            z / range], true);

        return VecWK;
    };

    //frustum infinity//無限遠透視射影
    FrustumInfVec(base, range, v) {
        return this.FrustumInfVec0(base, range, v).Div(range);
    };

    //inverse frustum infinity//逆無限遠透視射影
    InvFrustumInfVec(base, range, v, z) {
        return this.InvFrustumInfVec0(base, range, v, z).Mul(range);
    };

}
