import { ethers } from 'ethers';

export const FLARE_NETWORKS = {
  mainnet: {
    chainId: '0xe', // 14
    chainName: 'Flare Mainnet',
    nativeCurrency: {
      name: 'Flare',
      symbol: 'FLR',
      decimals: 18,
    },
    rpcUrls: ['https://flare-api.flare.network/ext/C/rpc'],
    blockExplorerUrls: ['https://flare-explorer.flare.network/'],
  },
  testnet: {
    chainId: '0x72', // 114
    chainName: 'Coston2 Testnet',
    nativeCurrency: {
      name: 'Coston2 Flare',
      symbol: 'C2FLR',
      decimals: 18,
    },
    rpcUrls: ['https://coston2-api.flare.network/ext/C/rpc'],
    blockExplorerUrls: ['https://coston2-explorer.flare.network/'],
  },
};

// Use testnet by default
export const ACTIVE_NETWORK = FLARE_NETWORKS.testnet;

export interface WalletState {
  address: string | null;
  balance: string | null;
  connected: boolean;
  chainId: string | null;
}

export async function connectWallet(): Promise<WalletState> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to play.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    const network = await provider.getNetwork();

    // Try to switch to Flare network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ACTIVE_NETWORK.chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ACTIVE_NETWORK],
          });
        } catch (addError) {
          throw new Error('Failed to add Flare network to MetaMask');
        }
      } else {
        throw switchError;
      }
    }

    return {
      address,
      balance: ethers.formatEther(balance),
      connected: true,
      chainId: `0x${network.chainId.toString(16)}`,
    };
  } catch (error: any) {
    console.error('Error connecting wallet:', error);
    throw new Error(error.message || 'Failed to connect wallet');
  }
}

export async function disconnectWallet(): Promise<void> {
  // Note: MetaMask doesn't have a disconnect method
  // This is just for state management
  return Promise.resolve();
}

export async function getWalletBalance(address: string): Promise<string> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
