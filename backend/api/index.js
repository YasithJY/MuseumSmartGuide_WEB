import app from '../app.js';
import { connectOnce } from '../config/db.js';

// Vercel serverless entry point. vercel.json rewrites every path here, and
// req.url keeps the original path (/api/museums, /uploads/x.jpg, ...), so the
// Express routes match exactly as they do in server.js.
export default async function handler(req, res) {
  // Static files don't need the database.
  if (!req.url.startsWith('/uploads/')) {
    try {
      await connectOnce();
    } catch (error) {
      console.error(`Database connection error: ${error.message}`);
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'Database unavailable, please try again.' }));
      return;
    }
  }
  return app(req, res);
}
