import { useState } from 'react'
import portfolioPic1 from '../assets/portfolio_pic_1.jpg'
import portfolioPic2 from '../assets/portfolio_pic_2.jpg'
import portfolioPic3 from '../assets/portfolio_pic_3.jpg'
import portfolioPic4 from '../assets/portfolio_pic_4.jpg'

function Portfolio() {
  const [selectedImage, setSelectedImage] = useState(null)

  const portfolioImages = [
    { id: 1, src: portfolioPic1, title: 'Event Photography 1', category: 'Events' },
    { id: 2, src: portfolioPic2, title: 'Event Photography 2', category: 'Events' },
    { id: 3, src: portfolioPic3, title: 'Event Photography 3', category: 'Events' },
    { id: 4, src: portfolioPic4, title: 'Event Photography 4', category: 'Events' },
  ]

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h1 className="portfolio-page-title">Our Portfolio</h1>
        <p className="portfolio-page-subtitle">Capturing life's most precious moments</p>
      </div>

      <div className="portfolio-grid">
        {portfolioImages.map((image) => (
          <div
            key={image.id}
            className="portfolio-grid-item"
            onClick={() => setSelectedImage(image)}
          >
            <img src={image.src} alt={image.title} />
            <div className="portfolio-overlay">
              <h3>{image.title}</h3>
              <p>{image.category}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.title} />
            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio
