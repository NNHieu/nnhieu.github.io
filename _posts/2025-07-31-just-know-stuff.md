---
layout: post
title: Just know stuffs
date: 2025-07-30 16:40:16
description: This is just a place for my personal use to keep track of what I have learnt. So that I can free up my mental space.
tags: 
categories: thoughts
---

This is just a place for my personal use to keep track of what I have learnt. So that I can free up my mental space.

> Even fairly good students, when they have obtained the solution of the problem and written down neatly the argument, shut their books and look for something else. Doing so, they miss an important and instructive phase of the work. ... A good teacher should understand and impress on his students the view that no problem whatever is completely exhausted. One of the first and foremost duties of the teacher is not to give his students the impression that mathematical problems have little connection with each other, and no connection at all with anything else. We have a natural opportunity to investigate the connections of a problem when looking back at its solution. ([George Pólya](https://en.wikipedia.org/wiki/George_P%C3%B3lya), [“How to Solve It“](https://en.wikipedia.org/wiki/How_to_Solve_It))

> Every composer knows the anguish and despair occasioned by forgetting ideas which one had no time to write down. ([Hector Berlioz](https://en.wikipedia.org/wiki/Hector_Berlioz))

I might also make my work available here.

> We must get beyond textbooks, go out into the bypaths ... and tell the world the glories of our journey. ([John Hope Franklin](https://en.wikipedia.org/wiki/John_Hope_Franklin))

<!-- > What is worth knowing? What is worth learning? -->

## Model Architectures

* Score-based diffusion models. ([Yang Song's blog post](https://yang-song.net/blog/2021/score/), [my gh repo](https://github.com/NNHieu/OODGen_score_flow))
* How residual networks are discretised ordinary differential equations. ([NeuralODE](https://implicit-layers-tutorial.org/))
* Learn U-Nets. [Build a toy implementation](https://github.com/NNHieu/INT3405_TGSSalt). 

### Transformers
* Rotary Embeddings ([EleutherAI's blog post](https://blog.eleuther.ai/rotary-embeddings/?fbclid=IwY2xjawHPi2hleHRuA2FlbQIxMQABHQSL_ydF9TfFw8DmRc-1UkyElaq84q7WQIYkJYDVhMLbhkdH219uc1fz8Q_aem_oDD33a-KzrFW7e5bt0uIrw))


## Iterpretability
* https://leonardbereska.github.io/blog/2024/mechinterpreview/
* https://www.anthropic.com/research/engineering-challenges-interpretability
* [Activation Patching](), [nnsight](https://nnsight.net/)
* An Adversarial Perspective on “Overinterpretation Reveals Image Classification Model Pathologies”

## ML Engineering
* How to do hyperparameter optimisation via Bayesian optimisation. ([Optuna Sweeper](https://hydra.cc/docs/plugins/optuna_sweeper/))
* Forward- and reverse-mode autodifferentiation: I started looking into this when I learned Jax. There are great tutorial on this.
* Zero-order and first-order optimisation techniques ([Stanford's slide](https://web.stanford.edu/class/msande311/lecture09.pdf)). Why do we use first-order ptimisation techniques, rather than anything else (such as Gauss-Newton, Newton-Raphson, Levenberg-Marquardt)? 
* ML Frameworks: `jax.vmap`

## Theoretical ML topics
* The manifold hypothesis and its implications in machine learning ([Wiki](https://en.wikipedia.org/wiki/Manifold_hypothesis), [reddit discussion](https://www.reddit.com/r/MachineLearning/comments/mzjshl/d_who_first_advanced_the_manifold_hypothesis_to/), [Chris Olah's blog post](https://colah.github.io/posts/2014-03-NN-Manifolds-Topology/)).
* Neural Tangent kernel

## Elementary
* The [Moore–Penrose pseudoinverse](https://en.m.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse) of a matrix.

## Software development
* How to pass muster as a junior developer
    * Git commands. Don't just delete it and clone from the remote when you mess up your your git repo. (https://xkcd.com/1597/)
    * Writing clean code, orthogonal abstractions. When things're messy, be willing to refactor them. Avoid spaghetti code and ravioli code.
* Introduction to writing CUDA kernels and intergation with Pytorch. [my github repo](https://github.com/NNHieu/Fast-Attention-Cuda)
* Jax (some of my repo: [Thinking in mazes](https://github.com/NNHieu/Thinking_Mazes_Jax), [gpt2-jax])
* [Hydra](https://hydra.cc/docs/intro/)