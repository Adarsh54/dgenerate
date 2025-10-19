import { Program, AnchorProvider, Idl, setProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

// Replace with your deployed program ID
export const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export const getProgram = (connection: Connection, wallet: AnchorWallet) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  setProvider(provider);

  // You'll need to import your IDL here
  // For now, we'll use a placeholder
  const idl = {} as Idl; // Replace with actual IDL
  
  return new Program(idl, PROGRAM_ID, provider);
};

export const getGameStatePDA = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('game_state')],
    PROGRAM_ID
  )[0];
};

export const getGameAuthorityPDA = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('game_authority')],
    PROGRAM_ID
  )[0];
};

