const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Auth routes (public)
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/tasks', authMiddleware, tasksRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware (prints stack in non-production)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { details: err.stack } : {})
  });
});

// Handle unhandled rejections and exceptions so they appear in the logs
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
