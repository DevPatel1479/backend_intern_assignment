import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './docs/swagger.js';
import v1Routes from './routes/v1/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200
}));

app.use(cors({
  origin: env.CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    uptime: process.uptime()
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', v1Routes);

app.use(notFound);
app.use(errorHandler);
