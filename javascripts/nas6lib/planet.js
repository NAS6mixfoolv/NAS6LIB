//Programed by NAS6
//planet.js

//planet//惑星
class N6LPlanet {

  constructor(rh) {

    this.typename = "N6LPlanet";
    this.m_earth;             //earth//地球

    this.m_pno;               //planet no.//惑星番号
    this.m_pname;             //planet name//惑星名前
    this.m_dat0 = new Date(); //datetime//日時
    this.m_nday;              //nday//1996年1月1日から何日か？
    this.m_a;                 //semi-major axis//軌道長半径
    this.m_e;                 //eccentricity//離心率
    this.m_l0;                //epoch//元期
    this.m_nperday;           //mean motion//１日の角度
    this.m_ra;                //perihelion//近日点
    this.m_rb;                //aphelion//遠日点
    this.m_t;                 //orbital period//公転周期
    this.m_s;                 //longitude of the ascending node//昇交点黄経
    this.m_i;                 //orbital inclination//軌道傾斜
    this.m_w;                 //perihelion celestial longitude//近日点黄経
    this.m_mv;                //velocity rate//速度倍率

    this.m_m;                 //mass//惑星質量
    this.m_r;                 //radius//惑星半径

    this.x0 = new N6LVector();   //position//座標
    this.v0 = new N6LVector();   //velocity//速度
    this.ex = new N6LVector();   //geocentric coordinates//地心座標

    this.m_el;                //celestial longitude//黄経
    this.m_d;                 //aberration//光行差

    this.m_asc;               //ascendant//アセンダント
    this.m_hs = new Array();  //house//ハウス

    this.m_rev;               //reverse//逆行

    this.CNST_G = 0.00000000006673;
    this.CNST_C = 299792458.0;
    this.CNST_AU = 149597870700.0;
    this.CNST_DR = 0.017453292519943;
    this.CNST_TAU = 499.004782;
    
    this.m_ono = 1;



    if(rh != undefined && rh.typename == "N6LPlanet") {
      this.typename = rh.typename;
      this.m_earth = rh.m_earth;
      this.m_pno = rh.m_pno;
      this.m_pname = rh.m_pname;
      this.m_dat0 = new Date(rh.m_dat0);
      this.m_nday = rh.m_nday;
      this.m_a = rh.m_a;
      this.m_e = rh.m_e;
      this.m_l0 = rh.m_l0;
      this.m_nperday = rh.m_nperday;
      this.m_ra = rh.m_nperday;
      this.m_rb = rh.m_rb;
      this.m_t = rh.m_t;
      this.m_s = rh.m_s;
      this.m_i = rh.m_i;
      this.m_w = rh.m_w;
      this.m_mv = rh.m_mv;
      this.m_m = rh.m_m;
      this.m_r = rh.m_r;
      this.x0 = new N6LVector(rh.x0);
      this.v0 = new N6LVector(rh.v0);
      this.ex = new N6LVector(rh.ex);
      this.m_el = rh.m_el;
      this.m_d = rh.m_d;
      this.m_asc = rh.m_asc;
      this.m_rev = rh.m_rev;
      this.CNST_G = rh.CNST_G;
      this.CNST_C = rh.CNST_C;
      this.CNST_AU = rh.CNST_AU;
      this.CNST_DR = rh.CNST_DR;
      this.CNST_TAU = rh.CNST_TAU;
      this.m_ono = rh.m_ono;

      this.m_hs = new Array();
      var i;
      for(i = 0; i < rh.m_hs.length; i++) this.m_hs[i] = rh.m_hs[i];
    }
  }

    // --- Bit flag constants for comparison result ---
    // --- 比較結果のビットフラグ定数 ---
    static get DIFF_TYPE() { return 0x80000000; } // If the types are different // 型が異なる場合

    // Individual property differences // 個別プロパティの差異
    static get DIFF_PNO() { return (1 << 0); } // If m_pno is different // m_pno が異なる場合
    static get DIFF_PNAME() { return (1 << 1); } // If m_pname is different // m_pname が異なる場合
    static get DIFF_DAT0() { return (1 << 2); } // If m_dat0 is different (be careful when comparing Date objects) // m_dat0 が異なる場合 (Dateオブジェクトの比較に注意)
    static get DIFF_NDAY() { return (1 << 3); } // If m_nday is different // m_nday が異なる場合
    static get DIFF_A() { return (1 << 4); } // If m_a is different // m_a が異なる場合
    static get DIFF_E() { return (1 << 5); } // If m_e is different // m_e が異なる場合
    static get DIFF_L0() { return (1 << 6); } // If m_l0 is different // m_l0 が異なる場合
    static get DIFF_NPERDAY() { return (1 << 7); } // If m_nperday is different // m_nperday が異なる場合
    static get DIFF_RA() { return (1 << 8); } // If m_ra is different // m_ra が異なる場合
    static get DIFF_RB() { return (1 << 9); } // If m_rb is different // m_rb が異なる場合
    static get DIFF_T() { return (1 << 10); } // If m_t is different // m_t が異なる場合
    static get DIFF_S() { return (1 << 11); } // If m_s is different // m_s が異なる場合
    static get DIFF_I() { return (1 << 12); } // If m_i is different // m_i が異なる場合
    static get DIFF_W() { return (1 << 13); } // If m_w is different // m_w が異なる場合
    static get DIFF_MV() { return (1 << 14); } // If m_mv is different // m_mv が異なる場合
    static get DIFF_M() { return (1 << 15); } // If m_m (mass) is different // m_m (mass) が異なる場合
    static get DIFF_R() { return (1 << 16); } // If m_r (radius) is different // m_r (radius) が異なる場合

    // Nested object differences (using child object's comparison result directly or by specific flag)
    // It is possible to use the return value of Comp/EpsComp of N6LVector by ANDing it as it is, but
    // Assign an independent bit to indicate which N6LVector is different as the return value of Comp/EpsComp of N6LPlanet
    // ネストされたオブジェクトの差異 (子オブジェクトの比較結果を直接利用、または専用フラグ)
    // N6LVectorのComp/EpsCompの返り値をそのままANDして使うことも可能ですが、
    // N6LPlanetのComp/EpsCompの戻り値としてどのN6LVectorが異なるかを表す独立したビットを割り当てます
    static get DIFF_X0() { return (1 << 17); } // If x0 (N6LVector) is different // x0 (N6LVector) が異なる場合
    static get DIFF_V0() { return (1 << 18); } // v0 (N6LVector) is different // v0 (N6LVector) が異なる場合
    static get DIFF_EX() { return (1 << 19); } // ex (N6LVector) is different // ex (N6LVector) が異なる場合

    // Remaining properties // 残りのプロパティ
    static get DIFF_EL() { return (1 << 20); } // m_el is different // m_el が異なる場合
    static get DIFF_D() { return (1 << 21); } // m_d is different // m_d が異なる場合
    static get DIFF_ASC() { return (1 << 22); } // m_asc is different // m_asc が異なる場合
    static get DIFF_HS_LENGTH() { return (1 << 23); } // m_hs is different length (see below for comparing array elements) // m_hs の長さが異なる場合 (配列要素の比較は後述)
    static get DIFF_REV() { return (1 << 24); } // m_rev is different // m_rev が異なる場合

    // Physical Model Constants // 物理モデルの定数
    static get DIFF_CNST_G() { return (1 << 25); } // If CNST_G is different // CNST_G が異なる場合
    static get DIFF_CNST_C() { return (1 << 26); } // If CNST_C is different // CNST_C が異なる場合
    static get DIFF_CNST_AU() { return (1 << 27); } // If CNST_AU is different // CNST_AU が異なる場合
    static get DIFF_CNST_DR() { return (1 << 28); } // If CNST_DR is different // CNST_DR が異なる場合
    static get DIFF_CNST_TAU() { return (1 << 29); } // If CNST_TAU is different // CNST_TAU が異なる場合

    // 0x80000000 is reserved for DIFF_TYPE
    // Up to the 31st bit can be used (within the signed 32-bit integer range of JavaScript)
    // If there are properties beyond that, consider using multiple ret values ??or returning the results in an array.
    // 0x80000000 はDIFF_TYPEに予約済み
    // 31ビット目まで利用可能 (JavaScriptの符号付き32ビット整数範囲内)
    // それ以降のプロパティがある場合は、複数のret値を使うか、配列で結果を返すことを検討


    //比較関数：lhとrhの値が違う項目のビット立て
    Comp(rh) {
        var ret = 0;
        var i;
        if(rh.typename == "N6LPlanet"){
            if(this.m_pno !== rh.m_pno) ret |= N6LPlanet.DIFF_PNO;
            if(this.m_pname !== rh.m_pname) ret |= N6LPlanet.DIFF_PNAME;
            if(this.m_dat0.getTime() !== rh.m_dat0.getTime()) ret |= N6LPlanet.DIFF_DAT0;
            if(this.m_nday !== rh.m_nday) ret |= N6LPlanet.DIFF_NDAY;
            if(this.m_a !== rh.m_a) ret |= N6LPlanet.DIFF_A;
            if(this.m_e !== rh.m_e) ret |= N6LPlanet.DIFF_E;
            if(this.m_l0 !== rh.m_l0) ret |= N6LPlanet.DIFF_L0;
            if(this.m_nperday !== rh.m_nperday) ret |= N6LPlanet.DIFF_NPERDAY;
            if(this.m_ra !== rh.m_ra) ret |= N6LPlanet.DIFF_RA;
            if(this.m_rb !== rh.m_rb) ret |= N6LPlanet.DIFF_RB;
            if(this.m_t !== rh.m_t) ret |= N6LPlanet.DIFF_T;
            if(this.m_s !== rh.m_s) ret |= N6LPlanet.DIFF_S;
            if(this.m_i !== rh.m_i) ret |= N6LPlanet.DIFF_I;
            if(this.m_w !== rh.m_w) ret |= N6LPlanet.DIFF_W;
            if(this.m_mv !== rh.m_mv) ret |= N6LPlanet.DIFF_MV;
            if(this.m_m !== rh.m_m) ret |= N6LPlanet.DIFF_M;
            if(this.m_r !== rh.m_r) ret |= N6LPlanet.DIFF_R;
            if(this.x0 !== rh.x0) ret |= N6LPlanet.DIFF_X0;
            if(this.v0 !== rh.v0) ret |= N6LPlanet.DIFF_V0;
            if(this.ex !== rh.ex) ret |= N6LPlanet.DIFF_EX;
            if(this.m_el !== rh.m_el) ret |= N6LPlanet.DIFF_EL;
            if(this.m_d !== rh.m_d) ret |= N6LPlanet.DIFF_D;
            if(this.m_asc !== rh.m_asc) ret |= N6LPlanet.DIFF_ASC;
            if(this.m_hs.length !== rh.m_hs.length) ret |= N6LPlanet.DIFF_HS_LENGTH;
            if(this.m_rev !== rh.m_rev) ret |= N6LPlanet.DIFF_REV;
            if(this.CNST_G !== rh.CNST_G) ret |= N6LPlanet.DIFF_CNST_G;
            if(this.CNST_C !== rh.CNST_C) ret |= N6LPlanet.DIFF_CNST_C;
            if(this.CNST_AU !== rh.CNST_AU) ret |= N6LPlanet.DIFF_CNST_AU;
            if(this.CNST_DR !== rh.CNST_DR) ret |= N6LPlanet.DIFF_CNST_DR;
            if(this.CNST_TAU !== rh.CNST_TAU) ret |= N6LPlanet.DIFF_CNST_TAU;
        }
        else ret |= N6LPlanet.DIFF_TYPE;
        return ret;
    };
 
    //比較関数：lhとrhの値が同じか？
    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret === 0) return true;
        return false;
    };

    //比較関数：lhとrhの値が違う項目のビット立てepsで同値に幅
    EpsComp(rh, eps) {
       if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        if(rh.typename == "N6LPlanet"){
            if(this.m_pno !== rh.m_pno) ret |= N6LPlanet.DIFF_PNO;
            if(this.m_pname !== rh.m_pname) ret |= N6LPlanet.DIFF_PNAME;
            if(Math.abs(this.m_dat0.getTime() - rh.m_dat0.getTime()) > eps) ret |= N6LPlanet.DIFF_DAT0;
            if(this.m_nday < rh.m_nday - eps || rh.m_nday + eps < this.m_nday) ret |= N6LPlanet.DIFF_NDAY;
            if(this.m_a < rh.m_a - eps || rh.m_a + eps < this.m_a) ret |= N6LPlanet.DIFF_A;
            if(this.m_e < rh.m_e - eps || rh.m_e + eps < this.m_e) ret |= N6LPlanet.DIFF_E;
            if(this.m_l0 < rh.m_l0 - eps || rh.m_l0 + eps < this.m_l0) ret |= N6LPlanet.DIFF_L0;
            if(this.m_nperday < rh.m_nperday - eps || rh.m_nperday + eps < this.m_nperday) ret |= N6LPlanet.DIFF_NPERDAY;
            if(this.m_ra < rh.m_ra - eps || rh.m_ra + eps < this.m_ra) ret |= N6LPlanet.DIFF_RA;
            if(this.m_rb < rh.m_rb - eps || rh.m_rb + eps < this.m_rb) ret |= N6LPlanet.DIFF_RB;
            if(this.m_t < rh.m_t - eps || rh.m_t + eps < this.m_t) ret |= N6LPlanet.DIFF_T;
            if(this.m_s < rh.m_s - eps || rh.m_s + eps < this.m_s) ret |= N6LPlanet.DIFF_S;
            if(this.m_i < rh.m_i - eps || rh.m_i + eps < this.m_i) ret |= N6LPlanet.DIFF_I;
            if(this.m_w < rh.m_w - eps || rh.m_w + eps < this.m_w) ret |= N6LPlanet.DIFF_W;
            if(this.m_mv < rh.m_mv - eps || rh.m_mv + eps < this.m_mv) ret |= N6LPlanet.DIFF_MV;
            if(this.m_m < rh.m_m - eps || rh.m_m + eps < this.m_m) ret |= N6LPlanet.DIFF_M;
            if(this.m_r < rh.m_r - eps || rh.m_r + eps < this.m_r) ret |= N6LPlanet.DIFF_R;
            if(!this.x0.EpsEqual(rh.x0, eps)) ret |= N6LPlanet.DIFF_X0;
            if(!this.x0.EpsEqual(rh.v0, eps)) ret |= N6LPlanet.DIFF_V0;
            if(!this.ex.EpsEqual(rh.ex, eps)) ret |= N6LPlanet.DIFF_EX;
            if(this.m_el < rh.m_el - eps || rh.m_el + eps < this.m_el) ret |= N6LPlanet.DIFF_EL;
            if(this.m_d < rh.m_d - eps || rh.m_d + eps < this.m_d) ret |= N6LPlanet.DIFF_D;
            if(this.m_asc < rh.m_asc - eps || rh.m_asc + eps < this.m_asc) ret |= N6LPlanet.DIFF_ASC;
            if(this.m_hs.length != rh.m_hs.length) ret |= N6LPlanet.DIFF_HS_LENGTH;
            if(this.m_rev != rh.m_rev) ret |= N6LPlanet.DIFF_REV;
            if(this.CNST_G != rh.CNST_G) ret |= N6LPlanet.DIFF_CNST_G;
            if(this.CNST_C != rh.CNST_C) ret |= N6LPlanet.DIFF_CNST_C;
            if(this.CNST_AU != rh.CNST_AU) ret |= N6LPlanet.DIFF_CNST_AU;
            if(this.CNST_DR != rh.CNST_DR) ret |= N6LPlanet.DIFF_CNST_DR;
            if(this.CNST_TAU != rh.CNST_TAU) ret |= N6LPlanet.DIFF_CNST_TAU;
        }
        else ret |= N6LPlanet.DIFF_TYPE;
        return ret;
    };
 
    //比較関数：lhとrhの値が同じか？epsで同値に幅
    EpsEqual(rh, eps) {
        var ret = this.EpsComp(rh, eps);
        if(ret === 0) return true;
        return false;
    };

    //construction//構築
    Create(pno, pname, nday, dat0, aa, ae, al0, anperday, ara, arb, at, aas, ai, aw, am, ar, amv) {
        this.m_pno = pno;              //planet no.//惑星番号
        this.m_pname = pname;          //planet name//惑星名前
        this.m_dat0 = dat0;            //datetime//日時
        this.m_a = aa;                 //semi-major axis//軌道長半径
        this.m_e = ae;                 //eccentricity//離心率
        this.m_l0 = al0;               //epoch//元期
        this.m_nperday = anperday;     //mean motion//１日の角度
        this.m_ra = ara;               //perihelion//近日点
        this.m_rb = arb;               //aphelion//遠日点
        this.m_t = at;                 //orbital period//公転周期
        this.m_s = aas;                //longitude of the ascending node//昇交点黄経
        this.m_i = ai;                 //orbital inclination//軌道傾斜
        this.m_w = aw;                 //perihelion celestial longitude//近日点黄経
        this.m_m = am;                 //mass//惑星質量
        this.m_r = ar;                 //radius//惑星半径
        this.m_mv = amv;               //velocity rate//速度倍率

        this.m_ono = 0;
        //orbital position from kepler//ケプラー方程式から座標を求める
        var xx = new Array(new N6LVector(3));
        var vv = new Array(new N6LVector(3));
        var f = this.kepler(nday, xx, vv);
        this.x0 = new N6LVector([xx[0].x[0], xx[0].x[1], 0]);
        this.v0 = new N6LVector([vv[0].x[0], vv[0].x[1], 0]);

        //xyz to ecliptic//xyz系を日心黄道直交座標系に変換
        var xyz = new Array(new N6LVector(3));
        this.ecliptic(this.x0.x[0], this.x0.x[1], this.x0.x[2], xyz);
        if(isNaN(xyz[0].x[0]) || isNaN(xyz[0].x[1]) || isNaN(xyz[0].x[2])) {
            this.x0.x[0] = 0.0;
            this.x0.x[1] = 0.0;
            this.x0.x[2] = 0.0;
        }
        else {
            this.x0.x[0] = xyz[0].x[0];
            this.x0.x[1] = xyz[0].x[1];
            this.x0.x[2] = xyz[0].x[2];
        }

        var xyz2 = new Array(new N6LVector(3));
        this.ecliptic(this.v0.x[0], this.v0.x[1], this.v0.x[2], xyz2);
        if(isNaN(xyz2[0].x[0]) || isNaN(xyz2[0].x[1]) || isNaN(xyz2[0].x[2])) {
            this.v0.x[0] = 0.0;
            this.v0.x[1] = 0.0;
            this.v0.x[2] = 0.0;
        }
        else {
            this.v0.x[0] = xyz2[0].x[0];
            this.v0.x[1] = xyz2[0].x[1];
            this.v0.x[2] = xyz2[0].x[2];
        }

    };

    //construction earth//構築地球
    CreateEarth(pno, pname, nday, dat0, aa, ae, al0, anperday, ara, arb, at, aas, ai, aw, am, ar) {
        this.m_pno = pno;              //planet no.//惑星番号
        this.m_pname = pname;          //planet name//惑星名前
        this.m_dat0 = dat0;            //datetime//日時
        this.m_nday = nday;            //nday//1996年1月1日から何日か？
        this.m_a = aa;                 //semi-major axis//軌道長半径
        this.m_e = ae;                 //eccentricity//離心率
        this.m_l0 = al0;               //epoch//元期
        this.m_nperday = anperday;     //mean motion//１日の角度
        this.m_ra = ara;               //perihelion//近日点
        this.m_rb = arb;               //aphelion//遠日点
        this.m_t = at;                 //orbital period//公転周期
        this.m_s = aas;                //longitude of the ascending node//昇交点黄経
        this.m_i = ai;                 //orbital inclination//軌道傾斜
        this.m_w = aw;                 //perihelion celestial longitude//近日点黄経
        this.m_m = am;                 //mass//惑星質量
        this.m_r = ar;                 //radius//惑星半径
        this.m_earth = this;           //地球への参照
        this.m_rev = false;            //逆行か？

        this.x0 = new N6LVector(3);    //座標
        this.ex = new N6LVector(3);    //地心座標

        this.Init(nday);               //惑星初期化
    };

    //construction planet//構築惑星
    CreatePlanet(pno, pname, nday, dat0, aa, ae, al0, anperday, ara, arb, at, aas, ai, aw, am, ar, earth) {
        this.m_pno = pno;              //planet no.//惑星番号
        this.m_pname = pname;          //planet name//惑星名前
        this.m_dat0 = dat0;            //datetime//日時
        this.m_nday = nday;            //nday//1996年1月1日から何日か？
        this.m_a = aa;                 //semi-major axis//軌道長半径
        this.m_e = ae;                 //eccentricity//離心率
        this.m_l0 = al0;               //epoch//元期
        this.m_nperday = anperday;     //mean motion//１日の角度
        this.m_ra = ara;               //perihelion//近日点
        this.m_rb = arb;               //aphelion//遠日点
        this.m_t = at;                 //orbital period//公転周期
        this.m_s = aas;                //longitude of the ascending node//昇交点黄経
        this.m_i = ai;                 //orbital inclination//軌道傾斜
        this.m_w = aw;                 //perihelion celestial longitude//近日点黄経
        this.m_m = am;                 //mass//惑星質量
        this.m_r = ar;                 //radius//惑星半径
        this.m_earth = earth;          //地球への参照
        this.m_rev = false;            //逆行か？

        this.x0 = new N6LVector(3);    //座標
        this.ex = new N6LVector(3);    //地心座標

        this.Init(nday);               //惑星初期化

        //reverse decision//リバース判定用
        this.m_earth.recompute(nday - 1.0);
        this.Init(nday - 1.0);

        this.ex = new N6LVector([
            this.x0.x[0] - this.m_earth.x0.x[0],
            this.x0.x[1] - this.m_earth.x0.x[1],
            this.x0.x[2] - this.m_earth.x0.x[2]]);

        this.m_el = Math.atan(this.ex.x[1] / this.ex.x[0]);
        if(this.ex.x[0] < 0.0) this.m_el += Math.PI;
        this.m_el = (this.m_el / this.CNST_DR) % 360.0;
        if(this.m_el < 0.0) this.m_el += 360.0;

        var xx = this.m_el;

        this.x0 = new N6LVector(3);
        this.ex = new N6LVector(3);

        //recompute earth//地球位置再計算して計算
        this.m_earth.recompute(nday);
        this.Init(nday);

        this.ex = new N6LVector([
            this.x0.x[0] - this.m_earth.x0.x[0],
            this.x0.x[1] - this.m_earth.x0.x[1],
            this.x0.x[2] - this.m_earth.x0.x[2]]);

        this.m_el = Math.atan(this.ex.x[1] / this.ex.x[0]);
        if(this.ex.x[0] < 0.0) this.m_el += Math.PI;
        this.m_el = (this.m_el / this.CNST_DR) % 360.0;
        if(this.m_el < 0.0) this.m_el += 360.0;

        //aberration//惑星光行差
        var msecPerMinute = 1000 * 60;
        var msecPerHour = msecPerMinute * 60;
        var msecPerDay = msecPerHour * 24;
        this.m_d = this.ex.Abs();
        var tau = this.m_d * this.CNST_TAU / 86400.0 / msecPerDay / 86400.0;

        this.Init(nday - tau)

        this.ex = new N6LVector([
            this.x0.x[0] - this.m_earth.x0.x[0],
            this.x0.x[1] - this.m_earth.x0.x[1],
            this.x0.x[2] - this.m_earth.x0.x[2]]);

        this.m_el = Math.atan(this.ex.x[1] / this.ex.x[0]);
        if(this.ex.x[0] < 0.0) this.m_el += Math.PI;
        this.m_el = (this.m_el / this.CNST_DR) % 360.0;
        if(this.m_el < 0.0) this.m_el += 360.0;

        this.m_d = this.ex.Abs();
        this.ex.x[0] = this.ex.x[0] / this.CNST_DR;
        this.ex.x[1] = this.ex.x[1] / this.CNST_DR;
        this.ex.x[2] = this.ex.x[2] / this.CNST_DR;

        if((0.0 < xx - this.m_el && xx < 359.0) || (xx - this.m_el < 0.0 && 359.0 < xx && this.m_el < 1.0))
            this.m_rev = true;

    };

    //construction moon//構築月
    CreateMoon(pno, pname, nday, dat0, add, earth, bbb) {

        this.m_pno = pno;              //planet no.//惑星番号
        this.m_pname = pname;          //planet name//惑星名前
        this.m_dat0 = dat0;            //datetime//日時
        this.m_nday = nday + add;      //nday//1996年1月1日から何日か？
        this.m_a = 0.0;                //not use//使わない
        this.m_e = 0.0;                //not use//使わない
        this.m_l0 = 0.0;               //not use//使わない
        this.m_nperday = 0.0;          //not use//使わない
        this.m_ra = 0.0;               //not use//使わない
        this.m_rb = 0.0;               //not use//使わない
        this.m_t = 0.0;                //not use//使わない
        this.m_s = 0.0;                //not use//使わない
        this.m_i = 0.0;                //not use//使わない
        this.m_w = 0.0;                //not use//使わない
        this.m_m = 0.0;                //not use//使わない
        this.m_r = 0.0;                //not use//使わない
        this.m_earth = earth;          //地球への参照
        this.m_el = 0.0;               //celestial longitude//黄経
        this.m_d = 0.0;                //not use//使わない
        this.m_rev = false;            //逆行か？

        this.x0 = new N6LVector(3);    //position//座標

        var dat1 = new Date(1974, 12 - 1, 31, 0, 0, 0);
        var msecPerMinute = 1000 * 60;
        var msecPerHour = msecPerMinute * 60;
        var msecPerDay = msecPerHour * 24;
        var dat0Msec = this.m_dat0.getTime();
        var dat1Msec = dat1.getTime();
        var interval = dat0Msec - dat1Msec;

        var days = Math.ceil(this.m_nday);
        var times = this.m_nday - days;
        var hh = Math.floor(times * 24.0);
        var mm = Math.floor(times * 24.0 * 60.0) % 60;
        var ss = Math.floor(times * 24.0 * 60.0 * 60.0) % 60;
        var dat = dat0Msec + this.m_nday * msecPerDay;
        var dats = dat - dat1Msec;
        var z = Math.floor(dats / msecPerDay);
        var tt = z / 365.2425;
        var t = tt + (0.0317 * tt + 1.43) * 0.000001;

        //reverse decision//リバース判定用
        dat = dat0Msec + (this.m_nday - 1) * msecPerDay;
        dats = dat - dat1Msec;
        z = Math.floor(dats / msecPerDay);
        tt = z / 365.2425;
        t = tt + (0.0317 * tt + 1.43) * 0.000001;
   
        this.InitMoon(t);

        this.m_el = this.ex.x[0] % 360.0;
        if(this.m_el < 0.0) this.m_el += 360.0;

        var xx = this.m_el;

        //recompute//再計算
        dat = dat0Msec + this.m_nday * msecPerDay;
        dats = dat - dat1Msec;
        z = Math.floor(dats / msecPerDay);
        tt = z / 365.2425;
        t = tt + (0.0317 * tt + 1.43) * 0.000001;

        this.InitMoon(t);

        this.m_el = this.ex.x[0] % 360.0;
        if(this.m_el < 0.0) this.m_el += 360.0;

        if((0.0 < xx - this.m_el && xx < 359.0) || (xx - this.m_el < 0.0 && 359.0 < xx && this.m_el < 1.0))
            this.m_rev = true;

    };

    //construction config//構築星座
    CreateConfig(pno, pname, nday, dat0, ax, earth) {

        this.m_pno = pno;              //planet no.//惑星番号
        this.m_pname = pname;          //planet name//惑星名前
        this.m_dat0 = dat0;            //datetime//日時
        this.m_nday = nday;            //nday//1996年1月1日から何日か？
        this.m_a = 0.0;                //not use//使わない
        this.m_e = 0.0;                //not use//使わない
        this.m_l0 = 0.0;               //not use//使わない
        this.m_nperday = 0.0;          //not use//使わない
        this.m_ra = 0.0;               //not use//使わない
        this.m_rb = 0.0;               //not use//使わない
        this.m_t = 0.0;                //not use//使わない
        this.m_s = 0.0;                //not use//使わない
        this.m_i = 0.0;                //not use//使わない
        this.m_w = 0.0;                //not use//使わない
        this.m_m = 0.0;                //not use//使わない
        this.m_r = 0.0;                //not use//使わない
        this.m_earth = earth;          //地球への参照
        this.m_el = ax;                //celestial longitude//黄経
        this.m_d = 0.0;                //not use//使わない
        this.m_rev = false;            //逆行か？



        this.x0 = new N6LVector(3);    //座標
        this.ex = new N6LVector(3);    //地心座標
        this.ex.x[0] = ax;
        this.ex.x[1] = 0.0;
        this.ex.x[2] = 0.0;
    };

    //construction etc//構築その他
    CreateEtc(pno, pname, nday, dat0, sw, earth) {


        this.m_pno = pno;              //planet no.//惑星番号
        this.m_pname = pname;          //planet name//惑星名前
        this.m_dat0 = dat0;            //datetime//日時
        this.m_nday = nday;            //nday//1996年1月1日から何日か？
        this.m_a = 0.0;                //not use//使わない
        this.m_e = 0.0;                //not use//使わない
        this.m_l0 = 0.0;               //not use//使わない
        this.m_nperday = 0.0;          //not use//使わない
        this.m_ra = 0.0;               //not use//使わない
        this.m_rb = 0.0;               //not use//使わない
        this.m_t = 0.0;                //not use//使わない
        this.m_s = 0.0;                //not use//使わない
        this.m_i = 0.0;                //not use//使わない
        this.m_w = 0.0;                //not use//使わない
        this.m_m = 0.0;                //not use//使わない
        this.m_r = 0.0;                //not use//使わない
        this.m_earth = earth;          //地球への参照
        this.m_el = 0.0;               //celestial longitude//黄経
        this.m_d = 0.0;                //not use//使わない
        this.m_rev = false;            //逆行か？

        this.x0 = new N6LVector(3);    //座標
        this.ex = new N6LVector(3);    //地心座標

        if(sw == 0) { //Lilith//リリス
            var dat = new Date(1996, 7, 1);
            this.m_nperday = (0.975) * (131.1 - 120.53) / (92.0);
            this.m_el = (120.53 + m_nperday * nday) % 360.0;
            if(this.m_el < 0.0) this.m_el += 360.0;
            this.ex.x[0] = this.m_el;
        }
        else if(sw == 1) { //dragon head//ドラゴンヘッド
            var dat = new Date(1996, 7, 1);
            this.m_nperday = (187.56 - 192.48) / (92.0);
            this.m_el = (192.48 + m_nperday * nday) % 360.0;
            if(this.m_el < 0.0) this.m_el += 360.0;
            this.ex.x[0] = this.m_el;
            this.m_rev = true;
        }
        else if(sw == 2) { //dragon tail//ドラゴンテイル
            var dat = new Date(1996, 7, 1);
            this.m_nperday = (187.56 - 192.48) / (92.0);
            this.m_el = (192.48 + m_nperday * nday + 180.0) % 360.0;
            if(this.m_el < 0.0) this.m_el += 360.0;
            this.ex.x[0] = this.m_el;
            this.m_rev = true;
        }
        else if(sw == 3) { //no include asc include N6LPlanet(i,0).m_hs(0)//asc何も入らないN6LPlanet(i,0).m_hs(0)に入ってる
            this.m_el = 0.0;
            if(this.m_el < 0.0) this.m_el += 360.0;
            this.ex.x[0] = this.m_el;
        }
        else if(sw == 4) { //no include mc include N6LPlanet(i,0).m_hs(9)//mc何も入らないN6LPlanet(i,0).m_hs(9)に入ってる
            this.m_el = 0.0;
            if(this.m_el < 0.0) this.m_el += 360.0;
            this.ex.x[0] = this.m_el;
        }

    };

    //recompute earth//地球再計算
    recompute(nday) {
        this.m_nday = nday;
        this.x0 = new N6LVector(3);
        this.ex = new N6LVector(3);

        this.Init(nday);
    };

    //init moon//月初期化
    InitMoon(t) {
        this.ex = new N6LVector(3);

        //Inputed data by MIJU
        var a          = 0.004 * Math.sin(93.8 - 1.33 * t)
                       + 0.002 * Math.sin(248.6 - 19.34 * t)
                       + 0.0006 * Math.sin(66.0 + 0.2 * t)
                       + 0.0006 * Math.sin(249.0 - 19.3 * t);

        this.ex.x[0]   = 124.8754 + 4812.67881 * t
                       + 6.2887 * Math.sin(338.915 + 4771.9886 * t + a)
                       + 1.274 * Math.sin(107.248 - 4133.3526 * t)
                       + 0.6583 * Math.sin(51.668 + 8905.3422 * t)
                       + 0.2136 * Math.sin(317.831 + 9543.9773 * t)
                       + 0.1856 * Math.sin(176.531 + 359.9905 * t)

                       + 0.1143 * Math.sin(292.463 + 9664.0404 * t)
                       + 0.0588 * Math.sin(86.16 + 638.635 * t)
                       + 0.0572 * Math.sin(103.78 - 3773.363 * t)
                       + 0.0533 * Math.sin(30.58 + 13677.331 * t)
                       + 0.0459 * Math.sin(124.86 - 8545.352 * t)

                       + 0.041 * Math.sin(342.38 + 4411.998 * t)
                       + 0.0348 * Math.sin(25.83 + 4452.671 * t)
                       + 0.0305 * Math.sin(155.45 + 5131.979 * t)
                       + 0.0153 * Math.sin(240.79 + 758.698 * t)
                       + 0.0125 * Math.sin(271.38 + 14436.029 * t)

                       + 0.011 * Math.sin(226.45 - 4892.052 * t)
                       + 0.0107 * Math.sin(55.58 - 13038.696 * t)
                       + 0.01 * Math.sin(296.75 + 14315.966 * t)
                       + 0.0085 * Math.sin(34.5 - 8266.71 * t)
                       + 0.0079 * Math.sin(290.7 - 4493.34 * t)

                       + 0.0068 * Math.sin(228.2 + 9265.33 * t)
                       + 0.0052 * Math.sin(133.1 + 319.32 * t)
                       + 0.005 * Math.sin(202.4 + 4812.66 * t)
                       + 0.0048 * Math.sin(68.6 - 19.34 * t)
                       + 0.004 * Math.sin(34.1 + 13317.34 * t)

                       + 0.004 * Math.sin(9.5 + 18449.32 * t)
                       + 0.004 * Math.sin(93.8 - 1.33 * t)
                       + 0.0039 * Math.sin(103.3 + 17810.68 * t)
                       + 0.0037 * Math.sin(65.1 + 5410.62 * t)
                       + 0.0027 * Math.sin(321.3 + 9183.99 * t)

                       + 0.0026 * Math.sin(174.8 - 13797.39 * t)
                       + 0.0024 * Math.sin(82.7 + 998.63 * t)
                       + 0.0024 * Math.sin(4.7 + 9224.66 * t)
                       + 0.0022 * Math.sin(121.4 - 8185.36 * t)
                       + 0.0021 * Math.sin(134.4 + 9903.97 * t)

                       + 0.0021 * Math.sin(173.1 + 719.98 * t)
                       + 0.0021 * Math.sin(100.3 - 3413.37 * t)
                       + 0.002 * Math.sin(248.6 - 19.34 * t)
                       + 0.0018 * Math.sin(98.1 + 4013.29 * t)
                       + 0.0016 * Math.sin(344.1 + 18569.38 * t)

                       + 0.0012 * Math.sin(52.1 - 12678.71 * t)
                       + 0.0011 * Math.sin(250.3 + 19208.02 * t)
                       + 0.0009 * Math.sin(81.0 - 8586.0 * t)
                       + 0.0008 * Math.sin(207.0 + 14037.3 * t)
                       + 0.0008 * Math.sin(31.0 - 7906.7 * t)

                       + 0.0007 * Math.sin(346.0 + 4052.0 * t)
                       + 0.0007 * Math.sin(294.0 - 4853.3 * t)
                       + 0.0007 * Math.sin(90.0 + 278.6 * t)
                       + 0.0006 * Math.sin(237.0 + 1118.7 * t)
                       + 0.0005 * Math.sin(82.0 + 22582.7 * t)

                       + 0.0005 * Math.sin(276.0 + 19088.0 * t)
                       + 0.0005 * Math.sin(73.0 - 17450.7 * t)
                       + 0.0005 * Math.sin(112.0 + 5091.3 * t)
                       + 0.0004 * Math.sin(116.0 - 398.7 * t)
                       + 0.0004 * Math.sin(25.0 - 120.1 * t)

                       + 0.0004 * Math.sin(181.0 + 9584.7 * t)
                       + 0.0004 * Math.sin(18.0 + 720.0 * t)
                       + 0.0003 * Math.sin(60.0 - 3814.0 * t)
                       + 0.0003 * Math.sin(13.0 - 3494.7 * t)
                       + 0.0003 * Math.sin(13.0 + 18089.3 * t)

                       + 0.0003 * Math.sin(152.0 + 5492.0 * t)
                       + 0.0003 * Math.sin(317.0 - 40.7 * t)
                       + 0.0003 * Math.sin(348.0 + 23221.3 * t);

        var b           = 0.0267 * Math.sin(68.64 - 19.341 * t)
                        + 0.0043 * Math.sin(342.0 - 19.36 * t)
                        + 0.004 * Math.sin(93.8 - 1.33 * t)
                        + 0.002 * Math.sin(248.6 - 19.34 * t)
                        + 0.0005 * Math.sin(358.0 - 19.4 * t);

        this.ex.x[1]   = 5.1282 * Math.sin(236.231 + 4832.0202 * t + b)
                       + 0.2806 * Math.sin(215.147 + 9604.0088 * t)
                       + 0.2777 * Math.sin(77.316 + 60.0316 * t)
                       + 0.1732 * Math.sin(4.563 - 4073.322 * t)
                       + 0.0554 * Math.sin(308.98 + 8965.374 * t)

                       + 0.0463 * Math.sin(343.48 + 698.667 * t)
                       + 0.0326 * Math.sin(287.9 + 13737.362 * t)
                       + 0.0172 * Math.sin(194.06 + 14375.997 * t)
                       + 0.0093 * Math.sin(25.6 - 8845.31 * t)
                       + 0.0088 * Math.sin(98.4 - 4711.96 * t)

                       + 0.0082 * Math.sin(1.1 - 3713.33 * t)
                       + 0.0043 * Math.sin(322.4 + 5470.66 * t)
                       + 0.0042 * Math.sin(266.8 + 18509.35 * t)
                       + 0.0034 * Math.sin(188.0 - 4433.31 * t)
                       + 0.0025 * Math.sin(312.5 + 8605.38 * t)

                       + 0.0022 * Math.sin(291.4 + 13377.37 * t)
                       + 0.0021 * Math.sin(340.0 + 1058.66 * t)
                       + 0.0019 * Math.sin(218.6 + 9244.02 * t)
                       + 0.0018 * Math.sin(291.8 - 8206.68 * t)
                       + 0.0018 * Math.sin(52.8 + 5192.01 * t)

                       + 0.0017 * Math.sin(168.7 + 14496.06 * t)
                       + 0.0016 * Math.sin(73.8 + 420.02 * t)
                       + 0.0015 * Math.sin(262.1 + 9284.69 * t)
                       + 0.0015 * Math.sin(31.7 + 9964.0 * t)
                       + 0.0014 * Math.sin(260.8 - 299.96 * t)

                       + 0.0013 * Math.sin(239.7 + 4472.03 * t)
                       + 0.0013 * Math.sin(30.4 + 379.35 * t)
                       + 0.0012 * Math.sin(304.9 + 4812.68 * t)
                       + 0.0012 * Math.sin(12.4 - 4851.36 * t)
                       + 0.0011 * Math.sin(173.0 + 19147.99 * t)

                       + 0.001 * Math.sin(312.9 - 12978.66 * t)
                       + 0.0008 * Math.sin(1.0 + 17870.7 * t)
                       + 0.0008 * Math.sin(190.0 + 9724.1 * t)
                       + 0.0007 * Math.sin(22.0 + 13098.7 * t)
                       + 0.0006 * Math.sin(117.0 + 5590.7 * t)

                       + 0.0006 * Math.sin(47.0 - 13617.3 * t)
                       + 0.0005 * Math.sin(22.0 - 8485.3 * t)
                       + 0.0005 * Math.sin(150.0 + 4193.4 * t)
                       + 0.0004 * Math.sin(119.0 - 9483.9 * t)
                       + 0.0004 * Math.sin(246.0 + 23281.3 * t)

                       + 0.0004 * Math.sin(301.0 + 10242.6 * t)
                       + 0.0004 * Math.sin(126.0 + 9325.4 * t)
                       + 0.0004 * Math.sin(104.0 + 14097.4 * t)
                       + 0.0003 * Math.sin(340.0 + 22642.7 * t)
                       + 0.0003 * Math.sin(270.0 + 18149.4 * t)

                       + 0.0003 * Math.sin(358.0 - 3353.3 * t)
                       + 0.0003 * Math.sin(148.0 + 19268.0 * t);

        this.ex.x[2]   = 0.0;
    };

    //init planet//惑星初期化
    Init(nday) {
        //orbital position from kepler//ケプラー方程式から座標を求める
        var xx = [new N6LVector(3)];
        var vv = [new N6LVector(3)];
        var f = this.kepler(nday, xx, vv);
        this.x0 = new N6LVector([xx[0].x[0], xx[0].x[1], xx[0].x[2]]);
        this.v0 = new N6LVector([vv[0].x[0], vv[0].x[1], vv[0].x[2]]);

        //xyz to ecliptic//xyz系を日心黄道直交座標系に変換
        var xyz = new N6LVector(3);
        this.ecliptic(this.x0.x[0], this.x0.x[1], this.x0.x[2], xyz);
        if(isNaN(xyz[0].x[0]) || isNaN(xyz[0].x[1]) || isNaN(xyz[0].x[2])) {
            this.x0.x[0] = 0.0;
            this.x0.x[1] = 0.0;
            this.x0.x[2] = 0.0;
        }
        else {
            this.x0.x[0] = xyz[0].x[0];
            this.x0.x[1] = xyz[0].x[1];
            this.x0.x[2] = xyz[0].x[2];
        }


        var xyz2 = new Array(new N6LVector(3));
        this.ecliptic(this.v0.x[0], this.v0.x[1], this.v0.x[2], xyz2);
        if(isNaN(xyz2[0].x[0]) || isNaN(xyz2[0].x[1]) || isNaN(xyz2[0].x[2])) {
            this.v0.x[0] = 0.0;
            this.v0.x[1] = 0.0;
            this.v0.x[2] = 0.0;
        }
        else {
            this.v0.x[0] = xyz2[0].x[0];
            this.v0.x[1] = xyz2[0].x[1];
            this.v0.x[2] = xyz2[0].x[2];
        }

        //ゼロクリア
        this.ex = new N6LVector(3);

        this.m_el = 0.0;
        this.m_d = 0.0;
    };

    //init planet//惑星初期化//軌道速度も求める
    Init2(nday) {
        //orbital position from kepler//ケプラー方程式から座標を求める
        var xx = [new N6LVector(3)];
        var vv = [new N6LVector(3)];
        var f = this.kepler(nday, xx, vv);
        this.x0 = new N6LVector([xx[0].x[0], xx[0].x[1], xx[0].x[2]]);
        this.v0 = new N6LVector([vv[0].x[0], vv[0].x[1], vv[0].x[2]]);

        var xyz2 = new Array(new N6LVector(3));
      
        //xyz to ecliptic//xyz系を日心黄道直交座標系に変換
        var xyz = new Array(new N6LVector(3));
        this.ecliptic(this.x0.x[0], this.x0.x[1], this.x0.x[2], xyz);
        if(isNaN(xyz[0].x[0]) || isNaN(xyz[0].x[1]) || isNaN(xyz[0].x[2])) {
            this.x0.x[0] = 0.0;
            this.x0.x[1] = 0.0;
            this.x0.x[2] = 0.0;
        }
        else {
            this.x0.x[0] = xyz[0].x[0];
            this.x0.x[1] = xyz[0].x[1];
            this.x0.x[2] = xyz[0].x[2];
        }

        var xyz2 = new Array(new N6LVector(3));
        this.ecliptic(this.v0.x[0], this.v0.x[1], this.v0.x[2], xyz2);
        if(isNaN(xyz2[0].x[0]) || isNaN(xyz2[0].x[1]) || isNaN(xyz2[0].x[2])) {
            this.v0.x[0] = 0.0;
            this.v0.x[1] = 0.0;
            this.v0.x[2] = 0.0;
        }
        else {
            this.v0.x[0] = xyz2[0].x[0];
            this.v0.x[1] = xyz2[0].x[1];
            this.v0.x[2] = xyz2[0].x[2];
        }


        //ゼロクリア
        this.ex = new N6LVector(3);

        this.m_el = 0.0;
        this.m_d = 0.0;
    };


    //kepler//ケプラー方程式
    kepler(nday, xx, vv, num, x0, fret) {
        if(this.m_pno == this.m_ono) return 0.0;

        if(nday < 0.0) { //1996年以前
            this.m_l0 += 360.0 * 1000.0;
            if(this.m_nperday * nday + this.m_l0 < 0.0) {
                //MessageBox.Show("too past day!", "error");
                return 0.0;
            }
        }

        var m;
        var u;
        var du;
        var x;
        var y;
        var i;

        //m: mean anomaly
        //u: eccentric anomaly
        //m_e: eccentricity
        //m_a: semi-major axis
        //m_n: mean motion
        //m: 平均近点角(mean anomaly)
        //u: 離心近点角(eccentric anomaly)
        //m_e: 離心率
        //m_a: 軌道長半径
        //m_n: 平均運動

        m = this.m_nperday * nday + this.m_l0;

        m = m * this.CNST_DR;

        var e2 = this.m_e * this.m_e;
        var e3 = this.m_e * this.m_e * this.m_e;
        var e4 = this.m_e * this.m_e * this.m_e * this.m_e;
        var e5 = this.m_e * this.m_e * this.m_e * this.m_e * this.m_e;
        var e6 = this.m_e * this.m_e * this.m_e * this.m_e * this.m_e * this.m_e;
        var e7 = this.m_e * this.m_e * this.m_e * this.m_e * this.m_e * this.m_e * this.m_e;
   
        //approximation formula to m_e = 0.5 like comet m_e = 1.0 error
        //近似式 m_e = 0.5 くらいまで 彗星のように m_e = 1.0 に近いと崩れる
        u = m + (this.m_e - 1.0 / 8.0 * e3 + 1.0 / 192.0 * e5 - 1.0 / 9216.0 * e7) * Math.sin(m) +
                (1.0 / 2.0 * e2 - 1.0 / 6.0 * e4 + 1.0 / 48.0 * e6) * Math.sin(2.0 * m) +
                (3.0 / 8.0 * e3 - 27.0 / 128.0 * e5 + 243.0 / 5120.0 * e7) * Math.sin(3.0 * m) +
                (1.0 / 3.0 * e4 - 4.0 / 15.0 * e6) * Math.sin(4.0 * m) +
                (125.0 / 384.0 * e5 - 3125.0 / 9216.0 * e7) * Math.sin(5.0 * m) +
                27.0 / 80.0 * e6 * Math.sin(6.0 * m) +
                16807.0 / 46080.0 * e7 * Math.sin(7.0 * m);

        //repeat
        //上の近似式で得られた値を元に以下の関数を繰り返して誤差が小さくなるまで繰り返す
        //天体の位置計算 増補版 p147
        var lp = 0;
        if(num == undefined) num = 100;
        for(i = 0; i < num; i++) {
            du = (m - u + this.m_e * Math.sin(u)) / (1.0 - this.m_e * Math.cos(u));
            u = u + du;
            if(this.fabs(du) < 0.0000001) break;
            lp += 1;
        }

        var ree = Math.sqrt(1.0 - e2);
        var cosu = Math.cos(u);
        var sinu = Math.sin(u);
        var x_prime = this.m_a * (cosu - this.m_e);
        var y_prime = this.m_a * ree * sinu;
        var f = Math.atan2(y_prime, x_prime); 
        var cosf = Math.cos(f);
        var sinf = Math.sin(f);

        var r0 = this.m_a * (1.0 - e2) / (1.0 + this.m_e * cosf);
        x = r0 * cosf;
        y = r0 * sinf;

        if(fret == undefined) {
          if(xx != undefined) xx[0] = new N6LVector([x * this.CNST_AU, y * this.CNST_AU, 0.0]);
          else xx = new Array(new N6LVector([x * this.CNST_AU, y * this.CNST_AU, 0.0]));

          if(x0 != undefined) x0[0] = new N6LVector(xx[0]);
          else x0 = new Array(new N6LVector(xx[0]));
          
          return this.kepler(nday + (1.0 / (24.0 * 4.0) * this.m_t), xx, vv, num, x0, f);
        }

        var xxx = new Array(new N6LVector([x * this.CNST_AU, y * this.CNST_AU, 0.0]));
        var dx = xxx[0].Sub(xx[0]);
        if(vv != undefined) vv[0] = new N6LVector(3).ZeroVec();
        else vv = new Array(new N6LVector(3).ZeroVec());

        //速度微調整
        vv[0].x[0] = (dx.x[0] / (60.0 * 60.0 * 24.0 / (24.0 * 4.0) * this.m_t) / this.CNST_C) * this.m_mv;
        vv[0].x[1] = (dx.x[1] / (60.0 * 60.0 * 24.0 / (24.0 * 4.0) * this.m_t) / this.CNST_C) * this.m_mv;
        vv[0].x[2] = 0.0;

        if(fret == undefined) return 0;
        return fret;
    };

    //xyz to ecliptic//xyz系を日心黄道直交座標系に変換
    ecliptic(x, y, z, xyz) {
        xyz[0] = new N6LVector(3).ZeroVec();
 
        var ss = this.m_s * this.CNST_DR;
        var ii = this.m_i * this.CNST_DR;
        var ww = this.m_w * this.CNST_DR;

        //s: longitude of the ascending node Ω
        //i: orbital inclination i 
        //w: perihelion celestial longitude ω
        //s: 昇交点黄経 Ω
        //i: 軌道傾斜角 i 
        //w: 近日点引数 ω

        var vec = new N6LVector([
            x * (Math.cos(ss) * Math.cos(ww) - Math.sin(ss) * Math.cos(ii) * Math.sin(ww)) - y * (Math.cos(ss) * Math.sin(ww) + Math.sin(ss) * Math.cos(ii) * Math.cos(ww)),
            x * (Math.sin(ss) * Math.cos(ww) + Math.cos(ss) * Math.cos(ii) * Math.sin(ww)) - y * (Math.sin(ss) * Math.sin(ww) - Math.cos(ss) * Math.cos(ii) * Math.cos(ww)),
            x * Math.sin(ii) * Math.sin(ww) + y * Math.sin(ii) * Math.cos(ww)]);

        //vec.x[0] = x
        //vec.x[1] = y
        //vec.x[2] = 0.0


        //rotate vector//ベクトル回転//ss,ii,ww,+-???
        //vec = vec.RotAxis(vec.UnitVec(2), ss).RotAxis(vec.UnitVec(0), ii).RotAxis(vec.UnitVec(2), ww);

        //vec.x[0] = x
        //vec.x[1] = y
        //vec.x[2] = 0.0

        //rotate matrix//行列回転//ss,ii,ww,+-???
        //var mat = new N6LMatrix(3);
        //mat = mat.UnitMat().RotAxis(vec.UnitVec(2), ss).RotAxis(vec.UnitVec(0), ii).RotAxis(vec.UnitVec(2), ww);
        //vec = mat * vec


        xyz[0].x[0] = vec.x[0]
        xyz[0].x[1] = vec.x[1]
        xyz[0].x[2] = vec.x[2]
    
    };


    //type double absolute//double絶対値
    fabs(x) {
        var ret = x;
        if(ret < 0.0) ret = -ret;
        return ret;
    };

    //ascendant//アセンダント計算
    asc(dat1) {
        //var dat1 = new Date(1974, 12 - 1, 31, 0, 0, 0);
        var msecPerMinute = 1000 * 60;
        var msecPerHour = msecPerMinute * 60;
        var msecPerDay = msecPerHour * 24;
        var dat0Msec = this.m_dat0.getTime();
        var dat1Msec = dat1.getTime();
        var interval = dat0Msec - dat1Msec;

        var days = Math.ceil(this.m_nday);
        var times = this.m_nday - days;
        var hh = Math.floor(times * 24.0);
        var mm = Math.floor(times * 24.0 * 60.0) % 60;
        var ss = Math.floor(times * 24.0 * 60.0 * 60.0) % 60;
        var dat = dat0Msec + this.m_nday * msecPerDay;
        var dats = dat - dat1Msec;
        var z = Math.floor(dats / msecPerDay);
        var tt = z / 365.2425;
        var t = tt + (0.0317 * tt + 1.43) * 0.000001;


        var dat = new Date(1996, 7 - 1, 1, 0, 0, 0);
        this.m_asc = 150.0;
        var msecPerMinute = 1000 * 60;
        var msecPerHour = msecPerMinute * 60;
        var msecPerDay = msecPerHour * 24;
        var datMsec = dat.getTime();
        var dat1Msec = dat1.getTime();
        var interval = dat1Msec - datMsec;
        var td = Math.floor(interval / msecPerDay);
        var d = td % 365.2425;
        if(d < 0.0) d += 365.2425;
        d = d / 365.2425 * 360.0;
        var ff = td;
        var f = ff * 361.0;
        this.m_asc = (this.m_asc + d + f) % 360.0;
        if(this.m_asc < 0.0) this.m_asc += 360.0;

    };

    //house//ハウス計算
    house(aasc) {
        this.m_hs.length = 12;
        this.m_hs[0] = aasc;

        this.m_hs[1] = this.m_hs[0] + 22.0;
        this.m_hs[1] = this.m_hs[1] % 360.0;
        if(this.m_hs[1] < 0.0) this.m_hs[1] += 360.0;

        this.m_hs[2] = this.m_hs[1] + 25.0;
        this.m_hs[2] = this.m_hs[2] % 360.0;
        if(this.m_hs[2] < 0.0) this.m_hs[2] += 360.0;

        this.m_hs[3] = this.m_hs[2] + 31.0;
        this.m_hs[3] = this.m_hs[3] % 360.0;
        if(this.m_hs[3] < 0.0) this.m_hs[3] += 360.0;

        this.m_hs[4] = this.m_hs[3] + 36.0;
        this.m_hs[4] = this.m_hs[4] % 360.0;
        if(this.m_hs[4] < 0.0) this.m_hs[4] += 360.0;

        this.m_hs[5] = this.m_hs[4] + 35.0;
        this.m_hs[5] = this.m_hs[5] % 360.0;
        if(this.m_hs[5] < 0.0) this.m_hs[5] += 360.0;

        this.m_hs[6] = this.m_hs[5] + 31.0;
        this.m_hs[6] = this.m_hs[6] % 360.0;
        if(this.m_hs[6] < 0.0) this.m_hs[6] += 360.0;

        this.m_hs[7] = this.m_hs[6] + 22.0;
        this.m_hs[7] = this.m_hs[7] % 360.0;
        if(this.m_hs[7] < 0.0) this.m_hs[7] += 360.0;

        this.m_hs[8] = this.m_hs[7] + 25.0;
        this.m_hs[8] = this.m_hs[8] % 360.0;
        if(this.m_hs[8] < 0.0) this.m_hs[8] += 360.0;

        this.m_hs[9] = this.m_hs[8] + 31.0;
        this.m_hs[9] = this.m_hs[9] % 360.0;
        if(this.m_hs[9] < 0.0) this.m_hs[9] += 360.0;

        this.m_hs[10] = this.m_hs[9] + 36.0;
        this.m_hs[10] = this.m_hs[10] % 360.0;
        if(this.m_hs[10] < 0.0) this.m_hs[10] += 360.0;

        this.m_hs[11] = this.m_hs[10] + 35.0;
        this.m_hs[11] = this.m_hs[11] % 360.0;
        if(this.m_hs[11] < 0.0) this.m_hs[11] += 360.0;

    };

    //速度符号設定
    sgnv(x, y, vx, vy) {
        if(x[0] < 0.0) {
            if(y[0] < 0.0) vy[0] = -vy[0];
            else {
                vx[0] = -vx[0];
                vy[0] = -vy[0];
            }
        }
        else {
            if(y[0] < 0.0) ;
            else vx[0] = -vx[0];
        }
    };

}


