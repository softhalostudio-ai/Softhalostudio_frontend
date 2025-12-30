import { useState, useEffect } from 'react'

const API_URL = `${import.meta.env.VITE_API_URL}/images`;

function Portfolio() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [portfolioImages, setPortfolioImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolioImages();
  }, []);

  const fetchPortfolioImages = async () => {
    try {
      const response = await fetch(`${API_URL}?category=portfolio`);
      const data = await response.json();

      if (data.success && data.images.length > 0) {
        setPortfolioImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h1 className="portfolio-page-title">Our Portfolio</h1>
        <p className="portfolio-page-subtitle">Capturing life's most precious moments</p>
      </div>

      {loading ? (
        <div className="loading">Loading portfolio...</div>
      ) : portfolioImages.length === 0 ? (
        <div className="empty-state">
          <p>No portfolio images available. Upload images from the admin panel.</p>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolioImages.map((image) => (
            <div
              key={image.id}
              className="portfolio-grid-item"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.url} alt={image.title || 'Portfolio image'} />
              <div className="portfolio-overlay">
                <h3>{image.title || 'Untitled'}</h3>
                <p>{image.description || 'Portfolio'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img src={selectedImage.url} alt={selectedImage.title || 'Portfolio image'} />
            <div className="lightbox-info">
              <h3>{selectedImage.title || 'Untitled'}</h3>
              <p>{selectedImage.description || 'Portfolio'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio
