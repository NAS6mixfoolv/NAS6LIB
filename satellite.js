var TMan = new N6LTimerMan();  //タイマーマネージャー
var IDTransA = new Array('sph00a', 'sph01a', 'sph02a', 'sph03a', 'sph04a', 'sph05a', 'sph06a', 'sph07a', 'sph08a', 'sph09a', 'sph10a');
var IDTransZ = new Array('sph00z', 'sph01z', 'sph02z', 'sph03z', 'sph04z', 'sph05z', 'sph06z', 'sph07z', 'sph08z', 'sph09z', 'sph10z');
var IDT = new Array('ln00t', 'ln01t', 'ln02t', 'ln03t', 'ln04t', 'ln05t', 'ln06t', 'ln07t', 'ln08t', 'ln09t', 'ln10t');
var IDL = new Array('ln00l', 'ln01l', 'ln02l', 'ln03l', 'ln04l', 'ln05l', 'ln06l', 'ln07l', 'ln08l', 'ln09l', 'ln10l');

var x3domRuntime;

var planetnum = 11;

var bBBB;
var bRunning = false;
var bWaiting = false;
var Speed = 1.0;
var Zoom = 1.0;
var fFst = 1;
var dat = new Date(0);
var time;
var dt;
var bRead = false;
var bLAM = false;
var intvl = 50;

var CNST_AU = 1.49597870700e+11;

var planet = new Array();
for(dt = 0; dt < planetnum; dt++) planet[dt] = new N6LPlanet();
dt = 0;
var mpadj = new Array();
var mp = new Array();
var rk = new N6LRngKt();

jQuery(document).ready(function(){
  onNow();
  var a = eval(document.F2.T11.value);
  var b = eval(document.F2.T12.value) * 1000.0;
  dat = new Date(b);
  document.F1.myFormTIME.value = a;
  init(0);
  myMercury();
  TMan.add();
  TMan.timer[0].setalerm(function() { GLoop(0); }, intvl);  //メインループセット
});



function viewp() {
  if(!x3domRuntime) return;
  var selid = document.F1.VP.selectedIndex;
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




//メインループ
function GLoop(id){
  if(x3domRuntime == undefined) x3domRuntime = document.getElementById('x3dabs').runtime;
  else {
    viewp();
    if(bRunning) onRunning();
    var i;
    var n = 0;
    for(i = 0; i < planetnum; i++)
      if(0.0 < mp[i].mass) n++;
    if(7 < n) intvl = 300;
    else if(3 < n) intvl = 150;
    else intvl = 50;
    if(intvl == 50 && TMan.interval != intvl) TMan.changeinterval(intvl);
    if(intvl == 150 && TMan.interval != intvl) TMan.changeinterval(intvl);
    if(intvl == 300 && TMan.interval != intvl) TMan.changeinterval(intvl);
  }

  TMan.timer[id].setalerm(function() { GLoop(id); }, intvl);  //メインループ再セット
}

function mySet1(){
     document.F1.my1FormT0.value = my1T0 / my1AU3;
     document.F1.my1FormE.value = my1E;
     document.F1.my1FormRA1.value = my1RA1 / my1AU;
     document.F1.my1FormRA2.value = my1RA2 / my1AU;
     document.F1.my1FormP.value = my1P / my1AU3;
     document.F1.my1FormM2.value = my1M2;
     document.F1.my1FormM1.value = my1M1;
     document.F1.my1FormTT0.value = my1TT0 / my1AU3;
     document.F1.my12FormT0.value = my1T0;
     document.F1.my12FormE.value = my1E;
     document.F1.my12FormRA1.value = my1RA1;
     document.F1.my12FormRA2.value = my1RA2;
     document.F1.my12FormP.value = my1P;
     document.F1.my12FormM2.value = my1M2;
     document.F1.my12FormM1.value = my1M1;
     document.F1.my12FormTT0.value = my1TT0;
     var radioList = document.getElementsByName("deg");
     if(radioList[0].checked) {
         document.F1.my1FormOMG.value = my1OMG;
         document.F1.my1FormINC.value = my1INC;
         document.F1.my1FormOmg.value = my1Omg;
         document.F1.my1FormLTT0.value = my1LTT0;
         document.F1.my12FormOMG.value = my1OMG;
         document.F1.my12FormINC.value = my1INC;
         document.F1.my12FormOmg.value = my1Omg;
         document.F1.my12FormLTT0.value = my1LTT0;
     }
     else {
         document.F1.my1FormOMG.value = my1OMG * my1DR;
         document.F1.my1FormINC.value = my1INC * my1DR;
         document.F1.my1FormOmg.value = my1Omg * my1DR;
         document.F1.my1FormLTT0.value = my1LTT0 * my1DR;
         document.F1.my12FormOMG.value = my1OMG * my1DR;
         document.F1.my12FormINC.value = my1INC * my1DR;
         document.F1.my12FormOmg.value = my1Omg * my1DR;
         document.F1.my12FormLTT0.value = my1LTT0 * my1DR;
     }
}
 
function myCalc1(){
     my1DR = 0.017453292519943;
     my1AU = 1.49597870700e+11;
     my1AU3 = 60.0 * 60.0 * 24.0 * 365.2425;
     my1AU2 = 2.0 * Math.PI * my1AU / my1AU3;
     radioList = document.getElementsByName("calc1");
     radioList2 = document.getElementsByName("deg");
     checkList = document.getElementsByName("calc2");
     if(radioList[0].checked){
          if(checkList[0].checked){
               my1TT0 = eval(document.F1.my1FormTT0.value) * my1AU3;
               my1T0 = eval(document.F1.my1FormT0.value) * my1AU3;
               if(radioList2[0].checked) {
                   my1OMG = eval(document.F1.my1FormOMG.value);
                   my1INC = eval(document.F1.my1FormINC.value);
                   my1Omg = eval(document.F1.my1FormOmg.value);
                   my1LTT0 = eval(document.F1.my1FormLTT0.value);
               }
               else {
                   my1OMG = eval(document.F1.my1FormOMG.value) / my1DR;
                   my1INC = eval(document.F1.my1FormINC.value) / my1DR;
                   my1Omg = eval(document.F1.my1FormOmg.value) / my1DR;
                   my1LTT0 = eval(document.F1.my1FormLTT0.value) / my1DR;
               }
               my1E = eval(document.F1.my1FormE.value);
               my1RA1 = eval(document.F1.my1FormRA1.value) * my1AU;
               my1RA2 = eval(document.F1.my1FormRA2.value) * my1AU;
               my1P = eval(document.F1.my1FormP.value) * my1AU3;
               my1M2 = eval(document.F1.my1FormM2.value);
               my1M1 = eval(document.F1.my1FormM1.value);
               my1G = 6.67e-11;
               my1A1 = Math.pow(my1G * (my1M1 + my1M2) * (my1P / (2.0 * Math.PI)) * (my1P / (2.0 * Math.PI)),1/3);
               my1RA2 = my1E * my1A1 + my1A1;       
               my1RA1 = 2.0 * my1A1 - my1RA2; 
          }
          else{
               my1TT0 = eval(document.F1.my1FormTT0.value) * my1AU3;
               my1T0 = eval(document.F1.my1FormT0.value) * my1AU3;
               if(radioList2[0].checked) {
                   my1OMG = eval(document.F1.my1FormOMG.value);
                   my1INC = eval(document.F1.my1FormINC.value);
                   my1Omg = eval(document.F1.my1FormOmg.value);
                   my1LTT0 = eval(document.F1.my1FormLTT0.value);
               }
               else {
                   my1OMG = eval(document.F1.my1FormOMG.value) / my1DR;
                   my1INC = eval(document.F1.my1FormINC.value) / my1DR;
                   my1Omg = eval(document.F1.my1FormOmg.value) / my1DR;
                   my1LTT0 = eval(document.F1.my1FormLTT0.value) / my1DR;
               }
               my1E = eval(document.F1.my1FormE.value);
               my1RA1 = eval(document.F1.my1FormRA1.value) * my1AU;
               my1RA2 = eval(document.F1.my1FormRA2.value) * my1AU;
               my1P = eval(document.F1.my1FormP.value) * my1AU3;
               my1M2 = eval(document.F1.my1FormM2.value);
               my1M1 = eval(document.F1.my1FormM1.value);
               my1G = 6.67e-11;
               my1A1 = (my1RA1 + my1RA2) / 2.0; 
               radioList = document.getElementsByName("calc12");
               if(radioList[0].checked){
                   my1M1 = (4.0 * Math.PI * Math.PI * my1A1 * my1A1 * my1A1) * (1.0 / (my1G * my1P * my1P)) - my1M2;
               }
               else{
                   my1P = 2.0 * Math.PI * Math.sqrt(my1A1 * my1A1 * my1A1 / my1G / (my1M1 + my1M2));
               }
          }
     }
     else{
          if(checkList[1].checked){
               my1TT0 = eval(document.F1.my12FormTT0.value);
               my1T0 = eval(document.F1.my12FormT0.value);
               if(radioList2[0].checked) {
                   my1OMG = eval(document.F1.my1FormOMG.value);
                   my1INC = eval(document.F1.my1FormINC.value);
                   my1Omg = eval(document.F1.my1FormOmg.value);
                   my1LTT0 = eval(document.F1.my1FormLTT0.value);
               }
               else {
                   my1OMG = eval(document.F1.my1FormOMG.value) / my1DR;
                   my1INC = eval(document.F1.my1FormINC.value) / my1DR;
                   my1Omg = eval(document.F1.my1FormOmg.value) / my1DR;
                   my1LTT0 = eval(document.F1.my1FormLTT0.value) / my1DR;
               }
               my1E = eval(document.F1.my12FormE.value);
               my1RA1 = eval(document.F1.my12FormRA1.value);
               my1RA2 = eval(document.F1.my12FormRA2.value);
               my1P = eval(document.F1.my12FormP.value);
               my1M2 = eval(document.F1.my12FormM2.value);
               my1M1 = eval(document.F1.my12FormM1.value);
               my1G = 6.67e-11;
               my1A1 = Math.pow(my1G * (my1M1 + my1M2) * (my1P / (2.0 * Math.PI)) * (my1P / (2.0 * Math.PI)),1/3);
               my1RA2 = my1E * my1A1 + my1A1;       
               my1RA1 = 2.0 * my1A1 - my1RA2; 
          }
          else{
               my1TT0 = eval(document.F1.my12FormTT0.value);
               my1T0 = eval(document.F1.my12FormT0.value);
               if(radioList2[0].checked) {
                   my1OMG = eval(document.F1.my1FormOMG.value);
                   my1INC = eval(document.F1.my1FormINC.value);
                   my1Omg = eval(document.F1.my1FormOmg.value);
                   my1LTT0 = eval(document.F1.my1FormLTT0.value);
               }
               else {
                   my1OMG = eval(document.F1.my1FormOMG.value) / my1DR;
                   my1INC = eval(document.F1.my1FormINC.value) / my1DR;
                   my1Omg = eval(document.F1.my1FormOmg.value) / my1DR;
                   my1LTT0 = eval(document.F1.my1FormLTT0.value) / my1DR;
               }
               my1E = eval(document.F1.my12FormE.value);
               my1RA1 = eval(document.F1.my12FormRA1.value);
               my1RA2 = eval(document.F1.my12FormRA2.value);
               my1P = eval(document.F1.my12FormP.value);
               my1M2 = eval(document.F1.my12FormM2.value);
               my1M1 = eval(document.F1.my12FormM1.value);
               my1G = 6.67e-11;
               my1A1 = (my1RA1 + my1RA2) / 2.0; 
               radioList = document.getElementsByName("calc12");
               if(radioList[0].checked){
                   my1M1 = (4.0 * Math.PI * Math.PI * my1A1 * my1A1 * my1A1) * (1.0 / (my1G * my1P * my1P)) - my1M2;
               }
               else{
                   my1P = 2.0 * Math.PI * Math.sqrt(my1A1 * my1A1 * my1A1 / my1G / (my1M1 + my1M2));
               }
          }
     }
     my1Vst = (1.0 / 2.0) * Math.sqrt(my1RA1 * my1RA2) * (my1RA1 + my1RA2) / my1P;
     my1VA1 = (my1Vst / my1RA1) * 2.0 * Math.PI;
     my1VA2 = (my1Vst / my1RA2) * 2.0 * Math.PI;
     my1E = (my1RA2 - my1A1) / my1A1;       
     mySet1(); 
}

function mySetMP(id) {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  var PlanetNo = id;
  var a = Number(my1A1 / my1AU);
  var e = Number(my1E);
  var m0 = Number(my1LTT0) + ((Number(my1T0) %  Number(my1P)) / Number(my1P) * 360.0);
  var npd = 360.0 / 365.2425 / Number(my1P / my1AU3);
  var ra = Number(my1RA1 / my1AU);
  var rb = Number(my1RA2 / my1AU);
  var p = Number(my1P / my1AU3);
  var ss = Number(my1OMG);
  var ii = Number(my1INC);
  var ww = Number(my1Omg);
  var m = Number(my1M2);
  var r = Number(0);
  var m1 = Number(my1M1);
  var mv = 1;
  var dat0 = new Date(my1TT0 * 1000.0);
  var pname1 = "Sat0"
  var pname0 = "Sat" + id.toString();

  if(0 < m) { 
    planet[0] = new N6LPlanet();
    planet[0].Create(0, pname1, 0, dat0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m1, 0, 1.0);
    mp[0] = new N6LMassPoint(planet[0].x0, planet[0].v0, m1, 0, 1.0);
    planet[id] = new N6LPlanet();
    planet[id].Create(PlanetNo, pname0, 0, dat0, a, e, m0, npd, ra, rb, p, ss, ii, ww, m, r, mv);
    mp[id] = new N6LMassPoint(planet[id].x0, planet[id].v0, m, r, e);
  }
}

function onLOOK() {
  document.F1.SPD.value = document.F1.my1FormP.value * 2;
  document.F1.ZOM.value = document.F1.my1FormRA2.value / 2;
}

function onCLS() {
  bRunning = false;
  init(0);  
  onCAL();
}

function onDEL() {
  bRunning = false;
  var radioList = document.getElementsByName("PUTSEL");
  var i;
  var id;
  for(i = 0; i<radioList.length; i++){
      if(radioList[i].checked){
          id = Number(radioList[i].value) + 1;
          break;
      }
  }
  var v = new N6LVector(3);
  mp[id] = new N6LMassPoint(v.ZeroVec(), v.ZeroVec(), -1, -1, -1);
  setmp();
  setline();
  onCAL();
}

function onCAL() {
  bRunning = false;
  var radioList = document.getElementsByName("PUTSEL");
  var id;
  for(i = 0; i<radioList.length; i++){
      if(radioList[i].checked){
          id = Number(radioList[i].value) + 1;
          break;
      }
  }
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;

  if(0.0 < mp[id].mass) {
    document.F1.my1FormE.value = planet[id].m_e;
    document.F1.my1FormRA1.value = planet[id].m_ra;
    document.F1.my1FormRA2.value = planet[id].m_rb;
    document.F1.my1FormP.value = planet[id].m_t;
    document.F1.my1FormM2.value = planet[id].m_m;
    document.F1.my1FormM1.value = planet[0].m_m;
    document.F1.my1FormT0.value = 0;
    document.F1.my1FormOMG.value = planet[id].m_s;
    document.F1.my1FormINC.value = planet[id].m_i;
    document.F1.my1FormOmg.value = planet[id].m_w;
    document.F1.my1FormTT0.value = planet[id].m_dat0.getTime() / 1000.0;
    document.F1.my1FormLTT0.value = planet[id].m_l0;
    myCalc1();
  }
  else {
    document.F1.my1FormE.value = 0;
    document.F1.my1FormRA1.value = 0;
    document.F1.my1FormRA2.value = 0;
    document.F1.my1FormP.value = 0;
    document.F1.my1FormM2.value = 0;
    document.F1.my1FormM1.value = 0;
    document.F1.my1FormT0.value = 0;
    document.F1.my1FormOMG.value = 0;
    document.F1.my1FormINC.value = 0;
    document.F1.my1FormOmg.value = 0;
    document.F1.my1FormTT0.value = 0;
    document.F1.my1FormLTT0.value = 0;
    document.F1.my12FormT0.value = 0;
    document.F1.my12FormE.value = 0;
    document.F1.my12FormRA1.value = 0;
    document.F1.my12FormRA2.value = 0;
    document.F1.my12FormP.value = 0;
    document.F1.my12FormM2.value = 0;
    document.F1.my12FormM1.value = 0;
    document.F1.my12FormOMG.value = 0;
    document.F1.my12FormINC.value = 0;
    document.F1.my12FormOmg.value = 0;
    document.F1.my12FormTT0.value = 0;
    document.F1.my12FormLTT0.value = 0;
  }
  init(1);  
}

function onAPP() {
  bRunning = false;
  var radioList = document.getElementsByName("PUTSEL");
  var id;
  var id2;
  var i;
  var n = 0;
  for(i = 0; i < planetnum; i++)
    if(0.0 < mp[i].mass){n++;id2=i;}
  for(i = 0; i<radioList.length; i++){
      if(radioList[i].checked){
          id = Number(radioList[i].value) + 1;
          break;
      }
  }
  myCalc1();
  if(((n == 2 && id2 != id) || 2 < n) && (0 < planet[0].m_m && planet[0].m_m != my1M1)) {
    onDEL();
  }
  else {
    mySetMP(id); 
    init(1);
  }
}

function onSTP() {
  bRunning = false;
  init(1);
}

function onREV() {
  bRunning = true;
  Speed = Number(document.F1.SPD.value) * -1;
  init(-1);
}

function onRUN() {
  bRunning = true;
  Speed = Number(document.F1.SPD.value);
  init(1);
}

function init(b) {
  Speed = Number(document.F1.SPD.value);
  if(b < 0) Speed *= -1;
  Zoom = Number(document.F1.ZOM.value);
  if(Zoom < 0.0) Zoom *= -1.0;

  var radioList = document.getElementsByName("PUTSEL");
  var i;
  for(i = 0; i<radioList.length; i++){
      if(radioList[i].checked){
          id = Number(radioList[i].value) + 1;
          break;
      }
  }
  var v = new N6LVector(3);
  if(b) { ; }
  else {
    for(i = 0; i < planetnum; i++) {
      mp[i] = new N6LMassPoint(v.ZeroVec(), v.ZeroVec(), -1, -1, -1);
    }
  }

  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var days = eval(document.F1.myFormTIME.value) * 365.2425;
  dat = new Date(days * msecPerDay);
  setmp();
  setline();
  InitRelative();
  setmp();
  setline();
}

function onRunning() {
  //メインループ
  UpdateFrameRelative();
}

function InitRelative() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var days = eval(document.F1.myFormTIME.value) * 365.2425;
  dat = new Date(days * msecPerDay);
  time = dat.getTime();
  PlanetInit(dat);
  setline();
  dt = Speed * 60 * 60;
  var pmp = new Array();
  var i;
  for(i = 0; i < planetnum; i++) pmp[i] = new N6LMassPoint(mp[i]);
  rk.Init(pmp, dt);
  settime(dat);
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
    settime();
  } 
}

function settime(dat1) {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var days = time / msecPerDay;
  document.F1.myFormTIME.value = days / 365.2425;

  dat = new Date(time);
  document.F1.my1FormTT1.value = dat.getFullYear();
  document.F1.my1FormTT2.value = dat.getMonth() + 1;
  document.F1.my1FormTT3.value = dat.getDate();
  document.F1.my1FormTT4.value = dat.getHours();
  document.F1.my1FormTT5.value = dat.getMinutes();
  document.F1.my1FormTT6.value = dat.getSeconds();

}

function setmp() {
  var i;
  for(i = 0; i < planetnum; i++) {
    if(mp[i].mass < 0.0) {
      var elm = document.getElementById(IDTransA[i]);
      var sp = new x3dom.fields.SFVec3f(0, 0, 0);
      elm.setAttribute('translation', sp.toString());
      continue;
    }
    var elm = document.getElementById(IDTransA[i]);
    var sp = new x3dom.fields.SFVec3f(mp[i].x.x[1] / CNST_AU / Zoom, -mp[i].x.x[0] / CNST_AU / Zoom, mp[i].x.x[2] / CNST_AU / Zoom);
    elm.setAttribute('translation', sp.toString());
  }
}

//惑星初期化
function PlanetInit(dat) {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var i;
  var j;
    for(i = 0; i < planetnum; i++) {
      if(mp[i].mass < 0.0) continue;
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

//惑星軌道線分設定
function setline() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var a = new Date(1996,6,1,0,0,0);
  var ndayR = 0;
  var i;
  var j;
  var k;
  var n = 32;
  var str;
  for(i = 0; i < planetnum; i++) {
    str = "";
    if(mp[i].mass <= 0.0) {
      var rt = 0.001;
      var base = 4;
      var ofs = i * 0.1;
      var x;
      var y; 
      for(x = base, y = base; -base < x ; x--) 
        str += Number((x + ofs) * rt).toString() + " " + Number((y + ofs) * rt).toString() + ", ";
      for(; -base < y ; y--) 
        str += Number((x + ofs) * rt).toString() + " " + Number((y + ofs) * rt).toString() + ", ";
      for(; x < base ; x++) 
        str += Number((x + ofs) * rt).toString() + " " + Number((y + ofs) * rt).toString() + ", ";
      for(; y < base ; y++) 
        str += Number((x + ofs) * rt).toString() + " " + Number((y + ofs) * rt).toString() + ", ";
      str += Number((x + ofs) * rt).toString() + " " + Number((y + ofs) * rt).toString();
      var elm;
      var sp;

      elm = document.getElementById(IDL[i]);
      elm.setAttribute('lineSegments', new String(str));

      elm = document.getElementById(IDT[i]);
      sp = new x3dom.fields.SFVec4f(0, 1, 0, 0);
      elm.setAttribute('rotation', sp.toString());
      continue;
    }
    var x0;
    //惑星１周を32分割の線分設定
    for(j = 0; j < n; j++) {
      var ad = (360.0 * 360.0 / 365.2425 / planet[i].m_nperday) * (j / n);
      var days = (dat.getTime() - planet[i].m_dat0.getTime()) / msecPerDay;
      var nday = days + ad;
      var xx = new Array(new N6LVector(3));
      var f = planet[i].kepler(nday, xx);
      var eps = Math.PI / 32;
      if(Math.PI - eps < f && f < Math.PI + eps) ndayR = nday;
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

/*遠日点から開始コメントアウト
    var a;
    var b = 0;
    var c;
    for(a = 0; a < planetnum; a++)
      if(0.0 < mp[a].mass){b++;c=a;}
    if(b == 2 && i) {
      var msecPerMinute = 1000 * 60;
      var msecPerHour = msecPerMinute * 60;
      var msecPerDay = msecPerHour * 24;
      document.F1.myFormTIME.value = (ndayR + planet[c].m_dat0.getTime() / msecPerDay) / 365.2425;
      dat = new Date(ndayR * msecPerDay + planet[c].m_dat0.getTime());
    }
*/
    var elm;
    var sp;

    elm = document.getElementById(IDL[i]);
    elm.setAttribute('lineSegments', new String(str));

    elm = document.getElementById(IDT[i]);
    sp = VecWK.ToX3DOM();
    elm.setAttribute('rotation', sp.toString());
  }
}


function myMercury(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.2056;
  document.F1.my1FormRA1.value = 0.3075;
  document.F1.my1FormRA2.value = 0.4667;
  document.F1.my1FormP.value = 0.2409;
  document.F1.my1FormM2.value = 3.301e+23;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 48.335;
  document.F1.my1FormINC.value = 7.005;
  document.F1.my1FormOmg.value = 29.023967;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 338.653;
  document.F1.SPD.value = 1;
  document.F1.ZOM.value = 0.2;
  onAPP();
}

function myVenus(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0068;
  document.F1.my1FormRA1.value = 0.718;
  document.F1.my1FormRA2.value = 0.728;
  document.F1.my1FormP.value = 0.6152;
  document.F1.my1FormM2.value = 4.869e+24;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 76.69;
  document.F1.my1FormINC.value = 3.395;
  document.F1.my1FormOmg.value = 54.720439;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 160.49;
  document.F1.SPD.value = 2;
  document.F1.ZOM.value = 0.5;
  onAPP();
}

function myEarth(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0167;
  document.F1.my1FormRA1.value = 0.983;
  document.F1.my1FormRA2.value = 1.017;
  document.F1.my1FormP.value = 1.0;
  document.F1.my1FormM2.value = 5.9736e+24;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 174.345189;
  document.F1.my1FormINC.value = 0.003836;
  document.F1.my1FormOmg.value = 287.825581;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 176.453;
  document.F1.SPD.value = 2;
  document.F1.ZOM.value = 1;
  onAPP();
}

function myMars(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0934;
  document.F1.my1FormRA1.value = 1.381;
  document.F1.my1FormRA2.value = 1.666;
  document.F1.my1FormP.value = 1.8809;
  document.F1.my1FormM2.value = 6.4191e+23;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 49.568;
  document.F1.my1FormINC.value = 1.85;
  document.F1.my1FormOmg.value = 286.184381;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 68.889;
  document.F1.SPD.value = 3;
  document.F1.ZOM.value = 1;
  onAPP();
}

function myJupiter(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0485;
  document.F1.my1FormRA1.value = 4.952;
  document.F1.my1FormRA2.value = 5.455;
  document.F1.my1FormP.value = 11.862;
  document.F1.my1FormM2.value = 1.8986e+27;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 100.46;
  document.F1.my1FormINC.value = 1.303;
  document.F1.my1FormOmg.value = 273.511644;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 273.712;
  document.F1.SPD.value = 10;
  document.F1.ZOM.value = 2.5;
  onAPP();
}

function mySaturn(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0555;
  document.F1.my1FormRA1.value = 9.021;
  document.F1.my1FormRA2.value = 10.054;
  document.F1.my1FormP.value = 29.458;
  document.F1.my1FormM2.value = 5.688e+26;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 113.674;
  document.F1.my1FormINC.value = 2.489;
  document.F1.my1FormOmg.value = 338.052139;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 274.229;
  document.F1.SPD.value = 20;
  document.F1.ZOM.value = 5;
  onAPP();
}

function myUranus(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0463;
  document.F1.my1FormRA1.value = 18.286;
  document.F1.my1FormRA2.value = 20.096;
  document.F1.my1FormP.value = 84.022;
  document.F1.my1FormM2.value = 8.686e+25;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 74.004;
  document.F1.my1FormINC.value = 0.773;
  document.F1.my1FormOmg.value = 98.308736;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 126.044;
  document.F1.SPD.value = 40;
  document.F1.ZOM.value = 10;
  onAPP();
}

function myNeptune(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.009;
  document.F1.my1FormRA1.value = 29.811;
  document.F1.my1FormRA2.value = 30.327;
  document.F1.my1FormP.value = 164.774;
  document.F1.my1FormM2.value = 1.024e+26;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 131.783;
  document.F1.my1FormINC.value = 1.77;
  document.F1.my1FormOmg.value = 275.0;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 248.574;
  document.F1.SPD.value = 60;
  document.F1.ZOM.value = 15;
  onAPP();
}

function myPluto(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.249;
  document.F1.my1FormRA1.value = 29.574;
  document.F1.my1FormRA2.value = 49.316;
  document.F1.my1FormP.value = 247.796;
  document.F1.my1FormM2.value = 1.3e+22;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 110.318;
  document.F1.my1FormINC.value = 17.145;
  document.F1.my1FormOmg.value = 112.6;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 9.236;
  document.F1.SPD.value = 90;
  document.F1.ZOM.value = 20;
  onAPP();
}

function myCeres(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.076;
  document.F1.my1FormRA1.value = 2.547;
  document.F1.my1FormRA2.value = 2.984;
  document.F1.my1FormP.value = 4.6;
  document.F1.my1FormM2.value = 9.445e+20;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 80.7;
  document.F1.my1FormINC.value = 10.6;
  document.F1.my1FormOmg.value = 71.5;
  document.F1.my1FormTT0.value = 25.77209506078195;
  document.F1.my1FormLTT0.value = 37.9;
  document.F1.SPD.value = 5;
  document.F1.ZOM.value = 1.5;
  onAPP();
}

function myPallas(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.234;
  document.F1.my1FormRA1.value = 2.132;
  document.F1.my1FormRA2.value = 3.413;
  document.F1.my1FormP.value = 4.62;
  document.F1.my1FormM2.value = 2.06e+20;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 173.3;
  document.F1.my1FormINC.value = 34.8;
  document.F1.my1FormOmg.value = 309.7;
  document.F1.my1FormTT0.value = 25.77209506078195;
  document.F1.my1FormLTT0.value = 24.0;
  document.F1.SPD.value = 5;
  document.F1.ZOM.value = 1.5;
  onAPP();
}

function myJuno(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.257;
  document.F1.my1FormRA1.value = 1.989;
  document.F1.my1FormRA2.value = 3.351;
  document.F1.my1FormP.value = 4.36;
  document.F1.my1FormM2.value = 2.824e+19;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 170.2;
  document.F1.my1FormINC.value = 13.0;
  document.F1.my1FormOmg.value = 247.8;
  document.F1.my1FormTT0.value = 25.77209506078195;
  document.F1.my1FormLTT0.value = 251.4;
  document.F1.SPD.value = 5;
  document.F1.ZOM.value = 1.5;
  onAPP();
}

function myVesta(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.09;
  document.F1.my1FormRA1.value = 2.153;
  document.F1.my1FormRA2.value = 2.571;
  document.F1.my1FormP.value = 3.63;
  document.F1.my1FormM2.value = 2.701e+20;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 104.0;
  document.F1.my1FormINC.value = 7.1;
  document.F1.my1FormOmg.value = 150.3;
  document.F1.my1FormTT0.value = 25.77209506078195;
  document.F1.my1FormLTT0.value = 280.7;
  document.F1.SPD.value = 5;
  document.F1.ZOM.value = 1.5;
  onAPP();
}

function myChiron(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.383;
  document.F1.my1FormRA1.value = 8.498;
  document.F1.my1FormRA2.value = 18.92;
  document.F1.my1FormP.value = 50.76;
  document.F1.my1FormM2.value = 2.4e+18;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 209.4;
  document.F1.my1FormINC.value = 6.9;
  document.F1.my1FormOmg.value = 339.5;
  document.F1.my1FormTT0.value = 25.77209506078195;
  document.F1.my1FormLTT0.value = 357.5;
  document.F1.SPD.value = 40;
  document.F1.ZOM.value = 9;
  onAPP();
}

function myPSRB1913(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.6271186440677966;
  document.F1.my1FormRA1.value = 0.005117719900808722;
  document.F1.my1FormRA2.value = 0.022331868658074422;
  document.F1.my1FormP.value = 0.0009473194654787526;
  document.F1.my1FormM2.value = 2.8662931e+30;
  document.F1.my1FormM1.value = 2.8662931e+30;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  document.F1.SPD.value = 0.01;
  document.F1.ZOM.value = 0.01;
  onAPP();
}

function myPSRJ0737(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0;
  document.F1.my1FormRA1.value = 0.0026738348;
  document.F1.my1FormRA2.value = 0.0026738348;
  document.F1.my1FormP.value = 0.000085978196;
  document.F1.my1FormM2.value = 2.486375e+30;
  document.F1.my1FormM1.value = 2.6594267e+30;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  document.F1.SPD.value = 0.001;
  document.F1.ZOM.value = 0.0025;
  onAPP();
}

function myISS(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0001665;
  document.F1.my1FormRA1.value = 0.00068632;
  document.F1.my1FormRA2.value = 0.00068654;
  document.F1.my1FormP.value = 0.00017302;
  document.F1.my1FormM2.value = 344378;
  document.F1.my1FormM1.value = 5.972e+24;
  document.F1.my1FormOMG.value = 265.7403;
  document.F1.my1FormINC.value = 51.6411;
  document.F1.my1FormOmg.value = 91.5236;
  document.F1.my1FormTT0.value = 44.156034388347386;
  document.F1.my1FormLTT0.value = 268.6108;
  document.F1.SPD.value = 0.001;
  document.F1.ZOM.value = 0.00003;
  onAPP();
}

function mySwingby() {
  onCLS();
  var radioList = document.getElementsByName("PUTSEL");
  radioList[0].checked = true;
  radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 3.2;
  document.F1.my1FormE.value = 0.0485;
  document.F1.my1FormRA1.value = 4.952;
  document.F1.my1FormRA2.value = 5.455;
  document.F1.my1FormP.value = 11.862;
  document.F1.my1FormM2.value = 1.8986e+27;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  document.F1.myFormTIME.value = 0;
  document.F1.SPD.value = 7;
  document.F1.ZOM.value = 4;
  dat = new Date(0);
  onAPP();
  radioList = document.getElementsByName("PUTSEL");
  radioList[1].checked = true;
  radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.8;
  document.F1.my1FormRA1.value = 0.6094170881429025;
  document.F1.my1FormRA2.value = 5.484753793286129;
  document.F1.my1FormP.value = 5.32;
  document.F1.my1FormM2.value = 1;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  onAPP();
}

function onTCLC(){
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var a = new Date(document.F2.T1.value, document.F2.T2.value - 1, document.F2.T3.value, document.F2.T4.value, document.F2.T5.value, document.F2.T6.value)
  var b = a.getTime() / msecPerDay / 365.2425;
  var c = a.getTime() / 1000.0;
  document.F2.T11.value = b;
  document.F2.T12.value = c;
}

function onNow(){
  var dt = new Date();
  var year = dt.getFullYear();
  var month = dt.getMonth()+1;
  var day = dt.getDate();
  var hour = dt.getHours();
  var minute = dt.getMinutes();
  var second = dt.getSeconds();
  document.F2.T1.value = year;
  document.F2.T2.value = month;
  document.F2.T3.value = day;
  document.F2.T4.value = hour;
  document.F2.T5.value = minute;
  document.F2.T6.value = second;
  onTCLC();
}
