import React, { useState, useEffect, useRef } from 'react';
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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Clean up auto-close timer on unmount
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Encode form data for Netlify
      const encode = (data: {[key: string]: string}) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
          .join("&");
      };

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'contact',
          'name': formData.name,
          'email': formData.email,
          'message': formData.message
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setValidationErrors({});

        // Auto-close after success with proper cleanup
        autoCloseTimerRef.current = setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(`Form submission failed with status: ${response.status}`);
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');

      // More specific error handling could be added here
      // For example, network errors vs server errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - could show different message
        console.error('Network error during form submission');
      }
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
            <form
              onSubmit={handleSubmit}
              className="contact-form"
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
            >
              {/* Netlify form detection */}
              <input type="hidden" name="form-name" value="contact" />

              {/* Honeypot field for spam protection */}
              <div style={{ display: 'none' }}>
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>

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
                  className={validationErrors.name ? 'error' : ''}
                />
                {validationErrors.name && <span className="validation-error">{validationErrors.name}</span>}
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
                  className={validationErrors.email ? 'error' : ''}
                />
                {validationErrors.email && <span className="validation-error">{validationErrors.email}</span>}
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
                  className={validationErrors.message ? 'error' : ''}
                />
                {validationErrors.message && <span className="validation-error">{validationErrors.message}</span>}
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