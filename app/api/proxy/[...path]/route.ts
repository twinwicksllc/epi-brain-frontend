import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://fluffy-waddle-v677rpg5pr64c6w55-8000.app.github.dev';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path);
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

async function proxyRequest(request: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/api/v1/${path.join('/')}`;
  
  console.log('Proxy request:', {
    method: request.method,
    targetUrl,
    path: path.join('/')
  });
  
  try {
    // Get the request body
    let body = undefined;
    if (request.method !== 'GET') {
      try {
        body = await request.text();
      } catch (e) {
        console.error('Failed to read request body:', e);
      }
    }
    
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        // Forward any other headers if needed
      },
      body: body,
    });

    console.log('Backend response status:', response.status);

    let data;
    let responseText;
    try {
      responseText = await response.text();
      console.log('Backend response:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responseText: responseText.substring(0, 500) // Log first 500 chars
      });
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse backend response:', e);
      console.log('Raw response text:', responseText);
      data = { error: 'Invalid response from backend', raw: responseText };
    }

    console.log('Proxy success:', { status: response.status, data });

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error.message, stack: error.stack },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error.message, stack: error.stack },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}