import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file");

		if (!file) {
			return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
		}

		// Validate file type
		if (file.type !== "application/pdf") {
			return NextResponse.json({ success: false, error: "Only PDF files are allowed" }, { status: 400 });
		}

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Define path to save the file
		const filePath = path.join(process.cwd(), "metadata", "document.pdf");

		// Write file to disk
		await writeFile(filePath, buffer);

		console.log("✅ PDF saved to:", filePath);

		return NextResponse.json({
			success: true,
			message: "PDF uploaded successfully",
			filename: "document.pdf",
			path: "/metadata/document.pdf",
		});
	} catch (error) {
		console.error("❌ PDF upload failed:", error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}
