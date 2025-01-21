// pages/api/words/addWord.js
import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/dbConnect';
import Word from '../../../models/Word';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  const { word, definition, synonyms } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const newWord = new Word({
    userId: decoded.userId,
    word,
    definition,
    synonyms,
  });

  await newWord.save();
  res.status(201).json({ message: 'Word added successfully' });
}
