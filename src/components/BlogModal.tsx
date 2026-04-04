import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { marked } from 'marked';
import { blogPosts } from '../data/blogPosts';
import './BlogModal.css';

// Open all links in new tab so react-router doesn't intercept external URLs
marked.use({
  renderer: {
    link({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}" target="_blank" rel="noopener noreferrer"${titleAttr}>${text}</a>`;
    }
  }
});

interface BlogPost {
  filename: string;
  slug: string;
  title: string;
  description?: string;
}

interface BlogModalProps {
  onClose: () => void;
  initialSlug?: string | null;
}

const BlogModal: React.FC<BlogModalProps> = ({ onClose, initialSlug }) => {
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
    if (initialSlug) {
      return blogPosts.find((p) => p.slug === initialSlug) || null;
    }
    return null;
  });
  const [postContent, setPostContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [blurEnabled, setBlurEnabled] = useState(false);

  // Load post content when selectedPost changes
  useEffect(() => {
    if (!selectedPost) {
      setPostContent('');
      return;
    }
    setIsLoading(true);
    fetch(`/blog/${selectedPost.filename}`)
      .then((res) => res.text())
      .then((markdown) => {
        setPostContent(marked.parse(markdown) as string);
      })
      .catch(() => {
        setPostContent('<p>Failed to load post.</p>');
      })
      .finally(() => setIsLoading(false));
  }, [selectedPost]);

  // Load initial post by slug if provided
  useEffect(() => {
    if (initialSlug) {
      navigate(`/blog/${initialSlug}`, { replace: true });
    } else {
      navigate('/blog', { replace: true });
    }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPost) {
          handleBack();
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    navigate(`/blog/${post.slug}`);
  };

  const handleBack = () => {
    setSelectedPost(null);
    setPostContent('');
    navigate('/blog');
  };

  const handleClose = () => {
    navigate('/');
    onClose();
  };

  const pageTitle = selectedPost
    ? `${selectedPost.title} — corymcdaniel.com`
    : 'Blog — corymcdaniel.com';

  const metaDescription = selectedPost?.description || 'Blog posts about AI experiments and development projects.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={selectedPost?.title || 'Blog'} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="blog-modal-backdrop" onClick={handleBackdropClick}>
        <div className="blog-modal-content">
          <div className="blog-modal-static"></div>
          <div className="blog-modal-scanlines"></div>

          <button className="blog-modal-close" onClick={handleClose}>×</button>

          <div className="blog-modal-header">
            {selectedPost ? (
              <div className="blog-modal-header-row">
                <button className="blog-back-btn" onClick={handleBack}>
                  ◀ BACK
                </button>
                <h1 className="blog-modal-title">{selectedPost.title}</h1>
                <button
                  className={`blog-blur-btn${blurEnabled ? ' blog-blur-btn--active' : ''}`}
                  onClick={() => setBlurEnabled(v => !v)}
                  title={blurEnabled ? 'Disable CRT glow' : 'Enable CRT glow'}
                >
                  {blurEnabled ? '◉ GLOW' : '◎ GLOW'}
                </button>
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
                  className={`blog-post-content${blurEnabled ? ' blog-post-content--glow' : ''}`}
                  dangerouslySetInnerHTML={{ __html: postContent }}
                />
              )
            ) : (
              <ul className="blog-post-list">
                {blogPosts.map((post, index) => (
                  <li key={post.slug} className="blog-post-item">
                    <button
                      className="blog-post-row"
                      onClick={() => handleSelectPost(post)}
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
    </>
  );
};

export default BlogModal;
