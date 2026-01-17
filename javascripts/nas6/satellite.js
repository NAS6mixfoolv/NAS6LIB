var TMan = new N6LTimerMan();  //タイマーマネージャー
var TimerID = -1;
var IDTransA = new Array('sph00a', 'sph01a', 'sph02a', 'sph03a', 'sph04a', 'sph05a', 'sph06a', 'sph07a', 'sph08a', 'sph09a', 'sph10a');
var IDTransZ = new Array('sph00z', 'sph01z', 'sph02z', 'sph03z', 'sph04z', 'sph05z', 'sph06z', 'sph07z', 'sph08z', 'sph09z', 'sph10z');
var IDText = new Array('sph00t', 'sph01t', 'sph02t', 'sph03t', 'sph04t', 'sph05t', 'sph06t', 'sph07t', 'sph08t', 'sph09t', 'sph10t');
var IDT = new Array('ln00t', 'ln01t', 'ln02t', 'ln03t', 'ln04t', 'ln05t', 'ln06t', 'ln07t', 'ln08t', 'ln09t', 'ln10t');
var IDL = new Array('ln00l', 'ln01l', 'ln02l', 'ln03l', 'ln04l', 'ln05l', 'ln06l', 'ln07l', 'ln08l', 'ln09l', 'ln10l');

var x3domRuntime;

var planetnum = 11;

var bEXIT = false;
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
var intvl = 40;
var bAPHE = false;
var sVDT = null;
var bankperiPos = [];

var PeriAPCs = [];
var ApheAPCs = [];
var PowPeriAPCs = [];
var PowApheAPCs = [];
var VariableRateDef = 10;
var VariableRate = 10;
var bent = false;
var StDate = null;
var bit = false;

var logcheck = false;

var CNST_AU = 1.49597870700e+11;

var planet = new Array();
for(dt = 0; dt < planetnum; dt++) planet[dt] = new N6LPlanet();
dt = 0;
var mpadj = new Array();
var mp = new Array();
var rk = new N6LRngKt();

var certification = 'NAS6OrbitData'; //ファイル認証


jQuery(document).ready(function(){

  jQuery("#export").click(function(){
    var id = "download";
    if((!planet) || (planet[1].typename !== "N6LPlanet")) return;
    var target = planet[1];
    var targetO = planet[0];
    var ov = addlog2();
    ov = commentOutOverview(ov);
    var peri = getperilog();
    peri = commentOutOverview(peri);

    // プロパティ部分の再構築
    var orbitCsvProperty = "# NAS6 Orbit Data Report\n";
    var radioList = document.getElementsByName("CALCMODE");
    if(radioList[0].checked) {
        orbitCsvProperty = orbitCsvProperty + "# 相対論モード\n";
    }
    else {
        orbitCsvProperty = orbitCsvProperty + "# 古典論モード\n";
    }
        orbitCsvProperty = orbitCsvProperty + "# MaxLogLine: " + MaxCsvLogLine + "\n" +
        "# Name: " + target.m_pname + "\n" + 
        "# [Simulation Overview]\n" + 
        ov + "\n" +
        "# [Simulation Settings]\n" +
        // 計算のステップ幅（deltaT）を秒単位で記録
        "# DeltaT: " + dt + " [sec]\n" +
        "# [Central Body Properties]\n" +
        "# Central_Mass(M): " + targetO.m_m + " [kg]\n" + // 重力源の質量を取得
        "# [Relativistic Parameters]\n" +
        "# G: " + target.CNST_G + ", C: " + target.CNST_C + "[m/s]\n" +
        "# [Theory Values]\n" +
        "# rs[m] = 2GM/c^2: " + (2 * target.CNST_G * targetO.m_m / target.CNST_C / target.CNST_C) + "[m]\n" +
        // 1周期あたりの近星点移動角 (rad/rev)
        "# dphi[rad/rev] = (6πG(M+m))/(c^2a(1-e^2)): " + ((6 * Math.PI * target.CNST_G * (targetO.m_m + target.m_m)) / 
                         (Math.pow(target.CNST_C, 2) * (target.m_a * target.CNST_AU) * (1 - Math.pow(target.m_e, 2)))) + "[rad/rev]\n" +
        "# [Orbital Elements]\n" +
        "# a: " + target.m_a + "[AU], e: " + target.m_e + ", P: " + target.m_t + "[year]\n" +
        // m_l0は角度なので数値として出力、基準日は別途記載
        "# L0(deg): " + target.m_l0 + "[deg]\n" + 
        "# Base_nday: " + target.m_nday + "[days] (from 1996/1/1)\n" +
　　　　"# perihelion: " + target.m_ra + "[AU], aphelion: " + target.m_rb + "[AU]\n" + 
　　　　"# s: " + target.m_s + "[deg], i: " + target.m_i + "[deg], w: " + target.m_w + "[deg]\n" + 
　　　　"# Mass(m): " + target.m_m + "[kg]\n" + 
        "# --------------------------------------------------\n" +
        "# ###      Gravitational simulation results      ###\n" +
        "# --------------------------------------------------\n" +
        "DateTime,TimeMS,PosX,PosY,PosZ,VelX,VelY,VelZ,R[AU],V[c/s],E[J]\n" +
        "# --------------------------------------------------\n" +
        orbitCsvContent +
        "# --------------------------------------------------\n" +
        "# ###             extreme value log              ###\n" +
        "# --------------------------------------------------\n" +
        "# [DateTime] on extreme name(id,R,bHomo,ArrayLength,PosX,PosY,PosZ); occurred!\n" +
        "# --------------------------------------------------\n" +
        peri + "\n";

    var content = orbitCsvProperty;
    var blob = new Blob([ content ], { "type" : "text/plain" });
    // ブラウザ互換性のためのURL生成
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    
    jQuery("#" + id).attr("href", url);
    // certification変数が定義されている前提
    jQuery("#" + id).attr("download", certification + "_" + target.m_pname + ".csv");
  });

// --- ここでURLパラメータを読み取る ---
  var urlParams = new URLSearchParams(window.location.search);
  var logcheck = urlParams.get('logcheck') === 'true';
  // 1. まず要素が存在するか確認
  var checkList = document.getElementsByName("calcPeri");
  
  if(logcheck && checkList.length > 0){
    // 2. チェックを入れる
    checkList[0].checked = true;
    
    // 3. 【重要】もし onClick や onChange イベントに連動して 
    //    内部変数が変わる仕組みなら、手動でイベントを発火させる
    if (typeof checkList[0].onclick == "function") {
        checkList[0].onclick();
    }
  }

  onNow();
  var a = eval(document.F2.T11.value);
  var b = eval(document.F2.T12.value) * 1000.0;
  dat = new Date(b);
  document.F1.myFormTIME.value = a;
  init(0);
  myMercury();
  TimerID = TMan.add();
  TMan.timer[TimerID].setalerm(function() { GLoop(TimerID); }, intvl);}
);



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
    if(TMan.interval != intvl) TMan.changeinterval(intvl);
  }

// --- 修正ポイント：二重予約を物理的に防ぐ ---
  
  // 1. このタイマーに既にセットされているアラーム（予約）を一度クリアする
  // (N6LTimer側で alerm = -1 にすることで TMUpdate での実行を阻止する)
  TMan.timer[id].alerm = -1; 

  // 2. 新しく「唯一の予約」を入れる
  TMan.timer[id].setalerm(function() { GLoop(id); }, intvl);
}

function mySet1(){
     document.F1.my1FormANM.value = my1ANM;
     document.F1.my1FormNM.value = my1NM;
     document.F1.my1FormT0.value = my1T0 / my1AU3;
     document.F1.my1FormE.value = my1E;
     document.F1.my1FormRA1.value = my1RA1 / my1AU;
     document.F1.my1FormRA2.value = my1RA2 / my1AU;
     document.F1.my1FormP.value = my1P / my1AU3;
     document.F1.my1FormM2.value = my1M2;
     document.F1.my1FormM1.value = my1M1;
     document.F1.my1FormTT0.value = my1TT0 / my1AU3;
     var id = getSatId();
     planet[id].m_dat0 = new Date(my1TT0 / my1AU3 * 1000);
     document.F1.my12FormANM.value = my1ANM;
     document.F1.my12FormNM.value = my1NM;
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
 
function myCalc1(flg = false){
     my1DR = 0.017453292519943;
     my1AU = 1.49597870700e+11;
     my1AU3 = 60.0 * 60.0 * 24.0 * 365.2425;
     my1AU2 = 2.0 * Math.PI * my1AU / my1AU3;
     radioList = document.getElementsByName("calc1");
     radioList2 = document.getElementsByName("deg");
     checkList = document.getElementsByName("calc2");
     if(flg){
               my1TT0 = eval(document.F1.my1FormTT0.value) * my1AU3;
               my1T0 = eval(document.F1.my1FormT0.value) * my1AU3;
               my1OMG = eval(document.F1.my1FormOMG.value);
               my1INC = eval(document.F1.my1FormINC.value);
               my1Omg = eval(document.F1.my1FormOmg.value);
               my1LTT0 = eval(document.F1.my1FormLTT0.value);
               my1ANM = String(document.F1.my1FormANM.value);
               my1NM = String(document.F1.my1FormNM.value);
               my1E = eval(document.F1.my1FormE.value);
               my1RA1 = eval(document.F1.my1FormRA1.value) * my1AU;
               my1RA2 = eval(document.F1.my1FormRA2.value) * my1AU;
               my1P = eval(document.F1.my1FormP.value) * my1AU3;
               my1M2 = eval(document.F1.my1FormM2.value);
               my1M1 = eval(document.F1.my1FormM1.value);
               my1A1 = Math.pow(my1G * (my1M1 + my1M2) * (my1P / (2.0 * Math.PI)) * (my1P / (2.0 * Math.PI)),1/3);
               planet[0].m_pname = my1ANM;
               var id = getSatId();
               planet[id].m_pname = my1NM;
               my1Vst = (1.0 / 2.0) * Math.sqrt(my1RA1 * my1RA2) * (my1RA1 + my1RA2) / my1P;
               my1VA1 = (my1Vst / my1RA1) * 2.0 * Math.PI;
               my1VA2 = (my1Vst / my1RA2) * 2.0 * Math.PI;
               my1E = (my1RA2 - my1A1) / my1A1;       
               return;
     }
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
               my1ANM = String(document.F1.my1FormANM.value);
               my1NM = String(document.F1.my1FormNM.value);
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
               my1ANM = String(document.F1.my1FormANM.value);
               my1NM = String(document.F1.my1FormNM.value);
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
               my1ANM = String(document.F1.my12FormANM.value);
               my1NM = String(document.F1.my12FormNM.value);
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
               my1ANM = String(document.F1.my12FormANM.value);
               my1NM = String(document.F1.my12FormNM.value);
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
     planet[0].m_pname = my1ANM;
     var id = getSatId();
     planet[id].m_pname = my1NM;
     my1Vst = (1.0 / 2.0) * Math.sqrt(my1RA1 * my1RA2) * (my1RA1 + my1RA2) / my1P;
     my1VA1 = (my1Vst / my1RA1) * 2.0 * Math.PI;
     my1VA2 = (my1Vst / my1RA2) * 2.0 * Math.PI;
     my1E = (my1RA2 - my1A1) / my1A1;       
     mySet1(); 
}

function mySetMP(id, flg = false) {
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
  var pname1 = ""
  var pname0 = "";
  if(planet[id].m_pname) pname0 = planet[id].m_pname;
  if(planet[0].m_pname) pname1 = planet[0].m_pname;

  if(flg){
    planet[0] = new N6LPlanet();
    planet[0].Create(0, pname1, 0, dat0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m1, 0, 1.0);
    mp[0] = new N6LMassPoint(planet[0].x0, planet[0].v0, m1, 0, 1.0);
    planet[id] = new N6LPlanet();
    var rm = ra * my1AU;
    var x0 = new N6LVector([rm, 0, 0]);
    var ccc = 299792458;
    var absv0 = Math.sqrt(1.0000000000001 * my1G * m1 / rm) / ccc;
    if(1.0 <= absv0) absv0 = 0.999999;
    var v0 = new N6LVector([0,absv0,0]);
    planet[id].Create(PlanetNo, pname0, 0, dat0, a, e, m0, npd, ra, rb, p, ss, ii, ww, m, r, mv);
    planet[id].m_pno = PlanetNo;              //planet no.//惑星番号
    planet[id].m_pname = pname0;          //planet name//惑星名前
    planet[id].m_dat0 = dat0;            //datetime//日時
    planet[id].m_a = a;                 //semi-major axis//軌道長半径
    planet[id].m_e = e;                 //eccentricity//離心率
    planet[id].m_l0 = m0;               //epoch//元期
    planet[id].m_nperday = npd;     //mean motion//１日の角度
    planet[id].m_ra = ra;               //perihelion//近日点
    planet[id].m_rb = rb;               //aphelion//遠日点
    planet[id].m_t = p;                 //orbital period//公転周期
    planet[id].m_s = ss;                //longitude of the ascending node//昇交点黄経
    planet[id].m_i = ii;                 //orbital inclination//軌道傾斜
    planet[id].m_w = ww;                 //perihelion celestial longitude//近日点黄経
    planet[id].m_m = m;                 //mass//惑星質量
    planet[id].m_r = r;                 //radius//惑星半径
    planet[id].m_mv = mv;               //velocity rate//速度倍率
    mp[id] = new N6LMassPoint(x0, v0, m, r, e);
    return;
  }


  if(0 < m) { 
    planet[0] = new N6LPlanet();
    planet[0].Create(0, pname1, 0, dat0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, m1, 0, 1.0);
    mp[0] = new N6LMassPoint(planet[0].x0, planet[0].v0, m1, 0, 1.0);
    planet[id] = new N6LPlanet();
    planet[id].Create(PlanetNo, pname0, 0, dat0, a, e, m0, npd, ra, rb, p, ss, ii, ww, m, r, mv);
    mp[id] = new N6LMassPoint(planet[id].x0, planet[id].v0, m, r, e);
  }
}

function onAPHE() {
var checkList = document.getElementsByName("calcPeri");
if(checkList[0].checked){
    var checkList2 = document.getElementsByName("VDT");
    if(checkList2[0].checked){
      sVDT = true;
      checkList2[0].checked = false;
      if (typeof checkList[0].onclick == "function") {
        checkList2[0].onclick();
      }
    }
    else sVDT = false;
    bAPHE = true;
    onRUN();
}
}


function onZAP() {
  Speed = eval(document.F1.SPD.value);
  Zoom = eval(document.F1.ZOM.value);
  rk.SpdRate = Speed;
  setmp();
  setline();

}


function onLOOK() {
//  document.F1.SPD.value = document.F1.my1FormP.value * 2;
  BankSpd = document.F1.my1FormP.value * 2;
  document.F1.ZOM.value = document.F1.my1FormRA2.value / 2;
}

function onPOS() {
  bRunning = !bRunning;
  bAPHE = false;
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
    document.F1.my1FormANM.value = planet[0].m_pname;
    document.F1.my1FormNM.value = planet[id].m_pname;
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
    planet[id].m_pname = "";
    var bbb = false;
    var iii;
    for(iii = 0; iii < planetnum; iii++){
      if(mp[iii].mass){bbb = true; break;}
      if(bbb){
        planet[0].m_pname = "";
        document.F1.my1FormANM.value = "";
        document.F1.my12FormANM.value = "";
      }
    }
    document.F1.my1FormNM.value = "";
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
    document.F1.my12FormNM.value = "";
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

function getSatId() {
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
  return id;
}


function onAPP(flg = false) {
  bRunning = false;
  bit = flg;
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
  myCalc1(flg);
  if(((n == 2 && id2 != id) || 2 < n) && (0 < planet[0].m_m && planet[0].m_m != my1M1)) {
    onDEL();
  }
  else {
    mySetMP(id, flg); 
    init(1);
  }
}

function onSTP() {
  bRunning = false;
  bAPHE = false;
  //init(1, false);
}

function onREV() {
  bRunning = true;
  Speed = Number(document.F1.SPD.value) * -1;
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    rk.SpdRate = Speed;
  }
  else {
    rk.SpdRate = Speed * BankSpd;
  }
  init(-1);
}

function onRUN() {
  bRunning = true;
  Speed = Number(document.F1.SPD.value);
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    rk.SpdRate = Speed;
  }
  else {
    rk.SpdRate = Speed * BankSpd;
  }
  init(1);
}

function init(b, bb = true, bbb = false) {
  Speed = Number(document.F1.SPD.value);
  if(b < 0) Speed *= -1;
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    rk.SpdRate = Speed;
  }
  else {
    rk.SpdRate = Speed * BankSpd;
  }
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
  var radioList = document.getElementsByName("PUTSEL");
  var v = new N6LVector(3);
  if(b) { ; }
  else {
    for(i = 0; i < planetnum; i++) mp[i] = new N6LMassPoint(v.ZeroVec(), v.ZeroVec(), -1, -1, -1);
    for(i = 0; i < planetnum - 1; i++) {
      radioList[i].checked = true;
      onDEL();
    }
    radioList[0].checked = true;
  }

  if(bb) clearLog();

  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var days = eval(document.F1.myFormTIME.value) * 365.2425;
  dat = new Date(days * msecPerDay);

  setmp();
  setline();
  InitRelative(true);
  setmp();
  setline();

  if(bbb) return;
  var id;
  for(id = 0; id < planet.length; id++){
    var idt = document.getElementById(IDText[id]);
    var pname0 = "";
    if(planet[id].m_pname) pname0 = planet[id].m_pname;
    idt.setAttribute('string', pname0);
  }
}

function onRunning() {
  //メインループ
  UpdateFrameRelative();
}

function InitRelative(b = false) {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var days = eval(document.F1.myFormTIME.value) * 365.2425;
  dat = new Date(days * msecPerDay);
  if((b === false)&&(rk.epoch)) {
      time = rk.epoch.getTime() / 1000 + rk.time;
      dat = new Date(time * 1000);
  } else {
      time = dat.getTime() / 1000;
  }
if(!bit){
  PlanetInit(dat);
  setline();
}
  dt = 60 * 60;
  var pmp = new Array();
  var i;
  for(i = 0; i < planetnum; i++) pmp[i] = new N6LMassPoint(mp[i]);
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    var checkList2 = document.getElementsByName("VDT");
    if(checkList2[0].checked){
      rk.Init(pmp, 1, planet, dat, Speed, true, true);
    }
    else{
      rk.Init(pmp, dt, planet, dat, Speed * BankSpd, true, false);
    }
  }
  else {
    rk.Init(pmp, dt, planet, dat, Speed * BankSpd, false, false);
  }

  settime();
  VariableRate = VariableRateDef / planet[1].m_t;
}

function UpdateFrameRelative() {
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;

  var tm = Math.abs(Math.abs(rk.dt) * Math.abs(rk.SpdRate)) * msecPerDay / 1000;
  var sdt = rk.dt * rk.SpdRate * msecPerHour / 1000;
  var adt = Math.abs(sdt);
  var t;
  var i;
  if(dt != 0.0) {
    for(t = adt; t <= tm; t += adt) {
      if(bEXIT){bEXIT = false; break;}
      time = time + sdt; // Accumulate the total elapsed time
      //質点アップデート
      rk.UpdateFrame()

      //太陽原点補正
      for(i = 1; i < planetnum; i++) {
        rk.mp[i].x = rk.mp[i].x.Sub(rk.mp[0].x);
        mp[i].x = new N6LVector(rk.mp[i].x);
      }
      rk.mp[0].x = rk.mp[0].x.ZeroVec();
    }

    if (rk.epoch) {
      time = rk.epoch.getTime() / 1000 + rk.time;
    } else {
      time = rk.time; 
    }

    setmp();
    settime();
    drawCnvsPeri();
  } 
}

function settime(rtime = null) {
  if(rtime) time = rtime;
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var days = time / msecPerDay * 1000;
  document.F1.myFormTIME.value = days / 365.2425;

  dat = new Date(time * 1000);
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
      var vvA = new Array(new N6LVector(3));
      planet[i].m_nday = nday;
      var f = planet[i].kepler(nday, xx, vvA);
      planet[i].x0 = new N6LVector(3);
      planet[i].x0.x[0] = xx[0].x[0];
      planet[i].x0.x[1] = xx[0].x[1];
      planet[i].x0.x[2] = 0.0;
      planet[i].v0 = new N6LVector(3);
      planet[i].v0.x[0] = vvA[0].x[0];
      planet[i].v0.x[1] = vvA[0].x[1];
      planet[i].v0.x[2] = 0.0;


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

      var xyz2 = new Array(new N6LVector(3));
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
      var vvA = new Array(new N6LVector(3));
      var f = planet[i].kepler(nday, xx, vvA);
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
    var elm;
    var sp;

    elm = document.getElementById(IDL[i]);
    elm.setAttribute('lineSegments', new String(str));

    elm = document.getElementById(IDT[i]);
    sp = VecWK.ToX3DOM();
    elm.setAttribute('rotation', sp.toString());
  }
}

var BankSpd = 1;


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
  var id = getSatId();
  if(id === 1) BankSpd = 1;
  document.F1.ZOM.value = 0.2;
  document.F2.THEO.value = 43.11;
  planet[id].m_pname = "Mercury";
  document.F1.my1FormNM.value = "Mercury";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 2;
  document.F1.ZOM.value = 0.5;
  document.F2.THEO.value = 8.62;
  planet[id].m_pname = "Venus";
  document.F1.my1FormNM.value = "Venus";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 2;
  document.F1.ZOM.value = 1;
  document.F2.THEO.value = 3.84;
  planet[id].m_pname = "Earth";
  document.F1.my1FormNM.value = "Earth";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 3;
  document.F1.ZOM.value = 1;
  document.F2.THEO.value = 1.35;
  planet[id].m_pname = "Mars";
  document.F1.my1FormNM.value = "Mars";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 10;
  document.F1.ZOM.value = 2.5;
  document.F2.THEO.value = 0.06;
  planet[id].m_pname = "Jupiter";
  document.F1.my1FormNM.value = "Jupiter";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 20;
  document.F1.ZOM.value = 5;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Saturn";
  document.F1.my1FormNM.value = "Saturn";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 40;
  document.F1.ZOM.value = 10;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Uranus";
  document.F1.my1FormNM.value = "Uranus";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 60;
  document.F1.ZOM.value = 15;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Neptune";
  document.F1.my1FormNM.value = "Neptune";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 90;
  document.F1.ZOM.value = 20;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Pluto";
  document.F1.my1FormNM.value = "Pluto";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 5;
  document.F1.ZOM.value = 1.5;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Ceres";
  document.F1.my1FormNM.value = "Ceres";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 5;
  document.F1.ZOM.value = 1.5;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Pallas";
  document.F1.my1FormNM.value = "Pallas";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 5;
  document.F1.ZOM.value = 1.5;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Juno";
  document.F1.my1FormNM.value = "Juno";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 5;
  document.F1.ZOM.value = 1.5;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Vesta";
  document.F1.my1FormNM.value = "Vesta";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  var id = getSatId();
  if(id === 1) BankSpd = 40;
  document.F1.ZOM.value = 9;
  document.F2.THEO.value = 0.01;
  planet[id].m_pname = "Chiron";
  document.F1.my1FormNM.value = "Chiron";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
  onAPP();
}

function myHalley(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.9671;
  document.F1.my1FormRA1.value = 0.586;
  document.F1.my1FormRA2.value = 35.08;
  document.F1.my1FormP.value = 75.32;
  document.F1.my1FormM2.value = 2.2E+14;
  document.F1.my1FormM1.value = 1.9891e+30;
  document.F1.my1FormOMG.value = 58.42;
  document.F1.my1FormINC.value = 162.26;
  document.F1.my1FormOmg.value = 111.33;
  document.F1.my1FormTT0.value = 24.129174452589716;
  document.F1.my1FormLTT0.value = 38.38;
  var id = getSatId();
  if(id === 1) BankSpd = 60;
  document.F1.ZOM.value = 15;
  document.F2.THEO.value = 1.958;
  planet[id].m_pname = "Halley";
  document.F1.my1FormNM.value = "Halley";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
  onAPP();
}

function mySolar(){
  onCLS();
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  radioList = document.getElementsByName("PUTSEL");
  radioList[1].checked = true;
  myVenus();
  radioList[2].checked = true;
  myEarth();
  radioList[3].checked = true;
  myMars();
  radioList[4].checked = true;
  myJupiter();
  radioList[5].checked = true;
  mySaturn();
  radioList[6].checked = true;
  myUranus();
  radioList[7].checked = true;
  myNeptune();
  radioList[8].checked = true;
  myPluto();
  radioList[0].checked = true;
  myMercury();
  document.F1.ZOM.value = 1;
  onZAP();
}

function myPSRB1913A(){
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
  var id = getSatId();
  if(id === 1) BankSpd = 0.001;
  document.F1.ZOM.value = 0.01;
  document.F2.THEO.value = 1519200;
  planet[id].m_pname = "PSRB1913+16";
  document.F1.my1FormNM.value = "PSRB1913+16";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myPSRB1913B(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.6171;
  document.F1.my1FormRA1.value = 0.006;
  document.F1.my1FormRA2.value = 0.025;
  document.F1.my1FormP.value = 0.00088;
  document.F1.my1FormM2.value = 2.76e+30;
  document.F1.my1FormM1.value = 2.86e+30;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 47.2;
  document.F1.my1FormOmg.value = 226.57;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.001;
  document.F1.ZOM.value = 0.01;
  document.F2.THEO.value = 1519200;
  planet[id].m_pname = "PSRB1913B";
  document.F1.my1FormNM.value = "PSRB1913B";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myPSRJ0737A(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.087777;
  document.F1.my1FormRA1.value = 0.0026738348;
//  document.F1.my1FormRA1.value = 0.03155140335628578
  document.F1.my1FormRA2.value = 0.0026738348;
//  document.F1.my1FormRA2.value = 0.037623356228346;
  document.F1.my1FormP.value = 0.000085978196;
//  document.F1.my1FormP.value = 0.004;
  document.F1.my1FormM2.value = 2.486375e+30;
  document.F1.my1FormM1.value = 2.6594267e+30;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.0001;
  document.F1.ZOM.value = 0.0025;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "PSRJ0737-3039";
  document.F1.my1FormNM.value = "PSRJ0737-3039";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myPSRJ0737B(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.0088;
  document.F1.my1FormRA1.value = 0.005;
  //document.F1.my1FormRA1.value = 0.03429233179744513
  document.F1.my1FormRA2.value = 0.007;
  //document.F1.my1FormRA2.value = 0.034901235186907444;
  document.F1.my1FormP.value = 0.00028;
  //document.F1.my1FormP.value = 0.004;
  document.F1.my1FormM2.value = 2.49e+30;
  document.F1.my1FormM1.value = 2.66e+30;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 88.7;
  document.F1.my1FormOmg.value = 73.8;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.0001;
  document.F1.ZOM.value = 0.0025;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "PSRJ0737B";
  document.F1.my1FormNM.value = "PSRJ0737B";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function mySgrAStar(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.884;
  document.F1.my1FormRA1.value = 120;
  document.F1.my1FormRA2.value = 1920;
  document.F1.my1FormP.value = 16.05;
  document.F1.my1FormM2.value = 2.8e+31;
  document.F1.my1FormM1.value = 8.2e+36;
  document.F1.my1FormOMG.value = 228;
  document.F1.my1FormINC.value = 134;
  document.F1.my1FormOmg.value = 66;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 10;
  document.F1.ZOM.value = 500;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "SgrAStar";
  document.F1.my1FormNM.value = "SgrAStar";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myBHPrimaryA(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.1;
  document.F1.my1FormRA1.value = 0.00009;
  document.F1.my1FormRA2.value = 0.00011;
  document.F1.my1FormP.value = 0.000002;
  document.F1.my1FormM2.value = 5.9e+31;
  document.F1.my1FormM1.value = 7.1e+31;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.00001;
  document.F1.ZOM.value = 0.0003;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "BHPrimaryA";
  document.F1.my1FormNM.value = "BHPrimaryA";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myBHPrimaryB(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.1;
  document.F1.my1FormRA1.value = 0.007809387028322582;
  document.F1.my1FormRA2.value = 0.009544806367949821;
  document.F1.my1FormP.value = 0.0001;
  document.F1.my1FormM2.value = 5.9e+31;
  document.F1.my1FormM1.value = 7.1e+31;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.0001;
  document.F1.ZOM.value = 0.005;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "BHPrimaryB";
  document.F1.my1FormNM.value = "BHPrimaryB";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myBHPrimaryC(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.1;
  document.F1.my1FormRA1.value = 0.0014499185451209032;
  document.F1.my1FormRA2.value = 0.0017721226662588813;
  document.F1.my1FormP.value = 0.000008;
  document.F1.my1FormM2.value = 5.9e+31;
  document.F1.my1FormM1.value = 7.1e+31;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.00001;
  document.F1.ZOM.value = 0.0008;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "BHPrimaryC";
  document.F1.my1FormNM.value = "BHPrimaryC";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myBHPrimaryD(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.1;
  document.F1.my1FormRA1.value = 0.0013264238028072798;
  document.F1.my1FormRA2.value = 0.0016211846478755647;
  document.F1.my1FormP.value = 0.000007;
  document.F1.my1FormM2.value = 5.9e+31;
  document.F1.my1FormM1.value = 7.1e+31;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.00001;
  document.F1.ZOM.value = 0.0008;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "BHPrimaryD";
  document.F1.my1FormNM.value = "BHPrimaryD";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  onAPP();
}

function myOrbitHartMark(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.1;
  document.F1.my1FormRA1.value = 0.0013264238028072798;
  document.F1.my1FormRA2.value = 0.0016211846478755647;
  document.F1.my1FormP.value = 0.000007;
  document.F1.my1FormM2.value = 5.9e+31;
  document.F1.my1FormM1.value = 7.1e+31;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  var id = getSatId();
  if(id === 1) BankSpd = 0.000033;
  document.F1.ZOM.value = 0.0015;
  document.F2.THEO.value = 608400;
  planet[id].m_pname = "OrbitHartMark";
  document.F1.my1FormNM.value = "OrbitHartMark";
  planet[0].m_pname = "Attractor";
  document.F1.my1FormANM.value = "Attractor";
  var checkList2 = document.getElementsByName("VDT");
  checkList2[0].checked = false;
  if (typeof checkList2[0].onclick == "function") {
      checkList2[0].onclick();
  }
//  onAPP(true);
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
  var id = getSatId();
  if(id === 1) BankSpd = 0.001;
  document.F1.ZOM.value = 0.00003;
  document.F2.THEO.value = 25000;
  planet[id].m_pname = "ISS";
  document.F1.my1FormNM.value = "ISS";
  planet[0].m_pname = "Earth";
  document.F1.my1FormANM.value = "Earth";
  onAPP();
}

function myVirtualEarth(){
  var radioList = document.getElementsByName("calc1");
  radioList[0].checked = true;
  radioList = document.getElementsByName("deg");
  radioList[0].checked = true;
  document.F1.my1FormT0.value = 0;
  document.F1.my1FormE.value = 0.6;
  document.F1.my1FormRA1.value = 685.151549927381;
  document.F1.my1FormRA2.value = 2740.606199709524;
  document.F1.my1FormP.value = 1.0;
  document.F1.my1FormM2.value = 5.9736e+24;
  document.F1.my1FormM1.value = 1e+40;
  document.F1.my1FormOMG.value = 174.345189;
  document.F1.my1FormINC.value = 0.003836;
  document.F1.my1FormOmg.value = 287.825581;
  document.F1.my1FormTT0.value = 26.49764538385719;
  document.F1.my1FormLTT0.value = 176.453;
  var id = getSatId();
  if(id === 1) BankSpd = 0.4;
  document.F1.SPD.value = 10;
  document.F1.ZOM.value = 1370;
  document.F2.THEO.value = 3.84;
  planet[id].m_pname = "VirtualEarth";
  document.F1.my1FormNM.value = "VirtualEarth";
  planet[0].m_pname = "VirtualSun";
  document.F1.my1FormANM.value = "VirtualSun";
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
//  document.F1.my1FormOMG.value = 30.3;
  document.F1.my1FormOMG.value = 0;
  document.F1.my1FormINC.value = 0;
  document.F1.my1FormOmg.value = 0;
  document.F1.my1FormTT0.value = 0;
  document.F1.my1FormLTT0.value = 0;
  document.F1.myFormTIME.value = 0;
  BankSpd = 7;
  document.F1.ZOM.value = 4;
  document.F2.THEO.value = 0.01;
  planet[1].m_pname = "Jupiter";
  document.F1.my1FormNM.value = "Jupiter";
  planet[0].m_pname = "Sun";
  document.F1.my1FormANM.value = "Sun";
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
  planet[2].m_pname = "object";
  document.F1.my1FormNM.value = "object";
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

function onNow(rdt = null){
  var dt = new Date();
  if(rdt) dt = rdt;
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


//[2026/11/12 17:52:40] onPerihelion(1, 45976236901.762596, false,3,10011654695.969667,44789362427.724174,2739537719.0180736); occurred!
var PeriSumDelta = 0, ApheSumDelta = 0, PeriSumDeltaRad = 0, ApheSumDeltaRad = 0, PeriCurrent = 0, ApheCurrent = 0, FstPeriTheta = 0, FstApheTheta = 0, PeriNum = 0, ApheNum = 0;
//var IdleLaps = 50, bcalc = true, SumLaps = 0;//スライドあり
var IdleLaps = 50, bcalc = false, SumLaps = 0;//スライドなし
var FstPeriPos = null, FstAphePos = null, FstSidePos = null, bInit = 0;
var vx = null, vy = null, vz = null;
//var nextLogTime = null, lastPos = null, lastTime = null;
var theory = 0, theoryrad = 0;
var nextLogTime = null, lastPos = null, lastVel = null, lastTimeMS = null;
var MaxCsvLogLine = 0;
var orbitCsvContent = "";
var lap = 0, PeriAve = 0, ApheAve = 0, PeriAveRad = 0, ApheAveRad = 0, targettheta = null;

function OrbitElementCalc(q, t, m1, m2){
// t (年) を秒に変換
  var t_sec = t * 365.2425 * 24 * 3600;
  
  // a^3 = (G * (m1 + m2) * t_sec^2) / (4 * PI^2)
  var a_meter = Math.cbrt((rk.CNST_G * (m1 + m2) * Math.pow(t_sec, 2)) / (4 * Math.pow(Math.PI, 2)));
  
  // メートルを AU に変換
  var a = a_meter / rk.CNST_AU;
  var e = 1 - (q / a);
  
  return {a : a, e : e};
}

function Average(dataArray) {
  if(dataArray.length < 1) return 0;
  var ret = 0;
  var i;
  for(i = 0; i < dataArray.length; i++){
    ret += dataArray[i];
  }
  return (ret / dataArray.length);
}

// 例：外れ値を除外して平均を出す関数
function getRobustAverage(dataArray) {
    // 1. NaN や undefined を計算対象から完全に除外する
    let cleanData = dataArray.filter(x => typeof x === 'number' && !isNaN(x));

    // データが空になった場合のガード
    if (cleanData.length === 0) return 0;

    // 2. 基本平均の計算
    let avg = cleanData.reduce((a, b) => a + b, 0) / cleanData.length;
    
    // データが少ない場合は、外れ値除去をせずに返す
    if (cleanData.length < 8) return avg;

    // 3. 標準偏差の計算
    let variance = cleanData.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / cleanData.length;
    let stdDev = Math.sqrt(variance);

    // 全データが同じ値（stdDev=0）なら、そのまま平均を返す
    if (stdDev === 0) return avg;

    // 4. 2σ（シグマ）より外側のデータを省く（異常値除去）
    let filtered = cleanData.filter(x => Math.abs(x - avg) < 2 * stdDev);

    // 5. フィルタ後の平均を返す（空なら元のavg）
    if (filtered.length === 0) return avg;

    return filtered.reduce((a, b) => a + b, 0) / filtered.length;
}

function clearLog() {
    PeriAPCs = [];
    ApheAPCs = [];
    PowPeriAPCs = [];
    PowApheAPCs = [];
    PeriSumDelta = 0, ApheSumDelta = 0, PeriSumDeltaRad = 0, ApheSumDeltaRad = 0, PeriCurrent = 0, ApheCurrent = 0, FstPeriTheta = 0, FstApheTheta = 0, PeriNum = 0, ApheNum = 0;
    lap = 0, PeriAve = 0, ApheAve = 0, PeriAveRad = 0, ApheAveRad = 0, targettheta = null;
    StDate = null;
    bankperiPos = [];

    //IdleLaps = 50, bcalc = true, SumLaps = 0;//スライドあり
    IdleLaps = 50, bcalc = false, SumLaps = 0;//スライドなし
    FstPeriPos = null, FstAphePos = null, FstSidePos = null, bInit = 0;
    vx = null, vy = null, vz = null;
    nextLogTime = null, lastPos = null, lastVel = null, lastTimeMS = null;
    var pt = planet[1].m_t; //公転周期[年]
    var target = planet[1];
    var targetO = planet[0];
    theoryrad = ((6 * Math.PI * target.CNST_G * (targetO.m_m + target.m_m)) / 
                         (Math.pow(target.CNST_C, 2) * (target.m_a * target.CNST_AU) * (1 - Math.pow(target.m_e, 2))))
    theory = convertToArcsecPerCentury(theoryrad, pt, 1);
    document.F2.THEO.value = theory;


// フォームから最新の制限値を取得
    MaxCsvLogLine = parseInt(document.getElementById('MAXLOGLINE').value) || 1000;
    orbitCsvContent = "";

    const logEl = document.getElementById('log-output');
    const logEl2 = document.getElementById('log-output2');
    const logEl3 = document.getElementById('log-output3');

    logEl.innerHTML = '';
    logEl2.textContent = 'Log cleared. Waiting for new data...';
    logEl3.textContent = '';
    
    console.log("ログをクリアしました。");
}

function convertToArcsecPerCentury(rad, pt, lap) {
    if ((pt === 0)||(lap <= 0)) return 0;

    // 1. ラジアンを秒角に変換
    const arcsec = rad * (180 / Math.PI) * 3600;

    // 2. 100年あたりに換算 (100[年] / pt[周期] / lap[周])
    const result = arcsec * (100 / pt / lap);

    return result;
}

function getCoordinates(logText) {
    // 括弧内の文字列を抽出
    const start = logText.indexOf('(') + 1;
    const end = logText.lastIndexOf(')');
    const csvContent = logText.substring(start, end);
    const dataArray = csvContent.split(',').map(item => item.trim());

    const x = parseFloat(dataArray[4]);
    const y = parseFloat(dataArray[5]);
    const z = parseFloat(dataArray[6]);

    return new N6LVector([x, y, z], false);
}
function NormalizeRad(th) {
  // 1. まず -2π ～ 2π の範囲に収める
  var ret = th % (Math.PI * 2.0);
  
  // 2. 0 ～ 2π の範囲に持ち上げる（負の数対策）
  if (ret < 0) ret += Math.PI * 2.0;
  
  // 3. -π ～ π の範囲に変換する
  if (ret > Math.PI) ret -= Math.PI * 2.0;
  
  return ret;
}

function addlog2(str = ""){
    var q = rk.mp[1].lastQ;
    var t = rk.mp[1].lastT;
    var m2 = rk.planet[1].m_m;
    var m1 = rk.planet[0].m_m;

    var ret = OrbitElementCalc(q, t, m1, m2);
    var a = ret.a;
    var e = ret.e;

    //abs(理論値 - 実測値) / 理論値 * 100
    var NowDate = new Date();
    var ctime = (NowDate.getTime() - StDate.getTime()) / 1000;
    var pt = planet[1].m_t; //公転周期[年]
    var dttt = lap * pt;
    str += "\n計算時間 = " + Number(ctime).toFixed(6) + " [秒]";
    str += "\ndeltaT = " + Number(rk.SpdRate * rk.dt / 60 / 60 / 24 / 365.2425).toFixed(6) + " [年] ←→ "+ Number(rk.SpdRate * rk.dt).toFixed(6) + " [秒]";
    str += "\nlaps = " + Number(lap) + " [周]";
    str += "\n計測期間 = " + Number(dttt).toFixed(6) + " [年]";
    str = str + "\n現在の角度 = " + targettheta;
    str = str + "\n基準角度(Peri) = " + FstPeriTheta;
    str = str + "\n理論値からの平均のずれ(Peri)[秒角/100年] = " + PeriAve;
    str = str + "\n理論値からの平均のずれ(Peri)[rad/rev] = " + PeriAveRad;
    str = str + "\n基準角度(Aphe) = " + FstApheTheta;
    str = str + "\n理論値からの平均のずれ(Aphe)[秒角/100年] = " + ApheAve;
    str = str + "\n理論値からの平均のずれ(Aphe)[rad/rev] = " + ApheAveRad;
//if(theory){
    // 理論値：theory (rad/rev)
    // 実測値（平均）：PeriAveRad (rad/rev)
    // 1周期あたりの近星点移動角 (rad/rev)
    //"# dphi[rad/rev] = (6πG(M+m))/(c^2a(1-e^2)): " +  + "[rad/rev]\n"
    var logperirad = [Math.log(Math.abs(theoryrad)), Math.log(Math.abs(PeriAveRad))]
    var deltaperirad = (logperirad[0] - logperirad[1]) / logperirad[0] * 100;
    var accuracyrad = (100 - deltaperirad); // 対数再現率
    str = str + "\n[近日点の進動角の評価 [rad/rev]]";
    str = str + "\n理論値 (Theory) = " + theoryrad.toExponential(6);
    str = str + "\n実測値 (Measured) = " + PeriAveRad.toExponential(6);
    str = str + "\n対数再現率 (Accuracy)[%] = " + accuracyrad.toFixed(3);
    var logperi = [Math.log(Math.abs(theory)), Math.log(Math.abs(PeriAve))]
    var deltaperi = (logperi[0] - logperi[1]) / logperi[0] * 100;
    var accuracy = (100 - deltaperi); // 対数再現率
    var delta = [((rk.planet[1].m_ra - q) / rk.planet[1].m_ra * 100), ((rk.planet[1].m_t - t) / rk.planet[1].m_t * 100), 
                 ((rk.planet[1].m_a - a) / rk.planet[1].m_a * 100), ((rk.planet[1].m_e - e) / rk.planet[1].m_e * 100)];
    var acc = [(100 - delta[0]), (100 - delta[1]), (100 - delta[2]), (100 - delta[3])]; // 再現率
    str = str + "\n[近日点の進動角の評価 [秒角/100年]]";
    str = str + "\n理論値 (Theory) = " + theory.toExponential(6);
    str = str + "\n実測値 (Measured) = " + PeriAve.toExponential(6);
    str = str + "\n対数再現率 (Accuracy)[%] = " + accuracy.toFixed(3);
    str = str + "\n[古典軌道要素の再評価]";
    str = str + "\n近日点距離理論値 [AU] = " + rk.planet[1].m_ra.toExponential(6);
    str = str + "\n近日点距離実測値 [AU] = " + q.toExponential(6);
    str = str + "\n再現率 [%] = " + acc[0].toFixed(3);
    str = str + "\n近日点周期理論値 [年] = " + rk.planet[1].m_t.toExponential(6);
    str = str + "\n近日点周期実測値 [年] = " + t.toExponential(6);
    str = str + "\n再現率 [%] = " + acc[1].toFixed(3);
    str = str + "\n軌道長半径理論値 [AU] = " + rk.planet[1].m_a.toExponential(6);
    str = str + "\n軌道長半径実測値 [AU] = " + a.toExponential(6);
    str = str + "\n再現率 [%] = " + acc[2].toFixed(3);
    str = str + "\n離心率理論値 = " + rk.planet[1].m_e.toExponential(6);
    str = str + "\n離心率実測値 = " + e.toExponential(6);
    str = str + "\n再現率 [%] = " + acc[3].toFixed(3);
//}
    return str;
}


function updateAve(posx) {
    const logEl = document.getElementById('log-output');
    const logEl2 = document.getElementById('log-output2');

    // 全体数を取得
    const totalCount = logEl.children.length;

    var targetChild = logEl.children[totalCount - 1];
    var logText = targetChild.innerText;

    // 1. カンマ分割してIDを確認
    const start = logText.indexOf('(') + 1;
    const end = logText.lastIndexOf(')');
    const csvContent = logText.substring(start, end);
    const dataArray = csvContent.split(',').map(item => item.trim());

    // IDが "1" でない場合は無視して次へ
    if (dataArray[0] !== "1") {
        return;
    }

    var pt = planet[1].m_t; //公転周期[年]
    // 2. 座標と角度を取得
    var logpos = new N6LVector([parseFloat(dataArray[4]), parseFloat(dataArray[5]), parseFloat(dataArray[6])]);

    if(vx !== null){
      targettheta = rk.calculateTheta(logpos);
    }

    //3.近日点と遠日点のふりわけ
    if(logText.includes("onPerihelion")) {
        if(bInit < 2) return;
        if(bInit === 2){
            bInit++;
            FstPeriTheta = targettheta;

        }
        if(rk.bbperi === 2){
            FstPeriTheta = rk.perith;
        }
        if(FstPeriTheta){
          PeriCurrent = NormalizeRad(targettheta - FstPeriTheta);
          PeriNum++;
          lap = PeriNum - 1;
          if(lap < 1) return;
          PeriAveRad = PeriCurrent; 
          // その「1周あたりの平均」を 100年あたりに換算する
          // convertToArcsecPerCentury(1周あたりのrad, 周期pt, 周回数1)
          PeriAve = convertToArcsecPerCentury(PeriAveRad, pt, 1);
       }
    } else {
        if(bInit < 3) return;
        if(bInit === 3){
            bInit++;
            FstApheTheta = targettheta;
        }
        if(rk.bbaphe === 2){
            FstApheTheta = rk.apheth;
        }
        if(FstApheTheta){
          ApheCurrent = NormalizeRad(targettheta - FstApheTheta);
          ApheNum++;
          lap = ApheNum - 1;
          if(lap < 1) return;
          ApheAveRad = ApheCurrent; 
          // その「1周あたりの平均」を 100年あたりに換算する
          // convertToArcsecPerCentury(1周あたりのrad, 周期pt, 周回数1)
          ApheAve = convertToArcsecPerCentury(ApheAveRad, pt, 1);
        }
    }

    if((FstPeriTheta === 0)||(FstApheTheta === 0)) return;
    if((PeriNum < 2)||(ApheNum < 2)) return;

    if(StDate === null) StDate = new Date();

    var str = "";
    str = addlog2(str);

   logEl2.textContent = str + "\n\n";
}

// 例：ログが一定数を超えたら古いものを消す処理（もし未実装であれば）
function updateLog(str, logEl, er = true) {
    const MLEl = document.getElementById('MAXLINE');
    const newLog = document.createElement('div');
    newLog.textContent = str;
    logEl.appendChild(newLog);

if(er){

    // 最大行数を超えたら古いものから削除
    while (MLEl.value < logEl.childNodes.length) {
        logEl.removeChild(logEl.firstChild);
    }

}

    // 常に最新が見えるようにスクロール
    logEl.scrollTop = logEl.scrollHeight;

}

//オーバーライドして振る舞いを変更
//近日点イベント 天体番号、距離、座標を通知
N6LRngKt.prototype.onPerihelion = function (i, lr, pos, time) {
    if(i !== 1) return;
    var checkList = document.getElementsByName("calcPeri");
    if(checkList[0].checked){
      var str = "";
      if(this.epoch){
        var datt = this.epoch.getTime(); // Get the timestamp of the base date
        var dat1t = datt + time * 1000; // Calculate the new timestamp
        var dat1 = new Date(dat1t); // Create a new Date object for the updated time
        str = "[" + dat1.toLocaleString() + "] onPerihelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!";
      }
      else {
        str = "[NoDateData] onPerihelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!";
      }
        var pos3 = new N6LVector([pos.x[0], pos.x[1], pos.x[2]]);
        if(bInit === 0) {
            bInit++;
            FstPeriPos = new N6LVector(pos3);
        }
      const logEl = document.getElementById('log-output');

      console.log(str);
      updateLog(str, logEl);
      updateAve(pos);
      checkList = document.getElementsByName("DPH");
      if(checkList[0].checked === false) return;

      // 近日点の座標（例：mp[selid] から取得したもの）
      var periPos = new x3dom.fields.SFVec3f(
          pos.x[1], 
          -pos.x[0], 
          pos.x[2]
      );
      bankperiPos.push(periPos);
  }
};
//遠日点イベント 天体番号、距離、座標を通知
N6LRngKt.prototype.onAphelion = function (i, lr, pos, time) {
    if(i !== 1) return;
    var fff = false;
    if(bAPHE) {onSTP();fff=true;}
    var dat1 = null;
    if(this.epoch){
        var datt = this.epoch.getTime(); // Get the timestamp of the base date
        var dat1t = datt + time * 1000; // Calculate the new timestamp
        dat1 = new Date(dat1t); // Create a new Date object for the updated time
    }
    var checkList = document.getElementsByName("calcPeri");
    if(checkList[0].checked){
      var str = "";
      if(dat1){
        str = "[" + dat1.toLocaleString() + "] onAphelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!";
      }
      else {
        str = "[NoDateData] onAphelion(" + i + ", " + lr + ", " + pos.Str() + "); occurred!";
      }
      var pos3 = new N6LVector([pos.x[0], pos.x[1], pos.x[2]]);
        if(bInit === 0) {
            bInit++;
            FstAphePos = new N6LVector(pos3);
      }

      const logEl = document.getElementById('log-output');

      console.log(str);
      updateLog(str, logEl);
      updateAve(pos);
    }
    if(fff) {
      if(dat1){
        onNow(dat1);
        var t = eval(document.F2.T11.value);
        settime(t * 3600 * 24 * 365.2425);
        init(1);
//        clearLog();
        bAPHE = false;
        if(sVDT) {
          var checkList2 = document.getElementsByName("VDT");
          checkList2[0].checked = true;
          if (typeof checkList2[0].onclick == "function") {
            checkList2[0].onclick();
          }
        }
        onZAP();
        window.alert("Set Aphelion");
        bEXIT = true;
    }}
};


N6LRngKt.prototype.onSide = function (i, lr, pos) {
  if(i !== 1) return;
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    var pos3 = new N6LVector([pos.x[0], pos.x[1], pos.x[2]]);
    if(bInit === 1) {
      bInit++;
      FstSidePos = new N6LVector(pos3);
      vx = new N6LVector(rk.normX);
      vy = new N6LVector(rk.normY);
      vz = new N6LVector(rk.normZ);
    }
  }
}
N6LRngKt.prototype.OnEnterPerihelion = function (i) {
return;
  if(i !== 1) return;
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
// 3600で10、360で2を完璧に通るスケーリング関数
    // vr = a * log10(dt) + b 
    // a = (10 - 2) / (log10(3600) - log10(360)) = 8 / 1 = 8
    // b = 10 - 8 * log10(3600) = 10 - 8 * 3.556 = -18.45
    
    var log10dt = Math.log10(Math.max(dt, 1.1));
    var vr = 8 * log10dt - 18.45; 
    
    if(1 < vr) this.dt = dt / vr;
    else this.dt = dt;
    
    bent = true;
  }
}

N6LRngKt.prototype.OnExitPerihelion = function (i) {
return;
  if(i !== 1) return;
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    this.dt = dt;
    bent = false;
  }
}

N6LRngKt.prototype.OnEnterAphelion = function (i) {
return;
  if(i !== 1) return;
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
// 3600で10、360で2を完璧に通るスケーリング関数
    // vr = a * log10(dt) + b 
    // a = (10 - 2) / (log10(3600) - log10(360)) = 8 / 1 = 8
    // b = 10 - 8 * log10(3600) = 10 - 8 * 3.556 = -18.45
    
    var log10dt = Math.log10(Math.max(dt, 1.1));
    var vr = 8 * log10dt - 18.45; 
    
    if(1 < vr) this.dt = dt / vr;
    else this.dt = dt;
    
    bent = true;
  }
}

N6LRngKt.prototype.OnExitAphelion = function (i) {
return;
  if(i !== 1) return;
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    this.dt = dt;
    bent = false;
  }
}


N6LRngKt.prototype.OnDispLog = function (i, pos, vel) {
  if (i !== 1) return;

  // --- 動的インターバル計算 (ミリ秒) ---
  var orbitLogNum = eval(document.getElementById('LAPLOGLINE').value); 
  // i 番目の惑星の周期を直接参照し、ミリ秒に変換する
  var orbitPeriodMS = this.planet[i].m_t * 3600 * 24 * 365.2425 * 1000;
  var minIntervalMS = Math.max(orbitPeriodMS / orbitLogNum, 1000);

  var currentSimTimeMS = this.epoch.getTime() + this.time * 1000;

  if (nextLogTime === null) {
    nextLogTime = currentSimTimeMS; 
    lastPos = new N6LVector(pos);
    lastVel = new N6LVector(vel);
    lastSimTimeMS = currentSimTimeMS;
    return;
  }

  if (nextLogTime <= currentSimTimeMS) {
    var stepDeltaMS = currentSimTimeMS - lastSimTimeMS;
    if (stepDeltaMS > 0) {
      var t = Math.max(0, Math.min(1, (stepDeltaMS - (currentSimTimeMS - nextLogTime)) / stepDeltaMS));

      var adjustedPos = lastPos.Add(pos.Sub(lastPos).Mul(t));
      var adjustedVel = lastVel.Add(vel.Sub(lastVel).Mul(t));
      
      var r = adjustedPos.Abs();
      var v = adjustedVel.Abs();
      var mv = v * rk.CNST_C;
      var mr = r * rk.CNST_AU;

      var e = (1.0 / 2.0) * rk.planet[i].m_m * mv * mv - rk.CNST_G * rk.planet[0].m_m * rk.planet[i].m_m / mr;

      // 表示用とCSV記録用のDateオブジェクト
      var displayDate = new Date(nextLogTime);
      
      // CSV用：世界標準のISO形式 (例: 2026-04-03T12:00:00.000Z)
      var dateStr = displayDate.toISOString(); 

      var csvLine = dateStr + "," + 
                    nextLogTime + "," +  
                    adjustedPos.x[0].toFixed(12) + "," +  
                    adjustedPos.x[1].toFixed(12) + "," +  
                    adjustedPos.x[2].toFixed(12) + "," +  
                    adjustedVel.x[0].toFixed(12) + "," +  
                    adjustedVel.x[1].toFixed(12) + "," +  
                    adjustedVel.x[2].toFixed(12) + "," +  
                    "R:" + r.toFixed(6) + "," +  
                    "V:" + v.toFixed(6) + "," +  
                    "E:" + e.toFixed(6) + "\n";  
      
      orbitCsvContent += csvLine;
      orbitCsvContent = MaxLineLog(orbitCsvContent, MaxCsvLogLine); 

      // 画面表示は人間が見やすい形式で
      var str = "[" + displayDate.toLocaleString() + "] R[AU]:" + r.toFixed(6) + " V[c/s]:" + v.toFixed(6) + " E[J]:" + e.toFixed(6);
      updateLog(str, document.getElementById('log-output3'));
    }

    while (nextLogTime <= currentSimTimeMS) {
        nextLogTime += minIntervalMS;
    }
  }

  lastPos = new N6LVector(pos);
  lastVel = new N6LVector(vel);
  lastSimTimeMS = currentSimTimeMS;
};

function MaxLineLog(str, maxline) {
  // 文字列を行に分割して制限をチェック
  var Lines = str.split("\n");
  // Linesには末尾の空行が含まれるため -1 で判定
  if ((Lines.length - 1) > maxline) {
    // 先頭（古いデータ）を1行削除して結合し直す
    Lines.shift(); 
    str = Lines.join("\n");
  }
  return str;
}


/**
 * 文字列から空行を削除し、各行の先頭に "# " を追加する
 * @param {string} text - 処理対象の文字列
 * @returns {string} - 空行が除去され、各行がコメントアウトされた文字列
 */
function commentOutOverview(text) {
    return text.split('\n')
        .map(line => line.trim())         // 行前後の空白を削除
        .filter(line => line.length > 0)   // 空行（長さ0）を除外
        .map(line => {
            // すでに "#" で始まっている場合はそのまま、そうでなければ "# " を付与
            return line.startsWith("#") ? line : "# " + line;
        })
        .join('\n');
}/*
// 使い方
var simulationOverview = "計算時間 = 41.811000 [秒]\nlaps = 9 [周]...";
var commentedOverview = commentOutOverview(simulationOverview);
*/

/**
 * log-output内の全ログを取得し、strに追記して返す
 * @param {string|null} str - 追記対象の文字列
 * @returns {string} ログが追記された文字列
 */
function getperilog(str = null) {
    const logEl = document.getElementById('log-output');
    let logData = "";

    // 子要素（各ログ行）をループしてテキストを取得
    if (logEl && logEl.childNodes) {
        logEl.childNodes.forEach(node => {
            // テキストが存在する場合のみ改行付きで追加
            if (node.textContent) {
                logData += node.textContent + "\n";
            }
        });
    }

    // 引数 str が null の場合は空文字として扱い、ログを追記
    return (str || "") + logData;
}


    //schwartz correction term//シュワルツシルト補正項
N6LRngKt.prototype.ToSchwartz = function (v, e) {
     var radioList = document.getElementsByName("CALCMODE");
     if(radioList[0].checked) {
        var ret = 3.0 * v * v / ( 1.0 - (e * e)); //楕円一般相対論//eは一周の積分するときに必要
        if(0.95 < e) ret = -0.5 * v * v;          //直線特殊相対論
        return ret;//相対論
     }
     return 0;//古典論
};

//2.5PN
N6LRngKt.prototype.ToGravityRadiationLoss = function (v, m1, m2, r){
    var radioList = document.getElementsByName("CALCMODE");
     if(radioList[0].checked) {
      //NAS6定数//解析的デバッグにより推定
      const VAL_NAS6 = 1.35 - 3.3e+8 / r;
      const CNST_NAS6 = -4.5e-1;
      const CNST = this.CNST_C * CNST_NAS6 * VAL_NAS6;
      var ret = (-32 * CNST / 5) * ((Math.pow(this.CNST_G, 3) * m1 * m2 * (m1 + m2))/(Math.pow(this.CNST_C, 5) * Math.pow(r, 4))) * v * this.CNST_C;
      return ret;//相対論
   }
   return 0;//古典論
};

function oncalcPeri(){
  var checkList = document.getElementsByName("calcPeri");
  if(checkList[0].checked){
    var checkList2 = document.getElementsByName("VDT");
    if(checkList2[0].checked){
      rk.SpdRate = Speed;
    }
    else {
      rk.SpdRate = Speed * BankSpd;
    }
  }
  else {
    rk.SpdRate = Speed * BankSpd;
  }
}




function drawCnvsPeri(){
    var checkList = document.getElementsByName("DPH");
    if(checkList[0].checked === false) return;

    var i;
    var canvas = document.getElementById('perihelionCanvas');
    var ctx = canvas.getContext('2d');
    var sx = 400, sy = 400;
    ctx.clearRect(0,0,sx,sy);
    ctx.lineWidth = 3;

    for(i = 0; i < bankperiPos.length; i++){

      // 近日点の座標（例：mp[selid] から取得したもの）
      var periPos = new x3dom.fields.SFVec3f(
/*
          bankperiPos[i].x, 
          bankperiPos[i].y, 
          bankperiPos[i].z
*/
          bankperiPos[i].x / Zoom, 
          bankperiPos[i].y / Zoom, 
          bankperiPos[i].z / Zoom

      );
      // 変換の実行
      var pos2D = project3DToCanvas(periPos, canvas);
      if(pos2D === null) continue;

      // Canvasに点を打つ
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(pos2D.x, pos2D.y, 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
}

function project3DToCanvas(pos3D, canvas) {
    const x3dElem = document.getElementById('x3dabs');
    if (!x3dElem || !x3dElem.runtime) return null;

    const runtime = x3dElem.runtime;
    
    // getProjectionMatrix() ではなく、現在のビューポート設定を含む行列を取得
    const viewMat = runtime.viewMatrix();
    const projMat = runtime.projectionMatrix();

    if (!viewMat || !projMat || isNaN(viewMat._00) || isNaN(projMat._00)) {
        return null; 
    }

    const mvpMat = projMat.mult(viewMat);
    const p = mvpMat.multMatrixPnt(pos3D);

// 【修正ポイント】wを固定値ではなく行列の4行目から計算する
    // X3DOMの行列成分は _00, _01... と並んでいます。
    // w成分は M41*x + M42*y + M43*z + M44 です。
    const w = mvpMat._30 * pos3D.x + mvpMat._31 * pos3D.y + mvpMat._32 * pos3D.z + mvpMat._33;

    // wが0（カメラの真横や後ろ）でない場合のみ除算
    if (Math.abs(w) < 0.0001) return null;
    // 【重要】w で除算して -1.0 ? 1.0 の範囲（NDC座標）に正規化する
    const ndcX = p.x / w;
    const ndcY = p.y / w;

    // Canvas座標へのマッピング
    const x = (canvas.width / 2) + (ndcX * canvas.width / 2);
    const y = (canvas.height / 2) - (ndcY * canvas.height / 2);
    return { x: x, y: y, z: p.z };
}

