import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import styles from './AuthPage.module.css';

function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
      } else {
        setError(data.message || 'An error occurred during registration.');
      }
    } catch (error) {
      console.error('Registration request failed:', error);
      setError('Registration failed. The server might not be running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={styles.authContainer}>
        <div className={styles.registrationHeader}>
          <h2>Sign Up</h2>
          <p>It's quick and easy.</p>
        </div>
        <hr />
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.signupButton} disabled={loading}>
            {loading ? <div className={styles.spinner} /> : 'Sign Up'}
          </button>
        </form>
        <Link to="/login" className={styles.alreadyHaveAccount}>Already have an account?</Link>
      </div>
    </AuthLayout>
  );
}

export default RegistrationPage;