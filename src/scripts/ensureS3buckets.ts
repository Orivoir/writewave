import dotenv from "dotenv";
import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";

const path = process.env.NODE_ENV === "development" ? ".env.local" : ".env.prod";
dotenv.config({ path });

async function ensureBuckets() {
  const s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  const buckets = [
    process.env.S3_BUCKET_EBOOK_COVERS!,
    process.env.S3_BUCKET_LIBRARY_USER!,
    process.env.S3_BUCKET_LIBRARY_EPUB!,
  ];

  const publicPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "AllowPublicRead",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: buckets.map((b) => `arn:aws:s3:::${b}/*`),
      },
    ],
  };

  for (const bucketName of buckets) {
    try {
      await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`✅ Bucket "${bucketName}" already exists.`);
    } catch {
      try {
        await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`🌱 Created bucket "${bucketName}".`);
      } catch (err) {
        console.error(`❌ Failed to create bucket "${bucketName}":`, err);
      }
    }

    try {
      await s3.send(
        new PutBucketPolicyCommand({
          Bucket: bucketName,
          Policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "AllowPublicRead",
                Effect: "Allow",
                Principal: "*",
                Action: ["s3:GetObject"],
                Resource: `arn:aws:s3:::${bucketName}/*`,
              },
            ],
          }),
        })
      );
      console.log(`🔓 Public read policy applied to bucket "${bucketName}".`);
    } catch (err) {
      console.error(`⚠️ Failed to set public policy for bucket "${bucketName}":`, err);
    }
  }
}

if (require.main === module) {
  ensureBuckets()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Failed to ensure S3 buckets:", err);
      process.exit(1);
    });
}
