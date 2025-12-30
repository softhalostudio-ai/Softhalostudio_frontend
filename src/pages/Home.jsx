import { Link } from 'react-router-dom'
import portfolioPic1 from '../assets/portfolio_pic_1.jpg'
import portfolioPic2 from '../assets/portfolio_pic_2.jpg'
import portfolioPic3 from '../assets/portfolio_pic_3.jpg'
import portfolioPic4 from '../assets/portfolio_pic_4.jpg'

function Home() {
  return (
    <>
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
              <Link to="/portfolio" className="btn btn-primary">View Portfolio</Link>
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
    </>
  )
}

export default Home
