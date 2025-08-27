import express from 'express';
import { auth } from '../middleware/auth.js';
import { FXService } from '../services/fxService.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { from, to, amount = 1 } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: 'From and to currencies are required' });
    }

    const fxData = await FXService.getFXRate(from, to, parseFloat(amount));
    res.json(fxData);
  } catch (error) {
    console.error('Get FX rate error:', error);
    res.status(500).json({ message: 'Unable to fetch exchange rate' });
  }
});

export default router;