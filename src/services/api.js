const API_BASE_URL = 'http://localhost:5000/api';

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
 * @typedef {Object} MedicineFormData
 * @property {string} name
 * @property {number} quantity
 * @property {number} minThreshold
 * @property {string} category
 * @property {string} [expiryDate]
 */

class ApiService {
  /**
   * @template T
   * @param {string} endpoint
   * @param {RequestInit} [options]
   * @returns {Promise<T>}
   */
  async request(endpoint, options) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * @returns {Promise<Medicine[]>}
   */
  async getAllMedicines() {
    return this.request('/medicines');
  }

  /**
   * @param {string} id
   * @returns {Promise<Medicine>}
   */
  async getMedicine(id) {
    return this.request(`/medicines/${id}`);
  }

  /**
   * @param {MedicineFormData} medicineData
   * @returns {Promise<Medicine>}
   */
  async createMedicine(medicineData) {
    return this.request('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicineData),
    });
  }

  /**
   * @param {string} id
   * @param {number} quantity
   * @returns {Promise<Medicine>}
   */
  async updateMedicineQuantity(id, quantity) {
    return this.request(`/medicines/${id}/quantity`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteMedicine(id) {
    await this.request(`/medicines/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * @returns {Promise<{ status: string; message: string }>}
   */
  async checkHealth() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
