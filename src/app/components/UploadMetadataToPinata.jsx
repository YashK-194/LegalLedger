"use client";
import { useState } from "react";

export default function UploadMetadataToPinata({ setMetadataUrl }) {
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(false);

	const uploadToPinata = async () => {
		setLoading(true);
		setUrl("");

		const res = await fetch("/api/pinata-upload-json", {
			method: "POST",
		});

		const data = await res.json();
		setLoading(false);

		if (data.success) {
			const fullUrl = data.url.startsWith("http") ? data.url : `https://${data.url}`;
			setUrl(fullUrl);
			if (setMetadataUrl) setMetadataUrl(fullUrl);
		} else {
			const errorMsg = "❌ Error: " + data.error;
			setUrl(errorMsg);
			if (setMetadataUrl) setMetadataUrl(errorMsg);
		}
	};
	return (
		<div className="flex justify-center">
			<div className="p-4">
				<button onClick={uploadToPinata} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
					{loading ? "Uploading..." : "Upload Metadata to Pinata"}
				</button>

				{url && (
					<p className="mt-4 break-all">
						✅ Uploaded URL:{" "}
						<a href={url} target="_blank" className="text-green-600 underline">
							{url}
						</a>
					</p>
				)}
			</div>
		</div>
	);
}
