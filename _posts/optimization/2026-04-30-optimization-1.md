---
layout: distill
title: Convergence to critical point
date: 2022-04-2 22:40:16
description: 
authors:
  - name: Hieu N. Nguyen
    affiliations: 
      name: FPT AI Center

tags: math
categories: math
series: "Optimization in Deep Learning: From convexity to invexity"
---

In general, it is hard to analyze gradient descent dynamics, since a lot of different things can happen. 
General cost functions can have saddle points and local optima. 
Even for convex objectives, gradient descent is a discrete time system, and so could have pretty complex behavior. In order to prove convergence, we’ll need to make some assumptions.
Throughout this blog, we assume the map $F$ is Lipschitz continuous and smooth. 
(We can forgo the smoothness assumption by using subgradients instead of gradients.)


<div class="definition-box">
<strong>Definition (L-Lipschitz Continuity).</strong><br><br>

A function $f: \mathbb{R}^m \to \mathbb{R}^n$ is called $L_f$-Lipschitz continuous if for all $u, v \in \mathbb{R}^m$,
$$
\|f(u) - f(v)\| \le L_f \|u - v\|.
$$
</div>

A direct consequence of the $L_f$ -Lipschitz condition is that $\|D f(w)\|_2 \le L_f$ for all $w \in \mathbb{R}^m$.
This can be seen by re-arrange the equation gives $\frac{\|f(u) - f(v)\|}{\|u - v\|} \le L_f$, which is approximately the "magnitude" of the Jacobian when $u, v$ are close.
In other words, a function is Lipschitz means it does not have sharp changes everywhere.

The gradient of a function measures how the function changes when we move in a particular direction from a point. 
(S)GD can decrease the function's value by moving the direction opposite of first-order gradient of the objective function.
But how do we know that this gradient information is informative? 
If the gradient were to change arbitrarily quickly, the old gradient does not give us much information at all even if we take a small step. 
The next assumption, smoothness, assures us that the gradient cannot change too quickly.
Therefor we have an assurance that the gradient information is informative within a region around where it is taken. 


<div class="definition-box">
<strong>Definition ($L$-smooth function):</strong> <br><br>
A function $f$ is called <b>$L$-smooth</b> (or has an $L$-Lipschitz gradient) if $f$ is differentiable and the following equivalent conditions hold:
<ul>
    <li>
        The gradient $\nabla f$ is $L$-Lipschitz continuous:
        <br>
        For all $x, y$,
        $$
        \|\nabla f(x) - \nabla f(y)\| \le L\|x - y\|
        $$
    </li>
    <li>
        $f$ is bounded by a quadratic function (with $L > 0$):
        $$
        |f(\mathbf{y}) - f(\mathbf{x}) - \langle \nabla f(\mathbf{x}), \mathbf{y} - \mathbf{x} \rangle| \le \frac{L}{2}\|\mathbf{y} - \mathbf{x}\|_{2}^{2}
        $$
    </li>
    <li>
        The gradient $\nabla f$ satisfies (with $L > 0$):
        $$
        \langle x - y, \nabla f(x) - \nabla f(y) \rangle \le \frac{1}{L} \|\nabla f(x) - \nabla f(y)\|^2
        $$
    </li>
    <li>
        If $f$ is twice differentiable, then $\nabla^2 f(x) \preceq L\mathbf{I}$ (i.e., all eigenvalues of the Hessian are at most $L$).
    </li>
</ul>
</div>

<!-- convert to markdown without changing the content -->

From definition 2 of the L-smooth function, there are two things to remember about smoothness:

1. A function $f$ is L-smooth if for any two points $x, y \in \text{dom} f$,
   $$
   f(y) \leq f(x) + \langle \nabla f(x), y - x \rangle + \frac{L}{2} \| y - x\|^2.
   $$
   For interpretation, $f$ is globally bounded above by a quadratic function. In other words, it provides an upper bound for the change of the function by means of a quadratic ($f$ cannot be "too sharp").

2. If $x^*$ is an optimal solution, then $\nabla f = 0$, so that smoothness provides an upper bound on the suboptimality of the function value and the distance to optimality:
   $$
   f(x) - f(x^*) \le \frac{L}{2}\|x - x^*\|.
   $$

We can now analyse the convergence on L-smooth functions. 
Let us consider the smoothness inequality at two iterates $w_t$ and $w_{t + 1}$ in the scheme from gradient descent.

$$
\begin{align*}
    \mathcal{L}(w_t) - \mathcal{L}(w_{t + 1}) &\ge \eta \left< \nabla \mathcal{L}(w_t), \nabla \mathcal{L}(w_t) \right> - \eta^2 \frac{L}{2} \|\nabla \mathcal{L}(w_t)\|^2 \\
    &= (\eta - \eta^2 \frac{L}{2}) \|\nabla \mathcal{L}(w_t)\|^2
\end{align*}
$$

Since the right-hand side is concave in $\eta$ We can maximize it w.r.t $\eta$ and obtain the optimal choice $\eta^* = \frac{1}{L}$. This lead to the most important thing is that smoothness induces progress in schemes such as decent step. We call this descent property.

<div class="definition-box">
<strong>Proposition 1.</strong><br><br>
Gradient Descent method satisfies the "descent" property for a step-size $\eta \le \frac{1}{L}$ when $g$ is an $L$-smooth function:
$$
\forall t \ge 0, \forall \eta \le \frac{1}{L}: \underbrace{\mathcal{L}(w_{t}) - \mathcal{L}(w_{t+1})}_{\text{primal progress}} \geq \frac{\eta}{2} \|\nabla \mathcal{L}(\theta_t)\|_2^2
$$
</div>


We can use this descent property to analysis convergence rate of gradient descent to $\epsilon$-critical point.

> **Theorem: Convergence under smoothness**  
> Gradient descent on $L$-smooth functions, with a fixed step-size of $\frac{1}{L}$, achieves an $\epsilon$-critical point in $\frac{2 L\left(f\left(x_{0}\right)-f_{*}\right)}{\epsilon^{2}}$ iterations.

The above theorem guarantee we were able to find an $\epsilon$-critical point using gradient descent while only assuming L-smoothness. 
This ends up not being very informative because.
Let look at second-order Taylor expansion of \eqref{eq:main}:

$$
\begin{equation}
\label{eq:main}
    \mathcal{L}(w) = \frac{1}{N}\sum_{i = 1}^{N} L(F(w; x_i), t_i)
\end{equation}
$$

, assume $\mathcal{L}(w)$ is second differentiable
$$
\begin{equation}
    \mathcal{L}(w) = \mathcal{L}(w_0) + \nabla \mathcal{L}(w_0)^\top(w - w_0) + \frac{1}{2}(w - w_0)^\top\nabla^2L(\theta_0)(w - w_0)
\end{equation}
$$

When the gradients equal zero, i.e at a critical point, the type of this point depends on higher order gradient which in this case is the Hessian. We temporily ignore the case of zero eigenvalue (which is also interesting).
If $\nabla^2L(\theta_0)$ have some negative eigenvalue and some possitive then we are at a saddle point and we can further decrease the loss by follow their eigenvector. 
There are studies suggest that SGD can escape saddle points. If $\nabla^2L(\theta_0)$ is negative definite then we have a local maxima which are certainly not the case. 
Often, we have a local minima where $\nabla^2L(\theta_0)$ is positive definite.
So our objective is find settings that guarantee local minima have good properties such as all local minima are global or all strict local minima are global.

<!-- % However, this cannot be the case for convex functions. 
% Remember in the previous lecture we mentioned that guarantees that we are close to a global optimum are hard to come by? 
% This is one of those cases, so we need to settled for an -critical point instead. -->

And further, we require the convergence rate is fast enough.
For the guarantees, because gradient descent can only access local information we might need local property that ensures global optimality. 
Since it is well-known that convexity implies local minima are global, we first look at the convex case to get a sense of how the convergence rate can be achieve.
