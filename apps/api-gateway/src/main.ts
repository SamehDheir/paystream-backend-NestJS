import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5, 
    message: { statusCode: 429, message: 'Too many requests from this IP' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/auth', limiter);
  app.use('/wallets', limiter);
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
