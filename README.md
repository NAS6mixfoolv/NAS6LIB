# NAS6LIB: JavaScript Physics Engine & Robust Math Library  
  
**Programmed by NAS6** - [nas6.net](http://nas6.net/)  
  
NAS6LIB is a comprehensive JavaScript library for **physics simulations** and **geometric transformations**, originally developed  
for real-time 3D graphics in game development. It offers highly optimized and numerically stable implementations of  
fundamental linear algebra operations.  
  
A key unique feature is its advanced **relativistic gravitational many-body problem simulator**, demonstrating complex orbital  
mechanics such as the perihelion of Mercury.  
  
---  
  
## Related Repositories  
  
* **Solar System Planet Orbit Simulator**: [https://github.com/NAS6mixfoolv/solarsystem/](https://github.com/NAS6mixfoolv/solarsystem/)
* **Satellite Orbit Simulator**: [https://github.com/NAS6mixfoolv/satellite](https://github.com/NAS6mixfoolv/satellite/)  
  
## Demos  
  
Experience NAS6LIB in action:  
  
* **Solar System Planet Orbit Simulator**: [https://nas6mixfoolv.github.io/solarsystem/](https://nas6mixfoolv.github.io/solarsystem/)
* **Satellite Orbit Simulator**: [https://nas6mixfoolv.github.io/satellite](https://nas6mixfoolv.github.io/satellite/)  
* **Main Demo Page**: [https://nas6mixfoolv.github.io/NAS6LIB/](https://nas6mixfoolv.github.io/NAS6LIB/)  

## Automated Test  
  
* **Validity verified by automated testing**: [http://nas6.net/testpoly_chktest/testpoly_chktest.htm](http://nas6.net/testpoly_chktest/testpoly_chktest.htm)  
 
---  
  
## Quick Start  
  
### 1. Load the Library  
  
Include the necessary JavaScript files in your HTML. You'll typically need `vector.js` and `matrix.js` as core components.  
Add other modules like `quaternion.js`, `planet.js`, etc., as needed for your specific use case.  
  
html  
<script src="https://nas6mixfoolv.github.io/NAS6LIB/javascripts/nas6lib/vector.js"></script><br>
<script src="https://nas6mixfoolv.github.io/NAS6LIB/javascripts/nas6lib/matrix.js"></script><br>
<br>
  
### 2. Minimum Sample (2D Vector Addition)  
Here's a simple JavaScript example to get started:  
  
JavaScript  
  
var v1 = new N6LVector([1, 2]);  
var v2 = new N6LVector([3, 4]);  
var v3 = v1.Add(v2);  
console.log(v3.x); // Result: [4, 6]  
  
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
  
The element order of vectors and matrices in this library is wxyz. This choice allows uniformity and variable length  
for homogeneous coordinates (e.g., two-dimensional wxy and three-dimensional wxyz). Calculations are also adjusted  
for homogeneous coordinates, with all elements divided by the w value for arithmetic operations. For instance,  
Matrix × ZeroVector([1,0,0,0],bHomo=true) returns the translation component of the matrix.  
  
### Coordinate System  
NAS6LIB's core mathematical calculations (vectors, matrices, etc.) are based on a Left-Handed Coordinate System.  
This reflects its origins in DirectX game development. When integrating with other 3D libraries  
(e.g., WebGL-based ones like Three.js which primarily use a Right-Handed Coordinate System), please be aware of  
potential axis differences, especially regarding the Z-axis.  
  
### Deeper Dive & Advanced Details  
For more in-depth information, including a detailed class list with main methods, advanced relativistic orbital  
mechanics formulas, and specific usage examples for modules like keyboard.js, please refer to the advanced documentation:  
  
Advanced NAS6LIB Documentation  
[AddvancedReadMe](AddvancedReadMe.md)  
  
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
License: GPL  
  
