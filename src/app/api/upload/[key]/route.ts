import { NextRequest, NextResponse } from 'next/server';
import { deleteFileFromS3 } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  if (!params.key) {
    return NextResponse.json(
      { error: 'No file key provided' },
      { status: 400 }
    );
  }
  
  try {
    // The key will be URL-encoded, so we need to decode it
    const decodedKey = decodeURIComponent(params.key);
    
    await deleteFileFromS3(decodedKey);
    
    return NextResponse.json({ 
      success: true,
      message: `File ${decodedKey} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    
    // Provide appropriate status code based on error type
    const status = (error as Error).message.includes('not configured') ? 500 : 404;
    const errorMessage = (error as Error).message;
    
    return NextResponse.json(
      { 
        error: 'Failed to delete file from S3',
        message: errorMessage
      },
      { status }
    );
  }
} 