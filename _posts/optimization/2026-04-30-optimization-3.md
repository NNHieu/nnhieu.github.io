---
layout: distill
title: Beyond convexity
date: 2022-04-2 20:40:16
description: 
authors:
  - name: Hieu N. Nguyen
    affiliations: 
      name: "FPT AI Center | VNU-UET"

tags: math
categories: math
series: "Optimization in Deep Learning: From convexity to invexity"
---

<!-- It is true that a non-convex problem in general has many spurious local minima, but it is also true that in practice, researchers sometimes don’t observe such bad local minima.  -->

We have seen convex is good and it is easier for GD/other methods to optimize a convex objective function.
In contrast, we often think non-convex is bad and it might have many local minima and no general global optimization techniques.
But there are objective functions that are nice even though they are non-convex.
The key property of convexity is that they guarantee critical points are good.  
Next, we will introduce some conditions that basically say the same thing: when the gradient vanishes some good thing happen.

### Quasi-Convex

$$
\begin{equation}
    - \nabla \mathcal{L}(w)^\top (w - w ^*) \ge d(w, w^*),
\end{equation}
$$
where $d$ is some distance measure to optimality.

$$
\begin{itemize}
    \item $d(w, w^*) = \mathcal{L}(w) - \mathcal{L}(w^*)$, Quasi convex
    \item $d(w, w^*) = \alpha \|w - w^*\| + \beta \|\nabla \mathcal{L}(w)\|^2$, regularity condition or correlation condition.
\end{itemize}
$$

These distance function satisfies that unless we are at a global optimum then this distance is always grater than $0$. 
<!-- so if we take a step to opposite direction to gradient, we get closer to $w^*$. -->
The second distance function is more powerful since it is lower bound by the norm of gradient, which mean the objective function is strongly convex in the direction of $w$ to $w^*$. 

### One point convexity

$$
\begin{equation}
    \nabla -\mathcal{L}(w)^\top (w - w ^*) \ge 0,
\end{equation}
$$


### Linear Convergence of Gradient under the Polyak-Lojasiewicz Condition

One of the alternative for convexity is Polyak-Lojasiewicz Inequality.
We will say that a function satisfies the PL inequality if the following holds for some $\mu > 0$,

$$
\begin{equation}
\label{ineq:PL}
    \frac{1}{2}\|\nabla f(x)\|^{2} \geq \mu\left(f(x)-f^{*}\right), \quad \forall x .
\end{equation}
$$


One way to interpreted is it requires that the gradient grows faster than a quadratic function as we move away from the optimal function value. 
Note that this inequality is similar to lemma \ref{lem:stronglyconv_bound} in strongly convex, so it also implies every stationary point is a global minimum. 
But unlike SC, it does not imply that there is a unique solution so it is a weaker condition. 
It is also straight forward to prove linear convergence for GD using PL condition.
We can simply replace lemma \ref{lem:stronglyconv_bound} by \ref{ineq:PL}.

\begin{theorem}[Linear Convergence under Polyak-Lojasiewicz condition]
Suppose $f$ has an $L$-Lipschitz continuous gradient, a non-empty solution set $\mathcal{X}^*$, and satisfies the Polyak-Lojasiewicz (PL) inequality with constant $\mu > 0$. Then the gradient descent method with step size $1/L$:
$$
x_{k+1} = x_k - \frac{1}{L} \nabla f(x_k)
$$
satisfies the global linear convergence rate:
$$
f(x_k) - f^* \leq \left(1 - \frac{\mu}{L}\right)^k \left(f(x_0) - f^*\right).
$$
\end{theorem}

### Invexity

A function is invex if it is differentiable and there exists a vector valued function $\eta$ such that for any $x$
and $y$ in $\mathcal{R}^n$, the following inequality holds
\begin{equation}
    f(y) \geq f(x)+\nabla f(x)^{T} \eta(x, y)
\end{equation}
\citet{craven1985} show that a smooth $f$ is invex if and only if every stationary point of $f$ is a global minimum. Thus all of previous condition implies invexity.