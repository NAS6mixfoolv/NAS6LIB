//2015

//add class 2021


function isNumber(n){
  if ( typeof(n) === 'number' && Number.isFinite(n) ) {
    return true;
  }
  return false;
}

function isNumberAllowString(n) {
  const type = typeof(n);
  if ( type === 'number' && Number.isFinite(n) ) {
    return true;
  }
  if ( type === 'string' && n.trim() !== '' && Number.isFinite(n - 0) ) {
    return true;
  }
  return false;
}



class Col {
  constructor(r, g, b, a) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    if((isNumber(r) == true)&&(4 <=r.length)){
      this.r = Number(r[0]);
      this.g = Number(r[1]);
      this.b = Number(r[2]);
      this.a = Number(r[3]);
      return this;
    }
    if(a != undefined){
      this.r = Number(r);
      this.g = Number(g);
      this.b = Number(b);
      this.a = Number(a);
      return this;
    }
    return this;
  }
}

class Vec2 {
  constructor(x, y) {
    this.typename = "Vec2";
    this.x = 0;
    this.y = 0;
    if(x != undefined){
      if(x.typename == "Vec2"){
        this.x = x.x;
        this.y = x.y;
        return this;
      }
      else if((isNumber(x) == true)&&(2 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        return this;
      }
      else if(y != undefined){
        this.x = Number(x);
        this.y = Number(y);
        return this;
      }
    }
    return this;
  }
}

class Vec3 {
  constructor(x, y, z) {
    this.typename = "Vec3";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    if(x != undefined){
      if(x.typename == "Vec3"){
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
        return this;
      }
      else if((isNumber(x) == true)&&(3 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        this.z = Number(x[2]);
        return this;
      }
      else if(z != undefined){
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
        return this;
      }
    }
    return this;
  }
}

class Vec4 {
  constructor(x, y, z, w) {
    this.typename = "Vec4";
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
    if(x != undefined){
      if(x.typename == "Vec4"){
        this.x = x.x;
        this.y = x.y;
        this.z = x.z;
        this.w = x.w;
        return this;
      }
      else if((isNumber(x) == true)&&(4 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        this.z = Number(x[2]);
        this.w = Number(x[3]);
        return this;
      }
      else if(w != undefined){
        this.x = Number(x);
        this.y = Number(y);
        this.z = Number(z);
        this.w = Number(w);
        return this;
      }
    }
    return this;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.typename = "Rectangle";
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    if(x != undefined){
      if(x.typename == "Rectangle"){
        this.x = x.x;
        this.y = x.y;
        this.w = x.w;
        this.h = x.h;
        return this;
      }
      else if((isNumber(x) == true)&&(4 <=x.length)){
        this.x = Number(x[0]);
        this.y = Number(x[1]);
        this.w = Number(x[2]);
        this.h = Number(x[3]);
        return this;
      }
      else if(h != undefined){
        this.x = Number(x);
        this.y = Number(y);
        this.w = Number(w);
        this.h = Number(h);
        return this;
      }
    }
    return this;
  }

  create(x, y){
    var l = x.x;
    var r = y.x;
    var u = x.y;
    var d = y.y;
    if(r < l) { l = y.x; r = x.x; }
    if(d < u) { u = y.y; d = x.y; }
    this.x = l;
    this.y = u;
    this.w = r - l;
    this.h = d - u;

    return this;
  }
}


var isIE= false;
var isOpera= false;
var isSafari= false;
var isChrome= false;
var isFireFox= false;

function ChkBrws(){
  if(window.navigator.userAgent.toLowerCase().indexOf('msie') != -1) isIE = true;
  if(window.navigator.userAgent.toLowerCase().indexOf('trident') != -1) isIE = true;
  if(window.navigator.userAgent.toLowerCase().indexOf('safari') != -1) isSafari = true;
  if(window.navigator.userAgent.toLowerCase().indexOf('chrome') != -1) isChrome = true;
  if(isChrome) isSafari = false; 
  if(window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) isFireFox = true; 
  if(window.navigator.userAgent.toLowerCase().indexOf('opr') != -1) isOpera = true;
  if(isOpera) { isChrome = false; isSafari = false; }
}

function isZoom(){
  ChkBrws();
  var z = -1.0;
  if(isIE) z = (screen.deviceXDPI / 96.0);
  else z = (window.devicePixelRatio);
  return z;
}

function TextContent(element,value){
  var content = element.textContent;
  if (value === undefined) {
    if (content !== undefined) return content;
    else return element.innerText;
  }
  else {
    if (content !== undefined) element.textContent = value;
    else element.innerText = value;
  }
}

function getScrollPos(){
  var obj = new Object();
  var x1 = x2 = x3 = 0;
  var y1 = y2 = y3 = 0;
  if (document.documentElement) {
    x1 = document.documentElement.scrollLeft || 0;
    y1 = document.documentElement.scrollTop || 0;
  }
  if (document.body) {
    x2 = document.body.scrollLeft || 0;
    y2 = document.body.scrollTop || 0;
  }
  x3 = window.scrollX || 0;
  y3 = window.scrollY || 0;
  obj.x = Math.max(x1, Math.max(x2, x3));
  obj.y = Math.max(y1, Math.max(y2, y3));
  return obj;
}

function getScreenSize() {
  ChkBrws();
  var obj = new Object();
  if (!isSafari && !isOpera) {
    obj.x = document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth;
    obj.y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
  } else {
    obj.x = window.innerWidth;
    obj.y = window.innerHeight;
  }
  obj.mx = parseInt((obj.x)/2);
  obj.my = parseInt((obj.y)/2);
  return obj;
}

function getScrollPosition() {
  var obj = new Object();
  obj.x = document.documentElement.scrollLeft || document.body.scrollLeft;
  obj.y = document.documentElement.scrollTop || document.body.scrollTop;
  return obj;
}

function ElmReqFullscreen(elm) {
  var list = [
    "requestFullscreen",
    "webkitRequestFullScreen",
    "mozRequestFullScreen",
    "msRequestFullscreen"
  ];
  var i;
  var num = list.length;
  for(i = 0; i < num; i++) {
    if(elm[list[i]]) {
      elm[list[i]]();
      return true;
    }
  }
  return false;
}

function DocExitFullscreen(doc) {
  var list = [
    "exitFullscreen",
    "webkitExitFullscreen",
    "mozCancelFullScreen",
    "msExitFullscreen"
  ];
  var i;
  var num = list.length;
  for(i = 0; i < num; i++) {
    if(doc[list[i]]) {
      doc[list[i]]();
      return true;
    }
  }
  return false;
}

function Sign(x, eps){
  if(Math.abs(x) <= eps) return 0.0;
  else if(0.0 < x) return 1.0;
  else return -1.0;
}

function Rand(min, max){
  if(max < min){
    var t = min;
    min = max;
    max = t;
  }
  return (Math.random() * (max - min) + min)
}

function RandSqr(min, max){
  if(max < min){
    var t = min;
    min = max;
    max = t;
  }
  var r = Math.random();
  return (r * r * (max - min) + min)
}

function RandSqr2(min, max){
  if(max < min){
    var t = min;
    min = max;
    max = t;
  }
  var r1 = Math.random();
  var r2 = Math.random();
  return (r1 * r2 * (max - min) + min)
}

//x3dom:<ComposedShader>タグのフィールドの値の変更
function changeShaderParamValue(fieldElementName, value)
{
  var fieldDOMElement = document.getElementById(fieldElementName);
  if (fieldDOMElement){
    fieldDOMElement.setAttribute("value", parseFloat(value));
    var labelElement = document.getElementById(fieldElementName + "Label");
    if (labelElement){
      labelElement.innerHTML = value;
    }
  }
}

//read CSV //CSV読み込み
function readCSV(filename,analyzefunc,donefunc){
  var afunc = new Function("param", "return " + analyzefunc + "(param)");   
  var dfunc = new Function("param", "return " + donefunc + "(param)");   
  var httpObj = new XMLHttpRequest();
  res = "";
  httpObj.open("GET", filename, true);
  httpObj.onreadystatechange = function() {
    if (httpObj.readyState == 4) {
      if(httpObj.status == 0){
        alert("Error:connect");
      }
      else if((200 <= httpObj.status && httpObj.status < 300) || (httpObj.status == 304)) {
        res = httpObj.responseText;
        res = afunc(res);
        dfunc(res);
        return res;
      }
      else {
        alert("Error:others");
      }
    }
  }
  httpObj.send(null);
  return true;
}

//analyze CSV //CSV解析
function analyzeCSV(res) {
  var ares = new Array();
  var line;
  if (res.match(/\r/))     line = res.split("\r\n");
  else                     line = res.split("\n");

  var linenum = line.length;
  for (var i = 0; i < linenum; i++) ares[i] = new Array();
  var k = 0;
  var maxcol = 0;
  for (i = 0; i < linenum; i++) {
    if(line[i][0] == '#') {k++; continue;} //skip comment out//コメントアウトはスキップ
    line[i] = line[i].replace( /\t/g,"");
    line[i] = line[i].replace( /\s/g,"");
    var col = line[i].split(",");
    var colnum = col.length;
    for (var j = 0; j < colnum; j++) ares[i - k][j] = col[j];
    if (colnum > maxcol) maxcol = colnum;
  }
  ares.length = linenum - k;
  return ares;
}

//ex//使用例：readCSV('filename', 'analyzeCSV', 'donefunc');
