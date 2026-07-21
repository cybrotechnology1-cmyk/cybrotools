import {NextRequest, NextResponse} from 'next/server';
import {SERVER_API_URL, SERVER_API_KEY} from '@/lib/server-config';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const published = req.nextUrl.searchParams.get('published');
    const url =
      published === '1' ? `${SERVER_API_URL}?published=1` : SERVER_API_URL;
    const res = await fetch(url, {cache: 'no-store'});
    const text = await res.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(SERVER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': SERVER_API_KEY,
      },
      body,
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(SERVER_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': SERVER_API_KEY,
      },
      body,
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    const url = id
      ? `${SERVER_API_URL}?id=${encodeURIComponent(id)}`
      : SERVER_API_URL;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {'X-Api-Key': SERVER_API_KEY},
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {'Content-Type': 'application/json'},
    });
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
