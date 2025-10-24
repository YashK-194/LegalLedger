"use client";
import React from "react";

function WalletConnect({ account, isConnecting, error, connectWallet, disconnectWallet, isConnected }) {
	return (
		<div className="mb-8 p-6 bg-gray-100 rounded-lg">
			<h2 className="text-xl text-gray-900 font-semibold mb-4">Wallet Connection</h2>

			{error && (
				<div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
					<p className="font-semibold">Error:</p>
					<p>{error}</p>
				</div>
			)}

			{!isConnected ? (
				<div>
					<p className="mb-4 text-gray-700">Connect your wallet to mint NFTs</p>
					<button
						onClick={connectWallet}
						disabled={isConnecting}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
					>
						{isConnecting ? "Connecting..." : "Connect Wallet"}
					</button>
				</div>
			) : (
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm text-gray-600 mb-1">Connected Account:</p>
						<p className="font-mono text-sm bg-white px-3 py-2 rounded border text-gray-900 border-gray-300">
							{account?.substring(0, 6)}...{account?.substring(account.length - 4)}
						</p>
					</div>
					<button onClick={disconnectWallet} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
						Disconnect
					</button>
				</div>
			)}
		</div>
	);
}

export default WalletConnect;
