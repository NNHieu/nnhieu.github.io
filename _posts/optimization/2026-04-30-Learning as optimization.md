---
layout: distill
title: Learning as optimization
date: 2022-04-2 23:40:16
description: 
authors:
  - name: Hieu N. Nguyen
    affiliations: 
      name: FPT AI Center

tags: math
categories: math
series: "Optimization in Deep Learning: From convexity to invexity"
---

At an abstract level, learning is optimization over data. 
In other words, the network learns the input-output relationship in the data through optimization.

For example, in supervised learning, the parameters of a neural network are optimized so that given an input in the data, the network outputs a corresponding (or approximate) target in the data. Assume the inputs $x$ and labels $t$ are jointly drawn from the data generating distribution, i.e.

$$
(x, t) \sim p_{\text{data}}
$$

We are given a training set of size $N$, $\\{x^{(i)}, t^{(i)}\\}_{i = 1}^N$, and the predictions are made using a family of models $y = F(w, x)$ (e.g., a neural network architecture) parameterized by $w$.

One aims to "learn" $w$ that fits the training data, i.e.,

$$
F(w; x_i) \approx t_i, \quad i = 1, 2, \dots, n.
$$

We determine how well we fit the data using a loss function $L(y, t)$.

Mathematically, learning is equivalent to finding a model with parameter $w^*$ that achieves small risk, or generalization loss:

$$
\mathcal{R}(w) = \mathbb{E}_{(x, t) \sim p_{\text{data}}}\left[L(F(w, x), t) \right]
$$

We do this by minimizing a cost function corresponding to the empirical risk over the training set:

$$
\mathcal{L}(w) = \frac{1}{N}\sum_{i = 1}^{N} L(F(w; x_i), t_i)
$$

We can write this as a basic unconstrained optimization problem:

$$
\arg\min_{w \in \mathbb{R}^p} \mathcal{L}(w)
$$

A common optimization algorithm to solve this problem is gradient descent (GD). The general idea of gradient descent is based on initializing $w$ at random and performing sequential updates:

$$
w_{k + 1} \leftarrow w_{k} - \eta \nabla \mathcal{L}(w_k)
$$

where the convergence depends on $\eta$ and the structural properties of $\mathcal{L}$ itself.

GD is a batch method, which means it uses the full training set to compute the next update to parameters at each iteration. It is straightforward to get GD working and it also tends to converge very well to local minima. However, often in practice computing the loss and gradient for the entire training set can be very slow and sometimes intractable on a single machine if the dataset is too large to fit in main memory.

Stochastic Gradient Descent (SGD) can overcome the cost of GD and still lead to fast convergence. It addresses the issue by following the negative gradient of the objective after seeing only a single or a few training examples:

$$
w_{k + 1} \leftarrow w_{k} - \eta \nabla_w L(F(w_k, x^{(i)}), t^{(i)})
$$

with a pair $(x^{(i)}, t^{(i)})$ from the training set.

Generally each parameter update in SGD is computed with respect to a few training examples or a minibatch as opposed to a single example. The reason for this is twofold: first, this reduces the variance in the parameter update and can lead to a more stable convergence; second, this allows computations that benefit from well-vectorized evaluation of the cost and gradient.

One important point regarding SGD is the order in which we present the data to the algorithm. If the data is given in some meaningful order, this can bias the gradient and lead to poor convergence. Generally a good method to avoid this is to randomly shuffle the data prior to each epoch of training.

<!-- ## Pessimistic insights -->
> *"Optimization in general is an extremely difficult task. […] When training neural networks, we must confront the general non-convex case."*  
> — Goodfellow, Bengio, and Courville (2016)

<!-- - The **non-convexity** (and non-invexity) as well as the **high-dimensionality** of the objective functions used to optimize neural networks.
- **Gradient descent (GD)** and **stochastic gradient descent (SGD)** can get stuck in local minima. -->

By examining the gradient descent update rule, we see that the fixed points for gradient descent are precisely the critical points of $\mathcal{L}$, i.e., those points where $\nabla_w \mathcal{L} = 0$. For general differentiable functions, critical points can be local minima, local maxima, or saddle points.

![Illustration of local minima, maxima, and saddle points.](images/minmaxsaddle.png)

It is well-known that the empirical risk of a neural network is a **nonconvex function** with many distinct local minima ([Auer1995], [Hamed2016], [Yun2018]), and that solving a general nonconvex optimization problem to global optimality is NP-hard.
Because of the non-convexity and high-dimensionality, it is often unclear whether training a deep neural network will guarantee the desired properties after optimization, or whether the network might become stuck in an arbitrarily poor local minimum or saddle point.
Yet, in practice, we can train many complex models (e.g., ResNet50, VGG) with naive algorithms like SGD and still achieve low training loss. Somehow, the SGD algorithm, despite following only gradient or sub-gradient information, "never" gets trapped in a bad local minimum.
Understanding this seemingly contradictory phenomenon is one of the fundamental open problems in deep learning.


<p align="center"><b>Why is stochastic gradient descent so successful?</b></p>

In this work, we will analyze the dynamics of gradient descent. First, we will see why gradient descent or local search methods are able to find the global optimum in the convex setting. We break this into two steps: (1) showing that gradient-based algorithms find first-order stationary points (assuming smoothness), and (2) establishing that all first-order stationary points are global minimizers. 
Then we will go beyond convexity, and discuss how SGD can escape saddle points.
