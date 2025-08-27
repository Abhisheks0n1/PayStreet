import mongoose from 'mongoose';

const fxRateSchema = new mongoose.Schema({
  from_currency: {
    type: String,
    required: true,
  },
  to_currency: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  cached_at: {
    type: Date,
    default: Date.now,
  },
});


fxRateSchema.index({ from_currency: 1, to_currency: 1 });

export default mongoose.model('FXRate', fxRateSchema);