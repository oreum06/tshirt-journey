import { forwardRef, useRef, useState } from 'react';
import { CHECKLIST, CREDITS, EXCHANGED_COUNT, INSTAGRAM_URL, PARTY_FORM_URL, SOURCES, WATER_TEE } from '../data/chapters';
import { useJourney } from '../state';
import { track } from '../lib/analytics';

const won = (n: number) => `₩${n.toLocaleString('ko-KR')}`;

interface Lines {
  price: number;
  wears: number;
  exchange: boolean;
}

/** 영수증 본문 — 화면용과 9:16 저장용이 같은 마크업을 쓴다 */
const ReceiptPaper = forwardRef<HTMLDivElement, Lines & { story?: boolean }>(function ReceiptPaper({ price, wears, exchange, story }, ref) {
  const rows: [string, string][] = [
    ['가격', won(price)],
    ['물', `${WATER_TEE.toLocaleString('ko-KR')}L (약 2년 반 식수)`],
    ['에너지', '석탄·가스'],
    ['노동', '표기 없는 비용'],
    ['착용', `${wears}회`],
    ['도착지', exchange ? '새 주인' : '가나 아크라'],
  ];
  return (
    <div ref={ref} className={`paper ${story ? 'paper--story' : ''} ${exchange ? 'is-exchange' : 'is-collect'}`}>
      {story && <p className="paper-brand">티셔츠 한 벌의 여행</p>}
      <p className="paper-head">
        RECEIPT · 진짜 영수증
        <br />
        흰 티셔츠 1벌
      </p>
      <hr />
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <hr />
      <p className="paper-total">
        <span>총액</span>
        <span>지구가 대신 지불함</span>
      </p>
      <div className="paper-stamp" aria-hidden>
        {exchange ? '바꿔 입음' : '지구 부담'}
      </div>
      <p className="paper-foot">{exchange ? '이 티셔츠의 여행은 계속돼요 · 21% 파티' : '다른 결말도 있어요 · 21% 파티'}</p>
    </div>
  );
});

function isInApp() {
  return /Instagram|FBAN|FBAV|KAKAOTALK|Line\//i.test(navigator.userAgent);
}

export function Receipt() {
  const { price, wears, ending, goTo, toast } = useJourney();
  const storyRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.map(() => false));
  const [showSources, setShowSources] = useState(false);
  const exchange = ending === 'exchange';

  async function save() {
    if (!storyRef.current || busy) return;
    setBusy(true);
    try {
      const { toPng, toBlob } = await import('html-to-image');
      const opts = { pixelRatio: 3, width: 360, height: 640, cacheBust: true };
      const blob = await toBlob(storyRef.current, opts);
      if (!blob) throw new Error('no blob');
      const file = new File([blob], 'tshirt-receipt.png', { type: 'image/png' });
      track('receipt_share', { ending: ending ?? 'none' });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: '티셔츠 한 벌의 진짜 영수증' });
          toast('영수증을 공유했어요');
        } catch {
          /* 사용자가 공유 시트를 닫음 */
        }
      } else if (isInApp()) {
        // 인앱 브라우저는 다운로드가 막히는 경우가 많아 길게 눌러 저장하도록 보여준다
        setPreview(await toPng(storyRef.current, opts));
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'tshirt-receipt.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        toast('영수증을 저장했어요');
      }
    } catch (err) {
      console.error(err);
      toast('저장에 실패했어요. 화면을 캡처해 주세요');
    } finally {
      setBusy(false);
    }
  }

  if (!ending) {
    return (
      <div className="receipt-pending">
        <p>갈림길에서 티셔츠의 다음 여행을 고르면 영수증이 완성돼요.</p>
        <button type="button" className="cta cta--secondary" onClick={() => goTo(8)}>
          ↑ 갈림길로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="receipt">
      <div className="receipt-print">
        <ReceiptPaper price={price} wears={wears} exchange={exchange} />
      </div>

      <div className="receipt-actions">
        <a
          className="cta cta--primary"
          href={PARTY_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('cta_click', { cta: 'party_apply', ending })}
        >
          21% 파티 신청하기
        </a>
        <button type="button" className="cta cta--secondary" onClick={save} disabled={busy}>
          {busy ? '영수증 만드는 중…' : '영수증 저장·공유'}
        </button>
        <a
          className="cta cta--ghost"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('cta_click', { cta: 'instagram_follow' })}
        >
          인스타 팔로우
        </a>
      </div>

      <div className="checklist">
        <p className="checklist-title">오늘부터 할 수 있는 3가지</p>
        {CHECKLIST.map((c, i) => (
          <label key={c} className={checked[i] ? 'is-on' : ''}>
            <input type="checkbox" checked={checked[i]} onChange={() => setChecked((s) => s.map((v, j) => (j === i ? !v : v)))} />
            <span>{c}</span>
          </label>
        ))}
      </div>

      <p className="counter">
        우리 학교에서 바꿔 입은 옷{' '}
        <b>{EXCHANGED_COUNT === null ? '○' : EXCHANGED_COUNT.toLocaleString('ko-KR')}벌</b>
        {EXCHANGED_COUNT === null && <span className="caption"> · 파티 후 공개</span>}
      </p>

      <div className="receipt-foot">
        <button type="button" className="link-btn" aria-expanded={showSources} onClick={() => setShowSources((v) => !v)}>
          출처 전체 목록 {showSources ? '접기' : '펼치기'}
        </button>
        {showSources && (
          <ul className="source-list">
            {Object.values(SOURCES).map((s) => (
              <li key={s.name}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.name}
                  </a>
                ) : (
                  s.name
                )}
                {s.date && ` (${s.date})`}
              </li>
            ))}
          </ul>
        )}
        <p className="credits">{CREDITS}</p>
        {import.meta.env.VITE_GA_ID && <p>익명 방문 통계(GA4)만 사용하며, 이름·연락처는 수집하지 않아요.</p>}
        <button type="button" className="link-btn" onClick={() => goTo(0)}>
          처음부터 다시 보기 ↑
        </button>
      </div>

      {/* 9:16 저장용 (화면 밖) */}
      <div className="story-canvas" aria-hidden>
        <ReceiptPaper ref={storyRef} story price={price} wears={wears} exchange={exchange} />
      </div>

      {preview && (
        <div className="preview" role="dialog" aria-modal="true" aria-label="영수증 이미지">
          <p>이미지를 길게 눌러 저장하세요</p>
          <img src={preview} alt="진짜 영수증" />
          <button type="button" className="cta cta--secondary" onClick={() => setPreview(null)}>
            닫기
          </button>
        </div>
      )}
    </div>
  );
}
