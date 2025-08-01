import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../pages/AuthPage.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    // For debugging: log the credentials being sent
    console.log('Attempting to log in with:', { email, password });

    try {
      // Use a relative URL. This works in dev (with proxy) and prod (same domain).
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Handle non-JSON error responses gracefully. This prevents the "Unexpected token '<'" error
        // if the server returns an HTML page for a 404 or 500 error.
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `An error occurred: ${response.statusText}`);
        } else {
          // The response is not JSON. It's likely an HTML error page.
          throw new Error(`Server returned an unexpected response. Status: ${response.status}`);
        }
      }

      const data = await response.json();

      // TODO: Handle 2FA flow if data.twoFactorRequired is true.

      // Assuming login() is an async function. We must `await` it to ensure
      // the auth state is updated before navigating. This prevents a race
      // condition where the dashboard loads before the user is authenticated.
      const user = await login(data.token, rememberMe);

      if (user) {
        console.log('Login successful, navigating to dashboard...');
        navigate('/dashboard');
      } else {
        setError('Login failed. Could not process user session.');
      }
    } catch (err) {
      console.error('Login API call failed:', err);
      setError(err.message || 'An unknown error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          required
          disabled={loading}
        />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={loading}
        />
        <div className={styles.loginOptions}>
          <label className={styles.rememberMeLabel}>
            <input
              type="checkbox"
              className={styles.rememberMeCheckbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className={styles.forgotPassword}>Forgot password?</Link>
        </div>
        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? <div className={styles.spinner} /> : 'Log In'}
        </button>
      </form>
      <hr />
      <Link to="/register" className={styles.createAccountButton}>
        Create new account
      </Link>
    </>
  );
};

export default LoginForm;