import React, { useEffect, useState } from 'react';
import { Send, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { Beneficiary, TransferData } from '../types';
import { beneficiaryAPI, transactionAPI } from '../lib/api';

const Transfer: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    beneficiary_id: '',
    source_amount: '',
    source_currency: 'USD',
    target_currency: '',
  });
  const [fxData, setFxData] = useState<{ rate: number; converted_amount: number } | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [transferResult, setTransferResult] = useState<any>(null);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const data = await beneficiaryAPI.getBeneficiaries();
      setBeneficiaries(data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  };

  const handleBeneficiarySelect = (beneficiaryId: string) => {
    const beneficiary = beneficiaries.find(b => b._id === beneficiaryId);
    if (beneficiary) {
      setSelectedBeneficiary(beneficiary);
      setFormData({
        ...formData,
        beneficiary_id: beneficiaryId,
        target_currency: beneficiary.currency,
      });
    }
  };

  const calculateFX = async () => {
    if (!formData.source_amount || !formData.target_currency) return;

    setLoading(true);
    try {
      const data = await transactionAPI.getFXRate(
        formData.source_currency,
        formData.target_currency,
        parseFloat(formData.source_amount)
      );
      setFxData(data);
    } catch (error) {
      console.error('Error calculating FX:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && formData.beneficiary_id && formData.source_amount) {
      calculateFX();
      setStep(2);
    }
  };

  const handleConfirm = async () => {
    if (!fxData) return;

    setLoading(true);
    try {
      const transferData: TransferData = {
        beneficiary_id: formData.beneficiary_id,
        source_amount: parseFloat(formData.source_amount),
        source_currency: formData.source_currency,
        target_currency: formData.target_currency,
      };
      
      const result = await transactionAPI.createTransfer(transferData);
      setTransferResult(result);
      setStep(3);
    } catch (error) {
      console.error('Error creating transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      beneficiary_id: '',
      source_amount: '',
      source_currency: 'USD',
      target_currency: '',
    });
    setFxData(null);
    setSelectedBeneficiary(null);
    setTransferResult(null);
  };

  const fee = fxData ? (parseFloat(formData.source_amount) * 0.02 + 5) : 0; // 2% + $5 fixed fee

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
        <p className="text-sm text-gray-600">Transfer funds to your beneficiaries</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Progress Indicator */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium">
              {step === 1 && 'Enter Transfer Details'}
              {step === 2 && 'Review & Confirm'}
              {step === 3 && 'Transfer Complete'}
            </h3>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Beneficiary
                </label>
                <select
                  value={formData.beneficiary_id}
                  onChange={(e) => handleBeneficiarySelect(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Choose a beneficiary</option>
                  {beneficiaries.map((beneficiary) => (
                    <option key={beneficiary._id} value={beneficiary._id}>
                      {beneficiary.name} - {beneficiary.country} ({beneficiary.currency})
                    </option>
                  ))}
                </select>
                {beneficiaries.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    No beneficiaries found. Please add a beneficiary first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.source_amount}
                    onChange={(e) => setFormData({ ...formData, source_amount: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Currency
                  </label>
                  <select
                    value={formData.source_currency}
                    onChange={(e) => setFormData({ ...formData, source_currency: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!formData.beneficiary_id || !formData.source_amount}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate & Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Transfer Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{selectedBeneficiary?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">You send:</span>
                    <span className="font-medium">
                      {formData.source_amount} {formData.source_currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer fee:</span>
                    <span className="font-medium">${fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exchange rate:</span>
                    <span className="font-medium">
                      1 {formData.source_currency} = {fxData?.rate.toFixed(4)} {formData.target_currency}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Recipient gets:</span>
                      <span>
                        {fxData?.converted_amount.toFixed(2)} {formData.target_currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <p className="text-sm text-amber-700">
                  Please review all details carefully. This transaction cannot be reversed once confirmed.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Processing...' : 'Confirm Transfer'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && transferResult && (
            <div className="text-center space-y-6">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">Transfer Initiated!</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Your money transfer has been successfully initiated and is being processed.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h4 className="font-medium text-gray-900 mb-3">Transaction Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono">{transferResult._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-yellow-600 capitalize">
                      {transferResult.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Sent:</span>
                    <span className="font-medium">
                      ${transferResult.source_amount} {transferResult.source_currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Received:</span>
                    <span className="font-medium">
                      {transferResult.target_amount.toFixed(2)} {transferResult.target_currency}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Another Transfer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfer;