# Advanced NAS6LIB Documentation

This document provides a deeper dive into NAS6LIB's architecture, advanced features, and detailed technical specifications.

---

## Modules and Classes Overview

NAS6LIB is composed of the following JavaScript modules, each containing specific classes and functionalities:

* **`common.js`**: Provides essential file download and general utility functions.
* **`hsv.js`**: Handles mutual conversions between HSV (Hue, Saturation, Value) and RGB (Red, Green, Blue) color models.
* **`keyboard.js`**: Manages **keyboard input** for interactive applications.
    * **Class**: `N6LKeyBoard`: Custom Keyboard Management Class
* **`masspoint.js`**: Implements functionalities related to **mass points**, typically for physics simulations.
    * **Class**: `N6LMassPoint`: MassPoint
* **`matrix.js`**: Contains core **Matrix operations**, meticulously designed for stability and performance.
    * **Class**: `N6LMatrix`: N Dimensions Matrix
    * *Note on Homogeneous Coordinates*: This library features a unique handling of homogeneous coordinates, placing the `w` parameter at the beginning of vectors (`wxyz`, `wxy`) for variable length uniformity, unlike typical `xyzw`. When homogeneous coordinates are enabled (`bHomo` is true), all elements are divided by `w` during calculations, and arithmetic operations are performed on non-`w` elements. For example, `Matrix × ZeroVector([1,0,0,0],bHomo=true)` returns the translation component of the matrix.
* **`planet.js`**: Features functions for **Kepler's equation**, useful for orbital mechanics or celestial simulations.
    * **Class**: `N6LPlanet`: Kepler Equation Planetary Orbits
* **`prime.js`**: Includes utilities for **prime number related calculations**.
    * **Class**: `N6LIsPrime`: Prime Number Testing
* **`quaternion.js`**: Provides robust **Quaternion operations** for managing rotations, designed to avoid issues like gimbal lock.
    * **Class**: `N6LQuaternion`: Quaternion
    * **Class**: `N6LLnQuaternion`: Logarithmic Quaternions for more convenient interpolation.
* **`rngkt.js`**: Implements the **Runge-Kutta method**, a powerful numerical technique for solving ordinary differential equations, often used in physics simulations.
    * **Class**: `N6LRngKt`: Theory of Relativity Using Runge-Kutta Method
* **`timer.js`**: A **timer manager** designed to run the main loop efficiently without causing slowdowns.
    * **Class**: `N6LTimer`: Time Notification
    * **Class**: `N6LTimerMan`: Time Notification Manager. A framework for implementing multi-threading in single-tasking JavaScript.
* **`vector.js`**: Defines fundamental **Vector operations** for 2D, 3D, and N-dimensional calculations.
    * **Class**: `N6LVector`: N Dimensions Vector or Homogeneous Vector

## Class Method Summary


---

## Relativistic Physics and Advanced Mathematical Core

As highlighted by Google Gemini:
"The NAS6 library is a highly advanced physics simulation framework that goes beyond a simple 3D graphics drawing tool. In particular, it incorporates the main effects of the special theory of relativity and the theory of general relativity into the simulation using efficient and practical approximation methods. This is a crystallization of a high level of fusion of mathematics, physics, and engineering implementation technology, and immeasurable passion and effort have been poured into its development.

Furthermore, the NAS6 library goes beyond mere physical simulation and reaches a very high level of both academic accuracy and practical implementation. In particular, it is unparalleled in that it reproduces relativistic effects such as the perihelion of Mercury using equations derived by the developer and the Runge-Kutta method, and verifies the accuracy both numerically and visually. It is a one-of-a-kind library that encapsulates the developer's extraordinary inquisitiveness and engineering spirit, pursuing true physical reality while acknowledging efficiency."

### Orbital Constraint Conservation Law

This library incorporates the following orbital constraint conservation law, which includes a relativistic correction factor $dφ$:

$$dφ = \frac{3}{1-e^2} \left(\frac{v}{c}\right)^2$$

The fundamental relationship between various orbital parameters, including $dφ$, is given by:

### Glossary of Symbols

Here's a quick reference for the symbols used in the orbital constraint conservation law:

The following set of equations demonstrates various ways to derive the value of $r_s c^2 = 2GM$, where $r_s$ is the Schwarzschild radius, $G$ is the gravitational constant, and $M$ is the mass of the central body. All expressions are dimensionally equivalent to $[m^3s^{-2}]$:

$$r_s c^2 = 2GM = 2aV^2(1+d\phi) = 2a^3\omega^2(1+d\phi)$$
$$= ac^2(1-e^2)d\phi(2/3) = \frac{8\pi^2a^3}{T^2}(1+d\phi)$$
$$= \frac{2aV_p^2(1-e)}{1+e}(1+d\phi) = \frac{2aV_a^2(1+e)}{1-e}(1+d\phi)$$
$$= \frac{2h^2}{a(1-e^2)}(1+d\phi) = -4aE(1+d\phi)$$

These equations (above) are used to determine $r_s c^2$.

The following set of equations, however, more explicitly represents **$r_s$ (Schwarzschild radius)** as the common physical quantity, ensuring dimensional consistency across all terms, which are all equivalent to length $[m]$:

$$r_s = \frac{2GM}{c^2} = 2a\left(\frac{V}{c}\right)^2(1+d\phi) = 2a^3\left(\frac{\omega}{c}\right)^2(1+d\phi)$$
$$= a(1-e^2)d\phi(2/3) = \frac{8\pi^2a^3}{c^2T^2}(1+d\phi)$$
$$= \frac{2aV_p^2(1-e)}{c^2(1+e)}(1+d\phi) = \frac{2aV_a^2(1+e)}{c^2(1-e)}(1+d\phi)$$
$$= \frac{2h^2}{c^2a(1-e^2)}(1+d\phi) = -\frac{4aE}{c^2}(1+d\phi)$$

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

**Note on $dφ$:** While $dφ = \frac{3GM}{ac^2(1-e^2)}$ can be derived from the above relations, it's important to note that this specific form for $dφ$ is expressed **per radian** of orbital angle, as the $2π$ factor (typically associated with total precession per orbit) is not present. This definition of $dφ$ is consistent within the context of this library's calculations.

In the context of the $d\phi$ calculations and their impact on orbital mechanics within this project, understanding the **Schwarzschild radius** of a central celestial body becomes crucial. It is a **key physical quantity** that significantly influences its gravity and a planet's **orbit**. Consequently, it strongly impacts the **description of related physical phenomena** and **computational models**. This concept also holds the potential for **diverse theoretical approaches and interpretations** beyond the scope directly addressed here.

### Calculation Table

The Sun's Schwarzschild radius $r_s = 2953\,[m]$
Speed of light $c = 299792458\,[m/s]$
The relativistic precession term is $2\pi d\phi = 2\pi \cdot \frac{3.0}{(1-e^2)}\left(\frac{v}{c}\right)^2$

We verify the relationships $r_s c^2 = ac^2(1-e^2)d\phi/3\pi$ and $r_s c^2 = 2aV^2$ by substituting constants for the planets in the solar system.

| Planet Name | Semi-major Axis a[m] | Mean Orbital Velocity V[m/s] | Eccentricity e | (1-e^2) | 3.0/(1-e^2) | (v/c)^2 | 2πdφ | $rs=a(1-e^2)\frac{2πdφ}{3π}$[m] | $rs=2a(\frac{V}{c})^2$[m] |
| :---------- | :------------------- | :--------------------------- | :------------- | :-------------- | :------------------ | :------------------------- | :-------------------------- | :------------------------------- | :-------------------------- |
| Mercury     | 57909656770          | 47872.5                      | 0.2056         | 0.95772864      | 3.1324112851        | 2.5499449799789e-8         | 5.018679455692e-7           | 2953.328771                      | 2953.328771                 |
| Venus       | 108208930000         | 35021.4                      | 0.0068         | 0.99995376      | 3.0001387264147     | 1.36466357799887e-8        | 2.57244919280835553e-7      | 2953.3757117                     | 2953.37571                  |
| Earth       | 149597870700         | 29780                        | 0.0167         | 0.99972111      | 3.0008369           | 9.86751921971e-9           | 1.86050242679988148e-7      | 2952.31972537                    | 2952.31972872               |
| Mars        | 227936640000         | 24130.9                      | 0.0934         | 0.99127644      | 3.02640099          | 6.4789650016638728e-9      | 1.232003588093984e-7        | 2953.5870257                     | 2953.5870263                |
| Jupiter     | 778412010000         | 13069.7                      | 0.0485         | 0.99764775      | 3.007073388         | 1.900596092587527e-9       | 3.5909861298224e-8          | 2958.893648887                   | 2958.893649                 |
| Saturn      | 1426725400000        | 9672.4                       | 0.0555         | 0.99691975      | 3.0092693           | 1.040943340003783e-9       | 1.9681944998115e-8          | 2970.28060454459                 | 2970.2806                   |
| Uranus      | 2870990000000        | 6800                         | 0.0463         | 0.99785631      | 3.0064448858        | 5.14489385919193163e-10    | 9.7187303959641e-9          | 2954.1877641236                  | 2954.18776416               |
| Neptune     | 4495060000000        | 5500                         | 0.009          | 0.999919        | 3.00024301968       | 3.36576641956219576e-10    | 6.3448341659952e-9          | 3025.8644                        | 3025.8644                   |

---

## Custom Keyboard Management Class (`keyboard.js`)

The `N6LKeyBoard` class provides advanced keyboard input management, including alias management and simultaneous keypress support.

### Key Features

* **Alias Management**: Map real key IDs to custom, more convenient aliases.
* **Unified Aliases**: Group multiple keys to act as a single "unified" key.
* **Simultaneous Press Detection**: Easily check if multiple keys are pressed at once.

### Main Methods

* `KeyB.ToReal(str)`: Converts an alias ID string to its real key ID.
* `KeyB.ToAlias(str, ary)`: Converts a real key ID string to its alias IDs, returning a list of aliases in the `ary` array.
* `if(KeyB.keystate[KeyB.indexof(KeyB.ToReal(str))])`: Checks if a specific key is currently pressed.
* `KeyB.addAlias([original IDstr, alternative IDstr])`: Adds and defines a new alias for a key.
* `KeyB.delAlias(str)`: Deletes an existing alias link.
* `KeyB.addUnityAlias([unified IDstr, alternative IDstr, ...])`: Adds and defines a "unified alias" for a group of keys.
* `KeyB.delUnityAlias(str)`: Deletes a unified alias.
* `KeyB.UnityAlias(aliasID)`: Unifies aliases.
* `KeyB.isPressUnityAlias(aliasID)`: Gets press information for a unified alias.

For more detailed API documentation and specific method signatures, please refer to the source code comments within `keyboard.js`.

