/**
 * Banner "muro de Foz do Iguaçu" — arte original em SVG (sem imagens externas).
 * Cataratas, Marco das Três Fronteiras, Itaipu e Ponte da Amizade em spray,
 * pixos (letra reta, alongada) e raios na cor da campanha da Boneti.
 *
 * É vetorial: fica nítido em qualquer tela e pesa poucos KB.
 * Fontes vêm do CSS da página (Anton para os pixos, Sedgwick/Permanent Marker para tags).
 */

const BLUE = "#3b3bff";
const VIOLET = "#8a4dff";
const LIME = "#c8ff3d";
const WHITE = "#f5f5f3";

/** Pixo: letra reta alongada, contorno fino — inspirado no pixo paulista. */
function Pixo({ x, y, text, size = 64, stretch = 1.9, rotate = 0, color = WHITE, opacity = 0.85, fill = false }: { x: number; y: number; text: string; size?: number; stretch?: number; rotate?: number; color?: string; opacity?: number; fill?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(1 ${stretch})`} opacity={opacity}>
      <text
        className="pixo-font"
        fontSize={size}
        letterSpacing={size * 0.12}
        fill={fill ? color : "none"}
        stroke={color}
        strokeWidth={fill ? 0 : 1.6}
        filter="url(#fz-rough)"
      >
        {text}
      </text>
    </g>
  );
}

/** Escorrido de tinta. */
function Drips({ x, y, color, n = 4, spread = 120, seed = 1 }: { x: number; y: number; color: string; n?: number; spread?: number; seed?: number }) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const dx = ((i * 37 + seed * 13) % 100) / 100;
    const h = 18 + (((i * 53 + seed * 29) % 100) / 100) * 60;
    out.push(
      <g key={i} fill={color}>
        <rect x={x + dx * spread} y={y} width="3.5" height={h} rx="1.75" />
        <circle cx={x + dx * spread + 1.75} cy={y + h} r="3.2" />
      </g>,
    );
  }
  return <g opacity="0.8">{out}</g>;
}

export function FozBanner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Muro grafitado com Cataratas do Iguaçu, Marco das Três Fronteiras, Itaipu e Ponte da Amizade">
      <defs>
        {/* textura de concreto */}
        <filter id="fz-concrete" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.09  0 0 0 0 0.09  0 0 0 0 0.11  0 0 0 0.55 0" />
        </filter>
        {/* borda irregular de spray */}
        <filter id="fz-rough" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="3.5" />
        </filter>
        <filter id="fz-mist" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="fz-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="fz-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#07071a" />
          <stop offset="0.55" stopColor="#120a35" />
          <stop offset="1" stopColor="#0b0b0c" />
        </linearGradient>
        <linearGradient id="fz-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={WHITE} stopOpacity="0.95" />
          <stop offset="1" stopColor="#8fb7ff" stopOpacity="0.25" />
        </linearGradient>
        <radialGradient id="fz-spot" cx="0.5" cy="0.42" r="0.55">
          <stop offset="0" stopColor={VIOLET} stopOpacity="0.35" />
          <stop offset="1" stopColor={VIOLET} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* muro */}
      <rect width="1600" height="900" fill="url(#fz-sky)" />
      <rect width="1600" height="900" filter="url(#fz-concrete)" />
      <rect width="1600" height="900" fill="url(#fz-spot)" />
      {/* juntas dos blocos do muro */}
      <g stroke="#ffffff" strokeOpacity="0.035" strokeWidth="2">
        {Array.from({ length: 9 }).map((_, r) => (
          <line key={`h${r}`} x1="0" x2="1600" y1={100 * (r + 1)} y2={100 * (r + 1)} />
        ))}
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 9 }).map((__, c) => (
            <line key={`v${r}-${c}`} x1={c * 200 + (r % 2) * 100} x2={c * 200 + (r % 2) * 100} y1={r * 100} y2={r * 100 + 100} />
          )),
        )}
      </g>

      {/* raios da campanha */}
      <g stroke={VIOLET} strokeWidth="3" fill="none" filter="url(#fz-glow)" opacity="0.75" strokeLinejoin="bevel">
        <path d="M70 0 L140 120 L95 135 L190 300 L150 310 L230 440" />
        <path d="M1530 0 L1460 140 L1505 150 L1400 330 L1440 340 L1360 470" />
        <path d="M820 0 L790 70 L815 78 L770 160" strokeWidth="2" />
      </g>

      {/* ---------------- skyline de Foz ---------------- */}

      {/* mata atlântica atrás de tudo (linha de copas) */}
      <path d="M0 700 L0 696 Q21 667 27 699 L44 696 Q60 668 66 681 L78 700 Q93 670 99 694 L121 679 Q130 664 136 684 L148 673 Q164 672 170 695 L180 693 Q195 670 201 698 L220 678 Q237 650 243 691 L254 671 Q262 656 268 682 L287 669 Q307 664 313 685 L330 680 Q346 657 352 695 L366 699 Q374 671 380 677 L397 685 Q411 667 417 677 L438 684 Q451 657 457 691 L471 669 Q480 668 486 699 L497 693 Q506 659 512 687 L523 669 Q544 671 550 675 L563 681 Q585 651 591 690 L607 693 Q621 652 627 693 L647 680 Q667 671 673 683 L688 673 Q700 660 706 675 L722 675 Q732 657 738 697 L749 668 Q757 664 763 700 L780 679 Q798 667 804 681 L821 700 Q832 654 838 688 L858 692 Q867 662 873 688 L886 668 Q898 668 904 684 L914 681 Q924 662 930 694 L950 674 Q958 654 964 681 L981 684 Q989 669 995 685 L1009 692 Q1018 652 1024 677 L1037 683 Q1045 669 1051 686 L1066 697 Q1076 668 1082 690 L1101 676 Q1122 662 1128 680 L1148 677 Q1160 657 1166 694 L1179 680 Q1189 670 1195 692 L1208 692 Q1230 665 1236 694 L1247 694 Q1255 653 1261 678 L1271 700 Q1283 657 1289 698 L1310 693 Q1322 663 1328 694 L1345 686 Q1361 655 1367 698 L1378 676 Q1389 665 1395 692 L1415 672 Q1427 656 1433 681 L1454 669 Q1463 658 1469 688 L1486 683 Q1494 651 1500 680 L1514 691 Q1530 668 1536 679 L1547 691 Q1557 664 1563 685 L1583 676 Q1600 651 1606 675 L1600 700 L1600 900 L0 900 Z" fill="#0c1a12" opacity="0.95" />

      {/* CATARATAS — paredão com quedas e névoa (esquerda) */}
      <g>
        <path d="M0 610 L60 590 L140 600 L210 585 L300 598 L370 605 L370 760 L0 760 Z" fill="#1a1530" stroke={BLUE} strokeWidth="2.5" filter="url(#fz-rough)" />
        {[18, 44, 62, 95, 118, 150, 172, 205, 238, 256, 290, 318, 345].map((x, i) => (
          <rect key={x} x={x} y={600 - (i % 3) * 6} width={[9, 16, 6, 12, 20, 7][i % 6]} height={150 + (i % 4) * 9} fill="url(#fz-water)" opacity={0.55 + (i % 3) * 0.15} filter="url(#fz-rough)" />
        ))}
        <ellipse cx="185" cy="770" rx="230" ry="55" fill={WHITE} opacity="0.35" filter="url(#fz-mist)" />
        <Pixo x={40} y={575} text="CATARATAS" size={30} stretch={1.7} color={LIME} opacity={0.9} />
      </g>

      {/* MARCO DAS TRÊS FRONTEIRAS — obelisco com as três cores */}
      <g transform="translate(405 500)">
        <path d="M0 230 L14 20 L26 0 L38 20 L52 230 Z" fill="#141428" stroke={WHITE} strokeWidth="2" filter="url(#fz-rough)" />
        <rect x="4" y="150" width="44" height="22" fill="#1fa24a" opacity="0.85" />
        <rect x="4" y="172" width="44" height="22" fill="#d52b1e" opacity="0.85" />
        <rect x="4" y="194" width="44" height="22" fill="#6cace4" opacity="0.85" />
        <rect x="-30" y="226" width="112" height="14" fill="#141428" stroke={WHITE} strokeWidth="2" />
        <Pixo x={-40} y={-30} text="3 FRONTEIRAS" size={22} stretch={1.6} opacity={0.85} />
      </g>

      {/* ITAIPU — barragem com vertedouro (centro, baixa para não brigar com o tênis) */}
      <g>
        <path d="M640 760 L660 690 L1030 690 L1050 760 Z" fill="#17172d" stroke={BLUE} strokeWidth="2.5" filter="url(#fz-rough)" />
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={672 + i * 26} y1="694" x2={668 + i * 26} y2="756" stroke={WHITE} strokeOpacity="0.35" strokeWidth="2" />
        ))}
        <path d="M940 690 L1000 690 L1040 760 L960 760 Z" fill="url(#fz-water)" opacity="0.7" />
        <ellipse cx="1000" cy="775" rx="90" ry="22" fill={WHITE} opacity="0.3" filter="url(#fz-mist)" />
        <Pixo x={680} y={672} text="ITAIPU" size={26} stretch={1.7} color={WHITE} opacity={0.45} />
      </g>

      {/* PONTE DA AMIZADE — arco (direita) */}
      <g filter="url(#fz-rough)">
        <path d="M1080 760 Q1340 470 1600 760" fill="none" stroke={WHITE} strokeWidth="9" />
        <path d="M1080 760 Q1340 500 1600 760" fill="none" stroke={BLUE} strokeWidth="4" />
        <line x1="1060" y1="690" x2="1600" y2="690" stroke={WHITE} strokeWidth="7" />
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 1140 + i * 40;
          const t = (x - 1080) / 520;
          const yArc = 760 - 580 * t * (1 - t); // curva do arco (Bézier quadrática)
          return <line key={i} x1={x} y1={Math.min(yArc, 690)} x2={x} y2="690" stroke={WHITE} strokeOpacity="0.7" strokeWidth="2" />;
        })}
        <rect x="1070" y="690" width="16" height="70" fill={WHITE} opacity="0.8" />
        <rect x="1580" y="690" width="16" height="70" fill={WHITE} opacity="0.8" />
      </g>
      <Pixo x={1180} y={655} text="PONTE DA AMIZADE" size={22} stretch={1.6} opacity={0.75} />

      {/* rio Paraná passando embaixo */}
      <path d="M0 790 Q400 770 800 795 T1600 785 L1600 900 L0 900 Z" fill="#0d1440" opacity="0.9" />
      <g stroke={WHITE} strokeOpacity="0.18" strokeWidth="2">
        <line x1="120" y1="820" x2="260" y2="818" />
        <line x1="620" y1="830" x2="760" y2="828" />
        <line x1="1180" y1="815" x2="1330" y2="817" />
      </g>

      {/* ---------------- pixos e tags no muro ---------------- */}
      <Pixo x={60} y={250} text="FOZ" size={110} stretch={2.1} rotate={-3} color={WHITE} opacity={0.18} fill />
      <Pixo x={1250} y={270} text="045" size={120} stretch={2} rotate={4} color={VIOLET} opacity={0.4} fill />
      <Pixo x={70} y={390} text="BONETI • FOZ DO IGUAÇU" size={26} stretch={1.9} rotate={-2} opacity={0.55} />
      <Pixo x={1090} y={420} text="TRÍPLICE FRONTEIRA" size={24} stretch={1.9} rotate={2} opacity={0.5} />
      <Pixo x={1240} y={490} text="BR · PY · AR" size={22} stretch={1.8} rotate={-1} color={LIME} opacity={0.6} />
      <Drips x={1250} y={300} color={VIOLET} n={5} spread={180} seed={2} />
      <Drips x={70} y={275} color={WHITE} n={4} spread={160} seed={5} />

      {/* tag em letra de spray */}
      <text x="1250" y="570" className="tag-font" fontSize="44" fill={LIME} opacity="0.75" transform="rotate(-8 1250 570)" filter="url(#fz-rough)">
        da fronteira
      </text>
      <text x="210" y="480" className="tag-font" fontSize="38" fill={WHITE} opacity="0.5" transform="rotate(6 210 480)" filter="url(#fz-rough)">
        045 crew
      </text>

      {/* spray de tinta espirrada */}
      <g fill={LIME} opacity="0.5">
        {[
          [1215, 520, 3], [1232, 532, 2], [1270, 525, 2.5], [1295, 540, 1.8], [260, 440, 2.2], [290, 455, 1.5], [1480, 600, 2],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </svg>
  );
}
