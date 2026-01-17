//Programed by NAS6
//rngkt.js

//Runge-Kutta method//ルンゲ-クッタ法
//velocity and accel is trans rorenz、/CNST_C kepp value,positon real//速度と加速度はローレンツ変換、/CNST_Cで値保持、座標は実座標
class N6LRngKt {

  constructor() {

    this.typename = "N6LRngKt";
    this.CNST_G = 0.00000000006673;
    this.CNST_C = 299792458.0;
    this.CNST_AU = 149597870700.0;

    this.dms;
    this.n;
    this.mp = new Array();
    this.dt;//[sec]
    this.SpdRate = 1;



    this.epoch;
    this.blog = false;
    this.bvdt = false;
    this.bInit = 0;
    this.timeInit = 0;
    this.time = 0;//[sec]
    this.planet = null;

    this.debugdata = [];


    this.vx = null;
    this.vy = null;
    this.vz = null;
    this.normX = null;
    this.normY = null;
    this.normZ = null; //軌道法線


    this.perith = null;
    this.bperi = false;
    this.bbperi = 0;
    this.bentperi = false;
    this.bextperi = false;
    this.apheth = null;
    this.baphe = false;
    this.bbaphe = 0;
    this.bentaphe = false;
    this.bextaphe = false;
    this.near = 2.5;
    this.maxdivcalc = 100000;
    this.mindivcalc = 1500;

    this.rdx = new Array();
    this.dx = new Array();
    this.nrm = new Array();
    this.pow = new Array();
    this.ik = new Array();
    this.im = new Array();
    this.r = new Array();
    this.aa = new Array();
    this.al = new Array();
    this.ap = new Array();
    this.b = new Array();
    this.c = new Array();
    this.d = new Array();
    this.coef = new Array(1.0, 2.0, 2.0, 1.0);

    this.swa = true //force relation distance
    this.swb = true //force proportionality velocity
    this.swc = true //force proportionality square velocity
    this.swd = true //force certain
  }

getVariableDT(r, e, a, ra, rb, t) {
  // t: 公転周期(年)と仮定
  var st = t * 3600 * 24 * 365.2425; 
  // パルサーのような超短周期（stが極小）の場合の特例措置
  if (st < 10000) { 
    // どんなに現場が「大丈夫」と言っても、強制的に超高解像度で計算させる
    this.maxdivcalc = 1000000; // 引き上げる
  }
  else {
    this.maxdivcalc = 100000;
  }


  var minra = 1e-4;
  if(r < minra) return this.dt;

  //現場主義
  var vabs = this.mp[1].lastV * this.CNST_C;
  var rabs = this.mp[1].lastR * this.CNST_AU;
  var circumferencelength = 2 * Math.PI * rabs;
  var predictiontime = circumferencelength / vabs;
  var discrepancyfromprediction = predictiontime / st;
  //現場の権限の限界
  // weightの計算を整理（地球基準の指数ブースト版）
  var baseST = 32000000;
  var diffLog = Math.log10(st / baseST);
  var weight = (diffLog < 0) ? Math.pow(2, -diffLog) : Math.log10(st / 1000) + 1;

  // 現場判断の掛け合わせ
  var discrepancy = Math.max(predictiontime / st, 0.1);
  var discrepancy2 = Math.min(discrepancy * weight, 1000);

/*
  // 地球を基準（重み1.0）として、そこからの「桁数の離れ具合」で倍率を決める
  var baseST = 32000000; // 地球の周期（約1年）
  var diffLog = Math.log10(st / baseST); 
  // st=3000 のとき、diffLog は約 -4
  // この「-4」を使って、指数関数的に倍率をドカンと上げる
  var weight = 1;
  if(diffLog < 0) Math.pow(2, -diffLog); // 2の4乗 = 16倍！

  var minST = 1000; // 最小単位
  var normalizedST = Math.max(st, minST); // 最小値を下回らないようにガード
  var weight = Math.log10(normalizedST / minST) + 1; // minPのとき重み1、そこから桁数に応じて増える
  var discrepancy = Math.max(predictiontime / st, 0.1);
  discrepancy = Math.min(discrepancy, 10);
  var discrepancy2 = Math.max(discrepancy * weight, 0.001);
  discrepancy2 = Math.max(discrepancy2 * weight, 1000);
*/

  var maxdt = st / this.mindivcalc * discrepancy2; // 遠日点付近の大きなdt
  var mindt = st / this.maxdivcalc * discrepancy2; // 理論上の最小dt
  var range = maxdt - mindt;


  // --- 調整ポイント ---
  if(r < ra) r = ra;
  // rr は 近日点で 0、遠日点で 1
  var rr = (r - ra) / (rb - ra);
  
  // 指数 p を大きくすると、近日点（rr=0）の周辺だけで急激に dt が変化します。
  // 1に近づくほど急峻にする（＝0付近で急峻に変化させる）ために、
  // 近日点付近を強調するカーブを作ります。
  var p = 0.5; // 近日点付近で急激に変化させるために小さめの値、あるいは
               // 逆に「遠日点までずっと大きいまま」なら p を大きくします。
  
  // ターゲット: 
  // ハレー (e=0.967) => dt=2000
  // 水星 (e=0.205) => dt=4000
  // これを逆算すると、近日点(rr=0)での vdt が 1.0 になるように調整するのがシンプルです。
  
  var vdt = Math.pow(1 - rr, 6); // 1-rr を使うことで「近日点(0)で最大値1」になる
  
  // dt = maxdt - (係数 * e * vdt)
  // ここで、eの影響力を調整する係数 K を導入します
  // ハレーと水星の差を埋めるためのスケーリングです。
  var K = 2; // この値を調整して感度を決めます
  
  var dt = maxdt - maxdt * (K * e * vdt);


  // 下限リミッター（念のため）
  dt = Math.max(dt, mindt); 

  if (st < 10000) { 
    // --- 最終防衛ライン ---
    // 1ステップで進む距離(v * dt)が、現在の半径(r)比率を超えないように縛る
    var physicalLimitDT = (r * this.CNST_AU * 1e-3) / vabs; 
    dt = Math.min(dt, physicalLimitDT);
  }

  return dt;

//  var finalDT = dt; // 可変DT
  // 微小数なると計算が不安定になる現場の特性を考慮
//  return Math.max(finalDT, 3.6);
}

/**
 * 3点の座標ベクトルから近日点/遠日点の精密な座標を補間する
 * @param {N6LVector[]} p - 3点分の座標配列 [p0(前々回), p1(前回), p2(今回)]
 * @param {N6LVector[]} r_m - 3点分の中心天体からの距離（スカラ）
 * @returns {N6LVector} 補間された精密な座標ベクトル
 */
interpolateExtremum(p, r_m) {
    const r0 = r_m[0];
    const r1 = r_m[1];
    const r2 = r_m[2];

    // 二次関数 R(t) = at^2 + bt + c における頂点の位置(offset)を求める
    // t1 を基準(0)としたとき、真の頂点がどのくらいズレているか (-0.5 ? 0.5)
    // 分母が0（直線）になるのを防ぐための微小値
    const denom = 2 * (r0 - 2 * r1 + r2);
    if (Math.abs(denom) < 1e-20) return p[1]; // 補間不能な場合は中央の点を返す

    const offset = (r0 - r2) / denom;

    // offsetを用いて、各成分を二次補間する
    // P(t) = At^2 + Bt + C
    const result = new N6LVector(p[0].x.length);
    for (let k = 0; k < p[0].x.length; k++) {
        const y0 = p[0].x[k];
        const y1 = p[1].x[k];
        const y2 = p[2].x[k];

        // 二次方程式の係数を算出
        const A = (y0 - 2 * y1 + y2) / 2;
        const B = (y2 - y0) / 2;
        const C = y1;

        // 頂点時刻における座標成分を計算
        result.x[k] = A * (offset * offset) + B * offset + C;
    }

    return result;
};

interpolateExtremumWithTime(p, r_m, currentTime, dt) {
    const r0 = r_m[0];
    const r1 = r_m[1];
    const r2 = r_m[2];

    const denom = 2 * (r0 - 2 * r1 + r2);
    if (Math.abs(denom) < 1e-20) return { pos: p[1], time: currentTime - dt };

    const offset = (r0 - r2) / denom;

    // 1. 座標の補間
    const precisePos = new N6LVector(p[0].x.length);
    for (let k = 0; k < p[0].x.length; k++) {
        const A = (p[0].x[k] - 2 * p[1].x[k] + p[2].x[k]) / 2;
        const B = (p[2].x[k] - p[0].x[k]) / 2;
        precisePos.x[k] = A * (offset * offset) + B * offset + p[1].x[k];
    }

    // 2. 時刻の補間 (currentTime は「今回」の時刻なので、1ステップ戻して offset を加える)
    const preciseTime = (currentTime - dt) + (offset * dt);

    return { pos: precisePos, time: preciseTime };
};

calculateTheta(precisePos){
  if(this.vx !== null){
  var r_rel_au = new N6LVector(precisePos);

  // 3. 物理的なAU座標を投影！
  var c0 = r_rel_au.Dot(this.normX); // X座標 (AU)
  var c1 = r_rel_au.Dot(this.normY); // Y座標 (AU)
  var c2 = this.normZ.Dot(r_rel_au);  // Z座標 (AU) → ここがほぼ0になるはず！

  // 1. 水星の遠日点距離 (約 0.4667 AU)
  var aphelion = this.planet[1].m_rb; 

  // 2. 現在の座標をその距離で割る
  var c00 = c0 / aphelion; // これで最大 +1, 最小 -1 付近になる
  var c11 = c1 / aphelion;

/*DEBUG CODE
{
var theta = this.calculateTheta(posx);
document.FD.T1.value = theta;
document.FD.T2.value = c0;
document.FD.T3.value = c1;
document.FD.T4.value = c2;
}
*/

  return Math.atan2(c11,c00);
}};

    //速度加速
    VelocityAccl2D(v, a, dt) {
        if(a.Abs() == 0.0) return v;
        if(1.0 < v.Abs()) {
            if(v.x[1] <= v.x[0]) v.x[1] = Math.sqrt(1.0 - v.x[0] * v.x[0]);
            if(v.x[0] < v.x[1]) v.x[0] = Math.sqrt(1.0 - v.x[1] * v.x[1]);
        }

        var va = v.Abs();
        var aa = a.Abs();

        var vab = Math.tanh(aa * dt);
        var vac = ((va + vab) / (va * vab + 1.0));

        var ret = v.Add(a.Mul(dt));

        if(1.0 < vac) ret = ret / vac;

        return ret
    };

    //速度加速
    VelocityAccl3D(v, a, dt) {
        if(a.Abs() == 0.0) return v;
        if(1.0 < v.Abs()) {
            if(v.x[1] <= v.x[0] && v.x[2] <= v.x[0]) {
                v.x[1] = Math.sqrt((1.0 - v.x[0] * v.x[0]) / 2.0);
                v.x[2] = Math.sqrt((1.0 - v.x[0] * v.x[0]) / 2.0);
            }
            if(v.x[2] <= v.x[1] && v.x[0] < v.x[1]) {
                v.x[2] = Math.sqrt((1.0 - v.x[1] * v.x[1]) / 2.0);
                v.x[0] = Math.sqrt((1.0 - v.x[1] * v.x[1]) / 2.0);
            }
            if(v.x[0] < v.x[2] && v.x[1] < v.x[2]) {
                v.x[0] = Math.sqrt((1.0 - v.x[2] * v.x[2]) / 2.0);
                v.x[1] = Math.sqrt((1.0 - v.x[2] * v.x[2]) / 2.0);
            }
        }

        var va = v.Abs();
        var aa = a.Abs();

        var vab = Math.tanh(aa * dt);
        var vac = ((va + vab) / (va * vab + 1.0));

        var ret = v.Add(a.Mul(dt));

        if(1.0 < vac) ret = ret.Div(vac);
        return ret;
    };

    //速度合成
    //v1をx軸とする座標系に回転して変換しxブースト相対論的速度合成則を適用し元に戻す
    VelocityAdd2D(v0, v1) {
        ret = new N6LVector(v0.x.length);
        var ra = v1.Abs();
        var i;
        if(v0.Abs() == 0.0) {
            if(1.0 < ra) {
                for(i = 0; i < v0.x.length; i++)
                    ret.x[i] = v1.x[i] / ra;
            }
            else ret = v1;
            return ret;
        }
        ra = v0.Abs();
        if(v1.Abs() == 0.0) {
            if(1.0 < ra) {
                for(i = 0; i < v0.x.length; i++)
                    ret.x[i] = v0.x[i] / ra;
            }
            else ret = v0;
            return ret;
        }

        var v = v0.Abs();
        var v11 = new N6LVector(3);
        var v00 = new N6LVector(3);
        for(i = 0; i < v0.x.length; i++) {
            v11.x[i] = v1.x[i];
            v00.x[i] = v0.x[i];
        }
        v11.x[i] = 0.0;
        v00.x[i] = 0.0;
        var ux = ret.UnitVec(0);
        var crs = v00.Cross(ux);

        var theta = v00.Theta(ux);
        if(isNaN(theta)) {
            theta = v11.Theta(ux);
            if(isNaN(theta)) theta = 0.0;
            else v00 = v11.RotAxis(crs, theta);
        }
        else v00 = v00.RotAxis(crs, theta);
        
        v11 = v11.RotAxis(crs, theta);
        if(v11.x[0] * v == -1.0) v11.x[0] = -0.99999999999999989;

        var ret = new N6LVector([
            ((v11.x[0] + v) / (v11.x[0] * v + 1.0)),
            ((v11.x[1]) / (v11.x[0] * v + 1.0)) * Math.sqrt(1.0 - v * v),
            ((v11.x[2]) / (v11.x[0] * v + 1.0)) * Math.sqrt(1.0 - v * v)]);
        ret = ret.RotAxis(crs, -theta);
        ra = ret.Abs();
        if(1.0 < ra) {
            for(i = 0; i < v0.x.length; i++)
                ret.x[i] = ret.x[i] / ra;
        }
        return ret;
    };

    //速度合成
    //v1をx軸とする座標系に回転して変換しxブースト相対論的速度合成則を適用し元に戻す
    VelocityAdd3D(v0, v1) {
        ret = new N6LVector(v0.x.length);
        var ra = v1.Abs();
        var i;
        if(v0.Abs() == 0.0) {
            if(1.0 < ra) {
                for(i = 0; i < v0.x.length; i++)
                    ret.x[i] = v1.x[i] / ra;
            }
            else ret = v1;
            return ret;
        }
        ra = v0.Abs();
        if(v1.Abs() == 0.0) {
            if(1.0 < ra) {
                for(i = 0; i < v0.x.length; i++)
                    ret.x[i] = v0.x[i] / ra;
            }
            else ret = v0;
            return ret;
        }

        var v = v0.Abs();
        var v11 = new N6LVector(3);
        var v00 = new N6LVector(3);
        for(i = 0; i < v0.x.length; i++) {
            v11.x[i] = v1.x[i];
            v00.x[i] = v0.x[i];
        }
        var ux = ret.UnitVec(0);
        var crs = v00.Cross(ux);

        var theta = v00.Theta(ux);
        if(isNaN(theta)) {
            theta = v11.Theta(ux);
            if(isNaN(theta)) theta = 0.0;
            else v00 = v11.RotAxis(crs, theta);
        }
        else v00 = v00.RotAxis(crs, theta);
        
        v11 = v11.RotAxis(crs, theta);
        if(v11.x[0] * v == -1.0) v11.x[0] = -0.99999999999999989;

        var ret = new N6LVector([
            ((v11.x[0] + v) / (v11.x[0] * v + 1.0)),
            ((v11.x[1]) / (v11.x[0] * v + 1.0)) * Math.sqrt(1.0 - v * v),
            ((v11.x[2]) / (v11.x[0] * v + 1.0)) * Math.sqrt(1.0 - v * v)]);
        ret = ret.RotAxis(crs, -theta);
        ra = ret.Abs();
        if(1.0 < ra) {
            for(i = 0; i < v0.x.length; i++)
                ret.x[i] = ret.x[i] / ra;
        }
        return ret;
    };

    //schwartz radius//シュワルツシルト半径
    GetSRadius(mass, cc, cg) {
        return ((2.0 * cg * mass) / (cc * cc));
    };

    //Eccentricity //離心率簡易計算 dv=p1-p2v θ=dv.Theta(v1) θ=0→e=1 : θ=π/4→e=0 therefore e = cosθ
    GetEccentricity(p1, v1, p2){
      var dv = p1.Sub(p2);
      var th = dv.Theta(v1);
      var ret = Math.cos(th);
      if(ret < 0) ret *= -1;
      return ret;
    }

    //2.5PN重力放射減衰
    ToGravityRadiationLoss(v, m1, m2, r){
      //NAS6定数//解析的デバッグにより推定
      const VAL_NAS6 = 1.35 - 3.3e+8 / r;
      const CNST_NAS6 = -4.5e-1;
      const CNST = this.CNST_C * CNST_NAS6 * VAL_NAS6;
      var ret = (-32 * CNST / 5) * ((Math.pow(this.CNST_G, 3) * m1 * m2 * (m1 + m2))/(Math.pow(this.CNST_C, 5) * Math.pow(r, 4))) * v * this.CNST_C;
      return ret;
    };

    //1PN
    //schwartz correction term//シュワルツシルト補正項
    ToSchwartz(v, e) {
        var ret = 3.0 * v * v / ( 1.0 - (e * e)); //楕円一般相対論//eは一周の積分するときに必要
        if(0.95 < e) ret = -0.5 * v * v;          //直線特殊相対論
        return ret;
    };

    //calc accel//加速度の計算
    GetA(r, m, mr, v, e, m0 = 1) {
        if(r == 0.0) return 0.0;
        var a = 1.0;
        if(mr <= r) mr = r;
        else a = r / mr;
        var g = this.CNST_G * (m / mr / mr) * a;
        g = g * (1.0 + this.ToSchwartz(v, e));
        g = g + this.ToGravityRadiationLoss(v, m, m0, r);
        if(g < 0.0 || isNaN(g)) return 0.0;
        return g / this.CNST_C;
    };

    //calc accel//質点毎の加速度の計算
    accel() {
        var i;
        var j;
        var k;
        var fw;
        var fw1;
 
        if(this.swa || this.swc) {
            for(i = 0; i < this.n; i++) {
                if(this.swa) {
                    if(this.mp[i].mass <= 0.0) continue;
                    for(j = i + 1; j <= this.n; j++) {
                        if(this.mp[j].mass <= 0.0) continue;
                        fw = 0.0;
                        this.dx[i][j] = this.mp[i].x1.Sub(this.mp[j].x1);
                        for(k = 0; k <= this.dms; k++) fw += this.dx[i][j].x[k] * this.dx[i][j].x[k];
                        this.r[i][j] = Math.sqrt(fw);

                        for(k = 0; k <= this.dms; k++) {
                            if(this.r[i][j] != 0.0) this.nrm[i][j].x[k] = this.dx[i][j].x[k] / this.r[i][j];
                            else this.nrm[i][j].x[0] = 1.0;
                        }
                        this.r[i][j] = this.r[i][j] - this.al[i][j];
                        //this.r[j][i] = this.r[i][j];

                        if(this.ap[i][j] == 0) this.pow[i][j] = 1.0;
                        if(this.ap[i][j] == -2) {
                            if(this.r[i][j] != 0.0) this.pow[i][j] = 1.0 / this.r[i][j] / this.r[i][j];
                            else this.pow[i][j] = 0.0;
                        }

                        if(this.ap[j][i] == 0) this.pow[j][i] = 1.0;
                        if(this.ap[j][i] == -2) {
                            if(this.r[i][j] != 0.0) this.pow[j][i] = 1.0 / this.r[i][j] / this.r[i][j];
                            else this.pow[j][i] = 0.0;
                        }

                        if(this.ap[i][j] == -1) {//relative gravity   //相対性理論万有引力
                            var a1;
                            //velocity orbital component //軌道成分速度
                            var ov = new N6LVector(3);
                            var dx2 = new N6LVector(3);
                            var dx3 = new N6LVector(3);
                            var dx1 = new N6LVector(3);
                            var vv1 = new N6LVector(3);
                            for(k = 0; k < this.dx[i][j].x.length; k++) {
                                dx1.x[k] = this.dx[i][j].x[k];
                                vv1.x[k] = this.mp[i].v1.x[k];
                            }
                            if(dx1.Abs() != 0.0) {
                                if(dx1.isParallel(vv1)) {
                                    if(dx1.isParallel(dx2.UnitVec(0))) dx2 = dx1.Cross(dx2.UnitVec(1));
                                    else dx2 = dx1.Cross(dx2.UnitVec(0));
                                }
                                else dx2 = dx1.Cross(vv1);
                                
                                if(dx1.isParallel(dx2)) dx3 = dx1; //ERROR
                                else dx3 = dx1.Cross(dx2);
                                ov = vv1.ProjectAxis(dx3);
                                if(isNaN(ov.x[0])) ov = ov.ZeroVec();
                            }
                            //this.mp[i].e = this.GetEccentricity(this.mp[i].x1,ov,this.mp[j].x1);
                            //a1 = this.GetA(this.r[i][j], this.mp[j].mass, this.mp[j].r, ov.Abs(), this.mp[i].e);
                            a1 = this.GetA(this.r[i][j], this.mp[j].mass, this.mp[j].r, ov.Abs(), 0.0, this.mp[i].mass);
                            this.pow[i][j] = a1;
                        }
                        if(this.ap[j][i] == -1) {//relative gravity   //相対性理論万有引力
                            var a1;
                            //velocity orbital component //軌道成分速度
                            var ov = new N6LVector(3);
                            var dx2 = new N6LVector(3);
                            var dx3 = new N6LVector(3);
                            var dx1 = new N6LVector(3);
                            var vv1 = new N6LVector(3);
                            for(k = 0; k < this.dx[i][j].x.length; k++) {
                                dx1.x[k] = -this.dx[i][j].x[k];
                                vv1.x[k] = this.mp[j].v1.x[k];
                            }
                            if(dx1.Abs() != 0.0) {
                                if(dx1.isParallel(vv1)) {
                                    if(dx1.isParallel(dx2.UnitVec(0))) dx2 = dx1.Cross(dx2.UnitVec(1));
                                    else dx2 = dx1.Cross(dx2.UnitVec(0));
                                }
                                else dx2 = dx1.Cross(vv1);
                                
                                if(dx1.isParallel(dx2)) dx3 = dx1; //ERROR
                                else dx3 = dx1.Cross(dx2);
                                ov = vv1.ProjectAxis(dx3);
                                if(isNaN(ov.x[0])) ov = ov.ZeroVec();
                            }
                            //this.mp[i].e = this.GetEccentricity(this.mp[i].x1,ov,this.mp[j].x1);
                            //a1 = this.GetA(this.r[i][j], this.mp[i].mass, this.mp[i].r, ov.Abs(), this.mp[i].e);
                            a1 = this.GetA(this.r[i][j], this.mp[i].mass, this.mp[i].r, ov.Abs(), 0.0, this.mp[j].mass);
                            this.pow[j][i] = a1;
                        }

                        if(this.ap[i][j] == 1) this.pow[i][j] = this.r[i][j];
                        if(this.ap[j][i] == 1) this.pow[j][i] = this.r[i][j];

                        this.pow[i][j] = this.pow[i][j] * this.aa[i][j];
                        this.pow[j][i] = this.pow[j][i] * this.aa[j][i];
                    }
                }

                fw1 = 0.0;
                for(k = 0; k <= this.dms; k++) fw1 += this.mp[i].v1.x[k] * this.mp[i].v1.x[k];
                this.mp[i].va = Math.sqrt(fw1);
                for(k = 0; k <= this.dms; k++) {
                    if(this.mp[i].va != 0.0) this.mp[i].vn.x[k] = this.mp[i].v1.x[k] / this.mp[i].va;
                }
            }
        }

        for(i = 0; i <= this.n; i++)
            for(k = 0; k <= this.dms; k++)
                this.mp[i].a.x[k] = 0.0; //clear

        for(i = 0; i <= this.n; i++) {
            if(this.swa) { //2 object interaction //２物体間の相互作用
                if(i != this.n) {
                    for(j = i + 1; j <= this.n; j++) {
                        var a = new N6LVector(this.dms + 1);
                        for(k = 0; k <= this.dms; k++) {
                            a.x[k] = ((this.nrm[i][j].x[k] * this.pow[i][j] / (this.mp[i].mass)));
                            this.mp[i].a.x[k] = this.mp[i].a.x[k] + a.x[k];

                            a.x[k] = ((-this.nrm[i][j].x[k] * this.pow[j][i] / (this.mp[j].mass)));
                            this.mp[j].a.x[k] = this.mp[j].a.x[k] + a.x[k];
                        }
                    }
                }
            }
            if(this.swb) { //force proportionality velocity//速さに比例する力（粘性抵抗）
                var a = new N6LVector(this.dms + 1);
                for(k = 0; k <= this.dms; k++) {
                    a.x[k] = ((this.mp[i].v1.x[k] * this.b[i]) / (this.mp[i].mass));
                    this.mp[i].a.x[k] = this.mp[i].a.x[k] + a.x[k];
                }
            }
            if(this.swc) { //force proportionality square velocity//速さの二乗に比例する抵抗（慣性抵抗）
                var a = new N6LVector(this.dms + 1);
                for(k = 0; k <= this.dms; k++) {
                    a.x[k] = ((this.mp[i].vn.x[k] * this.mp[i].va * this.mp[i].va * this.c[i]) / (this.mp[i].mass));
                    this.mp[i].a.x[k] = this.mp[i].a.x[k] + a.x[k];
                }
            }
            if(this.swd) { //force certain//一定の力（重力など）
                var a = new N6LVector(this.dms + 1);
                for(k = 0; k <= this.dms; k++) {
                    a.x[k] = ((this.d[i].x[k]) / (this.mp[i].mass));
                    this.mp[i].a.x[k] = this.mp[i].a.x[k] + a.x[k];
                }
            }
        }
    };

    //Runge-Kutta method//ルンゲ-クッタ法
    UpdateFrame() {
        var i;
        var k;
        var l;

        //init//設定
        for(i = 0; i <= this.n; i++) {
            for(k = 0; k <= this.dms; k++) {
                this.mp[i].x1.x[k] = this.mp[i].x.x[k];
                this.mp[i].x0.x[k] = this.mp[i].x.x[k];
                this.mp[i].v1.x[k] = this.mp[i].v.x[k];
                this.mp[i].w.x[k] = 0.0;
                this.mp[i].w1.x[k] = 0.0;
            }
        }

        if((0 < this.mp[1].lastR)&&(this.blog)&&(this.bvdt)) this.dt = this.getVariableDT(this.mp[1].lastR, this.planet[1].m_e, this.planet[1].m_a, this.planet[1].m_ra, this.planet[1].m_rb, this.planet[1].m_t);


        var nowdt = this.dt * this.SpdRate;
        //Runge-Kutta method//ルンゲ-クッタ法
        this.accel();//質点毎に加速度を計算
        //質点毎に速度をルンゲ-クッタ法で計算
        for(l = 0; l <= 2; l++) {
            for(i = 0; i <= this.n; i++) {
                if(this.mp[i].mass <= 0.0) continue;
                var v01 = new N6LVector(this.dms + 1);
                var v02 = new N6LVector(this.dms + 1);
                var v1 = new N6LVector(this.dms + 1);
                var v2 = new N6LVector(this.dms + 1);
                this.ik[l][i] = this.mp[i].v1.Mul(nowdt * this.CNST_C);
                this.mp[i].x1 = this.mp[i].x.Add(this.ik[l][i].Div(this.coef[l + 1]));
                this.mp[i].x0 = new N6LVector(this.mp[i].x1);
                this.mp[i].w = this.mp[i].w.Add(this.ik[l][i].Mul(this.coef[l]));

                var av = new N6LVector(0);
                if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, nowdt);
                else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, nowdt);
                
                for(k = 0; k <= this.dms; k++) this.im[l][i].x[k] = av.x[k];

                v1 = this.im[l][i].Div(this.coef[l + 1]);
                v2 = this.im[l][i].Mul(this.coef[l]);
                for(k = 0; k <= this.dms; k++) {
                    this.mp[i].v1.x[k] = (this.mp[i].v.x[k] + v1.x[k]);
                    this.mp[i].w1.x[k] = (this.mp[i].w1.x[k] + v2.x[k]);
                }
            }
            this.accel();//質点毎に加速度を計算
        }
        //質点毎に速度をルンゲ-クッタ法で計算
        for(i = 0; i <= this.n; i++) {
            if(this.mp[i].mass < 0.0) continue;
            var v01 = new N6LVector(this.dms + 1);
            var v02 = new N6LVector(this.dms + 1);
            var v1 = new N6LVector(this.dms + 1);
            var v2 = new N6LVector(this.dms + 1);
            this.ik[l][i] = this.mp[i].v1.Mul(nowdt * this.CNST_C);
            this.mp[i].x1 = this.mp[i].x.Add((this.mp[i].w.Add(this.ik[l][i])).Div(6.0));
            //this.mp[i].x1 = this.mp[i].x.Add((this.mp[i].w.Add(this.ik[l][i])));

            var av = new N6LVector(0);
            if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, nowdt);
            else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, nowdt);
                
            for(k = 0; k <= this.dms; k++) this.im[l][i].x[k] = av.x[k];

            v1 = new N6LVector(this.im[l][i]);
            for(k = 0; k <= this.dms; k++) {
                v01.x[k] = this.mp[i].w1.x[k];
                v02.x[k] = this.mp[i].v.x[k];
            }
            if(this.dms == 2) {
                for(k = 0; k <= this.dms; k++) v2.x[k] = (v01.x[k] + v1.x[k]) / 6.0;
                //for(k = 0; k <= this.dms; k++) v2.x[k] = (v01.x[k] + v1.x[k]);
                this.mp[i].v1 = this.VelocityAdd3D(v02, v2);
            }
            else if(this.dms == 1) {
                for(k = 0; k <= this.dms; k++) v2.x[k] = (v01.x[k] + v1.x[k]) / 6.0;
                //for(k = 0; k <= this.dms; k++) v2.x[k] = (v01.x[k] + v1.x[k]);
                this.mp[i].v1 = this.VelocityAdd2D(v02, v2);
            }
        }


        var lastx = new N6LVector(3, false);
        var posx = new N6LVector(3, false);
        var velx = new N6LVector(3, false);
        //applly//パラメータ適用
        for(i = 0; i <= this.n; i++) {
            for(k = 0; k <= this.dms; k++) {
lastx.x[k] = this.mp[1].x.Sub(this.mp[0].x).Div(this.CNST_AU);

                this.mp[i].x.x[k] = this.mp[i].x1.x[k];
                this.mp[i].v.x[k] = this.mp[i].v1.x[k];

posx = this.mp[1].x.Sub(this.mp[0].x).Div(this.CNST_AU);
velx = new N6LVector(this.mp[1].v);
            }
            if(i === this.mp[i].centerID) continue;
            if(this.blog === false) continue;
            if(i !== 1) continue;

            var lr = this.mp[i].lastR;
            var nr = this.r[this.mp[i].centerID][i] / this.CNST_AU;
            var id = nr - lr;


            this.OnDispLog(i, posx, velx); // 天体番号、座標、速度を通知


// 1. 履歴の更新（常に最新3点を保持）
if (!this.mp[i].posHistory) {
    this.mp[i].posHistory = [];
    this.mp[i].distHistory = [];
    this.mp[i].thHistory = [];
}
this.mp[i].posHistory.push(new N6LVector(posx));
this.mp[i].distHistory.push(nr);
if(vx) {
  var theta = this.calculateTheta(posx);
  this.mp[i].thHistory.push(theta);
}

if (this.mp[i].posHistory.length > 3) {
    this.mp[i].posHistory.shift();
    this.mp[i].distHistory.shift();
}
if (this.mp[i].thHistory.length > 2) {
    this.mp[i].thHistory.shift();
}

// 2. 十分なデータ(3点)がある場合のみ極値判定
var inv = 1;
if (this.mp[i].posHistory.length === 3) {
    if(((this.mp[i].thHistory.length === 2))&&(this.NormalizeRad(this.mp[i].thHistory[1] - this.mp[i].thHistory[0]) < 0)) inv = -1;
    
    // 近日点判定 (減少から増加へ: id > 0 かつ 前回の変化が減少)
    if ((0 < id * inv) && (this.mp[i].isDecreasing * inv < 0)) {
        const precise = this.interpolateExtremumWithTime(this.mp[i].posHistory, this.mp[i].distHistory, this.time, nowdt);
        this.onPerihelion(i, precise.pos.Abs(), precise.pos, precise.time);
        this.mp[i].lastQ = nr;
        this.mp[i].lastT = (precise.time - this.mp[i].lastTime) / 3600 / 24 / 365.2425;
//        var gm = 1 / Math.sqrt(1 - this.mp[i].v.Abs() * this.mp[i].v.Abs());
//        this.mp[i].lastT = this.mp[i].lastT * gm;
        this.mp[i].lastTime = precise.time;

        
        // 角度の保存（軌道面確定後のみ）
        if (this.bInit >= 2 && this.vx !== null) {
            this.perith = this.calculateTheta(precise.pos); // 角度計算を関数化するとスッキリします
            this.bbperi = 2;
        }
        
        if (!this.bperi) {
            this.bperi = true; this.bentperi = false; this.bextperi = true;
        }
    }
    // 遠日点判定 (増加から減少へ: id < 0 かつ 前回の変化が増加)
    if ((id * inv < 0) && (0 < this.mp[i].isDecreasing * inv)) {
        // 最初の遠日点で初期化時刻を設定
        if (this.bInit === 0) {
            this.bInit = 1;
            this.timeInit = this.time;
            this.debugdata[0] = new N6LVector(posx); // 遠日点Aを記録
        }

        const precise = this.interpolateExtremumWithTime(this.mp[i].posHistory, this.mp[i].distHistory, this.time, nowdt);
        this.onAphelion(i, precise.pos.Abs(), precise.pos,  precise.time);

        if (this.bInit >= 2 && this.vx !== null) {
            this.apheth = this.calculateTheta(precise.pos);
            this.bbaphe = 2;
        }

        if (!this.baphe) {
            this.baphe = true; this.bentaphe = false; this.bextaphe = true;
        }
    }
}

// 3. 軌道1/4経過時 (ONSIDE) に座標系を確定させる
if (this.bInit === 1) {
    if (this.timeInit + (this.planet[i].m_t * 3600 * 24 * 365.2425) / 4 <= this.time) {
        this.bInit = 2;
        this.debugdata[1] = new N6LVector(posx); // 90度付近の点Bを記録
        
        // 軌道座標系の算出
        this.vz = this.debugdata[0].Cross(this.debugdata[1]).NormalVec();
        this.vx = this.debugdata[0].NormalVec(); // 最初の遠日点をX軸とする
        this.vy = this.vz.Cross(this.vx).NormalVec();

        this.normZ = new N6LVector(this.vz);
        this.normX = new N6LVector(this.vx);
        this.normY = new N6LVector(this.vy);

        this.onSide(i, nr, posx);
    }
}

            this.mp[i].lastR = nr;
            this.mp[i].lastV = this.mp[i].v.Abs();
            this.mp[i].isDecreasing = id;


            //近日点突入脱出通知
            if((this.bperi)&&(this.perith !==null)){
if(this.bbperi == 0) this.bbperi = 1;
if(this.bbaphe == 0) this.bbaphe = 1;

                var theta = this.calculateTheta(posx);
                var sub = theta - this.perith;
                sub = this.NormalizeRad(sub);
                var subent = theta - (this.perith - this.near * (Math.PI / 180));
                subent = this.NormalizeRad(subent);
                var subext = theta - (this.perith + this.near * (Math.PI / 180));
                subext = this.NormalizeRad(subext);
                if((this.bentperi)&&(0 < subent * inv)&&(subext * inv < 0)){
                  this.bentperi = false; this.bextperi = true;
                  this.OnEnterPerihelion(i);
                }
                if((this.bextperi)&&(0 < subext * inv)){
                  this.bextperi = false; this.bentperi = true;
                  this.OnExitPerihelion(i);
                }

                sub = theta - this.apheth;
                sub = this.NormalizeRad(sub);
                subent = theta - (this.apheth - this.near * (Math.PI / 180));
                subent = this.NormalizeRad(subent);
                subext = theta - (this.apheth + this.near * (Math.PI / 180));
                subext = this.NormalizeRad(subext);
                if((this.bentaphe)&&(0 < subent)&&(subext < 0)){
                  this.bentaphe = false; this.bextaphe = true;
                  this.OnEnterAphelion(i);
                }
                if((this.bextaphe)&&(0 < subext)){
                  this.bextaphe = false; this.bentaphe = true;
                  this.OnExitAphelion(i);
                }

            }
        }
        this.time = this.time + nowdt;
    };

    //calc accel2:this.mp[0]とだけ重力相互作用の計算//質点毎の加速度の計算
    accel2() {
        var i;
        var j;
        var k;
        var fw;
        var fw1;
 
        if(this.swa || this.swc) {
            i = 0;
                if(this.swa) {
                    for(j = i + 1; j <= this.n; j++) {
                        if(this.mp[j].mass <= 0.0) continue;
                        fw = 0.0;
                        this.dx[i][j] = this.mp[i].x1.Sub(this.mp[j].x1);
                        for(k = 0; k <= this.dms; k++) fw += this.dx[i][j].x[k] * this.dx[i][j].x[k];
                        this.r[i][j] = Math.sqrt(fw);

                        for(k = 0; k <= this.dms; k++) {
                            if(this.r[i][j] != 0.0) this.nrm[i][j].x[k] = this.dx[i][j].x[k] / this.r[i][j];
                            else this.nrm[i][j].x[0] = 1.0;
                        }
                        this.r[i][j] = this.r[i][j] - this.al[i][j];

                        if(this.ap[i][j] == 0) this.pow[i][j] = 1.0;
                        if(this.ap[j][i] == 0) this.pow[j][i] = 1.0;
                        if(this.ap[j][i] == -2) {
                            if(this.r[i][j] != 0.0) this.pow[j][i] = 1.0 / this.r[i][j] / this.r[i][j];
                            else this.pow[j][i] = 0.0;
                        }
                        if(this.ap[j][i] == -1) {//relative gravity   //相対性理論万有引力
                            var a1;
                            //velocity orbital component //軌道成分速度
                            var ov = new N6LVector(3);
                            var dx2 = new N6LVector(3);
                            var dx3 = new N6LVector(3);
                            var dx1 = new N6LVector(3);
                            var vv1 = new N6LVector(3);
                            for(k = 0; k < this.dx[i][j].x.length; k++) {
                                dx1.x[k] = -this.dx[i][j].x[k];
                                vv1.x[k] = this.mp[j].v1.x[k];
                            }
                            if(dx1.Abs() != 0.0) {
                                if(dx1.isParallel(vv1)) {
                                    if(dx1.isParallel(dx2.UnitVec(0))) dx2 = dx1.Cross(dx2.UnitVec(1));
                                    else dx2 = dx1.Cross(dx2.UnitVec(0));
                                }
                                else dx2 = dx1.Cross(vv1);
                                
                                if(dx1.isParallel(dx2)) dx3 = dx1; //ERROR
                                else dx3 = dx1.Cross(dx2);
                                ov = vv1.ProjectAxis(dx3);
                                if(isNaN(ov.x[0])) ov = ov.ZeroVec();
                            }
                            //this.mp[i].e = this.GetEccentricity(this.mp[i].x1,ov,this.mp[j].x1);
                            //a1 = this.GetA(this.r[i][j], this.mp[i].mass, this.mp[i].r, ov.Abs(), this.mp[i].e);
                            a1 = this.GetA(this.r[i][j], this.mp[i].mass, this.mp[i].r, ov.Abs(), 0.0, this.mp[j].mass);
                            this.pow[j][i] = a1;
                        }

//                        if(this.ap[i][j] == 1) this.pow[i][j] = this.r[i][j];
                        if(this.ap[j][i] == 1) this.pow[j][i] = this.r[i][j];

//                        this.pow[i][j] = this.pow[i][j] * this.aa[i][j];
                        this.pow[j][i] = this.pow[j][i] * this.aa[j][i];
                    }
                }

                fw1 = 0.0;
                for(k = 0; k <= this.dms; k++) fw1 += this.mp[i].v1.x[k] * this.mp[i].v1.x[k];
                this.mp[i].va = Math.sqrt(fw1);
                for(k = 0; k <= this.dms; k++) {
                    if(this.mp[i].va != 0.0) this.mp[i].vn.x[k] = this.mp[i].v1.x[k] / this.mp[i].va;
                }
        }


        for(i = 0; i <= this.n; i++)
            for(k = 0; k <= this.dms; k++)
                this.mp[i].a.x[k] = 0.0; //clear

        i = 0;
            if(this.swa) { //2 object interaction //２物体間の相互作用
                if(i != this.n) {
                    for(j = i + 1; j <= this.n; j++) {
                        var a = new N6LVector(this.dms + 1);
                        for(k = 0; k <= this.dms; k++) {
                            a.x[k] = ((this.nrm[i][j].x[k] * this.pow[i][j] / (this.mp[i].mass)));
                            this.mp[i].a.x[k] = this.mp[i].a.x[k] + a.x[k];

                            a.x[k] = ((-this.nrm[i][j].x[k] * this.pow[j][i] / (this.mp[j].mass)));
                            this.mp[j].a.x[k] = this.mp[j].a.x[k] + a.x[k];
                        }
                    }
                }
            }
    };

    //Runge-Kutta method//ルンゲ-クッタ法:this.mp[0]とだけ重力相互作用の計算
    UpdateFrame2() {
        var i;
        var k;
        var l;

        //init//設定
        for(i = 0; i <= this.n; i++) {
            for(k = 0; k <= this.dms; k++) {
                this.mp[i].x1.x[k] = this.mp[i].x.x[k];
                this.mp[i].x0.x[k] = this.mp[i].x.x[k];
                this.mp[i].v1.x[k] = this.mp[i].v.x[k];
                this.mp[i].w.x[k] = 0.0;
                this.mp[i].w1.x[k] = 0.0;
            }
        }

        if((0 < this.mp[1].lastR)&&(this.blog)&&(this.bvdt)) this.dt = this.getVariableDT(this.mp[1].lastR, this.planet[1].m_e, this.planet[1].m_a, this.planet[1].m_ra, this.planet[1].m_rb, this.planet[1].m_t);

        var nowdt = this.dt * this.SpdRate;
        //Runge-Kutta method//ルンゲ-クッタ法
        this.accel2();//質点毎に加速度を計算
        //質点毎に速度をルンゲ-クッタ法で計算
        for(l = 0; l <= 2; l++) {
            for(i = 0; i <= this.n; i++) {
                if(this.mp[i].mass <= 0.0) continue;
                var v01 = new N6LVector(this.dms + 1);
                var v02 = new N6LVector(this.dms + 1);
                var v1 = new N6LVector(this.dms + 1);
                var v2 = new N6LVector(this.dms + 1);
                this.ik[l][i] = this.mp[i].v1.Mul(nowdt * this.CNST_C);
                this.mp[i].x1 = this.mp[i].x.Add(this.ik[l][i].Div(this.coef[l + 1]));
                this.mp[i].x0 = new N6LVector(this.mp[i].x1);
                this.mp[i].w = this.mp[i].w.Add(this.ik[l][i].Mul(this.coef[l]));

                var av = new N6LVector(0);
                if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, nowdt);
                else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, nowdt);
                
                for(k = 0; k <= this.dms; k++) this.im[l][i].x[k] = av.x[k];

                v1 = this.im[l][i].Div(this.coef[l + 1]);
                v2 = this.im[l][i].Mul(this.coef[l]);
                for(k = 0; k <= this.dms; k++) {
                    this.mp[i].v1.x[k] = (this.mp[i].v.x[k] + v1.x[k]);
                    this.mp[i].w1.x[k] = (this.mp[i].w1.x[k] + v2.x[k]);
                }
            }
            this.accel2();//質点毎に加速度を計算
        }
        //質点毎に速度をルンゲ-クッタ法で計算
        for(i = 0; i <= this.n; i++) {
            if(this.mp[i].mass < 0.0) continue;
            var v01 = new N6LVector(this.dms + 1);
            var v02 = new N6LVector(this.dms + 1);
            var v1 = new N6LVector(this.dms + 1);
            var v2 = new N6LVector(this.dms + 1);
            this.ik[l][i] = this.mp[i].v1.Mul(nowdt * this.CNST_C);
            this.mp[i].x1 = this.mp[i].x.Add((this.mp[i].w.Add(this.ik[l][i])).Div(6.0));

            var av = new N6LVector(0);
            if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, nowdt);
            else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, nowdt);
                
            for(k = 0; k <= this.dms; k++) this.im[l][i].x[k] = av.x[k];

            v1 = new N6LVector(this.im[l][i]);
            for(k = 0; k <= this.dms; k++) {
                v01.x[k] = this.mp[i].w1.x[k];
                v02.x[k] = this.mp[i].v.x[k];
            }
            if(this.dms == 2) {
                for(k = 0; k <= this.dms; k++) v2.x[k] = (v01.x[k] + v1.x[k]) / 6.0;
                this.mp[i].v1 = this.VelocityAdd3D(v02, v2);
            }
            else if(this.dms == 1) {
                for(k = 0; k <= this.dms; k++) v2.x[k] = (v01.x[k] + v1.x[k]) / 6.0;
                this.mp[i].v1 = this.VelocityAdd2D(v02, v2);
            }
        }



        var lastx = new N6LVector(3, false);
        var posx = new N6LVector(3, false);
        var velx = new N6LVector(3, false);
        //applly//パラメータ適用
        for(i = 0; i <= this.n; i++) {
            for(k = 0; k <= this.dms; k++) {
lastx.x[k] = this.mp[1].x.Sub(this.mp[0].x).Div(this.CNST_AU);

                this.mp[i].x.x[k] = this.mp[i].x1.x[k];
                this.mp[i].v.x[k] = this.mp[i].v1.x[k];

posx = this.mp[1].x.Sub(this.mp[0].x).Div(this.CNST_AU);
velx = new N6LVector(this.mp[1].v);
            }
            if(i === this.mp[i].centerID) continue;
            if(this.blog === false) continue;
            if(i !== 1) continue;

            var lr = this.mp[i].lastR;
            var nr = this.r[this.mp[i].centerID][i] / this.CNST_AU;
            var id = nr - lr;

            this.OnDispLog(i, posx, velx); // 天体番号、座標、速度を通知


// 1. 履歴の更新（常に最新3点を保持）
if (!this.mp[i].posHistory) {
    this.mp[i].posHistory = [];
    this.mp[i].distHistory = [];
    this.mp[i].thHistory = [];
}
this.mp[i].posHistory.push(new N6LVector(posx));
this.mp[i].distHistory.push(nr);
if(vx) {
  var theta = this.calculateTheta(posx);
  this.mp[i].thHistory.push(theta);
}

if (this.mp[i].posHistory.length > 3) {
    this.mp[i].posHistory.shift();
    this.mp[i].distHistory.shift();
}
if (this.mp[i].thHistory.length > 2) {
    this.mp[i].thHistory.shift();
}

// 2. 十分なデータ(3点)がある場合のみ極値判定
var inv = 1;
if (this.mp[i].posHistory.length === 3) {
    if(((this.mp[i].thHistory.length === 2))&&(this.NormalizeRad(this.mp[i].thHistory[1] - this.mp[i].thHistory[0]) < 0)) inv = -1;
    
    // 近日点判定 (減少から増加へ: id > 0 かつ 前回の変化が減少)
    if ((0 < id * inv) && (this.mp[i].isDecreasing * inv < 0)) {
        const precise = this.interpolateExtremumWithTime(this.mp[i].posHistory, this.mp[i].distHistory, this.time, nowdt);
        this.onPerihelion(i, precise.pos.Abs(), precise.pos, precise.time);
        this.mp[i].lastQ = nr;
        this.mp[i].lastT = (time - this.mp[i].lastTime) / 3600 / 24 / 365.2425;
        this.mp[i].lastTime = time;
        
        // 角度の保存（軌道面確定後のみ）
        if (this.bInit >= 2 && this.vx !== null) {
            this.perith = this.calculateTheta(precise.pos); // 角度計算を関数化するとスッキリします
            this.bbperi = 2;
        }
        
        if (!this.bperi) {
            this.bperi = true; this.bentperi = false; this.bextperi = true;
        }
    }

    // 遠日点判定 (増加から減少へ: id < 0 かつ 前回の変化が増加)
    if ((id * inv < 0) && (0 < this.mp[i].isDecreasing * inv)) {
        // 最初の遠日点で初期化時刻を設定
        if (this.bInit === 0) {
            this.bInit = 1;
            this.timeInit = this.time;
            this.debugdata[0] = new N6LVector(posx); // 遠日点Aを記録
        }

        const precise = this.interpolateExtremumWithTime(this.mp[i].posHistory, this.mp[i].distHistory, this.time, nowdt);
        this.onAphelion(i, precise.pos.Abs(), precise.pos,  precise.time);

        if (this.bInit >= 2 && this.vx !== null) {
            this.apheth = this.calculateTheta(precise.pos);
            this.bbaphe = 2;
        }

        if (!this.baphe) {
            this.baphe = true; this.bentaphe = false; this.bextaphe = true;
        }
    }
}

// 3. 軌道1/4経過時 (ONSIDE) に座標系を確定させる
if (this.bInit === 1) {
    if (this.timeInit + (this.planet[i].m_t * 3600 * 24 * 365.2425) / 4 <= this.time) {
        this.bInit = 2;
        this.debugdata[1] = new N6LVector(posx); // 90度付近の点Bを記録
        
        // 軌道座標系の算出
        this.vz = this.debugdata[0].Cross(this.debugdata[1]).NormalVec();
        this.vx = this.debugdata[0].NormalVec(); // 最初の遠日点をX軸とする
        this.vy = this.vz.Cross(this.vx).NormalVec();

        this.normZ = new N6LVector(this.vz);
        this.normX = new N6LVector(this.vx);
        this.normY = new N6LVector(this.vy);

        this.onSide(i, nr, posx);
    }
}

            this.mp[i].lastR = nr;
            this.mp[i].isDecreasing = id;

            //近日点突入脱出通知
            if((this.bperi)&&(this.perith !==null)){
if(this.bbperi == 0) this.bbperi = 1;
if(this.bbaphe == 0) this.bbaphe = 1;

                var theta = this.calculateTheta(posx);
                var sub = theta - this.perith;
                sub = this.NormalizeRad(sub);
                var subent = theta - (this.perith - this.near * (Math.PI / 180));
                subent = this.NormalizeRad(subent);
                var subext = theta - (this.perith + this.near * (Math.PI / 180));
                subext = this.NormalizeRad(subext);
                if((this.bentperi)&&(0 < subent * inv)&&(subext * inv < 0)){
                  this.bentperi = false; this.bextperi = true;
                  this.OnEnterPerihelion(i);
                }
                if((this.bextperi)&&(0 < subext * inv)){
                  this.bextperi = false; this.bentperi = true;
                  this.OnExitPerihelion(i);
                }

                sub = theta - this.apheth;
                sub = this.NormalizeRad(sub);
                subent = theta - (this.apheth - this.near * (Math.PI / 180));
                subent = this.NormalizeRad(subent);
                subext = theta - (this.apheth + this.near * (Math.PI / 180));
                subext = this.NormalizeRad(subext);
                if((this.bentaphe)&&(0 < subent)&&(subext < 0)){
                  this.bentaphe = false; this.bextaphe = true;
                  this.OnEnterAphelion(i);
                }
                if((this.bextaphe)&&(0 < subext)){
                  this.bextaphe = false; this.bentaphe = true;
                  this.OnExitAphelion(i);
                }

            }
        }
        this.time = this.time + nowdt;
    };

    //init//ルンゲ-クッタ法初期設定
    Init(pmp, pdt, planet = null, epc = null, sr = 1, blog = false, bvdt = false, cc = null, cg = null) {
        var i;
        var j;
        var k = pmp[0].x.x.length;

        this.dms = pmp[0].x.x.length - 1;
        this.n = pmp.length - 1;

        for(i = 0; i <= this.n; i++) {
            this.mp[i] = new N6LMassPoint(pmp[i]);
            this.mp[i].x = new N6LVector(pmp[i].x);
            this.mp[i].v = new N6LVector(pmp[i].v);
            this.mp[i].e = pmp[i].e;
        }
        this.SpdRate = sr;
        this.dt = pdt;

        if(cc) this.CNST_C = cc;
        if(cg) this.CNST_G = cg;

        this.epoch = epc;
        this.blog = blog;
        this.bvdt = bvdt;
        this.bInit = 0;
        this.timeInit = 0;
        this.planet = planet;

        this.debugdata = [];


        this.vx = null;
        this.vy = null;
        this.vz = null;
        this.normX = null;
        this.normY = null;
        this.normZ = null; //軌道法線


        this.perith = null;
        this.bperi = false;
        this.bbperi = 0;
        this.bentperi = false;
        this.bextperi = false;
        this.apheth = null;
        this.baphe = false;
        this.bbaphe = 0;
        this.bentaphe = false;
        this.bextaphe = false;


        this.time = 0;
        this.rdx = new Array();
        this.dx = new Array();
        this.nrm = new Array();
        this.pow = new Array();
        this.r = new Array();
        this.aa = new Array();
        this.al = new Array();
        this.ap = new Array();
        this.b = new Array();
        this.c = new Array();
        this.d = new Array();
        for(i = 0; i <= this.n; i++) {
            this.rdx[i] = new Array();
            this.dx[i] = new Array();
            this.nrm[i] = new Array();
            this.pow[i] = new Array();
            this.r[i] = new Array();
            this.aa[i] = new Array();
            this.al[i] = new Array();
            this.ap[i] = new Array();
            for(j = 0; j <= this.n; j++) {          
                this.dx[i][j] = new N6LVector(k);
                this.nrm[i][j] = new N6LVector(k);
            }
        }
        for(i = 0; i <= this.n; i++) {
            for(j = i; j <= this.n; j++) {
                this.pow[i][j] = 0.0;
                this.r[i][j] = 0.0;

                this.aa[i][j] = -(this.mp[i].mass);
                this.al[i][j] = 0.0;
                this.ap[i][j] = -1;   //relative gravity   //相対性理論万有引力

                this.pow[j][i] = 0.0;
                this.r[j][i] = 0.0;

                this.aa[j][i] = -(this.mp[j].mass);
                this.al[j][i] = 0.0;
                this.ap[j][i] = -1;   //relative gravity   //相対性理論万有引力
            }
        }
        for(i = 0; i <= 3; i++) {
            this.ik[i] = new Array();
            this.im[i] = new Array();
            for(j = 0; j <= this.n; j++) {
                this.ik[i][j] = new N6LVector(k);
                this.im[i][j] = new N6LVector(k);
            }
        }
        for(i = 0; i <= this.n; i++) {
            this.b[i] = 0.0;
            this.c[i] = 0.0;
            this.d[i] = new N6LVector(k);
        }

        //---力の設定-------	
        this.swa = true; //２物体間の相互作用
        //強さ
        //aa(0, 0) = -50000
        //aa[1][0]=-50000; aa[1][1]=0.;
        //aa[2][0]=100000.; aa[2][1]=0.; aa[2][2]=0.;
        //力のべき（-2は万有引力やクーロン力，1はバネの弾性力）
        //ap(0, 0) = -2
        //ap[1][0]=-2; ap[1][1]=0;
        //ap[2][0]=100000.; ap[2][1]=0.; ap[2][2]=0.;
        //バネの長さ
        //al(0, 0) = 0.0
        //al[1][0]=0.; al[1][1]=0.;
        //al[2][0]=100000.; al[2][1]=0.; al[2][2]=0.;


        //if(n > 0) { '//対称化（作用・反作用の法則）
        //    for(i = 1; i <= n; i++) {
        //        for(j = 0; j <= i - 1; j++) {
        //            aa[j][i] = aa[i][j];
        //            ap[j][i] = ap[i][j];
        //            al[j][i] = al[i][j];
        //        }
        //    }
        //}

        this.swb = false; //速さに比例する力（粘性抵抗）
        //b[0]=0.; b[1]=0.; b[2]=0.;

        this.swc = false; //速さの二乗に比例する抵抗（慣性抵抗）
        //swc = true; //速さの二乗に比例する抵抗（慣性抵抗）
        //var P = 0.0000000000028;
        //var PACD = 800000000000.0;
        //var AR = -(1.0 / 2.0) * P * PACD;

        //c[0] = 0.0;
        //c[1] = AR;
        //c[2] = 0.0;

        this.swd = false; //一定の力（重力など）
        //d[0][0]=0.; d[0][1]=9.8*mass[0];
        //d[1][0]=0.; d[1][1]=9.8*mass[1];
        //d[2][0]=0.; d[2][1]=9.8*mass[2];		

    };

    //近日点イベント 天体番号、距離、座標を通知
    onPerihelion(i, lr, pos, time){
        if(this.epoch){
          var datt = this.epoch.getTime(); // Get the timestamp of the base date
          var dat1t = datt + this.time * 1000; // Calculate the new timestamp
          var dat1 = new Date(dat1t); // Create a new Date object for the updated time
          console.log("\n[" + dat1.toLocaleString() + "] onPerihelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!\n");
        }
        else {
          console.log("\n[NoDateData] onPerihelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!\n");
        }
    };

    //遠日点イベント 天体番号、距離、座標を通知
    onAphelion(i, lr, pos, time){
        if(this.epoch){
          var datt = this.epoch.getTime(); // Get the timestamp of the base date
          var dat1t = datt + this.time * 1000; // Calculate the new timestamp
          var dat1 = new Date(dat1t); // Create a new Date object for the updated time
          console.log("\n[" + dat1.toLocaleString() + "] onAphelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!\n");
        }
        else {
          console.log("\n[NoDateData] onAphelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!\n");
        }
    };
    //ログ
    OnDispLog(i, pos, vel){ return; }
    OnSide(i, lr, pos){ return; }
    //近日点突入イベント
    OnEnterPerihelion(i){ return; }
    //近日点脱出イベント
    OnExitPerihelion(i){ return; }
    //遠日点突入イベント
    OnEnterAphelion(i){ return; }
    //遠日点脱出イベント
    OnExitAphelion(i){ return; }

NormalizeRad(th) {
  // 1. まず -2π ～ 2π の範囲に収める
  var ret = th % (Math.PI * 2.0);
  
  // 2. 0 ～ 2π の範囲に持ち上げる（負の数対策）
  if (ret < 0) ret += Math.PI * 2.0;
  
  // 3. -π ～ π の範囲に変換する
  if (ret > Math.PI) ret -= Math.PI * 2.0;
  
  return ret;
};

}



//ハイパボリックがMathにあるならばコメントアウトしてください
/*
//ハイパボリックサイン
Math.prototype.sinh = function(x) {
    var ret = 0.0;
    var a = Math.exp(x);
    ret = (a - 1.0 / a) / 2.0;
    return ret;
};

//ハイパボリックコサイン
Math.prototype.cosh = function(x) {
    var ret = 0.0;
    var a = Math.exp(x);
    ret = (a + 1.0 / a) / 2.0;
    return ret;
};

//ハイパボリックタンジェント
Math.prototype.tanh = function(x) {
    var ret = 0.0;
    var a = 1.0 / Math.exp(x * 2.0);
    ret = (1.0 - a) / (1.0 + a);
    return ret;
};
*/

//過去の実際のシミュレートの知見
//水星摂動は１周当たり-0.1035秒だからラジアンにすると-5.01782e-7rad
//100年415周-43秒、-2.0846988287710047724366306401392e-4rad
//誤差込み100年415周-43秒+5秒、-1.8422919882162367756416735889602e-4rad
//誤差込み100年415周-43秒-5秒、-2.3271056693257727692315876913182e-4rad
//このサンプルでは４１５周-2.24626928054717e-4rad、平均-5.42577120905113e-7radあたりの数字を出します
//何とか誤差範囲内に収まった

