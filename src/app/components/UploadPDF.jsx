"use client";
import { useState } from "react";

export default function UploadPDF() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const handleFileSelect = (e) => {
		const file = e.target.files[0];
		setMessage("");
		setError("");

		if (file) {
			// Validate file type
			if (file.type !== "application/pdf") {
				setError("Please select a PDF file");
				setSelectedFile(null);
				return;
			}

			// Validate file size (max 10MB)
			const maxSize = 10 * 1024 * 1024; // 10MB
			if (file.size > maxSize) {
				setError("File size must be less than 10MB");
				setSelectedFile(null);
				return;
			}

			setSelectedFile(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setError("Please select a file first");
			return;
		}

		setUploading(true);
		setMessage("");
		setError("");

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);

			const response = await fetch("/api/upload-pdf", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (data.success) {
				setMessage("✅ PDF uploaded successfully as document.pdf");
				console.log("📄 PDF uploaded:", data);
			} else {
				setError(`Upload failed: ${data.error}`);
			}
		} catch (err) {
			console.error("Upload error:", err);
			setError(`Upload failed: ${err.message}`);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="p-6 bg-white rounded-lg shadow-md mb-6">
			<h2 className="text-xl text-gray-900 font-semibold mb-4">Upload PDF Document</h2>

			<div className="space-y-4">
				{/* File Input */}
				<div>
					<label htmlFor="pdf-upload" className="block text-sm font-medium text-gray-700 mb-2">
						Select PDF File
					</label>
					<input
						id="pdf-upload"
						type="file"
						accept=".pdf,application/pdf"
						onChange={handleFileSelect}
						disabled={uploading}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
					/>
					<p className="mt-1 text-xs text-gray-500">Maximum file size: 10MB. File will be saved as document.pdf</p>
				</div>

				{/* Selected File Info */}
				{selectedFile && (
					<div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
						<p className="text-sm text-gray-700">
							<span className="font-semibold">Selected:</span> {selectedFile.name}
						</p>
						<p className="text-xs text-gray-500 mt-1">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
					</div>
				)}

				{/* Upload Button */}
				<button
					onClick={handleUpload}
					disabled={!selectedFile || uploading}
					className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
				>
					{uploading ? (
						<span className="flex items-center justify-center gap-2">
							<span className="animate-spin">⏳</span>
							Uploading...
						</span>
					) : (
						"Upload PDF"
					)}
				</button>

				{/* Success Message */}
				{message && <div className="p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">{message}</div>}

				{/* Error Message */}
				{error && <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">{error}</div>}
			</div>
		</div>
	);
}
