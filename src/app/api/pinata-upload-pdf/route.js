import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST() {
	try {
		console.log("✅ PDF to Pinata API Hit!");

		// Path to the PDF file in metadata folder
		const filePath = path.join(process.cwd(), "metadata", "document.pdf");

		// Read file into memory
		const fileBuffer = await readFile(filePath);
		const fileBlob = new Blob([fileBuffer], { type: "application/pdf" });

		// Prepare multipart payload using Web FormData
		const data = new FormData();
		data.append("file", fileBlob, "document.pdf");

		// Optional metadata
		data.append(
			"pinataMetadata",
			JSON.stringify({
				name: "document.pdf",
				keyvalues: { type: "legal-document" },
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
		console.log("📦 Pinata PDF response:", uploadRequest.status, responseText);

		if (!uploadRequest.ok) {
			throw new Error(`Pinata upload failed with status ${uploadRequest.status}: ${responseText}`);
		}

		const upload = JSON.parse(responseText);

		if (!upload?.IpfsHash) {
			throw new Error("Pinata response missing IpfsHash");
		}

		console.log("✅ PDF uploaded to Pinata:", upload.IpfsHash);

		// Build gateway URL
		const gatewayUrl = `${process.env.PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`;

		return NextResponse.json({
			success: true,
			ipfsHash: upload.IpfsHash,
			url: gatewayUrl,
		});
	} catch (error) {
		console.error("❌ PDF Pinata upload failed:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
