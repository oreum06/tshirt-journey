import { createContext, useContext } from 'react';
import type { SourceId } from './data/chapters';

// 상태 값 3개: 고른 가격(Ch.0), 착용 횟수(Ch.6), 엔딩 선택(Ch.8) — 페이지 안에서만 유지 (PRD 4장)
export type Ending = 'collect' | 'exchange' | null;

export interface Journey {
  price: number;
  setPrice: (p: number) => void;
  wears: number;
  setWears: (n: number) => void;
  ending: Ending;
  choose: (e: Exclude<Ending, null>) => void;
  openSources: (ids: SourceId[]) => void;
  goTo: (chapter: number) => void;
  toast: (msg: string) => void;
  reducedMotion: boolean;
}

export const JourneyContext = createContext<Journey | null>(null);

export function useJourney() {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('JourneyContext missing');
  return ctx;
}
