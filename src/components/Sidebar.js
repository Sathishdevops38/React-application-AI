import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const profilePictureSrc = user?.profilePicture
    ? `http://localhost:3001${user.profilePicture}`
    : 'https://via.placeholder.com/150';

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileSection}>
        <img src={profilePictureSrc} alt="Profile" className={styles.profilePicture} />
        <span className={styles.profileName}>{user?.email}</span>
      </div>
      <nav className={styles.navigation}>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)} end>
          Dashboard
        </NavLink>
        <NavLink to="/dashboard/profile" className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}>
          Profile Settings
        </NavLink>
      </nav>
      <div className={styles.logoutSection}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;