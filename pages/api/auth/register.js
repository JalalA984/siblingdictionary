// pages/api/auth/register.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(201).json({ token });
}