import express, { type Express } from 'express';
import { configService } from './services/ConfigService.ts';

const app: Express = express();
const PORT = configService.getNumber("PORT");

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});