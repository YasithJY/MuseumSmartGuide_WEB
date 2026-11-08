import crypto from 'crypto';
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

  return r2PublicUrl(key);
};

export const r2PublicUrl = (key) => `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;

// RFC 3986 encoding, as SigV4 requires (encodeURIComponent leaves !'()* alone).
const rfc3986 = (s) => encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();

// Returns a URL the browser can PUT a file to directly, so large uploads never
// pass through the API (Vercel caps function request bodies at 4.5 MB). The
// upload must send exactly this Content-Type. Standard S3 SigV4 query signing.
export const createPresignedPutUrl = (key, contentType, expiresIn = 600) => {
  if (!r2Enabled) throw new Error('R2 is not configured (missing R2_* env vars)');

  const host = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const uri = `/${R2_BUCKET_NAME}/${key.split('/').map(rfc3986).join('/')}`;
  const amzDate = new Date().toISOString().replace(/[-:]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/auto/s3/aws4_request`;

  const query = Object.entries({
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${R2_ACCESS_KEY_ID}/${scope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(expiresIn),
    'X-Amz-SignedHeaders': 'content-type;host',
  })
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${rfc3986(k)}=${rfc3986(v)}`)
    .join('&');

  const canonicalRequest = [
    'PUT', uri, query,
    `content-type:${contentType}\nhost:${host}\n`,
    'content-type;host',
    'UNSIGNED-PAYLOAD',
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256', amzDate, scope,
    crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');

  let signingKey = hmac(`AWS4${R2_SECRET_ACCESS_KEY}`, dateStamp);
  for (const part of ['auto', 's3', 'aws4_request']) signingKey = hmac(signingKey, part);
  const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  return `https://${host}${uri}?${query}&X-Amz-Signature=${signature}`;
};
