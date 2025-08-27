import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CreditCard, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction } from '../types';
import { transactionAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await transactionAPI.getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const recentTransactions = transactions.slice(0, 5);
  const totalSent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.source_amount, 0);
  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;

  const stats = [
    {
      name: 'Total Sent',
      value: `$${totalSent.toLocaleString()}`,
      icon: DollarSign,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Transactions',
      value: totalTransactions.toString(),
      icon: CreditCard,
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Completed',
      value: completedTransactions.toString(),
      icon: TrendingUp,
      change: '98%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.full_name}
        </h1>
        <div className="text-sm text-gray-500">
          Account: {user?.account_number}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <ArrowUpRight className="self-center flex-shrink-0 h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="self-center flex-shrink-0 h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Transactions
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your latest money transfers and payments
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">Loading transactions...</p>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by sending your first payment.
              </p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <li key={transaction._id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.beneficiary?.name || 'Unknown Beneficiary'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(transaction.createdAt), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${transaction.source_amount.toLocaleString()} {transaction.source_currency}
                        </p>
                        <p className={`text-xs ${
                          transaction.status === 'completed' ? 'text-green-600' :
                          transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;