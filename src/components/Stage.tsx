import { forwardRef } from 'react';
import { Shirt, type ShirtState } from './Shirt';
import type { Ending } from '../state';
import { priceOf } from '../data/chapters';

// 스테이지: 티셔츠는 제자리에 고정, 배경색과 장면 레이어만 바뀐다 (PRD 6.7, F-02)
// 챕터 안 스크럽 애니메이션은 --p0 ~ --p9 (0~1) CSS 변수로 구동 — transform·opacity만 사용

const SHIRT_STATE: ShirtState[] = ['new', 'thread', 'dyed', 'wrinkled', 'wrinkled', 'new', 'wrinkled', 'pilled', 'pilled', 'pilled'];

const ALT = [
  '흰 배경 가운데 옷걸이에 걸린 흰 티셔츠. 가격표가 흔들린다.',
  '메마른 목화밭 위로 물이 차오르고, 티셔츠는 실을 풀며 목화송이로 돌아간다.',
  '티셔츠가 염료통에 잠기고, 공장 뒤 강물이 맑은 파랑에서 탁한 남보라로 변한다.',
  '미싱 행렬과 굴뚝. 연기가 화면 위를 회색으로 덮고, 플러그는 석탄·가스 발전소로 이어진다.',
  '움직임이 멈춘 흑백 화면. 빈 미싱 의자들만 남아 있다.',
  '새 옷이 걸린 옷걸이가 끊임없이 흘러가고 NEW 태그가 쏟아진다.',
  '옷장 문이 열리고 달력 위에 착용 횟수가 체크된다. 티셔츠는 옷장 구석으로 밀려난다.',
  '세계 지도 위로 주황 실선이 유럽·북미·아시아에서 가나 아크라와 칠레 아타카마로 그려지고, 옷 더미가 산이 된다.',
  '두 갈래 길 앞의 티셔츠. 한쪽은 수거함, 한쪽은 새 주인.',
  '여정을 마친 티셔츠와 영수증.',
];

interface Props {
  active: number;
  ending: Ending;
  price: number;
}

export const Stage = forwardRef<HTMLDivElement, Props>(function Stage({ active, ending, price }, ref) {
  let shirtState = SHIRT_STATE[active];
  if (active >= 8 && ending === 'exchange') shirtState = 'renewed';
  const altText = active === 8 && ending ? (ending === 'exchange' ? '티셔츠가 새 주인에게 건네지고 화면이 다시 하얗게 밝아진다.' : '티셔츠가 수거함에 들어가고, 장면이 가나로 되감긴다.') : ALT[active];

  return (
    <div className="stage" ref={ref} data-ch={active} data-ending={ending ?? 'none'} role="img" aria-label={altText}>
      <svg viewBox="0 0 360 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
        <Scene0 />
        <Scene1 />
        <Scene2 />
        <Scene3 />
        <Scene4 />
        <Scene5 />
        <Scene6 />
        <Scene7 />
        <Scene8 />
        <Scene9 ending={ending} />

        <g className="stage-shirt">
          <g className="stage-shirt-inner">
            <Shirt state={shirtState} price={priceOf(price).tag} />
          </g>
        </g>

        <Scene8Front />
      </svg>
      {active === 7 && <p className="stage-note">지도는 이해를 돕기 위한 개념도로, 실제 축척과 다릅니다.</p>}
    </div>
  );
});

const L = { stroke: 'var(--line)', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function Scene0() {
  return (
    <g className="scene scene-0">
      <ellipse cx="180" cy="292" rx="70" ry="8" fill="var(--line)" opacity="0.08" />
      <g fill="none" {...L}>
        <path d="M180 28 q0 -12 10 -12 q10 0 10 10 q0 8 -10 12 v10" />
        <path d="M190 48 L120 82 h140 Z" />
      </g>
    </g>
  );
}

function Scene1() {
  const bolls = [
    [40, 220],
    [64, 196],
    [88, 228],
    [280, 210],
    [306, 190],
    [326, 226],
  ];
  return (
    <g className="scene scene-1">
      {/* 메마른 땅 */}
      <rect x="-20" y="250" width="400" height="90" fill="#d9c49a" />
      <g fill="none" stroke="#b39a6b" strokeWidth="1.75" strokeLinecap="round">
        <path d="M30 270 l20 10 l-6 14 M120 262 l14 16 l18 -4 M230 272 l-12 14 l16 10 M300 264 l18 12" />
      </g>
      {/* 차오르는 물 — 스크롤 진행률만큼 */}
      <rect className="water-rise" x="-20" y="210" width="400" height="120" fill="var(--sdg6-water)" opacity="0.35" />
      {/* 목화 */}
      <g {...L} fill="none">
        {bolls.map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x} 252 V${y + 8}`} />
            <circle cx={x} cy={y} r="11" fill="#fff" />
          </g>
        ))}
      </g>
      {/* 떨어지는 물방울 */}
      <g className="drops" fill="var(--sdg6-water)">
        {[60, 140, 220, 300].map((x, i) => (
          <path key={x} className="drop" style={{ animationDelay: `${i * 0.45}s` }} d={`M${x} 30 q7 10 0 14 q-7 -4 0 -14 Z`} />
        ))}
      </g>
    </g>
  );
}

function Scene2() {
  return (
    <g className="scene scene-2">
      {/* 공장 */}
      <g {...L} fill="#ebe9f0">
        <path d="M10 170 V110 l40 -24 v24 l40 -24 v24 l40 -24 V170 Z" />
        <rect x="104" y="40" width="16" height="50" />
      </g>
      {/* 물줄기 5개 중 1개가 염료색 */}
      <g fill="none" strokeWidth="5" strokeLinecap="round">
        {[30, 55, 80, 105, 130].map((x, i) => (
          <path key={x} d={`M${x} 170 V240`} stroke={i === 2 ? 'var(--dye-indigo)' : '#8ed3e8'} className={i === 2 ? 'dye-stream' : undefined} pathLength={1} />
        ))}
      </g>
      {/* 강 — 맑은 파랑 위로 남보라가 번진다 */}
      <path d="M-20 238 C80 226 160 252 380 236 V340 H-20 Z" fill="#8ed3e8" />
      <path className="river-dirty" d="M-20 238 C80 226 160 252 380 236 V340 H-20 Z" fill="var(--dye-indigo)" />
      {/* 염료통 */}
      <g {...L}>
        <path d="M232 210 h110 l-10 70 h-90 Z" fill="var(--dye-indigo)" />
        <ellipse cx="287" cy="210" rx="55" ry="9" fill="#4a4580" />
      </g>
    </g>
  );
}

function Scene3() {
  return (
    <g className="scene scene-3">
      {/* 발전소 */}
      <g {...L} fill="#e6e1d8">
        <path d="M282 260 V170 h20 V130 h16 V170 h20 V260 Z" />
      </g>
      {/* 플러그 → 발전소 */}
      <path d="M118 262 C170 300 220 300 282 250" fill="none" stroke="var(--line)" strokeWidth="1.75" strokeDasharray="5 5" />
      <path d="M232 274 l-8 14 h10 l-6 14" fill="none" stroke="var(--sdg7-energy)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* 미싱 행렬 */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${12 + i * 36} ${230 + i * 6}) scale(${0.9 - i * 0.15})`} {...L} fill="#f6f3ee">
          <path d="M0 30 h60 v-10 h-8 V0 H8 v20 H0 Z" />
          <path d="M8 0 h44 v12 H40" fill="none" />
        </g>
      ))}
      {/* 굴뚝 연기 — 스크롤 따라 위를 덮는다 */}
      <g className="smog" fill="var(--smog-400)">
        <circle cx="310" cy="110" r="22" />
        <circle cx="280" cy="84" r="30" />
        <circle cx="230" cy="60" r="38" />
        <circle cx="160" cy="40" r="44" />
        <circle cx="80" cy="36" r="46" />
        <circle cx="10" cy="44" r="40" />
      </g>
    </g>
  );
}

function Scene4() {
  return (
    <g className="scene scene-4">
      {/* 빈 미싱 의자들 — 흑백·정적 */}
      <g stroke="#8d877d" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2].map((c) => {
            const x = 50 + c * 100 + (r % 2) * 20;
            const y = 90 + r * 52;
            const s = 0.6 + r * 0.14;
            return (
              <g key={`${r}-${c}`} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.45 + r * 0.15}>
                <path d="M-30 0 h44 M-26 0 v28 M10 0 v28" />
                <path d="M24 10 v-22 M24 10 h16 M24 28 v-18 M40 10 v18" />
              </g>
            );
          }),
        )}
      </g>
    </g>
  );
}

function Scene5() {
  const colors = ['#e05a47', '#f2c14e', '#5b8bd9', '#9b6bd1', '#2fb59a', '#f08ab1', '#1c1b19', '#ffffff'];
  const hangers = Array.from({ length: 22 }, (_, i) => i);
  return (
    <g className="scene scene-5">
      <path d="M-20 52 H380" {...L} />
      <g className="rail">
        {hangers.map((i) => (
          <g key={i} transform={`translate(${i * 46 - 20} 52)`}>
            <path d="M0 0 v8 l-16 10 h32 Z" fill="none" stroke="var(--line)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M-16 18 l-10 10 l6 8 l4 -4 v40 h32 v-40 l4 4 l6 -8 l-10 -10 q-16 8 -32 0 Z" fill={colors[i % colors.length]} stroke="var(--line)" strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        ))}
      </g>
      <g className="new-tags" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700">
        {[
          [40, 160, -12],
          [300, 180, 10],
          [80, 260, 8],
          [270, 270, -8],
          [150, 290, 4],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <g className="new-tag" style={{ animationDelay: `${i * 0.3}s` }}>
              <rect x="-20" y="-11" width="40" height="18" rx="3" fill="var(--sdg12-consume)" />
              <text y="3" textAnchor="middle" fill="#fff">
                NEW
              </text>
            </g>
          </g>
        ))}
      </g>
    </g>
  );
}

function Scene6() {
  return (
    <g className="scene scene-6">
      {/* 옷장 */}
      <g {...L} fill="none">
        <rect x="24" y="24" width="200" height="272" fill="#f6f1e6" />
        <path d="M24 24 L-10 40 V280 L24 296" fill="#e2d9c6" />
        <path d="M40 60 H208" />
      </g>
      {/* 달력 — 7번 체크 */}
      <g transform="translate(244 70)">
        <rect width="100" height="120" rx="6" fill="#fff" {...L} />
        <rect width="100" height="22" rx="6" fill="var(--sdg12-consume)" />
        {Array.from({ length: 12 }, (_, i) => {
          const x = 10 + (i % 4) * 22;
          const y = 34 + Math.floor(i / 4) * 26;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect width="16" height="18" rx="3" fill="#f3efe7" />
              {i < 10 && (
                <path
                  className={`check ${i >= 7 ? 'check-extra' : ''}`}
                  style={{ ['--i' as string]: i }}
                  d="M3 9 l4 4 l7 -9"
                  fill="none"
                  stroke={i >= 7 ? 'var(--renew-green)' : 'var(--stamp-red)'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Scene7() {
  return (
    <g className="scene scene-7">
      {/* 단순화한 대륙 실루엣 — 국경선 없이 (PRD 6.5) */}
      <g fill="#6f6359" stroke="none">
        <path d="M30 70 q30 -30 80 -20 q20 10 10 30 q-20 10 -24 30 q-10 20 -30 10 q-30 -10 -36 -50 Z" />
        <path d="M92 150 q18 -6 28 10 q6 30 -10 60 q-8 20 -14 30 q-10 -40 -12 -60 q-4 -24 8 -40 Z" />
        <path d="M150 64 q16 -14 36 -8 q8 12 -6 18 q-14 4 -30 -10 Z" />
        <path d="M148 98 q26 -10 50 4 q14 30 0 60 q-10 30 -24 34 q-8 -30 -18 -50 q-16 -20 -8 -48 Z" />
        <path d="M200 50 q60 -20 110 6 q20 20 -6 44 q-30 14 -44 34 q-20 -10 -40 -24 q-24 -30 -20 -60 Z" />
        <path d="M280 180 q24 -6 40 8 q-4 18 -24 18 q-18 -6 -16 -26 Z" />
      </g>
      {/* 주황 실선 경로 */}
      <g fill="none" stroke="var(--ember-600)" strokeWidth="2.5" strokeLinecap="round">
        <path className="route" pathLength={1} d="M80 70 C110 100 140 130 168 160" />
        <path className="route" pathLength={1} d="M172 70 C176 100 172 130 168 160" />
        <path className="route" pathLength={1} d="M260 80 C230 110 200 140 168 160" />
        <path className="route route-late" pathLength={1} d="M80 70 C70 130 90 190 108 238" />
      </g>
      <g fill="var(--ember-600)">
        <circle cx="168" cy="160" r="4" />
        <circle cx="108" cy="238" r="4" />
      </g>
      <g className="map-label" fontSize="10">
        <text x="178" y="176">가나 아크라</text>
        <text x="118" y="254">칠레 아타카마</text>
      </g>
      {/* 쌓이는 옷 더미 + 연기 */}
      <g className="pile">
        <path d="M120 300 Q170 236 240 300 Z" fill="#7a6a5c" />
        <g fill="#9b8f84">
          <circle cx="160" cy="276" r="8" />
          <circle cx="186" cy="266" r="9" />
          <circle cx="206" cy="282" r="7" />
        </g>
        <g fill="#e0592a">
          <path d="M150 288 l6 -12 l6 12 Z" />
          <path d="M200 288 l5 -10 l5 10 Z" />
        </g>
        <g fill="var(--smog-400)" className="pile-smoke" opacity="0.5">
          <circle cx="180" cy="230" r="14" />
          <circle cx="196" cy="206" r="18" />
          <circle cx="214" cy="180" r="22" />
        </g>
      </g>
    </g>
  );
}

function Scene8() {
  return (
    <g className="scene scene-8">
      <g fill="none" strokeLinecap="round">
        <path d="M180 300 C180 270 120 262 70 240" stroke="#8d877d" strokeWidth="14" />
        <path d="M180 300 C180 270 240 262 290 240" stroke="var(--renew-green)" strokeWidth="14" opacity="0.8" />
      </g>
      {/* 수거함 */}
      <g transform="translate(26 150)" {...L} fill="#6b635a">
        <rect width="60" height="80" rx="4" />
        <rect x="14" y="14" width="32" height="8" rx="2" fill="#2a2927" />
      </g>
      {/* 새 주인 */}
      <g transform="translate(300 160)" className="new-owner" {...L} fill="#f4f0e8">
        <circle cy="-12" r="14" />
        <path d="M-24 70 v-40 q0 -22 24 -22 q24 0 24 22 v40 Z" />
      </g>
    </g>
  );
}

function Scene8Front() {
  // 교환 엔딩: 착용 달력 8, 9, 10… 이 이어진다
  return (
    <g className="scene scene-8 scene-8-front" fontFamily="var(--font-mono)" fontSize="13" fontWeight="700">
      <g className="wear-more">
        {[8, 9, 10].map((n, i) => (
          <g key={n} transform={`translate(${246 + i * 30} 40)`}>
            <g style={{ animationDelay: `${0.4 + i * 0.35}s` }} className="wear-n">
              <rect x="-12" y="-14" width="24" height="24" rx="5" fill="var(--renew-green)" />
              <text y="3" textAnchor="middle" fill="#fff">
                {n}
              </text>
            </g>
          </g>
        ))}
      </g>
    </g>
  );
}

function Scene9({ ending }: { ending: Ending }) {
  return (
    <g className="scene scene-9">
      {ending === 'collect' ? (
        <path d="M60 310 Q180 220 300 310 Z" fill="#cfc6ba" />
      ) : (
        <ellipse cx="180" cy="292" rx="80" ry="9" fill="var(--renew-green)" opacity="0.15" />
      )}
    </g>
  );
}
