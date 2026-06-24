import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const port = Number(process.env.PORT ?? 4173);

const mimeTypes = new Map([
    ['.html', 'text/html; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.json', 'application/json; charset=utf-8'],
    ['.svg', 'image/svg+xml'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.gif', 'image/gif'],
    ['.webp', 'image/webp'],
    ['.ico', 'image/x-icon'],
    ['.txt', 'text/plain; charset=utf-8']
]);

function safeResolveUrlPath(urlPath) {
    const decoded = decodeURIComponent(urlPath.split('?')[0]);
    const normalized = decoded.replaceAll('\\', '/');
    const clean = normalized.startsWith('/') ? normalized.slice(1) : normalized;
    const resolved = path.resolve(rootDir, clean);
    if (!resolved.startsWith(rootDir)) {
        return null;
    }
    return resolved;
}

async function sendFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes.get(ext) ?? 'application/octet-stream';
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
}

async function handler(req, res) {
    try {
        const url = req.url ?? '/';
        const filePath = safeResolveUrlPath(url === '/' ? '/calculator.html' : url);
        if (!filePath) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Bad Request');
            return;
        }

        const stat = await fs.stat(filePath).catch(() => null);
        if (!stat) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Not Found');
            return;
        }

        if (stat.isDirectory()) {
            const indexPath = path.join(filePath, 'index.html');
            const indexStat = await fs.stat(indexPath).catch(() => null);
            if (!indexStat || !indexStat.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Not Found');
                return;
            }
            await sendFile(res, indexPath);
            return;
        }

        await sendFile(res, filePath);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal Server Error');
    }
}

http
    .createServer(handler)
    .listen(port, '127.0.0.1', () => {
        process.stdout.write(`Server running at http://127.0.0.1:${port}/\n`);
    });
