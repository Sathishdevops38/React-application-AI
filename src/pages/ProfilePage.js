import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError('File is too large. Maximum size is 5MB.');
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
      setError('');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    if (!user?.token) {
      setError('Authentication error. Please log in again.');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const response = await fetch('/api/profile/picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        updateUser({ profilePicture: data.profilePictureUrl });
        setSelectedFile(null);
      } else {
        setError(data.message || 'Upload failed.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setUploading(false);
    }
  };

  const profilePictureSrc = user?.profilePicture ? `http://localhost:3001${user.profilePicture}` : 'https://via.placeholder.com/150';

  return (
    <DashboardLayout>
      <div className={styles.profileContainer}>
        <h2>Profile Settings</h2>
        <div className={styles.profileCard}>
          <img src={profilePictureSrc} alt="Profile" className={styles.profileImage} />
          <h3>{user?.email}</h3>
          <div className={styles.uploadSection}>
            <h4>Update Profile Picture</h4>
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} className={styles.fileInput} />
            <button onClick={handleUpload} disabled={uploading || !selectedFile} className={styles.uploadButton}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {message && <p className={styles.successMessage}>{message}</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;