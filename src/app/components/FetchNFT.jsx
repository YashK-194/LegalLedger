"use client";
import React, { useState } from "react";
import { ethers } from "ethers";

function FetchNFT({ contract, account }) {
	const [tokenId, setTokenId] = useState("");
	const [loading, setLoading] = useState(false);
	const [nftData, setNftData] = useState(null);
	const [error, setError] = useState("");

	const fetchNFTDetails = async () => {
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
		setNftData(null);

		try {
			console.log("🔍 Fetching NFT details for token ID:", tokenId);

			// Get owner
			const owner = await contract.ownerOf(tokenId);
			console.log("👤 Owner:", owner);

			// Get token URI
			const uri = await contract.tokenURI(tokenId);
			console.log("📄 Token URI:", uri);

			// Get document metadata from contract
			const docMetadata = await contract.documents(tokenId);
			console.log("📋 Document Metadata:", docMetadata);

			// Fetch metadata JSON from IPFS
			let metadataJson = null;
			if (uri) {
				try {
					// Convert ipfs:// to https gateway if needed
					let fetchUrl = uri;
					if (uri.startsWith("ipfs://")) {
						fetchUrl = uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
					} else if (!uri.startsWith("http")) {
						fetchUrl = `https://gateway.pinata.cloud/ipfs/${uri}`;
					}

					console.log("🌐 Fetching metadata from:", fetchUrl);
					const response = await fetch(fetchUrl);
					metadataJson = await response.json();
					console.log("✅ Metadata JSON:", metadataJson);
				} catch (err) {
					console.warn("Could not fetch metadata JSON:", err);
				}
			}

			setNftData({
				tokenId: tokenId,
				owner: owner,
				tokenURI: uri,
				minter: docMetadata.minter,
				timestamp: new Date(Number(docMetadata.timestamp) * 1000).toLocaleString(),
				isLocked: docMetadata.isLocked,
				metadata: metadataJson,
			});

			setLoading(false);
		} catch (err) {
			console.error("❌ Error fetching NFT:", err);
			if (err.message.includes("Token does not exist")) {
				setError("Token ID does not exist");
			} else {
				setError(err.message || "Failed to fetch NFT details");
			}
			setLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			fetchNFTDetails();
		}
	};

	return (
		<div className="space-y-6">
			<div className="p-6 bg-white rounded-lg shadow-md">
				<h2 className="text-xl font-semibold text-gray-900 mb-4">Fetch NFT Details</h2>
				<p className="text-sm text-gray-600 mb-4">Enter a token ID to view its details and metadata</p>

				<div className="flex gap-3">
					<input
						type="text"
						value={tokenId}
						onChange={(e) => setTokenId(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="Enter Token ID (e.g., 123456)"
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
						disabled={loading}
					/>
					<button
						onClick={fetchNFTDetails}
						disabled={loading || !contract}
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
					>
						{loading ? "Loading..." : "Fetch"}
					</button>
				</div>

				{!account && <p className="mt-3 text-sm text-amber-600">⚠️ Please connect your wallet to fetch NFT details</p>}

				{error && (
					<div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
						<p className="font-semibold">Error:</p>
						<p>{error}</p>
					</div>
				)}
			</div>

			{/* Display NFT Details */}
			{nftData && (
				<div className="p-6 bg-white rounded-lg shadow-md">
					<h3 className="text-lg font-semibold mb-4 text-gray-800">NFT Details</h3>

					{/* Basic Info */}
					<div className="space-y-3 mb-6">
						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Token ID:</span>
							<span className="font-mono text-gray-900">{nftData.tokenId}</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Owner:</span>
							<span className="font-mono text-sm text-gray-900 break-all">{nftData.owner}</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Minted By:</span>
							<span className="font-mono text-sm text-gray-900 break-all">{nftData.minter}</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Minted On:</span>
							<span className="text-gray-900">{nftData.timestamp}</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Status:</span>
							<span
								className={`px-2 py-1 rounded text-xs font-semibold ${
									nftData.isLocked ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
								}`}
							>
								{nftData.isLocked ? "🔒 Locked" : "🔓 Unlocked"}
							</span>
						</div>

						<div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
							<span className="font-semibold text-gray-700 min-w-[120px]">Token URI:</span>
							<a
								href={nftData.tokenURI}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:underline break-all text-sm"
							>
								{nftData.tokenURI}
							</a>
						</div>
					</div>

					{/* Metadata JSON */}
					{nftData.metadata && (
						<div className="mt-6">
							<h4 className="text-md font-semibold mb-3 text-gray-800">Document Metadata</h4>
							<div className="space-y-2">
								{nftData.metadata.name && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Name:</span>
										<span className="text-gray-900">{nftData.metadata.name}</span>
									</div>
								)}

								{nftData.metadata.description && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Description:</span>
										<span className="text-gray-900">{nftData.metadata.description}</span>
									</div>
								)}

								{nftData.metadata.document_type && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Document Type:</span>
										<span className="text-gray-900">{nftData.metadata.document_type}</span>
									</div>
								)}

								{nftData.metadata.issued_by && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Issued By:</span>
										<span className="text-gray-900">{nftData.metadata.issued_by}</span>
									</div>
								)}

								{nftData.metadata.issued_to && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Issued To:</span>
										<span className="text-gray-900">{nftData.metadata.issued_to}</span>
									</div>
								)}

								{nftData.metadata.issuer_address && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Issuer Address:</span>
										<span className="font-mono text-sm text-gray-900 break-all">{nftData.metadata.issuer_address}</span>
									</div>
								)}

								{nftData.metadata.issued_to_address && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Issued To Address:</span>
										<span className="font-mono text-sm text-gray-900 break-all">{nftData.metadata.issued_to_address}</span>
									</div>
								)}

								{nftData.metadata.jurisdiction && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Jurisdiction:</span>
										<span className="text-gray-900">{nftData.metadata.jurisdiction}</span>
									</div>
								)}

								{nftData.metadata.legal_references && nftData.metadata.legal_references.length > 0 && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Legal References:</span>
										<div className="flex-1">
											<ul className="list-disc list-inside text-gray-900 space-y-1">
												{nftData.metadata.legal_references.map((ref, idx) => (
													<li key={idx}>{ref}</li>
												))}
											</ul>
										</div>
									</div>
								)}

								{/* Document Details Section */}
								{nftData.metadata.document_details && (
									<div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
										<h5 className="font-semibold text-gray-800 mb-2">Document Details</h5>
										<div className="space-y-2 ml-4">
											{nftData.metadata.document_details.page_count && (
												<div className="flex gap-3">
													<span className="font-semibold text-gray-700 min-w-[120px]">Page Count:</span>
													<span className="text-gray-900">{nftData.metadata.document_details.page_count}</span>
												</div>
											)}

											{nftData.metadata.document_details.format && (
												<div className="flex gap-3">
													<span className="font-semibold text-gray-700 min-w-[120px]">Format:</span>
													<span className="text-gray-900">{nftData.metadata.document_details.format}</span>
												</div>
											)}

											{nftData.metadata.document_details.language && (
												<div className="flex gap-3">
													<span className="font-semibold text-gray-700 min-w-[120px]">Language:</span>
													<span className="text-gray-900">{nftData.metadata.document_details.language}</span>
												</div>
											)}

											{nftData.metadata.document_details.notary_stamp_present !== undefined && (
												<div className="flex gap-3">
													<span className="font-semibold text-gray-700 min-w-[120px]">Notary Stamp:</span>
													<span className="text-gray-900">
														{nftData.metadata.document_details.notary_stamp_present ? "Yes" : "No"}
													</span>
												</div>
											)}
										</div>
									</div>
								)}

								{nftData.metadata.file_url && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Document File:</span>
										<a
											href={nftData.metadata.file_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline break-all"
										>
											View Document in New Tab
										</a>
									</div>
								)}

								{nftData.metadata.image && (
									<div className="flex gap-3 p-2">
										<span className="font-semibold text-gray-700 min-w-[150px]">Image:</span>
										<a
											href={nftData.metadata.image}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline break-all"
										>
											View Image
										</a>
									</div>
								)}

								{/* Attributes Section */}
								{nftData.metadata.attributes && nftData.metadata.attributes.length > 0 && (
									<div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
										<h5 className="font-semibold text-gray-800 mb-2">Attributes</h5>
										<div className="grid grid-cols-2 gap-3 ml-4">
											{nftData.metadata.attributes.map((attr, idx) => (
												<div key={idx} className="flex gap-2">
													<span className="font-semibold text-gray-700">{attr.trait_type}:</span>
													<span className="text-gray-900">{attr.value}</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>

							{/* Full JSON */}
							<div className="mt-4">
								<details className="cursor-pointer">
									<summary className="font-semibold text-gray-700 mb-2">View Full Metadata JSON</summary>
									<pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-xs">
										{JSON.stringify(nftData.metadata, null, 2)}
									</pre>
								</details>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="mt-6 flex gap-3">
						<button
							onClick={() => {
								navigator.clipboard.writeText(JSON.stringify(nftData, null, 2));
								alert("NFT data copied to clipboard!");
							}}
							className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
						>
							Copy All Data
						</button>
						{nftData.tokenURI && (
							<button
								onClick={() => window.open(nftData.tokenURI, "_blank")}
								className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
							>
								Open Metadata Link
							</button>
						)}
					</div>

					{/* PDF Viewer */}
					{nftData.metadata?.file_url && (
						<div className="mt-8">
							<h4 className="text-md font-semibold mb-3 text-gray-800">Document Viewer</h4>
							<div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
								<iframe src={nftData.metadata.file_url} className="w-full h-[800px]" title="Document PDF Viewer" />
							</div>
							<p className="mt-2 text-xs text-gray-500">
								If the PDF doesn't load,{" "}
								<a
									href={nftData.metadata.file_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									click here to open it in a new tab
								</a>
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default FetchNFT;
