import type { APIRoute } from 'astro';

export const GET: APIRoute = () =>
  new Response(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#1f2933"/><text x="32" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f7f7f5">RM</text></svg>',
    { headers: { 'Content-Type': 'image/svg+xml' } },
  );
