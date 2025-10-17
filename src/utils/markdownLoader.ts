import { marked } from 'marked';

interface BlogPost {
  title: string;
  content: string;
  videoLinks?: Array<{
    text: string;
    videoId: string;
  }>;
}

// List of possible escapism video IDs to randomly choose from
const ESCAPISM_VIDEO_IDS = [
  'x9yp2wVWdiU', // Nine is god
  '7XDU7Y-HbzE', // Cherry Blossom Girl

];

// Function to get a random video ID
const getRandomEscapismVideoId = (): string => {
  const randomIndex = Math.floor(Math.random() * ESCAPISM_VIDEO_IDS.length);
  return ESCAPISM_VIDEO_IDS[randomIndex];
};

export const loadAboutPost = async (onVideoClick: (videoId: string) => void): Promise<BlogPost> => {
  try {
    // Fetch the markdown file from public folder
    const response = await fetch('/blog/0001.md');
    let markdownContent = await response.text();

    // Replace the escapism video ID with a random one from the list
    const randomVideoId = getRandomEscapismVideoId();
    const videoIdPattern = /\[escapism\]\([a-zA-Z0-9_-]{11}\)/;
    markdownContent = markdownContent.replace(videoIdPattern, `[escapism](${randomVideoId})`);

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
      const [, linkText, videoId] = match;
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
