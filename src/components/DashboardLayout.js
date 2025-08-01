import React from 'react';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.dashboardContent}>{children}</main>
    </div>
  );
};

export default DashboardLayout;