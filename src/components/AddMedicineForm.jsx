import React, { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import '../styles/AddMedicines.css'; // Import the CSS file

const categories = [
  'Antibiotics',
  'Pain Relief',
  'Antiseptic',
  'Vitamins',
  'First Aid',
  'Prescription',
  'Other',
];

const AddMedicineForm = ({ onAddMedicine, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    minThreshold: 10,
    category: 'Other',
    expiryDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.quantity > 0) {
      try {
        setIsSubmitting(true);
        setError(null);
        await onAddMedicine(formData);
        setFormData({
          name: '',
          quantity: 0,
          minThreshold: 10,
          category: 'Other',
          expiryDate: '',
        });
      } catch (err) {
        setError(err?.message || 'Failed to add medicine');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minThreshold' ? parseInt(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>Add New Medicine</h2>
          <button onClick={onClose} disabled={isSubmitting} className="icon-button">
            <X className="icon" />
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group">
            <label className="label">Medicine Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Enter medicine name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input"
                min="0"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="label">Min. Threshold</label>
              <input
                type="number"
                name="minThreshold"
                value={formData.minThreshold}
                onChange={handleChange}
                className="input"
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              disabled={isSubmitting}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Expiry Date (Optional)</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="input"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? <Loader2 className="spinner" /> : <Plus className="icon" />}
              <span>{isSubmitting ? 'Adding...' : 'Add Medicine'}</span>
            </button>
            <button type="button" onClick={onClose} disabled={isSubmitting} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineForm;
