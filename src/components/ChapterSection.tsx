import type { Card, Chapter } from '../data/chapters';
import { StatCard } from './StatCard';
import { Bars, Branch, ClosetGrid, Drops, PriceChips, Streams, WearSlider, useInView } from './Widgets';
import { Receipt } from './Receipt';

const SDG_NAME = { 6: '깨끗한 물', 7: '깨끗한 에너지', 12: '책임 있는 소비·생산' } as const;

function Widget({ type }: { type: NonNullable<Card['widget']> }) {
  switch (type) {
    case 'priceChips':
      return <PriceChips />;
    case 'drops':
      return <Drops />;
    case 'streams':
      return <Streams />;
    case 'bars':
      return <Bars />;
    case 'closetGrid':
      return <ClosetGrid />;
    case 'wearSlider':
      return <WearSlider />;
    case 'branch':
      return <Branch />;
    case 'receipt':
      return <Receipt />;
  }
}

/** 여권 스탬프 (F-15) — 챕터 완료 시 찍힌다 */
function Stamp({ chapter }: { chapter: Chapter }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.9);
  return (
    <div ref={ref} className={`stamp ${inView ? 'is-in' : ''}`} aria-hidden>
      <span>{chapter.place}</span>
      <small>CH.{chapter.id} ✓</small>
    </div>
  );
}

function NarrationCard({ card, chapter }: { card: Card; chapter: Chapter }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  return (
    <div ref={ref} className={`card ${inView ? 'is-in' : ''} ${card.widget === 'receipt' ? 'card--receipt' : ''}`}>
      {card.text.length > 0 && (
        <p className="card-text">
          {card.text.map((t, i) => (
            <span key={i}>{t} </span>
          ))}
        </p>
      )}
      {card.stat && <StatCard stat={card.stat} />}
      {card.widget && <Widget type={card.widget} />}
      {card.stamp && <Stamp chapter={chapter} />}
    </div>
  );
}

export function ChapterSection({ chapter }: { chapter: Chapter }) {
  return (
    <section id={`ch${chapter.id}`} className={`chapter chapter-${chapter.id}`} data-ch={chapter.id} aria-labelledby={`ch${chapter.id}-title`}>
      <header className="card card--title is-in">
        <p className="kicker">
          {chapter.kicker}
          {chapter.sdg && (
            <span className={`sdg sdg-${chapter.sdg}`} title={`SDG ${chapter.sdg} ${SDG_NAME[chapter.sdg]}`}>
              SDG {chapter.sdg}
            </span>
          )}
        </p>
        <h2 id={`ch${chapter.id}-title`}>{chapter.id === 0 || chapter.id === 8 ? <>"{chapter.title}"</> : chapter.title}</h2>
        {chapter.id === 0 && (
          <p className="hint">
            약 3분 · 소리 없이 볼 수 있어요 <span className="hint-arrow" aria-hidden>↓</span>
          </p>
        )}
      </header>
      {chapter.cards.map((card, i) => (
        <NarrationCard key={i} card={card} chapter={chapter} />
      ))}
    </section>
  );
}
