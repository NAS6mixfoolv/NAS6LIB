### N6LTimerMan
  
* **N6LTimerMan：construction**  
* * **member**：  
  * *N6LTimerMan.interval:interval timer check  
  * *N6LTimerMan.enable:  
  * *N6LTimerMan.timer[]:timers  
    * **member（N6LTimerMan.timer[id]）**：  
      *N6LTimerMan.timer[id].ID:  
      *N6LTimerMan.timer[id].enable:  
      *N6LTimerMan.timer[id].starttime:  
      *N6LTimerMan.timer[id].alerm:after msec  
      *N6LTimerMan.timer[id].alermfunc:call method  
  * **format**：  
var tman = new N6LTimerMan();  
Note: even if some make a timer, setTimeout () is one of centralized management to N6LTimerMan  
  
* **N6LTimerMan.add()**  
  * **Description**：add timer
  * **Parameters**：－－－  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.changeinterval(int)**  
  * **Description**：change interval  
  * **Parameters**：int：msec  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.start()**  
  * **Description**：start  
  * **Parameters**：－－－  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.stop()**  
  * **Description**：stop  
  * **Parameters**：－－－  
  * **Returns**    ：－－－  

### N6LTimerMan.timer[id]  
   
* **N6LTimerMan.timer[id].start()**  
  * **Description**：start  
  * **Parameters**：－－－  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.timer[id].stop()**  
  * **Description**：stop  
  * **Parameters**：－－－  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.timer[id].reset()**  
  * **Description**：reset(Start time update)  
  * **Parameters**：－－－  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.timer[id].copy(src)**  
  * **Description**：copy  
  * **Parameters**：src：  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.timer[id].now()**  
  * **Description**：past time  
  * **Parameters**：－－－  
  * **Returns**    ：－－－  
   
* **N6LTimerMan.timer[id].setalerm(func(id),alm)**  
  * **Description**：set alerm  
  * **Parameters**：func(id)：Method that is called when it is time  
alm：msec  
  * **Returns**    ：－－－  
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
   
* **N6LVector：construction**  
  * **member**：  
    * N6LVector.x[]:Real   
    * N6LVector.x[0]:w N6LVector.x[1]:x N6LVector.x[2]:y N6LVector.x[3]:z　etc...   
    * N6LVector.bHomo:if Homogeneous  
var N6LVector = function(rh, bh) { }  
* **format**：  
  * Fourth-order vector  
    * var veca = new N6LVector(4);  
  * Homo fourth-order vector  
    * var veca = new N6LVector(4, true);  
  * Third-order vector  
    * var veca = new N6LVector(new Array(1, 2, 3));  
  * x-axis unit homo fourth-order vector  
    * var veca = new N6LVector(new Array(1, 1, 0, 0), true);  
    * var veca = new N6LVector([1, 1, 0, 0], true);  
    * var vecb = new N6LVector(veca); //deep copy  
   
* **N6LVector.Equal(rh)**  
  * **Description**：if equal  
  * **Parameters**：rh:N6LVector:compare this  
  * **Returns**    ：true:false:  
   
* **N6LVector.EpsEqual(rh, eps)**  
  * **Description**：if equal  
  * **Parameters**：rh:N6LVector:compare this:eps:error:real  
  * **Returns**    ：true:false:  
   
* N6LVector.Str()  
  * **Description**：convert to string  
  * **Parameters**：－－－  
  * **Returns**    ：convert to string:string  
   
* N6LVector.Parse(str)  
  * **Description**：convert from string  
  * **Parameters**：str:string  
  * **Returns**    ：convert from string:N6LVector  
   
* N6LVector.ToX3DOM(b)  
  * **Description**：convert to x3dom.fields.SFVec[2/3/4]f  
  * **Parameters**：b:case 4→3、true:bool  
  * **Returns**    ：convert to x3dom.fields.SFVec[2/3/4]f:x3dom.fields.SFVec[2/3/4]f  
   
* N6LVector.FromX3DOM(sf)  
  * **Description**：convert from x3dom.fields.SFVec[2/3/4]f  
  * **Parameters**：sf:x3dom.fields.SFVec[2/3/4]f  
  * **Returns**    ：convert from x3dom.fields.SFVec[2/3/4]f:N6LVector  
   
* N6LVector.To3JS(b)  
  * **Description**：convert to THREE.Vector[2/3/4]  
  * **Parameters**：b:case 4→3、true:bool  
  * **Returns**    ：convert to THREE.Vector[2/3/4]:THREE.Vector[2/3/4]  
   
* N6LVector.From3JS(ary)  
  * **Description**：convert from Array  
  * **Parameters**：ary:Array()  
  * **Returns**    ：convert from Array:N6LVector  
   
* N6LVector.Add(rh)  
  * **Description**：add  
  * **Parameters**：rh:N6LVecto,real  
  * **Returns**    ：add:N6LVector  
   
* N6LVector.Sub(rh)  
  * **Description**：sub  
  * **Parameters**：rh:N6LVector,real  
  * **Returns**    ：sub:N6LVector  
   
* N6LVector.Mul(rh)  
  * **Description**：mul  
  * **Parameters**：rh:N6LVector,N6LMatrix,real  
  * **Returns**    ：mul:N6LVector,real  
   
* N6LVector.Div(rh)  
  * **Description**：div  
  * **Parameters**：rh:N6LVector,N6LMatrix,real  
  * **Returns**    ：div:N6LVector,real  
   
* N6LVector.SetHomo(rh)  
  * **Description**：set homo flag  
  * **Parameters**：rh:bool,set value  
  * **Returns**    ：set homo flag:N6LVector  
   
* N6LVector.Repair(eps)  
  * **Description**：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
  * **Parameters**：eps:error,real  
  * **Returns**    ：renew this  
   
* N6LVector.Dot(rh)  
  * **Description**：dot  
  * **Parameters**：rh:N6LVector  
  * **Returns**    ：dot:real  
   
* N6LVector.Cross(rh)  
  * **Description**：cross  
  * **Parameters**：rh:N6LVector  
  * **Returns**    ：cross:N6LVector,real  
   
* N6LVector.isParallel(rh)  
  * **Description**：if parallel  
  * **Parameters**：rh:N6LVector  
  * **Returns**    ：true:parallel:false:not parallel  
   
* N6LVector.Max()  
  * **Description**：The maximum absolute value of the value of the element (sign as it is)  
  * **Parameters**：－－－  
  * **Returns**    ：The maximum absolute value of the value of the element (sign as it is):real  
   
* N6LVector.DivMax()  
  * **Description**：Divided by the value of the maximum absolute value of the element  
  * **Parameters**：－－－  
  * **Returns**    ：Divided by the value of the maximum absolute value of the element:N6LVector  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LVector.LookAtMat2(rh)  
  * **Description**：lookat  
  * **Parameters**：this:N6LVector:eye, rh:N6LVector,N6LMatrix:lookat  
  * **Returns**    ：lookat:N6LMatrix  
   
* N6LVector.RotArcQuat(rh)  
  * **Description**：rotation arc(arc ball)  
  * **Parameters**：this:N6LVector:vec1,rh:N6LVector:vec2  
  * **Returns**    ：rotation arc(arc ball):N6LQuaternion  
  
* N6LVector.ZeroVec()  
  * **Description**：zero  
  * **Parameters**：－－－  
  * **Returns**    ：zero:N6LVector  
  
* N6LVector.UnitVec(a)  
  * **Description**：unit vector  
  * **Parameters**：a:Axis specification  
  * **Returns**    ：unit vector:N6LVector  
   
* N6LVector.NormalVec(a)  
  * **Description**：normalize  
  * **Parameters**：a:a.Sub(this);normalize (this→a vector),optional  
  * **Returns**    ：normalize:N6LVector  
   
* N6LVector.SquareAbs()  
  * **Description**：square absolute  
  * **Parameters**：－－－  
  * **Returns**    ：square absolute:real  
   
* N6LVector.Abs()  
  * **Description**：absolute  
  * **Parameters**：－－－  
  * **Returns**    ：absolute:real  
   
* N6LVector.DirectionCosine()  
  * **Description**：DirectionCosine  
  * **Parameters**：－－－  
  * **Returns**    ：DirectionCosine:N6LVector  
   
* N6LVector.Theta(rh)  
  * **Description**：angle  
  * **Parameters**：rh:N6LVector  
  * **Returns**    ：angle:rad  
   
* N6LVector.ThetaN(rh)  
  * **Description**：angle  
  * **Parameters**：rh:N6LVector  
  * **Returns**    ：true:-π/2＜θ≦π/2:false:Otherwise up to ± π  
   
* N6LVector.Rot2D(theta)  
  * **Description**：rotate 2d  
  * **Parameters**：theta:rad  
  * **Returns**    ：rotate 2d:N6LVector  
   
* N6LVector.RotAxis(axis, theta)  
  * **Description**：rotate axis  
  * **Parameters**：axis:N6LVector:theta:rad  
  * **Returns**    ：rotate axis:N6LVector  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LVector.RotAxisQuat(axis, theta)  
  * **Description**：rotate axis(calc quaternion)  
  * **Parameters**：axis:N6LVector:theta:rad  
  * **Returns**    ：rotate axis:N6LVector  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LVector.RotAxisVec(rotvec)  
  * **Description**：rotate axis(calc quaternion)  
  * **Parameters**：rotvec:N6LVector,rotate vector  
  * **Returns**    ：rotate axis:N6LVector  
   
* N6LVector.ProjectAxis(axis)  
  * **Description**：project axis  
  * **Parameters**：axis:N6LVector  
  * **Returns**    ：project axis:N6LVector  
note：Homogeneous coordinate projection of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
  
* N6LVector.DistanceDotLine(p, a, b)  
  * **Description**：Distance of a point and a straight line  
  * **Parameters**：p:N6LVector,point:a:N6LVector,Straight line end point:b:N6LVector,Straight line end point  
  * **Returns**    ：Distance of a point and a straight line:real  
  
* N6LVector.DistancePointLineLine(reta, retb, a0, a1, b0, b1)  
  * **Description**：Distance and the closest position of the straight line and the straight line  
  * **Parameters**：reta[0]:N6LVector,a on the closest approach location points,  
Returns:retb[0]:N6LVector,b on the closest approach location points,  
Returns:  
a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:  
b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:  
  * **Returns**    ：Distance of the straight line and a straight line:real  
   
* N6LVector.PointLineLine(reta, retb, a0, a1, b0, b1)  
  * **Description**：The closest position of the straight line and the straight line  
  * **Parameters**：reta[0]:N6LVector,a on the closest approach location points,  
Returns:retb[0]:N6LVector,b on the closest approach location points,  
Returns:  
a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:  
b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:  
  * **Returns**    ：true:crossed:false:not crossed:  
   
* N6LVector.DistanceLineLine(a0, a1, b0, b1)  
  * **Description**：Distance of the straight line and a straight line  
  * **Parameters**：a0:N6LVector,Straight a endpoints:a1:N6LVector,Straight a endpoints:  
b0:N6LVector,Straight b endpoints:b1:N6LVector,Straight b endpoints:  
  * **Returns**    ：Distance of the straight line and a straight line:real  
   
* N6LVector.Homogeneous()  
  * **Description**：Homogeneous  
  * **Parameters**：－－－  
  * **Returns**    ：Homogeneous:N6LVector  
   
* N6LVector.ToHomo()  
  * **Description**：to homo vector  
  * **Parameters**：－－－  
  * **Returns**    ：to homo vector:N6LVector  
   
* N6LVector.ToNormal()  
  * **Description**：to normal vector  
  * **Parameters**：－－－  
  * **Returns**    ：to normal vector:N6LVector  
   
* N6LVector.Matrix()  
  * **Description**：Rotation matrix from the rotation vector  
  * **Parameters**：－－－  
  * **Returns**    ：Rotation matrix from the rotation vector:N6LMatrix  
   
* N6LVector.PosVecGetTQ(out)  
  * **Description**：get position vector to translated and quaternion  
  * **Parameters**：out[]  
  * **Returns**    ：get position vector to translated and quaternion:out[0]:N6LVector:translated,out[1]:N6LQuaternion:quaternion,  
   
* N6LVector.PosVecSetTQ(t,q)  
  * **Description**：set position vector to translated and quaternion  
  * **Parameters**：t:N6LVector:translated,q:N6LQuaternion:quaternion  
  * **Returns**    ：set position vector to translated and quaternion:N6LVector  
   
* N6LVector.PosVecMatrix()  
  * **Description**：position vector to rotate matrix  
  * **Parameters**：－－－  
  * **Returns**    ：position vector to rotate matrix:N6LMatrix  
  
* N6LVector.PosVecMul(rh)  
  * **Description**：multiple position vector  
  * **Parameters**：rh:N6LVector():position vector  
  * **Returns**    ：multiple position vector:N6LVector  
   
* N6LVector.Sphere4D()  
  * **Description**：Sphere4D  
  * **Parameters**：－－－  
  * **Returns**    ：Sphere4D:N6LQuaternion  
   
* N6LVector.FromLogAxis(base, range, x)  
  * **Description**：From an infinite logarithmic axis to the normal axis  
  * **Parameters**：base:real,range:real,x:real:infinite logarithmic axis  
  * **Returns**    ：normal axis:real  
   
* N6LVector.ToLogAxis(base, range, x)  
  * **Description**：From the normal axis to infinite logarithmic axis  
  * **Parameters**：base:real,range:real,x:real:normal axis  
  * **Returns**    ：infinite logarithmic axis:real  
   
* N6LVector.FrustumInfVec(base, range, v)  
  * **Description**：Infinity perspective projection  
  * **Parameters**：base:real,range:real,v:N6LVector:Parameters  
  * **Returns**    ：Infinity perspective projection:N6LVector  
   
* N6LVector.InvFrustumInfVec(base, range, v, z)  
  * **Description**：Inverse infinity perspective projection  
  * **Parameters**：base:real,range:real,v:N6LVector:Parameters,z:real  
  * **Returns**    ：Inverse infinity perspective projection:N6LVector  
  
### N6LMatrix
  
* N6LMatrix：construction  
  * **member**：  
    * N6LMatrix.x[]:N6LVector   
    * N6LMatrix.x[0]:N6LVector:w N6LMatrix.x[1]:N6LVector:x    
    * N6LMatrix.x[2]:N6LVector:y N6LMatrix.x[3]:N6LVector:z　etc...   
    * N6LMatrix.bHomo:if  Homogeneous  
var N6LMatrix = function(rh, m , n) { }  
* **format**：  
  * **4 rows and 4 columns**  
    * var mata = new N6LMatrix(4);  
  * **4 rows and 8 columns**  
    * var mata = new N6LMatrix(4, 8);  
  * **4 rows and 4 columns unit matrix**  
    * var mata = new N6LMatrix(  
        new Array(1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1), 4, 4);  
    * var mata = new N6LMatrix(new Array(new N6LVector(new Array(1, 0, 0, 0)),  
    　  new N6LVector(new Array(0, 1, 0, 0)), new N6LVector(new Array(0, 0, 1, 0)),  
　      new N6LVector(new Array(0, 0, 0, 1)) ));  
    * var mata = new N6LMatrix([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] );  
    * var matb = new N6LMatrix(mata); //deep copy  
**note**:Fourth-order or more is considered to be a homogeneous coordinates  
If you want to make a fourth-order or more conventional coordinate N6LMatrix.SetHomo(false)  
Please continue to build declaration  
   
* N6LMatrix.Equal(rh)  
  * **Description**：if equal  
  * **Parameters**：rh:N6LMatrix:compare this  
  * **Returns**    ：true:false:  
   
* N6LMatrix.EpsEqual(rh, eps)  
  * **Description**：if equal  
  * **Parameters**：rh:N6LMatrix:compare this:eps:error:real  
  * **Returns**    ：true:false:  
   
* N6LMatrix.Str()  
  * **Description**：convert to string  
  * **Parameters**：－－－  
  * **Returns**    ：convert to string:string  
   
* N6LMatrix.Parse(str)  
  * **Description**：convert from string  
  * **Parameters**：str:string  
  * **Returns**    ：convert from string:N6LMatrix  
   
* N6LMatrix.ToX3DOM()  
  * **Description**：convert to x3dom.fields.SFMatrix4f  
  * **Parameters**：－－－  
  * **Returns**    ：convert to x3dom.fields.SFMatrix4f:x3dom.fields.SFMatrix4f  
   
* N6LMatrix.FromX3DOM(sf)  
  * **Description**：convert from x3dom.fields.SFMatrix4f  
  * **Parameters**：sf:x3dom.fields.SFMatrix4f  
  * **Returns**    ：convert from x3dom.fields.SFMatrix4f:N6LMatrix  
   
* N6LMatrix.To3JS()  
  * **Description**：convert to THREE.Matrix4  
  * **Parameters**：－－－  
  * **Returns**    ：convert to THREE.Matrix4:THREE.Matrix4  
   
* N6LMatrix.From3JS(ary)  
  * **Description**：convert from Array  
  * **Parameters**：ary:Array()  
  * **Returns**    ：convert from Array:N6LMatrix  
   
* N6LMatrix.GetCol(rh)  
  * **Description**：get column  
  * **Parameters**：rh:int:column  
  * **Returns**    ：get column:N6LVector  
   
* N6LMatrix.GetRow(rh)  
  * **Description**：get row  
  * **Parameters**：rh:int:row  
  * **Returns**    ：get row:N6LVector  
   
* N6LMatrix.SetCol(rh, val)  
  * **Description**：set column  
  * **Parameters**：rh:int:columnval:N6LVector:value  
  * **Returns**    ：set column:N6LMatrix  
   
* N6LMatrix.SetRow(rh, val)  
  * **Description**：set row  
  * **Parameters**：rh:int:row:val:N6LVector:value  
  * **Returns**    ：set row:N6LMatrix  
   
* N6LMatrix.Add(rh)  
  * **Description**：add  
  * **Parameters**：rh:N6LMatrix,real  
  * **Returns**    ：add:N6LMatrix  
   
* N6LMatrix.Sub(rh)  
  * **Description**：sub  
  * **Parameters**：rh:N6LMatrix,real  
  * **Returns**    ：sub:N6LMatrix  
   
* N6LMatrix.Mul(rh)  
  * **Description**：mul  
  * **Parameters**：rh:N6LMatrix,N6LVector,real  
  * **Returns**    ：mul:N6LMatrix,N6LVector  
   
* N6LMatrix.Div(rh)  
  * **Description**：div  
  * **Parameters**：rh:N6LMatrix,N6LVector,real  
  * **Returns**    ：div:N6LMatrix,N6LVector  
   
* N6LMatrix.SetHomo(rh)  
  * **Description**：set homo flag  
  * **Parameters**：rh:bool,set value  
  * **Returns**    ：set homo flag:N6LMatrix  
   
* N6LMatrix.Repair(eps)  
  * **Description**：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
  * **Parameters**：eps:error,real  
  * **Returns**    ：renew this  
   
* N6LMatrix.Max()  
  * **Description**：The maximum absolute value of the value of the element (sign as it is)  
  * **Parameters**：－－－  
  * **Returns**    ：The maximum absolute value of the value of the element (sign as it is):real  
   
* N6LMatrix.DivMax()  
  * **Description**：Divided by the value of the maximum absolute value of the element  
  * **Parameters**：－－－  
  * **Returns**    ：Divided by the value of the maximum absolute value of the element:N6LMatrix  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LMatrix.ZeroMat()  
  * **Description**：zero  
  * **Parameters**：－－－  
  * **Returns**    ：zero:N6LMatrix  
   
* N6LMatrix.UnitMat()  
  * **Description**：unit matrix  
  * **Parameters**：－－－  
  * **Returns**    ：unit matrix:N6LMatrix  
   
* N6LMatrix.NormalMat()  
  * **Description**：normalize  
  * **Parameters**：－－－  
  * **Returns**    ：normalize:N6LMatrix  
   
* N6LMatrix.TransposedMat()  
  * **Description**：transpose  
  * **Parameters**：－－－  
  * **Returns**    ：transpose:N6LMatrix  
   
* N6LMatrix.TranslatedMat(rh)  
  * **Description**：translate  
  * **Parameters**：rh:N6LVector  
  * **Returns**    ：translate:N6LMatrix  
   
* N6LMatrix.ScaleMat(rh)  
  * **Description**：scale  
  * **Parameters**：rh:N6LVector,real  
  * **Returns**    ：scale:N6LMatrix  
   
* N6LMatrix.AffineMat(scale, rotate, translate)  
  * **Description**：affine  
  * **Parameters**：scale:N6LVector,real, rotate:N6LMatrix,N6LVector(rotate vector),N6LQuaternion, translate:N6LVector  
  * **Returns**    ：affine:N6LMatrix  
   
* N6LMatrix.MoveMat(outmat, outv, d, pyr, v, a, vmin, vmax)  
  * **Description**：move  
  * **Parameters**：outmat[0]:N6LMatrix:ret:d only matrix after the movement that has translated、outv[0]:N6LVector:ret:Velocity after the movement  
　　：d:N6LVector:translated outmat[0] only d、pyr:N6LVector:4dimension:pitch yaw roll  
　　：v:real:velocity:N6LVector:translated、a:real:accel、vmin,vmax:real:limit of velocity:if ==987654321.0、no limit  
  * **Returns**    ：mved matrix:N6LMatrix  
   
* N6LMatrix.LookAtMat(eye, lookat, up)  
  * **Description**：lookat  
  * **Parameters**：eye:N6LVector, lookat:N6LVector, up:N6LVector  
  * **Returns**    ：lookat:N6LMatrix  
   
* N6LMatrix.LookAtMat2(rh)  
  * **Description**：lookat  
  * **Parameters**：this:N6LVector:eye, rh:N6LVector,N6LMatrix:lookat  
  * **Returns**    ：lookat:N6LMatrix  
   
* N6LMatrix.InverseMat(dt, sw)  
  * **Description**：(Using the simultaneous linear equation solving) the inverse matrix  
　　：sw:int:switch of calc、optional  
　　：1:Use TransposedMat():2:Use InverseMat00():3:Use InverseMat01():4:Use DeterminMatInvMat()  
　　：undefined:Use Global value SwDefInverseMat(=1:default):other:"Error"  
  * **Parameters**：dt:Array(Output Parameter)Determinant,
  An array where the determinant of the matrix will be stored at dt[0].  
  This parameter is used to return multiple values (inverse matrix and determinant).  

  * **Returns**    ：inverse matrix:N6LMatrix  
   
* N6LMatrix.InverseMat00(dt)  
  * **Description**：(Using the simultaneous linear equation solving) the inverse matrix  
  * **Parameters**：dt:Array(Output Parameter)Determinant,  
  An array where the determinant of the matrix will be stored at dt[0].  

  * **Returns**    ：inverse matrix:N6LMatrix  
   
* N6LMatrix.InverseMat01(dt)  
  * **Description**：(Sweep-out method using a) inverse matrix  
  * **Parameters**：dt:Array(Output Parameter)Determinant,  
  An array where the determinant of the matrix will be stored at dt[0].  
  * **Returns**    ：inverse matrix:N6LMatrix  
   
* N6LMatrix.DeterminMatInvMat(dt)  
  * **Description**：(Using the LU decomposition method) the inverse matrix  
  * **Parameters**：dt:Array(Output Parameter)Determinant,  
  An array where the determinant of the matrix will be stored at dt[0].  
  * **Returns**    ：inverse matrix:N6LMatrix  
   
* N6LMatrix.DeterminMat(dt)  
  * **Description**：Determin  
  * **Parameters**：dt:Array(Output Parameter)Determinant,  
  An array where the determinant of the matrix will be stored at dt[0].  
  * **Returns**    ：Determin:real  
   
* N6LMatrix.Jacobi(n, ct, eps, A, A1, A2, X1, X2)  
  * **Description**：Eigenvalues and eigenvectors of a real symmetric matrix (Jacobi)  
  * **Parameters**：n : Order：ct : The maximum number of repetitions：eps : Convergence criteria：  
A[0] : target matrix：A1[0], A2[0] : work（nxn matrix），A1 diagonal elements are the eigenvalues of：  
X1[0], X2[0] : work（nxn matrix），Each column of the X1 is eigenvector  
  * **Returns**    ：0:normal:1:It does not converge:  
   
* N6LMatrix.EigenVec(ct, eps, A, det, eigen)  
  * **Description**：Eigenvalues and eigenvectors of a real symmetric matrix (Jacobi)  
  * **Parameters**：n : Order：ct : The maximum number of repetitions：eps : Convergence criteria：  
A[0] : target matrix：det[0] : eigenvalues,  * **Returns**    ：eigen[0] :eigenvectors, Returns  
  * **Returns**    ：0:normal:1:It does not converge:  
   
* N6LMatrix.DiagonalMat(ct, eps)  
  * **Description**：DiagonalMatrix  
  * **Parameters**：ct : The maximum number of repetitions：eps : Convergence criteria：Both Optional  
  * **Returns**    ：eigenvectors:N6LMatrix  
   
* N6LMatrix.Diagonal(ct, eps)  
  * **Description**：Diagonal  
  * **Parameters**：ct : The maximum number of repetitions：eps : Convergence criteria：Both Optional  
  * **Returns**    ：Diagonal:N6LMatrix  
  
* N6LMatrix.Rot2D(theta)  
  * **Description**：rotate 2D  
  * **Parameters**：theta:rad  
  * **Returns**    ：rotate matrix:N6LMatrix  
   
* N6LMatrix.RotAxis(axis, theta)  
  * **Description**：rotate axis  
  * **Parameters**：axis:N6LVector:theta:rad  
  * **Returns**    ：rotate axis:N6LMatrix  
note:scale, translate information is kept  
Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LMatrix.RotAxisQuat(axis, theta)  
  * **Description**：rotate axis(calc quaternion)  
  * **Parameters**：axis:N6LVector:theta:rad  
  * **Returns**    ：rotate axis:N6LMatrix  
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
  * **Description**：rotate axis(calc quaternion)  
  * **Parameters**：rotvec:N6LVector,rotate vector  
  * **Returns**    ：rotate axis:N6LMatrix  
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
  * **Description**：Homogeneous  
  * **Parameters**：－－－  
  * **Returns**    ：Homogeneous:N6LMatrix  
   
* N6LMatrix.ToHomo()  
  * **Description**：to homo matrix  
  * **Parameters**：－－－  
  * **Returns**    ：to homo matrix:N6LMatrix  
   
* N6LMatrix.ToNormal()  
  * **Description**：to normal matrix  
  * **Parameters**：－－－  
  * **Returns**    ：to normal matrix:N6LMatrix  
   
* N6LMatrix.Pos()  
  * **Description**：get position  
  * **Parameters**：－－－  
  * **Returns**    ：get position:N6LVector  
   
* N6LMatrix.Scale()  
  * **Description**：get scale  
  * **Parameters**：－－－  
  * **Returns**    ：get scale:N6LVector  
   
* N6LMatrix.Trace()  
  * **Description**：trace  
  * **Parameters**：－－－  
  * **Returns**    ：trace:real  
   
* N6LMatrix.Quaternion()  
  * **Description**：Quaternion acquisition of the rotation matrix  
  * **Parameters**：－－－  
  * **Returns**    ：Quaternion acquisition of the rotation matrix:N6LQuaternion  
   
* N6LMatrix.Vector()  
  * **Description**：Rotation vector acquisition of the rotation matrix  
  * **Parameters**：－－－  
  * **Returns**    ：Rotation vector acquisition of the rotation matrix:N6LVector  
   
* N6LMatrix.PosVector()  
  * **Description**：get position vector  
  * **Parameters**：－－－  
  * **Returns**    ：get position vector:N6LVector  
   
* N6LMatrix.FrustumMat(left, right, top, bottom, near, far)  
  * **Description**：Frustum  
  * **Parameters**：left,right,top,bottom,near,far:real:Frustum Parameters  
  * **Returns**    ：Frustum:N6LMatrix  
   
* N6LMatrix.OrthoMat(left, right, top, bottom, near, far)  
  * **Description**：Ortho  
  * **Parameters**：left,right,top,bottom,near,far:real:Frustum Parameters  
  * **Returns**    ：Ortho:N6LMatrix  
   
* N6LMatrix.Householder()  
  * **Description**：Householder  
  * **Parameters**：－－－  
  * **Returns**    ：Householder:N6LMatrix  
   
* N6LMatrix.QRMethod()  
  * **Description**：QRMethod  
  * **Parameters**：－－－  
  * **Returns**    ：Eigenvalues diagonal section:N6LMatrix  
   
* N6LMatrix.EulerAngle(first, second, third, eps)  
  * **Description**：get euler angle  
  * **Parameters**：first,second,third:1,2,3,Each axis order,eps:error,optional  
  * **Returns**    ：get euler angle,:N6LVector,rad  
note：the second axis may have an angle, if the angle of the other of the axis of zero  
It has a second axis in the recalculation to the first axis  

### N6LQuaternion
  
   
* N6LQuaternion：construction  
  * **member**：  
    * N6LQuaternion.q:N6LVector   
    * N6LQuaternion.q.x[0]:w N6LQuaternion.q.x[1]:x    
    * N6LQuaternion.q.x[2]:y N6LQuaternion.q.x[3]:z   
var N6LQuaternion = function(w, x, y, z) { }  
* **format**：  
  * var quta = new N6LQuaternion(1, 0, 0, 0);  
  * var quta = new N6LQuaternion(1, new Array(0, 0, 0));  
  * var quta = new N6LQuaternion(new Array(1, 0, 0, 0));  
  * var quta = new N6LQuaternion(new N6LVector([1, 0, 0, 0]));  
  * var quta = new N6LQuaternion(1, new N6LVector([1, 2, 3, 4], true));  
  * var quta = new N6LQuaternion([1, 0, 0, 0]);  
  * var qutb = new N6LQuaternion(quta); //deep copy  
   
* N6LQuaternion.Equal(rh)  
  * **Description**：if equal  
  * **Parameters**：rh:N6LQuaternion:compare this  
  * **Returns**    ：true:false:  
   
* N6LQuaternion.EpsEqual(rh, eps)  
  * **Description**：if equal  
  * **Parameters**：rh:N6LQuaternion:compare this:eps:error:real  
  * **Returns**    ：true:false:  
   
* N6LQuaternion.Str()  
  * **Description**：convert to string  
  * **Parameters**：－－－  
  * **Returns**    ：convert to string:string  
   
* N6LQuaternion.Parse(str)  
  * **Description**：convert from string  
  * **Parameters**：str:string  
  * **Returns**    ：convert from string:N6LQuaternion  
   
* N6LQuaternion.Add(rh)  
  * **Description**：add  
  * **Parameters**：rh:N6LQuaternion,real  
  * **Returns**    ：add:N6LQuaternion  
   
* N6LQuaternion.Sub(rh)  
  * **Description**：sub  
  * **Parameters**：rh:N6LQuaternion,real  
  * **Returns**    ：sub:N6LQuaternion  
   
* N6LQuaternion.Mul(rh)  
  * **Description**：mul  
  * **Parameters**：rh:N6LQuaternion,real  
  * **Returns**    ：mul:N6LQuaternion  
   
* N6LQuaternion.Div(rh)  
  * **Description**：div  
  * **Parameters**：rh:real  
  * **Returns**    ：div:N6LQuaternion  
   
* N6LQuaternion.DivMax()  
  * **Description**：Divided by the value of the maximum absolute value of the element  
  * **Parameters**：－－－  
  * **Returns**    ：Divided by the value of the maximum absolute value of the element:N6LQuaternion  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LQuaternion.Repair(eps)  
  * **Description**：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
  * **Parameters**：eps:error,real  
  * **Returns**    ：renew this  
   
* N6LQuaternion.SquareAbs()  
  * **Description**：square absolute  
  * **Parameters**：－－－  
  * **Returns**    ：square absolute:real  
   
* N6LQuaternion.Abs()  
  * **Description**：absolute  
  * **Parameters**：－－－  
  * **Returns**    ：absolute:real  
   
* N6LQuaternion.ConjugationQuat()  
  * **Description**：Conjugation  
  * **Parameters**：－－－  
  * **Returns**    ：Conjugation:N6LQuaternion  
   
* N6LQuaternion.InverseQuat()  
  * **Description**：Inverse  
  * **Parameters**：－－－  
  * **Returns**    ：Inverse:N6LQuaternion  
   
* N6LQuaternion.ZeroQuat()  
  * **Description**：zero  
  * **Parameters**：－－－  
  * **Returns**    ：zero:N6LQuaternion  
   
* N6LQuaternion.UnitQuat()  
  * **Description**：unit quaternion  
  * **Parameters**：－－－  
  * **Returns**    ：unit quaternion:N6LQuaternion  
   
* N6LQuaternion.NormalQuat()  
  * **Description**：normalize  
  * **Parameters**：－－－  
  * **Returns**    ：normalize:N6LQuaternion  
  
* N6LQuaternion.Dot(rh)  
  * **Description**：dot  
  * **Parameters**：rh:N6LQuaternion  
  * **Returns**    ：dot:real  
   
* N6LQuaternion.RotAxisQuat(axis, theta)  
  * **Description**：rotate axis  
  * **Parameters**：axis:N6LVectortheta:rad  
  * **Returns**    ：rotate axis:N6LQuaternion  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LQuaternion.RotAxisVec(rotvec)  
  * **Description**：rotate axis(calc quaternion)  
  * **Parameters**：rotvec:N6LVector,rotate vector  
  * **Returns**    ：rotate axis:N6LQuaternion<br>;
   
* N6LQuaternion.Axis(axis, theta)  
  * **Description**：rotate axis  
  * **Parameters**：axis[0]:N6LVector,  * **Returns**    :theta[0]:rad, Returns  
  * **Returns**    ：－－－  
  
* N6LQuaternion.Matrix()  
  * **Description**：Rotation matrix from the quaternion  
  * **Parameters**：－－－  
  * **Returns**    ：Rotation matrix:N6LMatrix  
   
* N6LQuaternion.Lerp(q, t)  
  * **Description**：lerp  
  * **Parameters**：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):  
  * **Returns**    ：lerp:N6LQuaternion  
   
* N6LQuaternion.Slerp(q, t)  
  * **Description**：slerp  
  * **Parameters**：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):  
  * **Returns**    ：slerp:N6LQuaternion  
   
* N6LQuaternion.Slerp2(q, t)  
  * **Description**：slerp  
  * **Parameters**：q:N6LQuaternion,End status:t:0.0(start)～1.0(end):  
  * **Returns**    ：slerp:N6LQuaternion  
   
* N6LQuaternion.Sphere4D()  
  * **Description**：Sphere4D  
  * **Parameters**：－－－  
  * **Returns**    ：Sphere4D:N6LVector  
  
### N6LLnQuaternion  
  
   
* N6LLnQuaternion：construction  
  * **member**：  
    * N6LLnQuaternion.q:N6LVector   
    * N6LLnQuaternion.q.x[0]:x N6LLnQuaternion.q.x[1]:y N6LLnQuaternion.q.x[2]:z   
var N6LLnQuaternion = function(x, y, z) { }  
**format**：  
  * var quta = new N6LLnQuaternion(0, 0, 0);  
  * var quta = new N6LLnQuaternion(new Array(0, 0, 0));  
  * var quta = new N6LLnQuaternion(new N6LVector([0, 0, 0]));  
  * var quta = new N6LLnQuaternion([0, 0, 0]);  
  * var qutb = new N6LLnQuaternion(quta); //deep copy  
   
* N6LLnQuaternion.Equal(rh)  
  * **Description**：if equal  
  * **Parameters**：rh:N6LLnQuaternion:compare this  
  * **Returns**    ：true:false:  
   
* N6LLnQuaternion.EpsEqual(rh, eps)  
  * **Description**：if equal  
  * **Parameters**：rh:N6LLnQuaternion:compare this:eps:error:real  
  * **Returns**    ：true:false:  
   
* N6LLnQuaternion.Str()  
  * **Description**：convert to string  
  * **Parameters**：－－－  
  * **Returns**    ：convert to string:string  
   
* N6LLnQuaternion.Parse(str)  
  * **Description**：convert from string  
  * **Parameters**：str:string  
  * **Returns**    ：convert from string:N6LLnQuaternion  
   
* N6LLnQuaternion.Add(rh)  
  * **Description**：add  
  * **Parameters**：rh:N6LLnQuaternion  
  * **Returns**    ：add:N6LLnQuaternion  
   
* N6LLnQuaternion.Sub(rh)  
  * **Description**：sub  
  * **Parameters**：rh:N6LLnQuaternion  
  * **Returns**    ：sub:N6LLnQuaternion  
   
* N6LLnQuaternion.Mul(rh)  
  * **Description**：mul  
  * **Parameters**：rh:real  
  * **Returns**    ：mul:N6LLnQuaternion  
   
* N6LLnQuaternion.Div(rh)  
  * **Description**：div  
  * **Parameters**：rh:real  
  * **Returns**    ：div:N6LLnQuaternion  
   
* N6LLnQuaternion.DivMax()  
  * **Description**：Divided by the value of the maximum absolute value of the element  
  * **Parameters**：－－－  
  * **Returns**    ：Divided by the value of the maximum absolute value of the element:N6LLnQuaternion  
note：Prevents it by the ± 1.0 less than the value of each of the elements when the value of each element,  
　　：such as error accumulation is more than "slightly" and ± 1.0 is a fatal error  
   
* N6LLnQuaternion.Repair(eps)  
  * **Description**：Repair, fix them to the value in the vicinity of eps of 0.0or1.0or-1.0  
  * **Parameters**：eps:error,real  
  * **Returns**    ：renew this  
   
* N6LLnQuaternion.SquareAbs()  
  * **Description**：square absolute  
  * **Parameters**：－－－  
  * **Returns**    ：square absolute:real  
   
* N6LLnQuaternion.Abs()  
  * **Description**：absolute  
  * **Parameters**：－－－  
  * **Returns**    ：absolute:real  
   
* N6LLnQuaternion.ZeroLnQuat()  
  * **Description**：zero  
  * **Parameters**：－－－  
  * **Returns**    ：zero:N6LLnQuaternion  
   
* N6LLnQuaternion.RotAxisLnQuat(axis, theta)  
  * **Description**：rotate axis  
  * **Parameters**：axis:N6LVector:theta:rad  
  * **Returns**    ：rotate axis:N6LLnQuaternion  
note：Homogeneous coordinate rotation of the unit x-axis   
with the axis new N6LVector (4, true) .UnitVec (1);, etc. and please by substituting  
   
* N6LLnQuaternion.Axis(axis, theta)  
  * **Description**：rotate axis  
  * **Parameters**：axis[0]:N6LVector,  * **Returns**    :theta[0]:rad, Returns  
  * **Returns**    ：－－－  
  
* N6LLnQuaternion.Lerp(q, t)  
  * **Description**：lerp  
  * **Parameters**：q:N6LLnQuaternion,End status:t:0.0(start)～1.0(end):  
  * **Returns**    ：lerp:N6LQuaternion  
  : 
* N6LLnQuaternion.Lerp2(d0, q, d)  
  * **Description**：lerp  
  * **Parameters**：d0:real:The weighted average of this:q[]:N6LLnQuaternion,Array:d[]:real,Array:weighted average  
  * **Returns**    ：lerp:N6LQuaternion  
  
### N6LKeyBoard
  
   
* N6LKeyBoard：construction  
  * **Description**：As ＜body onload="initKeyBoard(tman, function() { func(); });"＞ in HTMLfile  
tman : timer manager and func keyboard check method is tied.  
**ex.**　：  
function func(){  
　if(KeyB.keystate[KeyB.indexof(KeyB.ToRealID("VK_N1"))]) {//numpad 1 KeyDown  
．．．skip．．．  
  }  
  if(KeyB.keystate[KeyB.indexof(KeyB.ToRealID("VK_N2"))]) {//numpad 2 KeyDown  
．．．skip．．．  
  }  
．．．skip．．．}  
   
* N6LKeyBoard.setfunc(func)  
  * **Description**：keyboard check method is tied  
  * **Parameters**：func:method  
  * **Returns**    ：－－－  
   
* N6LKeyBoard.setenable(b)  
  * **Description**：keyboard enable set  
  * **Parameters**：b:enable:bool  
  * **Returns**    ：－－－  
   
* N6LKeyBoard.indexof(str)  
  * **Description**：index of real name ID  
  * **Parameters**：str:string:real name ID  
  * **Returns**    ：index of real name ID:integer  
   
* N6LKeyBoard.addAlias(ary)  
  * **Description**：additional alias name ID  
  * **Parameters**：ary:Array:[srcID, destID]  
  * **Returns**    ：－－－  
   
* N6LKeyBoard.delAlias(str)  
  * **Description**：delete str was tied alias name  
  * **Parameters**：str:string:real name ID or alias name ID  
  * **Returns**    ：－－－  
   
* N6LKeyBoard.addUnityAlias(ary)  
  * **Description**：additional unity alias name ID  
  * **Parameters**：ary:Array:[tiedID, aliasID, ...]  
  * **Returns**    ：－－－  
   
* N6LKeyBoard.delUnityAlias(str)  
  * **Description**：delete unity alias name ID  
  * **Parameters**：str:string:aliasID  
  * **Returns**    ：－－－  
   
* N6LKeyBoard.UnityAlias(str)  
  * **Description**：get unity alias name by alias name  
  * **Parameters**：str:string:aliasID  
  * **Returns**    ：unity alias name ID:string  
   
* N6LKeyBoard.isPressUnityAlias(str)  
  * **Description**：press info of unity alias name ID  
  * **Parameters**：str:string:aliasID  
  * **Returns**    ：press info of unity alias name ID:bool  
   
* N6LKeyBoard.ToAlias(str, ret)  
  * **Description**：convert to alias name ID  
  * **Parameters**：str:string:real name ID:ret:Array:list of alias name ID:Returns  
  * **Returns**    ：deepest alias name ID:string  
   
* N6LKeyBoard.ToReal(str)  
  * **Description**：convert to real name ID  
  * **Parameters**：str:string:alias name ID  
  * **Returns**    ：real name ID:string  
  
  
  
