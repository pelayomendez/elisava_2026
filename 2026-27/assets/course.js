// Single source for the course structure: the landing page, the slide decks and the
// guide viewer all read from here. Add a chapter here and it appears everywhere.

const REPO_URL = 'https://github.com/pelayomendez/elisava_2026';

window.COURSE = {
  title: 'Agentic Product Development',
  edition: '2026–27',
  school: 'ELISAVA',
  instructor: 'Prof. Pelayo Méndez',
  repo: REPO_URL,

  // Chapters shown on the published site. Add a chapter id here after its class.
  // The files of every chapter are in the repo; locked ones only show as "coming soon".
  open: ['00', '01'],

  chapters: [
    {
      id: '00', dir: '00-setup', title: 'Setup & Mental Model', short: 'Setup',
      icon: 'fa-terminal', color: '#6890F0',
      bullets: ['Terminal and git', 'GitHub and Pages', 'How the web works', 'What a coding agent is'],
    },
    {
      id: '01', dir: '01-web-fundamentals', title: 'Web Fundamentals', short: 'Fundamentals',
      icon: 'fa-code', color: '#F08030',
      bullets: ['HTML, CSS and JavaScript by hand', 'Fetch API and the DOM', 'Vanilla Pokédex', 'Rebuild it with an agent and compare'],
    },
    {
      id: '02', dir: '02-agentic-ides', title: 'Agentic IDEs', short: 'Agentic IDEs', core: true,
      icon: 'fa-robot', color: '#EE1515',
      bullets: ['The tool landscape', 'Context: AGENTS.md and skills', 'MCP servers', 'Plan → build → verify'],
    },
    {
      id: '03', dir: '03-spec-driven-development', title: 'Spec-Driven Development', short: 'Specs',
      icon: 'fa-file-signature', color: '#22C3A6',
      bullets: ['Why specs beat prompts', 'OpenSpec: propose → apply → archive', 'Requirements and scenarios', 'Reviewing a plan before code'],
    },
    {
      id: '04', dir: '04-design-to-code', title: 'Design to Code', short: 'Design',
      icon: 'fa-pen-ruler', color: '#F85888',
      bullets: ['Figma by hand and via MCP', 'Tailwind v4 and components', 'Theming', 'Browser-checked UI'],
    },
    {
      id: '05', dir: '05-astro-with-agents', title: 'Astro with Agents', short: 'Astro',
      icon: 'fa-rocket', color: '#7038F8',
      bullets: ['Components and layouts', 'Routing and dynamic pages', 'Built change by change with OpenSpec', 'Islands and deploy'],
    },
    {
      id: '06', dir: '06-data', title: 'Data', short: 'Data',
      icon: 'fa-database', color: '#78C850',
      bullets: ['REST APIs', 'SQL and NoSQL', 'Supabase CRUD and realtime', 'Database MCP, read-only first'],
    },
    {
      id: '07', dir: '07-ai-in-the-product', title: 'AI in the Product', short: 'AI APIs',
      icon: 'fa-wand-magic-sparkles', color: '#E5B800',
      bullets: ['LLM APIs and keys', 'Structured output', 'Image generation', 'A backend proxy'],
    },
    {
      id: '08', dir: '08-realtime-and-agents', title: 'Realtime & Agents', short: 'Realtime',
      icon: 'fa-bolt', color: '#3EABCA',
      bullets: ['SSE, webhooks, WebSockets', 'Agent Wars client', 'Autonomous agents', 'Workflows and background agents'],
    },
    {
      id: '09', dir: '09-final-project', title: 'Final Project', short: 'Final',
      icon: 'fa-flag-checkered', color: '#7A8BAD',
      bullets: ['Your own product', 'Specs and AGENTS.md', 'Review log', 'Oral defence'],
    },
  ],

  // Cross-chapter guides that change during the year.
  living: [
    { title: 'State of AI Coding', icon: 'fa-wave-square', path: 'guides/state-of-ai-coding.md', text: 'A running log of what changed in AI coding, and what it means for how we work. Updated in class.' },
  ],

  // 2025-26 guides, still valid as foundations.
  foundations: [
    { title: 'Terminal Basics', icon: 'fa-terminal', href: '../content/guides/terminal-basics/index.html', text: 'Command-line skills for moving around and running tools.' },
    { title: 'Git Basics', icon: 'fa-code-branch', href: '../content/guides/git-basics/index.html', text: 'Commits, branches and collaboration.' },
    { title: 'CSS Basics', icon: 'fa-css3-alt', brand: true, href: '../content/guides/css-basics/index.html', text: 'Selectors, box model and layout.' },
    { title: 'CSS Architecture', icon: 'fa-layer-group', href: '../content/guides/css-arquitecture/index.html', text: 'Organising stylesheets that scale.' },
    { title: 'JavaScript Basics', icon: 'fa-js', brand: true, href: '../content/guides/js-basics/index.html', text: 'Variables, functions and the DOM.' },
  ],

  // Each project has its own brief page: project.html#<slug>.
  // Links in `resources` are relative to the 2026-27 folder.
  exercises: [
    {
      slug: 'ex1', id: 'Ex.1', title: 'HTML Pokédex', chapter: '01',
      text: 'Hand-made, then rebuilt with an agent and compared.',
      lead: 'A Pokédex page in plain HTML, CSS and JavaScript that loads its data from PokéAPI. You build it twice: first by hand, then with an agent. The point is the comparison.',
      steps: [
        ['Build it by hand', 'Semantic HTML, your own CSS, fetch from PokéAPI, filter by type. No agent.'],
        ['Publish it', 'Push to GitHub and turn on GitHub Pages.'],
        ['Rebuild it with an agent', 'Write an AGENTS.md as the brief: what it does, the API, your design rules. Then a fresh folder and an agent of your choice.'],
        ['Compare', 'Code size, accessibility, what you understand, what you would keep.'],
      ],
      deliver: ['Repository with both versions', 'The AGENTS.md you briefed the agent with', 'Live URL on GitHub Pages', 'One-page comparison: hand-made vs agent'],
      resources: [
        ['Starter', 'fa-box-open', '../examples/01-html-pokedex/initial/'],
        ['Reference solution', 'fa-flag-checkered', '../examples/01-html-pokedex/final/'],
        ['PokéAPI', 'fa-globe', 'https://pokeapi.co/'],
      ],
    },
    {
      slug: 'ex2', id: 'Ex.2', title: 'Agent Onboarding', chapter: '02',
      text: 'AGENTS.md, a skill, an MCP server and one verified feature.',
      lead: 'Take your Ex.1 Pokédex and make it a project an agent can work in well. Then ship one feature and prove it works.',
      steps: [
        ['Write AGENTS.md', 'Why, what, principles, constraints, how to run and test.'],
        ['Add one skill', 'A repeatable task your agent should do the same way every time.'],
        ['Connect one MCP server', 'Browser or Figma. Say what it lets the agent do, and what not.'],
        ['Ship one feature', 'Plan → build → verify. Read the diff before you accept it.'],
      ],
      deliver: ['Repository with AGENTS.md, the skill and the MCP config', 'Short summary of the agent session', '"What I rejected and why": at least three items'],
      resources: [
        ['Real AGENTS.md example', 'fa-file-lines', '../tools/agent-wars-client/AGENTS.md'],
      ],
    },
    {
      slug: 'ex3', id: 'Ex.3', title: 'First Spec', chapter: '03',
      text: 'One feature through OpenSpec: propose, review, apply, verify, archive.',
      lead: 'Add OpenSpec to your Pokédex and take one small feature through the whole spec-driven loop. The history must show plan, code and archive as separate steps.',
      steps: [
        ['Set up OpenSpec', 'openspec init, then write the project context in config.yaml.'],
        ['Explore and propose', 'Talk options through, then propose. Edit the plan until the review checklist passes.'],
        ['Apply in a fresh chat', 'Let the agent follow tasks.md. Stop it if it drifts.'],
        ['Verify and archive', 'Check every scenario by hand, then archive the change.'],
      ],
      deliver: ['Repository with the openspec/ folder', 'Three commits: plan, code, archive', 'The archived change with its scenarios'],
      resources: [
        ['OpenSpec on GitHub', 'fa-code-branch', 'https://github.com/Fission-AI/OpenSpec'],
        ['OpenSpec docs', 'fa-book', 'https://openspec.dev/docs'],
      ],
    },
    {
      slug: 'ex4', id: 'Ex.4', title: 'Astro Pokédex', chapter: '05',
      text: 'Gallery, detail pages and pagination, built change by change with OpenSpec.',
      lead: 'Rebuild the Pokédex as an Astro site: a gallery, one page per Pokémon and pagination. Every feature goes through an OpenSpec change.',
      steps: [
        ['Plan the site', 'AGENTS.md and config.yaml first. List the changes you will propose.'],
        ['Gallery and layout', 'Components, a shared layout, the data loaded at build time.'],
        ['Detail pages', 'Dynamic routes: one static page per Pokémon.'],
        ['Pagination and deploy', 'Paginated gallery, deployed to GitHub Pages.'],
      ],
      deliver: ['Deployed site and repository', 'openspec/ with every change archived', 'Review notes: what you changed in each proposal'],
      resources: [
        ['Astro intro example', 'fa-rocket', '../examples/02-astro-intro/'],
        ['Full Astro example', 'fa-layer-group', '../examples/03-astro-full/'],
        ['2025-26 brief (pptx)', 'fa-file-powerpoint', '../deliverables/Front End Ex.3 - Astro Pokedex.pptx'],
      ],
    },
    {
      slug: 'ex5', id: 'Ex.5', title: 'Agent Wars', chapter: '08',
      text: 'Realtime client and autonomous agent, delivered as a PR.',
      lead: 'Build a realtime client for the Agent Wars server, then an agent that plays on its own. Deliver it the way teams do: as a pull request.',
      steps: [
        ['Connect', 'Join the game server and show live state in the browser.'],
        ['Play by hand', 'Send moves from the UI and handle the server events.'],
        ['Automate', 'An autonomous agent that decides moves without you.'],
        ['Open a PR', 'Small commits, a clear description, ready for review.'],
      ],
      deliver: ['Pull request with the client and the agent', 'Short write-up of your agent strategy'],
      resources: [
        ['Client starter', 'fa-gamepad', '../tools/agent-wars-client/'],
        ['Game server', 'fa-server', '../tools/agent-wars-server/'],
        ['2025-26 brief (pdf)', 'fa-file-pdf', '../deliverables/Front End Ex.4 - Agent Wars.pdf'],
      ],
    },
    {
      slug: 'final', id: 'Final', title: 'Your Product', chapter: '09',
      text: 'Specs → agent build → review → oral defence.',
      lead: 'Design and build a small web product of your own, end to end, with an agentic workflow. You must understand and defend every line that ships.',
      steps: [
        ['Spec it', 'Product brief, AGENTS.md, then one OpenSpec change per feature.'],
        ['Build it with agents', 'Small changes, each verified against its scenarios.'],
        ['Keep a review log', 'What the agent proposed, what you kept, what you rejected and why.'],
        ['Defend it', 'Walk through one diff line by line; change something live without the agent.'],
      ],
      deliver: ['Deployed product and repository', 'Product brief, AGENTS.md and openspec/ history', 'Review log', 'Oral defence'],
      resources: [],
    },
  ],

  // 2025-26 image decks. Stored in Git LFS: they open locally, but GitHub Pages serves LFS files
  // as pointers, so they need another home before the site is published.
  decks: [
    { title: 'Augmented Engineering', icon: 'fa-microchip', chapter: '02', href: '../content/presentations/Augmented_Engineering.pdf', text: 'Escaping the vibe-coding trap in production systems.' },
    { title: 'Frontend Data Cartridges', icon: 'fa-sd-card', chapter: '06', href: '../content/presentations/Frontend_Data_Cartridges.pdf', text: 'Loading and managing data on the frontend.' },
    { title: 'Database Level Up', icon: 'fa-database', chapter: '06', href: '../content/presentations/Database_Level_Up.pdf', text: 'From variables to real databases.' },
    { title: 'The Realtime Spectrum', icon: 'fa-bolt', chapter: '08', href: '../content/presentations/The_Realtime_Spectrum.pdf', text: 'Polling to WebSockets: the trade-offs.' },
  ],
};

COURSE.isOpen = (chapterId) => COURSE.open.includes(chapterId);
