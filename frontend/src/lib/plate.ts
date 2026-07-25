/** 차량번호 검증·마스킹 — 원본 plateOk / maskPlate 1:1 */

export const plateOk = (v: string) => /^\d{2,3}\s?[가-힣]\s?\d{4}$/.test((v || '').trim());

/**
 * 입력 원문 → "숫자2~3 + 한글1 + ' ' + 숫자4" 형태로 마스킹.
 * 허용되지 않는 문자가 버려지면 rejected=true (오류 라벨 트리거).
 */
export function maskPlate(raw: string): { v: string; rejected: boolean } {
  raw = (raw || '').replace(/\s/g, '');
  let head = '', mid = '', tail = '', rejected = false;
  for (const ch of raw) {
    if (!mid) {
      if (/\d/.test(ch) && head.length < 3) { head += ch; continue; }
      if (/[가-힣]/.test(ch) && head.length >= 2) { mid = ch; continue; }
    } else if (/\d/.test(ch) && tail.length < 4) { tail += ch; continue; }
    rejected = true;
  }
  return { v: head + mid + (tail ? ' ' + tail : ''), rejected };
}
