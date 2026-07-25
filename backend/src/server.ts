import 'dotenv/config';
import express from 'express';
import { FACILITIES } from './data.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(express.json());

// 로컬 개발 시 프론트(3000)에서 직접 호출할 수 있도록 CORS 허용.
// (Vite dev 프록시를 쓰면 동일 출처가 되어 사실상 불필요하지만, 안전하게 둡니다.)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'cheonan-smart-parking-backend' });
});

app.get('/api/parking/facilities', (_req, res) => {
  res.json({
    updatedAt: new Date().toISOString(),
    facilities: FACILITIES,
  });
});

// 결제 승인 상태 조회 (PG 조회 API 대체) — 프론트가 '확인 중'일 때 폴링.
// 실서비스에서는 PG사 승인 결과를 반환. 데모에서는 항상 확정('confirmed')을 돌려준다.
// (프론트는 네트워크 단절 시 4회 초과하면 '확인 실패'로 처리한다.)
app.get('/api/payments/:id/status', (req, res) => {
  res.json({
    id: req.params.id,
    status: 'confirmed',
    confirmedAt: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});
