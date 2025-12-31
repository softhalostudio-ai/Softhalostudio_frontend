import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              <div className="logo-text">
                <span className="logo-top">Soft Halo</span>
                <span className="logo-bottom">STUDIO</span>
              </div>
            </Link>
            <ul className="nav-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Soft Halo Studio</h3>
              <p>Elevating your vision through the art of photography and videography.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/portfolio">Portfolio</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
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
      </Router>
    </AuthProvider>
  )
}

export default App
