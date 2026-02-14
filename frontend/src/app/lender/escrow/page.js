'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Lock,
  Unlock,
  Info
} from 'lucide-react';

export default function EscrowFunding() {
  // Mock data - TODO: Replace with actual API calls
  const [escrowData, setEscrowData] = useState({
    escrowBalance: '15000',
    availableBalance: '8000',
    lockedBalance: '7000',
    walletBalance: '5000',
    pendingWithdrawals: '0',
    transactions: [
      {
        id: 'TXN-E001',
        type: 'deposit',
        amount: '5000',
        date: '2026-02-10',
        status: 'Confirmed',
        txHash: '0xabcd1234efgh5678'
      },
      {
        id: 'TXN-E002',
        type: 'withdrawal',
        amount: '1000',
        date: '2026-02-08',
        status: 'Confirmed',
        txHash: '0x9876fedc5432abcd'
      },
      {
        id: 'TXN-E003',
        type: 'deposit',
        amount: '3000',
        date: '2026-02-05',
        status: 'Confirmed',
        txHash: '0x1111aaaa2222bbbb'
      },
      {
        id: 'TXN-E004',
        type: 'loan_disbursement',
        amount: '2000',
        date: '2026-02-03',
        status: 'Confirmed',
        txHash: '0x3333cccc4444dddd',
        loanId: 'LOAN-L001'
      },
      {
        id: 'TXN-E005',
        type: 'repayment_received',
        amount: '1200',
        date: '2026-02-01',
        status: 'Confirmed',
        txHash: '0x5555eeee6666ffff',
        loanId: 'LOAN-L002'
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('deposit'); // deposit, withdraw
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'confirmed', 'error'
  const [error, setError] = useState('');

  const handleDeposit = async () => {
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(escrowData.walletBalance)) {
      setError('Insufficient wallet balance');
      return;
    }

    setTransactionStatus('pending');

    // TODO: Call smart contract to deposit to escrow
    // const tx = await escrowContract.deposit({
    //   amount: ethers.parseUnits(amount, 6) // Assuming USDC with 6 decimals
    // });
    // await tx.wait();

    // Mock transaction delay
    setTimeout(() => {
      setTransactionStatus('confirmed');
      
      // Update local state
      const newEscrowBalance = parseFloat(escrowData.escrowBalance) + parseFloat(amount);
      const newAvailableBalance = parseFloat(escrowData.availableBalance) + parseFloat(amount);
      const newWalletBalance = parseFloat(escrowData.walletBalance) - parseFloat(amount);

      setEscrowData({
        ...escrowData,
        escrowBalance: newEscrowBalance.toString(),
        availableBalance: newAvailableBalance.toString(),
        walletBalance: newWalletBalance.toString(),
        transactions: [
          {
            id: `TXN-E${Date.now()}`,
            type: 'deposit',
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            status: 'Confirmed',
            txHash: '0x' + Math.random().toString(36).substring(2, 18)
          },
          ...escrowData.transactions
        ]
      });

      setAmount('');

      setTimeout(() => {
        setTransactionStatus(null);
      }, 3000);
    }, 3000);
  };

  const handleWithdraw = async () => {
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(escrowData.availableBalance)) {
      setError(`Amount exceeds available balance ($${escrowData.availableBalance})`);
      return;
    }

    setTransactionStatus('pending');

    // TODO: Call smart contract to withdraw from escrow
    // const tx = await escrowContract.withdraw({
    //   amount: ethers.parseUnits(amount, 6)
    // });
    // await tx.wait();

    // Mock transaction delay
    setTimeout(() => {
      setTransactionStatus('confirmed');
      
      // Update local state
      const newEscrowBalance = parseFloat(escrowData.escrowBalance) - parseFloat(amount);
      const newAvailableBalance = parseFloat(escrowData.availableBalance) - parseFloat(amount);
      const newWalletBalance = parseFloat(escrowData.walletBalance) + parseFloat(amount);

      setEscrowData({
        ...escrowData,
        escrowBalance: newEscrowBalance.toString(),
        availableBalance: newAvailableBalance.toString(),
        walletBalance: newWalletBalance.toString(),
        transactions: [
          {
            id: `TXN-E${Date.now()}`,
            type: 'withdrawal',
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            status: 'Confirmed',
            txHash: '0x' + Math.random().toString(36).substring(2, 18)
          },
          ...escrowData.transactions
        ]
      });

      setAmount('');

      setTimeout(() => {
        setTransactionStatus(null);
      }, 3000);
    }, 3000);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-blue-400" />;
      case 'loan_disbursement':
        return <ArrowUpRight className="w-4 h-4 text-orange-400" />;
      case 'repayment_received':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'loan_disbursement':
        return 'Loan Funded';
      case 'repayment_received':
        return 'Repayment';
      default:
        return 'Transaction';
    }
  };

  // Transaction Status Modal
  if (transactionStatus === 'pending' || transactionStatus === 'confirmed') {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          {transactionStatus === 'pending' && (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Processing Transaction</h2>
              <p className="text-gray-400">Please wait while we confirm your {activeTab} on the blockchain...</p>
            </>
          )}
          
          {transactionStatus === 'confirmed' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-400">Transaction Successful!</h2>
              <p className="text-gray-400 mb-4">
                Your {activeTab} of ${amount} has been processed successfully.
              </p>
              <p className="text-sm text-gray-500">Updating balances...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/lender"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Escrow Management</h1>
          <p className="text-gray-400">Deposit or withdraw funds from your escrow account</p>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Total Escrow</h3>
            </div>
            <p className="text-3xl font-bold">${escrowData.escrowBalance}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Unlock className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-sm">Available</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">${escrowData.availableBalance}</p>
            <p className="text-xs text-gray-500 mt-1">Can withdraw</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="font-semibold text-sm">Locked</h3>
            </div>
            <p className="text-3xl font-bold text-orange-400">${escrowData.lockedBalance}</p>
            <p className="text-xs text-gray-500 mt-1">In active loans</p>
          </div>
        </div>

        {/* Deposit/Withdraw Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-zinc-800">
            <button
              onClick={() => {
                setActiveTab('deposit');
                setError('');
                setAmount('');
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'deposit'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => {
                setActiveTab('withdraw');
                setError('');
                setAmount('');
              }}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'withdraw'
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* Wallet Balance Info */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Your Wallet Balance</p>
                  <p className="font-semibold text-lg">${escrowData.walletBalance} USDC</p>
                </div>
              </div>
              {activeTab === 'withdraw' && (
                <div className="text-right">
                  <p className="text-sm text-gray-400">Available to Withdraw</p>
                  <p className="font-semibold text-lg text-green-400">${escrowData.availableBalance}</p>
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdrawal Amount'} (USDC)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              {activeTab === 'deposit' && (
                <>
                  <button
                    onClick={() => setAmount('1000')}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-zinc-700 transition-colors"
                  >
                    $1,000
                  </button>
                  <button
                    onClick={() => setAmount('5000')}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-zinc-700 transition-colors"
                  >
                    $5,000
                  </button>
                  <button
                    onClick={() => setAmount(escrowData.walletBalance)}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-zinc-700 transition-colors"
                  >
                    Max
                  </button>
                </>
              )}
              {activeTab === 'withdraw' && (
                <>
                  <button
                    onClick={() => setAmount('1000')}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-zinc-700 transition-colors"
                  >
                    $1,000
                  </button>
                  <button
                    onClick={() => setAmount(escrowData.availableBalance)}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-zinc-700 transition-colors"
                  >
                    Max Available
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className={`${
            activeTab === 'deposit' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-yellow-500/10 border-yellow-500/20'
          } border rounded-lg p-4 mb-6`}>
            <p className={`text-sm flex items-start gap-2 ${
              activeTab === 'deposit' ? 'text-blue-400' : 'text-yellow-400'
            }`}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {activeTab === 'deposit' ? (
                'Deposited funds will be available for auto-lending based on your risk configuration'
              ) : (
                'You can only withdraw funds that are not locked in active loans'
              )}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full px-6 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {activeTab === 'deposit' ? 'Deposit to Escrow' : 'Withdraw from Escrow'}
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Transaction History</h2>

          {escrowData.transactions.length > 0 ? (
            <div className="space-y-3">
              {escrowData.transactions.map((txn) => (
                <div key={txn.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center">
                        {getTransactionIcon(txn.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{getTransactionLabel(txn.type)}</p>
                          {txn.loanId && (
                            <Link
                              href={`/lender/loan/${txn.loanId}`}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              {txn.loanId}
                            </Link>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{new Date(txn.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        txn.type === 'deposit' || txn.type === 'repayment_received'
                          ? 'text-green-400'
                          : 'text-blue-400'
                      }`}>
                        {txn.type === 'deposit' || txn.type === 'repayment_received' ? '+' : '-'}${txn.amount}
                      </p>
                      <a
                        href={`https://etherscan.io/tx/${txn.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors justify-end"
                      >
                        View TX <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
