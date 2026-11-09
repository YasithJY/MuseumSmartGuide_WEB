import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';
import Museum from '../models/Museum.js';
import Exhibit from '../models/Exhibit.js';
import Quiz from '../models/Quiz.js';
import QuizQuestion from '../models/QuizQuestion.js';
import { buildHeritageQuizzes } from './data/heritageQuizzes.js';

// Adds the per-exhibit quizzes (English, Sinhala, Tamil) for the four heritage
// exhibits to the database in MONGODB_URI. Run it after add-heritage. It
// deletes nothing else and is safe to re-run: quizzes and questions are
// upserted by their fixed IDs.
//
//   npm run add-heritage-quizzes

// Same DNS fix as config/db.js — link-local IPv6 DNS breaks mongodb+srv lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const MUSEUM_NAMES = { colombo: 'National Museum of Colombo', polonnaruwa: 'Polonnaruwa Archaeological Museum' };

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/museum150');
  console.log(`Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);

  const museumIds = {};
  for (const [key, name] of Object.entries(MUSEUM_NAMES)) {
    const museum = await Museum.findOne({ name }).select('_id');
    if (!museum) throw new Error(`Museum "${name}" not found — nothing was changed.`);
    museumIds[key] = museum._id;
  }

  const entries = buildHeritageQuizzes(museumIds);
  for (const { quiz } of entries) {
    if (!(await Exhibit.exists({ _id: quiz.exhibitId }))) {
      throw new Error(`Exhibit ${quiz.exhibitId} not found — run "npm run add-heritage" first. Nothing was changed.`);
    }
  }

  for (const { quiz: { _id, ...quizFields }, questions } of entries) {
    for (const { _id: questionId, ...questionFields } of questions) {
      await QuizQuestion.updateOne({ _id: questionId }, { $set: questionFields }, { upsert: true, runValidators: true });
    }
    await Quiz.updateOne({ _id }, { $set: quizFields }, { upsert: true, runValidators: true });
    console.log(`Quiz: ${quizFields.title} (${questions.length} questions)`);
  }

  console.log('\nDone.');
  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err.message || err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
