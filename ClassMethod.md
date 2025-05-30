### N6LTimerMan
  
* N6LTimerMan：construction  
member：  
N6LTimerMan.interval:interval timer check  
N6LTimerMan.enable:  
N6LTimerMan.timer[]:timers  
member（N6LTimerMan.timer[id]）：  
N6LTimerMan.timer[id].ID:  
N6LTimerMan.timer[id].enable:  
N6LTimerMan.timer[id].starttime:  
N6LTimerMan.timer[id].alerm:after msec  
N6LTimerMan.timer[id].alermfunc:call method  
format：  
var tman = new N6LTimerMan();  
Note: even if some make a timer, setTimeout () is one of centralized management to N6LTimerMan  
  
* N6LTimerMan.add()  
desc：add timer
arg ：－－－  
ret ：－－－  
   
* * N6LTimerMan.changeinterval(int)  
desc：change interval  
arg ：int：msec  
ret ：－－－  
   
* N6LTimerMan.start()  
desc：start  
arg ：－－－  
ret ：－－－  
   
* N6LTimerMan.stop()  
desc：stop  
arg ：－－－  
ret ：－－－  

### N6LTimerMan.timer[id]  
   
* N6LTimerMan.timer[id].start()  
desc：start  
arg ：－－－  
ret ：－－－  
   
* N6LTimerMan.timer[id].stop()  
desc：stop  
arg ：－－－  
ret ：－－－  
   
* N6LTimerMan.timer[id].reset()  
desc：reset(Start time update)  
arg ：－－－  
ret ：－－－  
   
* N6LTimerMan.timer[id].copy(src)  
desc：copy  
arg ：src：  
ret ：－－－  
   
* N6LTimerMan.timer[id].now()  
desc：past time  
arg ：－－－  
ret ：－－－  
   
* N6LTimerMan.timer[id].setalerm(func(id),alm)  
desc：set alerm  
arg ：func(id)：Method that is called when it is time  
alm：msec  
ret ：－－－  
Detail：  
When you want to pass the data other than the id to func (id) is to change the func around the sample,  
or to pass the arg, passed in the global variable  
  
ex：  
  
//global position  
var TMan = new N6LTimerMan(); //construction  
  
//Timer is needed in the method  
...{  
　...  
　TMan.add(); //add timer  
　TMan.timer[0].setalerm(function() { SignalFunc(0); }, 1000); //After 1 second the alarm set  
　...  
}  
  
//Call method  
function SignalFunc(id) {  
　...  
　TMan.timer[id].setalerm(function() { SignalFunc(id); }, 1000); //reset   
　//Although it is a recursive function, a in a series of processes,   
　//because they return the call stack because it contains setTimeout () is not a stack overflow in a continuous loop  
　...  
}  
  
Call time, N6LTimerMan.interval = 25 (default value) is more than is preferred  

### N6LVector  
   
* N6LVector：construction  
member：  
N6LVector.x[]:Real   
N6LVector.x[0]:w N6LVector.x[1]:x N6LVector.x[2]:y N6LVector.x[3]:z　etc...   
N6LVector.bHomo:if Homogeneous  
var N6LVector = function(rh, bh) { }  
format：  
Fourth-order vector  
var veca = new N6LVector(4);  
Homo fourth-order vector  
var veca = new N6LVector(4, true);  
Third-order vector  
var veca = new N6LVector(new Array(1, 2, 3));  
x-axis unit homo fourth-order vector  
var veca = new N6LVector(new Array(1, 1, 0, 0), true);  
var veca = new N6LVector([1, 1, 0, 0], true);  
var vecb = new N6LVector(veca); //deep copy  
   
* N6LVector.Equal(rh)  
desc：if equal  
arg ：rh:N6LVector:compare this  
ret ：true:false:  
   
* N6LVector.EpsEqual(rh, eps)  
desc：if equal  
arg ：rh:N6LVector:compare this:eps:error:real  
ret ：true:false:  
   
* N6LVector.Str()  
desc：convert to string  
arg ：－－－  
ret ：convert to string:string  
   
* N6LVector.Parse(str)  
desc：convert from string  
arg ：str:string  
ret ：convert from string:N6LVector  
   
* N6LVector.ToX3DOM(b)  
desc：convert to x3dom.fields.SFVec[2/3/4]f  
arg ：b:case 4→3、true:bool  
ret ：convert to x3dom.fields.SFVec[2/3/4]f:x3dom.fields.SFVec[2/3/4]f  
   
* N6LVector.FromX3DOM(sf)  
desc：convert from x3dom.fields.SFVec[2/3/4]f  
arg ：sf:x3dom.fields.SFVec[2/3/4]f  
ret ：convert from x3dom.fields.SFVec[2/3/4]f:N6LVector  
   
* N6LVector.To3JS(b)  
desc：convert to THREE.Vector[2/3/4]  
arg ：b:case 4→3、true:bool  
ret ：convert to THREE.Vector[2/3/4]:THREE.Vector[2/3/4]  
   
* N6LVector.From3JS(ary)  
desc：convert from Array  
arg ：ary:Array()  
ret ：convert from Array:N6LVector  
   
* N6LVector.Add(rh)  
desc：add  
arg ：rh:N6LVecto,real  
ret ：add:N6LVector  
   
* N6LVector.Sub(rh)  
desc：sub  
arg ：rh:N6LVector,real  
ret ：sub:N6LVector  
   
* N6LVector.Mul(rh)  
desc：mul  
arg ：rh:N6LVector,N6LMatrix,real  
ret ：mul:N6LVector,real  
   
* N6LVector.Div(rh)  
desc：div  
arg ：rh:N6LVector,N6LMatrix,real  
ret ：div:N6LVector,real  
   
* N6LVector.SetHomo(rh)  
desc：set homo flag  
arg ：rh:bool,set value  
ret ：set homo flag:N6LVector  
   
* N6LVector.Repair(eps)  
desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
arg ：eps:error,real  
ret ：renew this  
   
* N6LVector.Dot(rh)  
desc：dot  
arg ：rh:N6LVector  
ret ：dot:real  
   
* N6LVector.Cross(rh)  
desc：cross  
arg ：rh:N6LVector  
ret ：cross:N6LVector,real  
   
* N6LVector.isParallel(rh)  
desc：if parallel  
arg ：rh:N6LVector  
ret ：true:parallel:false:not parallel  
   
* N6LVector.Max()  
desc：The maximum absolute value of the value of the element (sign as it is)  
arg ：－－－  
ret ：The maximum absolute value of the value of the element (sign as it is):real  
   
* N6LVector.DivMax()  
desc：Divided by the value of the maximum absolute value of the element  
arg ：－－－  
ret ：Divided by the value of the maximum absolute value of the element:N6LVector  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LVector.LookAtMat2(rh)  
desc：lookat  
arg ：this:N6LVector:eye, rh:N6LVector,N6LMatrix:lookat  
ret ：lookat:N6LMatrix  
   
* N6LVector.RotArcQuat(rh)  
desc：rotation arc(arc ball)  
arg ：this:N6LVector:vec1,rh:N6LVector:vec2  
ret ：rotation arc(arc ball):N6LQuaternion  
  
* N6LVector.ZeroVec()  
desc：zero  
arg ：－－－  
ret ：zero:N6LVector  
  
* N6LVector.UnitVec(a)  
desc：unit vector  
arg ：a:Axis specification  
ret ：unit vector:N6LVector  
   
* N6LVector.NormalVec(a)  
desc：normalize  
arg ：a:a.Sub(this);normalize (this→a vector),optional  
ret ：normalize:N6LVector  
   
* N6LVector.SquareAbs()  
desc：square absolute  
arg ：－－－  
ret ：square absolute:real  
   
* N6LVector.Abs()  
desc：absolute  
arg ：－－－  
ret ：absolute:real  
   
* N6LVector.DirectionCosine()  
desc：DirectionCosine  
arg ：－－－  
ret ：DirectionCosine:N6LVector  
   
* N6LVector.Theta(rh)  
desc：angle  
arg ：rh:N6LVector  
ret ：angle:rad  
   
* N6LVector.ThetaN(rh)  
desc：angle  
arg ：rh:N6LVector  
ret ：true:-π/2＜θ≦π/2:false:Otherwise up to ± π  
   
* N6LVector.Rot2D(theta)  
desc：rotate 2d  
arg ：theta:rad  
ret ：rotate 2d:N6LVector  
   
* N6LVector.RotAxis(axis, theta)  
desc：rotate axis  
arg ：axis:N6LVector:theta:rad  
ret ：rotate axis:N6LVector  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LVector.RotAxisQuat(axis, theta)  
desc：rotate axis(calc quaternion)  
arg ：axis:N6LVector:theta:rad  
ret ：rotate axis:N6LVector  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LVector.RotAxisVec(rotvec)  
desc：rotate axis(calc quaternion)  
arg ：rotvec:N6LVector,rotate vector  
ret ：rotate axis:N6LVector  
   
* N6LVector.ProjectAxis(axis)  
desc：project axis  
arg ：axis:N6LVector  
ret ：project axis:N6LVector  
note：Homogeneous coordinate projection of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
  
* N6LVector.DistanceDotLine(p, a, b)  
desc：Distance of a point and a straight line  
arg ：p:N6LVector,point:a:N6LVector,Straight line end point:b:N6LVector,Straight line end point  
ret ：Distance of a point and a straight line:real  
  
* N6LVector.DistancePointLineLine(reta, retb, a0, a1, b0, b1)  
desc：Distance and the closest position of the straight line and the straight line  
arg ：reta[0]:N6LVector,a on the closest approach location points,ret :retb[0]:N6LVector,b on the closest approach location points,ret :  
a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:  
b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:  
ret ：Distance of the straight line and a straight line:real  
   
* N6LVector.PointLineLine(reta, retb, a0, a1, b0, b1)  
desc：The closest position of the straight line and the straight line  
arg ：reta[0]:N6LVector,a on the closest approach location points,ret :retb[0]:N6LVector,b on the closest approach location points,ret :  
a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:  
b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:  
ret ：true:crossed:false:not crossed:  
   
* N6LVector.DistanceLineLine(a0, a1, b0, b1)  
desc：Distance of the straight line and a straight line  
arg ：a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:  
b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:  
ret ：Distance of the straight line and a straight line:real  
   
* N6LVector.Homogeneous()  
desc：Homogeneous  
arg ：－－－  
ret ：Homogeneous:N6LVector  
   
* N6LVector.ToHomo()  
desc：to homo vector  
arg ：－－－  
ret ：to homo vector:N6LVector  
   
* N6LVector.ToNormal()  
desc：to normal vector  
arg ：－－－  
ret ：to normal vector:N6LVector  
   
* N6LVector.Matrix()  
desc：Rotation matrix from the rotation vector  
arg ：－－－  
ret ：Rotation matrix from the rotation vector:N6LMatrix  
   
* N6LVector.PosVecGetTQ(out)  
desc：get position vector to translated and quaternion  
arg ：out[]  
ret ：get position vector to translated and quaternion:out[0]:N6LVector:translated,out[1]:N6LQuaternion:quaternion,  
   
* N6LVector.PosVecSetTQ(t,q)  
desc：set position vector to translated and quaternion  
arg ：t:N6LVector:translated,q:N6LQuaternion:quaternion  
ret ：set position vector to translated and quaternion:N6LVector  
   
* N6LVector.PosVecMatrix()  
desc：position vector to rotate matrix  
arg ：－－－  
ret ：position vector to rotate matrix:N6LMatrix  
  
* N6LVector.PosVecMul(rh)  
desc：multiple position vector  
arg ：rh:N6LVector():position vector  
ret ：multiple position vector:N6LVector  
   
* N6LVector.Sphere4D()  
desc：Sphere4D  
arg ：－－－  
ret ：Sphere4D:N6LQuaternion  
   
* N6LVector.FromLogAxis(base, range, x)  
desc：From an infinite logarithmic axis to the normal axis  
arg ：base:real,range:real,x:real:infinite logarithmic axis  
ret ：normal axis:real  
   
* N6LVector.ToLogAxis(base, range, x)  
desc：From the normal axis to infinite logarithmic axis  
arg ：base:real,range:real,x:real:normal axis  
ret ：infinite logarithmic axis:real  
   
* N6LVector.FrustumInfVec(base, range, v)  
desc：Infinity perspective projection  
arg ：base:real,range:real,v:N6LVector:arg   
ret ：Infinity perspective projection:N6LVector  
   
* N6LVector.InvFrustumInfVec(base, range, v, z)  
desc：Inverse infinity perspective projection  
arg ：base:real,range:real,v:N6LVector:arg ,z:real  
ret ：Inverse infinity perspective projection:N6LVector  
  
### N6LMatrix
  
* N6LMatrix：construction  
member：  
N6LMatrix.x[]:N6LVector   
N6LMatrix.x[0]:N6LVector:w N6LMatrix.x[1]:N6LVector:x    
N6LMatrix.x[2]:N6LVector:y N6LMatrix.x[3]:N6LVector:z　etc...   
N6LMatrix.bHomo:if  Homogeneous  
var N6LMatrix = function(rh, m , n) { }  
format：  
4 rows and 4 columns  
var mata = new N6LMatrix(4);  
4 rows and 8 columns  
var mata = new N6LMatrix(4, 8);  
4 rows and 4 columns unit matrix  
var mata = new N6LMatrix(  
new Array(1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1), 4, 4);  
var mata = new N6LMatrix(new Array(new N6LVector(new Array(1, 0, 0, 0)),  
　new N6LVector(new Array(0, 1, 0, 0)), new N6LVector(new Array(0, 0, 1, 0)),  
　new N6LVector(new Array(0, 0, 0, 1)) ));  
var mata = new N6LMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] );  
var matb = new N6LMatrix(mata); //deep copy  
note:Fourth-order or more is considered to be a homogeneous coordinates  
If you want to make a fourth-order or more conventional coordinate N6LMatrix.SetHomo(false)  
Please continue to build declaration  
   
* N6LMatrix.Equal(rh)  
desc：if equal  
arg ：rh:N6LMatrix:compare this  
ret ：true:false:  
   
* N6LMatrix.EpsEqual(rh, eps)  
desc：if equal  
arg ：rh:N6LMatrix:compare this:eps:error:real  
ret ：true:false:  
   
* N6LMatrix.Str()  
desc：convert to string  
arg ：－－－  
ret ：convert to string:string  
   
* N6LMatrix.Parse(str)  
desc：convert from string  
arg ：str:string  
ret ：convert from string:N6LMatrix  
   
* N6LMatrix.ToX3DOM()  
desc：convert to x3dom.fields.SFMatrix4f  
arg ：－－－  
ret ：convert to x3dom.fields.SFMatrix4f:x3dom.fields.SFMatrix4f  
   
* N6LMatrix.FromX3DOM(sf)  
desc：convert from x3dom.fields.SFMatrix4f  
arg ：sf:x3dom.fields.SFMatrix4f  
ret ：convert from x3dom.fields.SFMatrix4f:N6LMatrix  
   
* N6LMatrix.To3JS()  
desc：convert to THREE.Matrix4  
arg ：－－－  
ret ：convert to THREE.Matrix4:THREE.Matrix4  
   
* N6LMatrix.From3JS(ary)  
desc：convert from Array  
arg ：ary:Array()  
ret ：convert from Array:N6LMatrix  
   
* N6LMatrix.GetCol(rh)  
desc：get column  
arg ：rh:int:column  
ret ：get column:N6LVector  
   
* N6LMatrix.GetRow(rh)  
desc：get row  
arg ：rh:int:row  
ret ：get row:N6LVector  
   
* N6LMatrix.SetCol(rh, val)  
desc：set column  
arg ：rh:int:columnval:N6LVector:value  
ret ：set column:N6LMatrix  
   
* N6LMatrix.SetRow(rh, val)  
desc：set row  
arg ：rh:int:row:val:N6LVector:value  
ret ：set row:N6LMatrix  
   
* N6LMatrix.Add(rh)  
desc：add  
arg ：rh:N6LMatrix,real  
ret ：add:N6LMatrix  
   
* N6LMatrix.Sub(rh)  
desc：sub  
arg ：rh:N6LMatrix,real  
ret ：sub:N6LMatrix  
   
* N6LMatrix.Mul(rh)  
desc：mul  
arg ：rh:N6LMatrix,N6LVector,real  
ret ：mul:N6LMatrix,N6LVector  
   
* N6LMatrix.Div(rh)  
desc：div  
arg ：rh:N6LMatrix,N6LVector,real  
ret ：div:N6LMatrix,N6LVector  
   
* N6LMatrix.SetHomo(rh)  
desc：set homo flag  
arg ：rh:bool,set value  
ret ：set homo flag:N6LMatrix  
   
* N6LMatrix.Repair(eps)  
desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
arg ：eps:error,real  
ret ：renew this  
   
* N6LMatrix.Max()  
desc：The maximum absolute value of the value of the element (sign as it is)  
arg ：－－－  
ret ：The maximum absolute value of the value of the element (sign as it is):real  
   
* N6LMatrix.DivMax()  
desc：Divided by the value of the maximum absolute value of the element  
arg ：－－－  
ret ：Divided by the value of the maximum absolute value of the element:N6LMatrix  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LMatrix.ZeroMat()  
desc：zero  
arg ：－－－  
ret ：zero:N6LMatrix  
   
* N6LMatrix.UnitMat()  
desc：unit matrix  
arg ：－－－  
ret ：unit matrix:N6LMatrix  
   
* N6LMatrix.NormalMat()  
desc：normalize  
arg ：－－－  
ret ：normalize:N6LMatrix  
   
* N6LMatrix.TransposedMat()  
desc：transpose  
arg ：－－－  
ret ：transpose:N6LMatrix  
   
* N6LMatrix.TranslatedMat(rh)  
desc：translate  
arg ：rh:N6LVector  
ret ：translate:N6LMatrix  
   
* N6LMatrix.ScaleMat(rh)  
desc：scale  
arg ：rh:N6LVector,real  
ret ：scale:N6LMatrix  
   
* N6LMatrix.AffineMat(scale, rotate, translate)  
desc：affine  
arg ：scale:N6LVector,real, rotate:N6LMatrix,N6LVector(rotate vector),N6LQuaternion, translate:N6LVector  
ret ：affine:N6LMatrix  
   
* N6LMatrix.MoveMat(outmat, outv, d, pyr, v, a, vmin, vmax)  
desc：move  
arg ：outmat[0]:N6LMatrix:ret:d only matrix after the movement that has translated、outv[0]:N6LVector:ret:Velocity after the movement  
　　：d:N6LVector:translated outmat[0] only d、pyr:N6LVector:4dimension:pitch yaw roll  
　　：v:real:velocity:N6LVector:translated、a:real:accel、vmin,vmax:real:limit of velocity:if ==987654321.0、no limit  
ret ：mved matrix:N6LMatrix  
   
* N6LMatrix.LookAtMat(eye, lookat, up)  
desc：lookat  
arg ：eye:N6LVector, lookat:N6LVector, up:N6LVector  
ret ：lookat:N6LMatrix  
   
* N6LMatrix.LookAtMat2(rh)  
desc：lookat  
arg ：this:N6LVector:eye, rh:N6LVector,N6LMatrix:lookat  
ret ：lookat:N6LMatrix  
   
* N6LMatrix.InverseMat(dt, sw)  
desc：(Using the simultaneous linear equation solving) the inverse matrix  
　　：sw:int:switch of calc、optional  
　　：1:TransposedMat():2:InverseMat00():3:InverseMat01():4:DeterminMatInvMat()  
　　：undefined:Use Global value SwDefInverseMat(=1:default):other:"Error"  
arg ：dt[0]:Determinant,ret :  
ret ：inverse matrix:N6LMatrix  
   
* N6LMatrix.InverseMat00(dt)  
desc：(Using the simultaneous linear equation solving) the inverse matrix  
arg ：dt[0]:Determinant,ret :  
ret ：inverse matrix:N6LMatrix  
   
* N6LMatrix.InverseMat01(dt)  
desc：(Sweep-out method using a) inverse matrix  
arg ：dt[0]:Determinant,ret :  
ret ：inverse matrix:N6LMatrix  
   
* N6LMatrix.DeterminMatInvMat(dt)  
desc：(Using the LU decomposition method) the inverse matrix  
arg ：dt[0]:Determinant,ret :  
ret ：inverse matrix:N6LMatrix  
   
* N6LMatrix.DeterminMat(dt)  
desc：Determin  
arg ：dt[0]:Determinant,ret :  
ret ：Determin:real  
   
* N6LMatrix.Jacobi(n, ct, eps, A, A1, A2, X1, X2)  
desc：Eigenvalues and eigenvectors of a real symmetric matrix (Jacobi)  
arg ：n : Order：ct : The maximum number of repetitions：eps : Convergence criteria：  
A[0] : target matrix：A1[0], A2[0] : work（nxn matrix），A1 diagonal elements are the eigenvalues of：  
X1[0], X2[0] : work（nxn matrix），Each column of the X1 is eigenvector  
ret ：0:normal:1:It does not converge:  
   
* N6LMatrix.EigenVec(ct, eps, A, det, eigen)  
desc：Eigenvalues and eigenvectors of a real symmetric matrix (Jacobi)  
arg ：n : Order：ct : The maximum number of repetitions：eps : Convergence criteria：  
A[0] : target matrix：det[0] : eigenvalues,ret ：eigen[0] :eigenvectors,ret   
ret ：0:normal:1:It does not converge:  
   
* N6LMatrix.DiagonalMat(ct, eps)  
desc：DiagonalMatrix  
arg ：ct : The maximum number of repetitions：eps : Convergence criteria：Both Optional  
ret ：eigenvectors:N6LMatrix  
   
* N6LMatrix.Diagonal(ct, eps)  
desc：Diagonal  
arg ：ct : The maximum number of repetitions：eps : Convergence criteria：Both Optional  
ret ：Diagonal:N6LMatrix  
  
* N6LMatrix.Rot2D(theta)  
desc：rotate 2D  
arg ：theta:rad  
ret ：rotate matrix:N6LMatrix  
   
* N6LMatrix.RotAxis(axis, theta)  
desc：rotate axis  
arg ：axis:N6LVector:theta:rad  
ret ：rotate axis:N6LMatrix  
note:scale, translate information is kept  
Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LMatrix.RotAxisQuat(axis, theta)  
desc：rotate axis(calc quaternion)  
arg ：axis:N6LVector:theta:rad  
ret ：rotate axis:N6LMatrix  
note:scale, translate information is kept  
In rotation with respect to the axis of the matrix, if you care about the processing speed  
First, to build a unit quaternion (N6LQuaternion.UnitQuat())  
After all of the rotation only calculated in the quaternion (N6LQuaternion.RotAxisQuat())  
Please be converted into a matrix quaternion (N6LQuaternion.Matrix())  
And finally, please by multiplying the matrix obtained and calculated the original matrix (N6LMatrix.Mul())  
Only N6LMatrix.RotAxisQuat(), to calculate all,  
Since the calculation every time the conversion of the matrix from the quaternion,   
it does not make sense in the processing speed  
Simply, it is intended only for convenient use  
Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LMatrix.RotAxisVec(rotvec)  
desc：rotate axis(calc quaternion)  
arg ：rotvec:N6LVector,rotate vector  
ret ：rotate axis:N6LMatrix  
note:scale, translate information is kept  
In rotation with respect to the axis of the matrix, if you care about the processing speed  
First, to build a unit quaternion (N6LQuaternion.UnitQuat())  
Quaternion only after all of the rotation calculation (N6LQuaternion.RotAxisVec())  
Please be converted into a matrix quaternion (N6LQuaternion.Matrix())  
And finally, please by multiplying the matrix obtained and calculated the original matrix (N6LMatrix.Mul())  
Only N6LMatrix.RotAxisVec(), to calculate all,  
Since the calculation every time the conversion of the matrix from the vector and quaternion,   
does not make sense in the processing speed  
In addition, since the N6LQuaternion.RotAxisVec() converts from the vector to the quaternion  
It is heavier than (N6LQuaternion.RotAxisQuat())  
Simply, it is intended only for convenient use  
   
* N6LMatrix.Homogeneous()  
desc：Homogeneous  
arg ：－－－  
ret ：Homogeneous:N6LMatrix  
   
* N6LMatrix.ToHomo()  
desc：to homo matrix  
arg ：－－－  
ret ：to homo matrix:N6LMatrix  
   
* N6LMatrix.ToNormal()  
desc：to normal matrix  
arg ：－－－  
ret ：to normal matrix:N6LMatrix  
   
* N6LMatrix.Pos()  
desc：get position  
arg ：－－－  
ret ：get position:N6LVector  
   
* N6LMatrix.Scale()  
desc：get scale  
arg ：－－－  
ret ：get scale:N6LVector  
   
* N6LMatrix.Trace()  
desc：trace  
arg ：－－－  
ret ：trace:real  
   
* N6LMatrix.Quaternion()  
desc：Quaternion acquisition of the rotation matrix  
arg ：－－－  
ret ：Quaternion acquisition of the rotation matrix:N6LQuaternion  
   
* N6LMatrix.Vector()  
desc：Rotation vector acquisition of the rotation matrix  
arg ：－－－  
ret ：Rotation vector acquisition of the rotation matrix:N6LVector  
   
* N6LMatrix.PosVector()  
desc：get position vector  
arg ：－－－  
ret ：get position vector:N6LVector  
   
* N6LMatrix.FrustumMat(left, right, top, bottom, near, far)  
desc：Frustum  
arg ：left,right,top,bottom,near,far:real:Frustum arg   
ret ：Frustum:N6LMatrix  
   
* N6LMatrix.OrthoMat(left, right, top, bottom, near, far)  
desc：Ortho  
arg ：left,right,top,bottom,near,far:real:Frustum arg   
ret ：Ortho:N6LMatrix  
   
* N6LMatrix.Householder()  
desc：Householder  
arg ：－－－  
ret ：Householder:N6LMatrix  
   
* N6LMatrix.QRMethod()  
desc：QRMethod  
arg ：－－－  
ret ：Eigenvalues diagonal section:N6LMatrix  
   
* N6LMatrix.EulerAngle(first, second, third, eps)  
desc：get euler angle  
arg ：first,second,third:1,2,3,Each axis order,eps:error,optional  
ret ：get euler angle,:N6LVector,rad  
note：the second axis may have an angle, if the angle of the other of the axis of zero  
It has a second axis in the recalculation to the first axis  

### N6LQuaternion
  
   
* N6LQuaternion：construction  
member：  
N6LQuaternion.q:N6LVector   
N6LQuaternion.q.x[0]:w N6LQuaternion.q.x[1]:x    
N6LQuaternion.q.x[2]:y N6LQuaternion.q.x[3]:z   
var N6LQuaternion = function(w, x, y, z) { }  
format：  
var quta = new N6LQuaternion(1, 0, 0, 0);  
var quta = new N6LQuaternion(1, new Array(0, 0, 0));  
var quta = new N6LQuaternion(new Array(1, 0, 0, 0));  
var quta = new N6LQuaternion(new N6LVector([1, 0, 0, 0]));  
var quta = new N6LQuaternion(1, new N6LVector([1, 2, 3, 4], true));  
var quta = new N6LQuaternion([1, 0, 0, 0]);  
var qutb = new N6LQuaternion(quta); //deep copy  
   
* N6LQuaternion.Equal(rh)  
desc：if equal  
arg ：rh:N6LQuaternion:compare this  
ret ：true:false:  
   
* N6LQuaternion.EpsEqual(rh, eps)  
desc：if equal  
arg ：rh:N6LQuaternion:compare this:eps:error:real  
ret ：true:false:  
   
* N6LQuaternion.Str()  
desc：convert to string  
arg ：－－－  
ret ：convert to string:string  
   
* N6LQuaternion.Parse(str)  
desc：convert from string  
arg ：str:string  
ret ：convert from string:N6LQuaternion  
   
* N6LQuaternion.Add(rh)  
desc：add  
arg ：rh:N6LQuaternion,real  
ret ：add:N6LQuaternion  
   
* N6LQuaternion.Sub(rh)  
desc：sub  
arg ：rh:N6LQuaternion,real  
ret ：sub:N6LQuaternion  
   
* N6LQuaternion.Mul(rh)  
desc：mul  
arg ：rh:N6LQuaternion,real  
ret ：mul:N6LQuaternion  
   
* N6LQuaternion.Div(rh)  
desc：div  
arg ：rh:real  
ret ：div:N6LQuaternion  
   
* N6LQuaternion.DivMax()  
desc：Divided by the value of the maximum absolute value of the element  
arg ：－－－  
ret ：Divided by the value of the maximum absolute value of the element:N6LQuaternion  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LQuaternion.Repair(eps)  
desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
arg ：eps:error,real  
ret ：renew this  
   
* N6LQuaternion.SquareAbs()  
desc：square absolute  
arg ：－－－  
ret ：square absolute:real  
   
* N6LQuaternion.Abs()  
desc：absolute  
arg ：－－－  
ret ：absolute:real  
   
* N6LQuaternion.ConjugationQuat()  
desc：Conjugation  
arg ：－－－  
ret ：Conjugation:N6LQuaternion  
   
* N6LQuaternion.InverseQuat()  
desc：Inverse  
arg ：－－－  
ret ：Inverse:N6LQuaternion  
   
* N6LQuaternion.ZeroQuat()  
desc：zero  
arg ：－－－  
ret ：zero:N6LQuaternion  
   
* N6LQuaternion.UnitQuat()  
desc：unit quaternion  
arg ：－－－  
ret ：unit quaternion:N6LQuaternion  
   
* N6LQuaternion.NormalQuat()  
desc：normalize  
arg ：－－－  
ret ：normalize:N6LQuaternion  
  
* N6LQuaternion.Dot(rh)  
desc：dot  
arg ：rh:N6LQuaternion  
ret ：dot:real  
   
* N6LQuaternion.RotAxisQuat(axis, theta)  
desc：rotate axis  
arg ：axis:N6LVectortheta:rad  
ret ：rotate axis:N6LQuaternion  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LQuaternion.RotAxisVec(rotvec)  
desc：rotate axis(calc quaternion)  
arg ：rotvec:N6LVector,rotate vector  
ret ：rotate axis:N6LQuaternion<br>;
   
* N6LQuaternion.Axis(axis, theta)  
desc：rotate axis  
arg ：axis[0]:N6LVector,ret :theta[0]:rad,ret   
ret ：－－－  
  
* N6LQuaternion.Matrix()  
desc：Rotation matrix from the quaternion  
arg ：－－－  
ret ：Rotation matrix:N6LMatrix  
   
* N6LQuaternion.Lerp(q, t)  
desc：lerp  
arg ：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):  
ret ：lerp:N6LQuaternion  
   
* N6LQuaternion.Slerp(q, t)  
desc：slerp  
arg ：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):  
ret ：slerp:N6LQuaternion  
   
* N6LQuaternion.Slerp2(q, t)  
desc：slerp  
arg ：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):  
ret ：slerp:N6LQuaternion  
   
* N6LQuaternion.Sphere4D()  
desc：Sphere4D  
arg ：－－－  
ret ：Sphere4D:N6LVector  
  
### N6LLnQuaternion  
  
   
* N6LLnQuaternion：construction  
member：  
N6LLnQuaternion.q:N6LVector   
N6LLnQuaternion.q.x[0]:x N6LLnQuaternion.q.x[1]:y N6LLnQuaternion.q.x[2]:z   
var N6LLnQuaternion = function(x, y, z) { }  
format：  
var quta = new N6LLnQuaternion(0, 0, 0);  
var quta = new N6LLnQuaternion(new Array(0, 0, 0));  
var quta = new N6LLnQuaternion(new N6LVector([0, 0, 0]));  
var quta = new N6LLnQuaternion([0, 0, 0]);  
var qutb = new N6LLnQuaternion(quta); //deep copy  
   
* N6LLnQuaternion.Equal(rh)  
desc：if equal  
arg ：rh:N6LLnQuaternion:compare this  
ret ：true:false:  
   
* N6LLnQuaternion.EpsEqual(rh, eps)  
desc：if equal  
arg ：rh:N6LLnQuaternion:compare this:eps:error:real  
ret ：true:false:  
   
* N6LLnQuaternion.Str()  
desc：convert to string  
arg ：－－－  
ret ：convert to string:string  
   
* N6LLnQuaternion.Parse(str)  
desc：convert from string  
arg ：str:string  
ret ：convert from string:N6LLnQuaternion  
   
* N6LLnQuaternion.Add(rh)  
desc：add  
arg ：rh:N6LLnQuaternion  
ret ：add:N6LLnQuaternion  
   
* N6LLnQuaternion.Sub(rh)  
desc：sub  
arg ：rh:N6LLnQuaternion  
ret ：sub:N6LLnQuaternion  
   
* N6LLnQuaternion.Mul(rh)  
desc：mul  
arg ：rh:real  
ret ：mul:N6LLnQuaternion  
   
* N6LLnQuaternion.Div(rh)  
desc：div  
arg ：rh:real  
ret ：div:N6LLnQuaternion  
   
* N6LLnQuaternion.DivMax()  
desc：Divided by the value of the maximum absolute value of the element  
arg ：－－－  
ret ：Divided by the value of the maximum absolute value of the element:N6LLnQuaternion  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LLnQuaternion.Repair(eps)  
desc：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
arg ：eps:error,real  
ret ：renew this  
   
* N6LLnQuaternion.SquareAbs()  
desc：square absolute  
arg ：－－－  
ret ：square absolute:real  
   
* N6LLnQuaternion.Abs()  
desc：absolute  
arg ：－－－  
ret ：absolute:real  
   
* N6LLnQuaternion.ZeroLnQuat()  
desc：zero  
arg ：－－－  
ret ：zero:N6LLnQuaternion  
   
* N6LLnQuaternion.RotAxisLnQuat(axis, theta)  
desc：rotate axis  
arg ：axis:N6LVector:theta:rad  
ret ：rotate axis:N6LLnQuaternion  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LLnQuaternion.Axis(axis, theta)  
desc：rotate axis  
arg ：axis[0]:N6LVector,ret :theta[0]:rad,ret   
ret ：－－－  
  
* N6LLnQuaternion.Lerp(q, t)  
desc：lerp  
arg ：q:N6LLnQuaternion,End status:t:0.0(start)～1.0(end):  
ret ：lerp:N6LQuaternion  
  : 
* N6LLnQuaternion.Lerp2(d0, q, d)  
desc：lerp  
arg ：d0:real:The weighted average of this:q[]:N6LLnQuaternion,Array:d[]:real,Array:weighted average  
ret ：lerp:N6LQuaternion  
  
### N6LKeyBoard
  
   
* N6LKeyBoard：construction  
desc：As ＜body onload="initKeyBoard(tman, function() { func(); });"＞ in HTMLfile  
tman : timer manager and func keyboard check method is tied.  
ex.　：  
function func(){  
　if(KeyB.keystate[KeyB.indexof(KeyB.ToRealID("VK_N1"))]) {//numpad 1 KeyDown  
．．．skip．．．  
  }  
  if(KeyB.keystate[KeyB.indexof(KeyB.ToRealID("VK_N2"))]) {//numpad 2 KeyDown  
．．．skip．．．  
  }  
．．．skip．．．}  
  case 401: 
* N6LKeyBoard.setfunc(func)  
desc：keyboard check method is tied  
arg ：func:method  
ret ：－－－  
   
* N6LKeyBoard.setenable(b)  
desc：keyboard enable set  
arg ：b:enable:bool  
ret ：－－－  
   
* N6LKeyBoard.indexof(str)  
desc：index of real name ID  
arg ：str:string:real name ID  
ret ：index of real name ID:integer  
   
* N6LKeyBoard.addAlias(ary)  
desc：additional alias name ID  
arg ：ary:Array:[srcID, destID]  
ret ：－－－  
   
* N6LKeyBoard.delAlias(str)  
desc：delete str was tied alias name  
arg ：str:string:real name ID or alias name ID  
ret ：－－－  
   
* N6LKeyBoard.addUnityAlias(ary)  
desc：additional unity alias name ID  
arg ：ary:Array:[tiedID, aliasID, ...]  
ret ：－－－  
   
* N6LKeyBoard.delUnityAlias(str)  
desc：delete unity alias name ID  
arg ：str:string:aliasID  
ret ：－－－  
   
* N6LKeyBoard.UnityAlias(str)  
desc：get unity alias name by alias name  
arg ：str:string:aliasID  
ret ：unity alias name ID:string  
   
* N6LKeyBoard.isPressUnityAlias(str)  
desc：press info of unity alias name ID  
arg ：str:string:aliasID  
ret ：press info of unity alias name ID:bool  
   
* N6LKeyBoard.ToAlias(str, ret)  
desc：convert to alias name ID  
arg ：str:string:real name ID:ret:Array:list of alias name ID:ret  
ret ：deepest alias name ID:string  
   
* N6LKeyBoard.ToReal(str)  
desc：convert to real name ID  
arg ：str:string:alias name ID  
ret ：real name ID:string  
  
  
  
