---
layout: post
title: Reasoning in autoregressive languge models
date: 2024-12-15 16:40:16
description: 
tags: 'auto-regressive models'
categories: research
draft: true
---

>Somehow the model learns to perform many many tasks only trained with next-token prediction. (Hyung Won Chung - OpenAI)

{/* 
We don't know about the data used to train GPT-3/4/4o. 
However, "most data used to train language models (LMs) only reflects the outcome of a decision-making process, not the process itself."
Because of exposure bias, the LMs trained on these correct rationales might fail to learn how to generate these rationales in the first place . */}

### The power of Large Language Model.
Bender proposed the "stochastic parrot" metaphor for large language models (LLMs). In their word, 
 >an LM is a system for haphazardly stitching together sequences of linguistic forms it has observed in its vast training data, according to probabilistic information about how they combine, but without any reference to meaning: a stochastic parrot.

This metaphor is literally true, in the sense that LLMs are trained to minimize the cross-entropy loss.
However, this loss function does not capture all of their capabilities. 
For example, according to the GPT-3 paper, their 175B model is just a mildly better "parrot" than their 13B model (1.73 compared to 1.97, or roughly, guessing the next token with probability 17.7% instead of 14%). However, the 175B model is qualitatively superior to the 13B model in many tasks, achieving near-perfect performance whereas the 13B one barely beats random guessing.
As in a recent talk from Hyung Won Chung from OpenAI, 
 >somehow the model learns to perform many many tasks only trained with next-token prediction.

 Also in this talk, a hypothesis named massive multitask learning hypothesis is stated,

 >beyond some scale, the easiest way to do well on the next token prediction is for the model to find a set of general skills that are applicable to many tasks. For example, these skills include learning languages, understanding and reasoning.

### The reasoning process.
> Many tasks that we find hard to do immediately - solving math problems, planning vacations, writing research papers - become much easier when we talk ourselves through a reflective reasoning process... Reasoning does not give us any new data from the world, yet it can still improve our inferences.
{/* \citep{prystawski2023why} */}

The reasoning process in (autoregressive) LLMs happens when the model outputs intermediate steps, before giving an answer.
Previous research has shown that this process leads to better performance than prompting LLMs to produce an answer directly.

### The first step on a chain
Given a problem to LLMs, there are two modes of extracting the answer: (1) directly producing the output (i.e. one forward pass) or (2) letting the model output intermediate tokens before getting the answer (i.e. multiple forward passes). 
We call the first mode "internal thought" and the second mode is leveraged in scratchpad or chain of thought techniques. 



#### Accessing elements from an array of numbers
This case study investigates the LMs' ability to perform a simple operation: random-array-access.
In this task, we give the model an array of one-digit numbers and query it to output the value at a given index. 
We chose this task because it is a fundamental operator in many algorithms (e.g. addition).
Each problem instant can vary regarding array length and the queried index.
To accomplish this task with arbitrary length, one hypothesis is that LMs should be able to perform a set of rules or steps regardless of the input. For example, the model should count and associate each element with their correct indices.
We also consider another task where each value in an array is explicitly indexed by a single character.
This is similar to the dictionary format.
In this experiment, we prompt LMs to output their answers directly.

Pre-trained LMs are evaluated under the zero-shot and few-shot prompting settings. 
We first sample a set of demonstrations to create prompts.
The array length in each demonstration is randomly sampled from 3 to 5.
The number of demonstrations in each prompt ranges from 0 (zero-shot prompting) to 5 (5-shot prompting).
We generate the set of queries by varying the array length from 3 to 10. 
{/* An example of the final prompt is given in Figure \ref{fig:example_index_op}. */}
% For each query array length value, we randomly sample 10 sets of demonstrations. For each query array length value and demonstration set, we randomly sample 100 queries. 
This process produces a test dataset of 48000 samples.

### Aligning chains

### A chain where LLM can search