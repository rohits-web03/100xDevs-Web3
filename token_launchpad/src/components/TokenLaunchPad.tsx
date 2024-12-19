import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, createMintToInstruction, createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useState } from "react"

const TokenLaunchPad = () => {
  const [name,setName]=useState('');
  const [symbol,setSymbol]=useState('');
  // const [imageUrl,setImageUrl]=useState('');
  const [initialSupply,setInitialSupply]=useState(0);
  const wallet = useWallet();
  const { connection } = useConnection();

  const createToken = async()=>{
    if (!wallet.publicKey) {
      throw new Error("Wallet is not connected.");
    }
    const mintKeypair = Keypair.generate();
    const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        symbol: symbol,
        uri: 'https://cdn.100xdevs.com/metadata.json',
        additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: mintKeypair.publicKey,
            metadata: mintKeypair.publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: wallet.publicKey,
            updateAuthority: wallet.publicKey,
        }),
    );
        
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);

    const tx1 = await wallet.sendTransaction(transaction, connection);
    console.log(tx1);
    
    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID,
  );
  
  console.log(associatedToken.toBase58());
  
  const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedToken,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID,
      ),
  );
  
  await wallet.sendTransaction(transaction2, connection);
  
  const transaction3 = new Transaction().add(
      createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, initialSupply, [], TOKEN_2022_PROGRAM_ID)
  );
  
  await wallet.sendTransaction(transaction3, connection);

  setName('');
  setSymbol('');
  setInitialSupply(0);
  }

  return (
    <div className="w-1/2 h-1/2 flex flex-col justify-center items-center gap-6">
      <input
       type="text" 
       value={name} 
       placeholder="Enter name of token"
       onChange={(e)=>setName(e.target.value)}
       className="bg-neutral-700 px-4 py-2 rounded-md"
      />
      <input
       type="text" 
       value={symbol} 
       placeholder="Enter Symbol of token"
       onChange={(e)=>setSymbol(e.target.value)}
       className="bg-neutral-700 px-4 py-2 rounded-md"
      />
      {/* <input
       type="text" 
       value={imageUrl} 
       placeholder="Enter Image URL"
       onChange={(e)=>setImageUrl(e.target.value)}
       className="bg-neutral-700 px-4 py-2 rounded-md"
      /> */}
      <input
       type="number" 
       value={initialSupply} 
       placeholder="Enter Initial Supply"
       onChange={(e)=>setInitialSupply(Number(e.target.value))}
       className="bg-neutral-700 px-4 py-2 rounded-md"
      />
      <button
        onClick={createToken}
        className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md"
      >
        Create Token
      </button>
    </div>
  )
}

export default TokenLaunchPad;

/*
1st Test: ABCDE(ABC)
Address: 92ukZdyHKQEbvFQThm9K4UY8euwE6vPR2DHz3i2JV2c2
ATA: H5213Q1gmSgddhPgJFauR38cpy1fSF7qSKn5FA2tFXn9
*/