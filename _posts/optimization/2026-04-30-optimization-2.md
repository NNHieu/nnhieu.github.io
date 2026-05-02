---
layout: distill
title: Convergence of GD under Convexity
date: 2022-04-2 21:40:16
description: 
authors:
  - name: Hieu N. Nguyen
    affiliations: 
      name: "FPT AI Center | VNU-UET"

tags: math
categories: math
series: "Optimization in Deep Learning: From convexity to invexity"
---

Previously, we were able to find an $\epsilon$-critical point using gradient descent only assuming $L$-smoothness. 
This ends up not being very informative because when a function is non-convex, its gradients can equal zero at a saddle point or a maximum—these points are certainly not optimal. However, this cannot be the case for convex functions. 
Convexity will allow us to translate gradient information into distance from the optimum and suboptimality of the function value. 
In particular, if we define 
$$
\mathcal{X}^* (f) := \{x|f(x) = f^{*}\}
$$
to be the set of minimizers of $f$, then $$x^{*} \in \mathcal{X}^{*}(f)$$ if and only if $$\nabla f(x^{*}) = 0$$.
In this section, we only consider fixed step-size.

## Strong convexity

First we consider strongly convex property, it's well-known that if $f$ is strongly convex then gradient descent achieve global linear convergence rate.

The main key is the following lemma:

**Lemma:**  
For a $\mu$-strongly convex function $f$:
$$
\forall w\quad \frac{1}{2\mu} \| \nabla f(w)\|_2^2 \ge (f(w) - f^*) \ge \frac{\mu}{2} \|w - w^*\|
$$
where $f^* = \min_w f(w)$.

So with strongly convexity, we can upper bound the suboptimality of the function value, which is a global property, by the norm of gradient, which is a local property. We can easily see that this implies local minima are global.
Also, this lemma directly leads to following theorem.

**Theorem:**  
For an $L$-smooth and $\mu$-strongly convex function $f$, gradient descent satisfies the following upper bound:
$$
f(\theta_t) - f^* \le \left(1 - \frac{\mu}{L}\right)^t \big(f(\theta_0) - f^*\big)
$$

With some modification, we have the convergence rate
$$
t \ge \frac{L}{\mu} \log(\frac{g(\theta_0) - g^*}{\epsilon})
$$
This rate is called linear convergence since because it looks linear on a semi-log plot.

TODO: Uniqueness of solution

## Only Convexity

However, many of the fundamental models in machine learning like least squares and logistic regression yield objective functions that are convex but not strongly-convex. 
In that case, gradient descent only achieves a sub-linear rate.


**Lemma:**  
For a convex function $f$, and denoting $f^* = \min_{w} f(w)$,
$$
\forall w, \quad -\nabla f(w)^\top (w - w^*) \geq f(w) - f^*
$$

This bound is similar to \ref{lem:stronglyconv_bound} but weaker. It implies that the direction to global minima always positive align with opposite of gradient direction. But we don't know how far from global minima we are so the convergence rate is only from the $L$-smooth property.

**Lemma:**  
For a convex and $L$-smooth function $f$, with step-size $\eta \le \frac{1}{L}$, let $\theta_t$ be the parameters at iteration $t$ and $\theta^* \in \arg\min_{\theta} f(\theta)$ be the optimal parameters. Then,
$$
f(\theta_{t + 1}) - f(\theta^*) \le \nabla f(\theta_t)^\top (\theta_t - \theta^*) - \frac{\eta}{2}\|\nabla g(\theta_t)\|
$$

**Lemma:**  
For a convex and $L$-smooth function $f$, with step-size $\eta \le \frac{1}{L}$, parameters at time step $\theta_t$, and optimal parameters $\theta^* \in \arg\min_{\theta} f(\theta)$,
$$
f(\theta_{t + 1}) - f(\theta^*) \le \frac{1}{2\eta} \left(\|\theta_t - \theta^*\|^2 - \|\theta_{t + 1} - \theta^*\|^2\right)
$$

**Theorem:**  
For a convex and $L$-smooth function $f$, with step-size $\eta \le \frac{1}{L}$, let $\theta_0$ be the initial parameter, $\theta^*$ the optimal parameter, and $T$ the total number of iterations. Then,
$$
f(\theta_{T}) - f(\theta^*) \le \frac{\|\theta_0 - \theta^*\|^2}{2\eta (T - 1)}
$$

This convergence rate is sub-linear.