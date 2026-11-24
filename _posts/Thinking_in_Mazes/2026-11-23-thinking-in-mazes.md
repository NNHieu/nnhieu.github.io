---
layout: post
title: Looped CNN - Thinking in Mazes
date: 2026-11-23
description: Visualizing how a recurrent CNN solves mazes through iterative exploration and pruning.
series: "Systematic generalization"
authors:
  - name: Hieu N. Nguyen
tags:
  - reasoning
  - neural-networks
categories: blog
hidden: false
---

## Introduction

<!-- When a human solves a small maze, they do not simply recite its twists and turns from memory; they use spatial search strategies. Faced with a novel or larger maze, they can apply the same techniques by spending more time. In traditional computer science, algorithms encode processes that scale to harder problem instances at the cost of more computation. -->

{% include figure.liquid path="assets/posts/thinking_in_mazes/normal.gif" class="img-fluid" avoid_scaling=true alt="Animated comparison of a maze, its labeled solution, the masked prediction, and the raw prediction over recurrent iterations." caption="From left to right: the input maze, the ground-truth path, the prediction after a point-wise product with the input mask, and the raw prediction. Green and red mark the start and finish." %}

Standard feed-forward neural networks lack the ability to scale their computation based on the "difficulty" of the problem.
Their computation budget is limited by their predefined architecture.
A feed-forward network trained on a simple $9\times9$ maze has no built-in mechanism to "think longer" when faced with a harder $13\times13$ maze.

The paper [_Can You Learn an Algorithm? Generalizing from Easy to Hard Problems with Recurrent Networks_](https://arxiv.org/abs/2106.04537) shows that looping intermediate convolutional layers, trained on simple problems at a limited effective depth, can solve more complex problems by performing additional recurrences during inference.
They generalize by extending their iteration budget, without adding parameters.

But what exactly is the network doing during those extra iterations?
Has it learned a classical pathfinding algorithm such as breadth-first search, or a different mechanism based on local convolutional updates?

Here, I visualize the output of a weight-tied CNN at each iteration. The behavior suggests **morphological pruning**: the network explores paths while collapsing dead ends through local updates.
From this insight, we can identify their failure cases. For example, I'll examine circular and disconnected mazes below. And also why input injection is important in these models.

 <!-- and what happens without input injection. -->

We can also think of these models as a dynamical system where the hidden state evolves following the "field" defined by looped layers. From this perspective, I test an Anderson solver, which is a classical method for finding fixed-point of dynamical systems.


## The maze environment

The model receives an image of a maze, with black walls and green and red markers for the start and goal. Its task is to mark the shortest path connecting them.

A solution counts as correct only when the entire predicted path matches the labeled solution.

The setup uses $9\times9$ mazes for training and $33\times33$ mazes for testing. Can the model solve these larger mazes simply by running for more iterations?

## Weight-tied CNNs

In a feed-forward ResNet, successive residual blocks have separate parameters. A weight-tied CNN instead applies the same recurrent module repeatedly, updating a hidden representation of the maze. Each iteration reuses the same weights.

The main model visualized in this post also uses **input injection (recall)**: the recurrent module receives the original maze at every iteration, alongside its current hidden state. Its update is $h_{t+1}=F_\theta(h_t,x)$, keeping the maze available throughout the process. 

At test time, we can give a harder maze more iterations without adding parameters or rebuilding the network. This is how the model can "think longer" than it did during training.

## What is the model doing?

### Exploring paths and pruning dead ends

{% include figure.liquid path="assets/posts/thinking_in_mazes/normal.gif" class="img-fluid" avoid_scaling=true alt="Animated comparison of a maze, its labeled solution, the masked prediction, and the raw prediction over recurrent iterations." caption="From left to right: the input maze, the ground-truth path, the prediction after a point-wise product with the input mask, and the raw prediction. Green and red mark the start and finish." %}

The predictions extend into branches, then retract or disappear around forks and endpoints. This resembles a conditional morphological erosion operation. In one forward pass, the tip of a dead-end branch is pruned. In the next pass, the pixel behind it becomes the new tip. Iteration by iteration, the dead branch collapses backward until it reaches a junction.

This suggests a process that could extend to larger inputs given enough iterations: the local rules of expansion and erosion do not depend on the overall maze size. The visual resemblance is an interpretation of the network's behavior, rather than proof that it implements a particular classical algorithm.

### Circular mazes

The next example probes where this behavior fails by introducing circular paths.

{% include figure.liquid path="assets/posts/thinking_in_mazes/circularmazes.gif" class="img-fluid" avoid_scaling=true alt="Animated recurrent predictions on a maze containing circular paths." caption="A circular-maze example for examining the limits of the learned update rule." %}

### Disconnected paths

A disconnected maze provides another case for inspecting how the updates behave when a connecting path is absent.

{% include figure.liquid path="assets/posts/thinking_in_mazes/notconnected.gif" class="img-fluid" avoid_scaling=true alt="Animated recurrent predictions on a disconnected maze." caption="The model's behavior on a disconnected maze." %}

## Without input injection

Removing input injection leaves the update $h_{t+1}=F_\theta(h_t)$, so the module must carry the maze information through its hidden state. These examples show behavior without input injection on two maze sizes, matching the form implemented by the public `RecurModel`.

### A small maze

{% include figure.liquid path="assets/posts/thinking_in_mazes/normal_9x9.gif" class="img-fluid" avoid_scaling=true alt="Animated predictions without input injection on a 9 by 9 maze." caption="A $9\times9$ maze without input injection." %}

### A larger maze

{% include figure.liquid path="assets/posts/thinking_in_mazes/normal_33x33.gif" class="img-fluid" avoid_scaling=true alt="Animated predictions without input injection on a 33 by 33 maze." caption="A $33\times33$ maze without input injection." %}

## Using an Anderson solver

For a fixed maze $x$, repeatedly applying $F_\theta(\cdot,x)$ is a fixed-point iteration. An Anderson solver instead combines information from several previous iterates to seek a state satisfying $h^*=F_\theta(h^*,x)$. Does this change the route to a solution? Here is the corresponding visualization using an Anderson solver.

{% include figure.liquid path="assets/posts/thinking_in_mazes/anderson_solver.gif" class="img-fluid" avoid_scaling=true alt="Animated maze predictions produced while using an Anderson solver." caption="Maze-solving behavior with an Anderson solver." %}


The code is in my [Thinking Mazes JAX repository](https://github.com/NNHieu/Thinking_Mazes_Jax). 
<!-- The implementation details below refer to the JAX and Equinox model in [`models.py`](https://github.com/NNHieu/Thinking_Mazes_Jax/blob/db2395da589dec97a5a5392a6f3ad5e2b3cb1e4f/models.py), used by [`INote.ipynb`](https://github.com/NNHieu/Thinking_Mazes_Jax/blob/db2395da589dec97a5a5392a6f3ad5e2b3cb1e4f/INote.ipynb). -->