import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import styles from './AuthPage.module.css';

function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <AuthLayout>
      <div className={styles.authContainer}>
        <div className={styles.registrationHeader}>
          <h2>Successfully Logged Out</h2>
          <p>Thank you for visiting. You can now safely close this page.</p>
        </div>
        <Link to="/login" className={styles.loginButton} style={{ textDecoration: 'none', marginTop: '1rem' }}>
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
}

export default LogoutPage;