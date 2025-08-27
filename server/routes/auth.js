import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);


    const accountNumber = uuidv4();

   
    const user = new User({
      full_name,
      email,
      password: hashedPassword,
      account_number: accountNumber,
    });

    await user.save();

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: 'Login successful',
      user,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

export default router;