import './App.css'
import portfolioPic1 from './assets/portfolio_pic_1.jpg'
import portfolioPic2 from './assets/portfolio_pic_2.jpg'
import portfolioPic3 from './assets/portfolio_pic_3.jpg'
import portfolioPic4 from './assets/portfolio_pic_4.jpg'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-text">
              <span className="logo-top">Soft Halo</span>
              <span className="logo-bottom">STUDIO</span>
            </div>
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      <main className="hero" id="home">
        <div className="hero-container">
          <div className="hero-logo">
            <img src="/Soft_Halo_Studio_T.png" alt="Soft Halo Studio" />
          </div>
          <div className="hero-content">
            <h1 className="hero-title">Capturing Moments<br />Creating Memories</h1>
            <p className="hero-subtitle">
              Professional Photography & Videography Services
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">View Portfolio</button>
              <button className="btn btn-secondary">Get in Touch</button>
            </div>
          </div>
        </div>
      </main>

      <section className="events-section">
        <div className="events-container">
          <h2 className="events-title">We Do All Events</h2>
          <p className="events-subtitle">From intimate gatherings to grand celebrations, we capture every moment</p>
          <div className="events-grid">
            <div className="event-card">Birthday Parties</div>
            <div className="event-card">Sports Events</div>
            <div className="event-card">Baby Showers</div>
            <div className="event-card">Family Reunions</div>
            <div className="event-card">Community Festivals</div>
            <div className="event-card">Engagement Shoots</div>
            <div className="event-card">Weddings</div>
            <div className="event-card">Concerts</div>
            <div className="event-card">Graduations</div>
            <div className="event-card">Youth Events</div>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-container">
          <h2 className="portfolio-title">Our Work</h2>
          <div className="portfolio-carousel">
            <div className="portfolio-track">
              <div className="portfolio-item">
                <img src={portfolioPic1} alt="Portfolio 1" />
              </div>
              <div className="portfolio-item">
                <img src={portfolioPic2} alt="Portfolio 2" />
              </div>
              <div className="portfolio-item">
                <img src={portfolioPic3} alt="Portfolio 3" />
              </div>
              <div className="portfolio-item">
                <img src={portfolioPic4} alt="Portfolio 4" />
              </div>
              <div className="portfolio-item">
                <img src={portfolioPic1} alt="Portfolio 1" />
              </div>
              <div className="portfolio-item">
                <img src={portfolioPic2} alt="Portfolio 2" />
              </div>
              <div className="portfolio-item">
                <img src={portfolioPic3} alt="Portfolio 3" />
              </div>
              <div className="portfolio-item">
                <img src={portfolioPic4} alt="Portfolio 4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Soft Halo Studio</h3>
            <p>Elevating your vision through the art of photography and videography.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Based in Atlanta, Georgia</p>
            <p>Email: softhalostudio@gmail.com</p>
            <p>Phone: (516) 864-9861</p>
            <p className="instagram-link">
              <a href="https://instagram.com/softhalo5" target="_blank" rel="noopener noreferrer">
                <svg className="instagram-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @softhalo5
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Soft Halo Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
