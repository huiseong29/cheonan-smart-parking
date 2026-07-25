/**
 * support.js encode.ts의 cssToObj() 1:1 포팅.
 * DC 런타임은 style="문자열"을 렌더 시점마다 이 함수로 객체화했다.
 * 원본 시안의 스타일 문자열을 그대로 유지하기 위해 동일 규칙으로 변환한다.
 */
import type { CSSProperties } from 'react';

const kebabToCamel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function sx(css: string): CSSProperties {
  const o: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o as CSSProperties;
}
