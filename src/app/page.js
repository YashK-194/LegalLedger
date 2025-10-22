"use client";
import { useState, useEffect } from "react";
import MetadataInputForm from "./components/MetadataInputForm";
import UploadMetadataToPinata from "./components/UploadMetadataToPinata";
import UploadPDF from "./components/UploadPDF";
import UploadPDFToPinata from "./components/UploadPDFToPinata";
import MintNFT from "./components/MintNFT";
import WalletConnect from "./components/WalletConnect";
import { useWallet } from "./hooks/useWallet";
import { ABI } from "./contract/ContractDetails";

export default function Home() {
	const [metadata, setMetadata] = useState("");
	const [receiverAdd, setReceiverAdd] = useState("");
	const [metadataUrl, setMetadataUrl] = useState("");
	const [pdfUrl, setPdfUrl] = useState("");

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
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-center">Legal Ledger - NFT Minting</h1>
				{/* Wallet Connection */}
				<WalletConnect
					account={account}
					isConnecting={isConnecting}
					error={error}
					connectWallet={connectWallet}
					disconnectWallet={disconnectWallet}
					isConnected={isConnected}
				/>
				{/* Form and Upload Components */}
				<UploadPDF />
				<UploadPDFToPinata setPdfUrl={setPdfUrl} />
				<MetadataInputForm metadata={metadata} setMetadata={setMetadata} setReceiverAdd={setReceiverAdd} pdfUrl={pdfUrl} />
				<UploadMetadataToPinata setMetadataUrl={setMetadataUrl} /> {/* Mint NFT Button - Pass contract instance */}
				<MintNFT receiverAdd={receiverAdd} metadataUrl={metadataUrl} contract={contract} account={account} connectWallet={connectWallet} />
			</div>
		</div>
	);
}
