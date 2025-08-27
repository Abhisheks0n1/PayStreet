export interface User {
  _id: string;
  full_name: string;
  email: string;
  account_number: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Beneficiary {
  _id: string;
  user_id: string;
  name: string;
  bank_account_number: string;
  country: string;
  currency: string;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  user_id: string;
  beneficiary_id: string;
  beneficiary?: Beneficiary;
  user?: User;
  source_amount: number;
  target_amount: number;
  source_currency: string;
  target_currency: string;
  fx_rate: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  is_high_risk: boolean;
  createdAt: string;
}

export interface FXRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  cached_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface TransferData {
  beneficiary_id: string;
  source_amount: number;
  source_currency: string;
  target_currency: string;
}