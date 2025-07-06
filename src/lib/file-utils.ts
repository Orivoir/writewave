import formidable, { Files, Fields } from "formidable";
import fs from "fs";
import path from "path";
import { IncomingMessage } from "http";
import { fileTypeFromFile } from 'file-type';


export async function parseForm(
  req: IncomingMessage,
  fileFieldName: string = "file",
  maxFileSize: number = 10 * 1024 * 1024
): Promise<{
  fields: Fields;
  fileBuffer: Buffer;
  filename: string;
  mimetype: string;
  filepath: string;
  filesize: number;
}> {
  const uploadDir = "/tmp";

  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize,
    uploadDir,
    filename: (_name, ext, part) => {
      const extension = ext || path.extname(part.originalFilename || "") || ".jpg";
      return `${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`;
    },
  });

  const [fields, files]: [Fields, Files] = await form.parse(req);
  const file = files[fileFieldName]?.[0];

  if (!file) throw new Error("Missing file");

  const fileType = await fileTypeFromFile(file.filepath);
  const allowedMime = ["image/jpeg", "image/png", "image/webp"];

  if (!fileType || !allowedMime.includes(fileType.mime)) {
    await fs.promises.unlink(file.filepath);
    throw new Error("Invalid file type");
  }

  const fileBuffer = await fs.promises.readFile(file.filepath);

  return {
    fields,
    fileBuffer,
    filename: file.originalFilename || "image.jpg",
    mimetype: file.mimetype || "application/octet-stream",
    filepath: file.filepath,
    filesize: file.size,
  };
}
