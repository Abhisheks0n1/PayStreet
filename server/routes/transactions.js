import express from 'express';
import Transaction from '../models/Transaction.js';
import Beneficiary from '../models/Beneficiary.js';
import { auth } from '../middleware/auth.js';
import { FXService } from '../services/fxService.js';

const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user_id: req.user._id })
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
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/transfer', auth, async (req, res) => {
  try {
    const { beneficiary_id, source_amount, source_currency, target_currency } = req.body;

   
    const beneficiary = await Beneficiary.findOne({
      _id: beneficiary_id,
      user_id: req.user._id,
    });

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

   
    const fxData = await FXService.getFXRate(source_currency, target_currency, source_amount);

    const fee = (source_amount * 0.02) + 5;


    const usdAmount = source_currency === 'USD' ? source_amount : 
      await FXService.getFXRate(source_currency, 'USD', source_amount).then(data => data.converted_amount);
    const isHighRisk = usdAmount > 10000;

   
    const transaction = new Transaction({
      user_id: req.user._id,
      beneficiary_id,
      source_amount,
      target_amount: fxData.converted_amount,
      source_currency,
      target_currency,
      fx_rate: fxData.rate,
      fee,
      status: 'completed',
      is_high_risk: isHighRisk,
    });

    await transaction.save();


    await transaction.populate('beneficiary_id', 'name country currency');
    await transaction.populate('user_id', 'full_name email');

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;