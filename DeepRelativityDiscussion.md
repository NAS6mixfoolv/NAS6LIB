# Introduction  
The relativity effect is the perihelion shift $d\phi$ and the inertial drag or inertial boost of space $(\frac{v}{c})^2$  
  
---  
  
### Table of contents  
* [Approximation of relativity in Euclidean geometry (coefficients omitted)](#approximation-of-relativity-in-euclidean-geometry-coefficients-omitted)  
  * [Proof](#proof)  
* [Special and general relativity](#special-and-general-relativity)  
  
---    
  
# Approximation of relativity in Euclidean geometry (coefficients omitted)  
[Table of contents](#table-of-contents)  
  
$F=-(\frac{GMm}{r^2})(1+S)=-(\frac{GMm}{r^2})(1+d\phi)=-(\frac{GMm}{r^2})(1+(\frac{v}{c})^2)$  
  
**relativity effect S**  
$S=d\phi=(\frac{v}{c})^2$  
**Special relativity effect SS**  
$SS=(\frac{-0.5}{1-e^2})(\frac{v}{c})^2$  
**General relativity effect SG**  
$SG=(\frac{3.0}{1-e^2})(\frac{v}{c})^2$  
**Combined relativity effect SGS**  
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
[Table of contents](#table-of-contents)  

  ## Special relativity effect SS  

Lorentz contraction  
The approximation  
$a=\sqrt(1-(\frac{v}{c})^2)$  
(when $(\frac{v}{c})$ is much smaller than 1) is  
$a=1-0.5(\frac{v}{c})^2$  
  
  ## General relativity effect SG    
  
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

From \text{(*1C)}, we obtain the conservation of angular momentum:  
$r^2\frac{d\phi}{ds} = h \quad (\text{constant}) \quad \text{(*3)}$  
  
From \text{(*1D)}, we obtain the conservation of energy:  
$\left(1 - \frac{2m}{r}\right)\frac{dt}{ds} = l \quad (\text{constant}) \quad \text{(*4)}$  
  
From \text{(*1A)}:  
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
Assuming $u' \neq 0$, we can divide \text{(*7)} by $2u'$:  
$u'' + u = \frac{m}{h^2} + 3mu^2 \quad \text{(*8)}$  
This equation can be seen as $u'' + u = m/h^2$,  
which corresponds to the equation for Newtonian gravity, plus a relativistic correction term $3mu^2$.  
Considering the \textbf{equation for the gravitational force in Schwarzschild spacetime}  
in the form $F = -(GMm/r^2)(1+S)$, where $F$ is force, $r$ is radius, $G$ is gravitational constant,  
$M$ and $m$ are masses, $V$ is orbital velocity, $c$ is speed of light, and $S$ is the relativistic correction term.  
  
Here, $h = r^2\frac{d\phi}{ds}$, $m = GM/c^2$, and $u=1/r$.  
Let's examine the \textbf{relativistic correction term $3mu^2$}. We can factor out $m/h^2$:  
$u'' + u = \frac{m}{h^2}\left(1 + \frac{3mu^2}{m/h^2}\right) = \frac{m}{h^2}(1+S)$  
Now we investigate $S$:  
$S = \frac{3mu^2}{m/h^2} = 3u^2h^2 = 3\left(\frac{1}{r^2}\right)\left(r^2\frac{d\phi}{ds}\right)^2 = 3r^2\left(\frac{dt}{ds}\frac{d\phi}{dt}\right)^2 = 3r^2\left(\frac{d\phi}{dt}\right)^2\left(\frac{1}{c^2}\right) = 3\frac{(r d\phi/dt)^2}{c^2}$  
If we consider $(r d\phi/dt)$ as the tangential velocity of the circular orbit, $V$, then $S = 3(V/c)^2$.  
  
Therefore, in Euclidean geometry, the \textbf{force equation for gravity in Schwarzschild spacetime} can be expressed as:  
$F = -\frac{GMm}{r^2}(1+S) = -\frac{GMm}{r^2}\left(1 + 3\left(\frac{V}{c}\right)^2\right)$  
  
* **Orbital Velocity: Circular and Elliptical**  
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
$w=\sqrt{\frac{GN(1+e^2+2e\cos\psi}{q(1-e^2)}}$  
Squaringthevelocitygives:  
$w^2=\frac{GN(1+e^2+2e\cos\psi)}{q(1-e^2)}$  
Relativistic Correction Term for Elliptical Orbits  
When attempting to apply the relativistic correction term $3(\frac{v}{c})^2  
using the elliptical orbital velocity, the term $(1+e^2 +2e\cos\psi)$ is included.  
Considering the relationship between elliptical orbital velocity and circular orbital velocity,
and given the term $3(\frac{v}{c})^2$  
derived for a circular orbit, the additional factor needed to complete the relativistic correction is $\frac{1}{1-e^2}.
  
Thus, the relativistic correction term for an elliptical orbit becomes:  
$\frac{3}{1-e^2}(\frac{v}{c})^2$  
This expression represents the relativistic correction term for elliptical orbits in general relativity,  
corresponding to the solution for the Kerr metric in certain contexts.  
  
---  
  
# Special and General Relativity  
[Table of contents](#table-of-contents)  
  
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
  
The term $SGR$ is a converted value. It expresses the relativistic effect  
**per $1 \text{ [m]}$ of altitude, per $1 \text{ [radian]}$, and per $1 \text{ [second]}$**.  
This conversion is achieved by dividing by:  
* The distance from the Earth's center $R0$ (for per $1 \text{ [m]}$ of altitude).  
* $2\pi$ (for per $1 \text{ [radian]}$).  
* $86400$ (for per $1 \text{ [second]}$).  
  
I'm sorry, but my calculation method is a pain because I have to mess around with units.  
It seems that $SGR=g/c^2$  without doing this.  
  
So, how about gravity at altitude 0[m] on Earth using my method? Let's try to calculate the acceleration g.  
Generally, $SB=(3.0/(1-e^2 ))(v/c)^2$  
$F = -(GMm/r^2)(1+SB) = -(GMm/r^2)(1+(3.0/(1-e^2))(v/c)^2) = ma = -mg$  
$g = -(GM/r^2)(1+(3.0/(1-e^2))(v/c)^2)$  
  
$G:6.67 \times 10^{-11} , M:5.972 \times 10^{24}, r:6.370 \times 10^{6} , e:0.0167, v:462.963, c:299792458$  
$|g| = 9.816728237072093212419239772056$  
$g/c^2 = 1.0923 \times 10^{-16}$  
   
Is that right?  
  
  
[Table of contents](#table-of-contents)  




