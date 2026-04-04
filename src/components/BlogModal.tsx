import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { blogPosts } from '../data/blogPosts';
import './BlogModal.css';

interface BlogPost {
  filename: string;
  slug: string;
  title: string;
}

interface BlogModalProps {
  onClose: () => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ onClose }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [postContent, setPostContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPost) {
          setSelectedPost(null);
          setPostContent('');
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, selectedPost]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const loadPost = async (post: BlogPost) => {
    setIsLoading(true);
    setSelectedPost(post);
    try {
      const response = await fetch(`/blog/${post.filename}`);
      const markdown = await response.text();
      const html = marked.parse(markdown) as string;
      setPostContent(html);
    } catch {
      setPostContent('<p>Failed to load post.</p>');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedPost(null);
    setPostContent('');
  };

  return (
    <div className="blog-modal-backdrop" onClick={handleBackdropClick}>
      <div className="blog-modal-content">
        <div className="blog-modal-static"></div>
        <div className="blog-modal-scanlines"></div>

        <button className="blog-modal-close" onClick={onClose}>×</button>

        <div className="blog-modal-header">
          {selectedPost ? (
            <div className="blog-modal-header-row">
              <button className="blog-back-btn" onClick={handleBack}>
                ◀ BACK
              </button>
              <h1 className="blog-modal-title">{selectedPost.title}</h1>
            </div>
          ) : (
            <h1 className="blog-modal-title">◼ BLOG</h1>
          )}
        </div>

        <div className="blog-modal-body">
          {selectedPost ? (
            isLoading ? (
              <div className="blog-loading">LOADING...</div>
            ) : (
              <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: postContent }}
              />
            )
          ) : (
            <ul className="blog-post-list">
              {blogPosts.map((post, index) => (
                <li key={post.slug} className="blog-post-item">
                  <button
                    className="blog-post-row"
                    onClick={() => loadPost(post)}
                  >
                    <span className="blog-post-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="blog-post-title">{post.title}</span>
                    <span className="blog-post-arrow">▶</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
