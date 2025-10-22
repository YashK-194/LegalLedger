import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST() {
	try {
		// console.log("✅ API Hit!");

		// Path to your local file inside project
		const filePath = path.join(process.cwd(), "metadata", "data.json");

		// Read file into memory once for upload
		const fileBuffer = await readFile(filePath);
		const fileBlob = new Blob([fileBuffer], { type: "application/json" });

		// Prepare multipart payload using Web FormData
		const data = new FormData();
		data.append("file", fileBlob, "data.json");

		// Optional metadata
		data.append(
			"pinataMetadata",
			JSON.stringify({
				name: "data.json",
				keyvalues: { type: "NFT-metadata" },
			})
		);

		// Upload to Pinata
		const uploadRequest = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.PINATA_JWT}`,
			},
			body: data,
		});

		const responseText = await uploadRequest.text();
		console.log("📦 Pinata response:", uploadRequest.status, responseText);

		if (!uploadRequest.ok) {
			throw new Error(`Pinata upload failed with status ${uploadRequest.status}: ${responseText}`);
		}

		const upload = JSON.parse(responseText);

		if (!upload?.IpfsHash) {
			throw new Error("Pinata response missing IpfsHash");
		}

		// console.log(upload);
		// Build your custom gateway URL from .env
		const gatewayUrl = `https://${process.env.PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`;

		return NextResponse.json({
			success: true,
			ipfsHash: upload.IpfsHash,
			url: gatewayUrl,
		});
	} catch (error) {
		console.error("❌ Pinata upload failed:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
