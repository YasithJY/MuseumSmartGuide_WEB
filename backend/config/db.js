import mongoose from 'mongoose';
import dns from 'dns';

// Windows sometimes reports a link-local IPv6 address (fe80::1) as the DNS
// server, which Node's resolver can't query, breaking mongodb+srv lookups.
// Force a public resolver so the SRV lookup succeeds. Hosted platforms
// (Render sets RENDER, Vercel sets VERCEL) have working resolvers of their
// own, so leave them alone there.
if (!process.env.RENDER && !process.env.VERCEL) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150';
const MAX_RETRY_DELAY_MS = 60000;

// For the long-running server: never exit on a failed connection. A crash loop
// during a cold start is what got the old Render free-tier service stuck. Keep
// the server up and retry with backoff; API requests fail with a 500 until the
// database is reachable.
const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const delay = Math.min(5000 * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
    console.error(`Database connection error (attempt ${attempt}): ${error.message}. Retrying in ${delay / 1000}s`);
    setTimeout(() => connectDB(attempt + 1), delay);
  }
};

// For serverless functions: connect on first use and reuse the connection
// while the function instance stays warm. A failed attempt is not cached, so
// the next request tries again.
let pending = null;
export const connectOnce = () => {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!pending) {
    pending = mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .catch((error) => {
        pending = null;
        throw error;
      });
  }
  return pending;
};

export default connectDB;
