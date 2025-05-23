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

This library also has the following orbital constraint conservation law:
dφ=(3/(1-e^2))(v/c)^2
rsc^2=2GM=2aV^2(1+dφ)=2a^3ω^2(1+dφ)
=ac^2(1-e^2)dφ(2/3)=(8π^2a^3/T^2)(1+dφ)
=(2aVp^2(1-e))(1+dφ)/(1+e)=(2aVa^2(1+e))(1+dφ)/(1-e)
=(2h^2)(1+dφ)/(a(1- e^2))=-4aE(1+dφ)=[m^3s^-2]
From this, it is derived
rs=2GM/c^2
V=√(GM/a(1+dφ))=aω/√(1+dφ)
GM=a^3ω^2(1+dφ)
T=√((4π^2a^3/GM)(1+dφ))
h=√(GMa(1-e^2)/(1+dφ))
E=-GM/4a(1+dφ)
is fine, but
dφ=3GM/ac^2(1-e^2)
has the 2π gone and is now per radian.

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
