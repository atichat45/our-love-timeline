import { NextRequest, NextResponse } from 'next/server';
import { generateUniqueFileName, getContentType, uploadFileToS3, BUCKET_NAME } from '@/lib/s3';

// Disable body parser to handle file uploads properly
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    if (!BUCKET_NAME) {
      return NextResponse.json(
        { error: 'AWS S3 bucket name not configured' },
        { status: 500 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const fileName = generateUniqueFileName(file.name);
    
    // Determine folder based on file type
    const fileType = file.type.startsWith('image/') ? 'images' : 'videos';
    const folderPath = `memories/${fileType}`;
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload to S3
    const fileUrl = await uploadFileToS3(
      buffer,
      fileName,
      getContentType(file.name),
      folderPath
    );
    
    return NextResponse.json({
      url: fileUrl,
      key: `${folderPath}/${fileName}`,
      resourceType: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
    });
    
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to S3' },
      { status: 500 }
    );
  }
}

// Set larger body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
}; 