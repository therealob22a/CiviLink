import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { getIDUploadStatus } from '../../api/idUpload.api.js';
import '../../styles/auth/IDGuard.css';

// Create context to be used by forms
export const IDContext = createContext();

export const useIDGuard = () => useContext(IDContext);

export const IDGuard = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [idStatus, setIdStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkIDStatus = async () => {
      // Only check for citizens
      if (!isAuthenticated || role !== 'citizen') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getIDUploadStatus();
        if (response.success) {
          setIdStatus(response.status);
          // We don't show the modal automatically anymore
        }
      } catch (error) {
        console.error('Failed to check ID status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIDStatus();
  }, [isAuthenticated, role]);

  // Not a citizen, allow access
  if (!isAuthenticated || role !== 'citizen') {
    return children;
  }

  if (isLoading) {
    return (
      <div className="id-guard-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Checking ID verification status...</p>
      </div>
    );
  }

  // If status is not BOTH, show the block screen instead of children
  if (idStatus !== 'BOTH') {
    return (
      <IDContext.Provider value={{ idStatus, setShowModal, isLoading }}>
        <div className="id-guard-block-screen">
          <div className="id-guard-block-content">
            <div className="id-guard-block-header">
              <i className="fas fa-lock"></i>
              <h2>Verification Required</h2>
            </div>
            <div className="id-guard-block-body">
              <p>
                You must upload both <strong>Fayda ID</strong> and <strong>Kebele ID</strong> documents before you can access this page.
              </p>
              <p className="id-guard-info">
                Please complete your ID verification in the Settings page to unlock applications.
              </p>
            </div>
            <div className="id-guard-block-footer">
              <button
                className="id-guard-btn-primary"
                onClick={() => navigate('/user/settings')}
              >
                Go to Settings
              </button>
              <button
                className="id-guard-btn-secondary"
                onClick={() => navigate('/user/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </IDContext.Provider>
    );
  }

  return (
    <IDContext.Provider value={{ idStatus, setShowModal, isLoading }}>
      <div className="id-guard-content">
        {children}
      </div>
    </IDContext.Provider>
  );
};

export default IDGuard;

