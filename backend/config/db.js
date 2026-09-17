import mongoose from 'mongoose';
import dns from 'dns';

// Windows sometimes reports a link-local IPv6 address (fe80::1) as the DNS
// server, which Node's resolver can't query, breaking mongodb+srv lookups.
// Force a public resolver so the SRV lookup succeeds.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
