import React from 'react';
import styles from '../pages/AuthPage.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authPage}>
      {children}
    </div>
  );
};

export default AuthLayout;