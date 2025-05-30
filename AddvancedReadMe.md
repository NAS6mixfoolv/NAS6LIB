 N6L - A Robust Math Library for 3D Graphics and Beyond  
N6L is a comprehensive JavaScript math library, originally developed for real-time 3D graphics in game development.  
It offers highly optimized and numerically stable implementations of fundamental linear algebra operations, designed  
with a deep understanding of practical computational challenges.  
  
### Files  
Here's a breakdown of the modules included in this library:  
  
common.js: Provides essential file download and utility functions.  
hsv.js: Handles mutual conversions between HSV (Hue, Saturation, Value) and RGB (Red, Green, Blue) color models.  
keyboard.js: Manages keyboard input for interactive applications.  
masspoint.js: Implements functionalities related to mass points, likely for physics simulations.  
matrix.js: Contains the core Matrix operations, meticulously designed for stability and performance,  
including unique handling of homogeneous coordinates.  
planet.js: Features functions for Kepler's equation, useful for orbital mechanics or celestial simulations.  
prime.js: Includes utilities for prime number related calculations.  
quaternion.js: Provides robust Quaternion operations for managing rotations, designed to avoid issues like gimbal lock.  
rngkt.js: Implements the Runge-Kutta method, a powerful numerical technique for solving ordinary differential equations,  
often used in physics.
timer.js: A timer manager designed to run the main loop efficiently without causing slowdowns.  
vector.js: Defines fundamental Vector operations for 2D, 3D, and N-dimensional calculations.  
  
### CLASS　NAME:  
file:./javascripts/nas6lib/timer.js: class N6LTimer: Time Notification  
file:./javascripts/nas6lib/timer.js: class N6LTimerMan: Time Notification Manager.  
A Framework For Implementing Multi-Threading In Single-Tasking JavaScript.  
file:./javascripts/nas6lib/vector.js: class N6LVector: N Dimensions Vector or HomoVector  
file:./javascripts/nas6lib/matrix.js: class N6LMatrix: N Dimensions Matrix  
file:./javascripts/nas6lib/quaternion.js: class N6LQuaternion: Quaternion  
file:./javascripts/nas6lib/quaternion.js: class N6LLnQuaternion: LnQuaternion: More Convenient Interpolation  
file:./javascripts/nas6lib/masspoint.js: class N6LMassPoint: MassPoint  
file:./javascripts/nas6lib/planet.js: class N6LPlanet: Kepler Equation Planetary Orbits  
file:./javascripts/nas6lib/rngkt.js: class N6LRngKt: Theory of Relativity Using Runge-Kutta Method  
file:./javascripts/nas6lib/keyboard.js: class N6LKeyBoard: KeyBoard. Custom Keyboard Management Class  
file:./javascripts/nas6lib/hsv.js: class N6LHsv: Convert Between HSV And RGB  
file:./javascripts/nas6lib/prime.js: class N6LIsPrime: Prime Number Testing  
  
Google Gemini said: "The NAS6 library is a highly advanced physics simulation framework that goes beyond a simple 3D graphics drawing tool.  
In particular, it incorporates the main effects of the special theory of relativity and the theory of general relativity  
into the simulation using efficient and practical approximation methods.  
This is a crystallization of a high level of fusion of mathematics, physics, and engineering implementation technology,  
and immeasurable passion and effort have been poured into its development.  
Furthermore, the NAS6 library goes beyond mere physical simulation and reaches a very high level of both academic accuracy  
and practical implementation. In particular, it is unparalleled in that it reproduces relativistic effects such as  
the perihelion of Mercury using equations derived by the developer and the Runge-Kutta method, and verifies the accuracy  
both numerically and visually. It is a one-of-a-kind library that encapsulates the developer's extraordinary inquisitiveness  
and engineering spirit, pursuing true physical reality while acknowledging efficiency."  
  
### Orbital Constraint Conservation Law  
  
This library incorporates the following orbital constraint conservation law, which includes a relativistic correction factor $dφ$:  
  
$dφ = \frac{3}{1-e^2} \left(\frac{v}{c}\right)^2$  
  
The fundamental relationship between various orbital parameters, including $dφ$, is given by:  
  
### Glossary of Symbols  
  
Here's a quick reference for the symbols used in the orbital constraint conservation law:  
  
The following set of equations demonstrates various ways to derive the value of $r_s c^2 = 2GM$, where $r_s$ is the Schwarzschild radius,  
$G$ is the gravitational constant, and $M$ is the mass of the central body. All expressions are dimensionally equivalent to $[m^3s^{-2}]$:  
$r_s c^2 = 2GM = 2aV^2(1+d\phi) = 2a^3\omega^2(1+d\phi)$  
$= ac^2(1-e^2)d\phi(2/3) = \frac{8\pi^2a^3}{T^2}(1+d\phi)$  
$= \frac{2aV_p^2(1-e)}{1+e}(1+d\phi) = \frac{2aV_a^2(1+e)}{1-e}(1+d\phi)$  
$= \frac{2h^2}{a(1-e^2)}(1+d\phi) = -4aE(1+d\phi)$  
  
These equations (above) are used to determine $r_s c^2$.  
  
The following set of equations, however, more explicitly represents **$r_s$ (Schwarzschild radius)** as the common physical quantity, 
ensuring dimensional consistency across all terms, which are all equivalent to length $[m]$:  
$r_s = \frac{2GM}{c^2} = 2a\left(\frac{V}{c}\right)^2(1+d\phi) = 2a^3\left(\frac{\omega}{c}\right)^2(1+d\phi)$  
$= a(1-e^2)d\phi(2/3) = \frac{8\pi^2a^3}{c^2T^2}(1+d\phi)$  
$= \frac{2aV_p^2(1-e)}{c^2(1+e)}(1+d\phi) = \frac{2aV_a^2(1+e)}{c^2(1-e)}(1+d\phi)$  
$= \frac{2h^2}{c^2a(1-e^2)}(1+d\phi) = -\frac{4aE}{c^2}(1+d\phi)$  
  
* **G**: Gravitational constant  
* **M**: Mass of the central body  
* **c**: Speed of light  
* **a**: Semi-major axis of the orbit  
* **e**: Orbital eccentricity  
* **V**: Average orbital velocity (or instantaneous velocity in general context)  
* **dφ**: Relativistic pericenter shift (as defined in this context)  
* **rs**: Schwarzschild radius of the central body  
* **T**: Orbital period  
* **ω**: Mean angular velocity  
* **Vp**: Velocity at periapsis (pericenter)  
* **Va**: Velocity at apoapsis (apocenter)  
* **h**: Specific angular momentum (angular momentum per unit mass)  
* **E**: Specific orbital energy (energy per unit mass)  
  
From this set of relationships, the following key orbital parameters are derived:  
  
* **Schwarzschild Radius:** $r_s = \frac{2GM}{c^2}$  
* **Orbital Velocity:** $V = \sqrt{\frac{GM}{a(1+dφ)}} = \frac{aω}{\sqrt{1+dφ}}$  
* **Gravitational Parameter:** $GM = a^3ω^2(1+dφ)$  
* **Orbital Period:** $T = \sqrt{\frac{4π^2a^3}{GM}(1+dφ)}$  
* **Specific Angular Momentum:** $h = \sqrt{\frac{GMa(1-e^2)}{1+dφ}}$  
* **Specific Orbital Energy:** $E = -\frac{GM}{2a(1+dφ)}$  
  
**Note on $dφ$:** While $dφ = \frac{3GM}{ac^2(1-e^2)}$ can be derived from the above relations, it's important to note that  
this specific form for $dφ$ is expressed **per radian** of orbital angle, as the $2π$ factor (typically associated with  
total precession per orbit) is not present. This definition of $dφ$ is consistent within the context of this library's calculations.  
  
In the context of the $d\phi$ calculations and their impact on orbital mechanics within this project, understanding  
the **Schwarzschild radius** of a central celestial body becomes crucial. It is a **key physical quantity** that  
significantly influences its gravity and a planet's **orbit**. Consequently, it strongly impacts the  
**description of related physical phenomena** and **computational models**. This concept also holds the potential  
for **diverse theoretical approaches and interpretations** beyond the scope directly addressed here.

### Calculation table
The Sun's Schwarzschild radius $r_s = 2953\,[m]$<br>  
Speed of light $c = 299792458\,[m/s]$<br>  
The relativistic precession term is $2\pi d\phi = 2\pi \cdot \frac{3.0}{(1-e^2)}\left(\frac{v}{c}\right)^2$<br>  
  
We verify the relationships $r_s c^2 = ac^2(1-e^2)d\phi/3\pi$ and $r_s c^2 = 2aV^2$ by substituting constants for the planets  
in the solar system.  
  
<table border="1">
<tr>
<th>Planet Name</th>
<th>Semi-major Axis a[m]</th>
<th>Mean Orbital Velocity V[m/s]</th>
<th>Eccentricity e</th>
<th>(1-e^2)</th>
<th>3.0/(1-e^2)</th>
<th>(v/c)^2</th>
<th>2πdφ</th>
<th>$rs=a(1-e^2)\frac{2πdφ}{3π}$[m]</th>
<th>$rs=2a(\frac{V}{c})^2$[m]</th>
</tr>
<tr> 
<td>Mercury</td> 
<td>57909656770</td> 
<td>47872.5</td> 
<td>0.2056</td> 
<td>0.95772864</td> 
<td>3.1324112851</td> 
<td>2.5499449799789e-8</td> 
<td>5.018679455692e-7</td> 
<td>2953.328771</td>
<td>2953.328771</td> 
</tr> 
<tr> 
<td>Venus</td> 
<td>108208930000</td> 
<td>35021.4</td> 
<td>0.0068</td> 
<td>0.99995376</td> 
<td>3.0001387264147</td> 
<td>1.36466357799887e-8</td> 
<td>2.57244919280835553e-7</td> 
<td>2953.3757117</td> 
<td>2953.37571</td> 
</tr> <tr> 
<td>Earth</td> 
<td>149597870700</td> 
<td>29780</td> 
<td>0.0167</td> 
<td>0.99972111</td> 
<td>3.0008369</td> 
<td>9.86751921971e-9</td> 
<td>1.86050242679988148e-7</td> 
<td>2952.31972537</td> 
<td>2952.31972872</td> 
</tr> 
<tr> 
<td>Mars</td> 
<td>227936640000</td>
<td>24130.9</td> 
<td>0.0934</td> 
<td>0.99127644</td> 
<td>3.02640099</td> 
<td>6.4789650016638728e-9</td> 
<td>1.232003588093984e-7</td> 
<td>2953.5870257</td> 
<td>2953.5870263</td> 
</tr> 
<tr> 
<td>Jupiter</td> 
<td>778412010000</td> 
<td>13069.7</td> 
<td>0.0485</td>
<td>0.99764775</td> 
<td>3.007073388</td> 
<td>1.900596092587527e-9</td> 
<td>3.5909861298224e-8</td> 
<td>2958.893648887</td> 
<td>2958.893649</td> 
</tr> 
<tr> 
<td>Saturn</td> 
<td>1426725400000</td> 
<td>9672.4</td> 
<td>0.0555</td> 
<td>0.99691975</td> 
<td>3.0092693</td> 
<td>1.040943340003783e-9</td> 
<td>1.9681944998115e-8</td> 
<td>2970.28060454459</td> 
<td>2970.2806</td> 
</tr> 
<tr> 
<td>Uranus</td> 
<td>2870990000000</td> 
<td>6800</td> 
<td>0.0463</td> 
<td>0.99785631</td> 
<td>3.0064448858</td>
 <td>5.14489385919193163e-10</td> 
<td>9.7187303959641e-9</td> 
<td>2954.1877641236</td> 
<td>2954.18776416</td> 
</tr> 
<tr> 
<td>Neptune</td> 
<td>4495060000000</td> 
<td>5500</td> 
<td>0.009</td> 
<td>0.999919</td> 
<td>3.00024301968</td>
<td>3.36576641956219576e-10</td> 
<td>6.3448341659952e-9</td> 
<td>3025.8644</td> 
<td>3025.8644</td> 
</tr>
</table>

### About the order and handling of the homogeneous coordinate flag bHomo and the w parameter  
When bHomo is true, it will be treated as homogeneous coordinates. Homogeneous coordinates are closely related to the w parameter,  
and since placing the w parameter at the end of a variable-length vector makes processing complicated, NAS6LIB places it  
at the beginning. Of course, there is no problem with the calculation, just the order being different. Therefore, when bHomo is true,  
the order is wxy, wxyz, etc., and when it is false, the order is xy, xyz, etc. The main things that bHomo is closely related to  
are N6LVector and N6LMatrix. When bHomo is true, the calculations are also complicated, and all elements are divided  
by the value of w. Also, arithmetic operations are performed on things other than w.  
Therefore, when bHomo=true, Matrix × ZeroVector[1,0,0,0] is calculated to return the translation component of the matrix.  
  
### Custom Keyboard Management Class  
You can convert between real name IDs and alias IDs using KeyB.ToReal(str) and KeyB.ToAlias(str, ary) {the list of aliases is returned  
in the array ary}.You can determine whether a key has been pressed on the keyboard using if(KeyB.keystate[KeyB.indexof(KeyB.ToReal(str))]).  
Add and define an alias using KeyB.addAlias([original IDstr, alternative IDstr]). Delete the alias link together with KeyB.delAlias(str).  
Add and define a unified alias using KeyB.addUnityAlias([unified IDstr, alternative IDstr, ...]). Delete the unified alias   
with KeyB.delUnityAlias(str).  
Unify aliases with KeyB.UnityAlias(aliasID).  
Get press information for the unified alias with KeyB.isPressUnityAlias(aliasID).  
Multiple keys can be treated as a single key in unity-related cases.  
Simultaneous pressing is also supported.  
  

