import { NextRequest } from 'next/server';

const categoryColors: Record<string, [string, string]> = {
  Technology: ['#7b2ff7', '#00d4ff'],
  Design: ['#f093fb', '#f5576c'],
  Marketing: ['#4facfe', '#00f2fe'],
  Security: ['#2af598', '#009efd'],
  Development: ['#fa709a', '#fee140'],
  SEO: ['#a18cd1', '#fbc2eb'],
  default: ['#667eea', '#764ba2'],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'CybroTools Blog';
  const category = searchParams.get('category') || 'Technology';
  const slug = searchParams.get('slug') || '';

  const colors = categoryColors[category] || categoryColors.default;

  const lines = wrapText(title, 40);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors[0]}"/>
      <stop offset="100%" stop-color="${colors[1]}"/>
    </linearGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0.6)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.3)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#overlay)"/>
  <rect x="40" y="40" width="1120" height="550" rx="20" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

  <!-- Category badge -->
  <rect x="60" y="60" rx="20" width="${category.length * 12 + 40}" height="36" fill="rgba(255,255,255,0.15)"/>
  <text x="80" y="84" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white">${escapeXml(category)}</text>

  <!-- Logo area -->
  <circle cx="60" cy="570" r="14" fill="rgba(255,255,255,0.2)"/>
  <text x="60" y="575" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">C</text>
  <text x="84" y="575" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.6)">CybroTools</text>

  <!-- Title -->
  ${lines.map((line, i) => `
  <text x="60" y="${170 + i * 70}" font-family="Arial, sans-serif" font-size="${i === 0 ? 52 : 42}" font-weight="bold" fill="white">
    ${escapeXml(line)}
  </text>
  `).join('')}

  <!-- Decorative dots -->
  <circle cx="1140" cy="590" r="6" fill="rgba(255,255,255,0.1)"/>
  <circle cx="1160" cy="590" r="4" fill="rgba(255,255,255,0.08)"/>
  <circle cx="1175" cy="590" r="2" fill="rgba(255,255,255,0.05)"/>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

function wrapText(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(' ')) {
    if ((current + ' ' + word).trim().length > maxChars) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  if (lines.length === 0) lines.push(text);
  return lines.slice(0, 3);
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
