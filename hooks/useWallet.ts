'use client';

import { useState, useCallback, useEffect } from 'react';
import { connectWallet, disconnectWallet, WalletState } from '@/lib/web3';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: null,
    connected: false,
    chainId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const walletState = await connectWallet();
      setWallet(walletState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setWallet({
      address: null,
      balance: null,
      connected: false,
      chainId: null,
    });
  }, []);

  useEffect(() => {
    // Check if already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connect();
        }
      });

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          connect();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [connect, disconnect]);

  return { wallet, connect, disconnect, loading, error };
}
