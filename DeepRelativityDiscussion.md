# Introduction  
The relativity effect is the perihelion shift $d\phi$ and the inertial drag or inertial boost of space $(\frac{v}{c})^2$  
  
---  
  
# Approximation of relativity in Euclidean geometry (coefficients omitted)  
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
  ## Special relativity effect SS  
Lorentz contraction  
The approximation  
$a=\sqrt(1-(\frac{v}{c})^2)$  
(when $(\frac{v}{c})$ is much smaller than 1) is  
$a=1-0.5(\frac{v}{c})^2$  
  
  ## General relativity effect SG    
  
In the case of a perfect circular orbit (e=0)  
  
The line element of the Schwarzschild (vacuum solution of the Einstein equations with spherical symmetry)  
metric (ci,1,1,1) is  
c the speed of light t coordinate time r radial coordinate θ latitude coordinate φ longitude coordinate  
2m = rs Schwarzschild radius = 2GM/c^2M mass  
  
ds^2=(1-rs/r)c^2dt^2-dr^2/(1-rs/r)-r^2dθ^2-r^2sin^2θdψ^2  
  
ds^2=(1-2m/r)c^2dt^2-dr^2/( 1-2m/r)-r^2dθ^2-r^2sin^2θdψ^2･･･(*1)  
The variation problem  
δ∫((1-2m/r)c^2(dt/ds)^2-(dr/ds)^2/(1-2m/r)-r^2(dθ/ds)^2-r^2sin^2θ(dψ/ds)^2)ds=0･･･(*2)  
The equation for each component is derived as  
i=1,r,(*1)/ds^2  
1=(1-2m/r)c^2(dt/ds)^2-(dr/ds)^2/(1 -2m/r)-r^2(dθ/ds)^2-r^2sin^2θ(dψ/ds)^2･･･(*1A)
i=2,θ,
(d/ds)(r^2(dθ/ds))=r^2sinθcosθ(dψ/ds)^2･･･(*1B)
i=3,ψ,
(d/ds)(r^2sin^2θ(dψ/ds))=0･･･(*1C)
i=0,ct
(d/ds)((1-2m/r)(dt/ds))=0･･･(*1D)
choose the ingredients
θ is π/2, d θ/ds=0 on the equatorial plane, and θ is a constant, so (*1B) is ignored.
ψ is r^2(dψ/ds)=h(constant) conservation of angular momentum from (*1C)...(*3)
t is (1-2m/r)(dt/ds)=l(constant) conservation of energy from (*1D)...(*4)
(1-2m/r)=(cl)^2-(dr/ds)^2-(h/r)^2(1-2m/r)...(*5)
r differentiated as a function of ψ is
(d/d From ψ)(r(ψ))=r'=(dr/ds)(ds/dψ),(*3)
From (dr/ds)=r'(dψ/ds)=hr'/r^2,r=1/u,r'=-u'/u^2,(*5)
(1-2mu)=(cl)^2-(hu')^2-(hu)^2(1-2mu)
u'^2=((cl)^2-1)/h^2+2mu/h^2-u^2+2mu^3･･･(*6)
Differentiate with ψ
2u'u''=2mu'/h^2-2uu'+6mu^ 2u'...(*7)
The solution u'=0,u=1/r(constant) is a circular orbit
u''+u=m/h^2+3mu^2...(*8)
If you imagine this equation, u''+u=m/h^2 corresponds to the equation for gravitation
The equation for acceleration RelativeGravity due to gravity in Schwarzschild spacetime is
r radius, G gravitational constant, M mass, V orbital velocity, c speed of light, S relativity correction term
Rg=-(GM/r^2)(1+S)
so here, h= r^2dψ/ds, m=kM/c^2, u=1/r,
and verify the relativity correction term 3mu^2,
group it with m/h^2,
and put it in the form u''+u=(m/h^2)(1+3mu^2/(m/h^2)=(m/h^2)(1+S), and examine S
3mu^2/(m/h^2)=3u^2h^2=3(1/r^2)(r^2dψ/ds)^2=3r^2((dt/ds)(dψ/dt))^2=3r^2(dψ/dt)^2(1/c^2)
=3(rdψ/dt)^2(1/c^2)
(rdψ/dt) is the tangential velocity of the circle, so if we consider it as the orbital velocity V, we can solve it as 3(V/c)^2
The relativistic correction term S=3(V/c)^2
In Euclidean geometry,
the formula for gravitation in Schwarzschild spacetime is
F force, r radius, G gravitational constant, M, m mass, V orbital velocity, c speed of light, S relativistic correction term
F=-(GMm/r^2)(1+S)=-(GM/r^2)(1+3(V/c)^2)








