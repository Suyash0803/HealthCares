import React, { useState } from 'react';
import { useMedicines } from '../hooks/useMedicines';
import MedicineCard from '../components/MedicineCard';
import AddMedicineForm from '../components/AddMedicineForm';
import Dashboards from '../components/Dashboards';
import SearchAndFilter from '../components/SearchAndFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { Plus, Heart, Wifi, WifiOff } from 'lucide-react';
import '../styles/MedApp.css';

function App() {
  const {
    medicines,
    loading,
    error,
    addMedicine,
    updateMedicineQuantity,
    deleteMedicine,
    refetch,
  } = useMedicines();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLowStock, setShowLowStock] = useState(false);

  const handleAddMedicine = async (medicineData) => {
    try {
      await addMedicine(medicineData);
      setIsAddFormOpen(false);
    } catch (err) {}
  };

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || medicine.category === selectedCategory;

    const matchesLowStock =
      !showLowStock || medicine.quantity <= medicine.minThreshold;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="header">
            <div className="icon-box blue">
              <Heart className="icon" />
            </div>
            <h1 className=''>Infirmary Management</h1>
          </div>
          <LoadingSpinner message="Loading medicines..." />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <div className="icon-box blue">
            <Heart className="icon" />
          </div>
          <h1>Infirmary Management</h1>
          <div className="status-icon">
            {error ? (
              <WifiOff className="error-icon" title="Connection Error" />
            ) : (
              <Wifi className="success-icon" title="Connected" />
            )}
          </div>
        </div>
        <p className="subtitle">
          Keep track of your medical inventory with our comprehensive management system
        </p>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!error && (
          <>
            <Dashboards medicines={medicines} />
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              showLowStock={showLowStock}
              onToggleLowStock={setShowLowStock}
            />

            <div className="section-header">
              <h2>Medicine Inventory ({filteredMedicines.length})</h2>
              <button onClick={() => setIsAddFormOpen(true)} className="add-button">
                <Plus className="icon" />
                <span>Add Medicine</span>
              </button>
            </div>

            {filteredMedicines.length === 0 ? (
              <div className="empty-state">
                <Heart className="empty-icon" />
                <h3>No medicines found</h3>
                <p>
                  {searchTerm || selectedCategory !== 'All' || showLowStock
                    ? 'Try adjusting your search or filters'
                    : 'Start by adding your first medicine to the inventory'}
                </p>
                {!searchTerm && selectedCategory === 'All' && !showLowStock && (
                  <button
                    onClick={() => setIsAddFormOpen(true)}
                    className="primary-button"
                  >
                    Add First Medicine
                  </button>
                )}
              </div>
            ) : (
              <div className="medicine-grid">
                {filteredMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onUpdateQuantity={updateMedicineQuantity}
                    onDelete={deleteMedicine}
                  />
                ))}
              </div>
            )}

            <AddMedicineForm
              isOpen={isAddFormOpen}
              onClose={() => setIsAddFormOpen(false)}
              onAddMedicine={handleAddMedicine}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
