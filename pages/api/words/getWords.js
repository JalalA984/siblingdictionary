// pages/api/words/getWords.js
import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/dbConnect';
import Word from '../../../models/Word';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  await dbConnect();

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const words = await Word.find({ userId: decoded.userId });
  res.status(200).json(words);
}