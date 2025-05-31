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
  
\documentclass{article}
\usepackage{amsmath} % For mathematical environments like align, equation
\usepackage{amssymb} % For mathematical symbols
\usepackage{physics} % For common physics notations like \dv, \pdv
\usepackage{hyperref} % For hyperlinks (if you want to keep the (*X) links)

% Optional: Adjust section numbering depth
\setcounter{secnumdepth}{0} % No section numbering

\begin{document}

\section*{Circular Orbits in Schwarzschild Spacetime}

In the case of a circular orbit (eccentricity $e=0$):

The line element of the Schwarzschild metric (a vacuum solution to Einstein's field equations possessing spherical symmetry) is given by:
where $c$ is the speed of light, $t$ is the coordinate time, $r$ is the radial coordinate, $\theta$ is the co-latitude coordinate, $\phi$ is the longitude coordinate, and $2m = r_s$ is the Schwarzschild radius, defined as $r_s = 2GM/c^2$, with $M$ being the mass of the central body.

The metric tensor in units $(c^2, 1, 1, 1)$ is:
$$ds^2 = \left(1 - \frac{r_s}{r}\right)c^2 dt^2 - \frac{dr^2}{\left(1 - \frac{r_s}{r}\right)} - r^2 d\theta^2 - r^2 \sin^2\theta d\phi^2$$
Substituting $r_s = 2m$:
$$ds^2 = \left(1 - \frac{2m}{r}\right)c^2 dt^2 - \frac{dr^2}{\left(1 - \frac{2m}{r}\right)} - r^2 d\theta^2 - r^2 \sin^2\theta d\phi^2 \quad \text{(*1)}$$

The corresponding variational problem is:
$$\delta\int \left[ \left(1 - \frac{2m}{r}\right)c^2\left(\frac{dt}{ds}\right)^2 - \frac{1}{\left(1 - \frac{2m}{r}\right)}\left(\frac{dr}{ds}\right)^2 - r^2\left(\frac{d\theta}{ds}\right)^2 - r^2\sin^2\theta\left(\frac{d\phi}{ds}\right)^2 \right] ds = 0 \quad \text{(*2)}$$

Deriving the equations for each component:

\begin{enumerate}
    \item $i=1, r$: From \text{(*1)} divided by $ds^2$:
    $$1 = \left(1 - \frac{2m}{r}\right)c^2\left(\frac{dt}{ds}\right)^2 - \frac{1}{\left(1 - \frac{2m}{r}\right)}\left(\frac{dr}{ds}\right)^2 - r^2\left(\frac{d\theta}{ds}\right)^2 - r^2\sin^2\theta\left(\frac{d\phi}{ds}\right)^2 \quad \text{(*1A)}$$
    \item $i=2, \theta$:
    $$\frac{d}{ds}\left(r^2\frac{d\theta}{ds}\right) = r^2\sin\theta\cos\theta\left(\frac{d\phi}{ds}\right)^2 \quad \text{(*1B)}$$
    \item $i=3, \phi$:
    $$\frac{d}{ds}\left(r^2\sin^2\theta\frac{d\phi}{ds}\right) = 0 \quad \text{(*1C)}$$
    \item $i=0, ct$:
    $$\frac{d}{ds}\left[\left(1 - \frac{2m}{r}\right)\left(\frac{dt}{ds}\right)\right] = 0 \quad \text{(*1D)}$$
\end{enumerate}

Choosing specific components:
We consider motion in the equatorial plane, where $\theta = \pi/2$ and $\dv{\theta}{s} = 0$. Since $\theta$ is constant, \text{(*1B)} is ignored.

From \text{(*1C)}, we obtain the conservation of angular momentum:
$$r^2\frac{d\phi}{ds} = h \quad (\text{constant}) \quad \text{(*3)}$$

From \text{(*1D)}, we obtain the conservation of energy:
$$\left(1 - \frac{2m}{r}\right)\frac{dt}{ds} = l \quad (\text{constant}) \quad \text{(*4)}$$

From \text{(*1A)}:
$$\left(1 - \frac{2m}{r}\right) = (cl)^2 - \left(\frac{dr}{ds}\right)^2 - \left(\frac{h}{r}\right)^2\left(1 - \frac{2m}{r}\right) \quad \text{(*5)}$$

Let's differentiate $r$ as a function of $\phi$:
$\dv{r}{\phi} = r' = \dv{r}{s}\dv{s}{\phi}$
From \text{(*3)}, $\dv{s}{\phi} = r^2/h$. So, $\dv{r}{s} = r'\dv{\phi}{s} = hr'/r^2$.
Let $u = 1/r$, then $r' = \dv{}{\phi}(1/u) = -u'/u^2$.
Substituting into \text{(*5)}:
$$\left(1 - 2mu\right) = (cl)^2 - (hu')^2 - (hu)^2\left(1 - 2mu\right)$$
Rearranging to solve for $u'^2$:
$$u'^2 = \frac{(cl)^2 - 1}{h^2} + \frac{2mu}{h^2} - u^2 + 2mu^3 \quad \text{(*6)}$$

Differentiating with respect to $\phi$:
$$2u'u'' = \frac{2m}{h^2}u' - 2uu' + 6mu^2u' \quad \text{(*7)}$$
The solution $u'=0$, which implies $u=1/r$ (constant), corresponds to a circular orbit.
Assuming $u' \neq 0$, we can divide \text{(*7)} by $2u'$:
$$u'' + u = \frac{m}{h^2} + 3mu^2 \quad \text{(*8)}$$
This equation can be seen as $u'' + u = m/h^2$, which corresponds to the equation for Newtonian gravity, plus a relativistic correction term $3mu^2$.
Considering the \textbf{equation for the gravitational force in Schwarzschild spacetime} in the form $F = -(GMm/r^2)(1+S)$, where $F$ is force, $r$ is radius, $G$ is gravitational constant, $M$ and $m$ are masses, $V$ is orbital velocity, $c$ is speed of light, and $S$ is the relativistic correction term.

Here, $h = r^2\dv{\phi}{s}$, $m = GM/c^2$, and $u=1/r$.
Let's examine the \textbf{relativistic correction term $3mu^2$}. We can factor out $m/h^2$:
$$u'' + u = \frac{m}{h^2}\left(1 + \frac{3mu^2}{m/h^2}\right) = \frac{m}{h^2}(1+S)$$
Now we investigate $S$:
$$S = \frac{3mu^2}{m/h^2} = 3u^2h^2 = 3\left(\frac{1}{r^2}\right)\left(r^2\frac{d\phi}{ds}\right)^2 = 3r^2\left(\frac{dt}{ds}\frac{d\phi}{dt}\right)^2 = 3r^2\left(\frac{d\phi}{dt}\right)^2\left(\frac{1}{c^2}\right) = 3\frac{(r d\phi/dt)^2}{c^2}$$
If we consider $(r d\phi/dt)$ as the tangential velocity of the circular orbit, $V$, then $S = 3(V/c)^2$.

Therefore, in Euclidean geometry, the \textbf{force equation for gravity in Schwarzschild spacetime} can be expressed as:
$$F = -\frac{GMm}{r^2}(1+S) = -\frac{GMm}{r^2}\left(1 + 3\left(\frac{V}{c}\right)^2\right)$$

\end{document}








