import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bank_account_number: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Beneficiary', beneficiarySchema);