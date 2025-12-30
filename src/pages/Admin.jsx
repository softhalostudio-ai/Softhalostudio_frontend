import { useState, useEffect } from 'react';

const API_URL = `${import.meta.env.VITE_API_URL}/images`;

export default function Admin() {
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

  useEffect(() => {
    fetchImages();
  }, []);

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
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Image deleted successfully', 'success');
        fetchImages();
      } else {
        showMessage(data.error || 'Delete failed', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('Failed to delete image', 'error');
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
          'Content-Type': 'application/json'
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
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Upload and manage portfolio images</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

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
            <h2>Uploaded Images</h2>
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
          ) : images.length === 0 ? (
            <div className="empty-state">
              <p>No images uploaded yet</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'images-grid' : 'images-list'}>
              {images.map((image) => (
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
                        <h3>{image.title || 'Untitled'}</h3>
                        {image.description && <p>{image.description}</p>}
                        <div className="image-meta">
                          <span className="category-badge">{image.category}</span>
                          <span className="order-badge">Order: {image.displayOrder}</span>
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
    </div>
  );
}
