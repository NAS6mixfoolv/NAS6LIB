//Programed by NAS6
//masspoint.js

//masspoint//質点
class N6LMassPoint {

  constructor(px, pv, pm, pr, pe) {

    this.typename = "N6LMassPoint"; //型名
    this.mass;                      //質点質量
    this.e;                         //軌道離心率
    this.r;                         //質点半径
    this.x = new N6LVector();       //質点座標
    this.v = new N6LVector();       //質点速度
    this.va;                        //内部計算用//速度絶対値
    this.x0 = new N6LVector();      //内部計算用
    this.x1 = new N6LVector();      //内部計算用
    this.v1 = new N6LVector();      //内部計算用
    this.v2 = new N6LVector();      //内部計算用
    this.vn = new N6LVector();      //内部計算用//速度法線
    this.w = new N6LVector();       //内部計算用
    this.w1 = new N6LVector();      //内部計算用
    this.a = new N6LVector();       //質点加速度

    if(px != undefined && px.typename == "N6LMassPoint") {
        this.mass = px.mass;
        this.e = px.e;
        this.r = px.r;
        this.x = new N6LVector(px.x);
        this.v = new N6LVector(px.v);
        this.va = px.va;
        this.x0 = new N6LVector(px.x0);
        this.x1 = new N6LVector(px.x1);
        this.v1 = new N6LVector(px.v1);
        this.v2 = new N6LVector(px.v2);
        this.vn = new N6LVector(px.vn);
        this.w = new N6LVector(px.w);
        this.w1 = new N6LVector(px.w1);
        this.a = new N6LVector(px.a);
    }
    else if(px != undefined && px.typename == "N6LVector") {
        this.mass = pm;
        this.e = pe;
        this.r = pr;
        this.x = new N6LVector(px);
        this.v = new N6LVector(pv);
        this.va = 0.0;
        this.x0 = new N6LVector(px.x.length);
        this.x1 = new N6LVector(px.x.length);
        this.v1 = new N6LVector(px.x.length);
        this.v2 = new N6LVector(px.x.length);
        this.vn = new N6LVector(px.x.length);
        this.w = new N6LVector(px.x.length);
        this.w1 = new N6LVector(px.x.length);
        this.a = new N6LVector(px.x.length);
    }
    else if(typeof(px) == "number") {
        this.mass = 0.0;
        this.e = 0.0;
        this.r = 0.0;
        this.x = new N6LVector(px);
        this.v = new N6LVector(px);
        this.va = 0.0;
        this.x0 = new N6LVector(px);
        this.x1 = new N6LVector(px);
        this.v1 = new N6LVector(px);
        this.v2 = new N6LVector(px);
        this.vn = new N6LVector(px);
        this.w = new N6LVector(px);
        this.w1 = new N6LVector(px);
        this.a = new N6LVector(px);
    }

  }

    Comp(px) {
        var ret = 0;
        var i;
        if(px.typename == "N6LMassPoint"){
            if(this.mass != px.mass) ret |= (1 << 0);
            if(this.e != px.e) ret |= (1 << 1);
            if(this.r != px.r) ret |= (1 << 2);
            if(this.x != px.x) ret |= (1 << 3);
            if(this.v != px.v) ret |= (1 << 4);
            if(this.va != px.va) ret |= (1 << 5);
            if(this.x0 != px.x0) ret |= (1 << 6);
            if(this.x1 != px.x1) ret |= (1 << 7);
            if(this.v1 != px.v1) ret |= (1 << 8);
            if(this.v2 != px.v2) ret |= (1 << 9);
            if(this.vn != px.vn) ret |= (1 << 10);
            if(this.w != px.w) ret |= (1 << 11);
            if(this.w1 != px.w1) ret |= (1 << 12);
            if(this.a != px.a) ret |= (1 << 13);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    Equal(px) {
        var ret = this.Comp(px);
        if(ret == 0) return true;
        return false;
    };

    EpsComp(px, eps) {
       if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        if(px.typename == "N6LMassPoint"){
            if(this.mass < px.mass - eps || px.mass + eps < this.mass) ret |= (1 << 0);
            if(this.e < px.e - eps || px.e + eps < this.e) ret |= (1 << 1);
            if(this.r < px.r - eps || px.r + eps < this.r) ret |= (1 << 2);
            if(!this.x.EpsEqual(px.x, eps)) ret |= (1 << 3);
            if(!this.v.EpsEqual(px.v, eps)) ret |= (1 << 4);
            if(this.va < px.va - eps || px.va + eps < this.va) ret |= (1 << 5);
            if(!this.x0.EpsEqual(px.x0, eps)) ret |= (1 << 6);
            if(!this.x1.EpsEqual(px.x1, eps)) ret |= (1 << 7);
            if(!this.v1.EpsEqual(px.v1, eps)) ret |= (1 << 8);
            if(!this.v2.EpsEqual(px.v2, eps)) ret |= (1 << 9);
            if(!this.vn.EpsEqual(px.vn, eps)) ret |= (1 << 10);
            if(!this.w.EpsEqual(px.w, eps)) ret |= (1 << 11);
            if(!this.w1.EpsEqual(px.w1, eps)) ret |= (1 << 12);
            if(!this.a.EpsEqual(px.a, eps)) ret |= (1 << 13);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    Equal(px, eps) {
        var ret = this.EpsComp(px, eps);
        if(ret == 0) return true;
        return false;
    };

}


