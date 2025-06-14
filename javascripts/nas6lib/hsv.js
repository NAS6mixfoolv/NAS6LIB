//Programed by NAS6
//hsv.js

//hsv//hsv
//construction ex//構築例
//This//This
//var col = new N6LHsv(hsv);
//RGB//RGB
//var col = new N6LHsv(0, 255, 255, 255, 255);
//HSV//HSV
//var col = new N6LHsv(1, 100, 0, 100, 100);
class N6LHsv {

    constructor(a, b, c, d, e) {
        this.typename = "N6LHsv";
        this.argb = [0.0, 0.0, 0.0, 0.0];
        this.ahsv = [0.0, 0.0, 0.0, 0.0];


        var i;
        if(a && a.typename == "N6LHsv"){
            for(i = 0; i < a.argb.length; i++) this.argb[i] = a.argb[i];
            for(i = 0; i < a.ahsv.length; i++) this.ahsv[i] = a.ahsv[i];
        }
        else if(a == 0) {
            if(3 < b.length) {
                e = b[3];
                d = b[2];
                c = b[1];
                b = b[0];
            }
            if((b < 0.0) || (255.0 < b)) return null;
            this.argb[0] = b;
            if((c < 0.0) || (255.0 < c)) return null;
            this.argb[1] = c;
            if((d < 0.0) || (255.0 < d)) return null;
            this.argb[2] = d;
            if((e < 0.0) || (255.0 < e)) return null;
            this.argb[3] = e;
            this.ahsv = this.ToHsv(this.argb);
        }
        else{
            if(3 < b.length) {
                e = b[3];
                d = b[2];
                c = b[1];
                b = b[0];
            }
            if((b < 0.0) || (100.0 < b)) return null;
            this.ahsv[0] = b;
            if((c < 0.0) || (360.0 < c)) return null;
            this.ahsv[1] = c;
            if((d < 0.0) || (100.0 < d)) return null;
            this.ahsv[2] = d;
            if((e < 0.0) || (100.0 < e)) return null;
            this.ahsv[3] = e;
            this.argb = this.ToRgb(this.ahsv);
        }
    }

    // --- Bit flag constants for comparison result ---
    // --- 比較結果のビットフラグ定数 ---
    static get DIFF_TYPE() { return 0x80000000; } // If the types are different // 型が異なる場合
    DIFF_ARGB(i) { return (0x00000001 << i); } // If the argb[i] are different // argb[i]が異なる場合

    Comp(rh) {
        var ret = 0;
        this.ahsv = this.toHsv(this.argb);
        var i;
        if(rh.typename === "N6LHsv"){
            for(i = 0; i < this.argb.length; i++) if(this.argb[i] !== rh.argb[i]) ret |= this.DIFF_ARGB(i);
        }
        else ret |= N6LHsv.DIFF_TYPE;
        return ret;
    };

    Equal(rh) {
        var ret = this.Comp(rh);
        if(ret === 0) return true;
        return false;
    };

    Stra() {
        var ret = '';
        var i;
        var j;
        ret += '#';
        for(i = 0; i < 4; i++) {
          j = Math.floor(((Math.abs(this.argb[i]) * 10.0) % 2560.0) / 10.0)
          ret += ('00' + j.toString(16)).slice(-2);
        }
        return ret;
    };

    Str() {
        var ret = '';
        var i;
        var j;
        ret += '#';
        for(i = 0; i < 3; i++) {
          j = Math.floor(((Math.abs(this.argb[i + 1]) * 10.0) % 2560.0) / 10.0)
          ret += ('00' + j.toString(16)).slice(-2);
        }
        return ret;
    };

    Parsea(str) {
        var buf = [];
        var i;
        for(i = 0; i < 4; i++) buf[i] = Number('0x' + str.substr(2 * i + 1, 2));
        var ret = new N6LHsv(0, [buf[0], buf[1], buf[2], buf[3]]);
        return ret;
    };

    Parse(str) {
        var buf = [];
        var i;
        buf[0] = Number('0xff');
        for(i = 0; i < 3; i++) buf[i + 1] = Number('0x' + str.substr(2 * i + 1, 2));
        var ret = new N6LHsv(0, [buf[0], buf[1], buf[2], buf[3]]);
        return ret;
    };

    ToHsv(rh) {
	var buf = [];
	var cmax;
        var cmin;
        var a;
        var r;
        var g;
        var b;
	cmax = 0;
        cmin = 0;
	a = rh[0];
	r = rh[1];
	g = rh[2];
	b = rh[3];
	if((r >= g) && (r >= b)) cmax|=0x01;
	else if((r <= g) && (r <= b)) cmin|=0x01;
	if((g >= b) && (g >= r)) cmax|=0x02;
	else if((g <= b) && (g <= r)) cmin|=0x02;
	if((b >= r) && (b >= g)) cmax|=0x04;
	else if((b <= r) && (b <= g)) cmin|=0x04;
	if((cmax&0x01) == 0x01)
		buf[3] = Math.floor(r * 100.0 / 255.0);
	else
	{
		if((cmax&0x02) == 0x02)
			buf[3] = Math.floor(g * 100.0 / 255.0);
		else if((cmax&0x04) == 0x04)
			buf[3] = Math.floor(b * 100.0 / 255.0);
	}
	if(buf[3] == 0.0) {
            r = 0;
            g = 0;
            b = 0;
        }
	else
	{
            r = Math.ceil(r * 100.0 / buf[3]);
            g = Math.ceil(g * 100.0 / buf[3]);
            b = Math.ceil(b * 100.0 / buf[3]);
            if(r > 255.0) r = 255;
            if(g > 255.0) g = 255;
            if(b > 255.0) b = 255;
	}
	if((cmin&0x01) == 0x01)
            buf[2] = Math.floor(100.0 - r * 100.0 / 255.0);
	else
	{
            if((cmin&0x02) == 0x02)
                    buf[2] = Math.floor(100.0 - g * 100.0 / 255.0);
            else if((cmin&0x04)==0x04)
                    buf[2] = Math.floor(100.0 - b * 100.0 / 255.0);
            else buf[2] = 0;
	}
	if(buf[2] == 0) {
            r = Math.floor(255.0 * buf[3] / 100.0);
            g = Math.floor(255.0 * buf[3] / 100.0);
            b = Math.floor(255.0 * buf[3] / 100.0);
        }
        else
        {
            r = Math.floor(255.0 - Math.ceil((255.0 - r) * 100.0 / buf[2]));
            g = Math.floor(255.0 - Math.ceil((255.0 - g) * 100.0 / buf[2]));
            b = Math.floor(255.0 - Math.ceil((255.0 - b) * 100.0 / buf[2]));
            if(r < 0) r = 0;
            if(g < 0) g = 0;
            if(b < 0) b = 0;
	}
	if((r == g) && (r == b)) buf[1] = 0;
	else if(r == 255.0)
	{
            if(g) buf[1] = Math.floor(g * 360.0 / 1530.0);
            else buf[1] = Math.floor(((1530.0 - b) % 1530) * 360.0 / 1530.0);
	}
        else
        {
            if(g == 255.0)
            {
                if(b) buf[1] = Math.floor((510.0 + b) * 360.0 / 1530.0);
                else buf[1] = Math.floor((510.0 - r) * 360.0 / 1530.0);
            }
            else if(b == 255.0)
            {
                if(r) buf[1] = Math.floor((1020.0 + r) * 360.0 / 1530.0);
                else buf[1] = Math.floor((1020.0 - g) * 360.0 / 1530.0);
		}
	}
        buf[0] = Math.ceil((a / 255.0 * 100000.0) / 1000.0);
	buf[1] = Math.ceil((buf[1] * 10.0) / 10.0);
	buf[2] = Math.ceil((buf[2] * 1000.0) / 1000.0);
	buf[3] = Math.ceil((buf[3] * 1000.0) / 1000.0);
	return buf;
    };

    ToRgb(rh) {
        var a;
        var r;
        var g;
        var b;
	switch(Math.floor(((rh[1] / 60.0) * 10.0) / 10.0))
	{
        case 0:
                r = 255;
                g = Math.floor(((rh[1] * 10.0) % 600.0) * 0.425);
                b = 0;
                break;
        case 1:
                r = Math.floor(255.0 - (((rh[1] * 10.0) % 600.0) * 0.425));
                g = 255;
                b = 0;
                break;
        case 2:
                r = 0;
                g = 255;
                b = Math.floor(((rh[1] * 10.0) % 600.0) * 0.425);
                break;
        case 3:
                r = 0;
                g = Math.floor(255.0 - (((rh[1] * 10.0) % 600.0) * 0.425));
                b = 255;
                break;
        case 4:
                r = Math.floor(((rh[1] * 10.0) % 600.0) * 0.425);
                g = 0;
                b = 255;
                break;
        case 5:
                r = 255;
                g = 0;
                b = Math.floor(255.0 - (((rh[1] * 10.0) % 600.0) * 0.425));
                break;
        default:return null;
        }
	r += Math.ceil(((255.0 - r) * (100.0 - rh[2])) / 100.0);
	g += Math.ceil(((255.0 - g) * (100.0 - rh[2])) / 100.0);
	b += Math.ceil(((255.0 - b) * (100.0 - rh[2])) / 100.0);
	r = Math.floor(r * rh[3] / 100.0);
	g = Math.floor(g * rh[3] / 100.0);
	b = Math.floor(b * rh[3] / 100.0);
        a = Math.floor(255.0 * (rh[0] * 1000.0) / 100000.0);
        var buf = [a, r, g, b];
        return buf;
    };

    Add(rh, bh) {
        if(rh && rh.typename == "N6LHsv"){
            var rtn = new N6LHsv();
            rtn.ahsv[0] = Math.floor((((this.ahsv[0] + rh.ahsv[0]) * 1000.0) % 100001.0) / 1000.0);
            rtn.ahsv[1] = Math.floor((((this.ahsv[1] + rh.ahsv[1]) * 10.0) % 3600.0) / 10.0);
            rtn.ahsv[2] = Math.floor((((this.ahsv[2] + rh.ahsv[2]) * 1000.0) % 100001.0) / 1000.0);
            rtn.ahsv[3] = Math.floor((((this.ahsv[3] + rh.ahsv[3]) * 1000.0) % 100001.0) / 1000.0);
            rtn.argb = this.ToRgb(rtn.ahsv);
            return rtn;
        }
        else if(rh == 0) {
            var rtn = new N6LHsv();
            rtn.argb[0] = this.argb[0] + bh[0];
            if(255.0 < rtn.argb[0]) rtn.argb[0] = 255;
            rtn.argb[1] = this.argb[1] + bh[1];
            if(255.0 < rtn.argb[1]) rtn.argb[1] = 255;
            rtn.argb[2] = this.argb[2] + bh[2];
            if(255.0 < rtn.argb[2]) rtn.argb[2] = 255;
            rtn.argb[3] = this.argb[3] + bh[3];
            if(255.0 < rtn.argb[3]) rtn.argb[3] = 255;
            rtn.ahsv = this.ToHsv(rtn.argb);
        }
        else {
            var rtn = new N6LHsv();
            rtn.ahsv[0] = Math.floor((((this.ahsv[0] + bh[0]) * 1000.0) % 100001.0) / 1000.0);
            rtn.ahsv[1] = Math.floor((((this.ahsv[1] + bh[1]) * 10.0) % 3600.0) / 10.0);
            rtn.ahsv[2] = Math.floor((((this.ahsv[2] + bh[2]) * 1000.0) % 100001.0) / 1000.0);
            rtn.ahsv[3] = Math.floor((((this.ahsv[3] + bh[3]) * 1000.0) % 100001.0) / 1000.0);
            rtn.argb = this.ToRgb(rtn.ahsv);
            return rtn;
        }
    };

    Sub(rh, bh) {
        if(rh && rh.typename == "N6LHsv"){
            var rtn = new N6LHsv();
            rtn.ahsv[0] = Math.floor((((this.ahsv[0] - rh.ahsv[0]) * 1000.0) % 100001.0) / 1000.0);
            if(rtn.ahsv[0] < 0.0) rtn.ahsv[0] = 0;
            rtn.ahsv[1] = Math.floor((((this.ahsv[1] - rh.ahsv[1]) * 10.0) % 3600.0) / 10.0);
            if(rtn.ahsv < 0.0) rtn.ahsv += 360;
            if(rtn.ahsv[1] < 0.0) rtn.ahsv[1] = 0;
            rtn.ahsv[2] = Math.floor((((this.ahsv[2] - rh.ahsv[2]) * 1000.0) % 100001.0) / 1000.0);
            if(rtn.ahsv[2] < 0.0) rtn.ahsv[2] = 0;
            rtn.ahsv[3] = Math.floor((((this.ahsv[3] - rh.ahsv[3]) * 1000.0) % 100001.0) / 1000.0);
            if(rtn.ahsv[3] < 0.0) rtn.ahsv[3] = 0;
            rtn.argb = this.ToRgb(rtn.ahsv);
            return rtn;
        }
        else if(rh == 0) {
            var rtn = new N6LHsv();
            rtn.argb[0] = this.argb[0] - bh[0];
            if(rtn.argb[0] < 0.0) rtn.argb[0] = 0;
            rtn.argb[1] = this.argb[1] - bh[1];
            if(rtn.argb[1] < 0.0) rtn.argb[1] = 0;
            rtn.argb[2] = this.argb[2] - bh[2];
            if(rtn.argb[2] < 0.0) rtn.argb[2] = 0;
            rtn.argb[3] = this.argb[3] - bh[3];
            if(rtn.argb[3] < 0.0) rtn.argb[3] = 0;
            rtn.ahsv = this.ToHsv(rtn.argb);
        }
        else {
            var rtn = new N6LHsv();
            rtn.ahsv[0] = Math.floor((((this.ahsv[0] - bh[0]) * 1000.0) % 100001.0) / 1000.0);
            if(rtn.ahsv[0] < 0.0) rtn.ahsv[0] = 0;
            rtn.ahsv[1] = Math.floor((((this.ahsv[1] - bh[1]) * 10.0) % 3600.0) / 10.0);
            if(rtn.ahsv < 0.0) rtn.ahsv += 360;
            if(rtn.ahsv[1] < 0.0) rtn.ahsv[1] = 0;
            rtn.ahsv[2] = Math.floor((((this.ahsv[2] - bh[2]) * 1000.0) % 100001.0) / 1000.0);
            if(rtn.ahsv[2] < 0.0) rtn.ahsv[2] = 0;
            rtn.ahsv[3] = Math.floor((((this.ahsv[3] - bh[3]) * 1000.0) % 100001.0) / 1000.0);
            if(rtn.ahsv[3] < 0.0) rtn.ahsv[3] = 0;
            rtn.argb = this.ToRgb(rtn.ahsv);
            return rtn;
        }
    };

    RgbGrd(div, cnt, rgb) {
        if(div > 1) {
            var a1;
            var r1;
            var g1;
            var b1;
            var a2;
            var r2;
            var g2;
            var b2;
            var ret = new N6LHsv();
            a1 = this.argb[0];
            r1 = this.argb[1];
            g1 = this.argb[2];
            b1 = this.argb[3];
            a2 = rgb[0];
            r2 = rgb[1];
            g2 = rgb[2];
            b2 = rgb[3];
            cnt %= div;
            div--;
            if(a1 >= a2) ret.argb[0] = Math.floor((a1 - cnt * (a1 - a2) / div) % 256);
            else ret.argb[0] = Math.floor((a1 + cnt * (a2 - a1) / div) % 256);
            if(r1 >= r2) ret.argb[1] = Math.floor((r1 - cnt * (r1 - r2) / div) % 256);
            else ret.argb[1] = Math.floor((r1 + cnt * (r2 - r1) / div) % 256);
            if(g1 >= g2) ret.argb[2] = Math.floor((g1 - cnt * (g1 - g2) / div) % 256);
            else ret.argb[2] = Math.floor((g1 + cnt * (g2 - g1) / div) % 256);
            if(b1 >= b2) ret.argb[3] = Math.floor((b1 - cnt * (b1 - b2) / div) % 256);
            else ret.argb[3] = Math.floor((b1 + cnt * (b2 - b1) / div) % 256);
            ret.ahsv = ret.ToHsv(ret.argb);
            return ret;
        }
        return null;
    };

    HsvGrd(div, cnt, hsv, sw) {
	if(div > 1) {
            var a;
            var h;
            var s;
            var v;
            this.ahsv[0] = Math.floor(((this.ahsv[0] * 1000.0 )% 100001.0) / 1000.0);
            this.ahsv[1] = Math.floor(((this.ahsv[1] * 10.0) % 3600.0) / 10.0);
            this.ahsv[2] = Math.floor(((this.ahsv[2] * 1000.0 )% 100001.0) / 1000.0);
            this.ahsv[3] = Math.floor(((this.ahsv[3] * 1000.0 )% 100001.0) / 1000.0);
            hsv[0] = Math.floor(((hsv[0] * 1000.0 ) % 100001.0) / 1000.0);
            hsv[1] = Math.floor(((hsv[1] * 10.0) % 3600.0) / 10.0);
            hsv[2] = Math.floor(((hsv[2] * 1000.0 ) % 100001.0) / 1000.0);
            hsv[3] = Math.floor(((hsv[3] * 1000.0 ) % 100001.0) / 1000.0);
            cnt %= div;
            div--;
            if(this.ahsv[1] >= hsv[1]) {
                if((((this.ahsv[1]-hsv[1]) <= 180.0) && !sw)
                    ||(((this.ahsv[1]-hsv[1]) > 180.0) && sw))
                        h = Math.floor(this.ahsv[1] - cnt * ((((this.ahsv[1] - hsv[1]) * 10.0) % 3600.0) / 10.0) / div);
                else {	
                    if((this.ahsv[1] == hsv[1]) && (sw > 0))
                        h = Math.floor(this.ahsv[1] + cnt * 360.0 / div);
                    else {
                        if((this.ahsv[1] == hsv[1]) && (sw<0))
                            h = Math.floor(360.0 + this.ahsv[1] - cnt * 360.0 / div);
                        else
                            h = Math.floor(this.ahsv[1] + cnt * ((((hsv[1] + 360.0 - this.ahsv[1]) * 10.0) % 3600.0) / 10.0) / div);
                    }
                }
            }
            else {
              if((((hsv[1] - this.ahsv[1]) <= 180.0) && !sw)
                  ||(((hsv[1] - this.ahsv[1]) > 180.0) && sw))
                      h = Math.floor(this.ahsv[1] + cnt * ((((this.ahsv[1] - hsv[1]) * 10.0) % 3600.0) / 10.0) / div);
              else h = Math.floor(this.ahsv[1] + 360.0 - cnt * ((((this.ahsv[1] + 360.0 - hsv[1]) * 10.0) % 3600.0) / 10.0) / div);
            }
            if(this.ahsv[0] >= hsv[0]) a = Math.floor(this.ahsv[0] - cnt *((((this.ahsv[0] - hsv[0]) * 1000.0) % 100001.0) / 1000.0) / div);
            else a = Math.floor(this.ahsv[0] + cnt * ((((hsv[0] - this.ahsv[0]) * 1000.0) % 100001.0) / 1000.0) / div);
            if(this.ahsv[2] >= hsv[2]) s = Math.floor(this.ahsv[2] - cnt *((((this.ahsv[2] - hsv[2]) * 1000.0) % 100001.0) / 1000.0) / div);
            else s = Math.floor(this.ahsv[2] + cnt * ((((hsv[2] - this.ahsv[2]) * 1000.0) % 100001.0) / 1000.0) / div);
            if(this.ahsv[3] >= hsv[3]) v = Math.floor(this.ahsv[3] - cnt *((((this.ahsv[3] - hsv[3]) * 1000.0) % 100001.0) / 1000.0) / div);
            else v = Math.floor(this.ahsv[3] + cnt * ((((hsv[3] - this.ahsv[3]) * 1000.0) % 100001.0) / 1000.0) / div);
            a = Math.floor(((a * 1000.0) % 100001.0) / 1000.0);
            h = Math.floor(((h * 10.0) % 3600.0) / 10.0);
            s = Math.floor(((s * 1000.0) % 100001.0) / 1000.0);
            v = Math.floor(((v * 1000.0) % 100001.0) / 1000.0);
            var ret = new N6LHsv(1, [a, h, s, v]);
            return ret;
	}
        return null;
    };
}




