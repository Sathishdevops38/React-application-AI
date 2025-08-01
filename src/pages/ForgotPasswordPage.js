import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import styles from './AuthPage.module.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
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
          <h2>Forgot Password?</h2>
          <p>
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className={styles.loginForm} style={{ gap: '1rem', marginTop: '1rem' }}>
          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? <div className={styles.spinner} /> : 'Send Reset Link'}
          </button>
        </form>
        <Link to="/login" className={styles.alreadyHaveAccount} style={{ marginTop: '1rem' }}>Back to Login</Link>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;