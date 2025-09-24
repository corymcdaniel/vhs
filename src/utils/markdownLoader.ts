import { marked } from 'marked';

interface BlogPost {
  title: string;
  content: string;
  videoLinks?: Array<{
    text: string;
    videoId: string;
  }>;
}

export const loadAboutPost = async (onVideoClick: (videoId: string) => void): Promise<BlogPost> => {
  try {
    // Fetch the markdown file from public folder
    const response = await fetch('/blog/0001.md');
    const markdownContent = await response.text();

    // Parse the markdown content
    let htmlContent = marked.parse(markdownContent) as string;

    // Extract title from first h1 tag
    const titleMatch = markdownContent.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'About This Website';

    // Find video links and replace them with buttons
    const videoLinks: Array<{text: string; videoId: string}> = [];
    const videoLinkRegex = /\[([^\]]+)\]\(([a-zA-Z0-9_-]{11})\)/g;
    let match;

    while ((match = videoLinkRegex.exec(markdownContent)) !== null) {
      const [fullMatch, linkText, videoId] = match;
      videoLinks.push({ text: linkText, videoId });

      // Replace the markdown link with a button placeholder
      htmlContent = htmlContent.replace(
        new RegExp(`<a[^>]*>${linkText}</a>`),
        `<button class="escapism-link" data-video-id="${videoId}">${linkText}</button>`
      );
    }

    // Add click handlers to video buttons
    if (videoLinks.length > 0) {
      // This will be handled in the component
    }

    return {
      title,
      content: htmlContent,
      videoLinks
    };
  } catch (error) {
    console.error('Failed to load blog post:', error);
    // Fallback to hardcoded content
    return {
      title: 'About This Website',
      content: '<p>Failed to load about content.</p>',
      videoLinks: []
    };
  }
};