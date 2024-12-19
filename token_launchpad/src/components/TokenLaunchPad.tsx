import { createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";

const TokenLaunchPad = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const createToken = async()=>{
    const keypair = Keypair.generate();
    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const decimal=9;
    if(wallet!==null){
      const transaction = new Transaction().add(
          SystemProgram.createAccount({
              fromPubkey: wallet.publicKey,
              newAccountPubkey: keypair.publicKey,
              space: MINT_SIZE,
              lamports,
              programId: TOKEN_PROGRAM_ID,
          }),
          createInitializeMint2Instruction(keypair.publicKey, decimal, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID),
      );

      transaction.feePayer=wallet.publicKey;
      const recentBlockhash=await connection.getLatestBlockhash();
      transaction.recentBlockhash=recentBlockhash.blockhash;
      transaction.partialSign(keypair);
      const response=await wallet.sendTransaction(transaction,connection);
      console.log(response);
    }
  }

  return (
    <div className="w-1/2 h-1/2 flex flex-col justify-center items-center gap-6">
      <button
        onClick={createToken}
        className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md"
      >
        Create Token
      </button>
    </div>
  )
}

export default TokenLaunchPad