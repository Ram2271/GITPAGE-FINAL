import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

export const s3 = new S3Client({
    region: process.env.B2_REGION || 'eu-central-003',
    endpoint: process.env.B2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.B2_KEY_ID || process.env.B2_APPLICATION_KEY_ID || '',
        secretAccessKey: process.env.B2_APP_KEY || process.env.B2_APPLICATION_KEY || ''
    }
});

export const BUCKET_NAME = process.env.B2_BUCKET_NAME || process.env.BUCKET_NAME || 'gitpage';