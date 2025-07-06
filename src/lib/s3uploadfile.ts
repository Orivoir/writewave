import {getUploadOptions, uploadFileBuffer} from "./s3"

export default async function s3uploadfile({
  fileBuffer,
  bucketName,
  type,
  identifier = "ww" // random UUID already provid uniq key
}: {
  fileBuffer: Buffer, bucketName: string, type: string, identifier?: string
}) {

  const uploadOptions = await getUploadOptions({
    bucketName,
    fileBuffer,
    identifier,
    type
  })

  const status = await uploadFileBuffer(uploadOptions)

  return status
}