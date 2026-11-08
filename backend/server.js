// Load .env before anything else: config/r2.js reads the R2_* variables as
// soon as it is imported.
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

// Long-running server for local development (and any always-on host).
// On Vercel the same app runs as a serverless function instead — see api/index.js.
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
