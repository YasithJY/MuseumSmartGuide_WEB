import mongoose from 'mongoose';
import dns from 'dns';

// Windows sometimes reports a link-local IPv6 address (fe80::1) as the DNS
// server, which Node's resolver can't query, breaking mongodb+srv lookups.
// Force a public resolver so the SRV lookup succeeds. Render (which sets
// RENDER=true) has a working resolver of its own, so leave it alone there.
if (!process.env.RENDER) {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

const MAX_RETRY_DELAY_MS = 60000;

// Never exit on a failed connection. On Render's free tier a crashed process
// counts as another wake-up attempt, and a crash loop during a cold start gets
// the service rate-limited (429 "hibernate-rate-limited") so it never comes
// back until a manual redeploy. Keep the server up and retry with backoff;
// API requests will fail with a 500 until the database is reachable.
const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150', {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const delay = Math.min(5000 * 2 ** (attempt - 1), MAX_RETRY_DELAY_MS);
    console.error(`Database connection error (attempt ${attempt}): ${error.message}. Retrying in ${delay / 1000}s`);
    setTimeout(() => connectDB(attempt + 1), delay);
  }
};

export default connectDB;
