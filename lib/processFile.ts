import fs from "fs/promises";
import path from "path";

export async function processFile(file: File): Promise<string> {
  // Reference the system's /tmp directory
  const uploadPath = "public/uploads";

  // Create the uploads directory inside /tmp if it doesn't already exist
  await fs.mkdir(uploadPath, { recursive: true });

  // Generate a unique file name with a timestamp and remove spaces
  const sanitizedFileName = file.name.replace(/\s+/g, '');
  const filePath = `${Date.now()}-${sanitizedFileName}`;
  const buffer = await file.arrayBuffer();

  // Write the file to the uploads directory
  await fs.writeFile(path.join(uploadPath, filePath), Buffer.from(buffer));

  // Return the full file path
  return path.join("/uploads", filePath);
}