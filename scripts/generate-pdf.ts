import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';
import { loadCvData } from '../src/lib/cv';

const distDir = new URL('../dist/', import.meta.url);
const cv = await loadCvData('src/content/cv.en.yaml');
const pdfPath = join(distDir.pathname, cv.meta.pdfFilename);

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.pdf', 'application/pdf'],
]);

const server = createServer(async (request, response) => {
  const requestedPath = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const relativePath = requestedPath === '/' ? 'index.html' : requestedPath.slice(1);
  const filePath = normalize(join(distDir.pathname, relativePath));

  if (!filePath.startsWith(distDir.pathname)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes.get(extname(filePath)) ?? 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

const address = await new Promise<import('node:net').AddressInfo>((resolve) => {
  server.listen(0, '127.0.0.1', () => resolve(server.address() as import('node:net').AddressInfo));
});

const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    printBackground: true,
    preferCSSPageSize: true,
  });

  const pdf = await readFile(pdfPath);
  const info = await stat(pdfPath);
  const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;

  if (!pdf.subarray(0, 4).equals(Buffer.from('%PDF')) || info.size === 0 || pageCount < 1) {
    throw new Error('Generated PDF is invalid');
  }

  console.log(`${cv.meta.pdfFilename}: generated (${info.size} bytes, ${pageCount} page(s))`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
