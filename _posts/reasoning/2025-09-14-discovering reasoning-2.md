---
layout: distill
title: The mechanistic question - 2. Reasoning modes in training data
date: 2025-09-14 21:14:14
description: 
series: Thinking in Language Models
authors:
  - name: Hieu N. Nguyen
    affiliations: 
      name: "PSU NLP"
tags:
  - reasoning
  - LLM
categories: blog
bibliography: thinking-in-lm.bib
hidden: true
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
</style>


{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/forks_motiv.png" class="img-fluid"%}
> What contextual or internal representational shifts trigger self-correction and backtracking behaviors in distilled reasoning models?

---

**Scenario 2: Linear Thinking vs Non-linear Thinking**

Let's start with a simple knowledge question that requires retrieving knowledge instead of reasoning or "either you know it or you don't know it". 

<center>"What is the capital of Vietnam?"</center>

It's likely that most large reasoning models have been trained on these piece of knowledge and they can answer directly without thinking. However, when we let the models think, they still express uncertanty, as shown in the following reasoning trace.

```
Okay, so I need to figure out the capital of Vietnam. I'm not entirely sure, but I think it's somewhere in Southeast Asia. I remember hearing that Vietnam has a capital, but I'm not 100% certain which city it is. Let me try to recall any information I might have. ...

I think the capital isn't one of the really big cities like Ho Chi Minh or Hanoi. Wait, no, actually, I think Hanoi is the capital. I've heard of Hanoi being mentioned in the news a lot, especially regarding political events or historical contexts. It's been a while since I studied this, so I'm a bit fuzzy on the details.

Let me think about other capitals in Southeast Asia. Singapore, Kuala Lumpur, Jakarta, Bangkok, Manila... those are capitals of other countries in that region. But Vietnam is a separate country, so its capital should be different. I'm pretty sure it's not Saigon because I think Saigon is a city in Vietnam, but I might be confusing it with the capital. Wait, no, I think Saigon is actually the name of the city, and the capital is a different name.
```

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

As a result, when we prefix the thinking trace with a single token, the performance and response length vary significantly.

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

In our recent work, we explore why does the distilled models exhibit this brittleness.
Our key hypothesis is that these linear and non-linear thinking are different reasoning modes co-exist in the training data, and for which model must resolve during post-training.
Specifically, the rationale for chosing one mode over another is hidden. 
This leads to **forks-in-the-road** situations in which a model encounters multiple valid, indistinguishable reasoning paths. 
At such points, post-training objective pressures the model to commit to a subset of these options available. 
This "missing rationale" problem manifests at both micro-level (step-by-step or which algebraic manipulation to apply next) and macro-level (strategy or mode selection). 
And when the model is exposed to a single reasoning path without justification, it may struggle to learn the "correct mechanisms" (e.g., based on the difficulty of problems) and instead rely on **spurious cues** (such as the prefix token) to steer it toward a particular path. 

{% include figure.liquid loading="eager" path="assets/posts/thinking_in_language_models/forks.png" class="img-fluid" caption="<strong>Illustrative examples of forks in the road</strong> (a) Graph navigation with indecipherable nodes, and (b) Mathematical reasoning with multiple valid solution modes. In both settings, decision points force commitment to a path without knowing which will succeed."%}

To test this hypothesis, we design controlled case studies that isolate and expose these decision-point structures.
Our first setting is a graph-based navigation task, inspired by prior work on indecipherable nodes in next-token prediction <d-cite key="bachmann24a"></d-cite>. In this task, a model must traverse a star graph from a start node to a target node, while encountering branching points that provide no information about which branch leads to success.
Our second setting focuses on mathematical reasoning problems that admit multiple valid reasoning modes and solution strategies.
At certain stages of reasoning, the model must decide how to proceed without knowing which strategy will ultimately succeed; these moments constitute decision points analogous to the graph branching. 
By tracking post-training dynamics across both of these settings as well as across ablated data variants, we observe that post-training coverage shrinkage is largely driven by how models resolve ambiguity under repeated exposure to such decision points. In particular, ablating or restructuring these points significantly alters model behavior, and the degree of shrinkage is correlated with their prevalence in the post-training data.
Our finding also helps explain why building a unified reasoning model that can effectively operate in both instruct (or non-thinking) and thinking modes remains challenging <d-cite key="NemotronCascade_Scaling_Cascaded_Reinforcement_Learning"></d-cite>.

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
          text: "<p><span class=\"hl-task\">We need to identify the capital of Vietnam.</span></p><p><span class=\"hl-concl\">The capital of Vietnam is Hanoi.</span></p><p>The capital of Vietnam is <strong>Hanoi</strong>.</p>"
        },
        {
          name: "The",
          isCorrect: true,
          text: "<p><span class=\"hl-task\">user is asking about the capital of Vietnam.</span> <span class=\"hl-eval\">I know that Vietnam is a country in Southeast Asia.</span> <span class=\"hl-plan\">The capital is the capital city, so I should recall its name.</span> <span class=\"hl-concl\">I believe the capital is Hanoi.</span> <span class=\"hl-plan\">Let me confirm.</span> <span class=\"hl-eval\">Yes, Hanoi is the capital, located on the Ho Chi Minh River.</span> <span class=\"hl-eval\">It's a significant city in Vietnam, known for its diversity in culture and history.</span> <span class=\"hl-plan\">I should present this information clearly, stating the name and location.</span> <span class=\"hl-concl\">That should answer the user's question accurately.</think></span></p><p>The capital of Vietnam is Hanoi.</p>"
         
        },
        {
          name: "Okay",
          isCorrect: true,
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
    {
      questionId: "q-math-asymptotes",
      dropdownTitle: "Math: Addition base-7,9,11,12",
      questionText: "<p>Assuming that all numbers are in base-7 where the digits are \"0123456\", what is 66 + 50?</p>",
      modelGroups: [
        {
          id: "q1-qwen",
          tabLabel: "QWEN2.5-MATH-1.5B",
          models: [
            {
              name: "Base Model",
              isCorrect: false,
              text: "To find the vertical asymptotes, we need to find the values of \\(x\\) that make the denominator of the function equal to zero. So, we solve the equation \\(x^2-5x-14=0\\). Factoring, we get \\((x-7)(x+2)=0\\)..."
            },
            {
              name: "Hybrid Model",
              isCorrect: true,
              text: "<span class=\"hl-task\">To</span> find the vertical asymptotes <span class=\"hl-task\">of</span> the function \\( f(x) = \\dots \\), <span class=\"hl-task\">we</span> need to determine <span class=\"hl-plan\">the</span> values of \\( x \\) that make the denominator zero, as these <span class=\"hl-task\">will</span> <span class=\"hl-eval\">be</span> the points where the function is undefined and <span class=\"hl-plan\">where</span> the vertical asymptotes occur."
            },
            {
              name: "Thinking Model",
              isCorrect: true,
              text: "Okay, so I have this problem here: I need to find the vertical asymptotes, horizontal asymptote, and then add them up. The function is f(x) = (2x)/(x² - 5x -14). Hmm, let me think about how to approach this. First, vertical asymptotes..."
            }
          ]
        },
        {
          id: "q1-llama",
          tabLabel: "LLAMA-3.1-8B",
          models: [
            { name: "Base Model", isCorrect: false, text: "LLAMA Output for Math Question..." }
          ]
        }
      ]
    }
  ];

  const COLLAPSE_THRESHOLD = 300; // Character limit before showing "Show More"

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