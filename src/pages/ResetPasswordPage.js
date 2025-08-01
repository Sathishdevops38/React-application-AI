import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import styles from './AuthPage.module.css';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => navigate('/login', { state: { message: 'Password has been reset successfully! Please log in.' } }), 3000);
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.authContainer}>
        <div className={styles.registrationHeader}>
          <h2>Reset Your Password</h2>
          <p>Enter your new password below.</p>
        </div>
        <hr />
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          <button type="submit" className={styles.signupButton} disabled={loading}>
            {loading ? <div className={styles.spinner} /> : 'Reset Password'}
          </button>
        </form>
        <Link to="/login" className={styles.alreadyHaveAccount}>Back to Login</Link>
      </div>
    </AuthLayout>
  );
}

export default ResetPasswordPage;