"use client";
import React, { useState } from "react";
import { ethers } from "ethers";

function ModifyNFT({ contract, account }) {
	const [tokenId, setTokenId] = useState("");
	const [newURI, setNewURI] = useState("");
	const [loading, setLoading] = useState(false);
	const [lockLoading, setLockLoading] = useState(false);
	const [updateLoading, setUpdateLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [nftInfo, setNftInfo] = useState(null);

	// Fetch NFT info to show current state
	const fetchNFTInfo = async () => {
		if (!tokenId) {
			setError("Please enter a token ID");
			return;
		}

		if (!contract) {
			setError("Contract not initialized. Please connect your wallet.");
			return;
		}

		setLoading(true);
		setError("");
		setMessage("");
		setNftInfo(null);

		try {
			const owner = await contract.ownerOf(tokenId);
			const uri = await contract.tokenURI(tokenId);
			const docMetadata = await contract.documents(tokenId);

			setNftInfo({
				owner,
				tokenURI: uri,
				minter: docMetadata.minter,
				timestamp: new Date(Number(docMetadata.timestamp) * 1000).toLocaleString(),
				isLocked: docMetadata.isLocked,
			});

			setLoading(false);
		} catch (err) {
			console.error("Error fetching NFT:", err);
			if (err.message.includes("Token does not exist")) {
				setError("Token ID does not exist");
			} else {
				setError(err.message || "Failed to fetch NFT details");
			}
			setLoading(false);
		}
	};

	// Lock document
	const handleLockDocument = async () => {
		if (!contract) {
			setError("Contract not initialized. Please connect your wallet.");
			return;
		}

		if (!tokenId) {
			setError("Please enter a token ID");
			return;
		}

		setLockLoading(true);
		setError("");
		setMessage("");

		try {
			console.log("🔒 Locking document for token ID:", tokenId);

			const tx = await contract.lockDocument(tokenId);
			console.log("📝 Transaction sent:", tx.hash);
			setMessage(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);

			const receipt = await tx.wait();
			console.log("✅ Transaction confirmed:", receipt);

			setMessage(`✅ Document locked successfully! Transaction: ${receipt.hash}`);
			setLockLoading(false);

			// Refresh NFT info
			await fetchNFTInfo();
		} catch (err) {
			console.error("❌ Error locking document:", err);
			setError(err.message || "Failed to lock document");
			setLockLoading(false);
		}
	};

	// Update document URI
	const handleUpdateURI = async () => {
		if (!contract) {
			setError("Contract not initialized. Please connect your wallet.");
			return;
		}

		if (!tokenId) {
			setError("Please enter a token ID");
			return;
		}

		if (!newURI) {
			setError("Please enter a new URI");
			return;
		}

		setUpdateLoading(true);
		setError("");
		setMessage("");

		try {
			console.log("📝 Updating document URI for token ID:", tokenId);
			console.log("New URI:", newURI);

			const tx = await contract.updateDocumentURI(tokenId, newURI);
			console.log("📝 Transaction sent:", tx.hash);
			setMessage(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);

			const receipt = await tx.wait();
			console.log("✅ Transaction confirmed:", receipt);

			setMessage(`✅ Document URI updated successfully! Transaction: ${receipt.hash}`);
			setUpdateLoading(false);
			setNewURI("");

			// Refresh NFT info
			await fetchNFTInfo();
		} catch (err) {
			console.error("❌ Error updating URI:", err);
			if (err.message.includes("Document is locked")) {
				setError("Cannot update URI: Document is locked");
			} else if (err.message.includes("Ownable: caller is not the owner")) {
				setError("Only the contract owner can update document URIs");
			} else {
				setError(err.message || "Failed to update document URI");
			}
			setUpdateLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Fetch NFT Section */}
			<div className="p-6 bg-white rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Modify NFT Document</h2>
				<p className="text-sm text-gray-600 mb-4">Enter a token ID to view its current state and modify it</p>

				<div className="flex gap-3">
					<input
						type="text"
						value={tokenId}
						onChange={(e) => setTokenId(e.target.value)}
						placeholder="Enter Token ID"
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
						disabled={loading}
					/>
					<button
						onClick={fetchNFTInfo}
						disabled={loading || !contract}
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
					>
						{loading ? "Loading..." : "Fetch"}
					</button>
				</div>

				{!account && <p className="mt-3 text-sm text-amber-600">⚠️ Please connect your wallet to modify NFT documents</p>}
			</div>

			{/* Display NFT Info */}
			{nftInfo && (
				<div className="p-6 bg-white rounded-lg shadow-md">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">Current NFT State</h3>

					<div className="space-y-3 mb-6">
						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Token ID:</span>
							<span className="font-mono text-gray-900">{tokenId}</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Owner:</span>
							<span className="font-mono text-sm text-gray-900 break-all">{nftInfo.owner}</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Minted By:</span>
							<span className="font-mono text-sm text-gray-900 break-all">{nftInfo.minter}</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Status:</span>
							<span
								className={`px-3 py-1 rounded text-sm font-semibold ${
									nftInfo.isLocked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
								}`}
							>
								{nftInfo.isLocked ? "🔒 Locked (Cannot Update)" : "🔓 Unlocked (Can Update)"}
							</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Current URI:</span>
							<a
								href={nftInfo.tokenURI}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline break-all text-sm"
							>
								{nftInfo.tokenURI}
							</a>
						</div>
					</div>

					{/* Action Sections */}
					<div className="space-y-6 mt-6">
						{/* Update URI Section */}
						<div className="border-t pt-6">
							<h4 className="text-md font-semibold mb-3 text-gray-800">Update Document URI</h4>
							<p className="text-sm text-gray-600 mb-4">
								⚠️ Only the contract owner can update document URIs. Document must be unlocked.
							</p>

							<div className="space-y-3">
								<input
									type="text"
									value={newURI}
									onChange={(e) => setNewURI(e.target.value)}
									placeholder="Enter new IPFS URI (e.g., ipfs://... or https://...)"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
									disabled={updateLoading || nftInfo.isLocked}
								/>

								<button
									onClick={handleUpdateURI}
									disabled={updateLoading || !newURI || nftInfo.isLocked || !contract}
									className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
								>
									{updateLoading ? "Updating..." : "Update URI"}
								</button>

								{nftInfo.isLocked && (
									<p className="text-sm text-red-600 font-semibold">❌ This document is locked and cannot be updated</p>
								)}
							</div>
						</div>

						{/* Lock Document Section */}
						<div className="border-t pt-6">
							<h4 className="text-md font-semibold mb-3 text-gray-800">Lock Document</h4>
							<p className="text-sm text-gray-600 mb-4">
								⚠️ Only the contract owner can lock documents. This action is <strong>irreversible</strong>. Once locked, the document
								URI cannot be modified.
							</p>

							<button
								onClick={handleLockDocument}
								disabled={lockLoading || nftInfo.isLocked || !contract}
								className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
							>
								{lockLoading ? "Locking..." : nftInfo.isLocked ? "Already Locked" : "🔒 Lock Document Forever"}
							</button>

							{nftInfo.isLocked && <p className="mt-3 text-sm text-green-600 font-semibold">✅ This document is permanently locked</p>}
						</div>
					</div>
				</div>
			)}

			{/* Messages */}
			{message && (
				<div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
					<p className="font-semibold">Success:</p>
					<p className="text-sm break-all">{message}</p>
				</div>
			)}

			{error && (
				<div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
					<p className="font-semibold">Error:</p>
					<p className="text-sm">{error}</p>
				</div>
			)}

			{/* Info Box */}
			<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<p className="text-sm text-gray-700">
					<strong>ℹ️ Important Notes:</strong>
				</p>
				<ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
					<li>Only the contract owner can lock documents or update URIs</li>
					<li>Locking a document is permanent and cannot be undone</li>
					<li>Locked documents cannot have their URI updated</li>
					<li>All actions require gas fees and wallet confirmation</li>
				</ul>
			</div>
		</div>
	);
}

export default ModifyNFT;
