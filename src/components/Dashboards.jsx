import React from 'react';
import { Activity, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import '../styles/Dashboard.css';

/**
 * @typedef {Object} Medicine
 * @property {string} id
 * @property {string} name
 * @property {number} quantity
 * @property {number} minThreshold
 * @property {string} category
 * @property {string} [expiryDate]
 * @property {string} addedDate
 */

/**
 * @param {{ medicines: Medicine[] }} props
 */
const Dashboards = ({ medicines }) => {
  const totalMedicines = medicines.length;
  const totalStock = medicines.reduce((sum, med) => sum + med.quantity, 0);
  const lowStockCount = medicines.filter(med => med.quantity <= med.minThreshold).length;
  const expiringSoon = medicines.filter(
    med => med.expiryDate && new Date(med.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  const stats = [
    {
      title: 'Total Medicines',
      value: totalMedicines,
      icon: Package,
      color: 'blue',
      description: 'Unique medicines in inventory'
    },
    {
      title: 'Total Stock',
      value: totalStock,
      icon: TrendingUp,
      color: 'green',
      description: 'Total units available'
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'red' : 'gray',
      description: 'Items below threshold'
    },
    {
      title: 'Expiring Soon',
      value: expiringSoon,
      icon: Activity,
      color: expiringSoon > 0 ? 'orange' : 'gray',
      description: 'Expires within 30 days'
    }
  ];

  return (
    <div className="dashboard-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card bg-${stat.color}`}>
          <div className="stat-header">
            <div className={`stat-icon bg-${stat.color}`}>
              <stat.icon className="icon-white" />
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
          <div className="stat-info">
            <p className="stat-title">{stat.title}</p>
            <p className="stat-description">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboards;
