// models/Word.js
import mongoose from 'mongoose';

const WordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  word: { type: String, required: true },
  definition: { type: String, required: true },
  synonyms: [String],
  dateAdded: { type: Date, default: Date.now },
});

export default mongoose.models.Word || mongoose.model('Word', WordSchema);