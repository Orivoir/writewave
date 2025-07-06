import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { extension } from "mime-types";
import { randomUUID } from "crypto";


const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // important pour MinIO
});

export default s3;

/**
 * Upload un fichier (buffer) vers un bucket S3 ou MinIO
 */
export async function uploadFileBuffer({
  fileBuffer,
  bucket,
  key,
  mimetype,
}: {
  fileBuffer: Buffer;
  bucket: string;
  key: string;
  mimetype: string;
}) {
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
      })
    );

    return {
      success: true,
      url: `${process.env.S3_PUBLIC_URL}/${bucket}/${key}`,
      key
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "Upload failed",
    };
  }
}

export async function getUploadOptions({
  fileBuffer,
  identifier, // value added to a random UUID
  bucketName,
  type
}: {fileBuffer: Buffer, identifier: string, bucketName: string, type: string})  {


  const ext = extension(type);

  // adapte l'extension
  const key = `${bucketName}/${randomUUID()}-${identifier}.${ext || "jpg"}`;

  return {
    fileBuffer,
    bucket: bucketName,
    key,
    mimetype: type || "image/jpeg"
  }
}
