import axios from 'axios';
import FXRate from '../models/FXRate.js';

const CACHE_DURATION = 15 * 60 * 1000; 

export class FXService {
  static async getFXRate(fromCurrency, toCurrency, amount = 1) {
    try {
      
      const cachedRate = await FXRate.findOne({
        from_currency: fromCurrency,
        to_currency: toCurrency,
        cached_at: { $gte: new Date(Date.now() - CACHE_DURATION) }
      });

      if (cachedRate) {
        return {
          rate: cachedRate.rate,
          converted_amount: amount * cachedRate.rate
        };
      }

   
      const response = await axios.get(
        `https://api.exchangerate.host/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch exchange rate');
      }

      const rate = response.data.info.rate;
      const convertedAmount = response.data.result;

      await FXRate.findOneAndUpdate(
        { from_currency: fromCurrency, to_currency: toCurrency },
        { rate, cached_at: new Date() },
        { upsert: true }
      );

      return {
        rate,
        converted_amount: convertedAmount
      };
    } catch (error) {
      console.error('FX Service Error:', error);
      
  
      const fallbackRate = await FXRate.findOne({
        from_currency: fromCurrency,
        to_currency: toCurrency
      }).sort({ cached_at: -1 });

      if (fallbackRate) {
        console.log('Using fallback cached rate');
        return {
          rate: fallbackRate.rate,
          converted_amount: amount * fallbackRate.rate
        };
      }

      throw new Error('Unable to fetch exchange rate');
    }
  }
}