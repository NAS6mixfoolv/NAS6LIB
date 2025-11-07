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
    this.dt;

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

    //schwartz correction term//シュワルツシルト補正項
    ToSchwartz(v, e) {
        var ret = 3.0 * v * v / ( 1.0 - (e * e)); //楕円一般相対論//eは一周の積分するときに必要
        if(0.95 < e) ret = -0.5 * v * v;          //直線特殊相対論
        return ret;
    };

    //NAS6 correction term//NAS6補正項
    ToNAS6() {
        return 1 / 4e60;
    };

    //calc accel//加速度の計算
    GetA(r, m, mr, v, e) {
        if(r == 0.0) return 0.0;
        var a = 1.0;
        if(mr <= r) mr = r;
        else a = r / mr;
        var g = this.CNST_G * (m / mr / mr) * a;
        g = g * (1.0 + this.ToSchwartz(v, e)/* - this.ToNAS6() */);
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
                            a1 = this.GetA(this.r[i][j], this.mp[j].mass, this.mp[j].r, ov.Abs(), 0.0);
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
                            a1 = this.GetA(this.r[i][j], this.mp[i].mass, this.mp[i].r, ov.Abs(), 0.0);
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
                this.ik[l][i] = this.mp[i].v1.Mul(this.dt * this.CNST_C);
                this.mp[i].x1 = this.mp[i].x.Add(this.ik[l][i].Div(this.coef[l + 1]));
                this.mp[i].x0 = new N6LVector(this.mp[i].x1);
                this.mp[i].w = this.mp[i].w.Add(this.ik[l][i].Mul(this.coef[l]));

                var av = new N6LVector(0);
                if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, this.dt);
                else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, this.dt);
                
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
            this.ik[l][i] = this.mp[i].v1.Mul(this.dt * this.CNST_C);
            this.mp[i].x1 = this.mp[i].x.Add((this.mp[i].w.Add(this.ik[l][i])).Div(6.0));
            //this.mp[i].x1 = this.mp[i].x.Add((this.mp[i].w.Add(this.ik[l][i])));

            var av = new N6LVector(0);
            if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, this.dt);
            else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, this.dt);
                
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

        //applly//パラメータ適用
        for(i = 0; i <= this.n; i++) {
            for(k = 0; k <= this.dms; k++) {
                this.mp[i].x.x[k] = this.mp[i].x1.x[k];
                this.mp[i].v.x[k] = this.mp[i].v1.x[k];
            }
        }
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
                            this.mp[i].e = this.GetEccentricity(this.mp[i].x1,ov,this.mp[j].x1);
                            a1 = this.GetA(this.r[i][j], this.mp[i].mass, this.mp[i].r, ov.Abs(). this.mp[i].e);
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
                this.ik[l][i] = this.mp[i].v1.Mul(this.dt * this.CNST_C);
                this.mp[i].x1 = this.mp[i].x.Add(this.ik[l][i].Div(this.coef[l + 1]));
                this.mp[i].x0 = new N6LVector(this.mp[i].x1);
                this.mp[i].w = this.mp[i].w.Add(this.ik[l][i].Mul(this.coef[l]));

                var av = new N6LVector(0);
                if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, this.dt);
                else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, this.dt);
                
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
            this.ik[l][i] = this.mp[i].v1.Mul(this.dt * this.CNST_C);
            this.mp[i].x1 = this.mp[i].x.Add((this.mp[i].w.Add(this.ik[l][i])).Div(6.0));

            var av = new N6LVector(0);
            if(this.dms == 2) av = this.VelocityAccl3D(new N6LVector(3), this.mp[i].a, this.dt);
            else if(this.dms == 1) av = this.VelocityAccl2D(new N6LVector(2), this.mp[i].a, this.dt);
                
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

        //applly//パラメータ適用
        for(i = 0; i <= this.n; i++) {
            for(k = 0; k <= this.dms; k++) {
                this.mp[i].x.x[k] = this.mp[i].x1.x[k];
                this.mp[i].v.x[k] = this.mp[i].v1.x[k];
            }
        }
    };

    //init//ルンゲ-クッタ法初期設定
    Init(pmp, pdt, cc, cg) {
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
        this.dt = pdt;

        if(cc) this.CNST_C = cc;
        if(cg) this.CNST_G = cg;

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

