const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const https = require('https');

export const PORT = 7001;
const PROXY_HOST = 'https://10.80.4.9';

const app = express();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const proxyConfig = [
  { path: '/icons', target: PROXY_HOST },
  { path: '/wcms-resources', target: PROXY_HOST },
  { path: '/api/v1', target: PROXY_HOST },
];

for (const { path, target } in proxyConfig) {
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

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
