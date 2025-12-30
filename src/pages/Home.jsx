import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const API_URL = `${import.meta.env.VITE_API_URL}/images`;

function Home() {
  const [landingImages, setLandingImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLandingImages();
  }, []);

  const fetchLandingImages = async () => {
    try {
      const response = await fetch(`${API_URL}?category=landing_page`);
      const data = await response.json();

      if (data.success && data.images.length > 0) {
        setLandingImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Duplicate images for infinite scroll effect
  const carouselImages = landingImages.length > 0
    ? [...landingImages, ...landingImages]
    : [];

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
              <Link to="/contact" className="btn btn-secondary">Get in Touch</Link>
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
          {loading ? (
            <div className="loading">Loading images...</div>
          ) : landingImages.length === 0 ? (
            <div className="empty-state">
              <p>No images available. Upload images from the admin panel.</p>
            </div>
          ) : (
            <div className="portfolio-carousel">
              <div className="portfolio-track">
                {carouselImages.map((image, index) => (
                  <div key={index} className="portfolio-item">
                    <img src={image.url} alt={image.title || `Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Home
