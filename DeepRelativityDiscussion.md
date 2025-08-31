# Introduction  
The relativity effect is the perihelion shift $d\phi$ and the inertial drag or inertial boost of space $(\frac{v}{c})^2$  
  
---  
  
### Table of contents  
* [Approximation of relativity in Euclidean geometry (coefficients omitted)](#approximation-of-relativity-in-euclidean-geometry-coefficients-omitted)  
  * [Proof](#proof)  
* [Special and general relativity](#special-and-general-relativity)  
* [Calculation Table](#calculation-table)  
  * [Understanding the Calculations: Connecting Orbital Mechanics to Spacetime](#understanding-the-calculations-connecting-orbital-mechanics-to-spacetime)  
* [Metric Signature Conventions: Spacelike-First vs. Timelike-First](#metric-signature-conventions-spacelike-first-vs-timelike-first)  
* [About the curvature of light](#about-the-curvature-of-light)  
* [Rethinking the Law of Inertia in Newtonian Mechanics](#rethinking-the-law-of-inertia-in-newtonian-mechanics)  
* [The Twin Paradox](#the-twin-paradox)  
  
[Back to NAS6LIB Repository](https://github.com/NAS6mixfoolv/NAS6LIB/)  
[Back to NAS6LIB Wiki](https://github.com/NAS6mixfoolv/NAS6LIB/wiki/)  
  
---    
  
# Approximation of relativity in Euclidean geometry (coefficients omitted)  
  
$F=-(\frac{GMm}{r^2})(1+S)=-(\frac{GMm}{r^2})(1+d\phi)=-(\frac{GMm}{r^2})(1+(\frac{v}{c})^2)$  
  
**relativity effect S(Schwarzschild correction term)(Omitting coefficients)**  
$S=d\phi=(\frac{v}{c})^2$  
**Special relativity effect SS(Schwarzschild correction term + special)**  
$SS=(\frac{-0.5}{1-e^2})(\frac{v}{c})^2$  
**General relativity effect SG(Schwarzschild correction term + general)**  
$SG=(\frac{3.0}{1-e^2})(\frac{v}{c})^2$  
**Combined relativity effect SGS(Schwarzschild correction term + general + special)**  
$SGS=SG+SS=(\frac{2.5}{1-e^2})(\frac{v}{c})^2$  
  
* **G**: Gravitational constant  
* **M**: Mass of the central body  
* **m**: Mass of the object  
* **r**: Radius of the orbit  
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
  
---  
  
# Proof  
[Back to Table of contents](#table-of-contents)  

  ## Special relativity effect SS coefficient  

Lorentz contraction  
The approximation  
$a=\sqrt(1-(\frac{v}{c})^2)$  
(when $(\frac{v}{c})$ is much smaller than 1) is  
$a=1-0.5(\frac{v}{c})^2$  
  
  ## General relativity effect SG coefficient    
  
In the case of a circular orbit (eccentricity $e=0$):  
  
The line element of the Schwarzschild metric (a vacuum solution to Einstein's field equations possessing spherical symmetry)  
is given by:where $c$ is the speed of light, $t$ is the coordinate time, $r$ is the radial coordinate,  
$\theta$ is the co-latitude coordinate, $\phi$ is the longitude coordinate, and $2m = r_s$ is the Schwarzschild radius,  
defined as $r_s = 2GM/c^2$, with $M$ being the mass of the central body.  
  
The metric tensor in units $(-c^2, 1, 1, 1)$ is:  
$ds^2 = \left(1 - \frac{r_s}{r}\right)c^2 dt^2 - \frac{dr^2}{\left(1 - \frac{r_s}{r}\right)} - r^2 d\theta^2 - r^2 \sin^2\theta d\phi^2$  
Substituting $r_s = 2m$:  
$ds^2 = \left(1 - \frac{2m}{r}\right)c^2 dt^2 - \frac{dr^2}{\left(1 - \frac{2m}{r}\right)} - r^2 d\theta^2 - r^2 \sin^2\theta d\phi^2 \quad \text{(*1)}$  
  
The corresponding variational problem is:  
$\delta\int \left[ \left(1 - \frac{2m}{r}\right)c^2\left(\frac{dt}{ds}\right)^2 - \frac{1}{\left(1 - \frac{2m}{r}\right)}\left(\frac{dr}{ds}\right)^2 - r^2\left(\frac{d\theta}{ds}\right)^2 - r^2\sin^2\theta\left(\frac{d\phi}{ds}\right)^2 \right] ds = 0 \quad \text{(*2)}$  
  
Deriving the equations for each component:  
  
$i=1, r$, $\frac{\text(*1)}{ds^2}$:  
$1 = \left(1 - \frac{2m}{r}\right)c^2\left(\frac{dt}{ds}\right)^2 - \frac{1}{\left(1 - \frac{2m}{r}\right)}\left(\frac{dr}{ds}\right)^2 - r^2\left(\frac{d\theta}{ds}\right)^2 - r^2\sin^2\theta\left(\frac{d\phi}{ds}\right)^2 \quad \text{(*1A)}$  
$i=2, \theta$:  
$\frac{d}{ds}\left(r^2\frac{d\theta}{ds}\right) = r^2\sin\theta\cos\theta\left(\frac{d\phi}{ds}\right)^2 \quad \text{(*1B)}$  
$i=3, \phi$:  
$\frac{d}{ds}\left(r^2\sin^2\theta\frac{d\phi}{ds}\right) = 0 \quad \text{(*1C)}$  
$i=0, ct$:  
$\frac{d}{ds}\left[\left(1 - \frac{2m}{r}\right)\left(\frac{dt}{ds}\right)\right] = 0 \quad \text{(*1D)}$  
  
Choosing specific components:
We consider motion in the equatorial plane, where $\theta = \pi/2$ and $\frac{d\theta}{ds} = 0$.  
Since $\theta$ is constant, (*1B) is ignored.  

From $\text{(*1C)}$, we obtain the conservation of angular momentum:  
$r^2\frac{d\phi}{ds} = h \quad (\text{constant}) \quad \text{(*3)}$  
  
From $\text{(*1D)}$, we obtain the conservation of energy:  
$\left(1 - \frac{2m}{r}\right)\frac{dt}{ds} = l \quad (\text{constant}) \quad \text{(*4)}$  
  
From $\text{(*1A)}$:  
$\left(1 - \frac{2m}{r}\right) = (cl)^2 - \left(\frac{dr}{ds}\right)^2 - \left(\frac{h}{r}\right)^2\left(1 - \frac{2m}{r}\right) \quad \text{(*5)}$  
  
Let's differentiate $r$ as a function of $\phi$:  
$\frac{dr}{d\phi} = r' = \frac{dr}{ds}\frac{ds}{d\phi}$  
From (\*3), $\frac{ds}{d\phi} = r^2/h$. So, $\frac{dr}{ds} = r'\frac{d\phi}{ds} = hr'/r^2$.  
Let $u = 1/r$, then $r' = -u'/u^2$.  
Substituting into (\*5):  
$\left(1 - 2mu\right) = (cl)^2 - (hu')^2 - (hu)^2\left(1 - 2mu\right)$  
Rearranging to solve for $u'^2$:  
$u'^2 = \frac{(cl)^2 - 1}{h^2} + \frac{2mu}{h^2} - u^2 + 2mu^3 \quad \text{(*6)}$  
  
Differentiating with respect to $\phi$:  
$2u'u'' = \frac{2m}{h^2}u' - 2uu' + 6mu^2u' \quad \text{(*7)}$  
The solution $u'=0$, which implies $u=1/r$ (constant), corresponds to a circular orbit.  
Assuming $u' \neq 0$, we can divide $\text{(*7)}$ by $2u'$:  
$u'' + u = \frac{m}{h^2} + 3mu^2 \quad \text{(*8)}$  
This equation can be seen as $u'' + u = m/h^2$,  
which corresponds to the equation for Newtonian gravity, plus a relativistic correction term $3mu^2$.  
Considering the $\textbf{equation for the gravitational force in Schwarzschild spacetime}$  
in the form $F = -(GMm/r^2)(1+S)$, where $F$ is force, $r$ is radius, $G$ is gravitational constant,  
$M$ and $m$ are masses, $V$ is orbital velocity, $c$ is speed of light, and $S$ is the relativistic correction term.  
  
Here, $h = r^2\frac{d \phi}{ds}$, $m = GM/c^2$, and $u=1/r$.  
Let's examine the relativistic correction term $3mu^2$. We can factor out $m/h^2$:  
$u'' + u = \frac{m}{h^2}\left(1 + \frac{3mu^2}{m/h^2}\right) = \frac{m}{h^2}(1+S)$  
Now we investigate $S$:  
$S = \frac{3mu^2}{m/h^2} = 3u^2h^2 = 3\left(\frac{1}{r^2}\right)\left(r^2\frac{d\phi}{ds}\right)^2 = 3r^2\left(\frac{dt}{ds}\frac{d\phi}{dt}\right)^2 = 3r^2\left(\frac{d\phi}{dt}\right)^2\left(\frac{1}{c^2}\right) = 3\frac{(r d\phi/dt)^2}{c^2}$  
If we consider $(r d\phi/dt)$ as the tangential velocity of the circular orbit, $V$, then $S = 3(V/c)^2$.  
  
Therefore, in Euclidean geometry, the $\textbf{force equation for gravity in Schwarzschild spacetime}$ can be expressed as:  
$F = -\frac{GMm}{r^2}(1+S) = -\frac{GMm}{r^2}\left(1 + 3\left(\frac{V}{c}\right)^2\right)$  
  
# Orbital Velocity: Circular and Elliptical  
* **For a Circular Orbit (e=0)**  

The area A of a circular sector with radius r and angle θ, and orbital velocity v, is given by:  
$A=(\frac{1}{2})r^2\theta=(\frac{1}{2})rv$  
From this, the velocity v is:  
$v=\frac{2A}{r}$  
Squaringthevelocitygives:   
$v^2=\frac{4A^2}{r^2}$  
Also, for a central mass M and gravitational constant G, the orbital velocity v is:  
$v=\sqrt{\frac{GM}{r}}$  
Squaringthevelocitygives:  
$v^2=\frac{GM}{r}$  

* **For an Elliptical Orbit**  

The area B of an elliptical sector with distance from focus q, true anomaly $\psi$, eccentricity e,
and orbital velocity w, is given by:  
$B=(\frac{1}{2})q^2\psi\sqrt(1-e^2)=(\frac{1}{2})qw\sqrt(1-e^2)$  
From this, the velocity w is:  
$w=\frac{2B}{q\sqrt(1-e^2)}$  
Squaringthevelocitygives:  
$w^2=\frac{4B^2}{q^2(1-e^2)}$  
Also, for a central mass N and gravitational constant G, the orbital velocity w is:  
$w=\sqrt{\frac{GN(1+e^2+2e\cos\psi)}{q(1-e^2)}}$  
Squaringthevelocitygives:  
$w^2=\frac{GN(1+e^2+2e\cos\psi)}{q(1-e^2)}$  
Relativistic Correction Term for Elliptical Orbits  
When attempting to apply the relativistic correction term $3(\frac{v}{c})^2$  
using the elliptical orbital velocity, the term $(1+e^2 +2e\cos\psi)$ is included.  
For elliptical orbits, the relativistic correction to the Newtonian precession (i.e., the perihelion advance) is derived  
by extending the relativistic term 3(V/c)^2 obtained for circular orbits. This requires accounting for the varying radial distance  
and velocity characteristic of elliptical motion. When integrating the general relativistic perturbation over  
an entire elliptical orbit, or by analyzing the effective potential, an additional factor related to the orbital eccentricity emerges.  
Specifically, the perihelion shift per revolution is proportional to 1/(1-e^2) times the relativistic factor 3(GM/ac^2).  
This factor ensures the correct relativistic correction for the full elliptical path, taking into account the varying speed  
and distance from the central body.  
  
Thus, the relativistic correction term for an elliptical orbit becomes:  
$\frac{3}{1-e^2}(\frac{v}{c})^2$  
This expression represents the relativistic correction term for elliptical orbits in general relativity,  
A similar shape appears under the more conventional Kerr metric.  
  
---  
  
# Special and General Relativity  
[Back to Table of contents](#table-of-contents)  
  
* **Calculation Using Special Relativity Effects**  
  
Mercury's orbital length $a = 0.3871 \times 2\pi = 2.432 \text{ [AU]}$  
Orbital distance shortened by the effects of special relativity:  
$a' = 2.432 \text{ [AU]} \times (-0.5)(v/c)^2 = 4639.078 \text{ [m]}$  
($a'$ is the orbital distance shortened by the effects of special relativity per revolution [m])  
Conversion to speed per radian:  
$b = a'/(2\pi V) = 0.01542288777667 \text{ [s/mrad]}$  
Conversion from a perfect circular orbit to an elliptical orbit:  
$c = b/(1-e^2) = 0.01477512644554796428854595199462$  
Mercury orbits 415 times per 100 years.  
Time elapsed per orbit is $7604084.8192771 \text{ [s]}$.  
Calculate the accumulation:  
$d = c \times 415 \times 7604084.8192771 = 46625795.6$  
Convert to arc seconds ($360 \text{ [degrees]} \times 60 \text{ [arc minutes]} \times 60 \text{ [arc seconds]}$):  
$e = d/(360 \times 60 \times 60) = 35.98 \text{ [arc seconds/100 years]}$  
$e$ is the calculation combining special and general relativity.  
Relativistic effect $S=(v/c)^2$  
Special effect $SS$ is $-0.5S$. General effect $SG$ is $3.0S$. Total $SGS$ is $2.5S$.  
Ans $= e \times 6/5 = 43.17 \text{ [arc seconds/100 years]}$  
  
* **General Theoretical Calculation Method**  
  
$d\phi = 360 \times 3600 \times (3/2) \times (r_s/a)/(1-e^2) \times 4.15 \times 100$  
$= 360 \times 3600 \times 3/2 \times 2953/(149598700000 \times 0.3871)/(1-0.2056^2) \times 4.15 \times 100$  
$= 42.9 \text{ [arc seconds/100 years]}$  
  
* **To be honest, if you simplify it, the relativity effect $S=(v/c)^2.$**  
  
This is easier to calculate than the previous method of applying special effects to the circular orbit of Mercury:  
Mercury's general theory of relativity effect $SG = (3.0/(1-e^2))(v/c)^2 = 7.987579322995 \times 10^{-8}$  
Convert this to [arc seconds/100 years]:  
$d\phi' = SG \times 360 \times 3600 \times 4.15 \times 100 = 42.96 \text{ [arc seconds/100 years]}$  
(360×3600 is arc seconds, 4.15 is the number of orbits of Mercury in one year, 100 is 100 years)  
$d\phi' = 360 \times 3600 \times 3 \times (v/c)^2 \times 4.15 \times 100/(1-e^2) = 42.96 \text{ [arc seconds/100 years]}$  
Generally derived theoretical value $d\phi$:  
$d\phi = 360 \times 3600 \times (3/2) \times (r_s/a) \times 4.15 \times 100/(1-e^2) = 42.96 \text{ [arc seconds/100 years]}$  
Well, that's how it goes.  
  
* **Let's calculate the clock difference due to the difference in altitude.**  
  
Regarding the relativistic effect S:  
Special $SS = (-0.5/(1-e^2))(v/c)^2$  
General $SG = (3.0/(1-e^2))(v/c)^2$  
Special + General $SGS = (2.5/(1-e^2))(v/c)^2$  
  
Calculated as follows:  
Observational data of clock difference: $1.1 \times 10^{-16} \text{ [s/m]}$  
Circumference at altitude $0 \text{ [m]}$: $L0 = 40000000 \text{ [m]}$  
Distance from the center of the Earth: $R0 = L0/(2\pi) = 6366197 \text{ [m]}$  
Day $T0 = 86400 \text{ [s]}$  
Rotational speed $V0 = L0/T0 = 462.963 \text{ [m/s]}$  
$SGSR0 = (2.5)(V0/c)^2 = 5.96198804041 \times 10^{-12}$  
Altitude $1000 \text{ [m]}$ Distance from the center of the Earth $R1000 = R0+1000 = 6367197 \text{ [m]}$  
Circumference of the point $L1000 = R1000(2\pi) = 40006278 \text{ [m]}$  
Rotational speed $V1000 = L1000/T0 = 463.0356323879 \text{ [m/s]}$  
$SGSR1000 = (2.5)(V1000/c)^2 = 5.963859845632 \times 10^{-12}$  
  
* **Explanation of Calculation for Relativistic Clock Difference**  
  
Let's clarify the calculation for the relativistic clock difference:  
Here are the derived values from the calculations:  
* $SGSR1000AT0 = SGSR1000/SGSR0 - 1 = 3.139565543 \times 10^{-4}$  
* $SGSR = SGSR1000AT0/(R0 \times 2\pi \times 86400) = 9.084392 \times 10^{-17}$  
* $SGR = SGSR \times (6/5) = 1.09012704 \times 10^{-16}$  
  
The **observational data for the clock difference is $1.1 \times 10^{-16} \text{ [s/m]}$**.  
As you can see, the calculated value is very close to the observed data!  
  
* **What These Values Represent**  
  
The term $SGSR1000AT0$ represents the **general relativistic effect at an altitude of  
$1000 \text{ [m]}$, using $0 \text{ [m]}$ altitude as the base, while excluding special relativistic effects**.  
  
To **extract the general relativistic effect from data that combines both special and general relativistic effects,  
you multiply the data by (6/5)**. This is why $SGR$ is calculated as $SGSR \times (6/5)$.  
  
The term $SGR$ is a converted value. It expresses the relativistic effect  
**per $1 \text{ [m]}$ of altitude, per $1 \text{ [radian]}$, and per $1 \text{ [second]}$**.  
This conversion is achieved by dividing by:  
* The distance from the Earth's center $R0$ (for per $1 \text{ [m]}$ of altitude).  
* $2\pi$ (for per $1 \text{ [radian]}$).  
* $86400$ (for per $1 \text{ [second]}$).  
  
I'm sorry, but my calculation method is a pain because I have to mess around with units.  
It seems that $SGR=g/c^2$  without doing this.  
  
So, how about gravity at altitude 0[m] on Earth using my method? Let's try to calculate the acceleration g.  
Generally, $SG=(3.0/(1-e^2 ))(v/c)^2$  
$F = -(GMm/r^2)(1+SG) = -(GMm/r^2)(1+(3.0/(1-e^2))(v/c)^2) = ma = -mg$  
$g = -(GM/r^2)(1+(3.0/(1-e^2))(v/c)^2)$  
  
$G:6.67 \times 10^{-11} , M:5.972 \times 10^{24}, r:6.370 \times 10^{6} , e:0.0167, v:462.963, c:299792458$  
$|g| = 9.816728237072093212419239772056$  
$|g|/c^2 = 1.0923 \times 10^{-16}$  
   
Is that right?  
  
---  
  
### Calculation Table  
[Back to Table of contents](#table-of-contents)  
  
$$r_s = \frac{2GM}{c^2} = 2a\left(\frac{V}{c}\right)^2(1+d\phi) = 2a^3\left(\frac{\omega}{c}\right)^2(1+d\phi)$$  
$$= a(1-e^2)d\phi(2/3) = \frac{8\pi^2a^3}{c^2T^2}(1+d\phi)$$  
$$= \frac{2aV_p^2(1-e)}{c^2(1+e)}(1+d\phi) = \frac{2aV_a^2(1+e)}{c^2(1-e)}(1+d\phi)$$  
$$= \frac{2h^2}{c^2a(1-e^2)}(1+d\phi) = -\frac{4aE}{c^2}(1+d\phi)$$  
  
Astronomical unit (AU): Average distance between the Earth and the Sun, approximately 1.496e11 [m]  
Speed of light (c): 299792458 [m/sec]  
Solar mass (Ms): 1.989e30 [kg]  
Gravitational constant (G): 6.674e-11 [Nm^2kg^-2]  
The Sun's Schwarzschild radius $r_s = 2953\,[m]$  
  
These formulas lead to  
$r_s=a(1-e^2)d\phi\frac{2}{3}=\frac{2GM}{c^2}$  
$d\phi=\frac{r_s}{a}\frac{3}{2(1-e^2)}$  
which is a formula per unit time per unit radian,  
so to convert it to one revolution, we multiply it by 2π  
$2πd\phi=\frac{r_s}{a}\frac{6π}{2(1-e^2)}=\frac{GM}{ac^2}\frac{6π}{1-e^2}$  
which matches the standard formula for perihelion movement.  
  
Orbital semi-major axis a Eccentricity e Orbital period T Calculated based on observed values  
How to calculate each item in the table below  
Varg=2πa/T  
Vp=√((GMs/a)((1+e)/(1-e)))  
Va=√((GMs/a)((1-e)/(1+e)))  
h=rVt=√(GMsa(1-e^2)) where Vt is the tangential velocity.  
E=-(GMs)/(2a)  
In deriving this calculation table, the following formula is used for $d\phi$  
$d\phi = \frac{3}{1-e^2}(\frac{Vavg}{c})^2$  
  
| Planet name | Orbital semi-major axis a [AU] | Orbital semi-major axis a [m] | Eccentricity e | Orbital period T [Earth years] | Orbital period T [sec] | Average orbital speed Vavg [m/sec] | Perihelion velocity Vp [m/sec] | Aphelion velocity Va [m/sec] | Specific angular momentum h | Specific orbital energy E | dφ | 2a(Vavg/c)^2(1+dφ) | a(1-e^2)dφ(2/3) | (8π^2a^3/c^2T^2)(1+dφ) | (2a(Vp/c)^2(1-e))(1+dφ)/(1+e) | (2a(Va/c)^2(1+e))(1+dφ)/(1-e) | (2h^2)(1+dφ)/(c^2a(1-e^2)) | (-4aE/c^2)(1+dφ) |  
| :---------- | :----------------------------- | :---------------------------- | :------------- | :----------------------------- | :--------------------- | :--------------------------------- | :----------------------------- | :---------------------------- | :-------------------------- | :------------------------ | :--- | :-------------------- | :------------------ | :---------------------- | :------------------------------------ | :------------------------------------ | :---------------------------------- | :---------------------- |  
| Mercury     | 0.3871                         | 57909335747.97                | 0.2056         | 0.241                          | 7605225.432            | 47360                              | 58981.8245518867               | 38864.5997213162              | 2713351274428838            | -1146152501.02099         | 7.81737E-08 | 2890.41761017372      | 2890.41738421905    | 2949.64619982031        | 2953.99400232239                      | 2953.99400232239                      | 2953.99400232239                    | 2953.99400232239        |  
| Venus       | 0.7233                         | 108204139877.31               | 0.0068         | 0.615                          | 19407525.48            | 35020                              | 35264.8306131018               | 34788.4681812999              | 3.78985E+015                | -613404718.85141          | 4.09385E-08 | 2953.00898396617      | 2953.00886307433    | 2954.87861991337        | 2953.99389232987                      | 2953.99389232987                      | 2953.99389232987                    | 2953.99389232987        |  
| Earth       | 1                              | 149597870700                  | 0.0167         | 1                              | 31556952               | 29780                              | 30290.1329043849               | 29295.0601798777              | 4455666017974531            | -443675633.145225         | 2.96108E-08 | 2952.31981614066      | 2952.31972872007    | 2953.48301086581        | 2953.99385886788                      | 2953.99385886788                      | 2953.99385886788                    | 2953.99385886788        |  
| Mars        | 1.5237                         | 227942275585.59               | 0.0934         | 1.881                          | 59358626.712           | 24080                              | 26502.0659476983               | 21974.3671009542              | 5476717309904882            | -291183063.034209         | 1.95253E-08 | 2941.21277103664      | 2941.21271360854    | 2952.94449752574        | 2953.99382907537                      | 2953.99382907537                      | 2953.99382907537                    | 2953.99382907537        |  
| Jupiter     | 5.2028                         | 778327801677.96               | 0.0485         | 11.86                          | 374265450.72           | 13060                              | 13709.103081907                | 12440.831266032               | 1.01526725255784E+016       | -85276319.1253219         | 5.70675E-09 | 2954.18364717428      | 2954.18363031549    | 2957.17130472142        | 2953.99378825542                      | 2953.99378825542                      | 2953.99378825542                    | 2953.99378825542        |  
| Saturn      | 9.5388                         | 1426984169033.16              | 0.0555         | 29.46                          | 929667805.92           | 9650                               | 10195.9818305455               | 9123.73741255352              | 1.37420071513116E+016       | -46512730.4425321          | 3.11799E-09 | 2957.07522669051      | 2957.07521747039    | 2953.59000447722        | 2953.99378060823                      | 2953.99378060823                      | 2953.99378060823                    | 2953.99378060823        |  
| Uranus      | 19.1914                        | 2870992575751.98              | 0.0463         | 84.01                          | 2651099537.52          | 6810                               | 7122.24123368717               | 6491.90620717524              | 1.95011638557061E+016       | -23118461.0369866         | 1.55134E-09 | 2962.88560330786      | 2962.88559871142    | 2957.96116322479        | 2953.99377598035                      | 2953.99377598035                      | 2953.99377598035                    | 2953.99377598035        |  
| Neptune     | 30.0611                        | 4497076550899.77              | 0.009          | 164.79                         | 5200270120.08          | 5440                               | 5482.19031957957               | 5384.39108692106              | 2.44319450679472E+016       | -14759128.3467746         | 9.87900E-10 | 2961.53363889885      | 2961.53363597315    | 2954.52291069398        | 2953.99377431596                      | 2953.99377431597                      | 2953.99377431597                    | 2953.99377431596        |  
  
When I made these corrections, it became closer to the Schwarzschild radius of the sun, but I don't know if that's theoretically correct.  
  
| Planet name | 2a(Vavg/c)^2(1+dφ)/√(1-e^2) | a(1-e^2)dφ(2/3)/√(1-e^2) |  
| :---------- | :--------------------------- | :----------------------- |  
| Mercury     | 2953.51619901886             | 2953.51596813154         |  
| Venus       | 2953.07725990169             | 2953.07713900707         |  
| Earth       | 2952.73158850882             | 2952.73150107604         |  
| Mars        | 2954.12624436109             | 2954.12618668085         |  
| Jupiter     | 2957.66427810698             | 2957.66426122832         |  
| Saturn      | 2961.64004046082             | 2961.64003122647         |  
| Uranus      | 2966.06647243991             | 2966.06646783855         |  
| Neptune     | 2961.6535882982              | 2961.65358537239         |  
  
---  

# Understanding the Calculations: Connecting Orbital Mechanics to Spacetime  
[Back to Table of contents](#table-of-contents)  
  
The table above presents various ways to express the **Schwarzschild radius** (rs = (2GM)/c^2 )  
 using the orbital parameters of planets in our Solar System. The Schwarzschild radius is a fundamental concept in **General Relativity**,  
defining the boundary around a mass (like the Sun) where gravity is so strong that nothing, not even light,  
can escape if it crosses this point. For our Sun, this theoretical radius is approximately 2953[m].  
  
Notice how the different combinations of planetary orbital elements (semi-major axis a, eccentricity e, orbital period T, velocities  
Vp,Va,Vavg , specific angular momentum h, and specific orbital energy E), when adjusted for relativistic effects   
(like the perihelion precession term dφ), consistently yield values very close to the Sun's Schwarzschild radius.   
This elegantly demonstrates the deep interconnectedness between classical Newtonian orbital mechanics   
and the more precise framework of Einstein's General Relativity. It showcases how these seemingly disparate orbital characteristics  
are fundamentally tied to the gravitational properties of the central mass (the Sun).  
  
# Practical Implications and Relativistic Effects  
  
While the Schwarzschild radius is most famously associated with black holes, understanding its underlying principles helps us appreciate  
the nuances of gravity even in less extreme environments:  
  
* **Artificial Satellites and Stable Orbits:**  
  
For Earth's artificial satellites to maintain their "natural" and long-lasting orbits,  
they must operate far outside Earth's own Schwarzschild radius (which is a mere 9mm for Earth's mass!).  
The stability of their orbits is fundamentally ensured by their distance from this theoretical boundary.  
Our everyday experience with orbital mechanics largely relies on Newtonian physics,  
but the underlying relativistic framework ensures that these orbits are naturally stable under gravity.  
  
* **Precision and Relativistic Corrections:**  
  
Even for Earth-orbiting satellites, subtle relativistic effects are critical.  
For instance, the Global Positioning System (GPS) relies on extremely precise timing. Atomic clocks on GPS satellites experience  
both **special relativistic time dilation** (due to their high speed) and **general relativistic time dilation**  
(due to Earth's weaker gravitational potential compared to its surface).  
Without accounting for these tiny relativistic corrections, GPS would quickly accumulate errors, demonstrating  
that even far from a black hole, the principles derived from General Relativity have real-world impact.  
  
# Schwarzschild radius as a standard for orbital elements  
  
The ability to determine the Schwarzschild radius from the observed **various orbital elements** of **planets and satellites**,  
which maintain their stable paths, highlights its significance as a criterion for orbital stability.  
Conversely, for any truly natural orbit, the precision of its orbital elements (for planets and satellites alike)  
can be cross-verified and potentially refined by aligning them with the value of the Schwarzschild radius derived from the central mass.  
  
This implies that the importance of **the Schwarzschild radius** is synonymous with that of **the standard gravitational parameter** μ=GM.  
μ is a fundamental physical quantity, derived from the mass and the gravitational constant,  
representing the inherent strength of a gravitational source in classical orbital mechanics. The Schwarzschild radius  
$( r_s = \frac{2GM}{c^2} )$ can be seen as this same μ, scaled by the speed of light squared,  
effectively expressing the **"strength of gravity"** in units of distance. Thus, both μ and $r_s$ equally represent the gravitational influence of a body,  
though from different perspectives (classical vs. relativistic, or different unit systems).  
  
This emphasizes the fundamental role of general relativistic principles even in seemingly Newtonian orbital mechanics.  
  
---  
  
#  Metric Signature Conventions: Spacelike-First vs. Timelike-First  
[Back to Table of contents](#table-of-contents)  
  
In the context of Special Relativity, the Minkowski metric, which defines spacetime intervals,  
is commonly expressed using one of two primary signature conventions.  
  
The first, often termed **spacelike-first** (or **mostly plus**), adopts the signature (-c^2,1,1,1).  
In this convention, the spacetime interval squared (ds^2) is defined as:  
  
ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2  
  
This signature is frequently used in general relativity and by some particle physicists.  
  
Conversely, the second, known as **timelike-first** (or **mostly minus**), uses the signature (c^2,-1,-1,-1).  
Here, ds^2 is defined as: 
  
ds^2 = c^2 dt^2 - dx^2 - dy^2 - dz^2  
  
This convention is widely adopted by many particle physicists and in quantum field theory.  
  
It's crucial to understand that both conventions describe the same underlying physics;  
they merely differ in the algebraic sign of the interval, which affects whether timelike or spacelike intervals are positive.  
  
---  
  
# Interplay Between Relativity and Quaternions  
When attempting to integrate quaternions into the framework of Special Relativity, the choice of metric signature directly influences  
how a "squared norm" for a quaternion-like entity would naturally be expressed.  
  
If we consider a quaternion q = w + xi + yj + zk where w represents a time-like component (e.g., ct) and x, y, z represent spatial components,  
its "squared norm" would conform to the chosen spacetime metric.  
  
For instance, if one adopts the **spacelike-first metric convention (-c^2, 1, 1, 1)** for spacetime,  
then a natural quaternion "squared norm" to represent this interval would be:  
  
s^2 = -(ct)^2 + x^2 + y^2 + z^2  
  
However, if the **timelike-first metric convention (c^2, -1, -1, -1)** is used, the corresponding quaternion "squared norm"  
would naturally take the form:  
  
r^2 = (ct)^2 - x^2 - y^2 - z^2  
  
These different expressions highlight how the algebraic structure of spacetime geometry dictates the form of mathematical tools,  
such as quaternion "norms," when applied to physical phenomena.  
  
---  
  
# The Intrinsic Meaning: (v/c)^2  
Regardless of whether the **spacelike-first** or **timelike-first** convention is employed, both forms of the spacetime  
interval fundamentally articulate the same physical principle. They describe the relationship between the distance light travels  
in a given unit of time and the coordinate change of an object over that same unit of time.  
  
At its core, the spacetime interval represents the squared relative velocity of an object with respect to the speed of light,  
effectively encapsulating the term **(v/c)^2**.  
  
Let's illustrate this by setting c=1 for simplicity:  
  
In the **timelike-first convention**: s^2 = t^2 - (x^2 + y^2 + z^2).  
If an object travels a spatial distance $L = \sqrt{x^2 + y^2 + z^2}$ in time t, then its velocity v = L/t, implying L = vt.  
Substituting this into the equation yields: s^2 = t^2 - (vt)^2 = t^2 (1 - v^2).  
Restoring c: s^2 = t^2 (1 - (v/c)^2).  
  
Similarly, in the **spacelike-first convention**: s^2 = -t^2 + (x^2 + y^2 + z^2).  
Substituting L = vt: s^2 = -t^2 + (vt)^2 = t^2 (-1 + v^2).  
Restoring c: s^2 = t^2 (-1 + (v/c)^2).  
  
Both forms clearly show that the spacetime interval is intimately tied to the factor (1 - (v/c)^2) or its negative.  
This factor is the cornerstone of relativistic effects such as **time dilation** and **length contraction**,  
demonstrating that the spacetime metric inherently encodes how an object's speed relative to light influences  
its progression through spacetime.  
  
ds^2 = c^2 dt^2 - dx^2 - dy^2 - dz^2  
ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2  
The reason ds^2 has this formula is that  
r^2 = x^2 + y^2  
is the radius (distance between two points) of a circle of real numbers where the two elements are homogeneous real numbers  
r^2 = x^2 - y^2 = x^2 + (iy)^2  
is the radius (distance between two points) of a circle of complex numbers where the two elements  
are heterogeneous real and imaginary numbers  
In other words,  
we can also write  
s = Aexp(iθ),  
which is very useful when quantum mechanics is also included.  
  
So, without even searching for a unified theory,  
isn't it just the quantization of planetary constants,  
such as Jupiter's constants, which tend to gather mass, in the form  
s=Aexp(iθ)?  
  
To be precise,  
If we write s=Aexp(ciθ), isn't it ds itself?  
That is, specifically  
s=Acosθ+Aicsinθ  
Re|u(x,t)|=cosθ  
In|u(x,t)|=sinθ  
(Re|u(x,t)|)^2=cos^2θ  
(In|u(x,t)|)^2=sin^2θ  
u(x,t)^2=cos^2θ+sin^2θ=1  
e^cix=cosx+icsinx  
e^2ix=cos^2x+sin^2x=1  
And this seems to be the wave function of spacetime.  
E=s^2=Aexp(ciθ)=Acos^2θ+Acsin^2θ=hν=mc^2  
Maybe? It's just a guess, but  
Oh, I got a hunch!  
Space-time wave function  
E=s^2=Aexp(ciθ)=Acos^2θ+Acsin^2θ=hν=mc^2  
Right?  
  
In other words, the space-time wave function  
E=s^2=Aexp(ciθ)=Acos^2θ+Acsin^2θ=((ict)^2)+(x^2+y^2+z^2)=hν=mc^2  
is correct.  
  
So I guess we have to piece this together somehow.  
The space-time wave function E=As^2  
Dimensional analysis is  
E[kgm^2/s^2]=A[kg/s^2]s^2[m^2]  
Continuing with the dimensional analysis,  
1/G[kg^2/Nm^2]=1/G[kg^2/[kgm/s^2]m^2]=1/G[kgs^2/m^3]  
c^2[m^2/s^2]/G[kgs^2/m^3]=c^2/G[kg/m]  
c^2/G[kg/m]=A[kg/s^2]B[s^2/m]  
A[kg/s^2]=c^2[m^2/s^2]a[m/s^2]/(G[kg/m])  
E[kgm^2/s^2]=A[kg/s^2]s^2[m^2]=(c^2a/G)[kg/s^2]s^2[m^2]  
Acceleration a is calculated using the Schwarzschild radius rs:  
a=c^2/rs. Therefore,  
E[kgm^2/s^2]=A[kg/s^2]s^2[m^2]=(c^4/rsG)[kg/s^2]s^2[m^2]  
Therefore,  
the space-time wave function is  
E=(c^4/rsG)s^2=(c^4/rsG)Aexp(ciθ)=(c^4/rsG)(Acos^2θ+Acsin^2θ)  
=(c^4/rsG)(((ict)^2)+(x^2+y^2+z^2))=hν=mc^2  
There's no doubt about it.  
  
The wave function of space-time, or the quantization of space-time, is  
E=As^2=(c^4/rsG)s^2  
Since rs=2GM/c^2,  
E=As^2=(c^6/2MG^2)s^2=hν=mc^2  
  
So maybe  
(c^6/2MG^2)(((ict)^2)+(x^2+y^2+z^2))=mc^2  
m=(c^4/2MG^2)(((ict)^2)+(x^2+y^2+z^2))  
(c^4/2MmG^2)(((ict)^2)+(x^2+y^2+z^2))=1  
s^2=r^2  
(c^4r^2/2MmG^2)=1  
(2MmG^2/c^4r^2)=1  
F=-GMm/r^2  
(-2GF/c^4)=1  
This is the equation for an ellipse, though it sounds a bit fake.  
Np Planck force  
F=-GMm/r^2=-c^4/2G=-(1/2)Np  
  
In other words, the wave function of space-time,  
or the quantization of space-time, is  
E=As^2=(c^6/2MG^2)s^2=(c^6/2MG^2)(((ict)^2)+(x^2+y^2+z^2))=mc^2  
The above equation satisfies  
F=-GMm/r^2=-GMm/s^2=-(1/2)Np  
  
I tried to verify -(1/2)Np  
  
![img of fig](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/img/touitu004.png)  
  
In other words, the distance due to the rest mass, S^2,  
is defined as S^2 = mc^2 * (2G^2M/c^6).  
The gravitational force due to S^2 is defined as -0.5Np.  
F = -GM m/S^2 = -GM m/(mc^2 * (2G^2M/c^6))  
= -0.5c^4/G = -0.5Np  
  
![gif of quan](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/img/Quan000.gif)  
  
![gif of quan](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/img/Quan001.gif)  
   
This is how it is expressed when simulating Euler's formula.<br>
The reason why I claim to have simulated Euler's formula is:<br>
Under these assumptions,<br>
t=sinθ<br>
x=cosθ<br>
I considered the following:<br>
<br>
The values are arbitrary, but they are just a concept.<br>
The apparent velocity of an object, vabs, is:<br>
In the range of 0π.<br>
<table>
<thead>
<tr>
<th>θ</th>
<th>0</th>
<th>0+d</th>
<th>π/2</th>
<th>π-d</th>
<th>π</th>
</tr>
</thead>
<tbody>
<tr>
<td>sin</td>
<td>0</td>
<td>0.1</td>
<td>1</td>
<td>0.1</td>
<td>0</td>
</tr>
<tr>
<td>cos</td>
<td>1</td>
<td>0.9</td>
<td>0</td>
<td>-0.9</td>
<td>-1</td>
</tr>
</tbody>

</table>
What if we make the sine of this evenly spaced? <br> 
<table> 
<thead> 
<tr> 
<th>θ</th> 
<th>0</th> 
<th>0+d</th> 
<th>π/2</th> 
<th>π-d</th> 
<th>π</th> 
</tr> 
</thead> 
<tbody> 
<tr> 
<td>θ'</td> 
<td>0</td> 
<td>π/2-d</td> 
<td>π/2</td> 
<td>π/2-d</td> 
<td>0</td> 
</tr> 
<tr> 
<td>sin'</td> 
<td>0</td> 
<td>1</td> 
<td>2</td> 
<td>3</td> 
<td>4</td> 
</tr> <tr>
<td>cos</td>
<td>1</td>
<td>0.7</td>
<td>0</td>
<td>-0.7</td>
<td>-1</td>
</tr>
<tr>
<td>vabs</td>
<td>0</td>
<td>0.3</td>
<td>1</td>
<td>0.3</td>
<td>0</td>
</tr>
</tbody>

</table>
Therefore, we addressed the question of what the apparent velocity<br>
would be from a stationary observer if the time axis were sinθ.<br>
      
        
Since t=sinθ and dt=cosθ, I think the appearance from  
a stationary observer would be as I understand it.  
  
dt is maximum at the outer edge of the motion and minimum at the center.  
The velocity is v = dx/dt, so  
the velocity is minimum at the outer edge of the motion, accelerates toward the center,  
reaches a maximum, and begins to decelerate once it passes the center.  
  
The mathematical explanation for Euler's formula can be simplified as follows:  
t=sinθ,dt=cosθ,x=cosθ,dx=-sinθ  
dt/dt=1  
dx/dt=-tanθ  
  
◯AB is A's ◯ as seen from B.  
tAB=sinθ, dtAB=cosθ, xAB=cosθ, dxAB=-sinθ  
Let's define tB=t, dtB=1, xB=0, dxB=0 as follows.  
vAB=dxAB/dtAB=-sinθ/(cosθdθ)=-tanθ  
xAB=∫(vAB)dtAB=∫(-sinθ/cosθ)(cosθdθ)=cosθ=xAB,  
which ultimately returns to the original premise.  
  
---  

# About the curvature of light  
[Back to Table of contents](#table-of-contents)  
  
Arg, the acceleration of gravitational force in a circular orbit taking general relativity into account  
r, radius, G, the gravitational constant, M, mass, V, orbital velocity, c, the speed of light, S, the relativistic correction term  
Arg = -(GM/r^2)(1 + S) = -(GM/r^2)(1 + 3(V/c)^2)  
Gravitational constant G = 6.67259e-11 [m^3/kgs^2], speed of light: c = 299792458 [m/s], mass of the sun Ms = 1.9891e+30 [kg]  
The time t it takes for a velocity c to travel 2rs, the diameter of the sun, is  
t = 2rs/c  
The speed of curvature v is  
v = Argt  
Arg = -(GM/r^2)(1 + 3(V/c)^2) = -4GMs/rs^2  
Therefore,  
tanθ=v/c=Argt/c=(4GMs/rs^2)(2rs/c)/c=8GMs/rsc^2  
Since θ is smaller than 1, it can be approximated  
θ=8GMs/rsc^2  
and was correctly calculated.  
  
---  
  
# Rethinking the Law of Inertia in Newtonian Mechanics  
  
Relativity effects are the perihelion shift $d\phi$ and the spatial inertial resistance or inertial boost $(\frac{v}{c})^2$.  
  
Approximation of relativity in Euclidean geometry (coefficients omitted)  
  
$F=-(\frac{GMm}{r^2})(1+S)=-(\frac{GMm}{r^2})(1+d\phi)=-(\frac{GMm}{r^2})(1+(\frac{v}{c})^2)$  
  
**Relativity effect S (Schwarzschild correction) (coefficients omitted)**  
$S=d\phi=(\frac{v}{c})^2$  
**Special relativity effect SS (Schwarzschild correction + special)**  
$SS=(\frac{-0.5}{1-e^2})(\frac{v}{c})^2$  
**General relativity effect SG (Schwarzschild correction + general)**  
$SG=(\frac{3.0}{1-e^2})(\frac{v}{c})^2$  
**Composite relativity effect SGS (Schwarzschild correction + general + special)**  
$SGS=SG+SS=(\frac{2.5}{1-e^2})(\frac{v}{c})^2$  
  
I was able to calculate that  
In a straight-line orbit, the relativistic effect acts as a spatial inertial boost,  
reaching the speed of light over an infinite period of time.  
In an elliptical orbit, the relativistic effect acts as a spatial inertial resistance,  
reaching absolute rest over an infinite period of time.  
  
If we observe a decrease in energy due to gravitational wave emission from  
the binary pulsar PSR B1913+16, then theoretically, over an infinite time,  
they will lose all kinetic energy and become absolutely stationary.  
In reality, however, they will either collide and explode, or be thrown far away  
by a gravitational catapult effect.  
  
# The Twin Paradox  
  
In the space travel of Earth and Andromeda, if we perform triangulation of the sun, earth,  
and spaceship, we can roughly infer how things moved.  
In the two-body problem, it's confusing to explain how things moved.  
Sun and Earth  
Sun and Spaceship  
Earth and Spaceship  
In this problem, we can construct a precise coordinate system to explain how things moved.  
In the Don Quixote example,  
In the triangulation of the windmill, Don Quixote, and Sancho,  
it is objectively shown that the windmill never attacked Don Quixote,  
Don Quixote simply charged at the windmill.  
  
Subjectivity can be attributed to two-body relative problems,  
and objectivity can be attributed to many-body absolute problems.  
Lines and triangles It's due to the nature of the shape.  
  
Don Quixote claims that the windmill attacked him, but Sancho testifies that Don Quixote ran toward the windmill.  
While the windmill and Don Quixote alone would leave the truth unclear,  
Sancho's testimony reveals the objective situation (absolute global coordinates).  
This is the nature of triangles.  
  
At t=0  
|             | Global coordinates: Windmill reference | Local coordinates: Don Quixote | Local coordinates: Windmill | Local coordinates: Sancho |
| :---------- | :------------------------------------- | :----------------------------- | :-------------------------- | :------------------------ |
| Don Quixote | 0,10                                   | 0,0                            | 0,-10                       | 5,-5                      |
| Windmill    | 0,0                                    | 0,10                           | 0,0                         | 5,5                       |
| Sancho      | 5,5                                    | -5,5                           | -5,-5                       | 0,0                       |
  
At t=5  
|             | Global coordinates: Windmill reference | Local coordinates: Don Quixote | Local coordinates: Windmill | Local coordinates: Sancho |
| :---------- | :------------------------------------- | :----------------------------- | :-------------------------- | :------------------------ |
| Don Quixote | 0.5                                    | 0.0                            | 0.-5                        | 5.0                       |
| Windmill    | 0.0                                    | 0.5                            | 0.0                         | 5.5                       |
| Sancho      | 5.5                                    | -5.0                           | -5.-5                       | 0.0                       |
  
At t=10  
|             | Global coordinates: Windmill reference | Local coordinates: Don Quixote | Local coordinates: Windmill | Local coordinates: Sancho |
| :---------- | :------------------------------------- | :----------------------------- | :-------------------------- | :------------------------ |
| Don Quixote | 0.0                                    | 0.0                            | 0.0                         | 5.5                       |
| Windmill    | 0.0                                    | 0,0                            | 0,0                         | 5,5                       |
| Sancho      | 5,5                                    | -5,-5                          | -5,-5                       | 0,0                       |
  
|             | Absolute Speed : Windmill Reference    | Relative Speed : Don Quixote   | Relative Speed : Windmill   | Relative Speed : Sancho   |
| :---------- | :------------------------------------- | :----------------------------- | :-------------------------- | :------------------------ |
| Don Quixote | 0,-1                                   | 0,0                            | 0,1                         | 0,1                       |
| Windmill    | 0,0                                    | 0,-1                           | 0,0                         | 0,0                       |
| Sancho      | 0,0                                    | 0,-1                           | 0,0                         | 0,0                       |
  
![gif of donq](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/img/Donq001.gif)  
  
Each one looks like this, but by combining the information from   
the three perspectives, an absolute, objective relationship becomes clear.  
  
In this simulation, especially at t=x, the unchanging triangle,   
whose angle and size remain unchanged regardless of the perspective,  
represents an objective physical arrangement.  
This is a fundamental explanation of triangulation.  
  
![gif of donq](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/img/Donq000.gif)  
  
Even if all objects are moved randomly, an objective physical arrangement,  
a triangle, is observed that remains unchanged.  
  
[Simulation of the Twin Paradox (External Link)](https://nas6.net/rel.htm#twin)  
  
![gif of donq](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/img/Donq004.gif)  
  
Even if all objects are moved randomly, an unchanging triangle is observed.<br>
(Condition for determining the three coordinates: A triangle exists.)<br>
An objective physical arrangement is observed.<br>
The red line segment is the line segment connecting the distance between the selected viewpoint and the global origin.<br>
<!--
The blue gauge is proportional to the distance between the selected viewpoint and the global origin.<br>
Therefore, it is the spatial component of s^2 of the selected viewpoint.<br>
The derivative of this is the green gauge, which is the spatial component of ds^2.<br>
//!-->
The velocity of the selected viewpoint is the green gauge, which is the spatial component of ds^2.<br>
Calculating dt from ds^2 The time axis is variable.<br>
When viewed from a local perspective, the time accelerates, but this is because the local perspective's<br>
time axis scale is small, so it progresses quickly.<br>
From a global perspective, the time axis scale is large, so it progresses slowly.<br>
This is the twin paradox.<br>
For comparison, a minister traveling back and forth at a constant speed has been added.<br>
A yellow flash has been implemented in the lower right corner to make the time interval easier to visualize.<br>
<br>
Theoretical basis<br>
<br>
Consider train B, with a speed V=0.6c as seen from ground observer A.<br>
A→B is B as seen from A.<br> 
<table> 
<thead> 
<tr> 
<th>t</th> 
<th>0</th> 
<th>1</th> 
<th>2</th> 
<th>3</th> 
<th>4</th> 
<th>5</th> 
</tr> 
</thead> 
<tbody> 
<tr> 
<td>tA</td> 
<td>0</td> 
<td>1</td> 
<td>2</td> 
<td>3</td> 
<td>4</td> 
<td>5</td> 
</tr> 
<tr> 
<td>xA</td> 
<td>0</td> 
<td>0</td> 
<td>0</td> 
<td>0</td> 
<td>0</td> 
<td>0</td> </tr> 
<tr> 
<td>xA→B</td> 
<td>0</td> 
<td>0.6</td> 
<td>1.2</td> 
<td>1.8</td> 
<td>2.4</td> 
<td>3.0</td> 
</tr> 
</tbody> 
</table> 
<table> 
<thead> 
<tr> 
<th>tA→B</th> 
<th>0</th> 
<th>0.8</th> 
<th>1.6</th> 
<th>2.4</th> 
<th>3.2</th> 
<th>4.0</th> 
</tr> 
</thead> 
<tbody> 
<tr> 
<td>xB→B</td> 
<td>0</td> <td>0.48</td>
<td>0.96</td>
<td>1.44</td>
<td>1.92</td>
<td>2.4</td>
</tr>
</tbody>
</table>
This is difficult to use, so let's recalculate when tA→B=0, 1, 2, 3, 4, and 5.<br>
Reorganize the values.<br>
<table>
<thead>
<tr>
<th>tA→B</th>
<th>0</th>
<th>1</th>
<th>2</th>
<th>3</th>
<th>4</th>
<th>5</th>
</tr>
</thead>
<tbody>
<tr>
<td>xA→B</td>
<td>0</td>
<td>0.6</td>
<td>1.2</td>
<td>1.8</td>
<td>2.4</td>
<td>3.0</td>
</tr>
</tbody>
</table>
This should appear as follows:<br>
dtA=1.0<br>
dtB=0.8<br>


<table>
<thead>
<tr>
<th>tA→B</th>
<th>0</th>
<th>0.8</th>
<th>1.6</th>
<th>2.4</th>
<th>3.2</th>
<th>4.0</th>
</tr>
</thead>
<tbody>
<tr>
<td>xB→B</td>
<td>0</td>
<td>0.48</td>
<td>0.96</td>
<td>1.44</td>
<td>1.92</td>
<td>2.4</td>
</tr>
</tbody>

</table>
Divide by dtB to adjust the time.<br>
<table>
<thead>
<tr>
<th>tA→B</th>
<th>0</th>
<th>1</th>
<th>2</th>
<th>3</th>
<th>4</th>
<th>5</th>
</tr>
</thead>
<tbody>
<tr>
<td>xA→B</td>
<td>0</td>
<td>0.6</td>
<td>1.2</td>
<td>1.8</td>
<td>2.4</td>
<td>3.0</td>
</tr>
</tbody>
</table>
So, by this logic,<br>
dividing the velocity mp[i].v seen from the selected viewpoint by dt<br>
will align the time, but if we don't multiply it by dt0 from one step before to restore mp[i].v<br>
to the global reference velocity, a cumulative bug will occur.<br>
In the end, the velocity seen from a certain viewpoint is mp[i].v*dt0/dt<br>
  
![gif of donq](https://raw.githubusercontent.com/NAS6mixfoolv/NAS6LIB/main/img/Donq007.gif)  
  
var v5 = new N6LVector([mp5[2].v.x[0], mp5[2].v.x[1], 0]);  
var ds2 = v5.SquareAbs(); //Spatial component of ds^2 only //v5.Abs()=0.999999999c  
dt5 = Math.sqrt(1.0 - ds2);  
time5[2] += timespeed5; //Rocket proper time  
dt50[2] = dt5;  
time5[0] += timespeed5 / dt5; //Earth proper time  
time5[1] += timespeed5 / dt5; //Andromeda proper time  
//Rocket x-coordinate displacement: unit time * screen range * speed / proper time / one-way distance  
var xx = (timespeed5 * Range5 * mp5[2].v.x[0] / dt5 / AndDis5);  
The distance decreases due to velocity/proper time, and the apparent velocity is accelerating to 22262.6c.  
Therefore, the round trip distance to Andromeda is 2.537 million light years, making the 5.075 million light-year journey in 228 years.  
  
---  
  
[Back to Table of contents](#table-of-contents)  




