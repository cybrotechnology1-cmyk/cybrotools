import {NextRequest, NextResponse} from 'next/server';
import {UPLOAD_URL} from '@/lib/server-config';

export async function POST(req: NextRequest) {
  try {
    const {base64, ext} = await req.json();
    if (!base64) {
      return NextResponse.json({error: 'No image data'}, {status: 400});
    }

    const form = new URLSearchParams();
    form.set('base64', base64);
    form.set('ext', ext || 'jpg');

    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: form.toString(),
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json({error: 'Upload failed'}, {status: 502});
    }

    const data = JSON.parse(text);
    if (!data.url) {
      return NextResponse.json({error: data.error || 'No URL'}, {status: 502});
    }

    return NextResponse.json({url: data.url, success: true});
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
