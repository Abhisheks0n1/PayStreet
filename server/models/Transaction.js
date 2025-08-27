import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  beneficiary_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Beneficiary',
    required: true,
  },
  source_amount: {
    type: Number,
    required: true,
  },
  target_amount: {
    type: Number,
    required: true,
  },
  source_currency: {
    type: String,
    required: true,
  },
  target_currency: {
    type: String,
    required: true,
  },
  fx_rate: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  is_high_risk: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Transaction', transactionSchema);