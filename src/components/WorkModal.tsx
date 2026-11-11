import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  profile,
  fullstory,
  personalProjects,
  earlierRoles,
  PortfolioItem,
  PortfolioLink,
} from '../data/portfolio';
import './WorkModal.css';

interface WorkModalProps {
  onClose: () => void;
}

const isInternal = (url: string) => url.startsWith('/');

const LinkList: React.FC<{ links?: PortfolioLink[] }> = ({ links }) => {
  if (!links || links.length === 0) return null;
  return (
    <div className="work-links">
      {links.map((link) => (
        <a
          key={link.url}
          className="work-link"
          href={link.url}
          target={isInternal(link.url) ? undefined : '_blank'}
          rel={isInternal(link.url) ? undefined : 'noopener noreferrer'}
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  );
};

const Tags: React.FC<{ tags?: string[] }> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;
  return (
    <ul className="work-tags" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag} className="work-tag">{tag}</li>
      ))}
    </ul>
  );
};

const ItemCard: React.FC<{ item: PortfolioItem }> = ({ item }) => (
  <article className="work-card">
    <h4 className="work-card-title">{item.title}</h4>
    <p className="work-card-summary">{item.summary}</p>
    <Tags tags={item.tags} />
    <LinkList links={item.links} />
  </article>
);

const WorkModal: React.FC<WorkModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reflect the panel in the URL so /work can be shared directly
  useEffect(() => {
    navigate('/work', { replace: true });
    closeButtonRef.current?.focus();
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    navigate('/');
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const description = `${profile.name}, ${profile.role}. ${profile.headline}`;

  return (
    <>
      <Helmet>
        <title>Work — corymcdaniel.com</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${profile.name} — Work`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
      </Helmet>

      <div className="work-modal-backdrop" onClick={handleBackdropClick}>
        <div
          className="work-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-modal-title"
        >
          <div className="work-modal-scanlines" aria-hidden="true"></div>

          <header className="work-modal-header">
            <span className="work-modal-channel" aria-hidden="true">CH 04</span>
            <h1 id="work-modal-title" className="work-modal-title">WORK</h1>
            <button
              ref={closeButtonRef}
              className="work-modal-close"
              onClick={handleClose}
              aria-label="Close work panel"
            >×</button>
          </header>

          <div className="work-modal-body">
            <section className="work-intro">
              <h2 className="work-name">{profile.name}</h2>
              <p className="work-role">{profile.role} · {profile.location}</p>
              <p className="work-headline">{profile.headline}</p>
              <LinkList links={profile.links} />
            </section>

            <section className="work-section work-section--featured" aria-labelledby="work-current">
              <div className="work-section-head">
                <h3 id="work-current" className="work-section-title">
                  {fullstory.title}, {fullstory.company}
                </h3>
                <span className="work-section-meta">{fullstory.dates}</span>
              </div>
              <p className="work-period">{fullstory.period}</p>
              <p className="work-lede">{fullstory.summary}</p>

              <dl className="work-stats">
                {fullstory.stats.map((stat) => (
                  <div key={stat.label} className="work-stat">
                    <dt className="work-stat-label">{stat.label}</dt>
                    <dd className="work-stat-value">{stat.value}</dd>
                  </div>
                ))}
              </dl>

              {fullstory.groups.map((group) => (
                <div key={group.heading} className="work-group">
                  <h4 className="work-group-title">{group.heading}</h4>
                  {group.intro && <p className="work-group-intro">{group.intro}</p>}
                  <div className="work-grid">
                    {group.items.map((item) => (
                      <ItemCard key={item.title} item={item} />
                    ))}
                  </div>
                </div>
              ))}

              <div className="work-group">
                <h4 className="work-group-title">How I work with AI</h4>
                <ul className="work-approach">
                  {fullstory.approach.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="work-section" aria-labelledby="work-personal">
              <div className="work-section-head">
                <h3 id="work-personal" className="work-section-title">Built on my own time, with Claude</h3>
              </div>
              <div className="work-grid">
                {personalProjects.map((item) => (
                  <ItemCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <section className="work-section" aria-labelledby="work-earlier">
              <div className="work-section-head">
                <h3 id="work-earlier" className="work-section-title">Before that</h3>
              </div>
              <ol className="work-timeline">
                {earlierRoles.map((role) => (
                  <li key={`${role.company}-${role.title}`} className="work-timeline-row">
                    <span className="work-timeline-dates">{role.dates}</span>
                    <span className="work-timeline-company">{role.company}</span>
                    <span className="work-timeline-title">{role.title}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkModal;
