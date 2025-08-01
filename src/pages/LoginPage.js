import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import AuthLayout from '../components/AuthLayout';
import styles from './AuthPage.module.css';

const LoginPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect handles displaying messages passed from other pages, like after a successful registration.
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear message from location state to prevent it from showing again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <AuthLayout>
      <div className={styles.authContainer}>
        <div className={styles.registrationHeader}>
          <h2>Log In</h2>
        </div>
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;