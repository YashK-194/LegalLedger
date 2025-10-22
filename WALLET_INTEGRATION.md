# Wallet Integration & NFT Minting Guide

## Overview

This application now supports MetaMask wallet connection and NFT minting through smart contract interaction.

## Features Implemented

### 1. Wallet Connection Hook (`/src/app/hooks/useWallet.js`)

-   Auto-detects if wallet is already connected
-   Handles wallet connection/disconnection
-   Manages contract instance with ethers.js
-   Listens for account and network changes
-   Provides error handling

### 2. Wallet Connect Component (`/src/app/components/WalletConnect.jsx`)

-   Displays connection status
-   Shows connected account address
-   Connect/Disconnect buttons
-   Error messages

### 3. Enhanced MintNFT Component (`/src/app/components/MintNFT.jsx`)

-   Validates wallet connection before minting
-   Validates receiver address and metadata URL
-   Calls smart contract `mintNFT` function
-   Shows transaction status and hash
-   Displays minted token ID
-   Visual status indicators for all requirements

## How to Use

### Step 1: Start the Application

\`\`\`bash
npm run dev
\`\`\`

### Step 2: Connect Your Wallet

1. Click "Connect Wallet" button
2. Approve the connection in MetaMask
3. Your account address will be displayed

### Step 3: Fill in Metadata

1. Enter document metadata in the form
2. Enter the receiver's wallet address
3. Click "Upload Metadata to Pinata"
4. Wait for the IPFS URL to be generated

### Step 4: Mint NFT

1. Ensure all three checkmarks are green:
    - ✓ Wallet Connected
    - ✓ Receiver Address Set
    - ✓ Metadata URL Ready
2. Click "Mint NFT"
3. Approve the transaction in MetaMask
4. Wait for confirmation
5. Token ID will be displayed on success

## Contract Details

-   **Contract Address**: `0xba2f4fA1430d10287fcfAfAdFff667D55481aB60`
-   **Function Called**: `mintNFT(address to, string uri)`
-   **Network**: (Make sure MetaMask is on the correct network)

## State Management

The application uses top-level state management in `page.js`:

-   `account`: Connected wallet address
-   `contract`: Ethers.js contract instance
-   `receiverAdd`: NFT recipient address
-   `metadataUrl`: IPFS metadata URL

These states are passed down to child components as props.

## Troubleshooting

### "Please install MetaMask"

-   Install MetaMask browser extension
-   Refresh the page

### "Please connect your wallet first"

-   Click the "Connect Wallet" button
-   Approve the connection in MetaMask popup

### Transaction fails

-   Check you're on the correct network
-   Ensure you have enough gas fees
-   Verify the receiver address is valid
-   Check console logs for detailed error messages

## Console Logs

The application provides detailed console logging:

-   🚀 Mint process started
-   📝 Contract function called
-   ⏳ Transaction submitted/waiting
-   ✅ Transaction confirmed
-   🎉 NFT minted with token ID
-   ❌ Error messages

## File Structure

\`\`\`
src/app/
├── hooks/
│ └── useWallet.js # Wallet connection logic
├── components/
│ ├── WalletConnect.jsx # Wallet UI component
│ ├── MintNFT.jsx # Minting UI and logic
│ ├── MetadataInputForm.jsx # Form for metadata
│ └── UploadMetadataToPinata.jsx # IPFS upload
├── contract/
│ └── ContractDetails.jsx # Contract ABI and address
└── page.js # Main page with state management
\`\`\`

## Next Steps

-   Add network switching functionality
-   Display transaction on block explorer
-   Add loading states for wallet detection
-   Implement transaction history
-   Add ENS name resolution for addresses
