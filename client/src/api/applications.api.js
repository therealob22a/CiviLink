/**
 * Applications API client
 * 
 * Handles application-related operations:
 * - Get all user applications
 * - Download certificate
 */

import {apiRequest} from '../utils/api.js';

/**
 * Get all applications for the current user
 * @returns {Promise<Object>} List of applications
 */
export const getAllApplications = async () => {
  return apiRequest('/applications', {
    method: 'GET',
  });
};

/**
 * Submit a TIN application
 * @param {Object} formData - TIN form data
 * @returns {Promise<Object>} Application info
 */
export const submitTinApplication = async (formData) => {
  return apiRequest('/tin/applications', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

/**
 * Submit a vital application (birth/marriage/etc)
 * @param {string} type - type of vital record
 * @param {Object} formData - vital form data
 * @returns {Promise<Object>} Application info
 */
export const submitVitalApplication = async (type, formData) => {
  return apiRequest(`/vital/${type}/applications`, {
    method: 'POST',
    body: JSON.stringify(formData),
  });
};

/**
 * Download a certificate
 * @param {string} applicationId - Application ID
 */
export const downloadCertificate = async (applicationId) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  const url = `${API_BASE_URL}/applications/${applicationId}/download`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // Automatically sends HTTP-only cookies
  });

  if (!response.ok) {
    throw new Error('Failed to download certificate');
  }

  return response;
};

