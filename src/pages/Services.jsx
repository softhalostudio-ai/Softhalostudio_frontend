import { Link } from 'react-router-dom'

function Services() {
  const services = [
    {
      id: 1,
      title: 'Event Photography',
      serviceValue: 'event-photography',
      description: 'Professional coverage of your special events, from intimate gatherings to large celebrations.',
      features: [
        'Full event coverage',
        'High-resolution digital images',
        'Online gallery delivery',
        'Professional editing'
      ]
    },
    {
      id: 2,
      title: 'Event Videography',
      serviceValue: 'event-videography',
      description: 'Cinematic video production that captures the emotion and energy of your event.',
      features: [
        'Multi-camera coverage',
        '4K video quality',
        'Professional audio',
        'Same-day highlights available'
      ]
    },
    {
      id: 3,
      title: 'Wedding Packages',
      serviceValue: 'wedding',
      description: 'Complete photo and video packages tailored for your wedding day.',
      features: [
        'Full day coverage',
        'Engagement shoot included',
        'Drone footage available',
        'Custom wedding album'
      ]
    },
    {
      id: 4,
      title: 'Sports Photography',
      serviceValue: 'sports',
      description: 'Action-packed sports photography capturing every winning moment.',
      features: [
        'Fast action shots',
        'Team and individual photos',
        'Tournament coverage',
        'Quick turnaround time'
      ]
    },
    {
      id: 5,
      title: 'Corporate Events',
      serviceValue: 'corporate',
      description: 'Professional documentation of conferences, meetings, and corporate gatherings.',
      features: [
        'Conference coverage',
        'Headshot sessions',
        'Brand-focused content',
        'Marketing materials'
      ]
    },
    {
      id: 6,
      title: 'Custom Packages',
      serviceValue: 'custom',
      description: 'Tailored solutions designed specifically for your unique needs.',
      features: [
        'Flexible scheduling',
        'Personalized approach',
        'Multiple format delivery',
        'Consultation included'
      ]
    }
  ]

  return (
    <div className="services-page">
      <div className="services-header">
        <h1 className="services-page-title">Our Services</h1>
        <p className="services-page-subtitle">Professional photography and videography tailored to your needs</p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <div className="service-content">
              <h2 className="service-title">{service.title}</h2>
              <p className="service-description">{service.description}</p>
              <ul className="service-features">
                {service.features.map((feature, index) => (
                  <li key={index}>
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={`/contact?service=${service.serviceValue}`} className="service-btn">
                Get Quote
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="services-cta">
        <h2>Ready to Work Together?</h2>
        <p>Contact us today to discuss your project and get a custom quote</p>
        <Link to="/contact" className="cta-button">Contact Us</Link>
      </div>
    </div>
  )
}

export default Services
