# 📜 Legal Ledger - NFT-Based Document Management System

A decentralized application (dApp) for minting, viewing, and managing legal documents as NFTs on the blockchain. Built with Next.js, Ethereum smart contracts, and IPFS storage via Pinata.

## 🌟 Features

-   **🎨 Mint NFTs**: Upload legal documents (PDFs) and metadata to create blockchain-verified NFTs
-   **🔍 View NFTs**: Fetch and display NFT details, metadata, and embedded PDF documents by token ID
-   **⚙️ Modify NFTs**: Lock documents permanently or update metadata URIs (owner-only)
-   **💼 Wallet Integration**: Connect MetaMask or other Web3 wallets using ethers.js v6
-   **☁️ IPFS Storage**: Decentralized document storage through Pinata gateway
-   **📱 Responsive UI**: Modern, tab-based interface with TailwindCSS styling

---

## 🚀 Live Demo

**⚠️ Preview Mode Notice**: The live deployment uses dummy NFT metadata due to Vercel's read-only file system. Metadata and PDF uploads won't persist between sessions, but **NFT minting still works perfectly**!

For full functionality (document uploads, dynamic metadata), clone and run locally.

---

## 📋 Table of Contents

-   [Tech Stack](#-tech-stack)
-   [Project Structure](#-project-structure)
-   [File Explanations](#-file-explanations)
-   [Installation](#-installation)
-   [Environment Variables](#-environment-variables)
-   [Smart Contract](#-smart-contract)
-   [Usage](#-usage)
-   [API Routes](#-api-routes)
-   [Contributing](#-contributing)

---

## 🛠 Tech Stack

| Technology       | Version | Purpose                         |
| ---------------- | ------- | ------------------------------- |
| **Next.js**      | 15.5.5  | React framework with App Router |
| **React**        | 19.1.0  | UI library                      |
| **Ethers.js**    | 6.15.0  | Ethereum blockchain interaction |
| **Tailwind CSS** | 4.x     | Utility-first CSS framework     |
| **Pinata**       | 2.5.1   | IPFS pinning service            |
| **Solidity**     | 0.8.30  | Smart contract language         |
| **OpenZeppelin** | -       | ERC721 implementation           |

---

## 📁 Project Structure

```
legal-ledger/
├── src/
│   └── app/
│       ├── api/                      # Backend API routes
│       │   ├── pinata-upload-json/   # Upload metadata JSON to IPFS
│       │   ├── pinata-upload-pdf/    # Upload PDF to IPFS
│       │   ├── save-metadata/        # Save metadata locally
│       │   └── upload-pdf/           # Save PDF locally
│       ├── components/               # React components
│       │   ├── FetchNFT.jsx          # View NFT details
│       │   ├── MetadataInputForm.jsx # Input form for metadata
│       │   ├── MintNFT.jsx           # Mint NFT component
│       │   ├── ModifyNFT.jsx         # Lock/update NFTs
│       │   ├── UploadMetadataToPinata.jsx
│       │   ├── UploadPDF.jsx         # PDF file upload
│       │   ├── UploadPDFToPinata.jsx
│       │   └── WalletConnect.jsx     # Wallet connection UI
│       ├── contract/                 # Smart contracts & config
│       │   ├── ContractDetails.jsx   # Contract address & ABI
│       │   ├── LegalLedger.sol       # Main NFT contract
│       │   └── VerificationRegistry.sol
│       ├── hooks/                    # Custom React hooks
│       │   └── useWallet.js          # Wallet connection logic
│       ├── globals.css               # Global styles
│       ├── layout.js                 # Root layout
│       └── page.js                   # Main home page
├── metadata/                         # Local storage for uploads
│   ├── data.json                     # Metadata JSON
│   └── document.pdf                  # Uploaded PDF
├── package.json                      # Dependencies
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.mjs               # Tailwind configuration
├── postcss.config.mjs                # PostCSS configuration
├── jsconfig.json                     # JavaScript config
└── README.md                         # This file
```

---

## 📄 File Explanations

### **Root Configuration Files**

#### `package.json`

Defines project dependencies and scripts:

-   **Dependencies**: Next.js, React, ethers.js, Pinata, form-data, dotenv
-   **Dev Dependencies**: TailwindCSS
-   **Scripts**: `dev` (development), `build` (production build), `start` (production server)

#### `next.config.mjs`

Next.js configuration file. Currently uses default settings.

#### `tailwind.config.mjs` & `postcss.config.mjs`

TailwindCSS v4 configuration files for styling.

#### `jsconfig.json`

JavaScript compiler options for better IDE support and path aliases.

---

### **Core Application Files**

#### `src/app/page.js` - Main Application Page

**Purpose**: Root page component with tab navigation and state management

**Key Features**:

-   Tab-based navigation (Mint / View / Modify NFT)
-   Wallet connection integration via `useWallet` hook
-   State management for metadata, receiver address, IPFS URLs
-   Conditional rendering based on active tab
-   Preview mode notice for hosted deployments

**State Variables**:

-   `metadata`: Stores form metadata JSON string
-   `receiverAdd`: NFT recipient wallet address
-   `metadataUrl`: IPFS URL of uploaded metadata
-   `pdfUrl`: IPFS URL of uploaded PDF document
-   `activeTab`: Current active tab ('mint' / 'view' / 'modify')

---

#### `src/app/layout.js` - Root Layout

**Purpose**: Defines HTML structure and global layout

**Features**:

-   Sets document title and metadata
-   Imports global CSS styles
-   Wraps all pages with consistent layout

---

#### `src/app/globals.css`

**Purpose**: Global styles and TailwindCSS imports

Contains TailwindCSS directives and custom global styles.

---

### **Components** (`src/app/components/`)

#### `WalletConnect.jsx`

**Purpose**: Wallet connection UI component

**Props**:

-   `account`: Connected wallet address
-   `isConnecting`: Loading state
-   `error`: Connection error message
-   `connectWallet`: Function to trigger connection
-   `disconnectWallet`: Function to disconnect
-   `isConnected`: Boolean connection status

**Features**:

-   Displays wallet connection button
-   Shows connected address (truncated)
-   Error handling UI
-   Disconnect functionality

---

#### `MetadataInputForm.jsx`

**Purpose**: Form for inputting NFT metadata

**Props**:

-   `setMetadata`: Function to update parent metadata state
-   `setReceiverAdd`: Function to set recipient address
-   `pdfUrl`: IPFS URL of uploaded PDF (auto-populates file_url)

**Form Fields**:

-   Name, Description, Document Type
-   Issued By, Issued To
-   Issuer Address, Issued To Address
-   Jurisdiction, Legal References
-   Document Details (page count, format, language, notary stamp)
-   Image URL (default IPFS image pre-filled)
-   File URL (auto-populated from pdfUrl, read-only when set)

**Features**:

-   Auto-populates `file_url` when PDF is uploaded
-   Shows read-only green box for auto-filled document URL
-   Converts form data to JSON metadata structure
-   Validates receiver address format

---

#### `UploadPDF.jsx`

**Purpose**: Client-side PDF file upload component

**Features**:

-   File input for PDF selection
-   Uploads PDF to `/api/upload-pdf` endpoint
-   Saves file locally as `/metadata/document.pdf`
-   Shows success/error messages

**Important**: Only works locally due to server-side file writing.

---

#### `UploadPDFToPinata.jsx`

**Purpose**: Uploads local PDF to IPFS via Pinata

**Props**:

-   `setPdfUrl`: Function to update parent pdfUrl state

**Features**:

-   Reads `/metadata/document.pdf` from server
-   Uploads to Pinata IPFS
-   Returns IPFS gateway URL with `https://` prefix
-   Auto-triggers metadata form update

---

#### `UploadMetadataToPinata.jsx`

**Purpose**: Uploads metadata JSON to IPFS

**Props**:

-   `setMetadataUrl`: Function to update parent metadataUrl state

**Features**:

-   Reads `/metadata/data.json` from server
-   Uploads JSON to Pinata IPFS
-   Returns IPFS gateway URL
-   Displays upload status

---

#### `MintNFT.jsx`

**Purpose**: Mints NFT with metadata URI on blockchain

**Props**:

-   `receiverAdd`: Recipient wallet address
-   `metadataUrl`: IPFS metadata URL
-   `contract`: Ethers.js contract instance
-   `account`: Connected wallet address
-   `connectWallet`: Function to connect wallet

**Features**:

-   Validates inputs (receiver address, metadata URL)
-   Network detection (requires Sepolia testnet)
-   Calls smart contract `mintNFT()` function
-   Parses `DocumentMinted` event to extract token ID
-   Displays transaction hash and token ID
-   Shows MetaMask import instructions with contract address
-   Comprehensive error handling

**Smart Contract Interaction**:

```javascript
const tx = await contract.mintNFT(receiverAdd, metadataUrl);
const receipt = await tx.wait();
// Extracts tokenId from DocumentMinted event
```

---

#### `FetchNFT.jsx`

**Purpose**: Fetch and display NFT details by token ID

**Props**:

-   `contract`: Ethers.js contract instance
-   `account`: Connected wallet address

**Features**:

-   Input field for token ID
-   Fetches on-chain data: owner, minter, token URI, lock status, timestamp
-   Fetches metadata JSON from IPFS
-   Displays all metadata fields:
    -   Basic info (name, description, document type)
    -   Parties (issued by/to, addresses)
    -   Jurisdiction, legal references
    -   Document details (page count, format, language, notary stamp)
    -   Attributes array
-   **Embedded PDF viewer** with 800px iframe
-   Fallback link if iframe doesn't load
-   Copy to clipboard functionality
-   Expandable full JSON view

**Smart Contract Calls**:

```javascript
const owner = await contract.ownerOf(tokenId);
const uri = await contract.tokenURI(tokenId);
const docMetadata = await contract.documents(tokenId);
```

---

#### `ModifyNFT.jsx`

**Purpose**: Lock documents or update token URIs (owner-only)

**Props**:

-   `contract`: Ethers.js contract instance
-   `account`: Connected wallet address

**Features**:

-   Fetch NFT current state by token ID
-   **Update Token URI**:
    -   Only works if document is unlocked
    -   Only contract owner can update
    -   Input field for new IPFS URI
    -   Calls `contract.updateDocumentURI()`
-   **Lock Document**:
    -   Permanent and irreversible action
    -   Only contract owner can lock
    -   Calls `contract.lockDocument()`
    -   Disables update functionality after locking
-   Real-time status display (🔒 Locked / 🔓 Unlocked)
-   Color-coded UI (red for locked, green for unlocked)
-   Transaction hash display
-   Comprehensive warnings about irreversibility

**Smart Contract Calls**:

```javascript
await contract.lockDocument(tokenId);
await contract.updateDocumentURI(tokenId, newURI);
```

---

### **Custom Hooks** (`src/app/hooks/`)

#### `useWallet.js`

**Purpose**: Custom React hook for wallet connection and contract initialization

**Parameters**:

-   `contractABI`: Smart contract ABI

**Returns**:

-   `account`: Connected wallet address
-   `contract`: Ethers.js contract instance
-   `isConnecting`: Loading state
-   `error`: Error message
-   `connectWallet()`: Function to connect wallet
-   `disconnectWallet()`: Function to disconnect
-   `isConnected`: Boolean connection status

**Features**:

-   Uses ethers.js v6 `BrowserProvider`
-   Auto-reconnects on page load if previously connected
-   Event listeners for account/network changes
-   Initializes contract with signer for write operations
-   Error handling for connection failures

**Implementation**:

```javascript
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(ADDRESS, contractABI, signer);
```

---

### **API Routes** (`src/app/api/`)

#### `api/upload-pdf/route.js`

**Purpose**: Save uploaded PDF file to local server

**Method**: `POST`

**Request**: FormData with PDF file

**Response**:

```json
{ "message": "PDF uploaded", "path": "/metadata/document.pdf" }
```

**Process**:

1. Receives file from FormData
2. Converts to Buffer
3. Writes to `/metadata/document.pdf`
4. Returns success message

**⚠️ Note**: Only works locally, not on Vercel (read-only file system)

---

#### `api/save-metadata/route.js`

**Purpose**: Save metadata JSON to local server

**Method**: `POST`

**Request Body**:

```json
{
	"metadata": {
		/* metadata object */
	}
}
```

**Response**:

```json
{ "message": "Metadata saved", "path": "/metadata/data.json" }
```

**Process**:

1. Receives JSON metadata
2. Writes to `/metadata/data.json`
3. Returns success message

**⚠️ Note**: Only works locally, not on Vercel

---

#### `api/pinata-upload-pdf/route.js`

**Purpose**: Upload PDF from server to Pinata IPFS

**Method**: `POST`

**Response**:

```json
{
	"ipfsUrl": "ipfs://...",
	"fullUrl": "https://gateway.pinata.cloud/ipfs/..."
}
```

**Process**:

1. Reads `/metadata/document.pdf`
2. Creates Blob with `application/pdf` type
3. Creates Web FormData (not form-data package)
4. Uploads to Pinata API with JWT auth
5. Returns IPFS hash and gateway URL

**Technical Note**: Uses Web FormData API instead of form-data package to avoid multipart boundary issues with fetch API.

---

#### `api/pinata-upload-json/route.js`

**Purpose**: Upload metadata JSON to Pinata IPFS

**Method**: `POST`

**Response**:

```json
{
	"ipfsUrl": "ipfs://...",
	"fullUrl": "https://gateway.pinata.cloud/ipfs/..."
}
```

**Process**:

1. Reads `/metadata/data.json`
2. Parses JSON content
3. Creates Blob with `application/json` type
4. Uploads to Pinata using Web FormData
5. Returns IPFS hash and gateway URL

---

### **Smart Contracts** (`src/app/contract/`)

#### `ContractDetails.jsx`

**Purpose**: Exports smart contract address and ABI

**Exports**:

-   `ADDRESS`: Deployed contract address on Sepolia
-   `ABI`: Contract ABI for ethers.js interaction

**Current Contract**: `0xba2f4fA1430d10287fcfAfAdFff667D55481aB60`

---

#### `LegalLedger.sol`

**Purpose**: Main ERC721 NFT smart contract for legal documents

**Features**:

-   Extends `ERC721Enumerable` and `Ownable` from OpenZeppelin
-   Custom token ID generation using keccak256 hash
-   Stores document metadata on-chain

**Structs**:

```solidity
struct DocumentMetadata {
    string tokenURI;      // IPFS metadata link
    address minter;       // Who minted the document
    uint256 timestamp;    // Mint timestamp
    bool isLocked;        // Lock status
}
```

**Key Functions**:

##### `mintNFT(address to, string memory uri) → uint256`

-   Mints new NFT with metadata URI
-   Generates random token ID
-   Stores metadata in `documents` mapping
-   Emits `DocumentMinted` event
-   Returns token ID

##### `tokenURI(uint256 tokenId) → string`

-   Overrides ERC721 to return stored IPFS URI
-   Required for NFT metadata standard

##### `lockDocument(uint256 tokenId)`

-   Permanently locks document (owner-only)
-   Prevents future URI updates
-   Emits `DocumentLocked` event
-   **Irreversible action**

##### `updateDocumentURI(uint256 tokenId, string memory newURI)`

-   Updates metadata URI (owner-only)
-   Only works if document is unlocked
-   Validates URI is not empty

**Events**:

```solidity
event DocumentMinted(uint256 indexed tokenId, address indexed minter, string tokenURI, uint256 timestamp);
event DocumentLocked(uint256 indexed tokenId, uint256 timestamp);
```

---

#### `VerificationRegistry.sol`

**Purpose**: Additional verification/registry contract (not currently integrated in UI)

---

### **Metadata Storage** (`metadata/`)

#### `metadata/data.json`

**Purpose**: Stores NFT metadata locally before IPFS upload

**Structure**:

```json
{
	"name": "Document Name",
	"description": "Description",
	"document_type": "Contract",
	"issued_by": "Party A",
	"issued_to": "Party B",
	"issuer_address": "0x...",
	"issued_to_address": "0x...",
	"jurisdiction": "US",
	"legal_references": ["Law 1", "Law 2"],
	"document_details": {
		"page_count": 5,
		"format": "PDF",
		"language": "English",
		"notary_stamp_present": true
	},
	"image": "ipfs://...",
	"file_url": "ipfs://...",
	"attributes": [
		{ "trait_type": "Document Type", "value": "Legal" },
		{ "trait_type": "Jurisdiction", "value": "US" }
	]
}
```

---

#### `metadata/document.pdf`

**Purpose**: Temporarily stores uploaded PDF before IPFS upload

**Note**: Gets overwritten with each new upload in local environment.

---

## 🔧 Installation

### Prerequisites

-   Node.js 18+
-   npm or yarn
-   MetaMask wallet extension
-   Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/YashK-194/LegalLedger.git
cd legal-ledger
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env.local` file**

```bash
touch .env.local
```

Add the following environment variables:

```env
PINATA_JWT=your_pinata_jwt_token
PINATA_GATEWAY=your_pinata_gateway_url
NEXT_PUBLIC_CONTRACT_ADDRESS=0xba2f4fA1430d10287fcfAfAdFff667D55481aB60
```

4. **Run development server**

```bash
npm run dev
```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

| Variable                       | Description             | Example                                      |
| ------------------------------ | ----------------------- | -------------------------------------------- |
| `PINATA_JWT`                   | Pinata API JWT token    | `eyJhbGciOiJIUzI1NiIsInR5cCI6...`            |
| `PINATA_GATEWAY`               | Pinata IPFS gateway URL | `https://gateway.pinata.cloud`               |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Smart contract address  | `0xba2f4fA1430d10287fcfAfAdFff667D55481aB60` |

### Getting Pinata JWT:

1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Go to API Keys section
3. Create new API key with pinning permissions
4. Copy JWT token

---

## 📜 Smart Contract

**Contract Address (Sepolia)**: `0xba2f4fA1430d10287fcfAfAdFff667D55481aB60`

**Network**: Sepolia Testnet (Chain ID: 11155111)

**Contract Type**: ERC721Enumerable NFT

**Key Functions**:

-   `mintNFT(address to, string uri)` - Mint new document NFT
-   `tokenURI(uint256 tokenId)` - Get metadata URI
-   `lockDocument(uint256 tokenId)` - Lock document forever
-   `updateDocumentURI(uint256 tokenId, string newURI)` - Update metadata URI
-   `documents(uint256 tokenId)` - Get document metadata struct

---

## 🎯 Usage

### 1️⃣ **Minting an NFT** (Mint Tab)

1. **Connect Wallet**: Click "Connect Wallet" button
2. **Upload PDF**:
    - Click "Choose File" and select your PDF document
    - Click "Upload PDF" button
3. **Upload to IPFS**:
    - Click "Upload PDF to Pinata"
    - Wait for IPFS URL generation
4. **Fill Metadata Form**:
    - Document name, description, type
    - Issuer and recipient details
    - Jurisdiction and legal references
    - Document details (page count, format, etc.)
    - File URL auto-populates from PDF upload
5. **Upload Metadata**:
    - Click "Upload Metadata to Pinata"
    - Wait for metadata IPFS URL
6. **Mint NFT**:
    - Enter receiver wallet address
    - Click "Mint NFT"
    - Confirm MetaMask transaction
    - Copy token ID from success message

### 2️⃣ **Viewing an NFT** (View Tab)

1. **Enter Token ID**: Type NFT token ID in input field
2. **Fetch Details**: Click "Fetch" button
3. **View Information**:
    - Owner, minter, timestamp
    - Lock status
    - All metadata fields
    - Embedded PDF document viewer
    - Full JSON metadata

### 3️⃣ **Modifying an NFT** (Modify Tab)

⚠️ **Owner-only operations**

**Update Token URI**:

1. Enter token ID and click "Fetch"
2. Enter new IPFS URI in "Update Document URI" section
3. Click "Update URI"
4. Confirm transaction

**Lock Document**:

1. Enter token ID and click "Fetch"
2. Click "🔒 Lock Document Forever" button
3. Confirm transaction
4. ⚠️ **This is permanent and irreversible**

---

## 🌐 API Routes

All API routes are server-side Next.js routes:

| Route                     | Method | Description                |
| ------------------------- | ------ | -------------------------- |
| `/api/upload-pdf`         | POST   | Save PDF locally           |
| `/api/pinata-upload-pdf`  | POST   | Upload PDF to IPFS         |
| `/api/save-metadata`      | POST   | Save metadata JSON locally |
| `/api/pinata-upload-json` | POST   | Upload metadata to IPFS    |

---

## 🚨 Important Notes

### ⚠️ Vercel Deployment Limitations

When deployed on Vercel (or similar platforms):

-   **Read-only file system** - File uploads won't persist
-   Metadata and PDF storage APIs won't work between sessions
-   **NFT minting still works** with pre-existing metadata
-   For full functionality, **run locally**

### 🔧 Local Development

Full functionality available when running locally:

-   PDF upload and storage
-   Dynamic metadata generation
-   IPFS uploads
-   NFT minting, viewing, and modification

### 🔒 Security Considerations

-   Smart contract owner functions require ownership verification
-   Locking documents is **permanent and irreversible**
-   Private keys never leave client-side (MetaMask handles signing)
-   IPFS files are immutable once uploaded

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions:

-   Open an issue on [GitHub](https://github.com/YashK-194/LegalLedger/issues)
-   Contact: YashK-194

---

## 📄 License

This project is open-source and available for educational purposes.

---

## 🙏 Acknowledgments

-   **OpenZeppelin** - Smart contract libraries
-   **Pinata** - IPFS pinning service
-   **Ethers.js** - Ethereum interaction library
-   **Next.js** - React framework
-   **TailwindCSS** - Styling framework

---

**Built with ❤️ by YashK-194**
