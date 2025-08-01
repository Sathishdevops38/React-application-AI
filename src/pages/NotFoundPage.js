import React from 'react';
import { Link } from 'react-router-dom';

const pageStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f2f5',
  fontFamily: 'sans-serif',
};

const containerStyle = {
  padding: '2rem 2.5rem',
  background: 'white',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
};

const NotFoundPage = () => {
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/login" style={{ color: '#6c5ce7', fontWeight: 'bold' }}>Go to Login Page</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;