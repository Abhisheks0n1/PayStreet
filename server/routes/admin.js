import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();


router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('beneficiary_id', 'name country currency')
      .populate('user_id', 'full_name email')
      .sort({ createdAt: -1 });

    const transformedTransactions = transactions.map(transaction => ({
      ...transaction.toObject(),
      beneficiary: transaction.beneficiary_id,
      user: transaction.user_id,
    }));

    res.json(transformedTransactions);
  } catch (error) {
    console.error('Get admin transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;