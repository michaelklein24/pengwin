import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const PORT = 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});