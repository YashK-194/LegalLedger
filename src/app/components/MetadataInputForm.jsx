"use client";
import React, { useState, useEffect } from "react";

function MetadataInputForm({ metadata, setMetadata, setReceiverAdd, pdfUrl }) {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		document_type: "Contract",
		issued_by: "",
		issued_to: "",
		issuer_address: "",
		issued_to_address: "",
		jurisdiction: "",
		legal_references: [""],
		document_details: {
			page_count: "",
			format: "PDF",
			language: "English",
			notary_stamp_present: false,
		},
		image: "ipfs://bafybeihu44tfhbtzv5s3snuqj5dy2hi2mgbwgjqy7q6wuenkif5bxgnkgy",
		file_url: "",
	});

	// Auto-update file_url when pdfUrl changes
	useEffect(() => {
		if (pdfUrl) {
			setFormData((prev) => ({
				...prev,
				file_url: pdfUrl,
			}));
		}
	}, [pdfUrl]);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleDocumentDetailsChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			document_details: {
				...prev.document_details,
				[name]: type === "checkbox" ? checked : value,
			},
		}));
	};

	const handleLegalReferenceChange = (index, value) => {
		const newReferences = [...formData.legal_references];
		newReferences[index] = value;
		setFormData((prev) => ({
			...prev,
			legal_references: newReferences,
		}));
	};

	const addLegalReference = () => {
		setFormData((prev) => ({
			...prev,
			legal_references: [...prev.legal_references, ""],
		}));
	};

	const removeLegalReference = (index) => {
		setFormData((prev) => ({
			...prev,
			legal_references: prev.legal_references.filter((_, i) => i !== index),
		}));
	};

	const generateMetadata = async () => {
		const metadata = {
			name: formData.name,
			description: formData.description,
			document_type: formData.document_type,
			issued_by: formData.issued_by,
			issued_to: formData.issued_to,
			issuer_address: formData.issuer_address,
			issued_to_address: formData.issued_to_address,
			jurisdiction: formData.jurisdiction,
			legal_references: formData.legal_references.filter((ref) => ref.trim() !== ""),
			document_details: {
				page_count: parseInt(formData.document_details.page_count) || 0,
				format: formData.document_details.format,
				language: formData.document_details.language,
				notary_stamp_present: formData.document_details.notary_stamp_present,
			},
			image: formData.image,
			file_url: formData.file_url,
			attributes: [
				{ trait_type: "Document Type", value: formData.document_type },
				{ trait_type: "Jurisdiction", value: formData.jurisdiction },
				{
					trait_type: "Notary Stamp",
					value: formData.document_details.notary_stamp_present ? "Yes" : "No",
				},
			],
		};

		setMetadata(metadata);
		setReceiverAdd(formData.issued_to_address);
		console.log("Generated Metadata:", JSON.stringify(metadata, null, 2));

		// Save metadata to file
		try {
			const response = await fetch("/api/save-metadata", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(metadata),
			});

			const result = await response.json();
			if (result.success) {
				console.log("Metadata saved to:", result.path);
				alert("Metadata generated and saved to metadata/data.json");
			} else {
				console.error("Failed to save metadata:", result.error);
				alert("Metadata generated but failed to save to file");
			}
		} catch (error) {
			console.error("Error saving metadata:", error);
			alert("Metadata generated but failed to save to file");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-xl p-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Document NFT Metadata</h1>
					<p className="text-gray-600 mb-8">Fill in the details to generate NFT metadata for your legal document</p>
					<form className="space-y-6">
						{/* Basic Information */}
						<div className="border-b pb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
							<div className="grid grid-cols-1 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Document Name *</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="Enter document name"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										rows="3"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="Short description of the legal document"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Document Type *</label>
									<select
										name="document_type"
										value={formData.document_type}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
									>
										<option value="Contract">Contract</option>
										<option value="Agreement">Agreement</option>
										<option value="Affidavit">Affidavit</option>
										<option value="Deed">Deed</option>
										<option value="License">License</option>
										<option value="Other">Other</option>
									</select>
								</div>
							</div>
						</div>

						{/* Party Information */}
						<div className="border-b pb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">Party Information</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Issued By *</label>
									<input
										type="text"
										name="issued_by"
										value={formData.issued_by}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="Name or Organization"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Issued To *</label>
									<input
										type="text"
										name="issued_to"
										value={formData.issued_to}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="Name or Organization"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Issuer Address *</label>
									<input
										type="text"
										name="issuer_address"
										value={formData.issuer_address}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="0x1234..."
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Issued to Address *</label>
									<input
										type="text"
										name="issued_to_address"
										value={formData.issued_to_address}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="0x1234..."
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction *</label>
									<input
										type="text"
										name="jurisdiction"
										value={formData.jurisdiction}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="e.g., India, Delaware, EU"
										required
									/>
								</div>
							</div>
						</div>

						{/* Legal References */}
						<div className="border-b pb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">Legal References</h2>
							<div className="space-y-3">
								{formData.legal_references.map((reference, index) => (
									<div key={index} className="flex gap-2">
										<input
											type="text"
											value={reference}
											onChange={(e) => handleLegalReferenceChange(index, e.target.value)}
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
											placeholder={`Reference ${index + 1}`}
										/>
										{formData.legal_references.length > 1 && (
											<button
												type="button"
												onClick={() => removeLegalReference(index)}
												className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
											>
												Remove
											</button>
										)}
									</div>
								))}
								<button
									type="button"
									onClick={addLegalReference}
									className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
								>
									+ Add Reference
								</button>
							</div>
						</div>

						{/* Document Details */}
						<div className="border-b pb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">Document Details</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Page Count *</label>
									<input
										type="number"
										name="page_count"
										value={formData.document_details.page_count}
										onChange={handleDocumentDetailsChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="12"
										min="1"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Format *</label>
									<select
										name="format"
										value={formData.document_details.format}
										onChange={handleDocumentDetailsChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
									>
										<option value="PDF">PDF</option>
										<option value="DOCX">DOCX</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
									<select
										name="language"
										value={formData.document_details.language}
										onChange={handleDocumentDetailsChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
									>
										<option value="English">English</option>
										<option value="Hindi">Hindi</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div className="flex items-center">
									<input
										type="checkbox"
										name="notary_stamp_present"
										checked={formData.document_details.notary_stamp_present}
										onChange={handleDocumentDetailsChange}
										className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 text-gray-900"
									/>
									<label className="ml-3 text-sm font-medium text-gray-700">Notary Stamp Present</label>
								</div>
							</div>
						</div>

						{/* IPFS Links */}
						<div className="border-b pb-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4">IPFS Links</h2>
							<div className="grid grid-cols-1 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Image / Thumbnail IPFS URL *<span className="ml-2 text-xs text-gray-500">(Default image provided)</span>
									</label>
									<input
										type="text"
										name="image"
										value={formData.image}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
										placeholder="ipfs://CID_of_preview_image"
										required
									/>
									<p className="mt-1 text-xs text-gray-500">
										Using default thumbnail. You can replace it with your own IPFS image URL.
									</p>
								</div>{" "}
								{/* Document IPFS URL - Auto-populated, shown as read-only display */}
								{pdfUrl && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Document File IPFS URL
											<span className="ml-2 text-xs text-green-600">✓ Auto-populated from PDF upload</span>
										</label>
										<div className="w-full px-4 py-2 border border-green-300 bg-green-50 rounded-lg text-gray-900 break-all">
											{formData.file_url}
										</div>
										<p className="mt-1 text-xs text-green-600">This URL is automatically included in your NFT metadata</p>
									</div>
								)}
							</div>
						</div>

						{/* Submit Button */}
						<div className="pt-4">
							<button
								type="button"
								onClick={generateMetadata}
								className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] shadow-lg"
							>
								Generate Metadata JSON
							</button>
						</div>
					</form>

					{/* Display Generated Metadata */}
					{metadata && (
						<div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 mb-3">Generated Metadata:</h3>
							<pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
								{JSON.stringify(metadata, null, 2)}
							</pre>
							<button
								onClick={() => {
									navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
									alert("Metadata copied to clipboard!");
								}}
								className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
							>
								Copy to Clipboard
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default MetadataInputForm;
