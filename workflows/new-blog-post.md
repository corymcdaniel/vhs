# Workflow: New Blog Post

Use this workflow when writing a new blog post about a project or website.

## What to provide

Give Claude the following about your project:

- **URL** of the site (if deployed)
- **What it is** — one sentence description
- **Why you built it** — the motivation or spark
- **What was interesting** — challenges, decisions, or things worth noting
- **The stack** — frameworks, tools, APIs, services used
- **Anything else** — funny moments, late-night decisions, pivots

You don't need all of these — a rough dump of notes is fine.

---

## What Claude will do

1. **Determine the next slug** — scan `src/blog/` for existing posts and use the next number (`0001`, `0002`, etc.)
2. **Draft the post** — write it to `src/blog/[XXXX].md` following the format below
3. **Review with you** — suggest any formatting improvements
4. **Regenerate the blog list** — run `node scripts/generateBlogList.js` to pick up the new post

---

## Post format

```markdown
# >> [XXXX] [Title]: [Subtitle]

*[One-line description of what this post covers]*

## [Section]

[URL as a markdown link if applicable]

[Body content...]

### [Subsection]

[Content...]

### The Stack

[Tech used, deployed where, any notable constraints]
```

### Conventions

- Title format: `>> 0003 AI Projects: Mapping Experiment` — number, category, colon, subtitle
- Subtitle in italics on the second line
- External URLs always as `[display text](https://url)` — never bare URLs
- Use `###` for subsections within a `##` section
- Lists for parallel items (data sources, features, stack components)
- "The Stack" is always the last section
- Tone: technical but casual — late-night dev energy is appropriate

---

## Prompt to use

> I'd like to write a blog post about [project name].
> Here's the context: [your notes]
> Please follow the blog post workflow.
