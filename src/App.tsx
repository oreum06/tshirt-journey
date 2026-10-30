import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CHAPTERS, DEFAULT_PRICE, DEFAULT_WEARS, WATER_TEE, type SourceId } from './data/chapters';
import { JourneyContext, type Ending, type Journey } from './state';
import { Stage } from './components/Stage';
import { Hud, ProgressDots, SourceSheet, Toast } from './components/Chrome';
import { ChapterSection } from './components/ChapterSection';
import { initAnalytics, trackOnce } from './lib/analytics';

gsap.registerPlugin(ScrollTrigger);

const EXCHANGE_BG: [string, string] = ['#F7F4EE', '#F7F4EE'];

function hex(c: string) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a: string, b: string, t: number) {
  const x = hex(a);
  const y = hex(b);
  return x.map((v, i) => Math.round(v + (y[i] - v) * t));
}
const luminance = ([r, g, b]: number[]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

export default function App() {
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const present = useMemo(() => new URLSearchParams(location.search).get('mode') === 'present', []);

  const [active, setActive] = useState(0);
  const [stamped, setStamped] = useState<Set<number>>(() => new Set());
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [wears, setWears] = useState(DEFAULT_WEARS);
  const [ending, setEnding] = useState<Ending>(null);
  const [sheet, setSheet] = useState<SourceId[] | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLSpanElement>(null);
  const progress = useRef<number[]>(CHAPTERS.map(() => 0));
  const endingRef = useRef<Ending>(null);
  const applyRef = useRef<() => void>(() => {});

  const goTo = useCallback(
    (i: number, instant = false) => {
      const sec = document.getElementById(`ch${i}`);
      if (!sec) return;
      const top = sec.getBoundingClientRect().top + window.scrollY - (window.innerWidth >= 1024 ? 80 : window.innerHeight * 0.62);
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion || instant ? 'auto' : 'smooth' });
      history.replaceState(null, '', `${location.search}#ch${i}`);
    },
    [reducedMotion],
  );

  const toastTimer = useRef<number>();
  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2000);
  }, []);

  const choose = useCallback((e: Exclude<Ending, null>) => setEnding(e), []);
  const openSources = useCallback((ids: SourceId[]) => setSheet(ids), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  // 스크롤 스토리 엔진 (F-01, F-03): 챕터 진입·이탈 감지 + 진행률 → CSS 변수 + 배경색 보간
  useLayoutEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const p = progress.current;
      const stage = stageRef.current;
      p.forEach((v, i) => stage?.style.setProperty(`--p${i}`, String(reducedMotion ? (v > 0 ? 1 : 0) : v)));

      if (waterRef.current) waterRef.current.textContent = Math.round(WATER_TEE * Math.min(1, p[1] * 1.25)).toLocaleString('ko-KR');

      let i = 0;
      for (let k = 0; k < p.length; k++) if (p[k] > 0) i = k;
      const bgOf = (k: number) => (k === 8 && endingRef.current === 'exchange' ? EXCHANGE_BG : CHAPTERS[k].bg);
      const t = p[i];
      let rgb = mix(bgOf(i)[0], bgOf(i)[1], Math.min(1, t / 0.85));
      if (i < p.length - 1 && t > 0.85) {
        const cur = `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
        rgb = mix(cur, bgOf(i + 1)[0], (t - 0.85) / 0.15);
      }
      const css = `rgb(${rgb.join(',')})`;
      root.style.setProperty('--bg', css);
      root.dataset.tone = luminance(rgb) < 0.4 ? 'dark' : 'light';
    };
    applyRef.current = apply;

    const triggers = CHAPTERS.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#ch${c.id}`,
        start: 'top 75%',
        end: 'bottom 75%',
        onUpdate: (self) => {
          progress.current[i] = self.progress;
          apply();
          if (self.progress > 0.97) setStamped((s) => (s.has(i) ? s : new Set(s).add(i)));
        },
        onToggle: (self) => {
          if (self.isActive) {
            setActive(i);
            trackOnce(`ch${i}`, 'chapter_view', { chapter: i });
          }
        },
      }),
    );
    apply();

    // URL 해시(#ch3)로 특정 장면 바로 이동
    const m = location.hash.match(/^#ch(\d)$/);
    if (m) {
      history.scrollRestoration = 'manual';
      const n = Number(m[1]);
      Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 800))]).then(() =>
        setTimeout(() => {
          goTo(n, true);
          ScrollTrigger.refresh();
        }, 50),
      );
    }

    return () => triggers.forEach((t) => t.kill());
  }, [reducedMotion, goTo]);

  useEffect(() => {
    endingRef.current = ending;
    applyRef.current();
  }, [ending]);

  useEffect(() => {
    initAnalytics();
    // 폰트·이미지 로드 후 위치 재계산
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // 발표 모드 (F-20): ?mode=present 이면 ← → 로 챕터 이동
  useEffect(() => {
    if (!present) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goTo(Math.min(9, active + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(Math.max(0, active - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [present, active, goTo]);

  const ctx: Journey = { price, setPrice, wears, setWears, ending, choose, openSources, goTo, toast, reducedMotion };

  return (
    <JourneyContext.Provider value={ctx}>
      <a className="skip" href="#ch9">
        영수증으로 건너뛰기
      </a>
      <header className="topbar">
        <Hud active={active} waterRef={waterRef} />
        <ProgressDots active={active} stamped={stamped} />
      </header>

      <main className={`journey ${reducedMotion ? 'is-reduced' : ''}`}>
        <div className="stage-col">
          <Stage ref={stageRef} active={active} ending={ending} price={price} />
        </div>
        <div className="story">
          {CHAPTERS.map((c) => (
            <ChapterSection key={c.id} chapter={c} />
          ))}
        </div>
      </main>

      <SourceSheet ids={sheet} onClose={closeSheet} />
      <Toast msg={toastMsg} />
    </JourneyContext.Provider>
  );
}
