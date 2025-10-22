"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// Import contract details - adjust path as needed
const CONTRACT_ADDRESS = "0xba2f4fA1430d10287fcfAfAdFff667D55481aB60";

export function useWallet(contractABI) {
	const [account, setAccount] = useState(null);
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [error, setError] = useState(null);

	// Check if wallet is already connected on mount
	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	// Listen for account changes
	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on("accountsChanged", handleAccountsChanged);
			window.ethereum.on("chainChanged", () => window.location.reload());
		}

		return () => {
			if (window.ethereum) {
				window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
			}
		};
	}, []);

	// Setup contract instance when signer is available
	useEffect(() => {
		if (signer && contractABI) {
			const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
			setContract(contractInstance);
		}
	}, [signer, contractABI]);

	const handleAccountsChanged = (accounts) => {
		if (accounts.length === 0) {
			// User disconnected wallet
			disconnectWallet();
		} else {
			setAccount(accounts[0]);
		}
	};

	const checkIfWalletIsConnected = async () => {
		try {
			if (!window.ethereum) {
				setError("Please install MetaMask!");
				return;
			}

			const accounts = await window.ethereum.request({ method: "eth_accounts" });

			if (accounts.length > 0) {
				const browserProvider = new ethers.BrowserProvider(window.ethereum);
				const walletSigner = await browserProvider.getSigner();

				setAccount(accounts[0]);
				setProvider(browserProvider);
				setSigner(walletSigner);
			}
		} catch (err) {
			console.error("Error checking wallet connection:", err);
			setError(err.message);
		}
	};

	const connectWallet = async () => {
		try {
			if (!window.ethereum) {
				setError("Please install MetaMask!");
				return;
			}

			setIsConnecting(true);
			setError(null);

			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});

			const browserProvider = new ethers.BrowserProvider(window.ethereum);
			const walletSigner = await browserProvider.getSigner();

			setAccount(accounts[0]);
			setProvider(browserProvider);
			setSigner(walletSigner);
			setIsConnecting(false);
		} catch (err) {
			console.error("Error connecting wallet:", err);
			setError(err.message);
			setIsConnecting(false);
		}
	};

	const disconnectWallet = () => {
		setAccount(null);
		setProvider(null);
		setSigner(null);
		setContract(null);
	};

	return {
		account,
		provider,
		signer,
		contract,
		isConnecting,
		error,
		connectWallet,
		disconnectWallet,
		isConnected: !!account,
	};
}
