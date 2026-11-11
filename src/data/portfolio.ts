// Content for the Work panel (Channel 4 and /work).
// Edit this file to update the portfolio; WorkModal.tsx only handles layout.

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface PortfolioStat {
  value: string;
  label: string;
}

export interface PortfolioItem {
  title: string;
  summary: string;
  tags?: string[];
  links?: PortfolioLink[];
}

export interface PortfolioGroup {
  heading: string;
  intro?: string;
  items: PortfolioItem[];
}

export interface Role {
  company: string;
  title: string;
  dates: string;
}

export const profile = {
  name: 'Cory McDaniel',
  role: 'Senior UX Engineer at Fullstory',
  location: 'Phoenix, Arizona',
  headline:
    'Full-stack engineer since 2010, building data-driven products. Experimentation and a heavy workload made me slightly AI-pilled. I still care about the craft.',
  links: [
    { label: 'GitHub', url: 'https://github.com/corymcdaniel' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/corymcdaniel' },
  ] as PortfolioLink[],
};

export const fullstory = {
  company: 'Fullstory',
  title: 'Senior UX Engineer',
  dates: '2021 – present',
  period: 'Highlights from May – Nov 2026',
  summary:
    "I work on Fullstory's marketing site and the standalone projects around it. Over the last six months AI went from an experiment to how we ship: as a pair programmer, as a reviewer on every PR, and as tooling that designers, content managers and other engineers can run themselves.",
  // Stats are hidden for now: set showStats to true to bring the row back.
  showStats: false,
  stats: [
    { value: '169', label: 'PRs shipped in 6 months' },
    { value: '3', label: 'Claude Code skills written for the team' },
    { value: '5', label: 'AI-facing launches' },
    { value: '100%', label: 'of PRs through AI review' },
  ] as PortfolioStat[],
  groups: [
    {
      heading: 'AI as team infrastructure',
      intro: 'Turning one-off Claude sessions into workflows other people can repeat.',
      items: [
        {
          title: 'Claude Code rules and skills',
          summary:
            'Wrote and maintain the CLAUDE.md rules for both marketing repos, split into focused files with a codebase guide and a 10-phase project conversion playbook. Built three slash commands: /convert-project, /html-to-page and /artifact-extract-dynamic-components.',
          tags: ['Claude Code', 'CLAUDE.md', 'Skills'],
        },
        {
          title: 'Artifact-to-site pipeline',
          summary:
            'A Claude artifact becomes a production page, or a set of embeddable widgets authors place from Contentful. The skills carry guardrails: plan before changing anything, never touch the shared content model without a yes, and check the real build exit code.',
          tags: ['Contentful', 'React', 'Guardrails'],
        },
        {
          title: 'A home for AI-built projects',
          summary:
            'Restructured a repo into a multi-project monorepo for standalone, AI-built launches, with branching conventions, copy-paste integration templates agents can follow, and role-based guides so designers and content managers can publish too.',
          tags: ['Monorepo', 'Netlify', 'Docs'],
        },
      ],
    },
    {
      heading: "Shipping Fullstory's AI story",
      items: [
        {
          title: 'MCP Get Started',
          summary:
            'A self-serve page for connecting Fullstory MCP to Claude, ChatGPT and Codex, with Agentic Session Review prompts.',
          tags: ['MCP'],
        },
        {
          title: 'Field Notes engineering blog',
          summary:
            'A new "Engineering, AI & Experiments" blog with filters, RSS and a dynamic-component registry, so posts can embed live tools like a prompt builder that outputs a SKILL.md.',
          tags: ['Contentful', 'RSS'],
        },
        {
          title: 'Muse is here',
          summary:
            "An Intelligence Report comparing an AI shopping agent's session with a person's, with pointer replay and a canvas hero.",
          tags: ['Canvas', 'Session replay'],
        },
        {
          title: 'Agentic commerce one-pagers and nav refresh',
          summary:
            'Pages on AI-agent segmentation and agentic commerce, and a nav rework that moved "Product" to "Platform" with a StoryAI Intelligence column.',
        },
      ],
    },
    {
      heading: 'The groundwork',
      intro: 'Platform work that made the AI work possible.',
      items: [
        {
          title: 'Shared form-events module',
          summary:
            'One dependency-free module now powers form analytics on fullstory.com and every standalone project, with a drift check and CORS handling. Built largely with Claude as a co-author.',
        },
        {
          title: 'Experience scorecard',
          summary:
            'Prototyped a Lighthouse-based grader with custom weighted categories (2024), then later moved its backend from GCP Cloud Run and Firestore to Netlify Functions and Neon.',
          links: [{ label: 'Prototype code', url: 'https://github.com/corymcdaniel/moongrass' }],
        },
        {
          title: 'Site performance',
          summary:
            'Per-template CSS chunks, lazy-loaded GSAP, react-player and matter-js, and a fix for hero flashes after hydration.',
        },
      ],
    },
  ] as PortfolioGroup[],
  approach: [
    'Claude as a pair programmer on the hardest cross-repo work, with commit messages that explain why.',
    'Cursor Bugbot on every PR, plus Copilot Autofix fixes I review and accept.',
    "Experiments are framed as experiments. When a Claude attempt doesn't hold up, I revert it and redo it properly.",
  ],
};

export const personalProjects: PortfolioItem[] = [
  {
    title: 'Show Log',
    summary:
      'Every concert and stand-up show since 2002. Postgres with full change history and undo, setlist.fm "likely setlist" forecasts, Wikidata enrichment, Spotify stats and venue maps. 88 commits across 26 PRs in about two weeks with Claude.',
    tags: ['Astro', 'Netlify Database', 'Data'],
    links: [
      { label: 'Live', url: 'https://cory-concert-tracker.netlify.app' },
      { label: 'Code', url: 'https://github.com/corymcdaniel/concert-tracker' },
    ],
  },
  {
    title: 'Wrong Folks',
    summary:
      'My band site. Chunked uploads to get past serverless body limits, ranged audio streaming, sanitized Markdown notes and a WCAG AA accessibility pass.',
    tags: ['React', 'Netlify Blobs', 'Accessibility'],
    links: [
      { label: 'Live', url: 'https://wrongfolks.com' },
      { label: 'Code', url: 'https://github.com/corymcdaniel/wrong-folks' },
    ],
  },
  {
    title: 'This site',
    summary:
      'An experiment in directing AI to build a whole site: VHS effects, a TV dial with hidden channels, and an honest write-up of where AI-written code falls short.',
    tags: ['React', 'TypeScript', 'CSS animation'],
    links: [
      { label: 'Why I built it', url: '/blog' },
      { label: 'Code', url: 'https://github.com/corymcdaniel/vhs' },
    ],
  },
  {
    title: 'Chip Gather',
    summary: 'A casino-chip collection tracker with multiplayer blackjack.',
    links: [{ label: 'Live', url: 'https://www.chipgather.com/' }],
  },
  {
    title: 'LAN Watchdog',
    summary:
      'A Windows PowerShell utility that shuts a machine down safely after a real network outage.',
    links: [{ label: 'Code', url: 'https://github.com/corymcdaniel/lan-watchdog' }],
  },
  {
    title: 'Drink / Drive / University',
    summary:
      'A choropleth and marker map of about 1,900 universities over state alcohol and fuel data, with three data pipelines (NIAAA, College Scorecard, EIA plus Census) and gamma-corrected color scales.',
    tags: ['Leaflet', 'Data pipelines'],
    links: [
      { label: 'Live', url: 'https://map.corymcdaniel.com/' },
      { label: 'Write-up', url: '/blog/0003' },
    ],
  },
];

export const earlierRoles: Role[] = [
  { company: 'Fullstory', title: 'Web Developer (contract)', dates: '2019 – 2021' },
  { company: 'Brightwell', title: 'Software Engineer', dates: '2017 – 2019' },
  { company: '352 Inc.', title: 'Software Developer', dates: '2014 – 2017' },
  { company: 'RentPath', title: 'Software Engineer', dates: '2013 – 2014' },
  { company: 'Thumb-Tab', title: 'Developer', dates: '2013 – 2014' },
  { company: 'Kabbage', title: 'Software Engineer, Scrum Master', dates: '2012 – 2013' },
  { company: 'GE Transportation', title: 'Web Developer', dates: '2012' },
  { company: 'ThePort Network', title: 'Support Developer', dates: '2009 – 2012' },
];
