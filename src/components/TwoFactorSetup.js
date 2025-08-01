import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../pages/AuthPage.module.css';

const TwoFactorSetup = ({ onSetupSuccess }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/2fa/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setQrCodeUrl(data.qrCodeUrl);
        } else {
          setError(data.message || 'Failed to generate QR code.');
        }
      } catch (err) {
        setError('Could not connect to the server to generate QR code.');
      }
    };

    generateQrCode();
  }, [currentUser.token]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('2FA enabled successfully!');
        onSetupSuccess();
      } else {
        setError(data.message || 'Verification failed.');
      }
    } catch (err) {
      setError('Could not connect to the server for verification.');
    } finally {
      setLoading(false);
    }
  };

  if (!qrCodeUrl) {
    return <p>Generating QR code...</p>;
  }

  return (
    <div className={styles.twoFactorContainer}>
      <h3>Enable Two-Factor Authentication</h3>
      <p>Scan the QR code with your authenticator app (like Google Authenticator or Authy), then enter the 6-digit code below.</p>
      <img src={qrCodeUrl} alt="2FA QR Code" className={styles.qrCode} />
      <form onSubmit={handleVerify} className={styles.loginForm} style={{ gap: '1rem', marginTop: '1rem' }}>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="6-digit code" required maxLength="6" />
        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? <div className={styles.spinner} /> : 'Verify & Enable'}
        </button>
      </form>
    </div>
  );
};

export default TwoFactorSetup;