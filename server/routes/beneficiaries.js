import express from 'express';
import Beneficiary from '../models/Beneficiary.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.json(beneficiaries);
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const { name, bank_account_number, country, currency } = req.body;

    const beneficiary = new Beneficiary({
      user_id: req.user._id,
      name,
      bank_account_number,
      country,
      currency,
    });

    await beneficiary.save();
    res.status(201).json(beneficiary);
  } catch (error) {
    console.error('Create beneficiary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true }
    );

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.json(beneficiary);
  } catch (error) {
    console.error('Update beneficiary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    console.error('Delete beneficiary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;