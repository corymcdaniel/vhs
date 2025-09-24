import React, { useState, useEffect } from 'react';
import { loadAboutPost } from '../utils/markdownLoader';

interface AboutContentProps {
  onVideoClick: (videoId: string) => void;
}

const AboutContent: React.FC<AboutContentProps> = ({ onVideoClick }) => {
  const [blogContent, setBlogContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const post = await loadAboutPost(onVideoClick);
        setBlogContent(post.content);
      } catch (error) {
        console.error('Failed to load about content:', error);
        setBlogContent('<p>Failed to load about content.</p>');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [onVideoClick]);

  useEffect(() => {
    // Add click handlers to video buttons after content is loaded
    const handleVideoButtonClick = (event: Event) => {
      const target = event.target as HTMLButtonElement;
      if (target.classList.contains('escapism-link')) {
        const videoId = target.getAttribute('data-video-id');
        if (videoId) {
          onVideoClick(videoId);
        }
      }
    };

    document.addEventListener('click', handleVideoButtonClick);
    return () => {
      document.removeEventListener('click', handleVideoButtonClick);
    };
  }, [onVideoClick, blogContent]);

  if (isLoading) {
    return <p>Loading content...</p>;
  }

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: blogContent }}
    />
  );
};

export default AboutContent;