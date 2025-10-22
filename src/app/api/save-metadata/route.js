import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request) {
	try {
		const metadata = await request.json();

		// Define the directory and file path
		const metadataDir = join(process.cwd(), "metadata");
		const filePath = join(metadataDir, "data.json");

		// Create the metadata directory if it doesn't exist
		try {
			await mkdir(metadataDir, { recursive: true });
		} catch (error) {
			// Directory might already exist, that's fine
		}

		// Write the metadata to the file
		await writeFile(filePath, JSON.stringify(metadata, null, 2), "utf8");

		return NextResponse.json({
			success: true,
			message: "Metadata saved successfully",
			path: "metadata/data.json",
		});
	} catch (error) {
		console.error("Error saving metadata:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "Failed to save metadata",
			},
			{ status: 500 }
		);
	}
}
