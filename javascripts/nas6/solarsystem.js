var TMan = new N6LTimerMan();  //タイマーマネージャー
var IDTransA = new Array('sph00a', 'sph01a', 'sph02a', 'sph03a', 'sph04a', 'sph05a', 'sph06a', 'sph07a', 'sph08a', 'sph09a', 'sph10a', 'sph11a', 'sph12a', 'sph13a', 'sph14a');
var IDTransZ = new Array('sph00z', 'sph01z', 'sph02z', 'sph03z', 'sph04z', 'sph05z', 'sph06z', 'sph07z', 'sph08z', 'sph09z', 'sph10z', 'sph11z', 'sph12z', 'sph13z', 'sph14z');
var IDT = new Array('ln00t', 'ln01t', 'ln02t', 'ln03t', 'ln04t', 'ln05t', 'ln06t', 'ln07t', 'ln08t', 'ln09t', 'ln10t', 'ln11t', 'ln12t', 'ln13t', 'ln14t');
var IDL = new Array('ln00l', 'ln01l', 'ln02l', 'ln03l', 'ln04l', 'ln05l', 'ln06l', 'ln07l', 'ln08l', 'ln09l', 'ln10l', 'ln11l', 'ln12l', 'ln13l', 'ln14l');

var x3domRuntime;
var planetnum = 15;




var res;
var bBBB;
var bRunning = false;
var bWaiting = false;
var Speed = 1.0;
var Zoom = 1.0;
var CalcWay = 0;
var fFst = 1;
var dat;
var time;
var dt;
var bRead = false;
var bLAM = false;
var intvl = 50;

var CNST_AU = 1.49597870700e+11;

var planet = new Array();
var mp = new Array();
var rk = new N6LRngKt();

jQuery(document).ready(function(){
//  settestday();
  onNOW();
  onOO();
  init(0);
  TMan.add();
  TMan.timer[0].setalerm(function() { GLoop(0); }, intvl);  //メインループセット
});

//メインループ
function GLoop(id){
  if(x3domRuntime == undefined) x3domRuntime = document.getElementById('x3dabs').runtime;
  else {
    viewp();
    if(bWaiting || 0 < fFst) onWaiting();
    if(bRunning) onRunning();
    if(!CalcWay) intvl = 50;
    else intvl = 400;
    if(intvl == 50 && TMan.interval != intvl) TMan.changeinterval(intvl);
    if(intvl == 400 && TMan.interval != intvl) TMan.changeinterval(intvl);
  }

  TMan.timer[id].setalerm(function() { GLoop(id); }, intvl);  //メインループ再セット
}

function onNOW() {
  var dt = new Date();
  setday(dt);
  onSTP();
}

function onOO() {
  F1.T4.value = 0;
  F1.T5.value = 0;
  F1.T6.value = 0;
  onSTP();
}

function onIN() {
  F1.SPD.value = 1.0;
  F1.ZOM.value = 1.0;
  onSTP();
}

function onOUT() {
  F1.SPD.value = 90.0;
  F1.ZOM.value = 15.0;
  onSTP();
}

function onSTP() {
  bRunning = false;
  init(0);
}

function onREV() {
  init(-1);
}

function onRUN() {
  init(1);
}

function setday(dt) {
  var year = dt.getFullYear();
  var month = dt.getMonth() + 1;
  var day = dt.getDate();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  var second = dt.getSeconds();
  F1.T1.value = year;
  F1.T2.value = month;
  F1.T3.value = day;
  F1.T4.value = hour;
  F1.T5.value = minute;
  F1.T6.value = second;
}

function settestday() {
  F1.T1.value = 2000;
  F1.T2.value = 1;
  F1.T3.value = 1;
  F1.T4.value = 0;
  F1.T5.value = 0;
  F1.T6.value = 0;
}

function init(b) {
  bBBB = b;
  if(0 <= b) Speed = Number(F1.SPD.value);
  else Speed = Number(F1.SPD.value) * -1;
  Zoom = Number(F1.ZOM.value);
  if(Zoom < 0.0) Zoom *= -1.0;

  var radioList = document.getElementsByName("CALC");
  for(i = 0; i<radioList.length; i++){
      if(radioList[i].checked){
          CalcWay = Number(radioList[i].value);
          break;
      }
  }

  bWaiting = false;
  if(!CalcWay) InitKepler();
  else InitRelative();
  onWaiting();
}

function onWaiting() {
  if(!bWaiting) {
    fFst = -1;
    setmp();
    setline();
    if(bBBB) bRunning = true;
  }
}

function onRunning() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  if(fFst != 0) {
    fFst = 0;
    time = 0.0;
    if(CalcWay) dt = Speed * 60 * 60;
    else dt = Speed * msecPerDay;
  }
 
  //メインループ
  if(CalcWay) UpdateFrameRelative();
  else UpdateFrameKepler();
}

function getnow() {
  var nt = new Date(Number(F1.T1.value), Number(F1.T2.value) - 1, Number(F1.T3.value), Number(F1.T4.value), Number(F1.T5.value), Number(F1.T6.value));
  return nt;
}

function InitKepler() {
  if(!bRead) fFst = 1;
  dat = getnow();
  PlanetInit(dat);
}

function UpdateFrameKepler() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  var dat1;
  var day = time / msecPerDay;
  var tm = dt;
  if(dt != 0.0) {
    time = time + tm;
    var datt = dat.getTime();
    var dat1t = datt + time;
    var dat1 = new Date(dat1t);

    PlanetInit(dat1);    //新しい日時で惑星初期化

    setmp();
    setday(dat1);
  }
}

function InitRelative() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  if(!bRead) fFst = 1;
  dat = getnow();
  PlanetInit(dat);
  dt = Speed * 60 * 60;
  var pmp = new Array();
  var i;
  for(i = 0; i < planetnum; i++) pmp[i] = new N6LMassPoint(mp[i]);
  rk.Init(pmp, dt);
}

function UpdateFrameRelative() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  var dat1;
  var tm = Math.abs(Speed) * msecPerDay / 1000;
  var adt = Math.abs(dt);
  var t;
  var i;
  if(dt != 0.0) {
    for(t = adt; t <= tm; t += adt) {
      time = time + dt * 1000;
      //質点アップデート
      rk.UpdateFrame()

      //太陽原点補正
      for(i = 1; i < planetnum; i++) {
        rk.mp[i].x = rk.mp[i].x.Sub(rk.mp[0].x);
        mp[i].x = new N6LVector(rk.mp[i].x);
      }
      rk.mp[0].x = rk.mp[0].x.ZeroVec();
    }
    var datt = dat.getTime();
    var dat1t = datt + time;
    var dat1 = new Date(dat1t);
    setmp();
    setday(dat1);
  } 
}

function setmp() {
  var i;
  for(i = 0; i < planetnum; i++) {
    var elm = document.getElementById(IDTransA[i]);
    var sp = new x3dom.fields.SFVec3f(mp[i].x.x[1] / CNST_AU / Zoom, -mp[i].x.x[0] / CNST_AU / Zoom, mp[i].x.x[2] / CNST_AU / Zoom);
    elm.setAttribute('translation', sp.toString());
  }
}

function viewp() {
  if(!x3domRuntime) return;
  var selid = F1.VP.selectedIndex;
  var elm = document.getElementById('viewp000');

  var SWM = x3domRuntime.viewMatrix().inverse(); //ワールド回転行列取得
  var WM = new N6LMatrix().FromX3DOM(SWM);
  var Seye = SWM.multMatrixPnt(new x3dom.fields.SFVec3f(0, 0, 0)); //視点位置取得
  var sp = new x3dom.fields.SFVec3f(mp[selid].x.x[1] / CNST_AU / Zoom, -mp[selid].x.x[0] / CNST_AU / Zoom, mp[selid].x.x[2] / CNST_AU / Zoom);
  var Sat = x3dom.fields.SFVec3f.copy(sp);
  var lookat = new N6LVector([1.0, Sat.x, Sat.y, Sat.z], true);
  var LAM = WM.LookAtMat2(lookat);
  var Vec = LAM.Vector();
  var ori = Vec.ToX3DOM();

  elm.setAttribute('position', Seye.toString());
  elm.setAttribute('orientation', ori.toString());
  elm.setAttribute('centerOfRotation', sp.toString());
}

//惑星初期化
function PlanetInit(dat) {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var i;
  var j;
  if(0 < fFst) {
    //データファイル読み込み
    if(!bWaiting) {
      bWaiting = true;
      readCSV('./javascripts/nas6lib/PData000.txt', 'analyzeCSV', 'readedCSV');
    }
    return;
  }
  else {
    for(i = 0; i < planetnum; i++) {
      var dat0 = planet[i].m_dat0;
      var datt = dat.getTime();
      var dat0t = dat0.getTime();
      var ddat = (datt - dat0t) / msecPerDay;
      var nday = ddat;

      var xx = new Array(new N6LVector(3));
      var f = planet[i].kepler(nday, xx);
      planet[i].x0 = new N6LVector(3);
      planet[i].x0.x[0] = xx[0].x[0];
      planet[i].x0.x[1] = xx[0].x[1];
      planet[i].x0.x[2] = 0.0;

      var xyz = new Array(new N6LVector(3));
      planet[i].ecliptic(planet[i].x0.x[0], planet[i].x0.x[1], planet[i].x0.x[2], xyz);
      if(isNaN(xyz[0].x[0]) || isNaN(xyz[0].x[1]) || isNaN(xyz[0].x[2])) {
        planet[i].x0.x[0] = 0.0;
        planet[i].x0.x[1] = 0.0;
        planet[i].x0.x[2] = 0.0;
      }
      else {
        planet[i].x0.x[0] = xyz[0].x[0];
        planet[i].x0.x[1] = xyz[0].x[1];
        planet[i].x0.x[2] = xyz[0].x[2];
      }

      planet[i].v0 = new N6LVector(3);
      
      //ケプラー方程式から軌道速度を求める
      var xyz2 = new Array(new N6LVector(3));

      var xxx = new Array(new N6LVector(3));
      planet[i].kepler(nday + (1.0 / (24.0 * 4.0) * planet[i].m_t), xxx);
      var vv = xxx[0].Sub(xx[0]);
      //速度微調整
      planet[i].v0.x[0] = (vv.x[0] / (60.0 * 60.0 * 24.0 / (24.0 * 4.0) * planet[i].m_t) / planet[i].CNST_C) * planet[i].m_mv;
      planet[i].v0.x[1] = (vv.x[1] / (60.0 * 60.0 * 24.0 / (24.0 * 4.0) * planet[i].m_t) / planet[i].CNST_C) * planet[i].m_mv;
      planet[i].v0.x[2] = 0.0;

      planet[i].ecliptic(planet[i].v0.x[0], planet[i].v0.x[1], planet[i].v0.x[2], xyz2);
      if(isNaN(xyz2[0].x[0]) || isNaN(xyz2[0].x[1]) || isNaN(xyz2[0].x[2])) {
        planet[i].v0.x[0] = 0.0;
        planet[i].v0.x[1] = 0.0;
        planet[i].v0.x[2] = 0.0;
      }
      else {
        planet[i].v0.x[0] = xyz2[0].x[0];
        planet[i].v0.x[1] = xyz2[0].x[1];
        planet[i].v0.x[2] = xyz2[0].x[2];
      }
      mp[i] = new N6LMassPoint(planet[i].x0, planet[i].v0, planet[i].m_m, planet[i].m_r, planet[i].m_e);
    }
  }
}

function readedCSV(res) {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  bWaiting = false;
  bRead = true;

  for(i = 0; i < planetnum; i++) {

    var PlanetName = res[i][0];
    var PlanetNo = Number(res[i][1]);
    var EpochYY = Number(res[i][2]);
    var EpochMM = Number(res[i][3]);
    var EpochDD = Number(res[i][4]);
    var Epochh = Number(res[i][5]);
    var Epochm = Number(res[i][6]);
    var Epochs = Number(res[i][7]);
    var a = Number(res[i][8]);
    var e = Number(res[i][9]);
    var m0 = Number(res[i][10]);
    var npd = Number(res[i][11]);
    var ra = Number(res[i][12]);
    var rb = Number(res[i][13]);
    var p = Number(res[i][14]);
    var ss = Number(res[i][15]);
    var ii = Number(res[i][16]);
    var ww = Number(res[i][17]);
    var m = Number(res[i][18]);
    var r = Number(res[i][19]);
    var mv = Number(res[i][20]);

    var dat0 = new Date(EpochYY, EpochMM - 1, EpochDD, Epochh, Epochm, Epochs);
    var datt = dat.getTime();
    var dat0t = dat0.getTime();

    var ddat = (datt - dat0t) / msecPerDay;

    //惑星初期化
    planet[i] = new N6LPlanet();
    planet[i].Create(PlanetNo, PlanetName, ddat, dat0, a, e, m0, npd, ra, rb, p, ss, ii, ww, m, r, mv);

    //質点初期化
    mp[i] = new N6LMassPoint(planet[i].x0, planet[i].v0, m, r, e);
  }
  return true;
}

//惑星軌道線分設定
function setline() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var i;
  var j;
  var k;
  var n = 32;
  var str;
  for(i = 1; i < planetnum; i++) {
    str = "";
    var x0;
    //惑星１周を32分割の線分設定
    for(j = 0; j < n; j++) {
      var ad = (360.0 * 360.0 / 365.2425 / planet[i].m_nperday) * (j / n);
      var days = (dat.getTime() - planet[i].m_dat0.getTime()) / msecPerDay;
      var nday = days + ad;
      var xx = new Array(new N6LVector(3));
      var f = planet[i].kepler(nday, xx);
      var x1 = new N6LVector(3);
      x1.x[0] = xx[0].x[0];
      x1.x[1] = xx[0].x[1];
      x1.x[2] = 0.0;
      if(j == 0) x0 = new N6LVector(x1);
      str += (x1.x[1] / CNST_AU / Zoom).toString() + " " + (-x1.x[0] / CNST_AU / Zoom).toString() + ", ";
    }
    str += (x0.x[1] / CNST_AU / Zoom).toString() + " " + (-x0.x[0] / CNST_AU / Zoom).toString();

    var ss = planet[i].m_s * planet[i].CNST_DR;
    var ii = planet[i].m_i * planet[i].CNST_DR;
    var ww = planet[i].m_w * planet[i].CNST_DR;

    var vec = new N6LVector(3);
    var mat = new N6LMatrix(3);
    mat = mat.UnitMat().RotAxis(vec.UnitVec(2), ss).RotAxis(vec.UnitVec(1).Mul(-1.0), ii).RotAxis(vec.UnitVec(2), ww);
    var VecWK = new N6LVector(4);
    var MatWK = new N6LMatrix(4);
    MatWK.x[0] = VecWK.UnitVec(0);
    MatWK.x[0].bHomo = false;
    for(k = 1; k < 4; k++) {
      MatWK.x[k] = mat.x[k - 1].NormalVec().ToHomo();
      MatWK.x[k].x[0] = 0.0;
      MatWK.x[k].bHomo = false;
    }
    VecWK = MatWK.NormalMat().Vector();


    var elm;
    var sp;

    elm = document.getElementById(IDL[i]);
    elm.setAttribute('lineSegments', new String(str));

    elm = document.getElementById(IDT[i]);
    sp = VecWK.ToX3DOM();
    elm.setAttribute('rotation', sp.toString());
  }
}
 
