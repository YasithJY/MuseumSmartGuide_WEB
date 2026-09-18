import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

export const r2Enabled = Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME && R2_PUBLIC_URL);

// R2 is S3-compatible, so the regular AWS S3 SDK works against its endpoint.
// Region is arbitrary for R2 but the SDK requires a value.
const s3 = r2Enabled
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

// Uploads a buffer to R2 and returns its public URL.
export const uploadBufferToR2 = async (buffer, key, contentType) => {
  if (!r2Enabled) throw new Error('R2 is not configured (missing R2_* env vars)');

  await s3.send(new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));

  return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
};
