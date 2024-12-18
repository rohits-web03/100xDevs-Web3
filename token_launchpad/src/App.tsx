import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import TokenLaunchPad from './components/TokenLaunchPad';

function App() {
  return (
    <div className='h-screen bg-black text-white'>
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <div className='flex justify-between px-16 py-6'>
                <p className='text-2xl font-bold'>Token Launchpad</p>
                <div className='flex justify-center gap-8'>
                  <WalletMultiButton />
                  <WalletDisconnectButton />
                </div>
              </div>
              <TokenLaunchPad></TokenLaunchPad>
            </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default App;
