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
$w=\sqrt\frac{GN(1+e^2+2e\cos\psi}{q(1-e^2)}$  
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
  
# Special and general relativity  
[Table of contents](#table-of-contents)  
  
* **If we were to calculate it using the effects of special relativity,**  

Mercury's orbital length $a=0.3871*2\pi=2.432[AU]$  
Orbital distance shortened by the effects of special relativity  
$a'=2.432[AU]*(-0.5)(\frac{v}{c})^2=4639.078[m]$(**A)  
(**A) is the orbital distance shortened by the effects of special relativity per revolution [m]  
Conversion to speed per radian  
$b=\frac{a'}{2\pi*V}=0.01542288777667[s/mrad]$  
Conversion from a perfect circular orbit to an elliptical orbit  
$c=\frac{b}{1-e^2}=0.01477512644554796428854595199462$  
Mercury orbits 415 times per 100 years  
Time elapsed per orbit is 7604084.8192771[s]  
Calculate the accumulation  
d=c*415*7604084.8192771=46625795.6  
Convert to arc seconds (360[degrees]*60[arc minutes]*60[arc seconds])  
e=d/(360*60*60)=35.98[arc seconds/100 years]  
e is the calculation combining special and general  
Relativistic effect $S=(\frac{v}{c})^2$  
Special effect SS is -0.5S General effect SG is 3.0S Total SGS is 2.5S  
$Ans=e*\frac{6}{5}=43 .17[arc seconds/100 years]$  
General theoretical calculation method  
$dφ=360*3600*(\frac{3}{2})*(\frac{rs}{a})*(\frac{1}{1-e^2})*4.15*100=360*3600*(\frac{3}{2})*\frac{2953}{149598700000*0.3871}*(\frac{1}{1-0.2056^2})*4.15*100=42.9[arc seconds/100 years]$  
  
To be honest, if you simplify it,  
the relativity effect $S=(\frac{v}{c})^2$  
  
This is easier to calculate than the previous method of applying special effects to the circular orbit of Mercury  
Mercury's general theory of relativity effect $SG=\frac{3.0}{1-e^2}(\frac{v}{c}) ^2=7.987579322995e-8$  
Convert this to [arc seconds/100 years]  
dφ'=SG*360*3600*4.15*100=42.96[arc seconds/100 years]  
360*3600 is arc seconds, 4.15 is the number of orbits of Mercury in one year, 100 is 100 years  
$dφ'=360*3600*3*(\frac{v}{c})^2*4.15*100*(\frac{1}{1-e^2})=42.96[arc seconds/100 years]$  
Generally derived theoretical value dφ  
$dφ=360*3600*(\frac{3}{2})*(\frac{rs}{a})*4.15*100*(\frac{1}{1-e^2})=42.96[arc seconds/100 years]$  
Well, that's how it goes  
  
* **Let's calculate the clock difference due to the difference in altitude.**  

Regarding the relativistic effect S  
Special SS = (-0.5/(1-e^2))(v/c)^2  
General SG = (3.0/(1-e^2))(v/c)^2  
Special + General SGS = (2.5/(1-e^2))(v/c)^2  
Calculated as follows.  
  
Observational data of clock difference: 1.1e-16 [s/m]  
Circumference at altitude 0 [m]: L0 = 40000000 [m]  
Distance from the center of the Earth: R0 = L0/2π = 6366197 [m]  
Day T0 = 86400 [s]  
Rotational speed V0 = L0/T0 = 462.963 [m/s]  
SGR0=(2.5)(V0/c)^2=5.96198804041e-12  
Altitude 1000[m] Distance from the center of the Earth R1000=R0+1000=6367197[m]  
Circumference of the point L1000=R1000(2π)40006278[m]  
Rotational speed V1000=L1000/T0=463.0356323879[m/s]  
SGR1000=(2.5)(V0/c)^2=5.963859845632e-12  
SGRR1000=SGR1000/SC0-1=3.139565543e-4  
SGRR=SGRR1000/(R0*2 π*86400)=9.084392e-17  
The actual measured value was 1.1e-16, so the calculation was roughly successful＞＜  
  
SGRR1000 extracts the effect of general relativity at an altitude of 1000[m], with altitude 0[m] as the base  
  
SGRR is a conversion that divides by the distance from the center of the Earth R0 to get per 1[m] of altitude,  
divides by 2π to get per 1[rad], and divides by 86400 to get per 1[s]  
  
I'm sorry, but my calculation method is a pain because I have to mess around with units  
  
It seems that SCR=g/c^2  
without doing this  
  
So, how about gravity at altitude 0[m] on Earth using my method? Let's try to calculate the acceleration g.  
Generally, SB=(3.0/(1-e^2))(v/c)^2  
F=(GMm/r^2)(1+SB)=(GMm/r^2)(1+(3.0/(1-e^2))(v/c)^2)=ma=mg  
g=(GM/r^2)(1+(3.0/(1-e^2))(v/c)^2)  
G:6.67e-11M:5.972e24r:6.370e6e:0.0167v:462.963c:299792458  
g=9.816728237072093212419239772056e+0  
g/c^2=1.0923e-16  
Is that right?  
  






