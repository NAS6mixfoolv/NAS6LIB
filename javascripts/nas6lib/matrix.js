//Programed by NAS6
//matrix.js
var SwDefInverseMat = 1;


//matrix//行列
//construction ex.//構築例
//4row4col//4行4列
//var mata = new N6LMatrix(4);
//4row8col//4行8列
//var mata = new N6LMatrix(4, 8);
//4row4col unit matrix//4行4列単位行列
//var mata = new N6LMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1], 4, 4);
//var mata = new N6LMatrix([new N6LVector([1, 0, 0, 0]), new N6LVector([0, 1, 0, 0]), new N6LVector([0, 0, 1, 0]), new N6LVector([0, 0, 0, 1]) ]);
//var mata = new N6LMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
//var matb = new N6LMatrix(mata); //deep copy
//mata.x[0]:vecw mata.x[1]:vecx mata.x[2]:vecy mata.x[3]:vecz 
class N6LMatrix {

  constructor(rh, m , n) {

    this.typename = "N6LMatrix";
    this.x = new Array();
    this.x[0] = new N6LVector();
    this.bHomo = false;

    var i;
    var j;
    var k;
    if(rh && rh.typename == "N6LMatrix"){
        this.x.length = rh.x.length;
        for(i = 0; i < rh.x.length; i++) this.x[i] = new N6LVector(rh.x[i]);            
        this.bHomo = rh.bHomo;
    }
    else if(Array.isArray(rh) && rh[0] && rh[0].typename == "N6LVector"){
        this.x.length = rh.length;
        for(i = 0; i < rh.length; i++) {
            this.x[i] = new N6LVector(rh[i]);
            this.x[i].bHomo = false;
        }
        if(this.x.length >= 4) this.bHomo = true;
        else this.bHomo = false;
    }
    else if(Array.isArray(rh) && rh[0] && Array.isArray(rh[0])){
        this.x.length = rh.length;
        for(i = 0; i < rh.length; i++) this.x[i] = new N6LVector(rh[i]);            
        if(this.x.length >= 4) this.bHomo = true;
        else this.bHomo = false;
    }
    else if(Array.isArray(rh) && m && n) {
        this.x.length = m;
        for(k = 0, i = 0; i < m; i++) {
            var d = new Array();
            for(j = 0; j < n; j++, k++) d[j] = rh[k];
            this.x[i] = new N6LVector(d);
        }
        if(m >= 4) this.bHomo = true;
        else this.bHomo = false;
    }
    else if(typeof(rh) == "number"){
        this.x.length = rh;
        if(typeof(m) == "number") k = m;
        else k = rh;
        for(i = 0; i < rh; i++) this.x[i] = new N6LVector(k).ZeroVec();
        if(rh >= 4) this.bHomo = true;
        else this.bHomo = false;
    }

  }

    Comp(rh) {
        var ret = 0;
        var i;
        if(rh && rh.typename == "N6LMatrix"){
            if(this.x.length != rh.x.length) ret |= 1;
            for(i = 0; i < this.x.length; i++)
                if(this.x[i].Equal(rh.x[i]) == false) ret |= (2 << i);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret == 0) return true;
        return false;
    };

    EpsComp(rh, eps, bbb) {
        if(!eps) eps = 1e-6;
        var ret = 0;
        var i;
        var j = 0;
        if(bbb) j = 1;
        if(rh && rh.typename == "N6LMatrix"){
            if(this.x.length != rh.x.length) ret |= 1;
            for(i = j; i < this.x.length; i++)
                if(this.x[i].EpsEqual(rh.x[i], eps) == false) ret |= (2 << i);
        }
        else ret |= 0x80000000;
        return ret;
    };
 
    EpsEqual(rh, eps, bbb) {
        var ret = this.EpsComp(rh, eps, bbb);
        if(ret == 0) return true;
        return false;
    };

    Str() {
        var ret = '';
        var i;
        ret += String(this.bHomo);
        ret += ',' + String(this.x.length);
        for(i = 0; i < this.x.length; i++) ret += ' ' + this.x[i].Str();
        return ret;
    };

    Parse(str) {
        var token = str.split(' ');
        var token2 = token[0].split(',');
        var ret = new N6LMatrix(Number(token2[1]), Boolean(token2[0]));
        if(token.length < ret.x.length + 1) return "Error";
        var i;
        for(i = 0; i < ret.x.length; i++) ret.x[i] = new N6LVector().Parse(token[i + 1]);
        return ret;
    };

    ToX3DOM() {
        if(!this.bHomo || this.x.length != 4) return "Error";
        return new x3dom.fields.SFMatrix4f(
            this.x[1].x[1], this.x[1].x[2], this.x[1].x[3], this.x[1].x[0],
            this.x[2].x[1], this.x[2].x[2], this.x[2].x[3], this.x[2].x[0],
            this.x[3].x[1], this.x[3].x[2], this.x[3].x[3], this.x[3].x[0],
            this.x[0].x[1], this.x[0].x[2], this.x[0].x[3], this.x[0].x[0]);
    };

    FromX3DOM(sf) {
        var str = sf.toString().replace(/\n/g , "");
        var token = str.split(' ');
        if(token.length != 16) return "Error";
        return new N6LMatrix([
            [Number(token[15]), Number(token[12]), Number(token[13]), Number(token[14])],
            [Number(token[3]), Number(token[0]), Number(token[1]), Number(token[2])],
            [Number(token[7]), Number(token[4]), Number(token[5]), Number(token[6])],
            [Number(token[11]), Number(token[8]), Number(token[9]), Number(token[10])]]);

    };

    To3JS() {
        if(!this.bHomo || this.x.length != 4) return "Error";
        var m = new THREE.Matrix4();
        return m.set(
            this.x[1].x[1], this.x[1].x[2], this.x[1].x[3], this.x[1].x[0],
            this.x[2].x[1], this.x[2].x[2], this.x[2].x[3], this.x[2].x[0],
            this.x[3].x[1], this.x[3].x[2], this.x[3].x[3], this.x[3].x[0],
            this.x[0].x[1], this.x[0].x[2], this.x[0].x[3], this.x[0].x[0]);
    };

    From3JS(ary) {
        if(ary.length != 16) return "Error";
        return new N6LMatrix([
            [Number(ary[15]), Number(ary[12]), Number(ary[13]), Number(ary[14])],
            [Number(ary[3]), Number(ary[0]), Number(ary[1]), Number(ary[2])],
            [Number(ary[7]), Number(ary[4]), Number(ary[5]), Number(ary[6])],
            [Number(ary[11]), Number(ary[8]), Number(ary[9]), Number(ary[10])]]);
    };

    //行の取得
    GetRow(rh) {
        var l = new N6LMatrix(this);
        var ret = new N6LVector(l.x[rh], false);
        if(l.bHomo) {
            ret.x[0] = 1.0;
            ret = ret.SetHomo(true);
        }
        return ret;
    };

    //列の取得
    GetCol(rh) {
        var l = new N6LMatrix(this).TransposedMat();
        return l.GetRow(rh);
    };

    //行の設定
    SetRow(rh, val) {
        var ret = new N6LMatrix(this);
        ret.x[rh] = new N6LVector(val.x, false);
        return ret;
    };

    //列の設定
    SetCol(rh, val) {
        var l = new N6LMatrix(this).TransposedMat();
        var ret = l.SetRow(rh, val).TransposedMat();
        return ret;
    };

    //four arithmetic operations(contain convenience)//四則演算(便宜上も含む)
    Add(rh) {
        var ret = new N6LMatrix();
        if(rh && rh.typename == "N6LMatrix"){
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            if((this.x.length != rh.x.length) || (this.x.length != this.x[0].x.length)) return "Error";
            if(me.bHomo) {
                me = me.Homogeneous();
                rh = rh.Homogeneous();
            }
            var i;
            for(i = 0; i < me.x.length; i++) {
                //if(me.bHomo == true) me.x[i] = me.x[i].SetHomo(true);
                ret.x[i] = me.x[i].Add(rh.x[i].SetHomo(false)).SetHomo(false);
            }
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            var i;
            var j = 0;
            var k;
            if(me.bHomo) {
                me = me.Homogeneous();
                j = 1;
            }
            if(rh == 0.0) return me;
            for(i = j; i < me.x.length; i++) {
                if(me.bHomo == true) {
                    k = me.x[i].x[0];
                    me.x[i].x[0] = 1;
                    me.x[i] = me.x[i].SetHomo(true);
                }
                ret.x[i] = me.x[i].Add(rh).SetHomo(false);
                ret.x[i][0] = k;
            } 
            return ret;
        }
        return ret;
    };

    Sub(rh) {
        var ret = new N6LMatrix();
        if(rh && rh.typename == "N6LMatrix"){
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            if((this.x.length != rh.x.length) || (this.x.length != this.x[0].x.length)) return "Error";
            if(me.bHomo) {
                me = me.Homogeneous();
                rh = rh.Homogeneous();
            }
            var i;
            for(i = 0; i < me.x.length; i++) {
                //if(me.bHomo) me.x[i] = me.x[i].SetHomo(true);
                ret.x[i] = me.x[i].Sub(rh.x[i].SetHomo(false)).SetHomo(false);
            } 
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            var i;
            var j = 0;
            var k;
            if(me.bHomo) {
                me = me.Homogeneous();
                j = 1;
            }
            if(rh == 0.0) return me;
            for(i = j; i < me.x.length; i++) {
                if(me.bHomo == true) {
                    k = me.x[i].x[0];
                    me.x[i].x[0] = 1;
                    me.x[i] = me.x[i].SetHomo(true);
                }
                ret.x[i] = me.x[i].Sub(rh).SetHomo(false);
                ret.x[i][0] = k;
            } 
        }
        return ret;
    };

    Mul(rh) {
        var ret = new N6LMatrix();
        if(rh && rh.typename == "N6LMatrix"){
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            if((this.x.length != rh.x.length) || (this.x.length != this.x[0].x.length)) return "Error";
            if(me.bHomo) {
                me = me.Homogeneous();
                rh = rh.Homogeneous();
            }
            var i;
            var j;
            var t = new N6LMatrix(rh).TransposedMat();
            for(i = 0; i < me.x.length; i++) {
                for(j = 0; j < me.x.length; j++) {
                    //if(me.bHomo) me.x[i] = me.x[i].SetHomo(true);
                    ret.x[i].x[j] = me.x[i].Mul(t.x[j].SetHomo(false));
                }
                ret.x[i] = ret.x[i].SetHomo(false);
            }
            return ret;
        } 
        else if(rh && rh.typename == "N6LVector"){
            ret = new N6LVector(rh.x.length);
            if(this.x.length != rh.x.length) return "Error";
            var me = new N6LMatrix(this);
            if(me.bHomo) me = me.Homogeneous();
            var r = new N6LVector(rh);
            if(r.bHomo){
                r = r.Homogeneous().SetHomo(false);
                ret = ret.SetHomo(true);
            }
            var i;
            for(i = 0; i < r.x.length; i++) {
                //if(me.bHomo) me.x[i] = me.x[i].SetHomo(true);
                ret.x[i] = me.x[i].Mul(r);
            }
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            var i;
            var j = 0;
            var k;
            if(me.bHomo) {
                me = me.Homogeneous();
                j = 1;
            }
            if(rh == 0.0) return me;
            for(i = j; i < me.x.length; i++) {
                if(me.bHomo == true) {
                    k = me.x[i].x[0];
                    me.x[i].x[0] = 1;
                    me.x[i] = me.x[i].SetHomo(true);
                }
                ret.x[i] = me.x[i].Mul(rh).SetHomo(false);
                ret.x[i][0] = k;
            } 
            return ret;
        }
        return ret;
    };

    //convenience//便宜上
    Div(rh) {
        var ret = new N6LMatrix();
        if(rh && rh.typename == "N6LMatrix"){
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            if((this.x.length != rh.x.length) || (this.x.length != this.x[0].x.length)) return "Error";
            if(me.bHomo) {
                me = me.Homogeneous();
                rh = rh.Homogeneous();
            }
            var i;
            var j;
            var t = new N6LMatrix(rh).TransposedMat();
            for(i = 0; i < me.x.length; i++) {
                for(j = 0; j < me.x.length; j++) {
                    //if(me.bHomo) me.x[i] = me.x[i].SetHomo(true);
                    ret.x[i].x[j] = me.x[i].Div(t.x[j].SetHomo(false));
                } 
                ret.x[i] = ret.x[i].SetHomo(false);
            }
            return ret;
        } 
        else if(rh && rh.typename == "N6LVector"){
            ret = new N6LVector(rh.x.length);
            if(this.x.length != rh.x.length) return "Error";
            var me = new N6LMatrix(this);
            if(me.bHomo) me = me.Homogeneous();
            var r = new N6LVector(rh);
            if(r.bHomo){
                r = r.Homogeneous().SetHomo(false);
                ret = ret.SetHomo(true);
            }
            var i;
            for(i = 0; i < r.x.length; i++) {
                //if(me.bHomo) me.x[i] = me.x[i].SetHomo(true);
                ret.x[i] = me.x[i].Div(r);
            } 
            return ret;
        }
        else if(typeof(rh) == "number") {
            ret = new N6LMatrix(this);
            var me = new N6LMatrix(this);
            var i;
            var j = 0;
            var k;
            if(me.bHomo) {
                me = me.Homogeneous();
                j = 1;
            }
            if(rh == 0.0) return me;
            for(i = j; i < me.x.length; i++) {
                if(me.bHomo == true) {
                    k = me.x[i].x[0];
                    me.x[i].x[0] = 1;
                    me.x[i] = me.x[i].SetHomo(true);
                }
                ret.x[i] = me.x[i].Div(rh).SetHomo(false);
                ret.x[i][0] = k;
            } 
            return ret;
        }
        return ret;
    };

    //set bHomo property //bHomoプロパティ強制セット
    SetHomo(rh) {
        var ret = new N6LMatrix(this);
        ret.bHomo = rh;
        return ret;
    };

    //max absolute of element//要素の最大絶対値
    Max() {
        var ret = 0.0;
        var i;
        var j = 0;
        var l = new N6LMatrix(this);
        if(this.bHomo) {
            l = l.Homogeneous();
            j = 1;
        }
        for(i = j; i < l.x.length; i++) {
            if(this.bHomo) l.x[i] = l.x[i].SetHomo(true);
            if(Math.abs(ret) < Math.abs(l.x[i].Max())) ret = l.x[i].Max();
            if(this.bHomo) l.x[i] = l.x[i].SetHomo(false);
        }
        return ret;
    };

    DivMax(eps) {
        if(!eps) eps = 1e-6;
        var l = new N6LMatrix(this);
        var max = Math.abs(l.Max());
        if(max < 1.0 - eps) return l;
        return l.Div(max);
    };

    //repair//修正
    Repair(eps) {
        if(!eps) eps = 1e-6;
        var ret = new N6LMatrix(this);
        var i;
        for(i = 0; i < ret.x.length; i++) ret.x[i] = ret.x[i].Repair(eps);
        return ret;
    };

    //zero matrix//ゼロ行列
    ZeroMat() {
        return new N6LMatrix(this.x.length, this.x[0].x.length).SetHomo(this.bHomo);
    };

    //unit matrix//単位行列
    UnitMat() {
        var ret = new N6LMatrix(this.x.length).SetHomo(this.bHomo);
        var w = new N6LVector(this.x.length);
        var i;
        for(i = 0; i < this.x.length; i++) ret.x[i] = w.UnitVec(i);
        return ret;
    };

    //normalized rotate matrix//正規化回転行列
    NormalMat() {
        var i;
        var j = 0;
        var ret = new N6LMatrix(this).Repair();
        if(this.bHomo) {
            ret = ret.Homogeneous();
            j = 1;
        }
        //ret = ret.TransposedMat();
        for(i = j; i < this.x.length; i++) {
            if(this.bHomo) {
                var w = ret.x[i].x[0];
                ret.x[i].x[0] = 0.0;
                ret.x[i] = ret.x[i].NormalVec();
                if(ret.x[i].EpsEqual(ret.x[i].ZeroVec())) ret.x[i] = ret.x[i].UnitVec(i);
                ret.x[i].x[0] = w;
                ret.x[i] = ret.x[i];
            }
            else {
                ret.x[i] = ret.x[i].NormalVec();
                if(ret.x[i].EpsEqual(ret.x[i].ZeroVec())) ret.x[i] = ret.x[i].UnitVec(i);
            }
        }
        //ret = ret.TransposedMat();
        return ret;
    };

    //transposed matrix//転置行列
    TransposedMat() {
        var ret = new N6LMatrix(this.x[0].x.length, this.x.length).SetHomo(this.bHomo);
        var i;
        var j;
        for(i = 0; i < this.x[0].x.length; i++)
            for(j = 0; j < this.x.length; j++)
                ret.x[i].x[j] = this.x[j].x[i];
        return ret;
    };

    //translate//平行移動
    TranslatedMat(rh) {
        if(rh && rh.typename == "N6LVector"){
            var ret = new N6LMatrix(this);
            var i;
            if(this.bHomo){
                ret = ret.Homogeneous();
                if((rh.bHomo && this.x.length != rh.x.length) && (!rh.bHomo && this.x.length - 1 != rh.x.length)) return "Error";
                if(rh.bHomo) {
                    var wk = rh.Homogeneous();
                    for(i = 1; i < this.x.length; i++) ret.x[i].x[0] += wk.x[i];
                }
                else {
                    var wk = new N6LVector(rh);
                    for(i = 1; i < this.x.length; i++) ret.x[i].x[0] += wk.x[i - 1];
                }
            }
            else return "Error";
            return ret;
        }
        return "Error";
    };

    //scale//拡大
    ScaleMat(rh) {
        var ret = new N6LMatrix(this.x.length).UnitMat().SetHomo(this.bHomo);
        var i;
        if(rh && rh.typename == "N6LVector"){
            if(this.bHomo){
                if((rh.bHomo && this.x.length != rh.x.length) && (!rh.bHomo && this.x.length - 1 != rh.x.length)) return "Error";
                if(rh.bHomo) {
                    var wk = rh.Homogeneous();
                    for(i = 1; i < this.x.length; i++) ret.x[i].x[i] = wk.x[i];
                }
                else {
                    var wk = new N6LVector(rh);
                    for(i = 1; i < this.x.length; i++) ret.x[i].x[i] = wk.x[i - 1];
                }
            }
            else{
                if((rh.bHomo && this.x.length != rh.x.length - 1) && (!rh.bHomo && this.x.length != rh.x.length)) return "Error";
                if(rh.bHomo) {
                    var wk = rh.Homogeneous();
                    for(i = 1; i < rh.x.length; i++) ret.x[i - 1].x[i - 1] = wk.x[i];
                }
                else {
                    var wk = new N6LVector(rh);
                    for(i = 0; i < this.x.length; i++) ret.x[i].x[i] = wk.x[i];
                }
            }  
            return this.Mul(ret);
        }
        else if(typeof(rh) == "number") {
            if(this.bHomo){
                for(i = 1; i < this.x.length; i++) ret.x[i].x[i] = rh;
            }
            else{
                for(i = 0; i < this.x.length; i++) ret.x[i].x[i] = rh;
            }
            return this.Mul(ret);
        }
        return "Error";
    };

    //affine//アフィン変換
    AffineMat(scale, rotate, translate) {
        var ret = new N6LMatrix(this.x.length).UnitMat();
        var s;
        var r;
        var t;
        if(this.bHomo && scale && rotate && translate){
            if(translate.bHomo) {if(translate.typename == "N6LVector") t = new N6LVector(translate);}
            else if(translate.typename == "N6LVector") t = new N6LVector(translate).ToHomo();
            else return "Error";
            if(scale.bHomo) {if(scale.typename == "N6LVector") s = new N6LVector(scale);}
            else if(typeof(scale) == "number") s = scale;
            else return "Error";
            ret = ret.TranslatedMat(t);
            ret = ret.ScaleMat(s);  
            if(rotate.bHomo) {
                if(rotate.typename == "N6LVector") r = new N6LVector(rotate);
                else if(rotate.typename == "N6LQuaternion") r = new N6LQuaternion(rotate);
                else if(rotate.typename == "N6LMatrix") ret = ret.Mul(new N6LMatrix(rotate)); 
                else return "Error";
            }
            else {
                if(rotate.typename == "N6LVector") r = new N6LVector(rotate).ToHomo();
                else if(rotate.typename == "N6LQuaternion") r = new N6LQuaternion(rotate).ToHomo();
                else if(rotate.typename == "N6LMatrix") ret = ret.Mul(new N6LMatrix(rotate).ToHomo()); 
                else return "Error";
            }
            if(rotate.typename == "N6LVector" || rotate.typename == "N6LQuaternion") ret = ret.Mul(r.Matrix());
            return this.Mul(ret).SetHomo(true);
        }
        return "Error";
    };

    //move matrix//移動
    MoveMat(outmat, outv, d, pyr, v, a, vmin, vmax) {
        var WAA = new N6LMatrix(this);
        var va = WAA.Mul(d.Mul(-1));
        WAA.x[1].x[0] = va.x[1]; 
        WAA.x[2].x[0] = va.x[2];
        WAA.x[3].x[0] = va.x[3]; 
        var dt = [];
        var WA = new N6LMatrix(WAA);

        //原点に移動
        var WB = WA.InverseMat(dt); //カメラ回転行列取得;
        WB.x[1].x[0] = 0; 
        WB.x[2].x[0] = 0;
        WB.x[3].x[0] = 0; 

        var q = [new N6LQuaternion(Math.cos(pyr.x[1] / 2), WB.x[1].SetHomo(true).Mul(Math.sin(pyr.x[1] / 2))).NormalQuat(), //クォータニオンピッチ 
                 new N6LQuaternion(Math.cos(pyr.x[2] / 2), WB.x[2].SetHomo(true).Mul(Math.sin(pyr.x[2] / 2))).NormalQuat(), //クォータニオンヨー
                 new N6LQuaternion(Math.cos(pyr.x[3] / 2), WB.x[3].SetHomo(true).Mul(Math.sin(pyr.x[3] / 2))).NormalQuat()]; //クォータニオンロール
        WB.x[1] = WB.x[1].SetHomo(false); WB.x[2] = WB.x[2].SetHomo(false); WB.x[3] = WB.x[3].SetHomo(false); 
        var qq = q[0].Mul(q[1].Mul(q[2]));
        WA = WB.Mul(qq.Matrix()).InverseMat(dt); //回転

        //平行移動
        var TA = WAA.TransposedMat();
        if(v.typename == "N6LVector") {
            var VV =  WA.Mul(v);
            WA = WA.TranslatedMat(VV.Add(TA.x[0].SetHomo(true)));
        }
        else {
            var VV = v + a;
            if(vmin != 987654321.0 && VV < vmin) VV = vmin;
            if(vmax != 987654321.0 && vmax < VV) VV = vmax;
            var z = WB.x[3];
            z.x[0] = 1;
            var vv = z.SetHomo(true).DirectionCosine().Mul(-1).Mul(VV); //加速度適用 
            WA = WA.TranslatedMat(vv.Add(TA.x[0].SetHomo(true)));
            outv[0] = new N6LVector(vv);
        }
        WAA = new N6LMatrix(WA);
        va = WAA.Mul(d);
        WAA.x[1].x[0] = va.x[1]; 
        WAA.x[2].x[0] = va.x[2];
        WAA.x[3].x[0] = va.x[3]; 
        outmat[0] = new N6LMatrix(WA);
        return WAA;
    };

    //look at matrix//注視
    LookAtMat(eye, lookat, up) {
      if(!eye || eye.typename != "N6LVector" || !lookat || lookat.typename != "N6LVector" || !up || up.typename != "N6LVector") return "Error";
      if((eye.x.length != 3 && eye.x.length != 4) || (lookat.x.length != 3 && lookat.x.length != 4) || (up.x.length != 3 && up.x.length != 4)) return "Error";
      if(!eye.bHomo) eye = eye.ToHomo();
      if(!lookat.bHomo) lookat = lookat.ToHomo();
      if(!up.bHomo) up = up.ToHomo();

      var ep = new N6LVector(eye);
      var ez = lookat.Sub(eye).NormalVec();
      var ex = up.Cross(ez).NormalVec();
      var ey = ez.Cross(ex).NormalVec();

      var ret = new N6LMatrix([
          [1,       0,       0,       0      ],
          [ep.x[1], ex.x[1], ex.x[2], ex.x[3]],
          [ep.x[2], ey.x[1], ey.x[2], ey.x[3]],
          [ep.x[3], ez.x[1], ez.x[2], ez.x[3]]]).NormalMat();

      if(!this.bHomo) ret = ret.ToNormal();
      return this.Mul(ret);
    };

    //look at matrix//注視
    LookAtMat2(rh) {
        if(!rh) return "Error";
        var WM = new N6LMatrix(this);
        var eye = WM.Pos().Mul(-1);
        var lookat;
        if(rh.typename == "N6LMatrix") lookat = rh.Pos().Mul(-1); //注視目標セット
        else if(rh.typename == "N6LVector") lookat = new N6LVector(rh).Mul(-1); //注視目標セット
        else return "Error";

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



    //inside call LU decomposition inverse matrix  // iex is Array//LU分解逆行列呼び出し関数
    SubLUD(mx, m, n, iex) {
        if(!mx || mx.typename != "N6LMatrix") return "Error";
        var i;
        var j;
        var k;
        var aii;
        var t;

        iex[0] = 0;
        if(m <= 0 || m > n) return 1;
        if(m > 1) {
            for(i = 0; i < m - 1; i++) {
                for(j = i; j < m; j++) {
                    aii = mx.x[j].x[i];
                    if(aii) break;
                }
                if(aii == 0.0) return 2;
                if(j != i) {
                    for(k = 0; k < n; k++) {
                        t = mx.x[i].x[k];
                        mx.x[i].x[k] = mx.x[j].x[k];
                        mx.x[j].x[k] = t;
                    }
                    iex[0] = iex[0] + 1;
                }
                for(j = i + 1; j < m; j++){
                    t = mx.x[j].x[i] / aii;
                    mx.x[j].x[i] = t;
                    for(k = i + 1; k < n; k++) mx.x[j].x[k] = mx.x[j].x[k] - (mx.x[i].x[k] * t);
                }
            }
            if(m == n) return 0;
        }
        aii = 1.0 / mx.x[m - 1].x[m - 1];
        if(!mx.x[m - 1].x[m - 1]) aii = 1.0;
        for(i = m; i < n; i++) mx.x[m - 1].x[i] = mx.x[m - 1].x[i] * aii;
        if(m == 1) return 0;
        for(i = m - 2; i >= 0; i--) {
            aii = mx.x[i].x[i];
            if(!aii) aii = 1.0;
            for(j = m; j < n; j++){
                t = 0.0;
                for(k = m - 1; k >= i + 1; k--) t = t + mx.x[i].x[k] * mx.x[k].x[j];
                mx.x[i].x[j] = (mx.x[i].x[j] - t) / aii;
            } 
        }
        return 0;
    };

    //LU decomposition inverse matrix // all param is Array//LU分解逆行列
    LUDMat(l, u, dt) {
        //dt = new Array();
        if(!l[0] || l[0].typename != "N6LMatrix") return "Error";
        if(!u[0] || u[0].typename != "N6LMatrix") return "Error";
        var ll = new N6LMatrix(this.x.length, this.x.length).SetHomo(false);
        var w = new N6LMatrix(this.x.length, this.x.length * 2).SetHomo(false);
        var ret = new N6LMatrix(this.x.length, this.x.length).SetHomo(this.bHomo);
        var iex = new Array();
        iex[0] = 0;
        var i;
        var j;
        var m = this.x.length;
        var n = m + m;
        for(i = 0; i < m; i++) {
            for(j = 0; j < n; j++) {
                if(j < m) w.x[i].x[j] = this.x[i].x[j];
                else if(j == i + m) w.x[i].x[j] = 1.0;
                else w.x[i].x[j] = 0.0;
            }
        }
        var ier = this.SubLUD(w, m, n, iex);
        if(ier) return ret.ZeroMat();
        dt[0] = 1.0;
        for(i = 0; i < m; i++) {
            for(j = 0; j < m; j++) {
                if(j < i) {
                    l[0].x[i].x[j] = w.x[i].x[j];
                    u[0].x[i].x[j] = 0.0;
                }
                else if(j == i) {
                    l[0].x[i].x[j] = 1.0;
                    u[0].x[i].x[j] = w.x[i].x[j];
                    dt[0] = dt[0] * w.x[i].x[j];
                }
                else {
                    l[0].x[i].x[j] = 0.0;
                    u[0].x[i].x[j] = w.x[i].x[j];
                }
            }
        }
        if(iex % 2) dt[0] = -dt[0];
        for(i = 0; i < m; i++) 
            for(j = 0; j < m; j++) 
                ret.x[i].x[j] = w.x[i].x[j + m];
        return ret;
    };

    //simultaneous linear equations solver // dt is Array//連立1次方程式解法
    SimEQ(m, n, dt) {
        //dt = new Array();
        var ret = new N6LMatrix(this);
        var ax;
        var d;
        var i;
        var j;
        var k;
        if(m < 1 || m > n) {
            dt[0] = 0.0;
            ret = ret.ZeroMat();
            return ret;
        }

        if(m == 1) {
            d = Me.x[0].x[0];
            if(d) {
                for(i = 0; i < n; i++)
                    ret.x[0].x[i] = this.x[0].x[i] / d;
            }
            dt[0] = d;
            return ret;
        }
        d = 1.0;
        for(i = 0; i < m; i++) {
            j = i;
            while(true) {
                if(j >= m) {
                    dt[0] = 0.0;
                    ret = ret.ZeroMat();
                    return ret;
                }
                if(ret.x[j].x[i] != 0.0) break;
                j = j + 1;
            }
            if(j != i) {
                for(k = i; k < n; k++) {
                    ax = ret.x[i].x[k];
                    ret.x[i].x[k] = ret.x[j].x[k];
                    ret.x[j].x[k] = ax;
                }
                d = -d;
            }

            ax = ret.x[i].x[i];
            if(!ax) ax = 1.0;
            d = d * ax;
            ret.x[i].x[i] = 1.0;

            for(j = i + 1; j < n; j++) ret.x[i].x[j] = ret.x[i].x[j] / ax;
            for(j = 0; j < m; j++) {
                if(i != j) {
                    ax = ret.x[j].x[i];
                    ret.x[j].x[i] = 0.0;
                    for(k = i + 1; k < n; k++) ret.x[j].x[k] = ret.x[j].x[k] - ret.x[i].x[k] * ax;
                }
            }
        }
        dt[0] = d;
        return ret;
    };

    //inverse matrix // dt is Array//逆行列
    InverseMat(dt, sw) {
        if(!sw) sw = SwDefInverseMat;
        switch(sw) {
        case 1 : if(this.bHomo) {
                   var v = this.GetCol(0).SetHomo(false);
                   var m = this;
                   m = m.SetCol(0,new N6LVector([1,0,0,0],false)).ToNormal();
                   m = m.TransposedMat().ToHomo().SetCol(0,v);
                   return m;
                 }
                 else return this.TransposedMat();
        case 2 : return this.InverseMat00(dt);
        case 3 : return this.InverseMat01(dt);
        case 4 : return this.DeterminMatInvMat(dt);
        default: return "Error";
        }
    };

    //inverse matrix // dt is Array//逆行列
    InverseMat00(dt) {
        var m = this.x.length;
        var n;
        var i;
        var j;
        var a = new N6LMatrix(this.x.length, this.x.length * 2);
        var ret = new N6LMatrix(this.x.length, this.x[0].x.length).SetHomo(this.bHomo);

        if(m < 1) return this.ZeroMat();
        n = m + m;

        for(i = 0; i < m; i++)
            for(j = 0; j < m; j++)
                a.x[i].x[j] = this.x[i].x[j];
        for(i = 0; i < m; i++) {
            for(j = 0; j < m; j++) {
                if(i == j) a.x[i].x[j + m] = 1.0;
                else a.x[i].x[j + m] = 0.0;
            }
        }

        a = a.SimEQ(m, n, dt);

        for(i = 0; i < m; i++)
            for(j = 0; j < m; j++)
                ret.x[i].x[j] = a.x[i].x[j + m];

        return ret;
    };

    //inverse matrix sweeping-out method // dt is Array//逆行列掃き出し法
    InverseMat01(dt) {
        //dt = new Array();
        dt[0] = -1;
        var ret = new N6LMatrix(this.x.length, this.x[0].x.length).UnitMat().SetHomo(this.bHomo);
        if(ret.x.length != ret.x[0].x.length) return ret;
        var wk = new N6LMatrix(this);
        var buf;
        var i;
        var j;
        var k;

        var n = ret.x.length;
        for(i = 0; i < n; i++) {
            if(wk.x[i].x[i]) buf = 1.0 / wk.x[i].x[i];
            else buf = 1.0;
            for(j = 0; j < n; j++) {
                wk.x[i].x[j] *= buf;
                ret.x[i].x[j] *= buf;
            }
            for(j = 0; j < n; j++) {
                if(i != j) {
                    buf = wk.x[j].x[i];
                    for(k = 0; k < n; k++) {
                        wk.x[j].x[k] -= wk.x[i].x[k] * buf;
                        ret.x[j].x[k] -= ret.x[i].x[k] * buf;
                    }
                }
            }
        }
        return ret;
    };

    //determin matrix inverse matrix // dt is Array//行列式逆行列
    DeterminMatInvMat(dt) {
        //dt = new Array();
        dt[0] = -1;
        var l = [new N6LMatrix(this.x.length, this.x.length).SetHomo(this.bHomo)];
        var u = [new N6LMatrix(this.x.length, this.x.length).SetHomo(this.bHomo)];
        return this.LUDMat(l, u, dt);
    };

    //determin matrix//行列式
    DeterminMat(dt) {
        //dt = new Array();
        dt[0] = -1;
        var l = [new N6LMatrix(this.x.length, this.x.length).SetHomo(this.bHomo)];
        var u = [new N6LMatrix(this.x.length, this.x.length).SetHomo(this.bHomo)];
        this.LUDMat(l, u, dt);
        return dt[0];
    };

    //type double absolute//double型絶対値
    fabs(x) {
        var ret = x;
        if(x < 0.0) ret = ret * -1.0;
        return ret;
    };

    //real symmetric matrix eigenvalue,eigenvector(jacobi method）
    //n : demention                                             
    //ct : max repeat time                                
    //eps : convergence test conditions                                  
    //A : target matrix                                   
    //A1, A2 : work（nxn matrix），diagonal elements of A1 is eigenvalue  
    //X1, X2 : work（nxn matrix），each column of X1 is eigenvector 
    //return : =0 : good                                   
    //=1 : not convergence                               
    //実対称行列の固有値・固有ベクトル（ヤコビ法）
    //n : 次数                                             
    //ct : 最大繰り返し回数                                
    //eps : 収束判定条件                                   
    //A : 対象とする行列                                   
    //A1, A2 : 作業域（nxnの行列），A1の対角要素が固有値   
    //X1, X2 : 作業域（nxnの行列），X1の各列が固有ベクトル 
    //return : =0 : 正常                                   
    //=1 : 収束せず                               
    // A,A1,A2,X1,X2 is Array
    Jacobi(n, ct, eps, A, A1, A2, X1, X2) {
        var max;
        var s;
        var t;
        var v;
        var sn;
        var cs;

        var i1;
        var i2;
        var k = 0;
        var ind = 1;
        var p = 0;
        var q = 0;

        //init//初期設定
        for(i1 = 0; i1 < n; i1++) {
            for(i2 = 0; i2 < n; i2++) {
                A1[0].x[i1].x[i2] = A[0].x[i1].x[i2];
                X1[0].x[i1].x[i2] = 0.0;
            }
            X1[0].x[i1].x[i1] = 1.0;
        }
        //calc//計算
        while(ind > 0 && k < ct) {
            //最大要素の探索
            max = 0.0;
            for(i1 = 0; i1 < n; i1++) {
                for(i2 = 0; i2 < n; i2++) {
                    if(i2 != i1) {
                        if(this.fabs(A1[0].x[i1].x[i2]) > max) {
                            max = this.fabs(A1[0].x[i1].x[i2]);
                            p = i1;
                            q = i2;
                        }
                    }
                }
            }
            //convergence test//収束判定
            if(max < eps) ind = 0; //convergence//収束した
            else { //not convergence//収束しない
                //ready//準備
                s = -A1[0].x[p].x[q];
                t = 0.5 * (A1[0].x[p].x[p] - A1[0].x[q].x[q]);
                if(s * s + t * t) v = this.fabs(t) / Math.sqrt(s * s + t * t);
                else v = this.fabs(t);
                sn = Math.sqrt(0.5 * (1.0 - v));
                if(s * t < 0.0) sn = -sn;
                cs = Math.sqrt(1.0 - sn * sn);
                //calc Ak//Akの計算
                for(i1 = 0; i1 < n; i1++) {
                    if(i1 == p) {
                        for(i2 = 0; i2 < n; i2++) {
                            if(i2 == p) A2[0].x[p].x[p] = A1[0].x[p].x[p] * cs * cs + A1[0].x[q].x[q] * sn * sn - 2.0 * A1[0].x[p].x[q] * sn * cs;
                            else if(i2 == q) A2[0].x[p].x[q] = 0.0;
                            else A2[0].x[p].x[i2] = A1[0].x[p].x[i2] * cs - A1[0].x[q].x[i2] * sn;
                        }
                    }
                    else if(i1 == q) {
                        for(i2 = 0; i2 < n; i2++) {
                            if(i2 == q) A2[0].x[q].x[q] = A1[0].x[p].x[p] * sn * sn + A1[0].x[q].x[q] * cs * cs + 2.0 * A1[0].x[p].x[q] * sn * cs;
                            else if(i2 == p) A2[0].x[q].x[p] = 0.0;
                            else A2[0].x[q].x[i2] = A1[0].x[q].x[i2] * cs + A1[0].x[p].x[i2] * sn;
                        }
                    }
                    else {
                        for(i2 = 0; i2 < n; i2++) {
                            if(i2 == p) A2[0].x[i1].x[p] = A1[0].x[i1].x[p] * cs - A1[0].x[i1].x[q] * sn;
                            else if(i2 == q) A2[0].x[i1].x[q] = A1[0].x[i1].x[q] * cs + A1[0].x[i1].x[p] * sn;
                            else A2[0].x[i1].x[i2] = A1[0].x[i1].x[i2];
                        }
                    }
                }
                //calc Xk//Xkの計算
                for(i1 = 0; i1 < n; i1++) {
                    for(i2 = 0; i2 < n; i2++) {
                        if(i2 == p) X2[0].x[i1].x[p] = X1[0].x[i1].x[p] * cs - X1[0].x[i1].x[q] * sn;
                        else if(i2 == q) X2[0].x[i1].x[q] = X1[0].x[i1].x[q] * cs + X1[0].x[i1].x[p] * sn;
                        else X2[0].x[i1].x[i2] = X1[0].x[i1].x[i2];
                    }
                }
                //next step//次のステップへ
                k = k + 1;
                for(i1 = 0; i1 < n; i1++) {
                    for(i2 = 0; i2 < n; i2++) {
                        A1[0].x[i1].x[i2] = A2[0].x[i1].x[i2];
                        X1[0].x[i1].x[i2] = X2[0].x[i1].x[i2];
                    }
                }
            }
        }
        return ind;
    };

    //real symmetric matrix eigenvalue,eigenvector(jacobi method）
    //n : demention                                             
    //ct : max repeat time                                
    //eps : convergence test conditions                                  
    //A : target matrix                                   
    //det : eigenvalue   
    //eigen :eigenvector 
    //return : =0 : good                                   
    //=1 : not convergence                               
    //実対称行列の固有値・固有ベクトル（ヤコビ法）
    //ct : 最大繰り返し回数                                
    //eps : 収束判定条件                                   
    //A : 対象とする行列                                   
    //det : 固有値   
    //eigen :固有ベクトル 
    //return : =0 : 正常                                   
    //=1 : 収束せず                               
    // A,det,eigen is Array
    EigenVec(ct, eps, A, det, eigen) {
        if(A[0].x.length != A[0].x[0].x.length) return 1;
        if(A[0].x.length != det[0].x.length) return 1;
        if(A[0].x.length != eigen[0].x.length || eigen[0].x.length != eigen[0].x[0].x.length) return 1;
        var A1 = [new N6LMatrix(A[0].x.length)];
        var A2 = [new N6LMatrix(A[0].x.length)];
        var X1 = [new N6LMatrix(A[0].x.length)];
        var X2 = [new N6LMatrix(A[0].x.length)];
        var n = A[0].x.length;
        var i1;
        var i2;
        var ret = this.Jacobi(n, ct, eps, A, A1, A2, X1, X2);
        if(ret == 0) {
            for(i1 = 0; i1 < n; i1++) det[0].x[i1] = A1[0].x[i1].x[i1];
            for(i1 = 0; i1 < n; i1++)
                for(i2 = 0; i2 < n; i2++)
                    eigen[0].x[i1].x[i2] = X1[0].x[i1].x[i2];
        }
        return ret;
    };

    //diagonal matrix//対角化行列
    DiagonalMat(ct, eps) {
        if(!ct) { ct = 1000; eps =0.0000000001;}
        var det = [new N6LVector(this.x.length)];
        var eigen = [new N6LMatrix(this.x.length).SetHomo(this.bHomo)];
        var A = [new N6LMatrix(this)];
        if(this.EigenVec(ct, eps, A, det, eigen) != 0) return "Error";
        var ret = new N6LMatrix(this.x.length).SetHomo(this.bHomo);
        var n = this.x.length;
        var i1;
        var i2;
        for(i1 = 0; i1 < n; i1++)
            for(i2 = 0; i2 < n; i2++)
                ret.x[i1].x[i2] = eigen[0].x[i1].x[i2];
        return ret;
    };

    //diagonal//対角化
    Diagonal(ct, eps) {
        if(!ct) { ct = 1000; eps =0.0000000001;}
        var det = [new N6LVector(this.x.length)];
        var eigen = [new N6LMatrix(this.x.length).SetHomo(this.bHomo)];
        var A = [new N6LMatrix(this)];
        if(this.EigenVec(ct, eps, A, det, eigen) != 0) return "Error";
        var ret = new N6LMatrix(this.x.length).SetHomo(this.bHomo);
        var n = this.x.length;
        var i1;
        for(i1 = 0; i1 < n; i1++) ret.x[i1].x[i1] = det[0].x[i1];
        return ret;
    };

    //rotate 2D//回転 2D
    Rot2D(theta) {
        if((!this.bHomo && this.x.length == 2) || (this.bHomo && this.x.length == 3)) {
            var mwk = new N6LMatrix(this);
            var c = Math.cos(theta);
            var s = Math.sin(theta);
            var d = new N6LMatrix([[c, -s], [s, c]]).NormalMat();
            if(this.bHomo) d = d.ToHomo();
            mwk = mwk.Mul(d);
            return mwk.Repair(); 
        }
        return "Error";
    };

    //rotate axis//軸に対する回転
    RotAxis(axis, theta) {
        if(!axis || axis.typename != "N6LVector") return "Error";
        var ret = new N6LMatrix();
        if(!((this.x.length == 3 && this.x[0].x.length == 3 && this.x.length == axis.x.length) ||
             (this.x.length == 4 && this.x[0].x.length == 4 && this.x.length == axis.x.length))) 
            return "Error";

        var vwk = new N6LVector(3);
        var mwk = new N6LMatrix(this);
        if(!this.bHomo) vwk = new N6LVector(axis);
        else vwk = axis.ToNormal();
        vwk = vwk.NormalVec();
        var c = Math.cos(theta);
        var s = Math.sin(theta);
        var d = new N6LMatrix([
            [c+vwk.x[0]*vwk.x[0]*(1.0-c),              vwk.x[0]*vwk.x[1]*(1.0-c)-vwk.x[2]*s,    vwk.x[0]*vwk.x[2]*(1.0-c)+vwk.x[1]*s],
            [vwk.x[1]*vwk.x[0]*(1.0-c)+vwk.x[2]* s,    c+vwk.x[1]*vwk.x[1]*(1.0-c),             vwk.x[1]*vwk.x[2]*(1.0-c)-vwk.x[0]*s],
            [vwk.x[2]*vwk.x[0]*(1.0-c)-vwk.x[1]*s,     vwk.x[2]*vwk.x[1]*(1.0-c)+vwk.x[0]*s,    c+vwk.x[2]*vwk.x[2]*(1.0-c)         ]]);
        
        d = d.NormalMat();
        if(!this.bHomo) return this.Mul(d);
        var ret = d.ToHomo();
        return this.Mul(ret).Repair();
    };

    //rotate axis calc quaternion//軸に対する回転
    RotAxisQuat(axis, theta) {
        if(!axis || axis.typename != "N6LVector") return "Error";
        var ret = new N6LMatrix();
        if(!((this.x.length == 3 && this.x[0].x.length == 3 && this.x.length == axis.x.length) ||
             (this.x.length == 4 && this.x[0].x.length == 4 && this.x.length == axis.x.length))) 
            return "Error";
        var qwk = new N6LQuaternion(1, 0, 0, 0);
        ret = qwk.RotAxisQuat(axis.NormalVec(), theta).Matrix();
        if(!this.bHomo) ret.ToNormal();
        return this.Mul(ret).Repair();
    };

    //rotate axis calc quaternion & rotvec//軸に対する回転
    RotAxisVec(rotvec) {
        if(!rotvec || rotvec.typename != "N6LVector") return "Error";
        var ret = new N6LMatrix();
        if(!((this.x.length == 3 && this.x[0].x.length == 3 && rotvec.x.length == 4) ||
             (this.x.length == 4 && this.x[0].x.length == 4 && rotvec.x.length == 4))) 
            return "Error";
        var qwk = new N6LQuaternion(1, 0, 0, 0);
        ret = qwk.RotAxisVec(rotvec).Matrix();
        if(!this.bHomo) ret.ToNormal();
        return this.Mul(ret).Repair();
    };

    //homogeneous//同次座標
    Homogeneous() {
        if(!this.bHomo) return this;
        var IntWK1 = 0;
        var IntWK2 = 0;
        var MatWK = new N6LMatrix(this.x.length).UnitMat();
        if(this.x[0].x[0] == 0.0) return MatWK;
        for(IntWK1 = 0; IntWK1 < this.x.length; IntWK1++)
            for(IntWK2 = 0; IntWK2 < this.x[0].x.length; IntWK2++)
                MatWK.x[IntWK1].x[IntWK2] = this.x[IntWK1].x[IntWK2] / this.x[0].x[0];
        return MatWK;
    };

    //to homogeneous//同次座標に変換
    ToHomo() {
        if(this.bHomo) return this;
        var ret = new N6LMatrix(this.x.length + 1).SetHomo(true);
        var i = 0;
        ret.x[i] = ret.x[i].UnitVec(0).SetHomo(false);
        for(i = 0; i < this.x.length; i++) {
          ret.x[i + 1] = this.x[i].ToHomo().SetHomo(false);
          ret.x[i + 1].x[0] = 0.0;
        }
        return ret;
    };

    //to normal//通常座標に変換
    ToNormal() {
        if(!this.bHomo) return this;
        var ret = new N6LMatrix(this.x.length - 1).SetHomo(false);
        var i;
        var ww = this.x[0].x[0];
        if(this.x[0].x[0] == 0.0) ww = 1.0;
        for(i = 1; i < this.x.length; i++) {
            var t = new N6LVector(this.x[i]).SetHomo(true);  
            ret.x[i - 1] = t.Div(ww).ToNormal(true);
        }
        return ret;
    };

    //get position//座標取得
    Pos() {
        if(this.x.length != 4) return "Error";
        var ret = new N6LVector(4, true).ZeroVec();
        return this.Mul(ret);
    };

    //get scale//倍率取得
    Scale() {
        if(this.x.length != 4) return "Error";
        var ret = new N6LVector([1, 0, 0, 0], true);
        var axis;
        var i;
        for(i = 1; i < this.x.length; i++) {
            axis = new N6LVector(this.x[i]).SetHomo(true);
            axis.x[0] = 0.0;
            ret.x[i] = axis.Abs();
        } 
        return ret;
    };

    //trace//行列のトレース
    Trace() {
        var ret = 0.0;
        var i;
        var j = 0;
        if(this.bHomo) j = 1;
        for(i = j; i < this.x.length; i++) ret += this.x[i].x[i];
        return ret;
    };

    QSIGN(x) {
        if(0.0 <= x) return 1.0;
        return -1.0;
    };

    QT(b) {
        var m = new N6LMatrix(this);
        if(m.bHomo) m = m.Homogeneous();
        var ret = new N6LQuaternion(
            ( m.x[1].x[1] + m.x[2].x[2] + m.x[3].x[3] + 1.0) / 4.0,
            ( m.x[1].x[1] - m.x[2].x[2] - m.x[3].x[3] + 1.0) / 4.0,
            (-m.x[1].x[1] + m.x[2].x[2] - m.x[3].x[3] + 1.0) / 4.0,
            (-m.x[1].x[1] - m.x[2].x[2] + m.x[3].x[3] + 1.0) / 4.0);
        if(ret.q.x[0] < 0.0) ret.q.x[0] = 0.0;
        if(ret.q.x[1] < 0.0) ret.q.x[1] = 0.0;
        if(ret.q.x[2] < 0.0) ret.q.x[2] = 0.0;
        if(ret.q.x[3] < 0.0) ret.q.x[3] = 0.0;
        ret.q.x[0] = Math.sqrt(ret.q.x[0]);
        ret.q.x[1] = Math.sqrt(ret.q.x[1]);
        ret.q.x[2] = Math.sqrt(ret.q.x[2]);
        ret.q.x[3] = Math.sqrt(ret.q.x[3]);
        var r = ret.q.x[0];
        if(r < ret.q.x[1]) r = ret.q.x[1];
        if(r < ret.q.x[2]) r = ret.q.x[2];
        if(r < ret.q.x[3]) r = ret.q.x[3];
        if(b) b[0] = false;
        if(r == ret.q.x[0]) {
            if(b) b[0] = true;
            ret.q.x[0] *= 1.0;
            ret.q.x[1] *= this.QSIGN(m.x[3].x[2] - m.x[2].x[3]);
            ret.q.x[2] *= this.QSIGN(m.x[1].x[3] - m.x[3].x[1]);
            ret.q.x[3] *= this.QSIGN(m.x[2].x[1] - m.x[1].x[2]);
        }
        else if(r == ret.q.x[1]) { 
            ret.q.x[0] *= this.QSIGN(m.x[3].x[2] - m.x[2].x[3]);
            ret.q.x[1] *= 1.0;
            ret.q.x[2] *= this.QSIGN(m.x[2].x[1] + m.x[1].x[2]);
            ret.q.x[3] *= this.QSIGN(m.x[1].x[3] + m.x[3].x[1]);
        }
        else if(r == ret.q.x[2]) { 
            ret.q.x[0] *= this.QSIGN(m.x[1].x[3] - m.x[3].x[1]);
            ret.q.x[1] *= this.QSIGN(m.x[2].x[1] + m.x[1].x[2]);
            ret.q.x[2] *= 1.0;
            ret.q.x[3] *= this.QSIGN(m.x[3].x[2] + m.x[2].x[3]);
        }
        else { 
            ret.q.x[0] *= this.QSIGN(m.x[2].x[1] - m.x[1].x[2]);
            ret.q.x[1] *= this.QSIGN(m.x[1].x[3] + m.x[3].x[1]);
            ret.q.x[2] *= this.QSIGN(m.x[3].x[2] + m.x[2].x[3]);
            ret.q.x[3] *= 1.0;
        }
        return ret;
    };

    //get quaternion//四元数取得
    Quaternion() {
        if(this.x.length != 3 && this.x.length != 4) return "Error";
        var wk = new N6LMatrix(this).NormalMat();
        if(!this.bHomo) wk = wk.ToHomo();
        var ret = wk.QT();
        if(ret.EpsEqual(ret.ZeroQuat())) ret = ret.UnitQuat();
        return ret.NormalQuat().Repair();
    };

    //get rotate vector//回転ベクトル取得
    Vector() {
        var eps = 1e-6;
        if(this.x.length != 3 && this.x.length != 4) return "Error";
        var wk = new N6LMatrix(this);
        if(!this.bHomo) wk = wk.ToHomo();
        var m = new N6LMatrix(wk).NormalMat();
        var vwk;
        var tr = m.Trace();
        if(tr < -1) {
            m = m.Div(-tr);
            tr = -1;
        }
        var th = Math.acos((tr - 1.0) / 2.0);
        if(th % (Math.PI * 2.0)) th = th % (Math.PI * 2.0);
        else if(!(th % (Math.PI * 2.0))) th = 0.0;
        else if(0.0 <= (th % Math.PI)) th = Math.PI;
        else th = -Math.PI;

        vwk = new N6LVector([
            m.x[3].x[2] - m.x[2].x[3],
            m.x[1].x[3] - m.x[3].x[1],
            m.x[2].x[1] - m.x[1].x[2]]).NormalVec().Repair();

        var ret = new N6LVector([
            th,
            vwk.x[0],
            vwk.x[1],
            vwk.x[2]], true).Repair();

        if(tr < 0 || Math.abs(ret.x[0]) < eps || (Math.PI - eps < Math.abs(ret.x[0]) && Math.abs(ret.x[0]) < Math.PI + eps) || isNaN(ret.x[0]) || ret.EpsEqual(new N6LVector(4, true).ZeroVec(), undefined, true)) 
        {
            var axis = [];
            var theta = [];
            m.Quaternion().Axis(axis, theta);
            ret = new N6LVector([theta[0], axis[0].x[1], axis[0].x[2], axis[0].x[3]], true).Repair();
            return ret;
        }
        return ret;
    };

    //get position vector//姿勢ベクトル取得
    PosVector() {
        var t = this.Pos();
        var q = this.Quaternion();
        var ret = new N6LVector([t.x[0], t.x[1], t.x[2], t.x[3], q.q.x[0], q.q.x[1], q.q.x[2], q.q.x[3]], true).Repair(); 
        return ret;
    };

    //frustum matrix//透視射影
    FrustumMat(left, right, top, bottom, near, far) {
        var MatWk = new N6LMatrix([
            [0,                             0,                          0,                          -1                       ], 
            [0,                             (2.0*near)/(right-left),    0,                          (right+left)/(right-left)],
            [0,                             0,                          (2.0*near)/(top-bottom),    (top+bottom)/(top-bottom)],
            [-(2.0*near*far)/(far-near),    0,                          0,                          -(far+near)/(far-near)   ]]);
        return this.Mul(MatWk).Repair();
   };

    //ortho matrix//正射影
    OrthoMat(left, right, top, bottom, near, far) {
        var MatWk = new N6LMatrix([
            [1,                            0,                   0,                   0              ],
            [(right+left)/(right-left),    2.0/(right-left),    0,                   0              ],
            [(top+bottom)/(top-bottom),    0,                   2.0/(top-bottom),    0              ],
            [(far+near)/(far-near),        0,                   0,                   -2.0/(far-near)]]);
        return this.Mul(MatWk).Repair();
   };

   //Householder//ハウスホルダー法
   Householder(){
        var eps = 1.0e-8;
        var a = new N6LMatrix(this);
        var n = this.x.length;
        var i;
        var j;
        var k;
        var sum;
        var sigma;
        var v_norm;
        var ud;
        var uds;
        var u = new N6LVector(n);
        var d = new N6LVector(n);
        var ds = new N6LVector(n);

        for(k = 0; k <= n - 3; k++) {
            for(i = 0; i <= k; i++) u.x[i] = 0.0;
            for(i = k + 1; i < n; i++) u.x[i] = a.x[i].x[k];

            //  変換行列 H の構築
            sum = 0.0;
            for(i = k + 1; i < n; i++) sum = sum + u.x[i] * u.x[i];
            if(Math.abs(u.x[k + 1]) < eps ) continue;
            if(u.x[k + 1]) sigma = Math.sqrt(sum) * u.x[k + 1] / Math.abs(u.x[k + 1]);
            else sigma = 0.0;
            u.x[k + 1] += sigma;
            v_norm = Math.sqrt(2.0 * sigma * u.x[k + 1]);
            if(!v_norm) v_norm = 1.0;
            for(i = k + 1; i < n; i++) u.x[i] /= v_norm;

            //  相似変換
            for(i = 0; i < n; i++){
                d.x[i] = 0.0; ds.x[i] = 0.0;
                for(j = k + 1; j <= n - 1; j++){
                    d.x[i] += a.x[i].x[j] * u.x[j];
                    ds.x[i] += a.x[j].x[i] * u.x[j];
                }
            }
            ud = 0.0;  uds = 0.0;
            for(i = k + 1; i < n; i++){
                ud  += u.x[i] * d.x[i];
                uds += u.x[i] * ds.x[i];
            }
            for(i = 0; i < n; i++){
                d.x[i] = 2.0 * (d.x[i] - ud * u.x[i]);
                ds.x[i] = 2.0 * (ds.x[i] - uds * u.x[i]);
            }
            for(i = 0; i < n; i++){
                for(j = 0; j < n; j++)  a.x[i].x[j] -= u.x[i] * ds.x[j] + d.x[i] * u.x[j];
            }
        }
        return a;
    };

    //QRMethod//eigenvalues diagonal section//QR法//対角項が固有値
    QRMethod() {
        var eps = 1.0e-8;
        var a = new N6LMatrix(this);
        var n = this.x.length;
        var i;
        var j;
        var k;
        var m;
        var a00;
        var a01;
        var a10;
        var a11;
        var lam1;
        var lam2;
        var sum1;
        var sum2;
        var wa;
        var mu;
        var sinx;
        var cosx;
        var q = new N6LMatrix(n);
        var w = new N6LVector(n);

        m = n;
        //   収束判定
        while( m != 1 ){
            if(Math.abs(a.x[m - 1].x[m - 2]) < eps){ m = m - 1; continue; }

            //   原点移動  mu
            a00 = a.x[m - 2].x[m - 2];   a01 = a.x[m - 2].x[m - 1];
            a10 = a.x[m - 1].x[m - 2];   a11 = a.x[m - 1].x[m - 1];
            sum1 = a00 + a11;            sum2 = a00 * a11 - a01 * a10;
            wa = sum1 * sum1 - 4.0 * sum2;
            if(wa < 0.0) wa = 0.0; else wa = Math.sqrt(wa);
            lam1 = 0.5 * (sum1 + wa); lam2 = sum2 / lam1;
            if(Math.abs(a11 - lam1) < Math.abs(a11 - lam2))  mu = a11 - lam1;
            else  mu = a11 - lam2;
            for(i = 0; i < m; i++)  a.x[i].x[i] -= mu;

            //   QR分解
            q = q.UnitMat();
            for(i = 0; i < m - 1; i++){
                sum1 = Math.sqrt(a.x[i].x[i] * a.x[i].x[i] + a.x[i + 1].x[i] * a.x[i + 1].x[i]);
                if(Math.abs(sum1) < eps){
                    sinx = 0.0;  cosx = 0.0;
                }else{
                    sinx = a.x[i + 1].x[i] / sum1;  cosx = a.x[i].x[i] / sum1;
                }
                for(j = i + 1; j < m; j++){
                    sum2 = a.x[i].x[j] * cosx + a.x[i + 1].x[j] * sinx;
                    a.x[i + 1].x[j] = -a.x[i].x[j] * sinx + a.x[i + 1].x[j] * cosx;
                    a.x[i].x[j] = sum2;
                }
                a.x[i+1].x[i] = 0.0;
                a.x[i].x[i] = sum1;
                for(j = 0; j < m; j++){
                    sum2 = q.x[j].x[i] * cosx + q.x[j].x[i + 1] * sinx;
                    q.x[j].x[i + 1] = -q.x[j].x[i] * sinx + q.x[j].x[i + 1] * cosx;
                    q.x[j].x[i] = sum2;
                }
            }
            for(i = 0; i < m; i++){
                for(j = i; j < m; j++) w.x[j] = a.x[i].x[j];
                for(j = 0; j < m; j++){
                    sum1 = 0.0;
                    for(k = i; k < m; k++) sum1 += w.x[k] * q.x[k].x[j];
                    a.x[i].x[j] = sum1;
                }
            }
            for(i = 0; i < m; i++) a.x[i].x[i] += mu;
        }
        return a;
    };

    //get euler angle//オイラー角取得
    EulerAngle(first, second, third, eps, recalc) {
        if(!eps) eps = 1.0e-7;
        if(this.x.length != 3 && this.x.length != 4) return "Error";
        var mat = new N6LMatrix(this).NormalMat().TransposedMat().DivMax();
        if(!this.bHomo) mat = mat.ToHomo();
        var f = Math.floor(first);
        var s = Math.floor(second);
        var t = Math.floor(third);
        var ret = new N6LVector(4, true).UnitVec(0);
        if(0 < f && f < 4 && 0 < s && s < 4 && 0 < t && t < 4 && f != s && f != t) {
            switch(f) {
            case 1:
                    if(s == 2) { //rotateXYZ
                        ret.x[2] = Math.asin(-mat.x[1].x[3]);
                        var c = Math.cos(ret.x[2]);
                        if(Math.abs(c) < eps) {
                            ret.x[1] = 0.0;
                            ret.x[3] = Math.atan2(-mat.x[2].x[1], mat.x[2].x[2]);
                        }
                        else {
                            if(1.0 < Math.abs(mat.x[2].x[3] / c)) c = this.QSIGN(c) * Math.abs(mat.x[2].x[3]);
                            ret.x[1] = Math.asin(mat.x[2].x[3] / c);
                            if(mat.x[3].x[3] < 0.0) ret.x[1] = Math.PI - ret.x[1];
                            ret.x[3] = Math.atan2(mat.x[1].x[2], mat.x[1].x[1]);
                        } 
                    }
                    else { //rotateXZY
                        ret.x[3] = Math.asin(mat.x[1].x[2]);
                        var c = Math.cos(ret.x[3]);
                        if(Math.abs(c) < eps) {
                            ret.x[1] = 0.0;
                            ret.x[2] = Math.atan2(mat.x[3].x[1], mat.x[3].x[3]);
                        }
                        else {
                            if(1.0 < Math.abs(mat.x[3].x[2] / c)) c = this.QSIGN(c) * Math.abs(mat.x[3].x[2]);
                            ret.x[1] = Math.asin(-mat.x[3].x[2] / c);
                            if(mat.x[2].x[2] < 0.0) ret.x[1] = Math.PI - ret.x[1];
                            ret.x[2] = Math.atan2(-mat.x[1].x[3], mat.x[1].x[1]);
                        } 
                    } 
                    break;
            case 2:
                    if(s == 3) { //rotateYZX
                        ret.x[3] = Math.asin(-mat.x[2].x[1]);
                        var c = Math.cos(ret.x[3]);
                        if(Math.abs(c) < eps) {
                            ret.x[2] = 0.0;
                            ret.x[1] = Math.atan2(-mat.x[3].x[2], mat.x[3].x[3]);
                        }
                        else {
                            if(1.0 < Math.abs(mat.x[3].x[1] / c)) c = this.QSIGN(c) * Math.abs(mat.x[3].x[1]);
                            ret.x[2] = Math.asin(mat.x[3].x[1] / c);
                            if(mat.x[1].x[1] < 0.0) ret.x[2] = Math.PI - ret.x[2];
                            ret.x[1] = Math.atan2(mat.x[2].x[3], mat.x[2].x[2]);
                        } 
                    }
                    else { //rotateYXZ
                        ret.x[1] = Math.asin(mat.x[2].x[3]);
                        var c = Math.cos(ret.x[1]);
                        if(Math.abs(c) < eps) {
                            ret.x[2] = 0.0;
                            ret.x[3] = Math.atan2(mat.x[1].x[2], mat.x[1].x[1]);
                        }
                        else {
                            if(1.0 < Math.abs(mat.x[1].x[3] / c)) c = this.QSIGN(c) * Math.abs(mat.x[1].x[3]);
                            ret.x[2] = Math.asin(-mat.x[1].x[3] / c);
                            if(mat.x[3].x[3] < 0.0) ret.x[2] = Math.PI - ret.x[2];
                            ret.x[3] = Math.atan2(-mat.x[2].x[1], mat.x[2].x[2]);
                        } 
                    } 
                    break;
            case 3:
                    if(s == 1) { //rotateZXY
                        ret.x[1] = Math.asin(-mat.x[3].x[2]);
                        var c = Math.cos(ret.x[1]);
                        if(Math.abs(c) < eps) {
                            ret.x[3] = 0.0;
                            ret.x[2] = Math.atan2(-mat.x[1].x[3], mat.x[1].x[1]);
                        }
                        else {
                            if(1.0 < Math.abs(mat.x[1].x[2] / c)) c = this.QSIGN(c) * Math.abs(mat.x[1].x[2]);
                            ret.x[3] = Math.asin(mat.x[1].x[2] / c);
                            if(mat.x[2].x[2] < 0.0) ret.x[3] = Math.PI - ret.x[3];
                            ret.x[2] = Math.atan2(mat.x[3].x[1], mat.x[3].x[3]);
                        } 
                    }
                    else { //rotateZYX
                        ret.x[2] = Math.asin(mat.x[3].x[1]);
                        var c = Math.cos(ret.x[2]);
                        if(Math.abs(c) < eps) {
                            ret.x[3] = 0.0;
                            ret.x[1] = Math.atan2(mat.x[2].x[3], mat.x[2].x[2]);
                        }
                        else {
                            if(1.0 < Math.abs(mat.x[2].x[1] / c)) c = this.QSIGN(c) * Math.abs(mat.x[2].x[1]);
                            ret.x[3] = Math.asin(-mat.x[2].x[1] / c);
                            if(mat.x[1].x[1] < 0.0) ret.x[3] = Math.PI - ret.x[3];
                            ret.x[1] = Math.atan2(-mat.x[3].x[2], mat.x[3].x[3]);
                        } 
                    } 
                    break;
            default:return "Error";
            }
            var i;
            var j;
            var k;
            var m;
            var n;
            var b = true;
            eps = eps * 100;
            for(i = 1; i < 4; i++) {
                ret.x[i] = ret.x[i] % (2.0 * Math.PI);
                if(Math.PI < ret.x[i]) ret.x[i] = -(2.0 * Math.PI - ret.x[i]);
                if(ret.x[i] < -Math.PI) ret.x[i] = (2.0 * Math.PI + ret.x[i]);
                m = Math.abs(ret.x[i]);
                if(isNaN(ret.x[i]) || m < eps) ret.x[i] = 0.0;
                if(i != 3 && Math.PI - eps < m && m < Math.PI + eps) {
                    for(j = i + 1; j < 4; j++) {
                        ret.x[j] = ret.x[j] % (2.0 * Math.PI);
                        if(Math.PI < ret.x[j]) ret.x[j] = -(2.0 * Math.PI - ret.x[j]);
                        if(ret.x[j] < -Math.PI) ret.x[j] = (2.0 * Math.PI + ret.x[j]);
                        n = Math.abs(ret.x[j]);
                        if(isNaN(ret.x[i]) || n < eps) ret.x[j] = 0.0;
                        if(Math.PI - eps < n && n < Math.PI + eps) {
                            for(k = 1; k < 4; k++){
                                if(k != i && k != j){
                                    ret.x[i] = 0.0;
                                    ret.x[j] = 0.0;
                                    ret.x[k] = -ret.x[k];
                                    b = false;
                                    break;
                                }
                            }
                        }
                        if(!b) break;
                    }
                }
                if(!b) break;
            }
            if(!recalc) {
                for(i = 1, j = 0; i < 4; i++) {
                    if(i != second && ret.x[i] == 0.0) j++;
                    else k = i;
                }
                if(j == 2 && second == k) {
                    switch(k) {
                    case 1: i = 2; j = 3; break;
                    case 2: i = 3; j = 1; break;
                    case 3: i = 1; j = 2; break;
                    }
                    return this.EulerAngle(k, i, j, eps / 100, true);
                }
            }
            return ret;
        }
        return "Error";
    };

}

