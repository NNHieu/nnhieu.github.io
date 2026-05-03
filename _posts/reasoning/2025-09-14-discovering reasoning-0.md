---
layout: distill
title: Scaling compute
date: 2025-09-14 23:14:14
description: 
series: "Thinking in Language Models - The mechanistic questions"
authors:
  - name: Ngoc-Hieu Nguyen
    affiliations: 
      name: "MAILLAB - VinUniversity"

tags: reasoning,llm
categories: blog
mermaid:
  enabled: true
  zoomable: true

bibliography: thinking-in-lm.bib
---

## More parameters and more tokens

Bender et al. <d-cite key="bender2021parrots"></d-cite> introduced the “stochastic parrot” metaphor to describe large language models (LLMs). They characterize an LM as “a system that randomly pieces together linguistic patterns it has encountered in massive training data, guided only by statistical cues about how those patterns co-occur, and without any grounding in meaning — essentially, a stochastic parrot.” While this description is accurate in that LLMs are trained by minimizing cross-entropy loss, this objective alone does not fully account for the range of behaviors these models exhibit.

{% include figure.liquid loading="eager" path="assets/img/gpt3_arithmetic.png" class="img-fluid" caption="Adapted from Figure 3.10 in the GPT-3 paper (Brown et al., 2020). A dramatic increase in capabilities is observed from the 13B model to the 175B model (from 9.2% to 94.2% accuracy in 3-digit subtraction)."%}

According to the GPT-3 paper <d-cite key="brown2020language"></d-cite>, the 175B model is only slightly more accurate than the 13B model in terms of next-token prediction (cross-entropy 1.73 vs. 1.97, or predicting the next token with 17.7% rather than 14% probability). Yet despite this modest improvement in perplexity, the 175B model is qualitatively far more capable: it solves many tasks almost perfectly, whereas the 13B model performs only marginally better than chance.

As mentioned in a talk by **Hyung Won Chung** from OpenAI <d-cite key="hyung2023incentivize"></d-cite>:  
> “Somehow the model learns to perform many, many tasks only trained with next-token prediction.”

In the same talk, he proposed the **massive multitask learning hypothesis**:  
> “Beyond some scale, the easiest way to do well on next-token prediction is for the model to find a set of general skills that are applicable to many tasks. For example, these skills include learning languages, understanding, and reasoning.”

Recently, there is a new axis of scaling these models: test-time compute. In this scaling regime, pass@1 performance on many tasks gets much better as we add more test-time compute.

{% include figure.liquid loading="eager" path="assets/img/train_vs_test_compute.webp" caption="From OpenAI's blog post: Learning to reason with LLMs."%}

There are a lot of examples where increasing test-time compute (i.e., doing more work at inference/test time rather than training time) leads to better performance in traditional algorithms - long before LLMs.

- Best-First or A Search*: Expanding more nodes → closer to optimal path.
- Monte Carlo Tree Search (MCTS): More playouts → deeper/denser search tree → stronger move choices.
- Beam Search in Decoders (e.g., HMMs, CRFs, SMT): increase beam width → examine more candidate sequences.
- k-Nearest Neighbors (k-NN): Higher k often reduces noise → better predictive performance (up to a point).
- Markov Chain Monte Carlo (MCMC): More MCMC samples → better posterior estimates.


<!-- “Scaling test-time compute” in LLMs means: Allocating more computation during inference - without retraining the model — to get higher performance. -->

In LLM inference, test-time compute often refers to the number of tokens generated (e.g., generating multiple responses, or producing longer responses, etc.). Scaling test-time compute can be achieved via<d-footnote>
See <a href="/assets/pdf/Reading_Scaling_LLM_Test_Time_Compute_Optimally_can_be_more_effective_than_scaling_model_parameters.pdf" target="_blank">my slides</a> on test-time scaling </d-footnote>:  
- Chain-of-thought (CoT)
- Self-consistency: sample many CoT paths
- Tree-of-thoughts search
- Reflection loops / Re-evaluation or verification passes
- Reasoning models with thinking tokens

However, different from previous examples, why does this help is often not very clear.

<!-- Let's go thought some of them. -->

## Reasoning in text
>*"The process of drawing conclusions based on available information (usually a set of premises)."*

In this article, we refer to "reasoning" in LLMs as the act of generating intermediate *steps*<d-footnote>even though the definition of a "step" can be ambiguous</d-footnote> before arriving to the final answer. 
This could be achieved via 
* **Chain-of-thought with Prompting:** Prompt LMs such that they generate intermediate tokens/steps before the final answer.
* **Chain-of-thought without Prompting:** Select a decoding path where the model "reason" before answering.
* **Reasoning via RLVF or Distillation:** Post-training LMs to reinforce reasoning behaviors such as backtracking, verification, error correction, ...

The first and second approaches try to steer the generation using input context or intial response tokens. And they suggest that the base/instruct models are capable of reasoning step-by-step using text to some extend.

Furthermore, LLMs could be finetuned such that they generate reasoning behaviors when solving problems. These reasoning behaviors could be initialization, deduction, knowledge augmentation, example testing, uncertainty estimation, and backtracking, e.t.c <d-cite key="venhoff2025understanding, mondorf2024beyond"></d-cite>. And by combining these behaviors during *a thinking process*, these models can achieve good performance on many complex tasks.

### 1. From direct answers to chain-of-thought answers
The following is an example from <d-cite key="wei2022chain"></d-cite> that ilustrate chain of thought from LLMs and the performance gains across different model families and model sizes:

| | **Standard Prompting** | **Chain-of-Thought Prompting** |
| :--- | :--- | :--- |
| **Model Input** | **Q:** Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?<br><br>**A:** The answer is 11.<br><br>**Q:** The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have? | **Q:** Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?<br><br>**A:** <span style="background-color:#ADD8E6;">Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11.</span> The answer is 11.<br><br>**Q:** The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have? |
| **Model Output** | **A:** The answer is 27. <span style="color:red;font-size:1.5em;">✕</span> | **A:** <span style="background-color:#90EE90;">The cafeteria had 23 apples originally. They used 20 to make lunch. So they had 23 - 20 = 3. They bought 6 more apples, so they have 3 + 6 = 9.</span> The answer is 9. <span style="color:green;font-size:1.5em;">✓</span> |

<aside>
{% include figure.liquid loading="eager" path="assets/img/cot_with_params.png" width="200" sizes="95vw" zoomable=true caption="Chain-of-thought prompting's performance with increasing model scale. From Wei et al 2022"%}
</aside>

This example uses 1-shot prompt, which includes an example of CoT in the prompt as demonstration. But in practice, including a simple instruction like "think step-by-step" has a similar effect.

There are several works that try to give a deeper understand of why does this improve the performance <d-cite key="prystawski2023why"></d-cite>. Some give explainations based on the required computation to solve the problem. However, even if we only consider set of questions that *do not require many computation*, CoT prompting still improve the performance. So there should be more than that.

{% details Click here to know more %}


> Hypothesis 1: Chain of thought is a better estimator for locality structure

Consider the following theoretical setting:

- (A sequence of lenght N) A set of random variables $\{Y_i\}_{i = 1}^N$ taking support on a finite set $\mathcal{X}$
- $p_d$ is the data distribution defined by a Bayes net. 
- Training data is a sequence of variable indices $i \in \{ 1,\dots,N \}$, and variable values $v_i \in \mathcal{X}$ in the format `<indice>:<value>`.
- Observation distribution $p_\text{obs}$ takes support on a set $\mathcal{Y}_\text{obs} \subseteq \mathcal{P}(\{1,\dots,N\})$.
- Given an autoregressive conditional probability estimation model $q$, We can have the following estimators:
  1. Direct prediction: $\hat{q}_D(Y_i = y_i \| Y_j = y_j) = q(Y_i = y_i \| Y_j = y_j)$
  2. Scaffolded generation: 
    $$\hat{q}_S(Y_i = y_i \| Y_j = y_j) = \frac{1}{M} \sum_{k=1}^{M} q(Y_i = y_i \| \{Y_s = y_s^{k}\}_{s \in S} ,Y_j = y_j)$$ 
    where $$y_s^{k} \sim q(Y_s\| \{Y_t = y_t^{k}\}_{t \in S\|t \prec s} ,Y_j = y_j)$$
  3. Free generation

**Theorem 3.1.**  
Let $S$ be the space of possible sequences consisting of variable indices followed by variable values. Let $u$ be the uniform distribution over $S$. Let $H(p, q)$ denote the cross entropy between distributions $p$ and $q$. We consider the following risk:

$$
R(q) = H(p, q) + H(u, q).
$$

Let $q^{*} = \arg\min_{q} R(q)$ be a minimizer of the risk over all possible probability distributions. Then, for all non-adjacent random variables $Y_i$ and $Y_j$, reasoning through intermediate variables has lower bias than direct prediction. That is, for any $y_i, y_j \in \mathcal{X}$:

$$
\begin{aligned}
\left|
\mathbb{E}_{S \sim q^{*}}\!\left[ \hat{q}_S(Y_i = y_i \mid Y_j = y_j) \right]
- p_d(Y_i = y_i \mid Y_j = y_j)
\right|^2
&< \\
\left|
\hat{q}_D(Y_i = y_i \mid Y_j = y_j)
- p_d(Y_i = y_i \mid Y_j = y_j)
\right|^2.
\end{aligned}
$$

> Hypothesis 2: Chain of thought is easier to learn for autoregressive language models.

Some tasks are easier to learn and generalize than the others. 

{% enddetails %}

In the example below, we present a failure case of CoT when prompting ChatGPT on a simple chain-of-arithmetic task:

{% include figure.liquid loading="eager" path="assets/img/failcase_cot.png" width="200" sizes="95vw" zoomable=true caption="Chain-of-thought on LEGO."%}

In the above example, we ask GPT-4 to answer the value of a variable given chain of equations. The final result is correct but is this it? The answer start in the wrong direction and then come back to the correct branch. So there are 2 redundant steps. 

It seems like the model should have the ability to backtrack.


#### 2. From "linear reasoning" to "non-linear reasoning"

| | **Chain-of-Thought Prompting** | **Large Reasoning Models** <br>*(e.g., o1, R1)* |
| :--- | :--- | :--- |
| **Model Input** | **Q:** Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?<br><br>**A:** <span style="background-color:#ADD8E6;">Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11.</span> The answer is 11.<br><br>**Q:** The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have? | **Q:** The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?<br><br>*(Input is simple; the complexity is handled by the model's hidden chain of thought)* |
| **Model Output** | **A:** <span style="background-color:#90EE90;">The cafeteria had 23 apples originally. They used 20 to make lunch. So they had 23 - 20 = 3. They bought 6 more apples, so they have 3 + 6 = 9.</span> The answer is 9. <span style="color:green;font-size:1.5em;">✓</span> | **A:** <span style="color:grey; font-style:italic;">&#9432; Thought Process (Internal)<br>1. Initial calc: 23 - 20 = 13...<br>2. <span style="color:#d9534f;"><strong>Wait, checking arithmetic:</strong></span> 23 minus 10 is 13. 23 minus 20 is 3. <br>3. <strong>Correction:</strong> The remaining amount is 3, not 13.<br>4. Add purchase: 3 + 6 = 9.<br>5. <strong>Final Verify:</strong> Does the question imply the 6 were bought *before* lunch? No, usually sequential. Answer holds.</span><br><br>The answer is 9. <span style="color:green;font-size:1.5em;">✓</span> |

Even thought, with CoT prompting, LLMs will break down the problem into steps, it often reflects *a final solution* which means that the "thought" does not includes common behaviors in human's reasoning process such as uncertainty expression, verification, or backtracking. 

However, these behaviors can emerge through RLVR (Reinforcement Learning from Verifiable Reward) finetuning <d-cite key="Guo2025"></d-cite>. The resulting models, known as Large Reasoning Models, generate answers in two phases: a thinking phase, during which the model exhibits various reasoning behaviors, and a conclusion phase, which generate a final "submission" from the thought.

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/dsr1_fig2.png" class="img-fluid" caption="Figure 2 in the DeepSeek-R1 paper. The multi-stage training pipeline of DeepSeek-R1."%}

Another post-training receipt to make models think is reasoning distillation which is also describe in the DeepSeek-R1 paper and is shown to be more effective for small models.
Furthermore, distilling stronger models into smaller ones achieves outstanding results. In contrast, training smaller models using the large-scale reinforcement learning approaches demands significant computational resources and may still not reach the effectiveness obtained through distillation <d-cite key="Guo2025"></d-cite>.

Thus, "effective" reasoning behaviors or "Aha moments" appear to emerge more readily in larger models.
So, more paramerters and more tokens.

<!-- *(Reasoning Behavior). The system’s computed response to a reasoning task, particularly its actions, expressions and underlying mechanisms exhibited during **the reasoning process**.*  -->
<!-- ### LLM Monkey -->
