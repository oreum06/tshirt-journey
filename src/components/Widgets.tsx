import { useEffect, useRef, useState } from 'react';
import { PARTY_STAT, PRICES, priceOf } from '../data/chapters';
import { useJourney } from '../state';
import { track } from '../lib/analytics';
import { StatCard } from './StatCard';

/** 화면에 들어오면 is-in 클래스 — 1회성 CSS 연출용 */
export function useInView<T extends Element>(threshold = 0.5) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/** Ch.0 가격 칩 (F-06) */
export function PriceChips() {
  const { price, setPrice, goTo } = useJourney();
  const [picked, setPicked] = useState(false);
  return (
    <div className="price">
      <div className="chips" role="radiogroup" aria-label="티셔츠 가격">
        {PRICES.map((p) => (
          <button
            key={p.value}
            type="button"
            role="radio"
            aria-checked={picked && price === p.value}
            className={`chip ${picked && price === p.value ? 'is-on' : ''}`}
            onClick={() => {
              setPrice(p.value);
              setPicked(true);
            }}
          >
            <span className="chip-label">{p.label}</span>
            <span className="chip-note">{p.note}</span>
          </button>
        ))}
      </div>
      {picked && (
        <div className="passport-issued">
          <p>
            여권이 발급됐어요. <b>{priceOf(price).label}</b>짜리 티셔츠의 여행을 시작해요.
          </p>
          <button type="button" className="cta cta--primary" onClick={() => goTo(1)}>
            여행 시작 ↓
          </button>
        </div>
      )}
    </div>
  );
}

/** Ch.1 물방울 아이콘 2.5개 (1개 = 1인 1년 식수) */
export function Drops() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const years = 2.5;
  return (
    <div className={`drops-row ${inView ? 'is-in' : ''}`} ref={ref} aria-label={`물방울 ${years}개, 1개는 한 사람의 1년 식수`}>
      {[0, 1, 2].map((i) => {
        const fill = Math.min(1, Math.max(0, years - i));
        return (
          <svg key={i} viewBox="0 0 24 30" className="drop-icon" style={{ ['--fill' as string]: fill, ['--d' as string]: `${i * 0.25}s` }} aria-hidden>
            <clipPath id={`dc${i}`}>
              <path d="M12 2 C12 2 3 13 3 19 a9 9 0 0 0 18 0 C21 13 12 2 12 2 Z" />
            </clipPath>
            <rect className="drop-fill" x="0" y="0" width="24" height="30" fill="var(--sdg6-water)" clipPath={`url(#dc${i})`} />
            <path d="M12 2 C12 2 3 13 3 19 a9 9 0 0 0 18 0 C21 13 12 2 12 2 Z" fill="none" stroke="currentColor" strokeWidth="1.75" />
          </svg>
        );
      })}
      <span className="caption">💧 1개 = 1인 1년 식수</span>
    </div>
  );
}

/** Ch.2 물줄기 5개 중 1개 */
export function Streams() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div className={`streams ${inView ? 'is-in' : ''}`} ref={ref} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={i === 2 ? 'is-dye' : ''} />
      ))}
      <span className="caption">5줄기 중 1줄기 = 20%</span>
    </div>
  );
}

/** Ch.3 비교 막대 — 수치 없는 쪽은 개념 표시 */
export function Bars() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div className={`bars ${inView ? 'is-in' : ''}`} ref={ref}>
      <div className="bar-row">
        <span className="bar-label">👕 의류·신발 생산</span>
        <span className="bar">
          <i className="bar-fashion" />
        </span>
      </div>
      <div className="bar-row">
        <span className="bar-label">✈️🚢 국제선 항공 + 해운</span>
        <span className="bar">
          <i className="bar-travel" />
        </span>
      </div>
      <p className="caption">막대 길이는 크기 비교를 위한 개념 표시예요.</p>
    </div>
  );
}

/** Ch.6 옷 아이콘 100개 중 21개가 회색으로 */
export function ClosetGrid() {
  const { ref, inView } = useInView<HTMLDivElement>(0.4);
  return (
    <div className={`closet-grid ${inView ? 'is-in' : ''}`} ref={ref} role="img" aria-label="옷 100벌 중 21벌이 회색으로 꺼진다">
      {Array.from({ length: 100 }, (_, i) => (
        <span key={i} className={i % 5 === 3 || i === 99 ? 'is-off' : ''} style={{ ['--i' as string]: i }} />
      ))}
    </div>
  );
}

/** Ch.6 착용 횟수 슬라이더 (F-18) */
export function WearSlider() {
  const { wears, setWears } = useJourney();
  return (
    <div className="wear-slider">
      <label htmlFor="wears" className="sr-only">
        이 티셔츠를 입은 횟수
      </label>
      <input id="wears" type="range" min={1} max={60} value={wears} onChange={(e) => setWears(Number(e.target.value))} />
      <p className="wear-out">
        <b>{wears}번</b> 입었어요 <span className="caption">(영수증에 반영돼요)</span>
      </p>
    </div>
  );
}

/** Ch.8 갈림길 (F-07) */
export function Branch() {
  const { ending, choose, goTo } = useJourney();
  return (
    <div className="branch">
      <div className="branch-btns">
        <button
          type="button"
          className={`branch-btn branch-btn--collect ${ending === 'collect' ? 'is-on' : ''}`}
          onClick={() => {
            choose('collect');
            track('ending_choice', { ending: 'collect' });
          }}
        >
          수거함에 넣는다
        </button>
        <button
          type="button"
          className={`branch-btn branch-btn--exchange ${ending === 'exchange' ? 'is-on' : ''}`}
          onClick={() => {
            choose('exchange');
            track('ending_choice', { ending: 'exchange' });
          }}
        >
          21% 파티에서 바꿔 입는다
        </button>
      </div>

      {ending === 'collect' && (
        <div className="ending" key="collect">
          <p>
            수거함에 넣은 티셔츠는 다시 바다를 건너요. 절반 이상은 되팔리지 못하고 가나의 옷 더미가 돼요.
          </p>
          <button type="button" className="cta cta--secondary" onClick={() => choose('exchange')}>
            다른 결말도 있어요 →
          </button>
        </div>
      )}
      {ending === 'exchange' && (
        <div className="ending" key="exchange">
          <p>
            티셔츠가 새 주인에게 건네졌어요. 착용 달력에 8, 9, 10… 체크가 이어져요.
          </p>
          <StatCard stat={PARTY_STAT} />
        </div>
      )}
      {ending && (
        <button type="button" className="cta cta--ghost" onClick={() => goTo(9)}>
          영수증 받기 ↓
        </button>
      )}
    </div>
  );
}

