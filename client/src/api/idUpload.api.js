/**
 * ID Upload API client
 * 
 * Handles ID verification operations:
 * - Upload Fayda ID
 * - Upload Kebele ID
 * - Get upload status
 * - Delete ID information (Right to Be Forgotten)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Get ID upload status
 * @returns {Promise<Object>} Upload status (NONE, ONLY_FAYDA, ONLY_KEBELE, BOTH)
 */
export const getIDUploadStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/user/id/upload`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to get ID upload status');
  }
  return data;
};

/**
 * Upload Fayda ID
 * @param {File} file - ID image file
 * @returns {Promise<Object>} Upload result
 */
export const uploadFaydaID = async (file) => {
  const formData = new FormData();
  formData.append('id_image', file);

  const response = await fetch(`${API_BASE_URL}/user/id/upload/fayda`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload Fayda ID');
  }
  return data;
};

/**
 * Upload Kebele ID
 * @param {File} file - ID image file
 * @returns {Promise<Object>} Upload result
 */
export const uploadKebeleID = async (file) => {
  const formData = new FormData();
  formData.append('id_image', file);

  const response = await fetch(`${API_BASE_URL}/user/id/upload/kebele`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload Kebele ID');
  }
  return data;
};

/**
 * Delete ID information (Right to Be Forgotten)
 * @param {string} idType - 'fayda', 'kebele', or 'both'
 * @returns {Promise<Object>} Deletion result
 */
export const deleteIDInfo = async (idType) => {
  const response = await fetch(`${API_BASE_URL}/user/id/${idType}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete ID information');
  }
  return data;
};

