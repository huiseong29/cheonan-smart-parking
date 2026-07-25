/** 원본 Component 클래스의 포맷터·상태 판정 유틸 — 로직 1:1 */

/** 혼잡 상태: 만차(≤0) / 혼잡(≤총면수 12%) / 여유 */
export function status(e: number, t: number): { label: string; color: string; soft: string } {
  if (e <= 0) return { label: '만차', color: 'var(--danger)', soft: 'var(--danger-soft)' };
  if (e <= t * 0.12) return { label: '혼잡', color: 'var(--warn)', soft: 'var(--warn-soft)' };
  return { label: '여유', color: 'var(--ok)', soft: 'var(--ok-soft)' };
}

export const distText = (m: number) => (m >= 1000 ? (m / 1000).toFixed(1) + 'km' : m + 'm');

export const won = (n: number) => n.toLocaleString() + '원';

/** 초 → "분:초" (출차 유예 시계) */
export const clk = (n: number) => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');

/** 분 → "X시간 Y분" */
export const hm = (m: number) => Math.floor(m / 60) + '시간 ' + (m % 60) + '분';
