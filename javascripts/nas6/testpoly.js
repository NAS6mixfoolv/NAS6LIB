var chk = false;
var TMan = new N6LTimerMan();  //timer manager//タイマーマネージャー
var x3domRuntime;
jQuery(document).ready(function(){
  TMan.add();
  TMan.timer[0].setalerm(function() { GLoop(0); }, 50);  //set main loop//メインループセット
});

var bx = new N6LVector(new Array('1','0','0','8'), true);  //pos Box//Box座標
var bm = new N6LMatrix(4).UnitMat();  //mat Box//Box回転行列

var bp = new N6LVector([1, 0, 0, 8, 1, 0, 0, 0], true);  //pos Box//Box座標



//main loop//メインループ
function GLoop(id){
  if(x3domRuntime == undefined) x3domRuntime = document.getElementById('x3dabs').runtime;

  //lib test//ライブラリ検証
  //N6LVectorTest();  //N6LVector.Sphere4D()???
  //N6LMatrixTest();  //N6LMatrix.Diagonal & N6LMatrix.DiagonalMat???
  //N6LQuaternionTest();


//普通に行列
//  var MatWK = new N6LMatrix(4).UnitMat();
//  var v = new N6LVector(4, false);
//  //unit vector//単位ベクトル
//  var ax = new N6LVector(4, true).UnitVec(1);
//  var ay = new N6LVector(4, true).UnitVec(2);
//  var az = new N6LVector(4, true).UnitVec(3);
//
//  //rot mov obj//物体回転移動
//  MatWK = MatWK.RotAxis(ay, 1.0 * Math.PI / 180.0);  //around y axis rotate 1 degree//y軸回りに1度回転する回転行列を乗算
//  //test//ライブラリ行列変換検証
//  //ay.x[0] = 1.0 * Math.PI / 180.0;
//  //MatWK = MatWK.RotAxisVec(ay);  //around y axis rotate 1 degree//y軸回りに1度回転する回転行列を乗算
//  bx = MatWK.Mul(bx);  //pos Box multiply matrix//Box座標に回転行列を乗算して更新
//
//  //unit vector//単位ベクトル
//  ax = ax.UnitVec(1);
//  ay = ay.UnitVec(2);
//  az = az.UnitVec(3);
//  //rot obj//物体回転
//  MatWK = new N6LMatrix(bm);  //mat Box//Box回転行列
//  MatWK = MatWK.RotAxis(az, 3.0 * Math.PI / 180.0);  //around z axis rotate 3 degree//z軸回りに3度回転する回転行列を乗算
//  MatWK = MatWK.RotAxis(ay, 2.0 * Math.PI / 180.0);  //around y axis rotate 2 degree//y軸回りに2度回転する回転行列を乗算
//  bm = MatWK.RotAxis(ax, 1.0 * Math.PI / 180.0);     //around x axis rotate 1 degree//x軸回りに1度回転する回転行列を乗算
//
//  //bm = bm.Quaternion().Matrix().Vector().Matrix();  //test//ライブラリ行列相互変換検証
//  //var dt = new Array();
//  //bm = bm.InverseMat(dt).InverseMat(dt);  //test//ライブラリ行列変換検証
//
//  v = bm.Vector();  //rot vector//回転行列から回転ベクトルを取得
//
//  var angle = bm.EulerAngle(3, 2, 1);  //rotate order ZYX //回転順番 ZYX
//  var tbx = new N6LVector(bx);


//姿勢ベクトル演算
  var VecWK = new N6LVector([1,0,0,0,1,0,0,0],true);
  var v = new N6LVector(4, false);
  //unit vector//単位ベクトル
  var ax = new N6LVector(4, true).UnitVec(1);
  var ay = new N6LVector(4, true).UnitVec(2);
  var az = new N6LVector(4, true).UnitVec(3);

  //rot mov obj//物体回転移動
  var q = new N6LQuaternion().UnitQuat().RotAxisQuat(ay, 1.0 * Math.PI / 180.0);
  var pv = new N6LVector([1,0,0,0,q.q.x[0],q.q.x[1],q.q.x[2],q.q.x[3]], true)
  var pvb = new N6LVector([bp.x[0],bp.x[1],bp.x[2],bp.x[3],1,0,0,0], true);
  VecWK = pv.PosVecMul(pvb);  //around y axis rotate 1 degree//y軸回りに1度回転する回転行列を乗算

  //unit vector//単位ベクトル
  ax = ax.UnitVec(1);
  ay = ay.UnitVec(2);
  az = az.UnitVec(3);
  //rot obj//物体回転
  q = new N6LQuaternion().UnitQuat().RotAxisQuat(az, 3.0 * Math.PI / 180.0);
  pv = new N6LVector([1,0,0,0,q.q.x[0],q.q.x[1],q.q.x[2],q.q.x[3]], true)
  pvb = new N6LVector([VecWK.x[0],VecWK.x[1],VecWK.x[2],VecWK.x[3],bp.x[4],bp.x[5],bp.x[6],bp.x[7]], true);
  VecWK = pvb.PosVecMul(pv);  //around z axis rotate 3 degree//z軸回りに3度回転する回転行列を乗算
  q = new N6LQuaternion().UnitQuat().RotAxisQuat(ay, 2.0 * Math.PI / 180.0);
  pv = new N6LVector([1,0,0,0,q.q.x[0],q.q.x[1],q.q.x[2],q.q.x[3]], true)
  VecWK = VecWK.PosVecMul(pv);  //around z axis rotate 3 degree//z軸回りに3度回転する回転行列を乗算
  q = new N6LQuaternion().UnitQuat().RotAxisQuat(ax, 1.0 * Math.PI / 180.0);
  pv = new N6LVector([1,0,0,0,q.q.x[0],q.q.x[1],q.q.x[2],q.q.x[3]], true)
  bp = VecWK.PosVecMul(pv);  //around z axis rotate 3 degree//z軸回りに3度回転する回転行列を乗算


  var tbm = bp.PosVecMatrix();
  var tbx = tbm.Pos();
  var v = tbm.Vector();  //rot vector//回転行列から回転ベクトルを取得

  var angle = tbm.EulerAngle(3, 2, 1);  //rotate order ZYX //回転順番 ZYX

  
  //viewp(); //lookat//注視
  //moveobj(a, pyr);

  //apply x3dom
  var pos = tbx.ToX3DOM(true);
  var elm = document.getElementById('box0');
  elm.setAttribute('translation', pos.toString());
  var rot = v.ToX3DOM();
  elm = document.getElementById('box1');
  elm.setAttribute('rotation', rot.toString());

  //debug//デバッグ用
  elm = document.getElementById('debug');
  elm.innerText = 
  'EulerAngle(rotate per degree z(3)_y(2)_x(1))\n' + angle.x[0] + ' ' + Math.floor(angle.x[1] * 180.0 / Math.PI) + ' ' + Math.floor(angle.x[2] * 180.0 / Math.PI) + ' ' + Math.floor(angle.x[3] * 180.0 / Math.PI); 

  //elm.innerText = 
  //'テンキーで操縦\npyr = [' + pyr.x[1] + ', ' +pyr.x[2] + ', ' +pyr.x[3] + ']\nV = ' + V +' a = ' + a;

  //elm = document.getElementById('debug');
  //elm.innerText = 
  //bx.x[0] + ' ' + bx.x[1] + ' ' + bx.x[2] + ' ' + bx.x[3] + '\n\n' + 
  //bm.x[0].x[0] + ' ' + bm.x[0].x[1] + ' ' + bm.x[0].x[2] + ' ' + bm.x[0].x[3] + '\n' +
  //bm.x[1].x[0] + ' ' + bm.x[1].x[1] + ' ' + bm.x[1].x[2] + ' ' + bm.x[1].x[3] + '\n' +
  //bm.x[2].x[0] + ' ' + bm.x[2].x[1] + ' ' + bm.x[2].x[2] + ' ' + bm.x[2].x[3] + '\n' +
  //bm.x[3].x[0] + ' ' + bm.x[3].x[1] + ' ' + bm.x[3].x[2] + ' ' + bm.x[3].x[3];

  TMan.timer[id].setalerm(function() { GLoop(id); }, 50);  //reset main loop//メインループ再セット
}

//################################################################
//test code//以下、ライブラリテストコード
//################################################################
//lookat//注視
function viewp() {
  if(!x3domRuntime) return;
  var elm = document.getElementById('viewp001');

  var SWM = x3domRuntime.viewMatrix().inverse(); //ワールド回転行列取得
  var WM = new N6LMatrix().FromX3DOM(SWM);
  var Seye = SWM.multMatrixPnt(new x3dom.fields.SFVec3f(0, 0, 0)); //視点位置取得
  var sp = bx.ToX3DOM(true); //注視目標
  var Sat = x3dom.fields.SFVec3f.copy(sp);
  var lookat = new N6LVector([1.0, Sat.x, Sat.y, Sat.z], true); //注視目標セット
  var LAM = WM.LookAtMat2(lookat); //目的の関数
  var Vec = LAM.Vector();
  var ori = Vec.ToX3DOM();

  elm.setAttribute('position', Seye.toString());
  elm.setAttribute('orientation', ori.toString());
  //elm.setAttribute('centerOfRotation', sp.toString());
}

//オブジェクト位置情報
//位置4*4マトリクス(継続パラメータ)
var A = false;

//速度(継続パラメータ)
var V = 0.1;
var a = 0;
var pyr = new N6LVector([1, 0, 0, 0], true); 

//以上のように初期化してから、下の関数を呼び続ける

//加速度a,(スカラー量)(新規パラメータ) 
//ピッチヨーロール(1, θp, θy, θr)(新規パラメータ) 
function moveobj(wa, wpyr) {
  if(!A) {
    if(x3domRuntime) {
      var vm = x3domRuntime.viewMatrix().inverse(); //ワールド回転行列取得
      A = new N6LMatrix().FromX3DOM(vm);
    }
    else return;
  }

  var outmat = [];
  var outv = [];
  var WA = A.MoveMat(outmat, outv, new N6LVector(4, true).ZeroVec(), wpyr, V, wa, 0, 5); //目的の関数

  //値を適用
  V = outv[0].Abs();
  A = new N6LMatrix(WA);
  pyr = new N6LVector([1, 0, 0, 0], true);

  //x3domに適用
  var Vec = A.Vector();
  var pos = A.Pos();
  var eye = pos.ToX3DOM(true);
  var ori = Vec.ToX3DOM();

  var elm = document.getElementById('viewp001');
  elm.setAttribute('position', eye.toString());
  elm.setAttribute('orientation', ori.toString());
}

//キー入力
var KBLock7 = 0;
var KBLock9 = 0;
var KBIntvl = 5;
function chkKeyBoard(){
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N1'))]) {//N1Key
    pyr.x[3] -= 1 * (Math.PI / 180);
  }
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N2'))]) {//N2Key
    pyr.x[1] -= 1 * (Math.PI / 180);
  }
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N3'))]) {//N3Key
    pyr.x[3] += 1 * (Math.PI / 180);
  }
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N4'))]) {//N4Key
    pyr.x[2] -= 1 * (Math.PI / 180);
  }
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N5'))]) {//N5Key
    a = 0;
  }
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N6'))]) {//N6Key
    pyr.x[2] += 1 * (Math.PI / 180);
  }
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N7'))]) {//N7Key
    if(KBIntvl < KBLock7) KBLock7 = 0;
    if(KBLock7 == 0) {
      a -= 0.005;
      if(a < -0.5) a = -0.5;
    }
    KBLock7++;
  }
  else KBLock7 = 0;
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N8'))]) {//N8Key
    pyr.x[1] += 1 * (Math.PI / 180);
  }
  if(KeyB.keystate[KeyB.indexof(KeyB.ToReal('VK_N9'))]) {//N9Key
    if(KBIntvl < KBLock9) KBLock9 = 0;
    if(KBLock9 == 0) {
      a += 0.005;
      if(0.5 < a) a = 0.5;
    }
    KBLock9++;
  }
  else KBLock9 = 0;
};


function N6LVectorTest() {

  var ret;

  //TestCreate
  var a = new N6LVector();
  a = new N6LVector(4);
  a = new N6LVector(4, true);
  a = new N6LVector([1, 1, 0, 0]);
  a = new N6LVector([1, 1, 0, 0], true);
  var b = new N6LVector(a);

  //TestEqual
  ret = a.Equal(b);
  b.bHomo = false;
  ret = a.Equal(b);

  //TestCalc
  a = new N6LVector([1, -1]);
  b = new N6LVector([2, 2]);
  ret = a.Add(b);
  ret = a.Add(5);
  ret = a.Sub(b);
  ret = a.Sub(5);
  var c = new N6LMatrix([1, 1, -1, 1], 2, 2);
  ret = a.Mul(b);
  ret = a.Mul(c);
  ret = a.Mul(5);
  ret = a.Div(b);
  ret = a.Div(c);
  ret = a.Div(5);

  a = new N6LVector([1, 1]);
  b = new N6LVector([1, -1]);
  ret = a.Dot(b);
  ret = a.Cross(b);
  a = new N6LVector([1, 1, 1]);
  b = new N6LVector([1, -1, -1]);
  ret = a.Cross(b);
 
  ret = a.ZeroVec();
  ret = a.UnitVec(0);

  a = new N6LVector([2, 0]);
  b = new N6LVector([3, 0]);
  c = new N6LVector([-4, 0]);
  var d = new N6LVector([0, 1]);
  ret = a.isParallel(b);
  ret = a.isParallel(c);
  ret = a.isParallel(d);

  a = new N6LVector([1, 2, 0, 0], true);
  b = new N6LVector([1, 3, 0, 0], true);
  c = new N6LVector([1, -4, 0, 0], true);
  var d = new N6LVector([1, 0, 1, 0], true);
  ret = a.isParallel(b);
  ret = a.isParallel(c);
  ret = a.isParallel(d);

  a = new N6LVector([1, 1, 1]);
  b = new N6LVector([3, 3, 3]);
  ret = a.NormalVec(b);
  ret = b.Abs();
  ret = b.DirectionCosine();
  a = new N6LVector([1, 0, 0]);
  b = new N6LVector([0, 1, 0]);
  ret = a.Theta(b);
  ret = a.ThetaN(b);
  a = new N6LVector([1, 1]);
  ret = a.Rot2D(Math.PI / 2.0);

  a = new N6LVector(3);
  a = a.UnitVec(0);
  b = new N6LVector(3);
  b = b.UnitVec(1);
  ret = a.RotAxis(b, Math.PI / 2.0);
  a = a.ToHomo();
  b = b.ToHomo();
  ret = a.RotAxisQuat(b, Math.PI / 2.0);

  a = new N6LVector([1, 1, 1]);
  b = new N6LVector([3, 3, 0]);
  ret = b.ProjectAxis(a);

  b = [new N6LVector(a)];
  c = [new N6LVector(a)];
  d = new N6LVector([1, 1, 1]);
  var e = new N6LVector([3, 3, 3]);
  var f = new N6LVector([1, 3, 3]);
  var g = new N6LVector([3, 1, 3]);
  ret = a.PointLineLine(b, c, d, e, f, g);
  ret = a.DistanceLineLine(d, e, f, g);

  a = new N6LVector([2, 2, 2, 2], true);
  ret = a.Homogeneous();

  a = new N6LVector([1, 1, 1]);
  ret = a.ToHomo();
  ret = ret.ToNormal();


  a = new N6LVector([1, 1, 1]);
  b = new N6LVector([-2, -2, -2]);
  c = new N6LVector([2, -2, -2]);
  ret = a.isParallel(b);
  ret = a.isParallel(c);
  ret = a.Cross(b);
  ret = a.Cross(c);
  ret = a.ProjectAxis(b);
  ret = a.ProjectAxis(c);

}

function N6LMatrixTest() {

  var ret;

  //TestCreate
  var a = new N6LMatrix();
  a = new N6LMatrix(4);
  a = new N6LMatrix(4, 8);
  a = new N6LMatrix([1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1], 4, 4);
  var b = a.GetCol(0);
  a = a.SetCol(1, b);
  b = a.GetRow(0);
  a = a.SetRow(1, b);
  a = new N6LMatrix([new N6LVector([1, 0, 0, 0]), new N6LVector([0, 1, 0, 0]), new N6LVector([0, 0, 1, 0]), new N6LVector([0, 0, 0, 1]) ]);
  a = new N6LMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
  a = a.ToNormal();
  a = a.ToHomo();
  b = new N6LMatrix(a);

  //TestEqual
  ret = a.Equal(b);
  b.x[0].x[1] = 5.0;
  ret = a.Equal(b);

  //TestCalc
  a = new N6LMatrix([1, 1, 1, 1], 2, 2);
  b = new N6LMatrix([1, 2, 3, 4], 2, 2);
  ret = a.Add(b);
  ret = a.Add(5);
  ret = a.Sub(b);
  ret = a.Sub(5);
  a = new N6LMatrix([2, 2, 2, 2], 2, 2);
  var c = new N6LVector([1, 0]);
  ret = a.Mul(b);
  ret = a.Mul(c);
  ret = a.Mul(5);
  ret = a.Div(b);
  ret = a.Div(c);
  ret = a.Div(5);

  ret = a.ZeroMat();
  ret = a.UnitMat();
  a = new N6LMatrix([1, 2, 3, 4], 2, 2);
  ret = a.TransposedMat();

  a = new N6LMatrix([2, 5, 1, 3], 2, 2);
  b = new Array();
  ret = a.InverseMat00(b);
  ret = a.InverseMat01(b);
  ret = a.DeterminMatInvMat(b);
  a = new N6LMatrix([1, 0.5, 0.5, 1], 2, 2);
  a = new N6LMatrix([1, 3, -2, -4], 2, 2);
  a = new N6LMatrix([0, 14, 2, -1, 9, -1, -2, 4, 8], 3, 3);
  a = new N6LMatrix([5, 4, 1, 1, 4, 5, 1, 1, 1, 1, 4, 2, 1, 1, 2, 4], 4, 4);
  ret = a.DiagonalMat();
  ret = a.Diagonal();

  a = new N6LMatrix(3).UnitMat();
  a.x[1].x[0] = 5;
  b = new N6LVector(3).UnitVec(1);
  ret = a.RotAxis(b, Math.PI / 2.0);

  a = new N6LMatrix([1, 0, 0, 1], 2, 2);
  ret =  a.Rot2D(Math.PI / 2.0);

  a = new N6LMatrix([2, 2, 2, 2], 2, 2).SetHomo(true);
  ret = a.Homogeneous();

  a = new N6LMatrix(4).UnitMat();
  a.x[1].x[0] = 5;
  ret = a.Pos();

  a = new N6LMatrix([2, 2, 2, 2], 2, 2);
  ret = a.Trace();
  ret = a.NormalMat();

  a = new N6LQuaternion([1, 0, 0, 0]);
  b = new N6LVector(4).UnitVec(2); //y axis
  c = Math.PI / 2.0;
  var d = a.RotAxisQuat(b, c);
  var e = a.RotAxisQuat(b, -c);
  a = new N6LMatrix([[1, 0, 0, 0], [1, 2, 0, 0], [2, 0, 2, 0], [3, 0, 0, 2]]);
  ret = a.Mul(d.Mul(e).Matrix());
  a = new N6LVector([Math.PI / 2.0, 0, 1, 0], true);
  b = new N6LVector([1, 2, 2, 2],true);
  c = new N6LVector([1, 3, 4, 5],true);
  ret = new N6LMatrix(4).UnitMat();
  ret = ret.AffineMat(b, a, c);
  a = new N6LMatrix([[1, 0, 0, 0], [1, 2, 0, 0], [2, 0, 2, 0], [3, 0, 0, 2]]);
  ret = new N6LMatrix(4).UnitMat();
  ret = ret.AffineMat(b, a, c);


  a = new N6LMatrix([[0.2,.32,.12,.3], [.1,.15,.24,.32], [.2,.24,.46,.36], [.6,.4,.32,.2]]);
  ret = a.Householder();
  ret = ret.QRMethod();

  //3D homo matrix
  a = new N6LMatrix([[1, 0, 0], [1, 2, 0], [2, 0, 2]]).SetHomo(true);//unit scale(2, 2) pos(1, 2)
  ret = a.Rot2D(Math.PI / 2.0);
  ret = ret.Rot2D(-Math.PI / 2.0);

  //4D homo matrix
  a = new N6LMatrix([[1, 0, 0, 0], [1, 2, 0, 0], [2, 0, 2, 0], [3, 0, 0, 2]]).SetHomo(true);//unit scale(2, 2, 2) pos(1, 2, 3)
  b = new N6LVector(4, true).UnitVec(3); //z axis
  ret = a.RotAxis(b, Math.PI / 2.0);
  ret = ret.RotAxis(b, -Math.PI / 2.0);
}

function N6LQuaternionTest() {

  var ret;

  //TestCreate
  var a = new N6LQuaternion(1, 0, 0, 0);
  a = new N6LQuaternion(1, [0, 0, 0]);
  a = new N6LQuaternion(1, new N6LVector([1, 2, 3, 4], true));
  a = new N6LQuaternion([1, 0, 0, 0]);
  var b = new N6LQuaternion(a);

  //TestEqual
  ret = a.Equal(b);
  b.q.x[1] = 5.0;
  ret = a.Equal(b);

  //TestCalc
  a = new N6LQuaternion(1, 1, 1, 1);
  b = new N6LQuaternion(-0.5, -0.5, 0.5, 0.5);
  ret = a.Add(b);
  ret = a.Add(5);
  ret = a.Sub(b);
  ret = a.Sub(5);
  ret = a.Mul(b);
  ret = a.Mul(5);
  ret = a.Div(5);
   
  a = new N6LQuaternion(1, 1, 1, 1);
  ret = a.Abs();
  ret = a.ConjugationQuat();
  ret = a.InverseQuat();
  a = new N6LQuaternion(-1, -1, 1, 1);
  ret = a.NormalQuat();
  a = new N6LQuaternion(1, 1, 1, 1);
  b = new N6LQuaternion(-0.5, -0.5, 0.5, 0.5);
  ret = a.Dot(b);
  

  a = new N6LVector([1, 1, -1, 1], true);
  b = 10 * (Math.PI / 180);
  var c = new N6LQuaternion(1, 0, 0, 0);
  c = c.RotAxisQuat(a, b);
  c.Axis(a, b);


  a = new N6LQuaternion(1, 1, 1, 1);
  b = new N6LQuaternion(-0.5, -0.5, 0.5, 0.5);

  ret = a.Lerp(b,0.5);
  ret = a.Lerp(b,1);
  ret = a.Slerp(b,0.5);
  ret = a.Slerp(b,1);
  ret = a.Slerp2(b,0.5);
  ret = a.Slerp2(b,1);
  ret = a.Sphere4D();

  a = new N6LLnQuaternion();
  b = new N6LVector(4, true).UnitVec(1);
  c = Math.PI / 2.0;
  a = a.RotAxisLnQuat(b, c);
  a.Axis(b, c);
  b = new Array(new N6LLnQuaternion());
  ret = new N6LVector(4, true).UnitVec(2);
  c = new Array();
  c[0] = 0.5;
  b[0] = b[0].RotAxisLnQuat(ret, c[0]);
  ret = a.Lerp(b[0], c[0]);
  ret = a.Lerp2(c[0], b[0], c[0]);
}

