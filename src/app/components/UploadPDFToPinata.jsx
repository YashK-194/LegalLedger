"use client";
import { useState } from "react";

export default function UploadPDFToPinata({ setPdfUrl }) {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);

	const uploadToPinata = async () => {
		setLoading(true);
		setUrl("");

		try {
			const res = await fetch("/api/pinata-upload-pdf", {
				method: "POST",
			});

			const data = await res.json();
			setLoading(false);

			if (data.success) {
				const fullUrl = data.url.startsWith("http") ? data.url : `https://${data.url}`;
				setUrl(fullUrl);
				if (setPdfUrl) setPdfUrl(fullUrl);
				console.log("📄 PDF IPFS URL:", fullUrl);
			} else {
				const errorMsg = "❌ Error: " + data.error;
				setUrl(errorMsg);
				if (setPdfUrl) setPdfUrl("");
			}
		} catch (error) {
			const errorMsg = "❌ Error: " + error.message;
			setUrl(errorMsg);
			if (setPdfUrl) setPdfUrl("");
			setLoading(false);
		}
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md mb-6">
			<h2 className="text-xl text-gray-900 font-semibold mb-4">Upload PDF to IPFS</h2>
			<p className="text-sm text-gray-600 mb-4">Upload the document.pdf from /metadata folder to Pinata IPFS</p>

			<button
				onClick={uploadToPinata}
				className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-semibold"
				disabled={loading}
			>
				{loading ? "Uploading to IPFS..." : "Upload PDF to Pinata"}
			</button>

			{url && (
				<div className="mt-4">
					{url.startsWith("❌") ? (
						<div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">{url}</div>
					) : (
						<div className="p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
							<p className="font-semibold mb-2">✅ PDF Uploaded to IPFS:</p>
							<a href={url} target="_blank" rel="noopener noreferrer" className="text-sm break-all underline hover:text-green-900">
								{url}
							</a>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
