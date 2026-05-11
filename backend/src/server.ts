import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'cheonan-smart-parking-backend',
  });
});

app.get('/api/parking/facilities', (_req, res) => {
  res.json({
    facilities: [],
    message: 'Connect this endpoint to live parking, LPR, payment, and benefit data.',
  });
});

app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});
