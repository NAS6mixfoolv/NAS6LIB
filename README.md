# NAS6LIB: JavaScript Physics Engine & Robust Math Library  
  
**Programmed by NAS6** - [nas6.net](https://nas6.net/)  
  
NAS6LIB is a comprehensive JavaScript library for **physics simulations** and **geometric transformations**, originally developed  
for real-time 3D graphics in game development. It offers highly optimized and numerically stable implementations of  
fundamental linear algebra operations.  
  
A key unique feature is its advanced **relativistic gravitational many-body problem simulator**, demonstrating complex orbital  
mechanics such as the perihelion of Mercury.  
  
**Operating environment (Optional)**  
  
NAS6LIB works in major browser environments.  
Currently, we have confirmed that it works with the following libraries as options, although they are not required:  
jQuery 3.7.1  
x3dom 1.8.3  
ThreeJS R177  
  
Related files will be updated in due course.  
  
---  
  
# What you can do with NAS6LIB  
  
By performing numerical calculations with NAS6LIB and leaving the drawing to an existing 3D library,  
a graphical page like this is created.  
  
![gif of solarsystem](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/solarsystem000.gif)  
*太陽系シミュレーション (Solar System Simulation)*  
[Solar System Simulation DEMO](https://nas6.net/solarsystem.htm)  
  
![gif of fresnel](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/fresnel000.gif)  
*フレネル効果 (Fresnel Effect)*  
[Fresnel Effect DEMO](https://nas6.net/javascripts/threejs/examples/WaterPlaneTest.htm)  
  
---  
  
## Wiki  
  
* **Wiki Page**: [https://github.com/NAS6mixfoolv/NAS6LIB/wiki/](https://github.com/NAS6mixfoolv/NAS6LIB/wiki/)  
  
## Demos  
  
Experience NAS6LIB in action:  
  
* **Main Demo Page**: [https://nas6mixfoolv.github.io/NAS6LIB/](https://nas6mixfoolv.github.io/NAS6LIB/)  
* **Solar System Planet Orbit Simulator**: [https://nas6.net/solarsystem.htm](https://nas6.net/solarsystem.htm)
* **Satellite Orbit Simulator**: [https://nas6.net/satellite.htm](https://nas6.net/satellite.htm)  
* **Fresnel Effect**: [Fresnel Effect DEMO](https://nas6.net/javascripts/threejs/examples/WaterPlaneTest.htm)  

## Automated Test  
  
In the link,  
ijkl is the rotation vector to test  
xyz is the Euler angle to check for consistency  
* **Validity verified by automated testing**:  
[DEMO : https://nas6.net/testpoly_chktest/testpoly_chktest.htm](https://nas6.net/testpoly_chktest/testpoly_chktest.htm)  
* **3D rotation test**:  
[DEMO : https://nas6.net/rot.htm](https://nas6.net/rot.htm)  

## Zip Files Links

[NAS6LIB_2_1_2 Zip Files](https://nas6.net/NAS6LIB_2_1_2_javascripts.zip)  
[SolarSystem DEMO Zip Files](https://nas6.net/solarsystem.zip)  
[Satellite DEMO Zip Files](https://nas6.net/satellite.zip)  
[Simple Template Zip Files](https://nas6.net/TestPage.zip)  
[ThreeJS DEMO Zip Files](https://nas6.net/ThreeJSProjects.zip)  
[Validity verified by automated testing Zip Files](https://nas6.net/testpoly_chktest.zip)  
[3D rotation test Zip Files](https://nas6.net/rottestWithX3DOMAndThreeJS.zip)  
  
---  
  
## Quick Start  
  
### 1. Load the Library  
  
Include the necessary JavaScript files in your HTML. You'll typically need `vector.js` and `matrix.js` as core components.  
Add other modules like `quaternion.js`, `planet.js`, etc., as needed for your specific use case.  
  
```html  
<script src="https://nas6mixfoolv.github.io/NAS6LIB/javascripts/nas6lib/vector.js"></script>
<script src="https://nas6mixfoolv.github.io/NAS6LIB/javascripts/nas6lib/matrix.js"></script>
```
  
### 2. Minimum Sample (2D Vector Addition)  
Here's a simple JavaScript example to get started:  
  
```JavaScript  
  
var v1 = new N6LVector([1, 2]);  
var v2 = new N6LVector([3, 4]);  
var v3 = v1.Add(v2);  
console.log(v3.x); // Result: [4, 6]  
  
```  
  
### Core Features & Modules Overview  
NAS6LIB is a collection of JavaScript modules, each providing specific functionalities:  
  
vector.js: Defines fundamental Vector operations for 2D, 3D, and N-dimensional calculations.  
matrix.js: Contains core Matrix operations, meticulously designed for stability and performance,  
including unique handling of homogeneous coordinates (leading the w parameter).  
quaternion.js: Provides robust Quaternion operations for managing rotations, designed to avoid issues like gimbal lock.  
rngkt.js: Implements the Runge-Kutta method, a powerful numerical technique for solving ordinary differential equations,  
often used in physics simulations.  
planet.js: Features functions for Kepler's equation, useful for orbital mechanics or celestial simulations.  
masspoint.js: Implements functionalities related to mass points, likely for physics simulations.  
keyboard.js: Manages keyboard input for interactive applications, offering advanced alias management  
and simultaneous keypress support.  
timer.js: A timer manager designed to run the main loop efficiently without causing slowdowns,  
and enabling a multi-threading like framework in single-tasking JavaScript.  
hsv.js: Handles mutual conversions between HSV and RGB color models.  
prime.js: Includes utilities for prime number related calculations.  
common.js: Provides essential file download and utility functions.  
  
### Element Order  
  
The element order of vectors and matrices in this library is wxyz. This choice allows uniformity and variable length  
for homogeneous coordinates (e.g., two-dimensional wxy and three-dimensional wxyz). Calculations are also adjusted  
for homogeneous coordinates, with all elements divided by the w value for arithmetic operations. For instance,  
Matrix × ZeroVector([1,0,0,0],bHomo=true) returns the translation homo vector of the matrix.  
  
### Coordinate System  
NAS6LIB's core mathematical calculations (vectors, matrices, etc.) are based on a Left-Handed Coordinate System.  
This reflects its origins in DirectX game development. When integrating with other 3D libraries  
(e.g., WebGL-based ones like Three.js which primarily use a Right-Handed Coordinate System), please be aware of  
potential axis differences, especially regarding the Z-axis.  
  
### Deeper Dive & Advanced Details  
For more in-depth information, including a detailed class list with main methods, advanced relativistic orbital  
mechanics formulas, and specific usage examples for modules like keyboard.js, please refer to the advanced documentation:  
  
Advanced NAS6LIB Documentation  
[AdvancedReadMe](AdvancedReadMe.md)  
  
### Future Outlook  
The prototype of NAS6LIB originated from a VC++ DirectX air combat game, evolving through VB+VC#+XNA before  
being succeeded by the current JavaScript version in 2016. The original development started about 25 years ago,  
around 2000. It may return again and become VC#+WASM in the future.  

### Version History  
NAS6LIB_1_2_0 (2016/06/26): Renewal  
NAS6LIB_1_3_0 (2016/07/29): Added ./nas6lib/keyboard.js  
NAS6LIB_1_4_0 (2016/07/31): N6LMatrix.Vector() perfect calculation  
NAS6LIB_1_5_0 (2016/08/04): Added Str(), Parse(str), ToX3DOM(b), and FromX3DOM(sf)  
NAS6LIB_1_6_0 (2016/08/14): Added Get/Set-Col/Row(), MoveMat(), LookAtMat2(), and RotArcQuat()  
NAS6LIB_1_7_0 (2021/07/27): Added ./nas6lib/hsv.js  
NAS6LIB_1_8_0 (2021/09/28): Corrected to class description  
NAS6LIB_1_9_0 (2024/03/22): Refined ToSchwartz()  
NAS6LIB_1_9_1 (2024/03/25): Added GetEccentricity()  
NAS6LIB_1_9_2 (2024/04/09): Added comment  
NAS6LIB_2_0_0 (2025/05/25): Improved error handling  
NAS6LIB_2_0_1 (2025/05/26): Adaptation to the X3DOM environment  
NAS6LIB_2_0_2 (2025/06/08): N6LQuaternion bugfix  
NAS6LIB_2_0_3 (2025/06/10): N6LQuaternion & N6LLnQuaternion more bugfix  
NAS6LIB_2_1_0 (2025/06/11): add GetAccessor/Get/Set/Create  
NAS6LIB_2_1_1 (2025/06/14): refine Comp/Equal/EpsComp/EpsEqual  
NAS6LIB_2_1_2 (2025/06/17): Licensing arrangement  
License: GPL-3.0  
  
  
