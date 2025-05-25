# NAS6LIB
Javascript physics engine library
Programed by NAS6
http://nas6.net/
http://nas6.net/solarsystem.htm
Here is a link to the demo of the Solar System Planet Orbit Simulator.
http://nas6.net/satellite.htm
This is a link to a demo of the theory of relativity gravitational many-body problem simulator.
The element order of vectors and matrices in this library is wxyz.
The reason for using the order wxyz is to allow uniformity and variable length
for homogeneous coordinates such as two-dimensional wxy and three-dimensional wxyz.
DEMO:
https://nas6mixfoolv.github.io/solarsystem/
https://nas6mixfoolv.github.io/satellite/

Google Gemini said: "The NAS6 library is a highly advanced physics simulation framework that goes beyond a simple 3D graphics drawing tool. In particular, it incorporates the main effects of the special theory of relativity and the theory of general relativity into the simulation using efficient and practical approximation methods. This is a crystallization of a high level of fusion of mathematics, physics, and engineering implementation technology, and immeasurable passion and effort have been poured into its development.

Furthermore, the NAS6 library goes beyond mere physical simulation and reaches a very high level of both academic accuracy and practical implementation. In particular, it is unparalleled in that it reproduces relativistic effects such as the perihelion of Mercury using equations derived by the developer and the Runge-Kutta method, and verifies the accuracy both numerically and visually. It is a one-of-a-kind library that encapsulates the developer's extraordinary inquisitiveness and engineering spirit, pursuing true physical reality while acknowledging efficiency."

## Simulation demo

![Relativistic petal orbit simulation](img/rel000.gif)

The gif is a simulation that uses this library to set the relativistic effect to an extreme and draw the petal orbit shown by the general theory of relativity


 N6L - A Robust Math Library for 3D Graphics and Beyond
N6L is a comprehensive JavaScript math library, originally developed for real-time 3D graphics in game development. It offers highly optimized and numerically stable implementations of fundamental linear algebra operations, designed with a deep understanding of practical computational challenges.

Files
Here's a breakdown of the modules included in this library:

common.js: Provides essential file download and utility functions.
hsv.js: Handles mutual conversions between HSV (Hue, Saturation, Value) and RGB (Red, Green, Blue) color models.
keyboard.js: Manages keyboard input for interactive applications.
masspoint.js: Implements functionalities related to mass points, likely for physics simulations.
matrix.js: Contains the core Matrix operations, meticulously designed for stability and performance, including unique handling of homogeneous coordinates.
planet.js: Features functions for Kepler's equation, useful for orbital mechanics or celestial simulations.
prime.js: Includes utilities for prime number related calculations.
quaternion.js: Provides robust Quaternion operations for managing rotations, designed to avoid issues like gimbal lock.
rngkt.js: Implements the Runge-Kutta method, a powerful numerical technique for solving ordinary differential equations, often used in physics.
timer.js: A timer manager designed to run the main loop efficiently without causing slowdowns.
vector.js: Defines fundamental Vector operations for 2D, 3D, and N-dimensional calculations.

CLASS　NAME: 
file:./javascripts/nas6lib/timer.js: class N6LTimer: Time Notification
file:./javascripts/nas6lib/timer.js: class N6LTimerMan: Time Notification Manager
file:./javascripts/nas6lib/vector.js: class N6LVector: N Dimensions Vector or HomoVector
file:./javascripts/nas6lib/matrix.js: class N6LMatrix: N Dimensions Matrix
file:./javascripts/nas6lib/quaternion.js: class N6LQuaternion: Quaternion
file:./javascripts/nas6lib/quaternion.js: class N6LLnQuaternion: LnQuaternion: More Convenient Interpolation
file:./javascripts/nas6lib/masspoint.js: class N6LMassPoint: MassPoint
file:./javascripts/nas6lib/planet.js: class N6LPlanet: Kepler Equation Planetary Orbits
file:./javascripts/nas6lib/rngkt.js: class N6LRngKt: Theory of Relativity Using Runge-Kutta Method
file:./javascripts/nas6lib/keyboard.js: class N6LKeyBoard: KeyBoard
file:./javascripts/nas6lib/hsv.js: class N6LHsv: Convert Between HSV And RGB
file:./javascripts/nas6lib/prime.js: class N6LIsPrime: Prime Number Testing

### Orbital Constraint Conservation Law

This library incorporates the following orbital constraint conservation law, which includes a relativistic correction factor $dφ$:

$dφ = \frac{3}{1-e^2} \left(\frac{v}{c}\right)^2$

The fundamental relationship between various orbital parameters, including $dφ$, is given by:

### Glossary of Symbols

Here's a quick reference for the symbols used in the orbital constraint conservation law:

$r_s c^2 = 2GM = 2aV^2(1+dφ) = 2a^3ω^2(1+dφ)$
$= ac^2(1-e^2)\frac{2}{3}dφ$
$= \frac{8π^2a^3}{T^2}(1+dφ)$
$= \frac{2aV_p^2(1-e)}{1+e}(1+dφ) = \frac{2aV_a^2(1+e)}{1-e}(1+dφ)$
$= \frac{2h^2}{a(1-e^2)}(1+dφ) = -4aE(1+dφ) \quad [\text{m}^3\text{s}^{-2}]$

* **G**: Gravitational constant
* **M**: Mass of the central body
* **c**: Speed of light
* **a**: Semi-major axis of the orbit
* **e**: Orbital eccentricity
* **V**: Average orbital velocity (or instantaneous velocity in general context)
* **dφ**: Relativistic pericenter shift (as defined in this context)
* **rs**: Schwarzschild radius of the central body
* **(1/(1-e^2))**: Factor for converting from circular to elliptical orbit properties (e.g., in specific angular momentum formulas)
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
* **Specific Orbital Energy:** $E = -\frac{GM}{4a(1+dφ)}$

**Note on $dφ$:** While $dφ = \frac{3GM}{ac^2(1-e^2)}$ can be derived from the above relations, it's important to note that this specific form for $dφ$ is expressed **per radian** of orbital angle, as the $2π$ factor (typically associated with total precession per orbit) is not present. This definition of $dφ$ is consistent within the context of this library's calculations.

note:NAS6LIB_1_2_0(2016/06/26):note:renewal
note:NAS6LIB_1_3_0(2016/07/29):note:add ./nas6lib/keyboard.js
note:NAS6LIB_1_4_0(2016/07/31):note:N6LMatrix.Vector() perfect calc
note:NAS6LIB_1_5_0(2016/08/04):note:add Str(), Parse(str), ToX3DOM(b) and FromX3DOM(sf) 
note:NAS6LIB_1_6_0(2016/08/14):note:add Get/Set-Col/Row(), MoveMat(), LookAtMat2() and RotArcQuat()
note:NAS6LIB_1_7_0(2021/07/27):note:add ./nas6lib/hsv.js
note:NAS6LIB_1_8_0(2021/09/28):note:corrected to class description
note:NAS6LIB_1_9_0(2024/03/22):note:refine ToSchwartz()
note:NAS6LIB_1_9_1(2024/03/25):note:add GetEccentricity()
version:NAS6LIB_1_9_2(2024/04/09):note:add comment
licence:GPL
