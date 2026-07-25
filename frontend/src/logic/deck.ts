/**
 * 층별 덱 점유 계산 — 원본 hash/floorFill/buildRows/countEmpty/facEmpty 1:1.
 * (원본 bayVal의 "스타일·핸들러" 부분은 상태 의존이므로 useApp에서 결합한다.)
 */
import { FACS, LAYOUT, type SlotType } from '../data';

const hash = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff; }
  return h;
};

export interface DeckBay {
  id: string;          // "B1|C-03"
  code: string;        // "C-03"
  type: SlotType;
  occupied: boolean;
  open: 'up' | 'down';
}
export interface DeckRow { isAisle: boolean; isRow: boolean; arrow?: string; block?: string; bays?: DeckBay[] }

function floorFill(facId: string, floor: string): number {
  const fac = FACS.find((f) => f.id === facId) || FACS[0];
  if (fac.occ >= 100) return 100;
  const v = hash(facId + floor) % 25 - 12;
  return Math.max(5, Math.min(98, fac.occ + v));
}

export function buildDeck(facId: string, floor: string): DeckRow[] {
  const seed = hash(facId + floor);
  const fill = floorFill(facId, floor);
  let gi = 0;
  const blockCount: Record<string, number> = {};
  return LAYOUT.map((row) => {
    if (row.aisle) return { isAisle: true, isRow: false, arrow: row.aisle };
    const bays: DeckBay[] = [];
    row.items!.forEach(([type, n]) => {
      for (let i = 0; i < n; i++) {
        const gIdx = gi++;
        const local = (blockCount[row.block!] = (blockCount[row.block!] || 0) + 1);
        const r = (gIdx * 137 + seed) % 100;
        const occ = fill >= 100 ? true : r < fill;
        const code = `${row.block}-${String(local).padStart(2, '0')}`;
        bays.push({ id: `${floor}|${code}`, code, type, occupied: occ, open: row.open! });
      }
    });
    return { isAisle: false, isRow: true, block: row.block, bays };
  });
}

export const countEmpty = (facId: string, floor: string) =>
  buildDeck(facId, floor).flatMap((r) => r.bays || []).filter((b) => !b.occupied).length;

export const facEmpty = (facId: string) => {
  const fac = FACS.find((f) => f.id === facId)!;
  return fac.floors.reduce((s, fl) => s + countEmpty(facId, fl), 0);
};
