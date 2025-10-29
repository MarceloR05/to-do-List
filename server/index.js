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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
