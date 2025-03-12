import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// S3 Client configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Bucket name
export const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';

// Generate a unique filename
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Get content type from filename
export const getContentType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'webm': 'video/webm',
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
};

// Upload a file to S3
export const uploadFileToS3 = async (
  file: Buffer | Uint8Array | string, 
  fileName: string,
  contentType: string,
  folder: string = 'memories'
): Promise<string> => {
  if (!BUCKET_NAME) {
    throw new Error('AWS S3 bucket name not configured');
  }
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured');
  }
  
  try {
    const key = `${folder}/${fileName}`;
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'public-read' as const,
    };
    
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    // Return the URL to the uploaded file
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error(`Failed to upload file to S3: ${(error as Error).message}`);
  }
};

// Delete a file from S3
export const deleteFileFromS3 = async (key: string): Promise<void> => {
  if (!BUCKET_NAME) {
    throw new Error('AWS S3 bucket name not configured');
  }
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured');
  }
  
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    console.error(`Error deleting file ${key} from S3:`, error);
    throw new Error(`Failed to delete file from S3: ${(error as Error).message}`);
  }
};

// Generate a presigned URL for a file (useful for temporary access to private files)
export const generatePresignedUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  if (!BUCKET_NAME) {
    throw new Error('AWS S3 bucket name not configured');
  }
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };
  
  const command = new GetObjectCommand(params);
  return getSignedUrl(s3Client, command, { expiresIn });
};

// Extract the S3 key from a full URL
export const getKeyFromUrl = (url: string): string => {
  // Handle both potential URL formats
  // Format 1: https://bucket-name.s3.region.amazonaws.com/path/to/file.jpg
  // Format 2: https://s3.region.amazonaws.com/bucket-name/path/to/file.jpg
  
  try {
    const urlObj = new URL(url);
    
    // Check if the URL is from S3
    if (!urlObj.hostname.includes('amazonaws.com')) {
      throw new Error('Not an S3 URL');
    }
    
    // Format 1: bucket-name.s3.region.amazonaws.com
    if (urlObj.hostname.includes(`${BUCKET_NAME}.s3`)) {
      // Remove the leading slash
      return urlObj.pathname.substring(1);
    }
    
    // Format 2: s3.region.amazonaws.com/bucket-name/...
    if (urlObj.hostname.startsWith('s3.')) {
      const pathParts = urlObj.pathname.split('/');
      // First part is empty (because pathname starts with /), second is bucket name
      if (pathParts.length >= 3 && pathParts[1] === BUCKET_NAME) {
        // Join everything after the bucket name
        return pathParts.slice(2).join('/');
      }
    }
    
    throw new Error('Unable to extract key from S3 URL');
  } catch (error) {
    console.error('Error parsing S3 URL:', error, url);
    // Fallback to simple regex extraction if the URL parsing fails
    const bucketPattern = new RegExp(`https://.*?amazonaws\\.com/(${BUCKET_NAME}/)?(.+)`);
    const match = url.match(bucketPattern);
    
    if (!match || !match[2]) {
      throw new Error('Invalid S3 URL format');
    }
    
    return match[2];
  }
}; 