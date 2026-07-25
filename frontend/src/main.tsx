import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// NOTE: 원본(DC 런타임)은 StrictMode 없이 렌더 — 이펙트/타이머 시맨틱을 동일하게 유지한다.
createRoot(document.getElementById('root')!).render(<App />);
