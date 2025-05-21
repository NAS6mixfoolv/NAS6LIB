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

    Comp(rh) {
        var ret = 0;
        var i;
        if(rh && rh.typename == "N6LQuaternion"){
            for(i = 0; i < 4; i++) if(this.q.x[i] != rh.q.x[i]) ret |= (1 << i);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret == 0) return true;
        return false;
    };

    EpsComp(rh, eps) {
        if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        if(rh && rh.typename == "N6LQuaternion"){
            for(i = 0; i < 4; i++) if(this.q.x[i] < rh.q.x[i] - eps || rh.q.x[i] + eps < this.q.x[i]) ret |= (1 << i);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    EpsEqual(rh, eps) {
        var ret = this.EpsComp(rh, eps);
        if(ret == 0) return true;
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

    //four arithmetic operations(contain convenience)//四則演算(便宜上も含む)
    Add(rh) {
        var IntWK = 0;
        var QuatWK = new N6LQuaternion(this);
        if(rh && rh.typename == "N6LQuaternion"){
            ret = new N6LVector(this);
            for(IntWK = 0; IntWK < 4; IntWK++) QuatWK.q.x[IntWK] = this.q.x[IntWK] + rh.q.x[IntWK];
        }
        else if(typeof(rh) == "number") {
            QuatWK.q = QuatWK.q.Add(rh);
        }
        return QuatWK;
    };

    Sub(rh) {
        var IntWK = 0;
        var QuatWK = new N6LQuaternion(this);
        if(rh && rh.typename == "N6LQuaternion"){
            ret = new N6LVector(this);
            for(IntWK = 0; IntWK < 4; IntWK++) QuatWK.q.x[IntWK] = this.q.x[IntWK] - rh.q.x[IntWK];
        }
        else if(typeof(rh) == "number") {
            QuatWK.q = QuatWK.q.Sub(rh);
        }
        return QuatWK;
    };

    Mul(rh) {
        var IntWK = 0;
        var QuatWK = new N6LQuaternion(this);
        if(rh && rh.typename == "N6LQuaternion"){
            QuatWK = new N6LQuaternion(
                this.q.x[0] * rh.q.x[0] - this.q.x[1] * rh.q.x[1] - this.q.x[2] * rh.q.x[2] - this.q.x[3] * rh.q.x[3],
                this.q.x[0] * rh.q.x[1] + this.q.x[1] * rh.q.x[0] + this.q.x[2] * rh.q.x[3] - this.q.x[3] * rh.q.x[2],
                this.q.x[0] * rh.q.x[2] - this.q.x[1] * rh.q.x[3] + this.q.x[2] * rh.q.x[0] + this.q.x[3] * rh.q.x[1],
                this.q.x[0] * rh.q.x[3] + this.q.x[1] * rh.q.x[2] - this.q.x[2] * rh.q.x[1] + this.q.x[3] * rh.q.x[0]);
        }
        else if(typeof(rh) == "number") {
            QuatWK.q = QuatWK.q.Mul(rh);
        }
        return QuatWK;
    };

    Div(rh) {
        if(typeof(rh) != "number") return "Error";
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
        if(wk == 0.0) return this;
        return this.Div(wk);
    };

    //dot//内積
    Dot(rh) {
        if(!rh || rh.typename != "N6LQuaternion") return "Error";
        var ret = 0.0;
        var i;
        for(i = 0; i < 4; i++) ret += this.q.x[i] * rh.q.x[i];
        return ret;
    };

    //rotate axis//軸に対する回転
    RotAxisQuat(axis, theta) {
        if(!axis || axis.typename != "N6LVector") return "Error";
        var IntWK = 0;
        var QuatWK = new N6LQuaternion();
        if(axis.x.length != 3 && axis.x.length != 4) return "Error";
        var VecWK = new N6LVector(axis).NormalVec();
        if(!VecWK.bHomo) VecWK = VecWK.ToHomo();
        QuatWK.q.x[IntWK] = Math.cos(theta / 2.0);
        for(IntWK = 1; IntWK < 4; IntWK++) QuatWK.q.x[IntWK] = VecWK.x[IntWK] * Math.sin(theta / 2.0);
        return this.Mul(QuatWK).NormalQuat().Repair();
    };

    //rotate axis calc quaternion & rotvec//軸に対する回転
    RotAxisVec(rotvec) {
        if(!rotvec || rotvec.typename != "N6LVector") return "Error";
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
                axis[0] = new N6LVector([1, Math.sqrt(Math.abs(m.x[1].x[1])), Math.sqrt(Math.abs(m.x[2].x[2])), Math.sqrt(Math.abs(m.x[3].x[3]))], true).NormalVec().Repair();
            }
            return;
        }
        for(IntWK = 1; IntWK < 4; IntWK++) axis[0].x[IntWK] = QuatWK.q.x[IntWK] / Math.sin(theta[0] / 2.0);
        axis[0] = axis[0].NormalVec().Repair();
    };

    //quaternion to rotate matrix//クォータニオンから回転行列
    Matrix() {
        var q = new N6LQuaternion(this);
        var MatWK = new N6LMatrix([
            [1, 0,                                                  0,                                                  0                                              ],
            [0, 1.0-2.0*q.q.x[2]*q.q.x[2]-2.0*q.q.x[3]*q.q.x[3],    2.0*q.q.x[1]*q.q.x[2]-2.0*q.q.x[0]*q.q.x[3],        2.0*q.q.x[1]*q.q.x[3]+2.0*q.q.x[0]*q.q.x[2]    ],
            [0, 2.0*q.q.x[2]*q.q.x[1]+2.0*q.q.x[0]*q.q.x[3],        1.0-2.0*q.q.x[1]*q.q.x[1]-2.0*q.q.x[3]*q.q.x[3],    2.0*q.q.x[2]*q.q.x[3]-2.0*q.q.x[0]*q.q.x[1]    ],
            [0, 2.0*q.q.x[3]*q.q.x[1]-2.0*q.q.x[0]*q.q.x[2],        2.0*q.q.x[3]*q.q.x[2]+2.0*q.q.x[0]*q.q.x[1],        1.0-2.0*q.q.x[1]*q.q.x[1]-2.0*q.q.x[2]*q.q.x[2]]]);
        if(MatWK.EpsEqual(MatWK.ZeroMat())) MatWK = MatWK.UnitMat();
        return MatWK.NormalMat().Repair();
    };

    //lerp//線形補完
    Lerp(q, t) {
        if(!q || q.typename != "N6LQuaternion") return "Error";
        var QuatWK = new N6LQuaternion();
        var i;
        for(i = 0; i < 4; i++) QuatWK.q.x[i] = (1.0 - t) * this.q.x[i] + t * q.q.x[i];
        return QuatWK.NormalQuat().Repair();
    };

    //slerp//球面線形補完
    Slerp(q, t) {
        if(!q || q.typename != "N6LQuaternion") return "Error";
        var QuatWK = new N6LQuaternion();
        var d = this.Dot(q);
        if(1.0 < d) d = 1.0;
        var s = 1.0 - (d * d);
        var ph = Math.acos(d);
        var sp = Math.sin(ph);
        if(!sp) sp = 1.0;
        var s1;
        var s2;
        var sgn = 1.0;
        if(s == 0.0) QuatWK = new N6LQuaternion(this);
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
                (this.q.x[0] * s1 + q.q.x[0] * s2) * sgn,
                (this.q.x[1] * s1 + q.q.x[1] * s2) * sgn,
                (this.q.x[2] * s1 + q.q.x[2] * s2) * sgn,
                (this.q.x[3] * s1 + q.q.x[3] * s2) * sgn]);
        }
        return QuatWK.NormalQuat().Repair();
    };

    //slerp//球面線形補完
    Slerp2(q, t) {
        if(!q || q.typename != "N6LQuaternion") return "Error";
        var QuatWK = new N6LQuaternion();
        var d = this.Dot(q);
        var s = Math.sqrt(1.0 - d * d);
        if(!s) s = 1.0;
        QuatWK = this.Mul(s * (1.0 - t) / s).Add(q.Mul((s * t) / s));
        return QuatWK.NormalQuat().Repair();
    };

    //sphere 4d//4次元球
    Sphere4D() {
        var VecWK = new N6LVector(4, true);
        var i;
        var d = Math.sqrt(2.0 * (1.0 - this.q.x[0]));
        if(!d) d = 1.0;
        VecWK.x[0] = (1.0 - this.q.x[0]) / d;
        for(i = 1; i < 4; i++) VecWK.x[i] = this.q.x[i] / d;
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

    Comp(rh) {
        var ret = 0;
        var i;
        if(rh && rh.typename == "N6LLnQuaternion"){
            for(i = 0; i < 3; i++) if(this.q.x[i] != rh.q.x[i]) ret |= (1 << i);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret == 0) return true;
        return false;
    };

    EpsComp(rh, eps) {
        if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        if(rh && rh.typename == "N6LLnQuaternion"){
            for(i = 0; i < 3; i++) if(this.q.x[i] < rh.q.x[i] - eps || rh.q.x[i] + eps < this.q.x[i]) ret |= (1 << i);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    EpsEqual(rh, eps) {
        var ret = this.EpsComp(rh, eps);
        if(ret == 0) return true;
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

    //four arithmetic operations(contain convenience)//四則演算(便宜上も含む)
    Add(rh) {
        if(rh && rh.typename == "N6LLnQuaternion"){
            var IntWK = 0;
            var QuatWK = new N6LLnQuaternion(0, 0, 0);
            for(IntWK = 0; IntWK < 3; IntWK++) QuatWK.q.x[IntWK] = this.q.x[IntWK] + rh.q.x[IntWK];
            return QuatWK;
        }
        else return "Error";
    };

    Sub(rh) {
        if(rh && rh.typename == "N6LLnQuaternion"){
            var IntWK = 0;
            var QuatWK = new N6LLnQuaternion(0, 0, 0);
            for(IntWK = 0; IntWK < 3; IntWK++) QuatWK.q.x[IntWK] = this.q.x[IntWK] - rh.q.x[IntWK];
            return QuatWK;
        }
        else return "Error";
    };

    Mul(rh) {
        if(typeof(rh) != "number") return "Error";
        var IntWK = 0;
        var QuatWK = new N6LLnQuaternion(0, 0, 0);
        for(IntWK = 0; IntWK < 3; IntWK++) QuatWK.q.x[IntWK] = this.q.x[IntWK] * rh;
        return QuatWK;
    };

    Div(rh) {
        if(typeof(rh) != "number") return "Error";
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

    //zero//ゼロ
    ZeroLnQuat() {
        return new N6LLnQuaternion([0, 0, 0]);
    };

    //rotate axis//軸に対する回転
    RotAxisLnQuat(axis, theta) {
        if(!axis || axis.typename != "N6LVector") return "Error";
        if(axis.x.length != 3 && axis.x.length != 4) return "Error";
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
        axis[0] = axis[0].NormalVec().Repair();
    };

    //lerp//線形補完
    Lerp(q, t) {
        if(!q || q.typename != "N6LLnQuaternion" || typeof(t) != "number") return "Error";
        var LnQuatWK = this.Mul(1.0 - t).Add(q.Mul(t));
        var axis = new Array();
        var theta = new Array();
        LnQuatWK.Axis(axis, theta);
        var QuatWK = new N6LQuaternion([1, 0, 0, 0]);
        QuatWK = QuatWK.RotAxisQuat(axis[0], theta[0]);
        return QuatWK.NormalQuat().Repair();
    };

    //lerp//線形補完
    Lerp2(d0, q, d) {
        if(!Array.isArray(q) || !Array.isArray(d)) return "Error";
        var IntWK = 0;
        var LnQuatWK = this.Mul(d0);
        for(IntWK = 0; IntWK < q.length; IntWK++) LnQuatWK = LnQuatWK.Add(q[IntWK].Mul(d[IntWK]));
        var axis = new Array();
        var theta = new Array();
        LnQuatWK.Axis(axis, theta);
        var QuatWK = new N6LQuaternion(1, 0, 0, 0);
        QuatWK = QuatWK.RotAxisQuat(axis[0], theta[0]);
        return QuatWK.NormalQuat().Repair();
    };

}


