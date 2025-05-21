//################################################################
//help doc
//################################################################

function DispHelp(id) {

  elm = document.getElementById('help');
  var html = '　';

  switch(id) {

//########　N6LTimerMan　########

  case 300: html = 
'<font size="5">N6LTimerMan：construction</font><br>' +
'member：<br>' +
'N6LTimerMan.interval:interval timer check<br>' +
'N6LTimerMan.enable:<br>' +
'N6LTimerMan.timer[]:timers<br>' +
'member（N6LTimerMan.timer[id]）：<br>' +
'N6LTimerMan.timer[id].ID:<br>' +
'N6LTimerMan.timer[id].enable:<br>' +
'N6LTimerMan.timer[id].starttime:<br>' +
'N6LTimerMan.timer[id].alerm:after msec<br>' +
'N6LTimerMan.timer[id].alermfunc:call method<br>' +
'format：<br>' +
'var tman = new N6LTimerMan();<br>' +
'Note: even if some make a timer, setTimeout () is one of centralized management to N6LTimerMan<br>';
          break;
  case 301: html = 
'<font size="5">N6LTimerMan.add()</font><br>' +
'desc：add timer<br>' +
'arg ：－－－<br>' +
'ret ：－－－<br>';
          break;
  case 302: html = 
'<font size="5">N6LTimerMan.changeinterval(int)</font><br>' +
'desc：change interval<br>' +
'arg ：int：msec<br>' +
'ret ：－－－<br>';
          break;
  case 303: html = 
'<font size="5">N6LTimerMan.start()</font><br>' +
'desc：start<br>' +
'arg ：－－－<br>' +
'ret ：－－－<br>';
          break;
  case 304: html = 
'<font size="5">N6LTimerMan.stop()</font><br>' +
'desc：stop<br>' +
'arg ：－－－<br>' +
'ret ：－－－<br>';
          break;

//########　N6LTimerMan.timer[id]　########

  case 351: html = 
'<font size="5">N6LTimerMan.timer[id].start()</font><br>' +
'desc：start<br>' +
'arg ：－－－<br>' +
'ret ：－－－<br>';
          break;
  case 352: html = 
'<font size="5">N6LTimerMan.timer[id].stop()</font><br>' +
'desc：stop<br>' +
'arg ：－－－<br>' +
'ret ：－－－<br>';
          break;
  case 353: html = 
'<font size="5">N6LTimerMan.timer[id].reset()</font><br>' +
'desc：reset(Start time update)<br>' +
'arg ：－－－<br>' +
'ret ：－－－<br>';
          break;
  case 354: html = 
'<font size="5">N6LTimerMan.timer[id].copy(src)</font><br>' +
'desc：copy<br>' +
'arg ：src：<br>' +
'ret ：－－－<br>';
          break;
  case 355: html = 
'<font size="5">N6LTimerMan.timer[id].now()</font><br>' +
'desc：past time<br>' +
'arg ：－－－<br>' +
'ret ：－－－<br>';
          break;
  case 356: html = 
'<font size="5">N6LTimerMan.timer[id].setalerm(func(id),alm)</font><br>' +
'desc：set alerm<br>' +
'arg ：func(id)：Method that is called when it is time<br>' +
'alm：msec<br>' +
'ret ：－－－<br>' +
'Detail：<br>' +
'When you want to pass the data other than the id to func (id) is to change the func around the sample,<br>' +
'or to pass the arg, passed in the global variable<br>' +
'<br>' +
'ex：<br>' +
'<br>' +
'//global position<br>' +
'var TMan = new N6LTimerMan(); //construction<br>' +
'<br>' +
'//Timer is needed in the method<br>' +
'...{<br>' +
'　...<br>' +
'　TMan.add(); //add timer<br>' +
'　TMan.timer[0].setalerm(function() { SignalFunc(0); }, 1000); //After 1 second the alarm set<br>' +
'　...<br>' +
'}<br>' +
'<br>' +
'//Call method<br>' +
'function SignalFunc(id) {<br>' +
'　...<br>' +
'　TMan.timer[id].setalerm(function() { SignalFunc(id); }, 1000); //reset<br>' + 
'　//Although it is a recursive function, a in a series of processes, <br>' +
'　//because they return the call stack because it contains setTimeout () is not a stack overflow in a continuous loop<br>' +
'　...<br>' +
'}<br>' +
'<br>' +
'Call time, N6LTimerMan.interval = 25 (default value) is more than is preferred<br>';
          break;

//########　N6LVector　########

  case 0: html = 
'<font size="5">N6LVector：construction</font><br>' +
'member：<br>' +
'N6LVector.x[]:Real<br>' + 
'N6LVector.x[0]:w N6LVector.x[1]:x N6LVector.x[2]:y N6LVector.x[3]:z　etc...<br>' + 
'N6LVector.bHomo:if Homogeneous<br>' +
'var N6LVector = function(rh, bh) { }<br>' +
'format：<br>' +
'Fourth-order vector<br>' +
'var veca = new N6LVector(4);<br>' +
'Homo fourth-order vector<br>' +
'var veca = new N6LVector(4, true);<br>' +
'Third-order vector<br>' +
'var veca = new N6LVector(new Array(1, 2, 3));<br>' +
'x-axis unit homo fourth-order vector<br>' +
'var veca = new N6LVector(new Array(1, 1, 0, 0), true);<br>' +
'var veca = new N6LVector([1, 1, 0, 0], true);<br>' +
'var vecb = new N6LVector(veca); //deep copy<br>';
          break;
  case 1: html = 
'<font size="5">N6LVector.Equal(rh)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LVector:compare this<br>' +
'ret ：true:false:<br>';
          break;
  case 37: html = 
'<font size="5">N6LVector.EpsEqual(rh, eps)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LVector:compare this:eps:error:real<br>' +
'ret ：true:false:<br>';
          break;
  case 39: html = 
'<font size="5">N6LVector.Str()</font><br>' +
'desc：convert to string<br>' +
'arg ：－－－<br>' +
'ret ：convert to string:string<br>';
          break;
  case 40: html = 
'<font size="5">N6LVector.Parse(str)</font><br>' +
'desc：convert from string<br>' +
'arg ：str:string<br>' +
'ret ：convert from string:N6LVector<br>';
          break;
  case 41: html = 
'<font size="5">N6LVector.ToX3DOM(b)</font><br>' +
'desc：convert to x3dom.fields.SFVec[2/3/4]f<br>' +
'arg ：b:case 4→3、true:bool<br>' +
'ret ：convert to x3dom.fields.SFVec[2/3/4]f:x3dom.fields.SFVec[2/3/4]f<br>';
          break;
  case 42: html = 
'<font size="5">N6LVector.FromX3DOM(sf)</font><br>' +
'desc：convert from x3dom.fields.SFVec[2/3/4]f<br>' +
'arg ：sf:x3dom.fields.SFVec[2/3/4]f<br>' +
'ret ：convert from x3dom.fields.SFVec[2/3/4]f:N6LVector<br>';
          break;
  case 50: html = 
'<font size="5">N6LVector.To3JS(b)</font><br>' +
'desc：convert to THREE.Vector[2/3/4]<br>' +
'arg ：b:case 4→3、true:bool<br>' +
'ret ：convert to THREE.Vector[2/3/4]:THREE.Vector[2/3/4]<br>';
          break;
  case 51: html = 
'<font size="5">N6LVector.From3JS(ary)</font><br>' +
'desc：convert from Array<br>' +
'arg ：ary:Array()<br>' +
'ret ：convert from Array:N6LVector<br>';
          break;
  case 2: html = 
'<font size="5">N6LVector.Add(rh)</font><br>' +
'desc：add<br>' +
'arg ：rh:N6LVecto,real<br>' +
'ret ：add:N6LVector<br>';
          break;
  case 3: html = 
'<font size="5">N6LVector.Sub(rh)</font><br>' +
'desc：sub<br>' +
'arg ：rh:N6LVector,real<br>' +
'ret ：sub:N6LVector<br>';
          break;
  case 4: html = 
'<font size="5">N6LVector.Mul(rh)</font><br>' +
'desc：mul<br>' +
'arg ：rh:N6LVector,N6LMatrix,real<br>' +
'ret ：mul:N6LVector,real<br>';
          break;
  case 5: html = 
'<font size="5">N6LVector.Div(rh)</font><br>' +
'desc：div<br>' +
'arg ：rh:N6LVector,N6LMatrix,real<br>' +
'ret ：div:N6LVector,real<br>';
          break;
  case 34: html = 
'<font size="5">N6LVector.SetHomo(rh)</font><br>' +
'desc：set homo flag<br>' +
'arg ：rh:bool,set value<br>' +
'ret ：set homo flag:N6LVector<br>';
          break;
  case 38: html = 
'<font size="5">N6LVector.Repair(eps)</font><br>' +
'desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0<br>' +
'arg ：eps:error,real<br>' +
'ret ：renew this<br>';
          break;
   case 6: html = 
'<font size="5">N6LVector.Dot(rh)</font><br>' +
'desc：dot<br>' +
'arg ：rh:N6LVector<br>' +
'ret ：dot:real<br>';
          break;
  case 7: html = 
'<font size="5">N6LVector.Cross(rh)</font><br>' +
'desc：cross<br>' +
'arg ：rh:N6LVector<br>' +
'ret ：cross:N6LVector,real<br>';
          break;
  case 35: html = 
'<font size="5">N6LVector.isParallel(rh)</font><br>' +
'desc：if parallel<br>' +
'arg ：rh:N6LVector<br>' +
'ret ：true:parallel:false:not parallel<br>';
          break;
  case 36: html = 
'<font size="5">N6LVector.Max()</font><br>' +
'desc：The maximum absolute value of the value of the element (sign as it is)<br>' +
'arg ：－－－<br>' +
'ret ：The maximum absolute value of the value of the element (sign as it is):real<br>';
          break;
  case 43: html = 
'<font size="5">N6LVector.DivMax()</font><br>' +
'desc：Divided by the value of the maximum absolute value of the element<br>' +
'arg ：－－－<br>' +
'ret ：Divided by the value of the maximum absolute value of the element:N6LVector<br>' +
'note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,<br>' +
'　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error<br>';
          break;
  case 44: html = 
'<font size="5">N6LVector.LookAtMat2(rh)</font><br>' +
'desc：lookat<br>' +
'arg ：this:N6LVector:eye, rh:N6LVector,N6LMatrix:lookat<br>' +
'ret ：lookat:N6LMatrix<br>';
          break;
  case 45: html = 
'<font size="5">N6LVector.RotArcQuat(rh)</font><br>' +
'desc：rotation arc(arc ball)<br>' +
'arg ：this:N6LVector:vec1,rh:N6LVector:vec2<br>' +
'ret ：rotation arc(arc ball):N6LQuaternion<br>';
          break;
  case 8: html = 
'<font size="5">N6LVector.ZeroVec()</font><br>' +
'desc：zero<br>' +
'arg ：－－－<br>' +
'ret ：zero:N6LVector<br>';
          break;
  case 9: html = 
'<font size="5">N6LVector.UnitVec(a)</font><br>' +
'desc：unit vector<br>' +
'arg ：a:Axis specification<br>' +
'ret ：unit vector:N6LVector<br>';
          break;
  case 10: html = 
'<font size="5">N6LVector.NormalVec(a)</font><br>' +
'desc：normalize<br>' +
'arg ：a:a.Sub(this);normalize (this→a vector),optional<br>' +
'ret ：normalize:N6LVector<br>';
          break;
  case 11: html = 
'<font size="5">N6LVector.SquareAbs()</font><br>' +
'desc：square absolute<br>' +
'arg ：－－－<br>' +
'ret ：square absolute:real<br>';
          break;
  case 12: html = 
'<font size="5">N6LVector.Abs()</font><br>' +
'desc：absolute<br>' +
'arg ：－－－<br>' +
'ret ：absolute:real<br>';
          break;
  case 13: html = 
'<font size="5">N6LVector.DirectionCosine()</font><br>' +
'desc：DirectionCosine<br>' +
'arg ：－－－<br>' +
'ret ：DirectionCosine:N6LVector<br>';
          break;
  case 14: html = 
'<font size="5">N6LVector.Theta(rh)</font><br>' +
'desc：angle<br>' +
'arg ：rh:N6LVector<br>' +
'ret ：angle:rad<br>';
          break;
  case 15: html = 
'<font size="5">N6LVector.ThetaN(rh)</font><br>' +
'desc：angle<br>' +
'arg ：rh:N6LVector<br>' +
'ret ：true:-π/2＜θ≦π/2:false:Otherwise up to ± π<br>';
          break;
  case 16: html = 
'<font size="5">N6LVector.Rot2D(theta)</font><br>' +
'desc：rotate 2d<br>' +
'arg ：theta:rad<br>' +
'ret ：rotate 2d:N6LVector<br>';
          break;
  case 17: html = 
'<font size="5">N6LVector.RotAxis(axis, theta)</font><br>' +
'desc：rotate axis<br>' +
'arg ：axis:N6LVector:theta:rad<br>' +
'ret ：rotate axis:N6LVector<br>' +
'note：Homogeneous coordinate rotation of the unit x-axis<br>' + 
'with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting<br>';
          break;
  case 18: html = 
'<font size="5">N6LVector.RotAxisQuat(axis, theta)</font><br>' +
'desc：rotate axis(calc quaternion)<br>' +
'arg ：axis:N6LVector:theta:rad<br>' +
'ret ：rotate axis:N6LVector<br>' +
'note：Homogeneous coordinate rotation of the unit x-axis<br>' + 
'with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting<br>';
          break;
  case 33: html = 
'<font size="5">N6LVector.RotAxisVec(rotvec)</font><br>' +
'desc：rotate axis(calc quaternion)<br>' +
'arg ：rotvec:N6LVector,rotate vector<br>' +
'ret ：rotate axis:N6LVector<br>';
          break;
  case 19: html = 
'<font size="5">N6LVector.ProjectAxis(axis)</font><br>' +
'desc：project axis<br>' +
'arg ：axis:N6LVector<br>' +
'ret ：project axis:N6LVector<br>' +
'note：Homogeneous coordinate projection of the unit x-axis<br>' + 
'with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting<br>';
          break;
  case 20: html = 
'<font size="5">N6LVector.DistanceDotLine(p, a, b)</font><br>' +
'desc：Distance of a point and a straight line<br>' +
'arg ：p:N6LVector,point:a:N6LVector,Straight line end point:b:N6LVector,Straight line end point<br>' +
'ret ：Distance of a point and a straight line:real<br>';
          break;
  case 21: html = 
'<font size="5">N6LVector.DistancePointLineLine(reta, retb, a0, a1, b0, b1)</font><br>' +
'desc：Distance and the closest position of the straight line and the straight line<br>' +
'arg ：reta[0]:N6LVector,a on the closest approach location points,ret :retb[0]:N6LVector,b on the closest approach location points,ret :<br>' +
'a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:<br>' +
'b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:<br>' +
'ret ：Distance of the straight line and a straight line:real<br>';
          break;
  case 22: html = 
'<font size="5">N6LVector.PointLineLine(reta, retb, a0, a1, b0, b1)</font><br>' +
'desc：The closest position of the straight line and the straight line<br>' +
'arg ：reta[0]:N6LVector,a on the closest approach location points,ret :retb[0]:N6LVector,b on the closest approach location points,ret :<br>' +
'a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:<br>' +
'b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:<br>' +
'ret ：true:crossed:false:not crossed:<br>';
          break;
  case 23: html = 
'<font size="5">N6LVector.DistanceLineLine(a0, a1, b0, b1)</font><br>' +
'desc：Distance of the straight line and a straight line<br>' +
'arg ：a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:<br>' +
'b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:<br>' +
'ret ：Distance of the straight line and a straight line:real<br>';
          break;
  case 24: html = 
'<font size="5">N6LVector.Homogeneous()</font><br>' +
'desc：Homogeneous<br>' +
'arg ：－－－<br>' +
'ret ：Homogeneous:N6LVector<br>';
          break;
  case 25: html = 
'<font size="5">N6LVector.ToHomo()</font><br>' +
'desc：to homo vector<br>' +
'arg ：－－－<br>' +
'ret ：to homo vector:N6LVector<br>';
          break;
  case 26: html = 
'<font size="5">N6LVector.ToNormal()</font><br>' +
'desc：to normal vector<br>' +
'arg ：－－－<br>' +
'ret ：to normal vector:N6LVector<br>';
          break;
  case 27: html = 
'<font size="5">N6LVector.Matrix()</font><br>' +
'desc：Rotation matrix from the rotation vector<br>' +
'arg ：－－－<br>' +
'ret ：Rotation matrix from the rotation vector:N6LMatrix<br>';
          break;
  case 46: html = 
'<font size="5">N6LVector.PosVecGetTQ(out)</font><br>' +
'desc：get position vector to translated and quaternion<br>' +
'arg ：out[]<br>' +
'ret ：get position vector to translated and quaternion:out[0]:N6LVector:translated,out[1]:N6LQuaternion:quaternion,<br>';
          break;
  case 49: html = 
'<font size="5">N6LVector.PosVecSetTQ(t,q)</font><br>' +
'desc：set position vector to translated and quaternion<br>' +
'arg ：t:N6LVector:translated,q:N6LQuaternion:quaternion<br>' +
'ret ：set position vector to translated and quaternion:N6LVector<br>';
          break;
  case 47: html = 
'<font size="5">N6LVector.PosVecMatrix()</font><br>' +
'desc：position vector to rotate matrix<br>' +
'arg ：－－－<br>' +
'ret ：position vector to rotate matrix:N6LMatrix<br>';
          break;
  case 48: html = 
'<font size="5">N6LVector.PosVecMul(rh)</font><br>' +
'desc：multiple position vector<br>' +
'arg ：rh:N6LVector():position vector<br>' +
'ret ：multiple position vector:N6LVector<br>';
          break;
  case 28: html = 
'<font size="5">N6LVector.Sphere4D()</font><br>' +
'desc：Sphere4D<br>' +
'arg ：－－－<br>' +
'ret ：Sphere4D:N6LQuaternion<br>';
          break;
  case 29: html = 
'<font size="5">N6LVector.FromLogAxis(base, range, x)</font><br>' +
'desc：From an infinite logarithmic axis to the normal axis<br>' +
'arg ：base:real,range:real,x:real:infinite logarithmic axis<br>' +
'ret ：normal axis:real<br>';
          break;
  case 30: html = 
'<font size="5">N6LVector.ToLogAxis(base, range, x)</font><br>' +
'desc：From the normal axis to infinite logarithmic axis<br>' +
'arg ：base:real,range:real,x:real:normal axis<br>' +
'ret ：infinite logarithmic axis:real<br>';
          break;
  case 31: html = 
'<font size="5">N6LVector.FrustumInfVec(base, range, v)</font><br>' +
'desc：Infinity perspective projection<br>' +
'arg ：base:real,range:real,v:N6LVector:arg <br>' +
'ret ：Infinity perspective projection:N6LVector<br>';
          break;
  case 32: html = 
'<font size="5">N6LVector.InvFrustumInfVec(base, range, v, z)</font><br>' +
'desc：Inverse infinity perspective projection<br>' +
'arg ：base:real,range:real,v:N6LVector:arg ,z:real<br>' +
'ret ：Inverse infinity perspective projection:N6LVector<br>';
          break;

//########　N6LMatrix　########

  case 100: html = 
'<font size="5">N6LMatrix：construction</font><br>' +
'member：<br>' +
'N6LMatrix.x[]:N6LVector<br>' + 
'N6LMatrix.x[0]:N6LVector:w N6LMatrix.x[1]:N6LVector:x<br>' +  
'N6LMatrix.x[2]:N6LVector:y N6LMatrix.x[3]:N6LVector:z　etc...<br>' + 
'N6LMatrix.bHomo:if  Homogeneous<br>' +
'var N6LMatrix = function(rh, m , n) { }<br>' +
'format：<br>' +
'4 rows and 4 columns<br>' +
'var mata = new N6LMatrix(4);<br>' +
'4 rows and 8 columns<br>' +
'var mata = new N6LMatrix(4, 8);<br>' +
'4 rows and 4 columns unit matrix<br>' +
'var mata = new N6LMatrix(<br>' +
'new Array(1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1), 4, 4);<br>' +
'var mata = new N6LMatrix(new Array(new N6LVector(new Array(1, 0, 0, 0)),<br>' +
'　new N6LVector(new Array(0, 1, 0, 0)), new N6LVector(new Array(0, 0, 1, 0)),<br>' +
'　new N6LVector(new Array(0, 0, 0, 1)) ));<br>' +
'var mata = new N6LMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] );<br>' +
'var matb = new N6LMatrix(mata); //deep copy<br>' +
'note:Fourth-order or more is considered to be a homogeneous coordinates<br>' +
'If you want to make a fourth-order or more conventional coordinate N6LMatrix.SetHomo(false)<br>' +
'Please continue to build declaration<br>';
          break;
  case 101: html = 
'<font size="5">N6LMatrix.Equal(rh)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LMatrix:compare this<br>' +
'ret ：true:false:<br>';
          break;
  case 142: html = 
'<font size="5">N6LMatrix.EpsEqual(rh, eps)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LMatrix:compare this:eps:error:real<br>' +
'ret ：true:false:<br>';
          break;
  case 144: html = 
'<font size="5">N6LMatrix.Str()</font><br>' +
'desc：convert to string<br>' +
'arg ：－－－<br>' +
'ret ：convert to string:string<br>';
          break;
  case 145: html = 
'<font size="5">N6LMatrix.Parse(str)</font><br>' +
'desc：convert from string<br>' +
'arg ：str:string<br>' +
'ret ：convert from string:N6LMatrix<br>';
          break;
  case 146: html = 
'<font size="5">N6LMatrix.ToX3DOM()</font><br>' +
'desc：convert to x3dom.fields.SFMatrix4f<br>' +
'arg ：－－－<br>' +
'ret ：convert to x3dom.fields.SFMatrix4f:x3dom.fields.SFMatrix4f<br>';
          break;
  case 147: html = 
'<font size="5">N6LMatrix.FromX3DOM(sf)</font><br>' +
'desc：convert from x3dom.fields.SFMatrix4f<br>' +
'arg ：sf:x3dom.fields.SFMatrix4f<br>' +
'ret ：convert from x3dom.fields.SFMatrix4f:N6LMatrix<br>';
          break;
  case 156: html = 
'<font size="5">N6LMatrix.To3JS()</font><br>' +
'desc：convert to THREE.Matrix4<br>' +
'arg ：－－－<br>' +
'ret ：convert to THREE.Matrix4:THREE.Matrix4<br>';
          break;
  case 157: html = 
'<font size="5">N6LMatrix.From3JS(ary)</font><br>' +
'desc：convert from Array<br>' +
'arg ：ary:Array()<br>' +
'ret ：convert from Array:N6LMatrix<br>';
          break;
  case 151: html = 
'<font size="5">N6LMatrix.GetCol(rh)</font><br>' +
'desc：get column<br>' +
'arg ：rh:int:column<br>' +
'ret ：get column:N6LVector<br>';
          break;
  case 152: html = 
'<font size="5">N6LMatrix.GetRow(rh)</font><br>' +
'desc：get row<br>' +
'arg ：rh:int:row<br>' +
'ret ：get row:N6LVector<br>';
          break;
  case 153: html = 
'<font size="5">N6LMatrix.SetCol(rh, val)</font><br>' +
'desc：set column<br>' +
'arg ：rh:int:columnval:N6LVector:value<br>' +
'ret ：set column:N6LMatrix<br>';
          break;
  case 154: html = 
'<font size="5">N6LMatrix.SetRow(rh, val)</font><br>' +
'desc：set row<br>' +
'arg ：rh:int:row:val:N6LVector:value<br>' +
'ret ：set row:N6LMatrix<br>';
          break;
  case 102: html = 
'<font size="5">N6LMatrix.Add(rh)</font><br>' +
'desc：add<br>' +
'arg ：rh:N6LMatrix,real<br>' +
'ret ：add:N6LMatrix<br>';
          break;
  case 103: html = 
'<font size="5">N6LMatrix.Sub(rh)</font><br>' +
'desc：sub<br>' +
'arg ：rh:N6LMatrix,real<br>' +
'ret ：sub:N6LMatrix<br>';
          break;
  case 104: html = 
'<font size="5">N6LMatrix.Mul(rh)</font><br>' +
'desc：mul<br>' +
'arg ：rh:N6LMatrix,N6LVector,real<br>' +
'ret ：mul:N6LMatrix,N6LVector<br>';
          break;
  case 105: html = 
'<font size="5">N6LMatrix.Div(rh)</font><br>' +
'desc：div<br>' +
'arg ：rh:N6LMatrix,N6LVector,real<br>' +
'ret ：div:N6LMatrix,N6LVector<br>';
          break;
  case 139: html = 
'<font size="5">N6LMatrix.SetHomo(rh)</font><br>' +
'desc：set homo flag<br>' +
'arg ：rh:bool,set value<br>' +
'ret ：set homo flag:N6LMatrix<br>';
          break;
  case 143: html = 
'<font size="5">N6LMatrix.Repair(eps)</font><br>' +
'desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0<br>' +
'arg ：eps:error,real<br>' +
'ret ：renew this<br>';
          break;
  case 141: html = 
'<font size="5">N6LMatrix.Max()</font><br>' +
'desc：The maximum absolute value of the value of the element (sign as it is)<br>' +
'arg ：－－－<br>' +
'ret ：The maximum absolute value of the value of the element (sign as it is):real<br>';
          break;
  case 148: html = 
'<font size="5">N6LMatrix.DivMax()</font><br>' +
'desc：Divided by the value of the maximum absolute value of the element<br>' +
'arg ：－－－<br>' +
'ret ：Divided by the value of the maximum absolute value of the element:N6LMatrix<br>' +
'note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,<br>' +
'　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error<br>';
          break;
  case 106: html = 
'<font size="5">N6LMatrix.ZeroMat()</font><br>' +
'desc：zero<br>' +
'arg ：－－－<br>' +
'ret ：zero:N6LMatrix<br>';
          break;
  case 107: html = 
'<font size="5">N6LMatrix.UnitMat()</font><br>' +
'desc：unit matrix<br>' +
'arg ：－－－<br>' +
'ret ：unit matrix:N6LMatrix<br>';
          break;
  case 124: html = 
'<font size="5">N6LMatrix.NormalMat()</font><br>' +
'desc：normalize<br>' +
'arg ：－－－<br>' +
'ret ：normalize:N6LMatrix<br>';
          break;
  case 108: html = 
'<font size="5">N6LMatrix.TransposedMat()</font><br>' +
'desc：transpose<br>' +
'arg ：－－－<br>' +
'ret ：transpose:N6LMatrix<br>';
          break;
  case 130: html = 
'<font size="5">N6LMatrix.TranslatedMat(rh)</font><br>' +
'desc：translate<br>' +
'arg ：rh:N6LVector<br>' +
'ret ：translate:N6LMatrix<br>';
          break;
  case 131: html = 
'<font size="5">N6LMatrix.ScaleMat(rh)</font><br>' +
'desc：scale<br>' +
'arg ：rh:N6LVector,real<br>' +
'ret ：scale:N6LMatrix<br>';
          break;
  case 132: html = 
'<font size="5">N6LMatrix.AffineMat(scale, rotate, translate)</font><br>' +
'desc：affine<br>' +
'arg ：scale:N6LVector,real, rotate:N6LMatrix,N6LVector(rotate vector),N6LQuaternion, translate:N6LVector<br>' +
'ret ：affine:N6LMatrix<br>';
          break;
  case 149: html = 
'<font size="5">N6LMatrix.MoveMat(outmat, outv, d, pyr, v, a, vmin, vmax)</font><br>' +
'desc：move<br>' +
'arg ：outmat[0]:N6LMatrix:ret:d only matrix after the movement that has translated、outv[0]:N6LVector:ret:Velocity after the movement<br>' +
'　　：d:N6LVector:translated outmat[0] only d、pyr:N6LVector:4dimension:pitch yaw roll<br>' +
'　　：v:real:velocity:N6LVector:translated、a:real:accel、vmin,vmax:real:limit of velocity:if ==987654321.0、no limit<br>' +
'ret ：mved matrix:N6LMatrix<br>';
          break;
  case 126: html = 
'<font size="5">N6LMatrix.LookAtMat(eye, lookat, up)</font><br>' +
'desc：lookat<br>' +
'arg ：eye:N6LVector, lookat:N6LVector, up:N6LVector<br>' +
'ret ：lookat:N6LMatrix<br>';
          break;
  case 150: html = 
'<font size="5">N6LMatrix.LookAtMat2(rh)</font><br>' +
'desc：lookat<br>' +
'arg ：this:N6LVector:eye, rh:N6LVector,N6LMatrix:lookat<br>' +
'ret ：lookat:N6LMatrix<br>';
          break;
  case 109: html = 
'<font size="5">N6LMatrix.InverseMat(dt, sw)</font><br>' +
'desc：(Using the simultaneous linear equation solving) the inverse matrix<br>' +
'　　：sw:int:switch of calc、optional<br>' +
'　　：1:TransposedMat():2:InverseMat00():3:InverseMat01():4:DeterminMatInvMat()<br>' +
'　　：undefined:Use Global value SwDefInverseMat(=1:default):other:"Error"<br>' +
'arg ：dt[0]:Determinant,ret :<br>' +
'ret ：inverse matrix:N6LMatrix<br>';
          break;
  case 110: html = 
'<font size="5">N6LMatrix.InverseMat00(dt)</font><br>' +
'desc：(Using the simultaneous linear equation solving) the inverse matrix<br>' +
'arg ：dt[0]:Determinant,ret :<br>' +
'ret ：inverse matrix:N6LMatrix<br>';
          break;
  case 111: html = 
'<font size="5">N6LMatrix.InverseMat01(dt)</font><br>' +
'desc：(Sweep-out method using a) inverse matrix<br>' +
'arg ：dt[0]:Determinant,ret :<br>' +
'ret ：inverse matrix:N6LMatrix<br>';
          break;
  case 112: html = 
'<font size="5">N6LMatrix.DeterminMatInvMat(dt)</font><br>' +
'desc：(Using the LU decomposition method) the inverse matrix<br>' +
'arg ：dt[0]:Determinant,ret :<br>' +
'ret ：inverse matrix:N6LMatrix<br>';
          break;
  case 113: html = 
'<font size="5">N6LMatrix.DeterminMat(dt)</font><br>' +
'desc：Determin<br>' +
'arg ：dt[0]:Determinant,ret :<br>' +
'ret ：Determin:real<br>';
          break;
  case 114: html = 
'<font size="5">N6LMatrix.Jacobi(n, ct, eps, A, A1, A2, X1, X2)</font><br>' +
'desc：Eigenvalues and eigenvectors of a real symmetric matrix (Jacobi)<br>' +
'arg ：n : Order：ct : The maximum number of repetitions：eps : Convergence criteria：<br>' +
'A[0] : target matrix：A1[0], A2[0] : work（nxn matrix），A1 diagonal elements are the eigenvalues of：<br>' +
'X1[0], X2[0] : work（nxn matrix），Each column of the X1 is eigenvector<br>' +
'ret ：0:normal:1:It does not converge:<br>';
          break;
  case 115: html = 
'<font size="5">N6LMatrix.EigenVec(ct, eps, A, det, eigen)</font><br>' +
'desc：Eigenvalues and eigenvectors of a real symmetric matrix (Jacobi)<br>' +
'arg ：n : Order：ct : The maximum number of repetitions：eps : Convergence criteria：<br>' +
'A[0] : target matrix：det[0] : eigenvalues,ret ：eigen[0] :eigenvectors,ret <br>' +
'ret ：0:normal:1:It does not converge:<br>';
          break;
  case 116: html = 
'<font size="5">N6LMatrix.DiagonalMat(ct, eps)</font><br>' +
'desc：DiagonalMatrix<br>' +
'arg ：ct : The maximum number of repetitions：eps : Convergence criteria：Both Optional<br>' +
'ret ：eigenvectors:N6LMatrix<br>';
          break;
  case 117: html = 
'<font size="5">N6LMatrix.Diagonal(ct, eps)</font><br>' +
'desc：Diagonal<br>' +
'arg ：ct : The maximum number of repetitions：eps : Convergence criteria：Both Optional<br>' +
'ret ：Diagonal:N6LMatrix<br>';
          break;
  case 140: html = 
'<font size="5">N6LMatrix.Rot2D(theta)</font><br>' +
'desc：rotate 2D<br>' +
'arg ：theta:rad<br>' +
'ret ：rotate matrix:N6LMatrix<br>';
          break;
  case 118: html = 
'<font size="5">N6LMatrix.RotAxis(axis, theta)</font><br>' +
'desc：rotate axis<br>' +
'arg ：axis:N6LVector:theta:rad<br>' +
'ret ：rotate axis:N6LMatrix<br>' +
'note:scale, translate information is kept<br>' +
'Homogeneous coordinate rotation of the unit x-axis<br>' + 
'with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting<br>';
          break;
  case 125: html = 
'<font size="5">N6LMatrix.RotAxisQuat(axis, theta)</font><br>' +
'desc：rotate axis(calc quaternion)<br>' +
'arg ：axis:N6LVector:theta:rad<br>' +
'ret ：rotate axis:N6LMatrix<br>' +
'note:scale, translate information is kept<br>' +
'In rotation with respect to the axis of the matrix, if you care about the processing speed<br>' +
'First, to build a unit quaternion (N6LQuaternion.UnitQuat())<br>' +
'After all of the rotation only calculated in the quaternion (N6LQuaternion.RotAxisQuat())<br>' +
'Please be converted into a matrix quaternion (N6LQuaternion.Matrix())<br>' +
'And finally, please by multiplying the matrix obtained and calculated the original matrix (N6LMatrix.Mul())<br>' +
'Only N6LMatrix.RotAxisQuat(), to calculate all,<br>' +
'Since the calculation every time the conversion of the matrix from the quaternion,<br>' + 
'it does not make sense in the processing speed<br>' +
'Simply, it is intended only for convenient use<br>' +
'Homogeneous coordinate rotation of the unit x-axis<br>' + 
'with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting<br>';
          break;
  case 136: html = 
'<font size="5">N6LMatrix.RotAxisVec(rotvec)</font><br>' +
'desc：rotate axis(calc quaternion)<br>' +
'arg ：rotvec:N6LVector,rotate vector<br>' +
'ret ：rotate axis:N6LMatrix<br>' +
'note:scale, translate information is kept<br>' +
'In rotation with respect to the axis of the matrix, if you care about the processing speed<br>' +
'First, to build a unit quaternion (N6LQuaternion.UnitQuat())<br>' +
'Quaternion only after all of the rotation calculation (N6LQuaternion.RotAxisVec())<br>' +
'Please be converted into a matrix quaternion (N6LQuaternion.Matrix())<br>' +
'And finally, please by multiplying the matrix obtained and calculated the original matrix (N6LMatrix.Mul())<br>' +
'Only N6LMatrix.RotAxisVec(), to calculate all,<br>' +
'Since the calculation every time the conversion of the matrix from the vector and quaternion,<br>' + 
'does not make sense in the processing speed<br>' +
'In addition, since the N6LQuaternion.RotAxisVec() converts from the vector to the quaternion<br>' +
'It is heavier than (N6LQuaternion.RotAxisQuat())<br>' +
'Simply, it is intended only for convenient use<br>';
          break;
  case 119: html = 
'<font size="5">N6LMatrix.Homogeneous()</font><br>' +
'desc：Homogeneous<br>' +
'arg ：－－－<br>' +
'ret ：Homogeneous:N6LMatrix<br>';
          break;
  case 127: html = 
'<font size="5">N6LMatrix.ToHomo()</font><br>' +
'desc：to homo matrix<br>' +
'arg ：－－－<br>' +
'ret ：to homo matrix:N6LMatrix<br>';
          break;
  case 128: html = 
'<font size="5">N6LMatrix.ToNormal()</font><br>' +
'desc：to normal matrix<br>' +
'arg ：－－－<br>' +
'ret ：to normal matrix:N6LMatrix<br>';
          break;
  case 120: html = 
'<font size="5">N6LMatrix.Pos()</font><br>' +
'desc：get position<br>' +
'arg ：－－－<br>' +
'ret ：get position:N6LVector<br>';
          break;
  case 135: html = 
'<font size="5">N6LMatrix.Scale()</font><br>' +
'desc：get scale<br>' +
'arg ：－－－<br>' +
'ret ：get scale:N6LVector<br>';
          break;
  case 121: html = 
'<font size="5">N6LMatrix.Trace()</font><br>' +
'desc：trace<br>' +
'arg ：－－－<br>' +
'ret ：trace:real<br>';
          break;
  case 122: html = 
'<font size="5">N6LMatrix.Quaternion()</font><br>' +
'desc：Quaternion acquisition of the rotation matrix<br>' +
'arg ：－－－<br>' +
'ret ：Quaternion acquisition of the rotation matrix:N6LQuaternion<br>';
          break;
  case 123: html = 
'<font size="5">N6LMatrix.Vector()</font><br>' +
'desc：Rotation vector acquisition of the rotation matrix<br>' +
'arg ：－－－<br>' +
'ret ：Rotation vector acquisition of the rotation matrix:N6LVector<br>';
          break;
  case 155: html = 
'<font size="5">N6LMatrix.PosVector()</font><br>' +
'desc：get position vector<br>' +
'arg ：－－－<br>' +
'ret ：get position vector:N6LVector<br>';
          break;
  case 129: html = 
'<font size="5">N6LMatrix.FrustumMat(left, right, top, bottom, near, far)</font><br>' +
'desc：Frustum<br>' +
'arg ：left,right,top,bottom,near,far:real:Frustum arg <br>' +
'ret ：Frustum:N6LMatrix<br>';
          break;
  case 138: html = 
'<font size="5">N6LMatrix.OrthoMat(left, right, top, bottom, near, far)</font><br>' +
'desc：Ortho<br>' +
'arg ：left,right,top,bottom,near,far:real:Frustum arg <br>' +
'ret ：Ortho:N6LMatrix<br>';
          break;
  case 133: html = 
'<font size="5">N6LMatrix.Householder()</font><br>' +
'desc：Householder<br>' +
'arg ：－－－<br>' +
'ret ：Householder:N6LMatrix<br>';
          break;
  case 134: html = 
'<font size="5">N6LMatrix.QRMethod()</font><br>' +
'desc：QRMethod<br>' +
'arg ：－－－<br>' +
'ret ：Eigenvalues diagonal section:N6LMatrix<br>';
          break;
  case 137: html = 
'<font size="5">N6LMatrix.EulerAngle(first, second, third, eps)</font><br>' +
'desc：get euler angle<br>' +
'arg ：first,second,third:1,2,3,Each axis order,eps:error,optional<br>' +
'ret ：get euler angle,:N6LVector,rad<br>' +
'note：the second axis may have an angle, if the angle of the other of the axis of zero<br>' +
'It has a second axis in the recalculation to the first axis<br>';
          break;

//########　N6LQuaternion　########

  case 200: html = 
'<font size="5">N6LQuaternion：construction</font><br>' +
'member：<br>' +
'N6LQuaternion.q:N6LVector<br>' + 
'N6LQuaternion.q.x[0]:w N6LQuaternion.q.x[1]:x<br>' +  
'N6LQuaternion.q.x[2]:y N6LQuaternion.q.x[3]:z<br>' + 
'var N6LQuaternion = function(w, x, y, z) { }<br>' +
'format：<br>' +
'var quta = new N6LQuaternion(1, 0, 0, 0);<br>' +
'var quta = new N6LQuaternion(1, new Array(0, 0, 0));<br>' +
'var quta = new N6LQuaternion(new Array(1, 0, 0, 0));<br>' +
'var quta = new N6LQuaternion(new N6LVector([1, 0, 0, 0]));<br>' +
'var quta = new N6LQuaternion(1, new N6LVector([1, 2, 3, 4], true));<br>' +
'var quta = new N6LQuaternion([1, 0, 0, 0]);<br>' +
'var qutb = new N6LQuaternion(quta); //deep copy<br>';
          break;
  case 201: html = 
'<font size="5">N6LQuaternion.Equal(rh)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LQuaternion:compare this<br>' +
'ret ：true:false:<br>';
          break;
  case 221: html = 
'<font size="5">N6LQuaternion.EpsEqual(rh, eps)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LQuaternion:compare this:eps:error:real<br>' +
'ret ：true:false:<br>';
          break;
  case 224: html = 
'<font size="5">N6LQuaternion.Str()</font><br>' +
'desc：convert to string<br>' +
'arg ：－－－<br>' +
'ret ：convert to string:string<br>';
          break;
  case 225: html = 
'<font size="5">N6LQuaternion.Parse(str)</font><br>' +
'desc：convert from string<br>' +
'arg ：str:string<br>' +
'ret ：convert from string:N6LQuaternion<br>';
          break;
  case 202: html = 
'<font size="5">N6LQuaternion.Add(rh)</font><br>' +
'desc：add<br>' +
'arg ：rh:N6LQuaternion,real<br>' +
'ret ：add:N6LQuaternion<br>';
          break;
  case 203: html = 
'<font size="5">N6LQuaternion.Sub(rh)</font><br>' +
'desc：sub<br>' +
'arg ：rh:N6LQuaternion,real<br>' +
'ret ：sub:N6LQuaternion<br>';
          break;
  case 204: html = 
'<font size="5">N6LQuaternion.Mul(rh)</font><br>' +
'desc：mul<br>' +
'arg ：rh:N6LQuaternion,real<br>' +
'ret ：mul:N6LQuaternion<br>';
          break;
  case 205: html = 
'<font size="5">N6LQuaternion.Div(rh)</font><br>' +
'desc：div<br>' +
'arg ：rh:real<br>' +
'ret ：div:N6LQuaternion<br>';
          break;
  case 226: html = 
'<font size="5">N6LQuaternion.DivMax()</font><br>' +
'desc：Divided by the value of the maximum absolute value of the element<br>' +
'arg ：－－－<br>' +
'ret ：Divided by the value of the maximum absolute value of the element:N6LQuaternion<br>' +
'note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,<br>' +
'　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error<br>';
          break;
  case 222: html = 
'<font size="5">N6LQuaternion.Repair(eps)</font><br>' +
'desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0<br>' +
'arg ：eps:error,real<br>' +
'ret ：renew this<br>';
          break;
  case 206: html = 
'<font size="5">N6LQuaternion.SquareAbs()</font><br>' +
'desc：square absolute<br>' +
'arg ：－－－<br>' +
'ret ：square absolute:real<br>';
          break;
  case 207: html = 
'<font size="5">N6LQuaternion.Abs()</font><br>' +
'desc：absolute<br>' +
'arg ：－－－<br>' +
'ret ：absolute:real<br>';
          break;
  case 208: html = 
'<font size="5">N6LQuaternion.ConjugationQuat()</font><br>' +
'desc：Conjugation<br>' +
'arg ：－－－<br>' +
'ret ：Conjugation:N6LQuaternion<br>';
          break;
  case 209: html = 
'<font size="5">N6LQuaternion.InverseQuat()</font><br>' +
'desc：Inverse<br>' +
'arg ：－－－<br>' +
'ret ：Inverse:N6LQuaternion<br>';
          break;
  case 218: html = 
'<font size="5">N6LQuaternion.ZeroQuat()</font><br>' +
'desc：zero<br>' +
'arg ：－－－<br>' +
'ret ：zero:N6LQuaternion<br>';
          break;
  case 219: html = 
'<font size="5">N6LQuaternion.UnitQuat()</font><br>' +
'desc：unit quaternion<br>' +
'arg ：－－－<br>' +
'ret ：unit quaternion:N6LQuaternion<br>';
          break;
  case 210: html = 
'<font size="5">N6LQuaternion.NormalQuat()</font><br>' +
'desc：normalize<br>' +
'arg ：－－－<br>' +
'ret ：normalize:N6LQuaternion<br>';
          break;
  case 211: html = 
'<font size="5">N6LQuaternion.Dot(rh)</font><br>' +
'desc：dot<br>' +
'arg ：rh:N6LQuaternion<br>' +
'ret ：dot:real<br>';
          break;
  case 212: html = 
'<font size="5">N6LQuaternion.RotAxisQuat(axis, theta)</font><br>' +
'desc：rotate axis<br>' +
'arg ：axis:N6LVectortheta:rad<br>' +
'ret ：rotate axis:N6LQuaternion<br>' +
'note：Homogeneous coordinate rotation of the unit x-axis<br>' + 
'with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting<br>';
          break;
  case 220: html = 
'<font size="5">N6LQuaternion.RotAxisVec(rotvec)</font><br>' +
'desc：rotate axis(calc quaternion)<br>' +
'arg ：rotvec:N6LVector,rotate vector<br>' +
'ret ：rotate axis:N6LQuaternion<br>';
  case 223: html = 
'<font size="5">N6LQuaternion.Axis(axis, theta)</font><br>' +
'desc：rotate axis<br>' +
'arg ：axis[0]:N6LVector,ret :theta[0]:rad,ret <br>' +
'ret ：－－－<br>';
          break;
          break;
  case 213: html = 
'<font size="5">N6LQuaternion.Matrix()</font><br>' +
'desc：Rotation matrix from the quaternion<br>' +
'arg ：－－－<br>' +
'ret ：Rotation matrix:N6LMatrix<br>';
          break;
  case 214: html = 
'<font size="5">N6LQuaternion.Lerp(q, t)</font><br>' +
'desc：lerp<br>' +
'arg ：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):<br>' +
'ret ：lerp:N6LQuaternion<br>';
          break;
  case 215: html = 
'<font size="5">N6LQuaternion.Slerp(q, t)</font><br>' +
'desc：slerp<br>' +
'arg ：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):<br>' +
'ret ：slerp:N6LQuaternion<br>';
          break;
  case 216: html = 
'<font size="5">N6LQuaternion.Slerp2(q, t)</font><br>' +
'desc：slerp<br>' +
'arg ：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):<br>' +
'ret ：slerp:N6LQuaternion<br>';
          break;
  case 217: html = 
'<font size="5">N6LQuaternion.Sphere4D()</font><br>' +
'desc：Sphere4D<br>' +
'arg ：－－－<br>' +
'ret ：Sphere4D:N6LVector<br>';
          break;

//########　N6LLnQuaternion　########

  case 250: html = 
'<font size="5">N6LLnQuaternion：construction</font><br>' +
'member：<br>' +
'N6LLnQuaternion.q:N6LVector<br>' + 
'N6LLnQuaternion.q.x[0]:x N6LLnQuaternion.q.x[1]:y N6LLnQuaternion.q.x[2]:z<br>' + 
'var N6LLnQuaternion = function(x, y, z) { }<br>' +
'format：<br>' +
'var quta = new N6LLnQuaternion(0, 0, 0);<br>' +
'var quta = new N6LLnQuaternion(new Array(0, 0, 0));<br>' +
'var quta = new N6LLnQuaternion(new N6LVector([0, 0, 0]));<br>' +
'var quta = new N6LLnQuaternion([0, 0, 0]);<br>' +
'var qutb = new N6LLnQuaternion(quta); //deep copy<br>';
          break;
  case 251: html = 
'<font size="5">N6LLnQuaternion.Equal(rh)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LLnQuaternion:compare this<br>' +
'ret ：true:false:<br>';
          break;
  case 263: html = 
'<font size="5">N6LLnQuaternion.EpsEqual(rh, eps)</font><br>' +
'desc：if equal<br>' +
'arg ：rh:N6LLnQuaternion:compare this:eps:error:real<br>' +
'ret ：true:false:<br>';
          break;
  case 265: html = 
'<font size="5">N6LLnQuaternion.Str()</font><br>' +
'desc：convert to string<br>' +
'arg ：－－－<br>' +
'ret ：convert to string:string<br>';
          break;
  case 266: html = 
'<font size="5">N6LLnQuaternion.Parse(str)</font><br>' +
'desc：convert from string<br>' +
'arg ：str:string<br>' +
'ret ：convert from string:N6LLnQuaternion<br>';
          break;
  case 252: html = 
'<font size="5">N6LLnQuaternion.Add(rh)</font><br>' +
'desc：add<br>' +
'arg ：rh:N6LLnQuaternion<br>' +
'ret ：add:N6LLnQuaternion<br>';
          break;
  case 253: html = 
'<font size="5">N6LLnQuaternion.Sub(rh)</font><br>' +
'desc：sub<br>' +
'arg ：rh:N6LLnQuaternion<br>' +
'ret ：sub:N6LLnQuaternion<br>';
          break;
  case 254: html = 
'<font size="5">N6LLnQuaternion.Mul(rh)</font><br>' +
'desc：mul<br>' +
'arg ：rh:real<br>' +
'ret ：mul:N6LLnQuaternion<br>';
          break;
  case 255: html = 
'<font size="5">N6LLnQuaternion.Div(rh)</font><br>' +
'desc：div<br>' +
'arg ：rh:real<br>' +
'ret ：div:N6LLnQuaternion<br>';
          break;
  case 267: html = 
'<font size="5">N6LLnQuaternion.DivMax()</font><br>' +
'desc：Divided by the value of the maximum absolute value of the element<br>' +
'arg ：－－－<br>' +
'ret ：Divided by the value of the maximum absolute value of the element:N6LLnQuaternion<br>' +
'note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,<br>' +
'　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error<br>';
          break;
  case 264: html = 
'<font size="5">N6LLnQuaternion.Repair(eps)</font><br>' +
'desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0<br>' +
'arg ：eps:error,real<br>' +
'ret ：renew this<br>';
          break;
  case 256: html = 
'<font size="5">N6LLnQuaternion.SquareAbs()</font><br>' +
'desc：square absolute<br>' +
'arg ：－－－<br>' +
'ret ：square absolute:real<br>';
          break;
  case 257: html = 
'<font size="5">N6LLnQuaternion.Abs()</font><br>' +
'desc：absolute<br>' +
'arg ：－－－<br>' +
'ret ：absolute:real<br>';
          break;
  case 262: html = 
'<font size="5">N6LLnQuaternion.ZeroLnQuat()</font><br>' +
'desc：zero<br>' +
'arg ：－－－<br>' +
'ret ：zero:N6LLnQuaternion<br>';
          break;
  case 258: html = 
'<font size="5">N6LLnQuaternion.RotAxisLnQuat(axis, theta)</font><br>' +
'desc：rotate axis<br>' +
'arg ：axis:N6LVector:theta:rad<br>' +
'ret ：rotate axis:N6LLnQuaternion<br>' +
'note：Homogeneous coordinate rotation of the unit x-axis<br>' + 
'with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting<br>';
          break;
  case 259: html = 
'<font size="5">N6LLnQuaternion.Axis(axis, theta)</font><br>' +
'desc：rotate axis<br>' +
'arg ：axis[0]:N6LVector,ret :theta[0]:rad,ret <br>' +
'ret ：－－－<br>';
          break;
  case 260: html = 
'<font size="5">N6LLnQuaternion.Lerp(q, t)</font><br>' +
'desc：lerp<br>' +
'arg ：q:N6LLnQuaternion,End status:t:0.0(start)～1.0(end):<br>' +
'ret ：lerp:N6LQuaternion<br>';
          break;
  case 261: html = 
'<font size="5">N6LLnQuaternion.Lerp2(d0, q, d)</font><br>' +
'desc：lerp<br>' +
'arg ：d0:real:The weighted average of this:q[]:N6LLnQuaternion,Array:d[]:real,Array:weighted average<br>' +
'ret ：lerp:N6LQuaternion<br>';
          break;

//########　N6LKeyBoard　########

  case 400: html = 
'<font size="5">N6LKeyBoard：construction</font><br>' +
'desc：As ＜body onload="initKeyBoard(tman, function() { func(); });"＞ in HTMLfile<br>' +
'tman : timer manager and func keyboard check method is tied.<br>' +
'ex.　：<br>' +
'function func(){<br>' +
'　if(KeyB.keystate[KeyB.indexof(KeyB.ToRealID("VK_N1"))]) {//numpad 1 KeyDown<br>' +
'．．．skip．．．<br>' +
'  }<br>' +
'  if(KeyB.keystate[KeyB.indexof(KeyB.ToRealID("VK_N2"))]) {//numpad 2 KeyDown<br>' +
'．．．skip．．．<br>' +
'  }<br>' +
'．．．skip．．．}<br>';
          break;
  case 401: html = 
'<font size="5">N6LKeyBoard.setfunc(func)</font><br>' +
'desc：keyboard check method is tied<br>' +
'arg ：func:method<br>' +
'ret ：－－－<br>';
          break;
  case 411: html = 
'<font size="5">N6LKeyBoard.setenable(b)</font><br>' +
'説明：keyboard enable set<br>' +
'引数：b:enable:bool<br>' +
'戻値：－－－<br>';
          break;
  case 402: html = 
'<font size="5">N6LKeyBoard.indexof(str)</font><br>' +
'desc：index of real name ID<br>' +
'arg ：str:string:real name ID<br>' +
'ret ：index of real name ID:integer<br>';
          break;
  case 403: html = 
'<font size="5">N6LKeyBoard.addAlias(ary)</font><br>' +
'desc：additional alias name ID<br>' +
'arg ：ary:Array:[srcID, destID]<br>' +
'ret ：－－－<br>';
          break;
  case 404: html = 
'<font size="5">N6LKeyBoard.delAlias(str)</font><br>' +
'desc：delete str was tied alias name<br>' +
'arg ：str:string:real name ID or alias name ID<br>' +
'ret ：－－－<br>';
          break;
  case 407: html = 
'<font size="5">N6LKeyBoard.addUnityAlias(ary)</font><br>' +
'desc：additional unity alias name ID<br>' +
'arg ：ary:Array:[tiedID, aliasID, ...]<br>' +
'ret ：－－－<br>';
          break;
  case 408: html = 
'<font size="5">N6LKeyBoard.delUnityAlias(str)</font><br>' +
'desc：delete unity alias name ID<br>' +
'arg ：str:string:aliasID<br>' +
'ret ：－－－<br>';
          break;
  case 409: html = 
'<font size="5">N6LKeyBoard.UnityAlias(str)</font><br>' +
'desc：get unity alias name by alias name<br>' +
'arg ：str:string:aliasID<br>' +
'ret ：unity alias name ID:string<br>';
          break;
  case 410: html = 
'<font size="5">N6LKeyBoard.isPressUnityAlias(str)</font><br>' +
'desc：press info of unity alias name ID<br>' +
'arg ：str:string:aliasID<br>' +
'ret ：press info of unity alias name ID:bool<br>';
          break;
  case 405: html = 
'<font size="5">N6LKeyBoard.ToAlias(str, ret)</font><br>' +
'desc：convert to alias name ID<br>' +
'arg ：str:string:real name ID:ret:Array:list of alias name ID:ret<br>' +
'ret ：deepest alias name ID:string<br>';
          break;
  case 406: html = 
'<font size="5">N6LKeyBoard.ToReal(str)</font><br>' +
'desc：convert to real name ID<br>' +
'arg ：str:string:alias name ID<br>' +
'ret ：real name ID:string<br>';
          break;



  default:break;
  }


  

  elm.innerHTML = html; 
}

