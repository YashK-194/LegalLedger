"use client";
import { useState, useEffect } from "react";
import MetadataInputForm from "./components/MetadataInputForm";
import UploadMetadataToPinata from "./components/UploadMetadataToPinata";
import UploadPDF from "./components/UploadPDF";
import UploadPDFToPinata from "./components/UploadPDFToPinata";
import MintNFT from "./components/MintNFT";
import WalletConnect from "./components/WalletConnect";
import FetchNFT from "./components/FetchNFT";
import ModifyNFT from "./components/ModifyNFT";
import { useWallet } from "./hooks/useWallet";
import { ABI } from "./contract/ContractDetails";

export default function Home() {
	const [metadata, setMetadata] = useState("");
	const [receiverAdd, setReceiverAdd] = useState("");
	const [metadataUrl, setMetadataUrl] = useState("");
	const [pdfUrl, setPdfUrl] = useState("");
	const [activeTab, setActiveTab] = useState("mint"); // 'mint' or 'view'

	// Wallet connection hook with contract ABI
	const { account, contract, isConnecting, error, connectWallet, disconnectWallet, isConnected } = useWallet(ABI);

	useEffect(() => {
		if (receiverAdd) {
			console.log("Receiver address set: ", receiverAdd);
		}
	}, [receiverAdd]);

	useEffect(() => {
		if (metadataUrl) {
			console.log("📌 Metadata URL:", metadataUrl);
		}
	}, [metadataUrl]);

	useEffect(() => {
		if (pdfUrl) {
			console.log("📄 PDF URL:", pdfUrl);
		}
	}, [pdfUrl]);

	return (
		<div className="min-h-screen p-8 bg-blue-300">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl text-gray-900 font-bold mb-8 text-center">Legal Ledger - NFT Minting</h1>

				{/* Preview Notice */}
				<div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg shadow-md">
					<h2 className="text-lg font-bold text-yellow-900 mb-2">📢 Preview Mode Notice</h2>
					<p className="text-sm text-gray-800 mb-2">
						This is a <strong>preview demonstration</strong> of how the Legal Ledger project works. Currently using{" "}
						<strong>dummy NFT metadata</strong> for demonstration purposes.
					</p>
					<div className="text-sm text-gray-800 space-y-1 ml-4">
						<p>
							⚠️ <strong>Limitation:</strong> Input from fields is stored as{" "}
							<code className="bg-yellow-200 px-1 rounded">data.json</code> and PDF as{" "}
							<code className="bg-yellow-200 px-1 rounded">document.pdf</code> in the project directory.
						</p>
						<p>
							🚫 <strong>Vercel Hosting:</strong> Read-only file system - metadata and document uploads will <b>Upload failed</b> error.
						</p>
						<p>
							✅ <strong>NFT Minting:</strong> Still works perfectly! You can mint NFTs with the existing metadata.
						</p>
						<p>
							💻 <strong>Full Functionality:</strong> To upload your own documents and create dynamic NFT metadata, please{" "}
							<strong>clone and run this project locally</strong>.
						</p>
					</div>
					<a
						href="https://github.com/YashK-194/LegalLedger"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block mt-3 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
					>
						📦 Clone from GitHub
					</a>
				</div>

				{/* Wallet Connection */}
				<WalletConnect
					account={account}
					isConnecting={isConnecting}
					error={error}
					connectWallet={connectWallet}
					disconnectWallet={disconnectWallet}
					isConnected={isConnected}
				/>

				{/* Tab Navigation */}
				<div className="mb-6 bg-white rounded-lg shadow-md p-2">
					<div className="flex gap-2">
						<button
							onClick={() => setActiveTab("mint")}
							className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
								activeTab === "mint" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							🎨 Mint NFT
						</button>
						<button
							onClick={() => setActiveTab("view")}
							className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
								activeTab === "view" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							🔍 View NFT
						</button>
						<button
							onClick={() => setActiveTab("modify")}
							className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
								activeTab === "modify" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
						>
							⚙️ Modify NFT
						</button>
					</div>
				</div>

				{/* Tab Content */}
				{activeTab === "mint" && (
					<div>
						{/* Form and Upload Components */}
						<UploadPDF />
						<UploadPDFToPinata setPdfUrl={setPdfUrl} />
						<MetadataInputForm metadata={metadata} setMetadata={setMetadata} setReceiverAdd={setReceiverAdd} pdfUrl={pdfUrl} />
						<UploadMetadataToPinata setMetadataUrl={setMetadataUrl} />
						{/* Mint NFT Button - Pass contract instance */}
						<MintNFT
							receiverAdd={receiverAdd}
							metadataUrl={metadataUrl}
							contract={contract}
							account={account}
							connectWallet={connectWallet}
						/>
					</div>
				)}

				{activeTab === "view" && (
					<div>
						<FetchNFT contract={contract} account={account} />
					</div>
				)}

				{activeTab === "modify" && (
					<div>
						<ModifyNFT contract={contract} account={account} />
					</div>
				)}
			</div>
		</div>
	);
}
