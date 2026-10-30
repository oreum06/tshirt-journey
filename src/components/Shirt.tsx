// 주인공 티셔츠 — 얼굴 없는 사물, 상태 변화로 감정을 보여준다 (PRD 6.5, 상태 시트 6종)
export type ShirtState = 'new' | 'thread' | 'dyed' | 'wrinkled' | 'pilled' | 'renewed';

const BODY =
  'M-50 -78 L-25 -88 Q0 -72 25 -88 L50 -78 L84 -48 L64 -20 L46 -32 L46 78 L-46 78 L-46 -32 L-64 -20 L-84 -48 Z';

const FILL: Record<ShirtState, string> = {
  new: '#ffffff',
  thread: '#fbfaf6',
  dyed: '#e7e8f1',
  wrinkled: '#f1eee7',
  pilled: '#d6d1c7',
  renewed: '#ffffff',
};

export function Shirt({ state, price }: { state: ShirtState; price?: string }) {
  return (
    <g className={`shirt shirt--${state}`}>
      {state === 'renewed' && (
        <g className="shirt-glow" aria-hidden>
          <circle r="118" fill="var(--renew-green)" opacity="0.12" />
          <circle r="96" fill="var(--renew-green)" opacity="0.1" />
        </g>
      )}
      <path
        d={BODY}
        fill={FILL[state]}
        stroke="var(--line)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeDasharray={state === 'thread' ? '7 5' : undefined}
      />
      <path d="M-25 -88 Q0 -62 25 -88" fill="none" stroke="var(--line)" strokeWidth="2" strokeLinecap="round" />

      {state === 'thread' && (
        <g fill="none" stroke="var(--line)" strokeWidth="1.75" strokeLinecap="round">
          <path d="M-46 78 C-52 96 -38 104 -48 122" />
          <path d="M8 78 C2 98 18 108 10 128" />
          <path d="M46 70 C62 84 58 102 74 112" />
          <circle cx="-48" cy="128" r="9" fill="#fff" />
          <circle cx="10" cy="134" r="10" fill="#fff" />
          <circle cx="76" cy="118" r="8" fill="#fff" />
        </g>
      )}

      {state === 'dyed' && (
        <g className="shirt-dye">
          <clipPath id="shirt-clip">
            <path d={BODY} />
          </clipPath>
          <rect
            className="shirt-dye-fill"
            x="-90"
            y="-90"
            width="180"
            height="170"
            fill="var(--dye-indigo)"
            opacity="0.85"
            clipPath="url(#shirt-clip)"
          />
          <path d={BODY} fill="none" stroke="var(--line)" strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}

      {(state === 'wrinkled' || state === 'pilled') && (
        <g fill="none" stroke="var(--line)" strokeWidth="1.75" strokeLinecap="round" opacity="0.7">
          <path d="M-30 -20 q10 8 22 2" />
          <path d="M10 10 q12 10 26 4" />
          <path d="M-34 40 q14 -6 24 4" />
          <path d="M14 52 q8 -8 20 -2" />
        </g>
      )}
      {state === 'pilled' && (
        <g fill="var(--smog-400)">
          {[
            [-28, -40],
            [20, -30],
            [-10, 0],
            [30, 20],
            [-30, 18],
            [0, 40],
            [-18, 62],
            [26, 64],
            [-56, -44],
            [58, -40],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" />
          ))}
        </g>
      )}

      {state === 'new' && price && (
        <g className="price-tag">
          <path d="M34 -80 L50 -46" stroke="var(--line)" strokeWidth="1.5" fill="none" />
          <g transform="translate(50 -46) rotate(14)">
            <path d="M-4 0 L46 0 L46 26 L-4 26 L-14 13 Z" fill="#fff" stroke="var(--line)" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="-4" cy="13" r="2.5" fill="var(--line)" />
            <text x="22" y="18" textAnchor="middle" className="tag-text">
              {price}
            </text>
          </g>
        </g>
      )}

      {state === 'renewed' && (
        <g stroke="var(--renew-green)" strokeWidth="2.5" strokeLinecap="round" className="sparkles">
          <path d="M-100 -70 v14 M-107 -63 h14" />
          <path d="M98 -76 v14 M91 -69 h14" />
          <path d="M104 40 v10 M99 45 h10" />
        </g>
      )}
    </g>
  );
}
