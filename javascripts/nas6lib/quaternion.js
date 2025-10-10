//Programed by NAS6
//quaternion.js

//quaternion//四元数
//construction ex//構築例
//var quta = new N6LQuaternion(1, 0, 0, 0);
//var quta = new N6LQuaternion(1, new Array(0, 0, 0));
//var quta = new N6LQuaternion(1, N6LVector([1, 0, 0, 0], true));
//var quta = new N6LQuaternion(new Array(1, 0, 0, 0));
//var quta = new N6LQuaternion(new N6LVector([1, 0, 0, 0]));
//var quta = new N6LQuaternion([1, 0, 0, 0]);
//var qutb = new N6LQuaternion(quta); //deep copy
//quta.q.x[0]:w quta.q.x[1]:x quta.q.x[2]:y quta.q.x[3]:z 
class N6LQuaternion {

  constructor(w, x, y, z) {

    this.typename = "N6LQuaternion";
    this.q = new N6LVector(4, false);

    if(w && w.typename == "N6LQuaternion"){
        var i;
        for(i = 0; i < 4; i++) this.q.x[i] = w.q.x[i];
    }
    else if(w && w.typename == "N6LVector"){
        var i;
        for(i = 0; i < 4; i++) this.q.x[i] = w.x[i];
    }
    else if(Array.isArray(w)){
        var i;
        for(i = 0; i < 4; i++) this.q.x[i] = w[i];
    }
    else if(typeof(w) == "number") {
        if(Array.isArray(x)){
            this.q.x[0] = w;
            var i;
            for(i = 0; i < 3; i++) this.q.x[i + 1] = x[i];
        }
        else if(x && x.typename == "N6LVector"){
            this.q.x[0] = w;
            var i;
            var j = 0;
            if(x.bHomo) {j = 1; x = x.Homogeneous();}
            for(i = j; i < j + 3; i++) this.q.x[i - j + 1] = x.x[i];
        }
        else {
            this.q.x[0] = w;
            this.q.x[1] = x;
            this.q.x[2] = y;
            this.q.x[3] = z;
        }
    }
  }

    // --- Bit flag constants for comparison result ---
    // --- 比較結果のビットフラグ定数 ---
    static get DIFF_TYPE() { return 0x80000000; } // If the types are different // 型が異なる場合
    DIFF_QX(i) { return (0x00000001 << i); } // If the q.x[i] are different // q.x[i]が異なる場合

    Comp(rh) {
        var ret = 0;
        var i;
        if(rh && rh.typename === "N6LQuaternion"){
            for(i = 0; i < 4; i++) if(this.q.x[i] != rh.q.x[i]) ret |= this.DIFF_QX(i);
        }
        else ret |= N6LQuaternion.DIFF_TYPE;
        return ret;
    };
 
    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret === 0) return true;
        return false;
    };

    EpsComp(rh, eps) {
        if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        if(rh && rh.typename === "N6LQuaternion"){
            for(i = 0; i < 4; i++) if(this.q.x[i] < rh.q.x[i] - eps || rh.q.x[i] + eps < this.q.x[i]) ret |= this.DIFF_QX(i);
        }
        else ret |= N6LQuaternion.DIFF_TYPE;
        return ret;
    };
 
    EpsEqual(rh, eps) {
        var ret = this.EpsComp(rh, eps);
        if(ret === 0) return true;
        return false;
    };

    Str() {
        var ret = '';
        ret = this.q.Str();
        return ret;
    };

    Parse(str) {
        var ret = new N6LQuaternion();
        ret.q = new N6LVector().Parse(str);
        return ret;
    };

    //"w","x","y","z"でアクセサを取得
    GetAccessor(it) {
      var ret = -1;
      if(typeof it == "string"){
        if((it == "w")||(it == "W")) ret = 0; 
        else if((it == "x")||(it == "X")) ret = 1;
        else if((it == "y")||(it == "Y")) ret = 2;
        else if((it == "z")||(it == "Z")) ret = 3;
      }
      return ret;
    }

    //"w","x","y","z","length","dimension"で各値を取得//"array"で内部配列への参照を返す
    Get(it) {
      if(typeof it == "string"){
        if((it == "length")||(it == "Length")) return 4;
        else if((it == "array")||(it == "Array")) return this.q.x;
        else if((it == "dimension")||(it == "Dimension")) return 3;
      }
      else {
        if(N6L_DEBUG_MODE){
          console.warn("N6LQuaternion.Get(it): Invalid type.(it). Returning 0.0.");
        }
        return 0.0;
      }
      var ac = this.GetAccessor(it);
      if(0 <= ac) return this.q.x[ac];
      if(N6L_DEBUG_MODE){
        console.warn("N6LQuaternion.Get(it): Invalid string.(it). Returning 0.0.");
      }
      return 0.0;
    }

    // { "w","x","y", or "z"} , val で各値にvalをセット
    Set(it, val) {
      var ac = this.GetAccessor(it);
      if(typeof val == "number") {
        if(0 <= ac) { this.q.x[ac] = val; return val; }
        if(N6L_DEBUG_MODE){
          console.warn("N6LQuaternion.Set(it, val): Invalid string.(it). Returning 0.0.");
        }
        return 0.0;
      }
      if(N6L_DEBUG_MODE){
        console.warn("N6LQuaternion.Set(it, val): Invalid type.(val). Returning 0.0.");
      }
      return 0.0;
    }

  //一般的な慣例の配置規則による構築
  Create(w){
    var ret = new N6LQuaternion();
    var i = 1;
    var h = 1;
    if(Array.isArray(w)) {
        ret.q.x.length = w.length;
        ret.q.x[0] = w[w.length - 1];
        for(i = h; i < w.length; i++) ret.q.x[i] = w[i - h];
    }
    return ret;
  }


    //four arithmetic operations(contain convenience)//四則演算(便宜上も含む)
    Add(rh) {
        var ret;
        var IntWK = 0;
        var QuatWK = new N6LQuaternion(this).NormalQuat();
        if(rh && rh.typename == "N6LQuaternion"){
            ret = new N6LQuaternion(rh).NormalQuat();
            for(IntWK = 0; IntWK < 4; IntWK++) QuatWK.q.x[IntWK] = QuatWK.q.x[IntWK] + ret.q.x[IntWK];
        }
        else if(typeof(rh) == "number") {
            QuatWK.q = QuatWK.q.Add(rh);
        }
        return QuatWK.NormalQuat();
    };

    Sub(rh) {
        var ret;
        var IntWK = 0;
        var QuatWK = new N6LQuaternion(this).NormalQuat();
        if(rh && rh.typename == "N6LQuaternion"){
            ret = new N6LQuaternion(rh).NormalQuat();
            for(IntWK = 0; IntWK < 4; IntWK++) QuatWK.q.x[IntWK] = QuatWK.q.x[IntWK] - ret.q.x[IntWK];
        }
        else if(typeof(rh) == "number") {
            QuatWK.q = QuatWK.q.Sub(rh);
        }
        return QuatWK.NormalQuat();
    };

    Mul(rh) {
        var IntWK = 0;
        var QuatWK = new N6LQuaternion(this);
        if(rh && rh.typename == "N6LQuaternion"){
            var l = new N6LQuaternion(this).NormalQuat();
            var r = new N6LQuaternion(rh).NormalQuat();
            QuatWK = new N6LQuaternion(
                l.q.x[0] * r.q.x[0] - l.q.x[1] * r.q.x[1] - l.q.x[2] * r.q.x[2] - l.q.x[3] * r.q.x[3],
                l.q.x[0] * r.q.x[1] + l.q.x[1] * r.q.x[0] + l.q.x[2] * r.q.x[3] - l.q.x[3] * r.q.x[2],
                l.q.x[0] * r.q.x[2] - l.q.x[1] * r.q.x[3] + l.q.x[2] * r.q.x[0] + l.q.x[3] * r.q.x[1],
                l.q.x[0] * r.q.x[3] + l.q.x[1] * r.q.x[2] - l.q.x[2] * r.q.x[1] + l.q.x[3] * r.q.x[0]);
        }
        else if(typeof(rh) == "number") {
            QuatWK.q = QuatWK.q.Mul(rh);
        }
        return QuatWK.NormalQuat();
    };

    Div(rh) {
        if(typeof(rh) != "number") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.Div(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var IntWK = 0;
        var QuatWK = new N6LQuaternion(this);
        if(rh == 0.0) return QuatWK;
        QuatWK.q = QuatWK.q.Div(rh);
        return QuatWK;
    };

    DivMax(eps) {
        if(!eps) eps = 1e-6;
        var l = new N6LQuaternion(this);
        var max = Math.abs(l.q.Max());
        if(max < 1.0 - eps) return l;
        return l.Div(max);
    };

    //repair//修正
    Repair(eps) {
        if(!eps) eps = 1e-6;
        var ret = new N6LQuaternion(this);
        var i;
        ret.q = ret.q.Repair(eps);
        return ret;
    };

    //square absolute//絶対値2乗
    SquareAbs() {
        var IntWK = 0;
        var DblWK = 0.0;
        var QuatWK = new N6LQuaternion(this);
        for(IntWK = 0; IntWK <4; IntWK++) DblWK += QuatWK.q.x[IntWK] * QuatWK.q.x[IntWK];
        return DblWK;
    };

    //absolute//絶対値
    Abs() {
        return Math.sqrt(this.SquareAbs());
    };

    //conjugation//共役
    ConjugationQuat() {
        return new N6LQuaternion(this.q.x[0], -this.q.x[1], -this.q.x[2], -this.q.x[3]);
    };

    //inverse//逆元
    InverseQuat() {
        if(!this.SquareAbs()) return this.ConjugationQuat();
        return this.ConjugationQuat().Div(this.SquareAbs());
    };

    //zero//ゼロ
    ZeroQuat() {
        return new N6LQuaternion([0, 0, 0, 0]);
    };

    //unit quaternion//単位四元数
    UnitQuat() {
        return new N6LQuaternion([1, 0, 0, 0]);
    };

    //normalize//ノーマライズ
    NormalQuat() {
        var wk = this.Repair().Abs();
        if(wk == 0.0) return new N6LQuaternion(this);
        return this.Div(wk);
    };

    //dot//内積
    Dot(rh) {
        if(!rh || rh.typename != "N6LQuaternion"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.Dot(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var ret = 0.0;
        var l = new N6LQuaternion(this).NormalQuat();
        var r = new N6LQuaternion(rh).NormalQuat();
        var i;
        for(i = 1; i < 4; i++) ret += l.q.x[i] * r.q.x[i];
        return ret;
    };

    //cross//外積
    Cross(rh) {
        if(!rh || rh.typename != "N6LQuaternion"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.Cross(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var l = new N6LQuaternion(this).NormalQuat();
        var r = new N6LQuaternion(rh).NormalQuat();
        var ret = new N6LVector([0,
        l.x[1] * r.x[2] - l.x[2] * r.x[1],
        l.x[2] * r.x[0] - l.x[0] * r.x[2],
        l.x[0] * r.x[1] - l.x[1] * r.x[0]]);
        return ret.NormalQuat();
    };

    //rotate axis//軸に対する回転
    RotAxisQuat(axis, theta) {
        if(!axis || axis.typename != "N6LVector"){
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.RotAxisQuat(axis, theta): Invalid axis.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var IntWK = 0;
        var QuatWK = new N6LQuaternion();
        if(axis.x.length != 3 && axis.x.length != 4) {
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.RotAxisQuat(axis, theta): Invalid axis dimensions. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var VecWK = new N6LVector(axis).NormalVec();
        if(!VecWK.bHomo) VecWK = VecWK.ToHomo();
        QuatWK.q.x[IntWK] = Math.cos(theta / 2.0);
        for(IntWK = 1; IntWK < 4; IntWK++) QuatWK.q.x[IntWK] = VecWK.x[IntWK] * Math.sin(theta / 2.0);
        return this.Mul(QuatWK).NormalQuat().Repair();
    };

    //rotate axis calc quaternion & rotvec//軸に対する回転
    RotAxisVec(rotvec) {
        if(!rotvec || rotvec.typename != "N6LVector") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.RotAxisVec(rotvec): Invalid rotvec.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var IntWK = 0;
        var axis = new N6LVector([1.0, rotvec.x[1], rotvec.x[2], rotvec.x[3]], true).NormalVec();
        var theta = rotvec.x[0];
        return this.RotAxisQuat(axis, theta).NormalQuat().Repair();     
    };

    //rotate axis //axis & theta is Array //軸に対する回転
    Axis(axis, theta) {
        //axis = new Array();
        //theta = new Array();
        var QuatWK = new N6LQuaternion(this).NormalQuat().DivMax();
        var IntWK = 0;
        theta[0] = Math.acos(QuatWK.q.x[0]) * 2.0;
        axis[0] = new N6LVector([1, 0, 0, 0], true);
        if(Math.abs(Math.sin(theta[0] / 2.0)) < 1e-6) {
            var m = QuatWK.Matrix();
            axis[0]  = new N6LVector([
                1.0,
                m.x[3].x[2] - m.x[2].x[3],
                m.x[1].x[3] - m.x[3].x[1],
                m.x[2].x[1] - m.x[1].x[2]], true).NormalVec().Repair();
            if(!axis[0].EpsEqual(new N6LVector(4, true).ZeroVec(), undefined, true)) return;
            axis[0] = new N6LVector([1, m.x[3].x[2], m.x[1].x[3], m.x[2].x[1]], true).NormalVec().Repair();
            if(axis[0].EpsEqual(new N6LVector(4, true).ZeroVec(), undefined, true)){
                //This is the more appropriate value//見なし値としてこちらのほうが妥当
                axis[0] = new N6LVector([1, Math.sqrt(Math.abs(m.x[1].x[1])), Math.sqrt(Math.abs(m.x[2].x[2])), Math.sqrt(Math.abs(m.x[3].x[3]))], true).NormalVec().Repair();
//                axis[0] = new N6LVector([1, 0, 1, 0], true).NormalVec().Repair();
            }
            return;
        }
        for(IntWK = 1; IntWK < 4; IntWK++) axis[0].x[IntWK] = QuatWK.q.x[IntWK] / Math.sin(theta[0] / 2.0);
        axis[0] = axis[0].NormalVec().Repair();
    };

    //quaternion to rotate matrix//クォータニオンから回転行列
    Matrix() {
        var q = new N6LQuaternion(this).NormalQuat();
        var MatWK = new N6LMatrix([
            [1, 0,                                                  0,                                                  0                                              ],
            [0, 1.0-2.0*q.q.x[2]*q.q.x[2]-2.0*q.q.x[3]*q.q.x[3],    2.0*q.q.x[1]*q.q.x[2]-2.0*q.q.x[0]*q.q.x[3],        2.0*q.q.x[1]*q.q.x[3]+2.0*q.q.x[0]*q.q.x[2]    ],
            [0, 2.0*q.q.x[2]*q.q.x[1]+2.0*q.q.x[0]*q.q.x[3],        1.0-2.0*q.q.x[1]*q.q.x[1]-2.0*q.q.x[3]*q.q.x[3],    2.0*q.q.x[2]*q.q.x[3]-2.0*q.q.x[0]*q.q.x[1]    ],
            [0, 2.0*q.q.x[3]*q.q.x[1]-2.0*q.q.x[0]*q.q.x[2],        2.0*q.q.x[3]*q.q.x[2]+2.0*q.q.x[0]*q.q.x[1],        1.0-2.0*q.q.x[1]*q.q.x[1]-2.0*q.q.x[2]*q.q.x[2]]]);
        if(MatWK.EpsEqual(MatWK.ZeroMat())) MatWK = MatWK.UnitMat();
        //MatWK = MatWK.SetCol(0, new N6LVector([1,1,1,1]));
        //MatWK = MatWK.SetHomo(true);
        //return MatWK.SetCol(0,new N6LVector([1,1,1,1])).NormalMat().Repair();
        return MatWK.NormalMat().Repair();
    };

    //lerp//線形補完
    Lerp(q, t) {
        if(!q || q.typename != "N6LQuaternion") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.Lerp(q, t): Invalid q.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var QuatWK = new N6LQuaternion();
        var l = new N6LQuaternion(this).NormalQuat();
        var r = new N6LQuaternion(q).NormalQuat();
        var i;
        for(i = 0; i < 4; i++) QuatWK.q.x[i] = (1.0 - t) * l.q.x[i] + t * r.q.x[i];
        return QuatWK.NormalQuat().Repair();
    };

    //slerp//球面線形補完
    Slerp(q, t) {
        if(!q || q.typename != "N6LQuaternion") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.Lerp(q, t): Invalid q.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var QuatWK = new N6LQuaternion();
        var l = new N6LQuaternion(this).NormalQuat();
        var r = new N6LQuaternion(q).NormalQuat();
        var d = l.Dot(r);
        if(1.0 < d) d = 1.0;
        var s = 1.0 - (d * d);
        var ph = Math.acos(d);
        var sp = Math.sin(ph);
        if(!sp) sp = 1.0;
        var s1;
        var s2;
        var sgn = 1.0;
        if(s == 0.0) QuatWK = new N6LQuaternion(l);
        else {
            if(d < 0.0) {
                if(Math.PI / 2.0 < ph) sgn = -1.0;
                d *= -1.0;
                ph = Math.acos(d);
                sp = Math.sin(ph);
                if(!sp) sp = 1.0;
                s1 = Math.sin(ph * (1.0 - t)) / sp;
                s2 = Math.sin(ph * t) / sp;
            }
            else {
                s1 = Math.sin(ph * (1.0 - t)) / sp;
                s2 = Math.sin(ph * t) / sp;
            }
            QuatWK = new N6LQuaternion([
                (l.q.x[0] * s1 + r.q.x[0] * s2) * sgn,
                (l.q.x[1] * s1 + r.q.x[1] * s2) * sgn,
                (l.q.x[2] * s1 + r.q.x[2] * s2) * sgn,
                (l.q.x[3] * s1 + r.q.x[3] * s2) * sgn]);
        }
        return QuatWK.NormalQuat().Repair();
    };

    //Lerp2//線形補完
    Lerp2(q, t) {
        if(!q || q.typename != "N6LQuaternion") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LQuaternion.Lerp(q, t): Invalid q.typename. Returning this.");
          }
          return new N6LQuaternion(this);
        }
        var QuatWK = new N6LQuaternion(this).NormalQuat();
        var QuatWK2 = new N6LQuaternion(q).NormalQuat();
        var d = QuatWK.Dot(QuatWK2);
        var s = Math.sqrt(1.0 - d * d);
        if(!s) s = 1.0;
        QuatWK = QuatWK.Mul(s * (1.0 - t) / s).Add(QuatWK2.Mul((s * t) / s));
        return QuatWK.NormalQuat().Repair();
    };

    //To overcome the obstacles in changing function names//関数名変更における障害の吸収のため
    Slerp2(q, t) {
      return Lerp2(q, t);
    };

    //sphere 4d//4次元球
    Sphere4D() {
        var VecWK = new N6LVector(4, true);
        var l = new N6LQuaternion(this).NormalQuat();
        var i;
        var d = Math.sqrt(2.0 * (1.0 - l.q.x[0]));
        if(!d) d = 1.0;
        VecWK.x[0] = (1.0 - l.q.x[0]) / d;
        for(i = 1; i < 4; i++) VecWK.x[i] = l.q.x[i] / d;
        return VecWK.NormalVec().Repair();
    };


}



//logarithm quaternion//対数四元数
//construction ex//構築例
//var quta = new N6LLnQuaternion(0, 0, 0);
//var quta = new N6LLnQuaternion(new Array(0, 0, 0));
//var quta = new N6LLnQuaternion(new N6LVector([0, 0, 0]));
//var quta = new N6LLnQuaternion([0, 0, 0]);
//var qutb = new N6LLnQuaternion(quta); //deep copy
//quta.q.x[0]:x quta.q.x[1]:y quta.q.x[2]:z 
class N6LLnQuaternion {

  constructor(x, y, z) {

    this.typename = "N6LLnQuaternion";
    this.q = new N6LVector(3, false);

    if(x && x.typename == "N6LLnQuaternion"){
        var i;
        for(i = 0; i < 3; i++) this.q.x[i] = x.q.x[i];
    }
    else if(x && x.typename == "N6LVector"){
        var i;
        for(i = 0; i < 3; i++) this.q.x[i] = x.x[i];
    }
    else if(Array.isArray(x)){
        var i;
        for(i = 0; i < 3; i++) this.q.x[i] = x[i];
    }
    else if(typeof(x) == "number") {
        this.q.x[0] = x;
        this.q.x[1] = y;
        this.q.x[2] = z;
    }

  }

    // --- Bit flag constants for comparison result ---
    // --- 比較結果のビットフラグ定数 ---
    static get DIFF_TYPE() { return 0x80000000; } // If the types are different // 型が異なる場合
    DIFF_QX(i) { return (0x00000001 << i); } // If the q.x[i] are different // q.x[i]が異なる場合

    Comp(rh) {
        var ret = 0;
        var i;
        if(rh && rh.typename === "N6LLnQuaternion"){
            for(i = 0; i < 3; i++) if(this.q.x[i] != rh.q.x[i]) ret |= this.DIFF_QX(i);
        }
        else ret |= N6LLnQuaternion.DIFF_TYPE;
        return ret;
    };
 
    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret === 0) return true;
        return false;
    };

    EpsComp(rh, eps) {
        if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        if(rh && rh.typename === "N6LLnQuaternion"){
            for(i = 0; i < 3; i++) if(this.q.x[i] < rh.q.x[i] - eps || rh.q.x[i] + eps < this.q.x[i]) ret |= this.DIFF_QX(i);
        }
        else ret |= N6LLnQuaternion.DIFF_TYPE;
        return ret;
    };
 
    EpsEqual(rh, eps) {
        var ret = this.EpsComp(rh, eps);
        if(ret === 0) return true;
        return false;
    };

    Str() {
        var ret = '';
        ret = this.q.Str();
        return ret;
    };

    Parse(str) {
        var ret = new N6LLnQuaternion();
        ret.q = new N6LVector().Parse(str);
        return ret;
    };


    //"x","y","z"でアクセサを取得
    GetAccessor(it) {
      var ret = -1;
      if(typeof it == "string"){
        if((it == "x")||(it == "X")) ret = 0;
        else if((it == "y")||(it == "Y")) ret = 1;
        else if((it == "z")||(it == "Z")) ret = 2;
      }
      return ret;
    }

    //"x","y","z","length","dimension"で各値を取得//"array"で内部配列への参照を返す
    Get(it) {
      if(typeof it == "string"){
        if((it == "length")||(it == "Length")) return 3;
        else if((it == "array")||(it == "Array")) return this.q.x;
        else if((it == "dimension")||(it == "Dimension")) return 3;
      }
      else {
        if(N6L_DEBUG_MODE){
          console.warn("N6LLnQuaternion.Get(it): Invalid type.(it). Returning 0.0.");
        }
        return 0.0;
      }
      var ac = this.GetAccessor(it);
      if(0 <= ac) return this.q.x[ac];
      if(N6L_DEBUG_MODE){
        console.warn("N6LLnQuaternion.Get(it): Invalid string.(it). Returning 0.0.");
      }
      return 0.0;
    }

    // { "x","y", or "z"} , val で各値にvalをセット
    Set(it, val) {
      var ac = this.GetAccessor(it);
      if(typeof val == "number") {
        if(0 <= ac) { this.q.x[ac] = val; return val; }
        if(N6L_DEBUG_MODE){
          console.warn("N6LLnQuaternion.Set(it, val): Invalid string.(it). Returning 0.0.");
        }
        return 0.0;
      }
      if(N6L_DEBUG_MODE){
        console.warn("N6LLnQuaternion.Set(it, val): Invalid type.(val). Returning 0.0.");
      }
      return 0.0;
    }

  //一般的な慣例の配置規則による構築
  Create(x){
    var ret = new N6LLnQuaternion();
    var i;
    if(Array.isArray(x)) {
        ret.q.x.length = x.length;
        for(i = 0; i < x.length; i++) ret.q.x[i] = x[i];
    }
    return ret;
  }

    //four arithmetic operations(contain convenience)//四則演算(便宜上も含む)
    Add(rh) {
        if(rh && rh.typename == "N6LLnQuaternion"){
            var IntWK = 0;
            var QuatWK = new N6LLnQuaternion(0, 0, 0);
            var l = new N6LLnQuaternion(this);
            var r = new N6LLnQuaternion(rh);
            for(IntWK = 0; IntWK < 3; IntWK++) QuatWK.q.x[IntWK] = l.q.x[IntWK] + r.q.x[IntWK];
            return QuatWK;
        }
        if(N6L_DEBUG_MODE){
          console.warn("N6LLnQuaternion.Add(rh): Invalid rh.typename. Returning this.");
        }
        return new N6LLnQuaternion(this);
    };

    Sub(rh) {
        if(rh && rh.typename == "N6LLnQuaternion"){
            var IntWK = 0;
            var QuatWK = new N6LLnQuaternion(0, 0, 0);
            var l = new N6LLnQuaternion(this);
            var r = new N6LLnQuaternion(rh);
            for(IntWK = 0; IntWK < 3; IntWK++) QuatWK.q.x[IntWK] = l.q.x[IntWK] - r.q.x[IntWK];
            return QuatWK;
        }
        if(N6L_DEBUG_MODE){
          console.warn("N6LLnQuaternion.Sub(rh): Invalid rh.typename. Returning this.");
        }
        return new N6LLnQuaternion(this);
    };

    Mul(rh) {
        if(typeof(rh) != "number") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.Mul(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        var IntWK = 0;
        var QuatWK = new N6LLnQuaternion(0, 0, 0);
        for(IntWK = 0; IntWK < 3; IntWK++) QuatWK.q.x[IntWK] = this.q.x[IntWK] * rh;
        return QuatWK;
    };

    Div(rh) {
        if(typeof(rh) != "number") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.Div(rh): Invalid rh.typename. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        var IntWK = 0;
        var QuatWK = new N6LLnQuaternion(0, 0, 0);
        if(rh == 0.0) return QuatWK;
        for(IntWK = 0; IntWK < 3; IntWK++) QuatWK.q.x[IntWK] = this.q.x[IntWK] / rh;
        return QuatWK;
    };

    DivMax(eps) {
        if(!eps) eps = 1e-6;
        var l = new N6LLnQuaternion(this);
        var max = Math.abs(l.q.Max());
        if(max < 1.0 - eps) return l;
        return l.Div(max);
    };

    //repair//修正
    Repair(eps) {
        if(!eps) eps = 1e-6;
        var ret = new N6LLnQuaternion(this);
        var i;
        ret.q = ret.q.Repair(eps);
        return ret;
    };

    //square absolute//絶対値2乗
    SquareAbs() {
        var IntWK = 0;
        var DblWK = 0.0;
        var QuatWK = new N6LLnQuaternion(this);
        for(IntWK = 0; IntWK < 3; IntWK++) DblWK += QuatWK.q.x[IntWK] * QuatWK.q.x[IntWK];
        return DblWK;
    };

    //absolute//絶対値
    Abs() {
        return Math.sqrt(this.SquareAbs());
    };

    //normalize//ノーマライズ
    NormalLnQuat() {
        var wk = this.Repair().Abs();
        if(wk == 0.0) return new N6LLnQuaternion(this);
        return this.Div(wk);
    };

    //zero//ゼロ
    ZeroLnQuat() {
        return new N6LLnQuaternion([0, 0, 0]);
    };

    //rotate axis//軸に対する回転
    RotAxisLnQuat(axis, theta) {
        if(!axis || axis.typename != "N6LVector") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.RotAxisLnQuat(axis, theta): Invalid axis.typename. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        if(axis.x.length != 3 && axis.x.length != 4) {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.RotAxisLnQuat(axis, theta): Invalid vector dimension. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        var VecWK = new N6LVector(axis).NormalVec();
        if(!VecWK.bHomo) VecWK = VecWK.ToHomo();
        var QuatWK = new N6LLnQuaternion((VecWK.Mul(theta / 2.0)).ToNormal());
        return QuatWK.Repair();
    };

    //rotate axis //axis & theta is Array //軸に対する回転
    Axis(axis, theta) {
        //axis = new Array();
        //theta = new Array();
        var IntWK = 0;
        var half = this.Abs();
        theta[0] = 2.0 * half;
        var sgn = 1.0;
        axis[0] = new N6LVector(4, true);
        if(half == 0.0) {
            axis[0] = axis[0].UnitVec(1);
            return;
        }
        for(IntWK = 1; IntWK < 4; IntWK++) axis[0].x[IntWK] = this.q.x[IntWK - 1] / half;
        //axis[0] = axis[0].NormalVec().Repair();
    };

    //lerp//線形補完
    Lerp(q, t) {
        if(!q || q.typename != "N6LLnQuaternion" || typeof(t) != "number") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.Lerp(q, t): Invalid q t typename. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        var l = new N6LLnQuaternion(this);
        var r = new N6LLnQuaternion(q);
        var LnQuatWK = l.Mul(1.0 - t).Add(r.Mul(t));
        var axis = new Array();
        var theta = new Array();
        LnQuatWK.Axis(axis, theta);
        var QuatWK = new N6LQuaternion([1, 0, 0, 0]);
        QuatWK = QuatWK.RotAxisQuat(axis[0], theta[0]);
        return QuatWK.NormalQuat().Repair();
    };

    //lerp//線形補完
    Lerp2(d0, q, d) {
        if(!Array.isArray(q) || !Array.isArray(d)) {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.Lerp2(d0, q, d): q d not array. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        var IntWK = 0;
        var l = new N6LLnQuaternion(this);
        var r = new N6LLnQuaternion(q);
        var LnQuatWK = l.Mul(d0);
        for(IntWK = 0; IntWK < r.length; IntWK++) LnQuatWK = LnQuatWK.Add(r[IntWK].Mul(d[IntWK]));
        var axis = new Array();
        var theta = new Array();
        LnQuatWK.Axis(axis, theta);
        var QuatWK = new N6LQuaternion([1, 0, 0, 0]);
        QuatWK = QuatWK.RotAxisQuat(axis[0], theta[0]);
        return QuatWK.NormalQuat().Repair();
    };

/*
    //lerp//線形補完
    Lerp(q, t) {
        if(!q || q.typename != "N6LLnQuaternion" || typeof(t) != "number") {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.Lerp(q, t): Invalid q t typename. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        var l = new N6LLnQuaternion(this).NormalLnQuat();
        var r = new N6LLnQuaternion(q).NormalLnQuat();
        var LnQuatWK = l.Mul(1.0 - t).Add(r.Mul(t));
        var axis = new Array();
        var theta = new Array();
        LnQuatWK.Axis(axis, theta);
        var QuatWK = new N6LQuaternion([1, 0, 0, 0]);
        QuatWK = QuatWK.RotAxisQuat(axis[0], theta[0]);
        return QuatWK.NormalQuat().Repair();
    };

    //lerp//線形補完
    Lerp2(d0, q, d) {
        if(!Array.isArray(q) || !Array.isArray(d)) {
          if(N6L_DEBUG_MODE){
            console.warn("N6LLnQuaternion.Lerp2(d0, q, d): q d not array. Returning this.");
          }
          return new N6LLnQuaternion(this);
        }
        var IntWK = 0;
        var l = new N6LLnQuaternion(this).NormalLnQuat();
        var r = new N6LLnQuaternion(q).NormalLnQuat();
        var LnQuatWK = l.Mul(d0);
        for(IntWK = 0; IntWK < r.length; IntWK++) LnQuatWK = LnQuatWK.Add(r[IntWK].Mul(d[IntWK]));
        var axis = new Array();
        var theta = new Array();
        LnQuatWK.Axis(axis, theta);
        var QuatWK = new N6LQuaternion(1, 0, 0, 0);
        QuatWK = QuatWK.RotAxisQuat(axis[0], theta[0]);
        return QuatWK.NormalQuat().Repair();
    };
*/
}


