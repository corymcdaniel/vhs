import React, { useEffect, useState } from 'react';
import './AboutModal.css';
import VideoModal from './VideoModal';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="about-modal-backdrop" onClick={handleBackdropClick}>
      <div className="about-modal-content">
        <div className="about-modal-static"></div>
        <div className="about-modal-scanlines"></div>

        <button className="about-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="about-modal-header">
          <h1 className="about-title">WHY I BUILT THIS WEBSITE</h1>
        </div>

        <div className="about-modal-body">
          <div className="blog-content">
            <h2>The hell is this?</h2>
            <p>
              An experiment in UI, UX, and{' '}
              <button
                className="escapism-link"
                onClick={() => setShowVideoModal(true)}
                title="Click to experience"
              >
                escapism (I keep telling myself)
              </button>{' '}
              with code and the influence of AI in my field.
            </p>

            <h2>AI: The juice</h2>
            <p className={'claude-pop'}>
              This isn't just a nostalgic skin slapped onto a modern portfolio. Every
              element was carefully crafted to recreate the authentic feel of analog
              technology - from the deliberate scan lines to the way text appears
              character by character, mimicking the way old terminals would display text.
            </p>

            <p>^^ That's what Claude figured.  My take is more just missing older sites
            before they were conglomerated and corp'd. And this site isn't a great mimic, but
            at least reminiscent. Partial DOS, partial Geocities, partial choosing between using
            the family computer or watching TV at 480p</p>

            <h2>Photography Meets Code</h2>
            <p className={'claude-pop'}>
              As both a developer and photographer, I wanted to showcase my work in a way
              that honored both disciplines. The VHS aesthetic bridges the gap between
              the digital and analog worlds, much like how my career spans both technical
              problem-solving and creative visual storytelling.
            </p>
            <p>Claude said that ^^ but meh, it wasn't too far off I guess.</p>

            <h2>Technical Decisions</h2>
            <p>
              Not AI: I wanted to experience what AI can do in my field. I basically directed
              the whole thing, the only code I have added was to get it hosted and like 2 style pieces
              that didn't translate word-wise.
            </p>
            <p>
              It has been really interesting. Maybe the "VHS Aesthetic" was easy to do but not
              what I have to build for actual companies.  The code is at best kind of okay.  But
              it still feels like I'm just getting an improved Dreamweaver experience that would
              in no way be maintainable as an actual site for real things.
            </p>


            <h2>A Love Letter to the Past</h2>
            <p className={'claude-pop'}>
              This website is my tribute to an era when technology felt magical because
              you could see and hear it working. When loading meant something was actually
              happening, not just an artificial delay to make you think the system was busy.
            </p>
          <p>Pretty true, Claude, 28k baud made you appreciate things more. So did DOS I guess.
          But that wasn't really the point, it was only an UI direction I wanted to explore.</p>

            <p className="closing-note">
              <em>
                Every glitch is intentional. Every scan line has purpose. Every moment
                of loading time is designed to make you pause and appreciate the craft
                behind both the medium and the message.
              </em>
              <p>Claude, my builder in this, you make it sound more important than it is.
              I just have had a skill that you're making me have to figure out again.  But I
              hope that anyone who visits this page of mine can at least appreciate my photography.</p>
            </p>

            <div className="signature">
              <span>— Cory McDaniel</span>
              <span className="date">Phoenix, Arizona • 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <VideoModal
          videoId="x9yp2wVWdiU"
          title="Escapism"
          onClose={() => setShowVideoModal(false)}
        />
      )}
    </div>
  );
};

export default AboutModal;
