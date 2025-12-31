import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/images`;

export default function Admin() {
  const { getAuthHeader, logout } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    image: null,
    title: '',
    description: '',
    category: 'landing_page',
    displayOrder: 0
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    displayOrder: 0
  });

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [activeSection, setActiveSection] = useState('media'); // 'dashboard', 'media', or 'messages'
  const [activeTab, setActiveTab] = useState('landing_page'); // 'landing_page' or 'portfolio'
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (activeSection === 'messages') {
      fetchMessages();
    }
    if (activeSection === 'dashboard') {
      fetchAnalytics();
    }
  }, [activeSection]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/messages`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      showMessage('Failed to fetch messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/analytics/stats`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/messages`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact/messages`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        showMessage('Message deleted successfully', 'success');
        fetchMessages();
      } else {
        showMessage('Failed to delete message', 'error');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      showMessage('Failed to delete message', 'error');
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showMessage('Failed to fetch images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      showMessage('Please select an image', 'error');
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', formData.image);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('category', formData.category);
    uploadFormData.append('displayOrder', formData.displayOrder);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: uploadFormData
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Image uploaded successfully!', 'success');
        setFormData({
          image: null,
          title: '',
          description: '',
          category: 'landing_page',
          displayOrder: 0
        });
        document.getElementById('imageInput').value = '';
        fetchImages();
      } else {
        showMessage(data.error || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      console.log('Deleting image:', id);
      console.log('API URL:', `${API_URL}/${id}`);
      console.log('Auth headers:', getAuthHeader());

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);

      if (!response.ok) {
        const text = await response.text();
        console.error('Delete failed with status:', response.status, 'Body:', text);
        showMessage(`Delete failed: ${response.status} ${response.statusText}`, 'error');
        return;
      }

      const data = await response.json();

      if (data.success) {
        showMessage('Image deleted successfully', 'success');
        fetchImages();
      } else {
        showMessage(data.error || 'Delete failed', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('Failed to delete image: ' + error.message, 'error');
    }
  };

  const startEdit = (image) => {
    setEditingId(image.id);
    setEditData({
      title: image.title || '',
      description: image.description || '',
      category: image.category,
      displayOrder: image.displayOrder
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      title: '',
      description: '',
      category: '',
      displayOrder: 0
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Image updated successfully', 'success');
        setEditingId(null);
        fetchImages();
      } else {
        showMessage(data.error || 'Update failed', 'error');
      }
    } catch (error) {
      console.error('Update error:', error);
      showMessage('Failed to update image', 'error');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Soft Halo</h2>
          <span className="sidebar-subtitle">STUDIO</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>MENU</h3>
            <button
              className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Dashboard
            </button>
            <button
              className={`nav-item ${activeSection === 'media' ? 'active' : ''}`}
              onClick={() => setActiveSection('media')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              Media Library
            </button>
            <button
              className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveSection('messages')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
              </svg>
              Messages
              {messages.filter(m => !m.read).length > 0 && (
                <span className="message-badge">{messages.filter(m => !m.read).length}</span>
              )}
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => { logout(); navigate('/login'); }} className="sidebar-logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>{activeSection === 'dashboard' ? 'Dashboard' : activeSection === 'messages' ? 'Messages' : 'Media Management'}</h1>
            <p>{activeSection === 'dashboard' ? 'Overview of your content and statistics' : activeSection === 'messages' ? 'View and manage contact form submissions' : 'Upload and organize your portfolio images'}</p>
          </div>
          <div className="topbar-right">
            <div className="user-info">
              <div className="user-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div className="user-details">
                <span className="user-email">{getAuthHeader().Authorization ? 'Admin' : 'Guest'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content-wrapper">

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {activeSection === 'dashboard' ? (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Total Images</h3>
                  <p className="stat-number">{images.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Landing Page</h3>
                  <p className="stat-number">{images.filter(img => img.category === 'landing_page').length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>Portfolio</h3>
                  <p className="stat-number">{images.filter(img => img.category === 'portfolio').length}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Google Analytics</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="analytics-info">
                    <h4>Page Views (30d)</h4>
                    <p className="analytics-number">
                      {loadingAnalytics ? '...' : analytics ? analytics.pageViews30d.toLocaleString() : '-'}
                    </p>
                    {!analytics && <span className="analytics-note">Connect GA to view</span>}
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
                    </svg>
                  </div>
                  <div className="analytics-info">
                    <h4>Past Page Views</h4>
                    <p className="analytics-number">
                      {loadingAnalytics ? '...' : analytics ? analytics.pastPageViews.toLocaleString() : '-'}
                    </p>
                    {!analytics && <span className="analytics-note">Connect GA to view</span>}
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.83 0 1.5-.67 1.5-1.5S7.83 8 7 8s-1.5.67-1.5 1.5S6.17 11 7 11zm10 0c.83 0 1.5-.67 1.5-1.5S17.83 8 17 8s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-5 6c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                  </div>
                  <div className="analytics-info">
                    <h4>Total Visits (All Time)</h4>
                    <p className="analytics-number">
                      {loadingAnalytics ? '...' : analytics ? analytics.totalVisitsAllTime.toLocaleString() : '-'}
                    </p>
                    {!analytics && <span className="analytics-note">Connect GA to view</span>}
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <div className="analytics-info">
                    <h4>Unique Visitors</h4>
                    <p className="analytics-number">
                      {loadingAnalytics ? '...' : analytics ? analytics.uniqueVisitors.toLocaleString() : '-'}
                    </p>
                    {!analytics && <span className="analytics-note">Connect GA to view</span>}
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                  </div>
                  <div className="analytics-info">
                    <h4>Avg Session Duration</h4>
                    <p className="analytics-number">
                      {loadingAnalytics ? '...' : analytics ? `${Math.floor(analytics.avgSessionDuration / 60)}m ${analytics.avgSessionDuration % 60}s` : '-'}
                    </p>
                    {!analytics && <span className="analytics-note">Connect GA to view</span>}
                  </div>
                </div>
                <div className="analytics-card">
                  <div className="analytics-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                  </div>
                  <div className="analytics-info">
                    <h4>Bounce Rate</h4>
                    <p className="analytics-number">
                      {loadingAnalytics ? '...' : analytics ? `${analytics.bounceRate}%` : '-'}
                    </p>
                    {!analytics && <span className="analytics-note">Connect GA to view</span>}
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button onClick={() => setActiveSection('media')} className="action-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Upload New Image
                </button>
                <button onClick={() => setActiveSection('media')} className="action-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  Manage Media
                </button>
              </div>
            </div>
          </div>
        ) : activeSection === 'messages' ? (
          <div className="messages-content">
            {loadingMessages ? (
              <div className="loading">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message-card ${msg.read ? 'read' : 'unread'}`}>
                    <div className="message-header">
                      <div className="message-from">
                        <h3>{msg.name}</h3>
                        <span className="message-email">{msg.email}</span>
                      </div>
                      <div className="message-meta">
                        <span className="message-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        {!msg.read && <span className="unread-indicator">New</span>}
                      </div>
                    </div>
                    <div className="message-details">
                      {msg.phone && <p><strong>Phone:</strong> {msg.phone}</p>}
                      {msg.service && <p><strong>Service:</strong> {msg.service}</p>}
                    </div>
                    <div className="message-body">
                      <p>{msg.message}</p>
                    </div>
                    <div className="message-actions">
                      {!msg.read && (
                        <button onClick={() => markAsRead(msg.id)} className="btn-mark-read">
                          Mark as Read
                        </button>
                      )}
                      <button onClick={() => deleteMessage(msg.id)} className="btn-delete-message">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
        <div className="admin-content">
        <div className="upload-section">
          <h2>Upload New Image</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-group">
              <label htmlFor="imageInput">Image File *</label>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              {formData.image && (
                <div className="file-preview">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="title">Title (Optional)</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Wedding Photography"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the image"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Page</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="landing_page">Landing Page</option>
                  <option value="portfolio">Portfolio Page</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="displayOrder">Display Order</label>
                <input
                  id="displayOrder"
                  type="number"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <button type="submit" disabled={uploading} className="btn-upload">
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        <div className="images-section">
          <div className="section-header">
            <div className="header-left">
              <h2>Uploaded Images</h2>
              <div className="category-tabs">
                <button
                  onClick={() => setActiveTab('landing_page')}
                  className={`tab-btn ${activeTab === 'landing_page' ? 'active' : ''}`}
                >
                  Landing Page
                </button>
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
                >
                  Portfolio
                </button>
              </div>
            </div>
            <div className="header-actions">
              <div className="view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="Grid View"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  title="List View"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                  </svg>
                </button>
              </div>
              <button onClick={fetchImages} className="btn-refresh">
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading images...</div>
          ) : images.filter(img => img.category === activeTab).length === 0 ? (
            <div className="empty-state">
              <p>No images in this category yet</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'images-grid' : 'images-list'}>
              {images.filter(img => img.category === activeTab).map((image) => (
                <div key={image.id} className={viewMode === 'grid' ? 'image-card' : 'image-list-item'}>
                  <div className="image-wrapper">
                    <img src={image.url} alt={image.title || 'Uploaded image'} />
                  </div>
                  <div className="image-info">
                    {editingId === image.id ? (
                      <div className="edit-form">
                        <div className="form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            name="title"
                            value={editData.title}
                            onChange={handleEditChange}
                            placeholder="Image title"
                          />
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            placeholder="Image description"
                            rows="2"
                          />
                        </div>
                        <div className="form-group">
                          <label>Page</label>
                          <select
                            name="category"
                            value={editData.category}
                            onChange={handleEditChange}
                          >
                            <option value="landing_page">Landing Page</option>
                            <option value="portfolio">Portfolio Page</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Display Order</label>
                          <input
                            type="number"
                            name="displayOrder"
                            value={editData.displayOrder}
                            onChange={handleEditChange}
                            min="0"
                          />
                        </div>
                        <div className="edit-actions">
                          <button onClick={() => saveEdit(image.id)} className="btn-save">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="btn-cancel">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="image-details">
                          <h3>{image.title || 'Untitled'}</h3>
                          {image.description && <p>{image.description}</p>}
                          <div className="image-meta">
                            <span className="category-badge">{image.category}</span>
                            <span className="order-badge">Order: {image.displayOrder}</span>
                          </div>
                        </div>
                        <div className="card-actions">
                          <button
                            onClick={() => startEdit(image)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
        )}
      </div>
    </div>
    </div>
  );
}
