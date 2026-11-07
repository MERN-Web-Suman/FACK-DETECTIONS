import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logger disabled to keep terminal clean
// if (process.env.NODE_ENV !== 'test') {
//   app.use(morgan('dev'));
// }

// Root health & status endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'PhishGuard AI Core API',
    message: 'Backend is running successfully!',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      scans: '/api/scans',
      system: '/api/system'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'PhishGuard AI Core API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/system', systemRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
