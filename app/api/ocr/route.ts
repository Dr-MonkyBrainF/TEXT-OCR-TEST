import { NextRequest, NextResponse } from 'next/server';
import vision from '@google-cloud/vision';
import path from 'path';

// サービスアカウントキーのパスを明示的に設定
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(process.cwd(), 'credentials.json');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { image } = body;
    if (!image) {
      console.error('No image provided');
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const client = new vision.ImageAnnotatorClient();

    // Base64 プレフィックス（"data:image/png;base64," など）がある場合は削除
    const base64 = image.replace(/^data:image\/\w+;base64,/, '');

    const [result] = await client.textDetection({
      image: { content: base64 },
    });

    const text = result.textAnnotations?.[0]?.description ?? '';

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error('OCR Error:', err.stack || err.message || err);
    return NextResponse.json(
      { error: 'OCR failed', details: err.stack || err.message || String(err) },
      { status: 500 }
    );
  }
}
