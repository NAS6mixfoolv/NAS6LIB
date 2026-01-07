//Programed by NAS6
//masspoint.js

//masspoint//質点
class N6LMassPoint {

  constructor(px, pv, pm, pr, pe, cid = 0, lr = -1, lv = -1, lq = -1, ltime = -1, lt = -1, id = 0) {

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
    this.centerID = 0;              //重力源のID
    this.lastR = -1;                //前回の重力源との距離
    this.lastV = -1;                //前回の速度
    this.lastQ = -1;                //前回の近日点の重力源との距離
    this.lastTime = -1;             //前回の近日点時間
    this.lastT = -1;                //前回の近日点周期
    this.isDecreasing = 0;          // 距離が減少中かどうかのフラグ:0:+:-
    this.posHistory = [];           //履歴データ座標
    this.distHistory = [];          //履歴データ中心惑星からの距離
    this.thHistory = [];            //履歴データ角度

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
        this.centerID = px.centerID;
        this.lastR = px.lastR;
        this.lastV = px.lastV;
        this.lastQ = px.lastQ;
        this.lastTime = px.lastTime;
        this.lastT = px.lastT;
        this.isDecreasing = px.isDecreasing;
        var i;
        for(i = 0; i < px.posHistory; i++){
          this.posHistory[i] = new N6LVector(px.posHistory[i]);
        }
        for(i = 0; i < px.distHistory; i++){
          this.distHistory[i] = new N6LVector(px.distHistory[i]);
        }
        for(i = 0; i < px.thHistory; i++){
          this.thHistory[i] = new N6LVector(px.thHistory[i]);
        }
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
        this.centerID = cid;
        this.lastR = lr;
        this.lastV = lv;
        this.lastQ = lq;
        this.lastTime = ltime;
        this.lastT = lt;
        this.isDecreasing = id;
        this.posHistory = [];
        this.distHistory = [];
        this.thHistory = [];
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
        this.centerID = cid;
        this.lastR = lr;
        this.lastV = lv;
        this.lastQ = lq;
        this.lastTime = ltime;
        this.lastT = lt;
        this.isDecreasing = id;
        this.posHistory = [];
        this.distHistory = [];
        this.thHistory = [];
    }

  }

    // --- Bit flag constants for comparison result ---
    // --- 比較結果のビットフラグ定数 ---
    static get DIFF_TYPE() { return 0x80000000; } // If the types are different // 型が異なる場合
    static get DIFF_MASS() { return (1 << 0); } // If mass is different // mass が異なる場合
    static get DIFF_E() { return (1 << 1); } // If e is different // e が異なる場合
    static get DIFF_R() { return (1 << 2); } // If r is different // r が異なる場合
    static get DIFF_X() { return (1 << 3); } // If x is different // x が異なる場合
    static get DIFF_V() { return (1 << 4); } // If v is different // v が異なる場合
    static get DIFF_VA() { return (1 << 5); } // If va is different // va が異なる場合
    static get DIFF_X0() { return (1 << 6); } // If x0 is different // x0 が異なる場合
    static get DIFF_X1() { return (1 << 7); } // If x1 is different // x1 が異なる場合
    static get DIFF_V1() { return (1 << 8); } // If v1 is different // v1 が異なる場合
    static get DIFF_V2() { return (1 << 9); } // If v2 is different // v2 が異なる場合
    static get DIFF_VN() { return (1 << 10); } // If vn is different // vn が異なる場合
    static get DIFF_W() { return (1 << 11); } // If w is different // w が異なる場合
    static get DIFF_W1() { return (1 << 12); } // If w1 is different // w1 が異なる場合
    static get DIFF_A() { return (1 << 13); } // If a is different // a が異なる場合
    static get DIFF_CID() { return (1 << 14); } // If a is different // cid が異なる場合
    static get DIFF_LR() { return (1 << 15); } // If a is different // lr が異なる場合
    static get DIFF_LV() { return (1 << 16); } // If a is different // lv が異なる場合
    static get DIFF_LQ() { return (1 << 17); } // If a is different // lq が異なる場合
    static get DIFF_LTIME() { return (1 << 18); } // If a is different // ltime が異なる場合
    static get DIFF_LT() { return (1 << 19); } // If a is different // lt が異なる場合
    static get DIFF_ID() { return (1 << 20); } // If a is different // id が異なる場合
    static get DIFF_PH() { return (1 << 21); } // If a is different // ph が異なる場合
    static get DIFF_DH() { return (1 << 22); } // If a is different // dh が異なる場合
    static get DIFF_TH() { return (1 << 23); } // If a is different // th が異なる場合


    Comp(px) {
        var ret = 0;
        var i;
        if(px.typename === "N6LMassPoint"){
            if(this.mass !== px.mass) ret |= N6LMassPoint.DIFF_MASS;
            if(this.e !== px.e) ret |= N6LMassPoint.DIFF_E;
            if(this.r !== px.r) ret |= N6LMassPoint.DIFF_R;
            if(!this.x.Equal(px.x)) ret |= N6LMassPoint.DIFF_X;
            if(!this.v.Equal(px.v)) ret |= N6LMassPoint.DIFF_V;
            if(this.va !== px.va) ret |= N6LMassPoint.DIFF_VA;
            if(!this.x0.Equal(px.x0)) ret |= N6LMassPoint.DIFF_X0;
            if(!this.x1.Equal(px.x1)) ret |= N6LMassPoint.DIFF_X1;
            if(!this.v1.Equal(px.v1)) ret |= N6LMassPoint.DIFF_V1;
            if(!this.v2.Equal(px.v2)) ret |= N6LMassPoint.DIFF_V2;
            if(!this.vn.Equal(px.vn)) ret |= N6LMassPoint.DIFF_VN;
            if(!this.w.Equal(px.w)) ret |= N6LMassPoint.DIFF_W;
            if(!this.w1.Equal(px.w1)) ret |= N6LMassPoint.DIFF_W1;
            if(!this.a.Equal(px.a)) ret |= N6LMassPoint.DIFF_A;
            if(this.centerID !== px.centerID) ret |= N6LMassPoint.DIFF_CID;
            if(this.lastR !== px.lastR) ret |= N6LMassPoint.DIFF_LR;
            if(this.lastV !== px.lastV) ret |= N6LMassPoint.DIFF_LV;
            if(this.lastQ !== px.lastQ) ret |= N6LMassPoint.DIFF_LQ;
            if(this.lastTIME !== px.lastTIME) ret |= N6LMassPoint.DIFF_LTIME;
            if(this.lastT !== px.lastT) ret |= N6LMassPoint.DIFF_LT;
            if(this.isDecreasing !== px.isDecreasing) ret |= N6LMassPoint.DIFF_ID;
//DIFF_PH,DIFF_DH,DIFF_THは工事中
        }
        else ret |= N6LMassPoint.DIFF_TYPE;
        return ret;
    };
 
    Equal(px) {
        var ret = this.Comp(px);
        if(ret === 0) return true;
        return false;
    };

    EpsComp(px, eps) {
       if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        if(px.typename === "N6LMassPoint"){
            if(this.mass < px.mass - eps || px.mass + eps < this.mass) ret |= N6LMassPoint.DIFF_MASS;
            if(this.e < px.e - eps || px.e + eps < this.e) ret |= N6LMassPoint.DIFF_E;
            if(this.r < px.r - eps || px.r + eps < this.r) ret |= N6LMassPoint.DIFF_R;
            if(!this.x.EpsEqual(px.x, eps)) ret |= N6LMassPoint.DIFF_X;
            if(!this.v.EpsEqual(px.v, eps)) ret |= N6LMassPoint.DIFF_V;
            if(this.va < px.va - eps || px.va + eps < this.va) ret |= N6LMassPoint.DIFF_VA;
            if(!this.x0.EpsEqual(px.x0, eps)) ret |= N6LMassPoint.DIFF_X0;
            if(!this.x1.EpsEqual(px.x1, eps)) ret |= N6LMassPoint.DIFF_X1;
            if(!this.v1.EpsEqual(px.v1, eps)) ret |= N6LMassPoint.DIFF_V1;
            if(!this.v2.EpsEqual(px.v2, eps)) ret |= N6LMassPoint.DIFF_V2;
            if(!this.vn.EpsEqual(px.vn, eps)) ret |= N6LMassPoint.DIFF_VN;
            if(!this.w.EpsEqual(px.w, eps)) ret |= N6LMassPoint.DIFF_W;
            if(!this.w1.EpsEqual(px.w1, eps)) ret |= N6LMassPoint.DIFF_W1;
            if(!this.a.EpsEqual(px.a, eps)) ret |= N6LMassPoint.DIFF_A;
            if(this.centerID != px.centerID) ret |= N6LMassPoint.DIFF_CID;
            if(this.lastR < px.lastR - eps || px.lastR + eps < this.lastR) ret |= N6LMassPoint.DIFF_LR;
            if(this.lastV < px.lastV - eps || px.lastV + eps < this.lastV) ret |= N6LMassPoint.DIFF_LV;
            if(this.lastQ < px.lastQ - eps || px.lastQ + eps < this.lastQ) ret |= N6LMassPoint.DIFF_LQ;
            if(this.lastTIME < px.lastTIME - eps || px.lastTIME + eps < this.lastTIME) ret |= N6LMassPoint.DIFF_LTIME;
            if(this.lastT < px.lastT - eps || px.lastT + eps < this.lastT) ret |= N6LMassPoint.DIFF_LT;
            if(this.isDecreasing < px.isDecreasing - eps || px.isDecreasing + eps < this.isDecreasing) ret |= N6LMassPoint.DIFF_ID;
//DIFF_PH,DIFF_DH,DIFF_THは工事中
        }
        else ret |= N6LMassPoint.DIFF_TYPE;
        return ret;
    };
 
    EpsEqual(px, eps) {
        var ret = this.EpsComp(px, eps);
        if(ret === 0) return true;
        return false;
    };

    clone() {
      return new N6LMassPoint(this);
    };

}


