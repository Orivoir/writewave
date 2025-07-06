import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3"

export default async function s3deletefile({
  bucketName,
  key
}: {bucketName: string; key: string}) {

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }));

    return true
    
  } catch (err) {

    return false
  }
}