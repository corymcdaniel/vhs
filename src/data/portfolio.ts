// Content for the Work panel (Channel 4 and /work).
// Edit this file to update the portfolio; WorkModal.tsx only handles layout.

export interface PortfolioLink {
  label: string;
  url: string;
}

export interface PortfolioItem {
  title: string;
  summary: string;
  // Optional technical version, shown while the card's HOLD ▶▶ SPECS button is held
  specs?: string;
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
    "I work on Fullstory's marketing site and the little projects that orbit it. Lately that's meant figuring out where AI actually helps: pairing on code, reviewing PRs, and building tools so designers and content folks don't have to wait on an engineer.",
  // Shown while HOLD ▶▶ SPECS is held
  summarySpecs:
    "I work on Fullstory's marketing site and the standalone projects around it. Over the last six months AI went from an experiment to how we ship: as a pair programmer, as a reviewer on every PR, and as tooling that designers, content managers and other engineers can run themselves.",
  groups: [
    {
      heading: 'Making Claude useful for the team',
      intro: 'Things I figured out once and wrote down, so nobody has to figure them out again.',
      items: [
        {
          title: 'Claude Code rules and skills',
          summary:
            'Wrote and maintain the CLAUDE.md rules for both marketing repos, split into focused files with a codebase guide and a 10-phase project conversion playbook. Wrote skills to make any interface work.',
          tags: ['Claude Code', 'CLAUDE.md', 'Skills'],
        },
        {
          title: 'Artifact-to-site pipeline',
          summary:
            "Turns a Claude artifact into a real production page, or into widgets authors can drop in from Contentful. The skills are cautious on purpose: plan first, ask before touching the shared content model, and don't call it done until the build actually passes.",
          specs:
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
      heading: 'Launch pages',
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
      intro: 'Less flashy, but everything else leans on it.',
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
            'Made the site faster: CSS split by template, heavy libraries like GSAP and matter-js only loaded when needed, and no more hero flash after the page hydrates.',
          specs:
            'Per-template CSS chunks, lazy-loaded GSAP, react-player and matter-js, and a fix for hero flashes after hydration.',
        },
      ],
    },
  ] as PortfolioGroup[],
};

export const personalProjects: PortfolioItem[] = [
  {
    title: 'Show Log',
    summary:
      "Every concert and stand-up show I've seen since 2002. Full edit history with undo, setlist.fm guesses at what a band will play, Wikidata and Spotify details, and venue maps. Built in about two weeks with Claude.",
    specs:
      'Every concert and stand-up show since 2002. Postgres with full change history and undo, setlist.fm "likely setlist" forecasts, Wikidata enrichment, Spotify stats and venue maps. Built in about two weeks with Claude.',
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
    summary: 'Gather your chips, remember your casino visits!',
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
      "A map of about 1,900 universities over each state's drinking and gas-price data. Three data pipelines to get there, plus color scales tuned so the differences actually show.",
    specs:
      'A choropleth and marker map of about 1,900 universities over state alcohol and fuel data, with three data pipelines (NIAAA, College Scorecard, EIA plus Census) and gamma-corrected color scales.',
    tags: ['Leaflet', 'Data pipelines'],
    links: [
      { label: 'Live', url: 'https://map.corymcdaniel.com/' },
      { label: 'Write-up', url: '/blog/0003' },
    ],
  },
];

// Client work alongside the day job
export const freelance = {
  title: 'Freelance Shopify developer',
  dates: '2025 – 2026',
  items: [
    {
      title: 'Holiday Bundler',
      summary:
        "A Shopify app for renting holiday decorations by the box. Pick a box, fill it, pick your dates; extra items cost a flat rate. The hard part was getting Shopify checkout to respect custom pricing, plus promo codes that don't break when two people grab the last one, and inventory that stays in sync.",
      specs:
        'A Shopify app for holiday-decoration rental boxes. Customers pick a box size, fill it and choose rental dates; items past the box limit charge a flat rate. Draft orders use GraphQL price overrides so Shopify checkout honors the custom pricing, promo codes hold up under simultaneous checkouts, and inventory syncs through webhooks.',
      tags: ['Shopify', 'Remix', 'PostgreSQL'],
      links: [{ label: 'Live', url: 'https://evrgreen.shop' }],
    },
  ] as PortfolioItem[],
};

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
