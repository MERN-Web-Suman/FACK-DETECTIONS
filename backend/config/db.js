import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

// Ensure SRV records resolve reliably on all Windows/ISP networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isConnected = false;
let isInMemoryFallback = false;
let activeMongoHost = 'None';
let activeDbName = 'phishing_detector';
let activeUri = process.env.MONGO_URL || process.env.MONGO_URI || '';

export const maskUri = (uri) => {
  if (!uri) return 'Not configured';
  try {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/i, '$1******$3');
  } catch {
    return 'mongodb://******';
  }
};

export const connectDB = async (customURI = null) => {
  const uriToUse =
    customURI ||
    process.env.MONGO_URL ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/phishing_detector';
  activeUri = uriToUse;

  if (uriToUse.includes('<db_username>') || uriToUse.includes('<db_password>')) {
    console.warn(`[!] ATTENTION: MONGO_URL contains placeholder '<db_username>' or '<db_password>'.`);
    console.warn(`[!] Please replace <db_username> and <db_password> with your actual MongoDB credentials in backend/.env`);
  }

  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log(`[*] Connecting to MongoDB database: ${maskUri(uriToUse)}`);
    const conn = await mongoose.connect(uriToUse, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    isInMemoryFallback = false;
    activeMongoHost = conn.connection.host || 'MongoDB Cluster';
    activeDbName = conn.connection.name || 'phishing_detector';

    console.log(`[+] SUCCESS: Real MongoDB Connected! Host: ${activeMongoHost} (Database: ${activeDbName})`);
    return { success: true, host: activeMongoHost, dbName: activeDbName };
  } catch (error) {
    isConnected = false;
    isInMemoryFallback = true;
    console.warn(`[!] MongoDB connection failed to [${maskUri(uriToUse)}]: ${error.message}`);
    console.warn(`[*] Retaining resilient In-Memory store fallback until valid MongoDB URL is supplied.`);
    return { success: false, error: error.message };
  }
};

export const reconnectDB = async (newMongoURI) => {
  if (!newMongoURI || !newMongoURI.startsWith('mongodb')) {
    throw new Error('Invalid MongoDB connection string. Must begin with "mongodb://" or "mongodb+srv://".');
  }

  const result = await connectDB(newMongoURI);
  if (!result.success) {
    throw new Error(`Failed to connect to MongoDB URL: ${result.error}`);
  }

  // Persist updated MONGO_URI into backend/.env
  try {
    const envPath = path.resolve(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    if (/^MONGO_URL=/m.test(envContent)) {
      envContent = envContent.replace(/^MONGO_URL=.*$/m, `MONGO_URL=${newMongoURI}`);
    } else if (/^MONGO_URI=/m.test(envContent)) {
      envContent = envContent.replace(/^MONGO_URI=.*$/m, `MONGO_URL=${newMongoURI}`);
    } else {
      envContent += `\nMONGO_URL=${newMongoURI}`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    process.env.MONGO_URL = newMongoURI;
    process.env.MONGO_URI = newMongoURI;
    console.log(`[+] Updated MONGO_URL successfully saved to backend/.env`);
  } catch (err) {
    console.warn(`[!] Could not write to .env file: ${err.message}`);
  }

  return {
    success: true,
    host: activeMongoHost,
    dbName: activeDbName,
    uriMasked: maskUri(newMongoURI)
  };
};

export const getDbStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  host: mongoose.connection.readyState === 1 ? mongoose.connection.host : 'Offline / In-Memory',
  dbName: mongoose.connection.readyState === 1 ? mongoose.connection.name : 'In-Memory',
  uriMasked: maskUri(activeUri),
  inMemoryFallback: mongoose.connection.readyState !== 1
});
