---
layout: distill
title: Reasoning modes
date: 2026-05-01 21:14:14
description: 
series: "Thinking in Language Models - The mechanistic questions"
authors:
  - name: Hieu N. Nguyen
    affiliations: 
      name: "PSU NLP"
tags:
  - reasoning
  - LLM
categories: blog
bibliography: "thinking-in-lm.bib"
hidden: false
---


<style>
  .interactive-demo { font-family: var(--global-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif); margin: 2rem 0; }
  
  /* Question Selector */
  .demo-question-selector { margin-bottom: 20px; display: flex; align-items: center; gap: 15px; }
  .demo-question-selector label { font-weight: 600; color: #2c3e50; margin: 0; }
  .demo-question-selector select { padding: 8px 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 0.95rem; font-family: inherit; min-width: 300px; background-color: #fff; cursor: pointer; }

  /* Tabs */
  .demo-tabs { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
  .demo-tabs button { background: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 8px 16px; font-size: 0.9rem; font-weight: 600; color: #555; cursor: pointer; transition: all 0.2s; }
  .demo-tabs button:hover { background: #f5f5f5; }
  .demo-tabs button.active { background: #3498db; color: white; border-color: #3498db; }

  /* Question Box */
  .demo-question { background: #ffffff; border-left: 4px solid #3498db; padding: 20px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px; }
  .demo-question h4 { margin-top: 0; color: #2c3e50; font-size: 1.1rem; font-weight: 600; margin-bottom: 10px;}
  .demo-question p:last-child { margin-bottom: 0; }

  /* Legend */
  .demo-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; font-size: 0.85rem; }
  .legend-item { display: flex; align-items: center; gap: 6px; background: #fff; padding: 4px 10px; border-radius: 4px; border: 1px solid #eee; }
  .color-box { width: 12px; height: 12px; border-radius: 3px; }

  /* Highlight Colors */
  .hl-task { background-color: #ffd1dc; }   
  .hl-plan { background-color: #cceeff; }   
  .hl-eval { background-color: #d4edda; }   
  .hl-calc { background-color: #e0f7fa; }   
  .hl-reval { background-color: #e6e6fa; }  
  .hl-uncert { background-color: #f8d7da; } 
  .hl-concl { background-color: #fff3cd; }  
  .hl-eq { background-color: #d1e7dd; }     

  /* Columns & Cards */
  .model-card { background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); height: 100%; }
  .model-card h4 { display: flex; align-items: center; gap: 8px; font-size: 1.2rem; margin-top: 0; margin-bottom: 15px; }
  .badge-incorrect { background: #f8d7da; color: #721c24; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; white-space: nowrap; }
  .badge-correct { background: #d4edda; color: #155724; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; white-space: nowrap; }
  
  .model-content { font-size: 0.95rem; line-height: 1.6; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  .model-content span { padding: 2px 4px; border-radius: 4px; }

  /* Collapse Styles */
  .trace-wrapper { position: relative; }
  .trace-content { overflow: hidden; max-height: 200px; }
  .trace-content.expanded { max-height: none; }
  .trace-wrapper.is-collapsed::after { content: ""; position: absolute; bottom: 38px; left: 0; width: 100%; height: 80px; background: linear-gradient(transparent, #ffffff); pointer-events: none; }
  .show-more-btn { display: block; width: 100%; background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 4px; color: #555; padding: 6px 0; margin-top: 15px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: background 0.2s; }
  .show-more-btn:hover { background: #e9ecef; }

  /* ==========================================
     HOVER TOOLTIPS FOR HIGHLIGHTS
     ========================================== */
  
  /* Make all highlight spans relative to position the tooltip */
  .model-content span[class^="hl-"] {
    position: relative;
    cursor: help;
    /* Optional: adds a subtle underline to show it's interactive */
    border-bottom: 1px dotted rgba(0,0,0,0.4); 
  }

  /* The Tooltip Box */
  .model-content span[class^="hl-"]::after {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, 5px); /* Start slightly lowered */
    background: #2c3e50;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-family: var(--global-font-family, -apple-system, BlinkMacSystemFont, sans-serif);
    font-weight: normal;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none; /* Prevents flickering */
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  /* The Tooltip Arrow (Small triangle pointing down) */
  .model-content span[class^="hl-"]::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, 5px);
    border: 5px solid transparent;
    border-top-color: #2c3e50;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 10;
  }

  /* Hover State: Fade in and slide up */
  .model-content span[class^="hl-"]:hover::after,
  .model-content span[class^="hl-"]:hover::before {
    opacity: 1;
    transform: translate(-50%, -4px);
  }

  /* Map the text content DIRECTLY to the spans (ignoring the legend boxes) */
  .model-content span.hl-task::after { content: "Task Formulation"; }
  .model-content span.hl-plan::after { content: "Planning Next Step"; }
  .model-content span.hl-eval::after { content: "Evaluating Intermediate Results"; }
  .model-content span.hl-calc::after { content: "Intermediate Numeric Calculations"; }
  .model-content span.hl-uncert::after { content: "Acknowledging uncertainty"; }
  .model-content span.hl-concl::after { content: "Announcing Intermediate Conclusions"; }
  .model-content span.hl-reval::after { content: "Reevaluation"; }
  .model-content span.hl-eq::after { content: "Equation Rearrangement"; }

  .center-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  d-article blockquote {
    padding: .5rem 1rem;
    margin: .8rem 0;
    color: #7a7a7a;
    border-left: .25rem solid #e5e5e5;
    font-family: "Fira Code", monospace;
    font-size: 14px;
  }

  .graph-example-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 800px;
    margin: 20px auto;
    line-height: 1.6;
  }
  .question-area {
    width: 68%;
  }
  .question-text {
    font-size: 0.9em;
    margin-bottom: 20px;
  }
  .solution {
    background-color: #f8f9fa;
    border-left: 4px solid #0056b3;
    padding: 15px;
    border-radius: 4px;
    font-size: 0.9em;
  }
  .solution h4 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #0056b3;
  }
  .solution ul {
    margin: 0;
    padding-left: 20px;
  }
  .diagram {
    width: 28%;
    display: flex;
    justify-content: center;
  }
  .math {
    font-family: "Cambria Math", "Times New Roman", serif;
    font-style: italic;
  }
</style>

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/forks_motiv.png" class="img-fluid"%}

"Jagged intelligence" is a term coined by Andrej Karpathy <d-cite key="karpathy2024jagged"></d-cite> to describe the highly uneven capabilities of modern Large Language Models (LLMs) and generative AI systems.
It's interesting to see that these system are both impressively capable at, e.g., solving gold-medal IMO math questions <d-cite key="castelvecchi2025deepmind,openai2024xpost"></d-cite>, but at the same time, making basic elementary math errors <d-cite key="youtube_JNyuX1zoOgU,song2026large"></d-cite>.



In this research, we offer a partial explanation for this phenomenon: these models might not always use, or we might not know how to activate, their full potential.

---

> When reasoning models perform a certain reasoning behavior (e.g. backtracking or verification), why do they choose to generate that step?

In this part of the series, we'll gain insights to this question from post-training perspective, and more specifically, the post-training data.

During post-training, models are optimized via reinforcement learning or distillation to exhibit reasoning, there is a distinct risk that the optimization merely encourages the model to adopt the syntax of reasoning behaviors without the substance.

<!-- **Linear Thinking vs Non-linear Thinking** -->

{% include figure.liquid path="/assets/posts/thinking_in_language_models/linear_vs_non_linear_thinking.png" max-width="95%" class="center-image"%}

Let's start with a "simple" knowledge question:

<center>What is the capital of Vietnam?</center>

It's likely that most large reasoning models have been trained on these piece of knowledge and they can answer directly without thinking. However, when we let the models think, they still express uncertainty, as shown in the following reasoning trace.

> Okay, so I need to figure out the capital of Vietnam. I'm not entirely sure, but I think it's somewhere in Southeast Asia. I remember hearing that Vietnam has a capital, but I'm not 100% certain which city it is. Let me try to recall any information I might have. 
> 
> ...
>
> I think the capital isn't one of the really big cities like Ho Chi Minh or Hanoi. Wait, no, actually, I think Hanoi is the capital. I've heard of Hanoi being mentioned in the news a lot, especially regarding political events or historical contexts. It's been a while since I studied this, so I'm a bit fuzzy on the details.
>
> ...

**Why does the model expresses uncertainty in this case?**

It turns out that changing a single prefix of the response could heavily affect the thinking pattern of models, as shown in the following examples.


<div class="interactive-demo l-page">
  
  <div class="demo-question-selector">
    <label for="question-select">Select question:</label>
    <select id="question-select"></select>
  </div>

  <div class="demo-question">
    <h4>Question</h4>
    <div id="dynamic-question-text"></div>
  </div>

  <div class="demo-legend">
    <div class="legend-item"><div class="color-box hl-task"></div> Task Formulation</div>
    <div class="legend-item"><div class="color-box hl-plan"></div> Planning Next Step</div>
    <div class="legend-item"><div class="color-box hl-eval"></div> Evaluating Intermediate Results</div>
    <div class="legend-item"><div class="color-box hl-calc"></div> Intermediate Numeric Calculations</div>
    <div class="legend-item"><div class="color-box hl-uncert"></div> Acknowledging uncertainty</div>
    <div class="legend-item"><div class="color-box hl-concl"></div> Announcing Intermediate Conclusions</div>
    <div class="legend-item"><div class="color-box hl-reval"></div> Reevaluation</div>
    <div class="legend-item"><div class="color-box hl-eq"></div> Equation Rearrangement</div>
  </div>

  <div class="demo-tabs" id="dynamic-tabs"></div>
  <div id="dynamic-content"></div>

</div>

> The Prefix Effect: A single spurious starting token can heavily affect model reasoning bahaviors.

As a result, when we perturb a single prefix token of thinking trace, the performance and response length vary significantly.

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/performance_on_capqa_addition.png" class="img-fluid" caption="Models' default behavior shows over-thinking on factual QA (backtracking hurts) and under-thinking on counterfactual arithmetic (backtracking helps)."%}

This finding also holds when we evaluate on math benchmarks such as GSM8k, MATH-500, AIME24, and AIME25.

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/performance_on_maths.png" class="img-fluid" caption="Performance and Response Length across different prompt prefixes." sizes="60vw" %}


<!-- **Overthinking Example**

Let's consider a simple math question:
<center>"What is the answer of 2 plus 3?"</center>

A thinking trace can be
```markdown
I need to solve the addition problem 2 plus 3. First, I identify the two numbers involved in the equation, which are 2 and 3. Next, I add these two numbers together to find the sum. Finally, I conclude that the answer is 5.
```

This is the thought if we prefix the reasoning trace with "Okay".

```markdown
Okay, so I need to figure out the answer to 2 plus 3. Hmm, let me think about this step by step. First, I remember that addition is one of the basic math operations, right? It's adding two numbers together. So, 2 plus 3 means I'm combining these two numbers to get a total.

Let me visualize this. If I have two apples and someone gives me three more apples, how many apples do I have in total? So, starting with 2 apples, adding 3 more would give me 5 apples. That makes sense because 2 plus 3 is 5. I think that's correct, but let me double-check to make sure I'm not making a mistake.

Another way to look at it is by using my fingers ...

Wait, maybe I should try using a number line to be extra sure ...

I also remember that in math, addition is commutative, so ...
``` -->

<!-- 
---

**Scenario 4: Genuie reasoning?**

When the reasoning trace get stuck, can the model perform targeted adjust -->

---

### Forks in the roads


In our recent work, we investigate why distilled models exhibit such brittleness. Our key hypothesis is that linear and non-linear thinking represent distinct reasoning modes that co-exist in the training data, (for example, as a mixture of outputs from models like DeepSeek-V3 and DeepSeek-R1 <d-cite key="Guo2025"></d-cite>). During post-training, the model must reconcile these modes. However, because the rationale for choosing one over the other remains hidden, the model encounters "forks-in-the-road" during generation. At these decision points, the post-training objective pressures the model to commit to a specific path. Lacking the "correct mechanisms", e.g., based on task difficulty, the model instead relies on spurious cues—such as a specific prefix token—to steer its trajectory. This "missing rationale" problem manifests at both the micro-level (e.g., algebraic manipulations) and the macro-level (e.g., overall strategy selection).

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/forks.png" class="img-fluid" caption="<strong>Illustrative examples of forks in the road</strong> (a) Graph navigation with indecipherable nodes, and (b) Mathematical reasoning with multiple valid solution modes. In both settings, decision points force commitment to a path without knowing which will succeed."%}

**Pulling the rabbit out of the hat**

To better understand these decision points, consider mathematical proof construction. A classic example is Euclid’s proof of the infinitude of prime numbers. The proof contains a crucial construction step (highlighted in blue) that requires a nontrivial conceptual leap: constructing a new number from the product of known primes plus one. Once this key insight is introduced, the remainder of the argument proceeds through comparatively routine deductions.


{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/pulling_the_rabit.png" class="img-center" caption="Euclid’s proof of the infinitude of prime numbers. The highlighted construction step illustrates a key conceptual leap that determines the success of the proof trajectory." max-width="80%"%}

Such moments are often described informally as pulling the rabbit out of the hat: the decisive insight appears suddenly, while the reasoning that led to it remains hidden from view. We hypothesize that many reasoning traces in post-training data contain exactly these kinds of latent decision points. The final successful trajectory is observable, but the underlying rationale for choosing that trajectory over competing alternatives is not. 
<!-- Consequently, distilled models may imitate the surface form of successful reasoning without learning the mechanisms that govern when particular reasoning strategies should be invoked. -->


---

### Forks in the roads and Coverage Shrinkage

To test this hypothesis, we designed controlled case studies that isolate and expose these decision-point structures.
Our first setting is a graph-based navigation task, inspired by prior work on indecipherable nodes in next-token prediction <d-cite key="bachmann24a"></d-cite>.

In this task, a model must traverse a star graph from a start node to a target node, while encountering branching points that provide no information about which branch leads to success.


<div class="graph-example-container" style="display: flex; align-items: flex-start; gap: 30px; flex-wrap: wrap;">
  <div class="question-text" style="flex: 1 1 320px; min-width: 240px;">
    <p>
      <strong>Q:</strong> Let each letter represent a numerical variable. These variables are defined as follows:<br>
      <span class="math">n</span> = 10; 
      <span class="math">m</span> = <span class="math">n</span> + 12; 
      <span class="math">k</span> = <span class="math">m</span> + 3; 
      <span class="math">h</span> = <span class="math">k</span> + 4; 
      <span class="math">l</span> = <span class="math">n</span> + 19; 
      <span class="math">j</span> = <span class="math">l</span> + 17; 
      <span class="math">x</span> = <span class="math">j</span> + 2.<br>
      What is the resulting value of <span class="math">x</span>?
    </p>
  </div>
  <div class="diagram" style="flex: 0 0 auto; min-width: 220px;">
    <svg width="200" height="240" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#333" />
        </marker>
      </defs>
      <g stroke="#333" stroke-width="1.5" marker-end="url(#arrow)">
        <line x1="90" y1="42" x2="62" y2="76" />
        <line x1="110" y1="42" x2="138" y2="76" />
        <line x1="50" y1="105" x2="50" y2="133" />
        <line x1="150" y1="105" x2="150" y2="133" />
        <line x1="50" y1="165" x2="50" y2="193" />
        <line x1="150" y1="165" x2="150" y2="193" />
      </g>
      <g fill="white" stroke="#333" stroke-width="1.5" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle" dominant-baseline="central">
        <circle cx="100" cy="30" r="14" stroke="green" stroke-width="2.5" />
        <text x="100" y="31" fill="#000">n</text>
        <circle cx="50" cy="90" r="14" />
        <text x="50" y="91" fill="#000">m</text>
        <circle cx="150" cy="90" r="14" />
        <text x="150" y="91" fill="#000">l</text>
        <circle cx="50" cy="150" r="14" />
        <text x="50" y="151" fill="#000">k</text>
        <circle cx="150" cy="150" r="14" />
        <text x="150" y="151" fill="#000">j</text>
        <circle cx="50" cy="210" r="14" />
        <text x="50" y="211" fill="#000">h</text>
        <circle cx="150" cy="210" r="14" stroke="red" stroke-width="2.5" />
        <text x="150" y="211" fill="#000">x</text>
      </g>
    </svg>
  </div>
</div>


We construct two controlled data variants that differ only in whether such decision points are present during post-training.
In the *Forward* setting, the model encounters explicit decision points—states with multiple possible continuations where only one leads to a correct solution. Solving the problem therefore requires the model to decide and select among reasoning paths.

<div class="solution">
    <h4>Forward Solution</h4>
    <p>To find the value of <span class="math">x</span>, we compute the variables step by step:</p>
    <ul>
      <li><span class="math">n</span> = 10</li>
      <li style="background-color: #FFEFBA; border-radius: 4px; padding: 2px 6px;">
        <span class="math">l</span> = <span class="math">n</span> + 19 = 10 + 19 = <strong>29</strong>
        <span style="color: #bc7100; font-style: italic; margin-left: 8px;">&#x26A0; Decision point: At this step, the solution path can branch depending on which variable is computed.</span>
      </li>
      <li><span class="math">j</span> = <span class="math">l</span> + 17 = 29 + 17 = <strong>46</strong></li>
      <li><span class="math">x</span> = <span class="math">j</span> + 2 = 46 + 2 = <strong>48</strong></li>
    </ul>
    <p>Thus, the final answer is <span class="math">x = <span style="border: 2px solid #333; border-radius: 5px; padding: 2px 10px; background: #f9f9f9; display: inline-block; font-weight: bold;">48</span></span>.</p>
</div>

In contrast, the *Reverse (w/o decision point)* setting removes these forks by presenting the correct trajectory in reverse format (target to source), effectively eliminating any need for path selection by the model.

<div class="solution">
  <h4>Reverse Solution</h4>
  <p><strong>A:</strong> To solve the problem, we compute the variables step by step.</p>
  <ol>
    <li>
      Substitute <span class="math">j = l + 17</span> into <span class="math">x</span>, which gives<br>
      <span class="math">x = (l + 17) + 2 = l + 19</span>.
    </li>
    <li>
      Substitute <span class="math">l = n + 19</span> into <span class="math">x</span>, which gives<br>
      <span class="math">x = (n + 19) + 19 = n + 38</span>.
    </li>
    <li>
      Compute <span class="math">x</span> using <span class="math">n = 10</span>, which gives<br>
      <span class="math">x = 10 + 38 = 48</span>.
    </li>
  </ol>
  <p>Thus, the final answer is <span class="math">x = <span style="border: 2px solid #333; border-radius: 5px; padding: 2px 10px; background: #f9f9f9; display: inline-block; font-weight: bold;">48</span></span>.</p>
</div>


<!-- We evaluate this setup on two backbone models (\texttt{Qwen-2.5-0.5B} \citep{qwen2.5} and \texttt{EvoLM-1B} \citep{qi2025evolm}) to test robustness of observations with respect to pre-training initialization prior to the post-training. -->
Because both settings correspond to the same underlying task, any behavioral differences can be directly attributed to the impact of decision points in the data. 

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/confidence_legostar.png" class="img-fluid" caption="Change in model confidence at decision points over the course of SFT" max-width="70%"  class="img-fluid" class="center-image" %}

The above figure shows that model’s confidence at decision points increases sharply throughout the training. However, this increase is not selective: the model is highly confident not only when it chooses the correct branch, but also when it chooses an incorrect one. This shows that training with decision points in data can push the model toward overconfident, single-path commitments, rather than calibrated uncertainty over multiple valid continuations. As a result, alternative trajectories are progressively suppressed, leading to the observed coverage shrinkage and drop in pass@k.

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/legostar_performace_sft.png" class="img-fluid" caption="Effect of decision points on coverage in the graph navigation task. Pass@k across SFT epochs for Forward vs. Reverse (without decision points) problem-solving settings." max-width="100%" class="center-image" %}

We further observe the same coverage shrinkage emerges during RLVR when training on Forward setting but not in Reverse setting. This suggests that coverage shrinkage is driven not only by the learning algorithm, but also by the data and the presence of decision points in reasoning.

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/legostar_performace_rlvr.png" class="img-fluid" caption="Pass@k performance when running GRPO on models pretrained on forward and reverse (-DP) solutions." max-width="100%" class="center-image" %}

---

<!-- The forks-in-the-road phenomenon is not limited to synthetic graph settings; it also arises naturally in real-world reasoning tasks where multiple solution strategies coexist.  -->
<!-- During generation, the model must implicitly commit to one early in the trajectory, before knowing which will succeed. These early commitments act as decision points, analogous to branching in graph-based settings. -->
<!-- To study this effect, we examine reasoning mode selection as a representative instance of such decision points. Specifically, we consider two settings: (i) different reasoning representations: natural language (NL) versus code-based reasoning -->

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/data_mixture.png" class="img-fluid" caption="Mixture of reasoning and non-reasoning examples in post-training data influences a model's behavioral tendencies." max-width="90%" class="center-image" %}


Next, we investigate whether models trained on mixed data can learn to balance different reasoning modes under repeated sampling.
A key question is how the **structure** of diversity in training data affects this decision. In our experiments, we construct two data designs with identical diversity ratios (50% natural language (NL), 50% code) but different organization (the above Figure): **Data-level diversity**: each problem is solved using a single mode, but the dataset is globally balanced across the modes; **Problem-level diversity**: each problem appears with both reasoning modes. This setup isolates whether coverage depends not just on **how much** diversity is present, but **how it is distributed**.

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/code_nl_ratio.png" class="img-fluid" caption="How two styles of data mixing (data-level vs problem-level) control the effective coverage and diversity in reasoning traces." max-width="90%" class="center-image" %}

---

If first tokens act as decision points, can we use them to recover lost coverage? In this experiment, we enforce perturbation in the sampling of first token among top-k options instead of the standard decoding (without the need for retraining!). We observe that it can effectively nudge the model into different reasoning paths, and significantly restore their lost coverage.


{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/topk_prefix_performance.png" class="img-fluid" caption="<b>Recovering coverage via prefix perturbation.</b> Top-$k$ prefix sampling (Top-8) mitigates coverage shrinkage and improves pass@k at larger $k$" max-width="90%" class="center-image" %}


---

### Conclusion

<!-- We investigate the phenomenon of "coverage shrinkage" in post-training reasoning language models. 
Diverging from prevailing theories that blame the optimization dynamics, we propose a data-centric hypothesis and argue that shrinkage is driven by "forks in the road" or decision points in fine-tuning data where multiple valid reasoning paths exist, but the rationale for selecting one over the other is obscured.
Through experiments on synthetic tasks, mathematical reasoning, and off-the-shelf distilled reasoning models, we demonstrate that models learn to rely on spurious features to resolve the ambiguity in reasoning chains, leading to path collapse. By mitigating this shrinkage via targeted data diversity and inference-time prefix manipulations, we demonstrate that reasoning capacity is not lost, but merely locked behind uncalibrated decisions. -->

These results point toward a new perspective: improving reasoning in LLMs may require not only scaling compute or refining objectives, but also explicitly modeling and preserving the structure of reasoning paths during data curation and training. In particular, this perspective helps explain why developing a single model that robustly operates across both instruct (non-thinking) and reasoning (thinking) modes remains challenging <d-cite key="NemotronCascade_Scaling_Cascaded_Reinforcement_Learning"></d-cite>. We hope this lens is useful for future work on reasoning models, data design, and test-time scaling strategies.

<!-- 
To study this effect, we examine reasoning mode selection as a representative instance of such decision points. Specifically, we consider two settings: (i) different reasoning representations: natural language (NL) versus code-based reasoning, and (ii) different reasoning structures: linear vs. backtracking reasoning. We analyze each of these settings in detail below.
 -->

<script>
document.addEventListener("DOMContentLoaded", function() {
  
  // ==========================================
  // 1. JSON DATA WITH MULTIPLE QUESTIONS
  // ==========================================
  const demoData = [
    {
      questionId: "q-geo-capital",
      dropdownTitle: "CapitalQA",
      questionText: "<p>What is the capital of Vietnam?</p>",
      modelGroups: [
        {
      id: "qwen-1-5b",
      tabLabel: "QWEN2.5-MATH-1.5B",
      models: [
        {
          name: "We",
          isCorrect: true,
          text: "<p><span class=\"hl-task\">need to identify the capital of Vietnam.</span></p><p><span class=\"hl-concl\">The capital of Vietnam is Hanoi.</span></think></p><p>The capital of Vietnam is <strong>Hanoi</strong>.</p>"
        },
        {
          name: "The",
          isCorrect: true,
          text: "<p><span class=\"hl-task\">user is asking about the capital of Vietnam.</span> <span class=\"hl-eval\">I know that Vietnam is a country in Southeast Asia.</span> <span class=\"hl-plan\">The capital is the capital city, so I should recall its name.</span> <span class=\"hl-concl\">I believe the capital is Hanoi.</span> <span class=\"hl-plan\">Let me confirm.</span> <span class=\"hl-eval\">Yes, Hanoi is the capital, located on the Ho Chi Minh River.</span> <span class=\"hl-eval\">It's a significant city in Vietnam, known for its diversity in culture and history.</span> <span class=\"hl-plan\">I should present this information clearly, stating the name and location.</span> <span class=\"hl-concl\">That should answer the user's question accurately.</think></span></p><p>The capital of Vietnam is Hanoi.</p>"
         
        },
        {
          name: "Okay",
          isCorrect: false,
          text: "<p><span class=\"hl-task\">,so I need to figure out the capital of Vietnam.</span> <span class=\"hl-uncert\">I'm not too familiar with Vietnam</span>, but <span class=\"hl-eval\">I know it's a big country in Southeast Asia.</span> <span class=\"hl-uncert\">I remember hearing it's often called the \"King of the Country,\" which probably means it's the most populous one. But I'm not sure about the exact name of the capital.</span></p><p><span class=\"hl-uncert\">I think the capital is a city, but I'm not sure which one. Maybe it's somewhere in Hanoi?</span> <span class=\"hl-eval\">I've heard of Hanoi before, it's in Vietnam.</span> <span class=\"hl-reval\">But wait, isn't there another city in Vietnam that's the capital? I'm a bit confused because I've heard of both Ho Chi Minh and Hanoi as capitals, but I don't think they're the same place.</span></p><p><span class=\"hl-plan\">I should probably start by recalling what I know.</span> <span class=\"hl-eval\">Vietnam is a country that has two cities that are often mentioned: Hanoi and Ho Chi Minh.</span> <span class=\"hl-uncert\">Hanoi is the capital of Vietnam, but I'm not sure if it's also the national capital. Ho Chi Minh is the capital of Vietnam as well, but I think he was the king, not the capital.</span></p><p><span class=\"hl-uncert\">I think the capital is Ho Chi Minh City, but I'm not entirely certain.</span> <span class=\"hl-plan\">Maybe I can check some information.</span> <span class=\"hl-eval\">I remember that the capital is often referred to as the \"capital of the world,\" but that might be a misconception.</span> <span class=\"hl-plan\">I should focus on the actual capital city.</span></p><p><span class=\"hl-uncert\">I believe Ho Chi Minh City is the capital, but I'm not 100% sure.</span> <span class=\"hl-plan\">Maybe I can think about the history.</span> <span class=\"hl-eval\">Vietnam was part of the Kingdom of Vietnam, and the capital was called Hanoi, but once the country was part of France, it became Ho Chi Minh City.</span> <span class=\"hl-concl\">So perhaps the capital has changed over time.</span></p><p><span class=\"hl-reval\">Wait, no, that doesn't make sense. The capital should be the same regardless of who the king was. Maybe I'm mixing up the terms.</span> <span class=\"hl-plan\">Let me try to remember.</span> <span class=\"hl-eval\">I think the capital is Ho Chi Minh City. I've heard that it's the most populous city in Vietnam, so that might make it the capital.</span></p><p><span class=\"hl-plan\">I can also think about the government.</span> <span class=\"hl-eval\">The capital city is usually the place where the government is located. So if Ho Chi Minh City is the capital, the government there would be the one governing the country.</span> <span class=\"hl-uncert\">I think the government is called the National Frontier Commission, which is part of the People's Liberation Army. That might be a clue, but I'm not sure.</span></p><p><span class=\"hl-plan\">Another way to think about it is by looking at the capital's location.</span> <span class=\"hl-eval\">It's in the north, near Hoi An and Hanoi. Hoi An is a major city in Vietnam, so that might be a hint.</span> <span class=\"hl-concl\">But I think the capital is Ho Chi Minh City, not Hoi An.</span></p><p><span class=\"hl-plan\">I should also consider the population.</span> <span class=\"hl-eval\">If Ho Chi Minh City is the capital, it should be the most populous city in Vietnam.</span> <span class=\"hl-concl\">I think that's true, so that might confirm it.</span></p><p><span class=\"hl-uncert\">I'm not entirely sure, but I think I've heard that Ho Chi Minh City is the capital.</span> <span class=\"hl-plan\">Maybe I can double-check this information later or look it up to confirm.</think></span></p><p>The capital of Vietnam is Ho Chi Minh City, also known as Hoi An. It is the most populous city in Vietnam and serves as the national capital.</p>"
        }
      ]
    },
      {
        id: "llama-8b",
        tabLabel: "LLAMA-3.1-8B",
        models: [
          {
            name: "Okay",
            isCorrect: true,
            text: "<p><span class=\"hl-task\">Okay, so I need to figure out the capital of Vietnam.</span> <span class=\"hl-uncert\">Hmm, I'm not entirely sure,</span> but <span class=\"hl-uncert\">I remember hearing it's somewhere in Southeast Asia.</span> <span class=\"hl-plan\">Let me think...</span> <span class=\"hl-eval\">Vietnam is a country in Southeast Asia, right?</span> <span class=\"hl-eval\">I know that the capital cities of some Southeast Asian countries like Thailand are Bangkok, Kuala Lumpur, and Jakarta.</span> So maybe Vietnam's capital is similar in that region.</p><p><span class=\"hl-reval\">Wait,</span> <span class=\"hl-eval\">I think the capital is a major city, probably the largest city too.</span> <span class=\"hl-eval\">I've heard of cities like Ho Chi Minh City and Hanoi.</span> Oh, right! <span class=\"hl-concl\">I think Hanoi is the capital.</span> <span class=\"hl-uncert\">But I'm not 100% sure.</span> <span class=\"hl-plan\">Let me try to recall any information I've come across before.</span></p><p><span class=\"hl-eval\">I remember watching a documentary or something about Vietnam, and they mentioned Hanoi as the capital.</span> <span class=\"hl-eval\">Also, I think the government is based there, so that makes sense.</span> <span class=\"hl-eval\">I don't remember any other cities in Vietnam being the capital.</span> <span class=\"hl-plan\">Maybe I should also consider the context in which the question is asked.</span> <span class=\"hl-concl\">If it's a general question, Hanoi is the answer.</span> <span class=\"hl-eval\">But sometimes people might confuse it with other cities, but I don't think so.</span></p><p><span class=\"hl-reval\">Wait, another thought:</span> <span class=\"hl-eval\">sometimes people talk about Saigon, which is actually the former capital before 1954, but now it's a major city.</span> <span class=\"hl-concl\">But the political capital is Hanoi.</span> <span class=\"hl-concl\">So the capital is Hanoi, and Saigon is a separate city, though they are both significant.</span></p><p><span class=\"hl-eval\">I think I'm confident now.</span> <span class=\"hl-concl\">The capital of Vietnam is Hanoi.</span> <span class=\"hl-eval\">I don't recall any other city being referred to as the capital in recent times.</span> So yeah, <span class=\"hl-concl\">Hanoi must be the correct answer.</think></span></p><p>The capital of Vietnam is Hanoi.</p>"
          },
          {
            name: "The",
            isCorrect: true,
            text: "<p><span class=\"hl-concl\">The capital of Vietnam is Hanoi.</think></span></p><p>The capital of Vietnam is Hanoi.</p>"
          },
          // Add more models for LLAMA here
        ]
      }
      ]
    },
    // ── ENTRY 2: CapitalQA — Overthinking ─────────────────────────────────
    {
      questionId: "q-capitalqa-korea",
      dropdownTitle: "CapitalQA: South Korea (Overthinking)",
      questionText: "<p>What is the capital of South Korea?</p>",
      modelGroups: [
        {
          id: "korea-qwen1",
          tabLabel: "DeepSeek-R1-Qwen-1.5B",
          models: [
            {
              name: "Okay",
              isCorrect: false,
              text: "<p><span class=\"hl-task\">, so I need to figure out the capital of South Korea.</span> <span class=\"hl-uncert\">I remember that capital cities are usually the main cities where the government is based, but I'm not exactly sure about South Korea.</span> <span class=\"hl-plan\">Let me think about what I know.</span></p><p><span class=\"hl-eval\">I know that South Korea is a country in East Asia. The capital is a big city, likely a major city in South Korea.</span> <span class=\"hl-uncert\">I've heard of cities like Berlin, Tokyo, or Paris as capitals, but I'm not sure about South Korea.</span></p><p><span class=\"hl-plan\">I should consider the structure of the country.</span> <span class=\"hl-eval\">South Korea is divided into several regions, like Gyeongbokgung, Gyeongbokgye, and Gwangju.</span> <span class=\"hl-concl\">I think Gyeongbokgye is the capital. It's located in the center of the country.</span> <span class=\"hl-uncert\">Maybe it's similar to Seoul, which is another major city.</span></p><p><span class=\"hl-reval\">I also remember that Seoul is the capital of South Korea, but I'm not certain if it's the same as Gyeongbokgye.</span> <span class=\"hl-uncert\">I think they are the same place, just called differently. So the capital would be Gyeongbokgye.</span></p><p><span class=\"hl-reval\">Wait, but I'm not 100% sure.</span> <span class=\"hl-concl\">South Korea's capital is indeed Gyeongbokgye. It's located in the central part of the country.</span></p><p>The capital of South Korea is <strong>Gyeongbokgye</strong>.</p>"
            },
            {
              name: "The",
              isCorrect: true,
              text: "<p><span class=\"hl-concl\">capital of South Korea is Seoul. It is the most populous city in the country and serves as the administrative and governmental center.</span> <span class=\"hl-eval\">Seoul is the administrative capital of South Korea and is known for its modern architecture and vibrant culture.</span></p><p>The capital of South Korea is <strong>Seoul</strong>.</p>"
            }
          ]
        }
      ]
    },

    // ── ENTRY 3: Counterfactual Arithmetic — Linear vs Non-linear ─────────
    {
      questionId: "q-counterfact-6052",
      dropdownTitle: "Counterfactual Arithmetic: 60+52",
      questionText: "<p>You are a mathematician. Assuming that all numbers are in base-11 where the digits are &quot;0123456789A&quot;, what is 60 + 52?</p>",
      modelGroups: [
        {
          id: "counterfact-qwen1",
          tabLabel: "DeepSeek-R1-Qwen-1.5B",
          models: [
            {
              name: "To",
              isCorrect: false,
              text: "<p><span class=\"hl-task\">solve 60 + 52 in base-11.</span> <span class=\"hl-plan\">I first need to convert both numbers from base-11 to base-10.</span></p><p><span class=\"hl-plan\">Starting with 60 in base-11:</span> <span class=\"hl-calc\">0 × 11⁰ = 0; 6 × 11¹ = 66. Total: 66.</span></p><p><span class=\"hl-plan\">Converting 52:</span> <span class=\"hl-calc\">2 × 11⁰ = 2; 5 × 11¹ = 55. Total: 57.</span></p><p><span class=\"hl-calc\">66 + 57 = 123.</span></p><p><span class=\"hl-concl\">The sum of 60 + 52 in base-11 is 123 in base-10.</span></p><p>\\(\\boxed{123}\\)</p>"
            },
            {
              name: "Okay",
              isCorrect: true,
              text: "<p><span class=\"hl-task\">, so I need to add 60 and 52 in base-11.</span> <span class=\"hl-uncert\">Hmm, I'm a bit confused about how base-11 works, but I think it's similar to base-10, except it goes up to 10, represented by 'A'.</span></p><p><span class=\"hl-plan\">I should probably convert both numbers from base-11 to base-10 to make the addition easier.</span></p><p><span class=\"hl-calc\">60 in base-11: 6 × 11¹ + 0 × 11⁰ = 66.</span> <span class=\"hl-calc\">52 in base-11: 5 × 11¹ + 2 × 11⁰ = 57.</span></p><p><span class=\"hl-calc\">66 + 57 = 123.</span></p><p><span class=\"hl-reval\">But the question asks for the answer in base-11. So, I need to convert 123 from base-10 back to base-11.</span></p><p><span class=\"hl-calc\">123 ÷ 11 = 11 rem 2; 11 ÷ 11 = 1 rem 0; 1 ÷ 11 = 0 rem 1.</span> <span class=\"hl-concl\">Reading remainders bottom to top: 102 in base-11.</span></p><p><span class=\"hl-eval\">Check: 1 × 11² + 0 × 11 + 2 = 121 + 0 + 2 = 123. ✓</span></p><p>\\(\\boxed{102}\\)</p>"
            }
          ]
        }
      ]
    },

    // ── ENTRY 4: MATH-500 — Underthinking ────────────────────────────────
    {
      questionId: "q-math500-music",
      dropdownTitle: "MATH-500: School Students (Underthinking)",
      questionText: "<p>Two-thirds of the students at Baker Middle School take music. There are 834 students who take music. How many students are there at Baker Middle School?</p>",
      modelGroups: [
        {
          id: "math500-llama",
          tabLabel: "DeepSeek-R1-Llama-8B",
          models: [
            {
              name: "To",
              isCorrect: false,
              text: "<p><span class=\"hl-task\">find out the total number of students at Baker Middle School.</span> <span class=\"hl-plan\">I'll start by determining how many students take music.</span> <span class=\"hl-eval\">Two-thirds of the students are involved in music, and there are 834 music students.</span> <span class=\"hl-plan\">To find the total student body, I'll divide the number of music students by two-thirds.</span></p><p>\\(\\frac{2}{3}x = 834 \\Rightarrow x = 834 \\times \\frac{3}{2} = 1252\\)</p><p>\\(\\boxed{1252}\\)</p>"
            },
            {
              name: "Okay",
              isCorrect: true,
              text: "<p><span class=\"hl-task\">, so I need to figure out how many students are at Baker Middle School.</span> <span class=\"hl-plan\">Let me define the total number of students as T. Two-thirds of these students take music, so (2/3) × T = 834.</span></p><p><span class=\"hl-plan\">To find T, I'll multiply both sides by the reciprocal of 2/3, which is 3/2.</span></p><p><span class=\"hl-calc\">T = 834 × (3/2). 834 ÷ 2 = 417, then 417 × 3: 400 × 3 = 1200, 17 × 3 = 51, so 1200 + 51 = 1251.</span></p><p><span class=\"hl-reval\">Wait, let me double-check: 1251 ÷ 3 = 417, 417 × 2 = 834. ✓</span></p><p><span class=\"hl-concl\">The total number of students at Baker Middle School is 1251.</span></p><p>\\(\\boxed{1251}\\)</p>"
            }
          ]
        }
      ]
    }
  ];

  const COLLAPSE_THRESHOLD = 300; // Character limit before showing " "Show More"

  const selectElement = document.getElementById("question-select");
  const tabsContainer = document.getElementById("dynamic-tabs");
  const contentContainer = document.getElementById("dynamic-content");
  const questionTextContainer = document.getElementById("dynamic-question-text");

  // ==========================================
  // 2. INITIALIZE DROPDOWN
  // ==========================================
  demoData.forEach((q, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = q.dropdownTitle;
    selectElement.appendChild(option);
  });

  // Listen for Dropdown Changes
  selectElement.addEventListener("change", (e) => {
    renderDemo(e.target.value);
  });

  // ==========================================
  // 3. RENDER LOGIC
  // ==========================================
  function renderDemo(questionIndex) {
    const data = demoData[questionIndex];

    // Update Question Text
    questionTextContainer.innerHTML = data.questionText;

    // Clear Tabs and Content
    tabsContainer.innerHTML = "";
    contentContainer.innerHTML = "";

    // Build Tabs & Models for the selected question
    data.modelGroups.forEach((group, index) => {
      const isActive = index === 0;

      // Create Tab
      const btn = document.createElement("button");
      btn.className = isActive ? "active" : "";
      btn.setAttribute("data-target", group.id);
      btn.textContent = group.tabLabel;
      tabsContainer.appendChild(btn);

      // Create Content Wrapper
      const contentBlock = document.createElement("div");
      contentBlock.id = group.id;
      contentBlock.className = `tab-content ${isActive ? "active" : ""}`;
      contentBlock.style.display = isActive ? "block" : "none";

      // Build Grid
      let rowHtml = '<div class="row">';
      group.models.forEach(model => {
        const badgeClass = model.isCorrect ? "badge-correct" : "badge-incorrect";
        const badgeIcon = model.isCorrect ? "✓ Correct" : "✗ Incorrect";
        const needsCollapse = model.text.length > COLLAPSE_THRESHOLD;
        
        rowHtml += `
          <div class="col-md-4 mb-4">
            <div class="model-card">
              <h4>${model.name} <span class="${badgeClass}">${badgeIcon}</span></h4>
              ${needsCollapse ? '<div class="trace-wrapper is-collapsed">' : ''}
                <div class="model-content ${needsCollapse ? 'trace-content' : ''}">
                  <p>${model.text}</p>
                </div>
              ${needsCollapse ? '<button class="show-more-btn">Show More ↓</button></div>' : ''}
            </div>
          </div>
        `;
      });
      rowHtml += '</div>';
      contentBlock.innerHTML = rowHtml;
      contentContainer.appendChild(contentBlock);
    });

    attachEventListeners();

    // Re-render MathJax if equations were injected
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }

  // ==========================================
  // 4. ATTACH EVENTS (Tabs & Show More)
  // ==========================================
  function attachEventListeners() {
    const allTabs = tabsContainer.querySelectorAll("button");
    const allContents = contentContainer.querySelectorAll(".tab-content");

    // Tab Switching
    allTabs.forEach(tab => {
      tab.addEventListener("click", function() {
        allTabs.forEach(t => t.classList.remove("active"));
        allContents.forEach(c => c.style.display = "none");

        this.classList.add("active");
        const targetId = this.getAttribute("data-target");
        document.getElementById(targetId).style.display = "block";
      });
    });

    // Show More / Collapse Logic
    const showMoreBtns = contentContainer.querySelectorAll(".show-more-btn");
    showMoreBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const wrapper = this.closest(".trace-wrapper");
        const content = wrapper.querySelector(".trace-content");

        if (wrapper.classList.contains("is-collapsed")) {
          wrapper.classList.remove("is-collapsed");
          content.classList.add("expanded");
          this.innerHTML = "Show Less ↑";
        } else {
          wrapper.classList.add("is-collapsed");
          content.classList.remove("expanded");
          this.innerHTML = "Show More ↓";
        }
      });
    });
  }

  // Render the first question initially
  renderDemo(0);

});
</script>