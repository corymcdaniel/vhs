import React, { useState, useEffect } from 'react';
import './ContactModal.css';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with actual form submission endpoint
    try {
      console.log('Form submission:', formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-modal" onClick={handleBackdropClick}>
      <div className="contact-modal-content">
        <div className="contact-modal-static"></div>
        <div className="contact-modal-scanlines"></div>

        <button className="contact-modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="contact-modal-header">
          <span className="contact-title">CONTACT</span>
          <span className="contact-modal-timestamp">MSG 02:15:30</span>
        </div>

        <div className="contact-modal-body">
          {submitStatus === 'success' ? (
            <div className="contact-success">
              <div className="success-message">MESSAGE TRANSMITTED</div>
              <div className="success-subtitle">Thanks for reaching out!</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">NAME:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">MESSAGE:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
              </button>

              {submitStatus === 'error' && (
                <div className="contact-error">
                  TRANSMISSION ERROR - PLEASE TRY AGAIN
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;