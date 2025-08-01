const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
// In a real app, this secret should be stored securely in an environment variable
const JWT_SECRET = 'your-super-secret-key-that-is-long-and-random';

// --- Middleware ---

// --- Create uploads directory if it doesn't exist ---
const uploadDir = path.join(__dirname, 'uploads/profile_pictures');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Enable CORS for all routes, which is helpful for development
app.use(cors());
// This middleware is crucial to parse the JSON body of POST requests
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- In-Memory User Database ---
// In a real application, you would fetch users from a database and passwords
// should be hashed with a library like bcrypt.
const users = [
  {
    id: '123',
    email: 'test@example.com',
    password: 'password',
    profilePicture: null,
  },
  {
    id: '456',
    email: 'user@email.com',
    password: 'password',
    profilePicture: null,
  },
];

// --- JWT Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if the token is invalid
    req.user = user; // Add the decoded user payload to the request object
    next();
  });
};

// --- Multer Setup for File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use user ID to ensure unique filenames and prevent conflicts
    const uniqueSuffix = req.user.userId + '-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// --- API Routes ---

// This is the route handler for the path your frontend is calling.
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  console.log(`[Server] Login attempt for: ${email}`);

  // Find the user in our in-memory database
  const user = users.find(u => u.email === email);

  // Authenticate the user (in a real app, use: await bcrypt.compare(password, user.password))
  if (user && user.password === password) {
    // If authentication is successful, create a JSON Web Token (JWT)
    const token = jwt.sign(
      { userId: user.id, email: user.email, profilePicture: user.profilePicture },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send a success response with the token
    return res.status(200).json({ token });
  }

  // If authentication fails, send an error response
  return res.status(401).json({ message: 'Invalid email or password.' });
});

// Profile Picture Upload Route
app.post('/api/profile/picture', authenticateToken, upload.single('profilePicture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Find user in our "DB"
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Construct the URL path to the file
  const profilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`;

  // Update user record
  user.profilePicture = profilePictureUrl;
  console.log(`[Server] User ${user.email} updated profile picture to ${profilePictureUrl}`);

  res.status(200).json({ message: 'Profile picture updated successfully.', profilePictureUrl });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`[Server] API server is running on http://localhost:${PORT}`);
});