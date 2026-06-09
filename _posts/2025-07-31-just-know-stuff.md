---
layout: post
title: Just know stuffs
date: 2025-07-30 16:40:16
description: This is just a place for my personal use to keep track of what I have learnt. So that I can free up my mental space.
tags: research
categories: thoughts
---

This is just a place for my personal use to keep track of what I have learnt. So that I can free up my mental space.

> Even fairly good students, when they have obtained the solution of the problem and written down neatly the argument, shut their books and look for something else. Doing so, they miss an important and instructive phase of the work. ... A good teacher should understand and impress on his students the view that no problem whatever is completely exhausted. One of the first and foremost duties of the teacher is not to give his students the impression that mathematical problems have little connection with each other, and no connection at all with anything else. We have a natural opportunity to investigate the connections of a problem when looking back at its solution. ([George Pólya](https://en.wikipedia.org/wiki/George_P%C3%B3lya), [“How to Solve It“](https://en.wikipedia.org/wiki/How_to_Solve_It))

> Every composer knows the anguish and despair occasioned by forgetting ideas which one had no time to write down. ([Hector Berlioz](https://en.wikipedia.org/wiki/Hector_Berlioz))

I might also make my work available here.

> We must get beyond textbooks, go out into the bypaths ... and tell the world the glories of our journey. ([John Hope Franklin](https://en.wikipedia.org/wiki/John_Hope_Franklin))

<!-- > What is worth knowing? What is worth learning? -->

## Reading

- [Creative Thinking - Claude Shannon](http://www1.ece.neu.edu/~naderi/Claude%20Shannon.html) \| [Video](https://www.youtube.com/watch?v=neA0NJNUEfM) 
  
## Model Architectures

- Score-based diffusion models. ([Yang Song's blog post](https://yang-song.net/blog/2021/score/), [my gh repo](https://github.com/NNHieu/OODGen_score_flow))
- How residual networks are discretised ordinary differential equations. ([NeuralODE](https://implicit-layers-tutorial.org/))
- U-Nets. [Build a toy implementation](https://github.com/NNHieu/INT3405_TGSSalt).
- Transformers
  - Rotary Embeddings ([EleutherAI's blog post](https://blog.eleuther.ai/rotary-embeddings/?fbclid=IwY2xjawHPi2hleHRuA2FlbQIxMQABHQSL_ydF9TfFw8DmRc-1UkyElaq84q7WQIYkJYDVhMLbhkdH219uc1fz8Q_aem_oDD33a-KzrFW7e5bt0uIrw))

## Interpretability

- [MechInterp Preview](https://leonardbereska.github.io/blog/2024/mechinterpreview/)
- [Engineering Challenges in Interpretability](https://www.anthropic.com/research/engineering-challenges-interpretability)
- Tools and methods: [Activation Patching](), [nnsight](https://nnsight.net/)
- *An Adversarial Perspective on “Overinterpretation Reveals Image Classification Model Pathologies”*

## ML Engineering

- How to do hyperparameter optimisation via Bayesian optimisation. ([Optuna Sweeper](https://hydra.cc/docs/plugins/optuna_sweeper/))
- Forward- and reverse-mode autodifferentiation: I started looking into this when I learned Jax. There are great tutorial on this.
- Zero-order and first-order optimisation techniques ([Stanford's slide](https://web.stanford.edu/class/msande311/lecture09.pdf)). Why do we use first-order ptimisation techniques, rather than anything else (such as Gauss-Newton, Newton-Raphson, Levenberg-Marquardt)?
- ML Frameworks: `jax.vmap`

## Theoretical ML topics

- The manifold hypothesis and its implications in machine learning ([Wiki](https://en.wikipedia.org/wiki/Manifold_hypothesis), [reddit discussion](https://www.reddit.com/r/MachineLearning/comments/mzjshl/d_who_first_advanced_the_manifold_hypothesis_to/), [Chris Olah's blog post](https://colah.github.io/posts/2014-03-NN-Manifolds-Topology/)).
- Neural Tangent kernel

## Elementary

- The [Moore–Penrose pseudoinverse](https://en.m.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse) of a matrix.

## Software development

- How to pass muster as a junior developer
  - Git commands. Don't just delete it and clone from the remote when you mess up your your git repo. (https://xkcd.com/1597/)
  - Writing clean code, orthogonal abstractions. When things're messy, be willing to refactor them. Avoid spaghetti code and ravioli code.
- Introduction to writing CUDA kernels and intergation with Pytorch. [my github repo](https://github.com/NNHieu/Fast-Attention-Cuda)
- Jax (some of my repo: [Thinking in mazes](https://github.com/NNHieu/Thinking_Mazes_Jax), [gpt2-jax])
- [Hydra](https://hydra.cc/docs/intro/)

## My thought on research - v0.5

So I started writing this because I feel a growing uncertainty about how we, as AI/ML researchers, should do research in a world where AI is rapidly improving and beginning to automate AI research and develop its own successor.

This question isn’t entirely new to me. Back in 2021, during a conversation with my former advisor about neural architecture search, we wondered: If AI becomes so good that it can iteratively improve itself to solve specific tasks, what should ML researchers do then?
At the time, my answer—from an undergraduate who hadn't done any research—was that we could try to understand these systems. If machines exhibit intelligence, then studying them might help us understand our own. That belief is what drew me toward machine learning theory.

But there was an implicit assumption in that answer: that “doing research” would remain the last frontier—something machines couldn’t fully take over. I’m no longer sure that’s true.

Today, the question feels more urgent—but my answer hasn’t fundamentally changed.
What has changed is the research process.
We’re already seeing systems that automate large parts of the research workflow: generating ideas, running experiments, iterating on code, and drafting papers. In this emerging paradigm, researchers propose directions—and AI executes.

This shift brings undeniable gains in productivity, but it also creates a real tension—especially for students. If you don’t adopt these tools, you risk falling behind in speed and output. If you do, you risk outsourcing the very skills that shape your development as a researcher.

So what should we do? I think the answer depends on what you believe the goal of your research is. For me, it remains the same: to understand, to explain, and to create knowledge—not just to produce results. In that sense, the philosophy of research doesn’t change, even if the workflow does.

Take writing as an example. AI can already help generate drafts, refine language, and even generate a research paper. But writing isn’t just about producing text—it’s a way of thinking. It forces clarity, exposes gaps in understanding, and shapes the ideas themselves. If we fully delegate that process, we risk losing these "by-products".
The same applies more broadly. If we reduce research to proposing ideas and validating them through automated pipelines, we might become efficient—but also shallow.

This reminds me of what happened when AlphaGo defeated the strongest human Go players. For many top players, it triggered a kind of existential crisis: What is the meaning of playing Go now?
But maybe that question was always there.
Before AlphaGo, playing Go was about mastery, creativity, and understanding the game deeply. After AlphaGo, those values didn’t disappear—they just shifted. Players began to learn from AI, explore new styles, and engage with the game differently. And importantly, people still play.

<!-- So the question for researchers might not be whether AI replaces us, but what we choose to value in research.
If AI can generate ideas, run experiments, and write papers, then what remains uniquely ours?
Perhaps it’s taste. Judgment. The ability to ask meaningful questions. The curiosity to explore directions that aren’t immediately rewarded by benchmarks.
In other words, the things that were always at the core of research—but are now harder to ignore. -->