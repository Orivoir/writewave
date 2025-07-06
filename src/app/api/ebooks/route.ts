// GET | POST /api/ebooks

/**
 * @TODO refactoring methods, add utils files
 * @file libs/checkauth.ts @description check session/permission
 * @file libs/s3uploadfile.ts @description consersion Blob => Buffer and upload at Bucket
 * @file libs/s3deletefile.ts @description execute a DeleteObjectCommand
 * @file libs/fileUtils.ts @description secure extract FormData (wrapper formidable)
 * @file libs/tags.ts @description parse JSON sage for Ebook.tags property (as JSON.stringify(string []))
 */

export {GET} from "./get"

/**
 * @TODO optimization `POST` method
 * - check exists default ebook theme BEFORE upload cover image at S3 (orphelan file)
 * - filter invalid tags (with futur `./libs/tags.ts`) (non-string) thbrow Mongo error
 * - Fast-fail: check required data (default theme, input required, ...) before cost action (write DB, push S3 object)
 * - Add check server-side for max size file (*~10Mo*) about Blob.size  
 */
export {POST} from "./post"
