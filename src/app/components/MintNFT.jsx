"use client";
import React, { useState } from "react";

function MintNFT({ receiverAdd, metadataUrl, contract, account, connectWallet }) {
	const [isMinting, setIsMinting] = useState(false);
	const [txHash, setTxHash] = useState("");
	const [error, setError] = useState("");
	const [tokenId, setTokenId] = useState(null);

	async function mintNFT() {
		// Clear previous states
		setError("");
		setTxHash("");
		setTokenId(null);

		// Validation checks
		if (!account) {
			setError("Please connect your wallet first");
			return;
		}

		if (!receiverAdd) {
			setError("Please enter a receiver address");
			return;
		}

		if (!metadataUrl) {
			setError("Please upload metadata first");
			return;
		}

		// Check if metadataUrl is an error message
		if (metadataUrl.includes("❌ Error")) {
			setError("Cannot mint with an invalid metadata URL");
			return;
		}

		if (!contract) {
			setError("Contract not initialized. Please reconnect your wallet.");
			return;
		}

		console.log("🚀 Starting mint process...");
		console.log("receiverAdd: ", receiverAdd);
		console.log("metadataUrl: ", metadataUrl);
		console.log("contract address: ", contract.target);

		// Log network info
		const network = await contract.runner.provider.getNetwork();
		console.log("Network:", network.name, "Chain ID:", network.chainId.toString());

		setIsMinting(true);

		try {
			// Call the mintNFT function on the smart contract
			console.log("📝 Calling contract.mintNFT...");
			const tx = await contract.mintNFT(receiverAdd, metadataUrl);

			console.log("⏳ Transaction submitted:", tx.hash);
			console.log("🔗 View on explorer:", `https://etherscan.io/tx/${tx.hash}`);
			setTxHash(tx.hash);

			// Wait for transaction confirmation
			console.log("⏳ Waiting for confirmation...");
			const receipt = await tx.wait();

			console.log("✅ Transaction confirmed:", receipt);

			// Parse the event to get the token ID
			// The DocumentMinted event should contain the tokenId
			const event = receipt.logs.find((log) => {
				try {
					const parsedLog = contract.interface.parseLog(log);
					return parsedLog?.name === "DocumentMinted";
				} catch (e) {
					return false;
				}
			});

			if (event) {
				const parsedEvent = contract.interface.parseLog(event);
				const mintedTokenId = parsedEvent.args.tokenId.toString();
				setTokenId(mintedTokenId);
				console.log("🎉 NFT Minted! Token ID:", mintedTokenId);
				console.log("📍 Contract Address:", contract.target);
				console.log("👤 Minted to:", receiverAdd);
				console.log("📄 Metadata URI:", metadataUrl);
				console.log("\n💡 To view in wallet:");
				console.log("1. Go to your wallet (MetaMask)");
				console.log("2. Click 'NFTs' tab");
				console.log("3. Click 'Import NFT'");
				console.log("4. Enter contract address:", contract.target);
				console.log("5. Enter token ID:", mintedTokenId);
			}

			setIsMinting(false);
		} catch (err) {
			console.error("❌ Minting failed:", err);
			setError(err.message || "Transaction failed");
			setIsMinting(false);
		}
	}

	const canMint = receiverAdd && metadataUrl && !metadataUrl.includes("❌ Error") && account;

	return (
		<div className="mt-8 p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-xl text-gray-900 font-semibold mb-4">Mint NFT</h2>

			{/* Status Messages */}
			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
					<p className="font-semibold">Error:</p>
					<p>{error}</p>
				</div>
			)}

			{txHash && !error && (
				<div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg border border-blue-300">
					<p className="font-semibold">Transaction Hash:</p>
					<p className="font-mono text-sm break-all">{txHash}</p>
				</div>
			)}

			{tokenId && (
				<div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border border-green-300">
					<p className="font-semibold text-lg">✅ NFT Minted Successfully!</p>
					<div className="mt-3 space-y-2 text-sm">
						<p>
							<span className="font-semibold">Token ID:</span> {tokenId}
						</p>
						<p>
							<span className="font-semibold">Contract:</span> <span className="font-mono text-xs break-all">{contract?.target}</span>
						</p>
						<p>
							<span className="font-semibold">Minted to:</span> <span className="font-mono text-xs break-all">{receiverAdd}</span>
						</p>
					</div>
					<div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
						<p className="font-semibold mb-2">💡 How to view your NFT in MetaMask:</p>
						<ol className="list-decimal list-inside space-y-1 text-xs">
							<li>Open MetaMask and go to the "NFTs" tab</li>
							<li>Click "Import NFT" at the bottom</li>
							<li>
								Enter contract address: <span className="font-mono">{contract?.target}</span>
							</li>
							<li>
								Enter token ID: <span className="font-mono">{tokenId}</span>
							</li>
							<li>Click "Add" - your NFT should now appear!</li>
						</ol>
					</div>
					{txHash && (
						<div className="mt-3 flex gap-2">
							<button
								onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, "_blank")}
								className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
							>
								View on Etherscan
							</button>
							<button
								onClick={() => {
									navigator.clipboard.writeText(contract?.target);
									alert("Contract address copied!");
								}}
								className="flex-1 px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
							>
								Copy Contract Address
							</button>
						</div>
					)}
				</div>
			)}

			{/* Validation Status */}
			<div className="mb-4 space-y-2 text-sm">
				<div className="flex items-center gap-2">
					<span className={account ? "text-green-600" : "text-gray-400"}>{account ? "✓" : "○"} Wallet Connected</span>
				</div>
				<div className="flex items-center gap-2">
					<span className={receiverAdd ? "text-green-600" : "text-gray-400"}>{receiverAdd ? "✓" : "○"} Receiver Address Set</span>
				</div>
				<div className="flex items-center gap-2">
					<span className={metadataUrl && !metadataUrl.includes("❌") ? "text-green-600" : "text-gray-400"}>
						{metadataUrl && !metadataUrl.includes("❌") ? "✓" : "○"} Metadata URL Ready
					</span>
				</div>
			</div>

			{/* Mint Button */}
			<button
				onClick={mintNFT}
				disabled={!canMint || isMinting}
				className="w-full bg-blue-800 p-4 rounded-2xl text-white font-semibold hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
			>
				{isMinting ? (
					<span className="flex items-center justify-center gap-2">
						<span className="animate-spin">⏳</span>
						Minting...
					</span>
				) : !account ? (
					"Connect Wallet to Mint"
				) : !canMint ? (
					"Complete All Steps to Mint"
				) : (
					"Mint NFT"
				)}
			</button>
		</div>
	);
}

export default MintNFT;
