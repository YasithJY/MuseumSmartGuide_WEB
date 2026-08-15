import mongoose from 'mongoose';

// Language-specific content for a category
const categoryTranslationSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  // Multilingual translations: Sinhala (si) and Tamil (ta)
  translations: {
    si: { type: categoryTranslationSchema, default: () => ({}) },
    ta: { type: categoryTranslationSchema, default: () => ({}) }
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;

