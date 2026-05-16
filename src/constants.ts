export const MENUS = [
  { 
    id: 'about-me', 
    title: 'About Me', 
    audioSrc: '/audio/kid-a.mp3', 
    color: '#ffffff',
    image: '/images/kid_a.jpg',
    section: 'BIOGRAPHY',
    content: {
      tagline: "Bridging AI Software & Hardware Systems",
      education: "B.Tech Undergrad @ VIT Chennai (2nd Year)",
      focus: "Artificial Intelligence, NLP, & LLM Architectures",
      achievements: "5x National Hackathon Winner",
      bio: "A specialized Electrical and Electronics Engineer transitioning into deep AI systems. I thrive on rapidly prototyping ideas, reasoning about model limitations, and translating complex technical outputs into clear, human-centered explanations.",
      hobbies: [
        { name: "Audiophile", detail: "Constant exploration of new sounds and experimental genres." },
        { name: "Poetry", detail: "Expressing perspectives through verse (Shared on Instagram)." },
        { name: "Gaming", detail: "Analyzing interactive systems and narrative design." }
      ]
    }
  },
  { 
    id: 'experiences', 
    title: 'Experiences', 
    audioSrc: '/audio/grace.mp3', 
    color: '#4a3a2a',
    image: '/images/grace.jpg',
    section: 'JOURNEY',
    content: {
      tagline: "Professional Milestones & Impact",
      roles: [
        {
          title: "AI/ML - AWS CLUB MEMBER",
          company: "AWS Cloud Club VIT Chennai",
          period: "Mar 2026 - Present",
          skills: ["Amazon Bedrock", "AWS SageMaker"]
        },
        {
          title: "Machine Learning Engineer",
          company: "Aathma Pranavaayu Pvt Ltd",
          period: "Jan 2026 - Present",
          skills: ["Machine Learning", "Local LLMs"]
        },
        {
          title: "Contributor",
          company: "GirlScript Summer of Code",
          period: "2026 - Present",
          skills: ["Open-Source Software", "GitHub"]
        }
      ]
    }
  },
  { 
    id: 'projects', 
    title: 'Projects', 
    audioSrc: '/audio/the-glow-pt2.mp3', 
    color: '#d4c5a1',
    image: '/images/glow_pt2.jpg',
    section: 'PORTFOLIO',
    content: {
      tagline: "High-Stakes Technical Prototypes",
      bio: "An archive of autonomous agents, multi-agent systems, and deep learning architectures built for global hackathons.",
      projectsList: [
        {
          id: 'auraos',
          title: 'AuraOs',
          subtitle: 'Zero-Hop Autonomous Android Agent',
          description: "Redefining accessibility with a zero-hop, autonomous Android agent. For millions in the Global South, smartphones are essential but app interfaces are a maze. Aura isn't a chatbot; she's an invisible hand that navigates the complex OS.",
          features: [
            { name: "Full OS Autonomy", detail: "Executes multi-step workflows by physically interacting with third-party apps." },
            { name: "Ghost Mode", detail: "Hides chaotic app interfaces behind a sleek frosted-glass overlay while Aura works." },
            { name: "Zero-Hop Conversation", detail: "Direct bidi-audio stream to Gemini 2.0 Flash for near-instant latency." },
            { name: "Savior Protocol", detail: "Voice-activated SOS mode that locks device and broadcasts GPS location." }
          ]
        },
        {
          id: 'signalworks',
          title: 'Signalworks',
          subtitle: 'AI Market Intelligence for Street Vendors',
          description: "AWS-Hackathon winner. AI-powered market intelligence for Bharat's street vendors via SMS & IVR. Powered by Amazon Bedrock & SageMaker. Resolves spatial, temporal, and pricing risks for 10M+ vendors.",
          impact: "Built for non-smartphone users via SMS/IVR integration."
        },
        {
          id: 'pixo',
          title: 'Pixo',
          subtitle: 'Worker-Controlled Multi-Agent System',
          description: "AMD AI for Public Good Hackathon. Uses Ryzen™ AI and ROCm to optimize gig worker earnings and safety. Functions as an 'AI Anti-Manager' that sits between platforms (Uber, Zomato) and workers.",
          impact: "Restores agency and improves financial/physical well-being for gig workers."
        },
        {
          id: 'defy',
          title: 'Defy',
          subtitle: 'Autonomous AI Trading Agent (AgentChain)',
          description: "MCP-powered autonomous AI trading agent that executes crypto trades via smart contracts. Decision-making is transparent, anchored on-chain, and governed by a DAO.",
          features: [
            { name: "On-Chain Transparency", detail: "Every AI decision is logged on-chain for full auditability." },
            { name: "Explainable Trading", detail: "Inspect AI reasoning and verify execution path." }
          ]
        },
        {
          id: 'weather-classifier',
          title: 'SE-ResNet Weather Classifier',
          subtitle: 'Top 4 Finish in AWS Weather Competition',
          description: "A custom Squeeze-and-Excitation ResNet built from scratch to classify weather under severe domain shift. Achieved 0.719 F1-Score without using pre-trained models.",
          features: [
            { name: "Custom SE-ResNet", detail: "Engineered from scratch to prioritize texture over color." },
            { name: "Domain Shift Handling", detail: "Solved 'Alien' dataset challenges with CLAHE and TTA." }
          ]
        }
      ]
    }
  },
  { 
    id: 'connect', 
    title: 'Connect', 
    audioSrc: '/audio/the-bends.mp3', 
    color: '#ff4d00',
    image: '/images/the_bends.jpg',
    section: 'CONTACT',
    content: {
      tagline: "Let's Build the Future of AI",
      bio: "Open for research collaborations, high-stakes technical roles, and discussions on autonomous agent architectures.",
      links: [
        { name: "LinkedIn", url: "https://www.linkedin.com/in/asik-kani-578474210/", type: "external" },
        { name: "GitHub", url: "https://github.com/ASIKKANI", type: "external" },
        { name: "Email", url: "mailto:asikkani73@gmail.com", type: "email" }
      ]
    }
  }
];
