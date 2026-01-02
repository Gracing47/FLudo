'use client';

import { useWallet } from '@/hooks/useWallet';

export default function WalletConnect() {
  const { wallet, connect, disconnect, loading, error } = useWallet();

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Flare Network Connection</h2>
      
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
          {error}
        </div>
      )}

      {!wallet.connected ? (
        <button
          onClick={connect}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Address:</span>{' '}
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Balance:</span>{' '}
            {wallet.balance ? parseFloat(wallet.balance).toFixed(4) : '0'} FLR
          </div>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Connected to Coston2 Testnet
      </div>
    </div>
  );
}
