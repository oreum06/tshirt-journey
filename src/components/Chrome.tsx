import { useEffect, useRef, type RefObject } from 'react';
import { CHAPTERS, SOURCES, type SourceId } from '../data/chapters';
import { useJourney } from '../state';

/** HUD 계기판 (F-10) — 물 누적은 스크롤 핸들러가 waterRef에 직접 쓴다 */
export function Hud({ active, waterRef }: { active: number; waterRef: RefObject<HTMLSpanElement> }) {
  const place = CHAPTERS[active].place;
  return (
    <div className="hud" role="status" aria-live="off">
      <span className="hud-item" title="물 누적">
        <span aria-hidden>💧</span>
        <span className="sr-only">물 누적</span>
        <span ref={waterRef} className="hud-num">
          0
        </span>
        L
      </span>
      <span className="hud-item" title="에너지">
        <span aria-hidden>🏭</span>
        <span className="sr-only">에너지 배출 비중</span>
        <span className="hud-num">{active >= 3 ? '8%' : '–'}</span>
      </span>
      <span className="hud-item hud-place" title="현재 위치">
        <span aria-hidden>📍</span>
        <span key={place} className="pulse">
          {place}
        </span>
      </span>
    </div>
  );
}

/** 여정 진행 바 — 여권 페이지 점 10개 (F-11) */
export function ProgressDots({ active, stamped }: { active: number; stamped: Set<number> }) {
  const { goTo } = useJourney();
  return (
    <nav className="dots" aria-label="챕터 이동">
      {CHAPTERS.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`dot ${c.id === active ? 'is-current' : ''} ${stamped.has(c.id) || c.id < active ? 'is-done' : ''}`}
          aria-label={`${c.kicker} ${c.title}`}
          aria-current={c.id === active ? 'step' : undefined}
          onClick={() => goTo(c.id)}
        />
      ))}
    </nav>
  );
}

/** 출처 바텀시트 (F-05) */
export function SourceSheet({ ids, onClose }: { ids: SourceId[] | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!ids) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [ids, onClose]);

  return (
    <div className={`sheet-wrap ${ids ? 'is-open' : ''}`} aria-hidden={!ids}>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="출처">
        <div className="sheet-grip" aria-hidden />
        <p className="sheet-title">출처</p>
        <ul>
          {ids?.map((id) => {
            const s = SOURCES[id];
            return (
              <li key={id}>
                <p className="sheet-name">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.name} ↗
                    </a>
                  ) : (
                    s.name
                  )}
                </p>
                {s.date && <p className="caption">{s.date}</p>}
                {s.note && <p className="sheet-note">{s.note}</p>}
              </li>
            );
          })}
        </ul>
        <button ref={closeRef} type="button" className="cta cta--secondary" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export function Toast({ msg }: { msg: string | null }) {
  return (
    <div className={`toast ${msg ? 'is-on' : ''}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}
