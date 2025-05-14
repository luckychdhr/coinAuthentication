import { useEffect, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import Button from '../components/common/Button'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const Contact = () => {
  useEffect(() => {
    document.title = 'Contact Us - Coinauthenticator'
  }, [])

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    }, 1500)
  }

  const pageAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
    config: { tension: 300, friction: 20 }
  })

  return (
    <main className="contact-page">
      <animated.div style={pageAnimation} className="page-header">
        <h1>Contact Us</h1>
        <p className="page-subtitle">
          Have questions or need assistance? We're here to help!
        </p>
      </animated.div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-method">
            <div className="contact-icon">
              <FaEnvelope />
            </div>
            <div className="contact-details">
              <h3>Email Us</h3>
              <p>support@coinauthenticator.com</p>
              <p>We typically respond within 24 hours</p>
            </div>
          </div>
          
          <div className="contact-method">
            <div className="contact-icon">
              <FaPhoneAlt />
            </div>
            <div className="contact-details">
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
              <p>Available 9am-5pm EST, Mon-Fri</p>
            </div>
          </div>
          
          <div className="contact-method">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="contact-details">
              <h3>Visit Us</h3>
              <p>123 Blockchain Avenue</p>
              <p>Crypto District, NY 10001</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          
          {submitted ? (
            <div className="form-success">
              <div className="success-icon">✓</div>
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. We'll get back to you shortly.</p>
              <Button 
                label="Send Another Message" 
                variant="outline" 
                onClick={() => setSubmitted(false)} 
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="form-control"
                  required
                ></textarea>
              </div>
              
              <Button
                label={isSubmitting ? "Sending..." : "Send Message"}
                variant="primary"
                size="large"
                type="submit"
                fullWidth
                disabled={isSubmitting}
              />
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

export default Contact