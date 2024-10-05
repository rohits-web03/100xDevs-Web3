import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function RequestAirdrop() {
    const [amount, setAmount] = useState<string>("");

    const wallet = useWallet();
    const { connection } = useConnection();

    async function requestAirdrop() {
        if (!wallet.publicKey) {
            alert("Wallet is not connected.");
            setAmount('');
            return;
        }

        const numericAmount = parseFloat(amount) || 0; 
        try {
            const signature = await connection.requestAirdrop(
                wallet.publicKey, 
                numericAmount * LAMPORTS_PER_SOL
            );
            alert(`Airdropped ${numericAmount} SOL to ${wallet.publicKey.toBase58()} with tx signature: ${signature}`);
        } catch (error) {
            console.error(error);
            alert("Airdrop failed.");
        } finally {
            setAmount('');
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and decimal points
        if (/^\d*\.?\d*$/.test(value) || value === "") {
            setAmount(value);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-6">
            <Input
                type="text"
                placeholder="Enter Amount in Sol"
                value={amount}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <Button onClick={requestAirdrop}>Request Airdrop</Button>
        </div>
    );
}
