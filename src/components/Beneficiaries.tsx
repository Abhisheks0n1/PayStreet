import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Users, Globe, Banknote } from 'lucide-react';
import { Beneficiary } from '../types';
import { beneficiaryAPI } from '../lib/api';

const Beneficiaries: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bank_account_number: '',
    country: '',
    currency: '',
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const data = await beneficiaryAPI.getBeneficiaries();
      setBeneficiaries(data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBeneficiary) {
        await beneficiaryAPI.updateBeneficiary(editingBeneficiary._id, formData);
      } else {
        await beneficiaryAPI.createBeneficiary(formData);
      }
      await fetchBeneficiaries();
      resetForm();
    } catch (error) {
      console.error('Error saving beneficiary:', error);
    }
  };

  const handleEdit = (beneficiary: Beneficiary) => {
    setEditingBeneficiary(beneficiary);
    setFormData({
      name: beneficiary.name,
      bank_account_number: beneficiary.bank_account_number,
      country: beneficiary.country,
      currency: beneficiary.currency,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this beneficiary?')) {
      try {
        await beneficiaryAPI.deleteBeneficiary(id);
        await fetchBeneficiaries();
      } catch (error) {
        console.error('Error deleting beneficiary:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bank_account_number: '',
      country: '',
      currency: '',
    });
    setEditingBeneficiary(null);
    setShowForm(false);
  };

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'SGD'];
  const countries = ['United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Japan', 'Singapore', 'Germany', 'France'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Beneficiaries</h1>
          <p className="text-sm text-gray-600">Manage your payment recipients</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Beneficiary
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {editingBeneficiary ? 'Edit Beneficiary' : 'Add New Beneficiary'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={formData.bank_account_number}
                  onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  required
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Currency</option>
                  {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {editingBeneficiary ? 'Update' : 'Add'} Beneficiary
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Beneficiaries
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {beneficiaries.length} recipient{beneficiaries.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading beneficiaries...</p>
            </div>
          ) : beneficiaries.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No beneficiaries</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first payment recipient.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {beneficiaries.map((beneficiary) => (
                <div key={beneficiary._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{beneficiary.name}</h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Banknote className="h-4 w-4 mr-2" />
                          {beneficiary.bank_account_number}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Globe className="h-4 w-4 mr-2" />
                          {beneficiary.country} ({beneficiary.currency})
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(beneficiary)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(beneficiary._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Beneficiaries;