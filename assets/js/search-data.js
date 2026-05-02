// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "For an up-to-date list of my research papers, please see my Google Scholar profile. * denotes equal contribution.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "post-multi-armed-bandits",
        
          title: "Multi-Armed Bandits",
        
        description: "Learning by teaching",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/multi-arms-bandit/";
          
        },
      },{id: "post-scaling-the-giants-a-guide-to-efficient-parallelism-in-llm-inference",
        
          title: "Scaling the Giants: A Guide to Efficient Parallelism in LLM Inference",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/scaling-inference/";
          
        },
      },{id: "post-scaling-compute",
        
          title: "Scaling compute",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/discovering-reasoning-0/";
          
        },
      },{id: "post-the-mechanistic-question-1-learning-to-search",
        
          title: "The mechanistic question - 1. Learning to search",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/discovering-reasoning-1/";
          
        },
      },{id: "post-the-mechanistic-question-2-reasoning-modes-in-training-data",
        
          title: "The mechanistic question - 2. Reasoning modes in training data",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/discovering-reasoning-2/";
          
        },
      },{id: "post-tản-mạn",
        
          title: "Tản mạn",
        
        description: "Lan man",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/daily-story/";
          
        },
      },{id: "post-just-know-stuffs",
        
          title: "Just know stuffs",
        
        description: "This is just a place for my personal use to keep track of what I have learnt. So that I can free up my mental space.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/just-know-stuff/";
          
        },
      },{id: "post-learning-as-optimization",
        
          title: "Learning as optimization",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/Learning-as-optimization/";
          
        },
      },{id: "post-convergence-to-critical-point",
        
          title: "Convergence to critical point",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/optimization-1/";
          
        },
      },{id: "post-convergence-of-gd-under-convexity",
        
          title: "Convergence of GD under Convexity",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/optimization-2/";
          
        },
      },{id: "post-beyond-convexity",
        
          title: "Beyond convexity",
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/optimization-3/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-project-1",
          title: 'project 1',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-7",
          title: 'project 7',
          description: "with background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=bejNBqsAAAAJ", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6E%67%6F%63%68%69%65%75%74%62%31%33@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/NNHieu", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/hieunn-uet", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/hieu_ngoc_ng", "_blank");
        },
      },{
        id: 'social-resume',
        title: 'Resume',
        section: 'Socials',
        handler: () => {
          window.open("", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
