import axios from 'axios';
import { User, Beneficiary, Transaction, TransferData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(full_name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/register', { full_name, email, password });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const beneficiaryAPI = {
  async getBeneficiaries(): Promise<Beneficiary[]> {
    const response = await api.get('/beneficiaries');
    return response.data;
  },

  async createBeneficiary(data: Omit<Beneficiary, '_id' | 'user_id' | 'createdAt'>): Promise<Beneficiary> {
    const response = await api.post('/beneficiaries', data);
    return response.data;
  },

  async updateBeneficiary(id: string, data: Partial<Beneficiary>): Promise<Beneficiary> {
    const response = await api.put(`/beneficiaries/${id}`, data);
    return response.data;
  },

  async deleteBeneficiary(id: string): Promise<void> {
    await api.delete(`/beneficiaries/${id}`);
  },
};

export const transactionAPI = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await api.get('/transactions');
    return response.data;
  },

  async createTransfer(data: TransferData): Promise<Transaction> {
    const response = await api.post('/transactions/transfer', data);
    return response.data;
  },

  async getFXRate(from: string, to: string, amount: number): Promise<{ rate: number; converted_amount: number }> {
    const response = await api.get(`/fx-rates?from=${from}&to=${to}&amount=${amount}`);
    return response.data;
  },
};

export const adminAPI = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getAllTransactions(): Promise<Transaction[]> {
    const response = await api.get('/admin/transactions');
    return response.data;
  },
};