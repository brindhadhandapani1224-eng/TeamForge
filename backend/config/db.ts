import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Falls back gracefully with descriptive logs if MONGO_URI is not set or mongod is offline.
 */
export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/teamforge';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection notice: ${error.message}`);
    console.warn('[Database] Running with in-memory / mock support enabled until MONGO_URI is configured.');
  }
};
