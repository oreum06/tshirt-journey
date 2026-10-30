import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { Stat } from '../data/chapters';
import { useJourney } from '../state';

const fmt = (n: number, decimals = 0) => n.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** 화면에 들어오면 1회 카운트업 (F-04, 1,200ms ease-out-expo) */
export function useCountUp(target: number, decimals = 0) {
  const { reducedMotion } = useJourney();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      setShown(target);
      return;
    }
    let tween: gsap.core.Tween | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const o = { v: 0 };
        tween = gsap.to(o, { v: target, duration: 1.2, ease: 'expo.out', onUpdate: () => setShown(o.v) });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [target, reducedMotion]);

  return { ref, text: fmt(decimals ? shown : Math.round(shown), decimals) };
}

export function InfoButton({ stat, label }: { stat: Pick<Stat, 'sources'>; label: string }) {
  const { openSources } = useJourney();
  return (
    <button type="button" className="info-btn" onClick={() => openSources(stat.sources)} aria-label={`${label} 출처 보기`}>
      <span aria-hidden>i</span>
    </button>
  );
}

export function StatCard({ stat }: { stat: Stat }) {
  const { ref, text } = useCountUp(stat.value, stat.decimals);
  const maxV = stat.compare ? Math.max(stat.value, stat.compare.value) : stat.value;

  return (
    <div className="stat">
      <InfoButton stat={stat} label={stat.label} />
      <p className="stat-label">{stat.label}</p>
      <p className="stat-value" ref={ref as React.RefObject<HTMLParagraphElement>} aria-label={`${stat.prefix ?? ''}${fmt(stat.value, stat.decimals)}${stat.suffix ?? ''}`}>
        {stat.prefix && <span className="stat-affix">{stat.prefix.trim()}</span>}
        <span className="stat-num">{text}</span>
        {stat.suffix && <span className="stat-unit">{stat.suffix}</span>}
      </p>
      {stat.human && <p className="stat-human">= {stat.human}</p>}
      {stat.compare && (
        <div className="compare" aria-hidden>
          <div className="compare-row">
            <span>티셔츠</span>
            <span className="compare-bar">
              <i style={{ width: `${(stat.value / maxV) * 100}%` }} />
            </span>
            <b>{fmt(stat.value)}L</b>
          </div>
          <div className="compare-row">
            <span>{stat.compare.label}</span>
            <span className="compare-bar">
              <i className="is-alt" style={{ width: `${(stat.compare.value / maxV) * 100}%` }} />
            </span>
            <b>
              {fmt(stat.compare.value)}
              {stat.compare.suffix}
            </b>
          </div>
          {stat.compare.human && <p className="compare-note">청바지 한 벌 = {stat.compare.human}</p>}
        </div>
      )}
    </div>
  );
}
