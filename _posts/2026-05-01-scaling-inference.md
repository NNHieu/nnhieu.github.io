---
layout: post
title: "Scaling the Giants: A Guide to Efficient Parallelism in LLM Inference"
date: 2026-05-01 16:40:16
description: ""
tags: "llm-inference"
categories: code
---

**Note:** This work has been done as a project for PSU CSE530. Please find a detailed version [here](/assets/pdf/CSE_530_efficient_parallel_llm_inference.pdf).

Large Language Models (LLMs) have grown from hundreds of millions of parameters to staggering sizes. With models like GPT-3 (175B), DeepSeek V2 (236B), and LLaMA-3 (450B), we have hit a hard physical wall: a 175B parameter model requires around 350GB of memory just to store its weights in half-precision (FP16). 

This scale renders single-GPU inference impossible for state-of-the-art models. The memory capacity of even top-tier accelerators (like the 80GB NVIDIA H100) simply cannot keep up. Furthermore, the rise of "reasoning models" that generate massive amounts of tokens makes fitting the entire context into a single GPU a near-impossible task. 

The inevitable solution is **distributed inference**—partitioning the model's parameters, computation, and input context across a cluster of GPUs. But while dividing the workload makes running these massive models possible, it introduces a new, dominant performance bottleneck: **inter-accelerator communication overhead**.

Here is a breakdown of the core parallelism strategies used in LLM inference today, the communication bottlenecks they create, and the cutting-edge techniques researchers are using to solve them.

---

## The Two Phases of LLM Inference
To understand the bottlenecks, we first have to look at how decoder-only Transformers actually generate text. The process is split into two distinct phases:

1. **Prefill Phase (Input Processing):** The model processes the entire user prompt in one massive forward pass. This is highly compute-intensive and can easily saturate a GPU's compute units. Communication here involves large, but infrequent, data transfers.
2. **Decode Phase (Token Generation):** The model generates output tokens one by one, auto-regressively. Each step is a matrix-vector operation that is heavily bound by memory bandwidth, not compute. 

Because decoding is sequential, minimizing latency—specifically the **Time-Per-Output-Token (TPOT)**—is where communication overheads become the most critical.

---

## The Four Pillars of Parallelism (and Their Bottlenecks)

When serving LLMs, engineers rely on four main parallelism strategies, often combining them to fit specific hardware and model architectures. 

### 1. Tensor Parallelism (TP)
TP slices individual model layers and matrix operations across multiple GPUs. Each GPU computes a fraction of the matrix multiplication, and the results are merged.
* **The Bottleneck:** Frequent `all-reduce` synchronization points. These sync-points act as strict barriers, and their latency is dictated by the interconnect bandwidth between GPUs. In multi-GPU setups, this communication can account for up to 30% of the total end-to-end inference latency.

### 2. Pipeline Parallelism (PP)
PP partitions the model sequentially, placing contiguous blocks of layers on different GPUs (stages). Device A processes the early layers and passes the intermediate activations to Device B, and so on.
* **The Bottleneck:** Pipeline "bubbles" and activation transfers. If the stages aren't perfectly balanced, GPUs sit idle waiting for data (bubbles). Additionally, moving massive activation tensors between GPUs or nodes eats up critical bandwidth.

### 3. Context Parallelism (CP)
Crucial for applications like RAG or analyzing long documents, CP splits the input sequence itself across devices so that massive contexts don't overwhelm a single GPU's memory.
* **The Bottleneck:** Cross-device token attention. Tokens on Device A need to attend to tokens on Device B, meaning the model must constantly exchange key and value (KV) tensors across the network, leading to severe latency spikes as context lengths grow.

### 4. Expert Parallelism (EP)
Used for Sparse Mixture-of-Experts (MoE) models, EP distributes different "expert" neural networks across multiple GPUs. For each token, a routing mechanism decides which expert it should be sent to.
* **The Bottleneck:** The all-to-all token shuffle. Moving tokens back and forth between devices based on dynamic routing creates massive network congestion. Worse, "hot" experts can get overloaded while other GPUs sit completely idle, wasting compute.

---

## Cutting-Edge Techniques for Bottleneck Mitigation

Recent research has introduced several powerful techniques to bypass these communication limits, allowing clusters to serve larger models faster.

### Optimizing Tensor Parallelism
* **Sync-Point Drop (SPD):** Instead of aggressively syncing after every computation, SPD identifies "In-Sensitive Blocks" inside the LLM where synchronization can be safely dropped without hurting model accuracy. For LLaMA2-70B, dropping these sync points reduces data-transfer latency by roughly 20%.
* **Direct-Data-Access (DDA):** Developed by Meta, DDA algorithms bypass traditional communication libraries like NCCL. By allowing GPUs to directly read memory from other ranks and perform local reductions, DDA reduces the time complexity of small message transfers from $O(N)$ to $O(1)$, cutting generation latency by up to 10%.

### Smoothing Pipeline Parallelism
* **HPipe:** This framework attacks pipeline bubbles through *token-dimension pipelining*. Instead of waiting for large micro-batches, HPipe pipelines execution at the token level. It also dynamically adjusts sequence slicing—giving GPUs longer slices early on and shorter ones later—to ensure hardware utilization stays high even on heterogeneous clusters.

### Scaling Context Parallelism
* **Ring-Attention (Pass-KV / Pass-Q):** To handle extreme contexts, Meta utilizes Ring-Attention mechanisms where context-parallel ranks selectively exchange KV or Query tensors in a ring topology. Combined with heavily optimized fast-attention kernels, this allows a 32-node H100 cluster to process a staggering 10 million tokens in under a minute.

### Taming Expert Parallelism
* **Speculative MoE (s-MoE):** This technique uses a lightweight predictive model to guess where a token is going *before* it hits the routing layer, allowing the system to pre-plan the data transfer. It also pre-groups highly correlated experts onto the same device to prevent them from having to communicate across the network at all.
* **Dynamic Gating & Expert Buffering:** By dynamically adjusting expert capacity based on actual load rather than rigid static limits, and buffering "cold" (unused) experts in the CPU while keeping "hot" experts in the GPU, memory waste is drastically reduced.

---

## The Road Ahead

While TP, PP, CP, and EP provide the foundation for scaling inference, the future lies in **Hybrid Parallelism** and **Hardware-Aware Co-design**. 

Combining strategies—like layering Context Parallelism on top of a Tensor/Pipeline hybrid setup—is becoming the standard for modern serving engines. Moving forward, the most efficient LLM systems won't just blindly split layers; they will intelligently adapt their parallelism topology based on the exact specifications of the cluster's network interconnects (NVLink vs. PCIe vs. Ethernet) and the real-time demands of the prompt. 

As models continue to scale into the trillions of parameters, mastering the flow of data *between* the chips will be just as important as the silicon itself.