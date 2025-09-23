# VHS Terminal Blog System - Markdown Guide

## Overview
This guide shows how to create blog posts using pure Markdown files for your VHS-themed portfolio. No external dependencies - just Markdown files that get parsed and displayed in a retro terminal interface.

## File Structure
```
src/
├── blog/
│   ├── posts/
│   │   ├── index.js                    // Post registry
│   │   ├── 2025-09-23-hello-world.md  // Blog posts
│   │   ├── 2025-09-20-photography.md
│   │   └── 2025-09-15-ai-coding.md
│   ├── components/
│   │   ├── BlogTerminal.tsx           // VHS blog interface
│   │   ├── BlogPost.tsx               // Single post viewer
│   │   └── BlogList.tsx               // Post listing
│   └── utils/
│       ├── markdownParser.js          // Simple MD parser
│       └── blogUtils.js               // Post utilities
```

## Creating a Blog Post

### 1. Create Markdown File
**File name format**: `YYYY-MM-DD-slug.md`

Example: `2025-09-23-building-vhs-portfolio.md`

### 2. Frontmatter Format
Every post starts with YAML frontmatter:

```markdown
---
title: "Building a VHS Portfolio with React"
date: "2025-09-23"
tags: ["react", "design", "vhs", "portfolio"]
excerpt: "How I built a retro terminal-style portfolio using React and CSS animations"
author: "Cory McDaniel"
slug: "building-vhs-portfolio"
published: true
---

# Building a VHS Portfolio with React

Your content starts here...
```

### 3. Supported Markdown

#### Headers
```markdown
# H1 - Main Title
## H2 - Section Header
### H3 - Subsection
#### H4 - Minor Header
```

#### Text Formatting
```markdown
**Bold text**
*Italic text*
`Inline code`
~~Strikethrough~~
```

#### Lists
```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another numbered item
```

#### Links and Images
```markdown
[Link text](https://example.com)
![Alt text](/path/to/image.jpg)
```

#### Code Blocks
```markdown
```javascript
const hello = () => {
  console.log("Hello VHS world!");
};
```
```

#### Blockquotes
```markdown
> This is a quote that will be styled
> in the VHS terminal theme
```

#### Horizontal Rules
```markdown
---
```

## Post Registry (index.js)

Create `/src/blog/posts/index.js`:

```javascript
// Blog post registry - add new posts here
export const blogPosts = [
  {
    id: '003',
    slug: 'building-vhs-portfolio',
    file: () => import('./2025-09-23-building-vhs-portfolio.md'),
    featured: true
  },
  {
    id: '002',
    slug: 'photography-journey',
    file: () => import('./2025-09-20-photography.md'),
    featured: false
  },
  {
    id: '001',
    slug: 'hello-world',
    file: () => import('./2025-09-15-hello-world.md'),
    featured: false
  }
];

// Helper functions
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured);
export const getPostBySlug = (slug) => blogPosts.find(post => post.slug === slug);
export const getAllPosts = () => blogPosts.sort((a, b) => b.id.localeCompare(a.id));
```

## VHS Terminal Display

### Blog Terminal Interface
The blog will display in VHS terminal style:

```
████ VHS BLOG TERMINAL ████████████████████████████████████
█                                                         █
█ > list_posts                                            █
█                                                         █
█ [001] 2025-09-23 | Building a VHS Portfolio            █
█ [002] 2025-09-20 | Photography Journey                 █
█ [003] 2025-09-15 | Hello World                         █
█                                                         █
█ > read_post 001                                         █
█                                                         █
█ Loading post... ▌                                      █
█                                                         █
█████████████████████████████████████████████████████████
```

### Post Display Features
- **Terminal-style navigation**: `> next_post`, `> prev_post`, `> back_to_list`
- **VHS effects**: Scan lines, static, green terminal text
- **Typewriter text**: Posts can type out character by character
- **Navigation breadcrumbs**: Show current position in blog
- **Tag filtering**: Filter posts by tags in terminal style

## Adding New Posts Workflow

### 1. Write Post
```bash
# Create new markdown file
touch src/blog/posts/2025-09-24-new-post.md
```

### 2. Add Frontmatter
```markdown
---
title: "My New Post"
date: "2025-09-24"
tags: ["coding", "react"]
excerpt: "Brief description of the post"
slug: "new-post"
published: true
---

# Your post content here
```

### 3. Register Post
Add to `src/blog/posts/index.js`:
```javascript
{
  id: '004',
  slug: 'new-post',
  file: () => import('./2025-09-24-new-post.md'),
  featured: false
}
```

### 4. Test
- Start dev server: `npm start`
- Navigate to blog section
- Verify post appears and renders correctly

## VHS Blog Navigation

### Main Navigation
Add "BLOG" button to main VHS interface navigation bar.

### Terminal Commands
```
> list_posts           // Show all posts
> read_post <slug>     // Read specific post
> filter_by_tag <tag>  // Filter by tag
> search <term>        // Search posts
> recent              // Show recent posts
> featured            // Show featured posts
> back                // Return to main site
```

### Keyboard Shortcuts
- `B` - Open blog terminal
- `ESC` - Return to post list
- `←/→` - Navigate between posts
- `R` - Refresh/reload current post

## Styling Guidelines

### Terminal Theme
- **Background**: Black with green text (`#00ff00`)
- **Font**: `'VT323', monospace`
- **Effects**: Scan lines, static overlay, CRT glow
- **Animations**: Typewriter effect, cursor blink

### Post Content Styling
- **Headers**: Green with terminal-style underlines
- **Code blocks**: Darker background with syntax highlighting
- **Links**: Bright green with terminal-style hover effects
- **Images**: Retro CRT-style border and glow effects

## Implementation Notes

### Markdown Parser
Simple, lightweight parser without external dependencies:
- Regex-based transformation
- Handles basic markdown syntax
- Outputs HTML with VHS-styled classes
- ~50 lines of code

### Performance
- Posts loaded on-demand (dynamic imports)
- Image lazy loading
- Minimal bundle impact
- Fast navigation between posts

### SEO Considerations
- Extract frontmatter for meta tags
- Generate post URLs: `/blog/post-slug`
- Sitemap generation from post registry
- Social media meta tags

## Example Blog Post

```markdown
---
title: "How I Built This VHS Portfolio"
date: "2025-09-23"
tags: ["react", "css", "design", "portfolio"]
excerpt: "A deep dive into creating a retro VHS-themed portfolio with modern web technologies"
slug: "building-vhs-portfolio"
published: true
featured: true
---

# How I Built This VHS Portfolio

## The Inspiration

I wanted to create something that felt like the old terminal interfaces I grew up with...

## Technical Decisions

### React + CSS Animations
- Used React for component structure
- Pure CSS for VHS effects
- No external animation libraries

### VHS Effects Implementation
The scan lines are created using CSS gradients:

```css
.vhs-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
}
```

## Photography Integration

The background images cycle every 10 seconds, showcasing my photography work while maintaining the retro aesthetic.

---

*This post was written in Markdown and rendered in the VHS terminal.*
```

---

## Next Steps
1. Implement the markdown parser
2. Create VHS-styled blog components
3. Add blog navigation to main interface
4. Create sample blog posts
5. Test terminal-style post navigation

**Ready to start building the VHS blog terminal!**