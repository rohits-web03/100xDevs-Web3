import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { RequestAirdrop } from './components/Airdrop';

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
      <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>
                <div className='w-full h-screen px-8 py-6 flex justify-center items-center flex-col gap-6'>
                  <div className='w-1/2 flex justify-between items-center'>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                  </div>
                  <div className='w-1/2 h-fit bg-neutral-500 px-8 py-4 rounded-md'>
                    <RequestAirdrop />
                  </div>
                </div>
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
  );
}

export default App