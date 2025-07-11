import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Calendar,
  Edit2,
  Trash2,
  Loader2
} from 'lucide-react';
import '../styles/MedicineCard.css';

const MedicineCard = ({ medicine, onUpdateQuantity, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLowStock = medicine.quantity <= medicine.minThreshold;
  const isExpiringSoon =
    medicine.expiryDate &&
    new Date(medicine.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const handleAdjustQuantity = async (operation) => {
    const newQuantity =
      operation === 'add'
        ? medicine.quantity + adjustAmount
        : Math.max(0, medicine.quantity - adjustAmount);

    try {
      setIsUpdating(true);
      await onUpdateQuantity(medicine.id, newQuantity);
      setIsEditing(false);
      setAdjustAmount(1);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${medicine.name}?`)) {
      try {
        setIsDeleting(true);
        await onDelete(medicine.id);
      } catch (error) {
        console.error('Failed to delete medicine:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className={`medicine-card ${isLowStock ? 'low-stock' : 'normal-stock'} ${
        (isUpdating || isDeleting) ? 'disabled' : ''
      }`}
    >
      <div className="card-body">
        <div className="card-header">
          <div className="card-info">
            <div className={`card-icon ${isLowStock ? 'red-icon' : 'blue-icon'}`}>
              <Package className="icon" />
            </div>
            <div>
              <h3 className="medicine-name">{medicine.name}</h3>
              <p className="medicine-category">{medicine.category}</p>
            </div>
          </div>
          <div className="action-buttons">
            <button
              onClick={() => setIsEditing(!isEditing)}
              disabled={isUpdating || isDeleting}
              className="icon-button"
            >
              {isUpdating ? <Loader2 className="icon spinning" /> : <Edit2 className="icon" />}
            </button>
            <button
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
              className="icon-button"
            >
              {isDeleting ? <Loader2 className="icon spinning" /> : <Trash2 className="icon" />}
            </button>
          </div>
        </div>

        <div className="card-stats">
          <div className="stat-row">
            <span>Current Stock</span>
            <span className={`stock-value ${isLowStock ? 'red-text' : 'green-text'}`}>
              {medicine.quantity}
            </span>
          </div>

          <div className="stat-row">
            <span>Min. Threshold</span>
            <span>{medicine.minThreshold}</span>
          </div>

          {medicine.expiryDate && (
            <div className="stat-row">
              <span>Expires</span>
              <div className="expiry">
                <Calendar className="icon small-icon" />
                <span className={isExpiringSoon ? 'amber-text' : ''}>
                  {new Date(medicine.expiryDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {(isLowStock || isExpiringSoon) && (
            <div className="alert-banner">
              <AlertTriangle className="icon alert-icon" />
              <span>
                {isLowStock && isExpiringSoon
                  ? 'Low stock & expiring soon'
                  : isLowStock
                  ? 'Low stock alert'
                  : 'Expiring soon'}
              </span>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="edit-section">
            <div className="adjust-row">
              <label>Adjust by:</label>
              <input
                type="number"
                value={adjustAmount}
                onChange={(e) =>
                  setAdjustAmount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="adjust-input"
                min="1"
                disabled={isUpdating}
              />
            </div>
            <div className="edit-buttons">
              <button
                onClick={() => handleAdjustQuantity('add')}
                disabled={isUpdating}
                className="add-btn"
              >
                <Plus className="icon small-icon" />
                <span>Add</span>
              </button>
              <button
                onClick={() => handleAdjustQuantity('subtract')}
                disabled={isUpdating}
                className="remove-btn"
              >
                <Minus className="icon small-icon" />
                <span>Remove</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isUpdating}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineCard;
