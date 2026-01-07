import React, { useState, useEffect } from 'react';
import * as paymentAPI from '../../api/payment.api';
import '../../styles/components/PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onPaymentVerified, applicationData }) => {
    const [step, setStep] = useState('init'); // init, checkout, verifying, success, error
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInitializePayment = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await paymentAPI.processPayment({
                applicationId: applicationData.id || 'pending_app', // Fallback if ID not yet generated
                serviceType: applicationData.type,
                phoneNumber: applicationData.phoneNumber || '0911223344', // Mock phone if missing
                amount: applicationData.fee
            });

            if (response.success) {
                setPaymentInfo(response.data);
                setStep('checkout');
            } else {
                setError(response.message || 'Failed to initialize payment');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckoutRedirect = () => {
        if (paymentInfo?.checkoutUrl) {
            // In a real app, we'd redirect or open in new tab
            // window.location.href = paymentInfo.checkoutUrl;

            // For this demo/stabilization, we simulate the redirect and wait for user to click "Verify"
            window.open(paymentInfo.checkoutUrl, '_blank');
            setStep('verifying');
        }
    };

    const handleVerifyPayment = async () => {
        if (!paymentInfo?.txRef) return;

        setIsLoading(true);
        try {
            const response = await paymentAPI.verifyPayment(paymentInfo.txRef);
            if (response.success && response.data.status === 'success') {
                setStep('success');
                setTimeout(() => {
                    onPaymentVerified(response.data);
                }, 1500);
            } else {
                setError('Payment not yet completed or failed. Please try again.');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal-content">
                <button className="close-modal-btn" onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>

                <div className="payment-modal-header">
                    <div className={`payment-icon ${step === 'success' ? 'payment-success-icon' : ''}`}>
                        {step === 'success' ? (
                            <i className="fas fa-check-circle pulse-animation"></i>
                        ) : (
                            <i className="fas fa-credit-card"></i>
                        )}
                    </div>
                    <h2>
                        {step === 'init' && 'Service Payment'}
                        {step === 'checkout' && 'Complete Checkout'}
                        {step === 'verifying' && 'Verifying Payment'}
                        {step === 'success' && 'Payment Successful!'}
                        {step === 'error' && 'Payment Error'}
                    </h2>
                </div>

                {step !== 'success' && (
                    <div className="payment-details-summary">
                        <div className="payment-row">
                            <span className="payment-label">Service:</span>
                            <span className="payment-value">{applicationData.type}</span>
                        </div>
                        <div className="payment-row">
                            <span className="payment-label">Application ID:</span>
                            <span className="payment-value">{applicationData.id || 'New Application'}</span>
                        </div>
                        <div className="payment-row">
                            <span className="payment-label">Amount:</span>
                            <span className="payment-value">{applicationData.fee} ETB</span>
                        </div>
                    </div>
                )}

                {error && <p className="payment-status-message" style={{ color: '#ef4444' }}>{error}</p>}

                <div className="payment-actions">
                    {step === 'init' && (
                        <button className="pay-now-btn" onClick={handleInitializePayment} disabled={isLoading}>
                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Initialize Payment'}
                        </button>
                    )}

                    {step === 'checkout' && (
                        <>
                            <p className="payment-status-message">Please complete the payment in the Chapa checkout window.</p>
                            <button className="pay-now-btn" onClick={handleCheckoutRedirect}>
                                Go to Checkout
                            </button>
                        </>
                    )}

                    {step === 'verifying' && (
                        <>
                            <p className="payment-status-message">Waiting for payment confirmation...</p>
                            <button className="verify-payment-btn" onClick={handleVerifyPayment} disabled={isLoading}>
                                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Check Payment Status'}
                            </button>
                        </>
                    )}

                    {step === 'success' && (
                        <div className="payment-processing">
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Finalizing your application...</p>
                        </div>
                    )}

                    {step !== 'success' && (
                        <button className="cancel-payment-btn" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
