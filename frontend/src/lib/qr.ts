/** QR 패턴 생성 — 원본 qrRows() 1:1 (21×21, 파인더 3개 + LCG(시드7) 랜덤 모듈) */

export interface QRRow { cells: { style: string }[] }

export function qrRows(): QRRow[] {
  const n = 21;
  const box = (bx: number, by: number, x: number, y: number) => {
    const dx = x - bx, dy = y - by;
    return (dx === 0 || dx === 6 || dy === 0 || dy === 6) || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
  };
  const fnd = (x: number, y: number) => {
    if (x < 7 && y < 7) return box(0, 0, x, y);
    if (x > n - 8 && y < 7) return box(n - 7, 0, x, y);
    if (x < 7 && y > n - 8) return box(0, n - 7, x, y);
    return false;
  };
  let s = 7;
  const g: QRRow[] = [];
  for (let y = 0; y < n; y++) {
    const cells: { style: string }[] = [];
    for (let x = 0; x < n; x++) {
      let on: boolean;
      if ((x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)) {
        on = fnd(x, y);
      } else {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        on = ((s >> 9) % 100) < 46;
      }
      cells.push({ style: `flex:1;background:${on ? '#0E1116' : '#fff'}` });
    }
    g.push({ cells });
  }
  return g;
}
