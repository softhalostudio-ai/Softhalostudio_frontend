import { useState } from 'react'

const API_URL = `${import.meta.env.VITE_API_URL}/contact`;

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage({ text: '', type: '' })

    console.log('Submitting to:', `${API_URL}/submit`)
    console.log('Form data:', formData)

    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setSubmitMessage({
          text: 'SUCCESS! Your message has been sent. We will get back to you soon!',
          type: 'success'
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        })
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitMessage({ text: '', type: '' })
        }, 5000)
      } else {
        setSubmitMessage({
          text: data.error || 'Failed to send message. Please try again.',
          type: 'error'
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage({
        text: `Failed to send message: ${error.message}. Please try again later.`,
        type: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-page-title">GET IN TOUCH</h1>
        <p className="contact-page-subtitle">Let's bring your vision to life</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-section">
            <h2>Contact Information</h2>
            <div className="info-item">
              <h3>Location</h3>
              <p>Atlanta, Georgia</p>
            </div>
            <div className="info-item">
              <h3>Email</h3>
              <p>softhalostudio@gmail.com</p>
            </div>
            <div className="info-item">
              <h3>Phone</h3>
              <p>(516) 864-9861</p>
            </div>
            <div className="info-item">
              <h3>Instagram</h3>
              <p>@softhalo5</p>
            </div>
          </div>

          <div className="info-section">
            <h2>Business Hours</h2>
            <div className="info-item">
              <p>Monday - Friday: 9am - 6pm</p>
              <p>Saturday: 10am - 4pm</p>
              <p>Sunday: By Appointment</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {submitMessage.text && (
            <div className={`form-message ${submitMessage.type}`}>
              {submitMessage.text}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Interested In</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">Select a service</option>
              <option value="event-photography">Event Photography</option>
              <option value="event-videography">Event Videography</option>
              <option value="wedding">Wedding Package</option>
              <option value="sports">Sports Photography</option>
              <option value="corporate">Corporate Events</option>
              <option value="custom">Custom Package</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Contact
