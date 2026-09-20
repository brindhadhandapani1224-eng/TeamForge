import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './backend/config/db.ts';
import authRoutes from './backend/routes/authRoutes.ts';
import userRoutes from './backend/routes/userRoutes.ts';
import projectRoutes from './backend/routes/projectRoutes.ts';
import requestRoutes from './backend/routes/requestRoutes.ts';
import { errorHandler, notFound } from './backend/middleware/errorMiddleware.ts';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Connect to Database
  await connectDB();

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Status & Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TeamForge API Server',
      timestamp: new Date().toISOString(),
      architecture: 'MERN (MongoDB, Express, React, Node.js)',
      phase: 'Phase 1: Project Setup and Folder Structure Complete',
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/requests', requestRoutes);

  // Vite middleware for frontend development / static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware for API routes
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TeamForge Server] Running on http://localhost:${PORT}`);
    console.log(`[TeamForge API] Health endpoint active at http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('[TeamForge Startup Error]:', err);
});
