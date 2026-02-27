import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.use(
    createProxyMiddleware({
      router: (req) => {
        if (req.url?.startsWith('/wallets')) return 'http://localhost:3000';
        if (req.url?.startsWith('/ledger')) return 'http://localhost:3001';
        if (req.url?.startsWith('/auth')) return 'http://localhost:3002';
      },
      changeOrigin: true,
      on: {
        proxyReq: fixRequestBody,
      },
    }),
  );

  const PORT = 8000;
  await app.listen(PORT);
  console.log(`🚀 API Gateway is running on: http://localhost:${PORT}`);
}
bootstrap();
