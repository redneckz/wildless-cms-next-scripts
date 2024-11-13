import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import https from 'https';

const PORT = 7001;
const PROXY_HOST = 'https://first.rshb-ru.rc.rshbdev.ru';

const app = express();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const proxyConfig = [
  { path: '/icons', target: PROXY_HOST },
  { path: '/wcms-resources', target: PROXY_HOST },
  { path: '/api/v1', target: PROXY_HOST },
];

for (const { path, target } of proxyConfig) {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      agent: httpsAgent,
      pathRewrite: (path, req) => path.replace(path, req.originalUrl),
    }),
  );
}
export default function proxyServer() {
  app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
  });
}
