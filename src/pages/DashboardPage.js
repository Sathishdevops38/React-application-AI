import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className={styles.dashboardWidget}>
        <h2>Dashboard</h2>
        {user && <p>Welcome back, {user.email}!</p>}
        <p>This is your main dashboard. Use the sidebar to navigate to different sections of your account.</p>
      </div>
      <div className={styles.dashboardWidget}>
        <h4>Quick Stats</h4>
        <p>You could display some application statistics here.</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;