import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

import { SYMBOLS, type SymbolInfo } from '@/data/symbols';

/**
 * Hand-drawn SVG illustrations of German traffic signs, markings, lights and
 * dashboard symbols. Pictograms are simplified; shapes and colours follow the
 * official StVO signs.
 */
const RED = '#C1121F';
const BLUE = '#1F4FA3';
const YELLOW = '#F6C445';
const BLACK = '#1A1A1A';
const WHITE = '#FFFFFF';
const GREY = '#6B6B6B';

// ── Frames ───────────────────────────────────────────────────
const Warn = ({ children, flip }: { children?: React.ReactNode; flip?: boolean }) => (
  <G>
    <Polygon points="50,6 96,90 4,90" fill={WHITE} stroke={RED} strokeWidth={9} strokeLinejoin="round" />
    <G transform={flip ? 'translate(100,0) scale(-1,1)' : undefined}>{children}</G>
  </G>
);
const Ring = ({ fill = WHITE, children }: { fill?: string; children?: React.ReactNode }) => (
  <G>
    <Circle cx={50} cy={50} r={44} fill={fill} stroke={RED} strokeWidth={10} />
    {children}
  </G>
);
const EndRing = ({ children }: { children?: React.ReactNode }) => (
  <G>
    <Circle cx={50} cy={50} r={45} fill={WHITE} stroke="#888" strokeWidth={2} />
    <G opacity={0.55}>{children}</G>
    {[-10, -4, 2, 8].map((o) => <Line key={o} x1={22 + o} y1={22 - o} x2={78 + o} y2={78 - o} stroke={BLACK} strokeWidth={2.5} />)}
  </G>
);
const BlueDisc = ({ children }: { children?: React.ReactNode }) => (
  <G>
    <Circle cx={50} cy={50} r={46} fill={BLUE} stroke={WHITE} strokeWidth={3} />
    {children}
  </G>
);
const BlueSq = ({ children, w = 90, h = 90 }: { children?: React.ReactNode; w?: number; h?: number }) => (
  <G>
    <Rect x={(100 - w) / 2} y={(100 - h) / 2} width={w} height={h} rx={7} fill={BLUE} stroke={WHITE} strokeWidth={3} />
    {children}
  </G>
);
const Plate = ({ lines, size = 15 }: { lines: string[]; size?: number }) => (
  <G>
    <Rect x={3} y={24} width={94} height={52} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} />
    {lines.map((l, i) => (
      <SvgText key={i} x={50} y={50 + (i - (lines.length - 1) / 2) * (size + 3) + size / 3} fontSize={size} fontWeight="bold" fill={BLACK} textAnchor="middle" fontFamily="Arial">
        {l}
      </SvgText>
    ))}
  </G>
);
const T = ({ x = 50, y, s, c = BLACK, t, w = 'bold' }: { x?: number; y: number; s: number; c?: string; t: string; w?: 'bold' | 'normal' }) => (
  <SvgText x={x} y={y} fontSize={s} fontWeight={w} fill={c} textAnchor="middle" fontFamily="Arial">{t}</SvgText>
);

// ── Pictograms ───────────────────────────────────────────────
const Person = ({ x, y, s = 1, color = BLACK }: { x: number; y: number; s?: number; color?: string }) => (
  <G transform={`translate(${x},${y}) scale(${s})`}>
    <Circle cx={0} cy={-18} r={5} fill={color} />
    <Path d="M0,-12 L0,4 M0,4 L-7,18 M0,4 L7,18 M0,-8 L-8,0 M0,-8 L8,-2" stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" />
  </G>
);
const Bike = ({ x, y, s = 1, color = BLACK }: { x: number; y: number; s?: number; color?: string }) => (
  <G transform={`translate(${x},${y}) scale(${s})`}>
    <Circle cx={-14} cy={8} r={9} stroke={color} strokeWidth={3} fill="none" />
    <Circle cx={14} cy={8} r={9} stroke={color} strokeWidth={3} fill="none" />
    <Path d="M-14,8 L-4,-6 L10,-6 L14,8 M-4,-6 L2,8 L10,-6 M-6,-10 L-1,-10 M10,-6 L8,-13 L13,-13" stroke={color} strokeWidth={3} fill="none" strokeLinejoin="round" />
  </G>
);
const CarSide = ({ x, y, color = BLACK, s = 1 }: { x: number; y: number; color?: string; s?: number }) => (
  <G transform={`translate(${x},${y}) scale(${s})`}>
    <Path d="M-16,4 L-16,-2 L-10,-4 L-6,-11 L7,-11 L12,-4 L16,-2 L16,4 Z" fill={color} />
    <Circle cx={-9} cy={5} r={3.5} fill={color} />
    <Circle cx={9} cy={5} r={3.5} fill={color} />
  </G>
);
const CarFront = ({ x, y, color = BLACK, s = 1 }: { x: number; y: number; color?: string; s?: number }) => (
  <G transform={`translate(${x},${y}) scale(${s})`}>
    <Path d="M-14,8 L-14,-2 L-10,-12 L10,-12 L14,-2 L14,8 Z" fill={color} />
    <Rect x={-9} y={-10} width={18} height={6} fill={WHITE} opacity={0.6} />
    <Rect x={-14} y={8} width={6} height={4} fill={color} />
    <Rect x={8} y={8} width={6} height={4} fill={color} />
  </G>
);
const Truck = ({ x, y, color = BLACK, s = 1 }: { x: number; y: number; color?: string; s?: number }) => (
  <G transform={`translate(${x},${y}) scale(${s})`}>
    <Rect x={-20} y={-14} width={26} height={16} fill={color} />
    <Path d="M6,-8 L13,-8 L18,-2 L18,2 L6,2 Z" fill={color} />
    <Circle cx={-12} cy={5} r={3.5} fill={color} />
    <Circle cx={10} cy={5} r={3.5} fill={color} />
  </G>
);
const Moto = ({ x, y, color = BLACK, s = 1 }: { x: number; y: number; color?: string; s?: number }) => (
  <G transform={`translate(${x},${y}) scale(${s})`}>
    <Circle cx={-12} cy={6} r={6} fill="none" stroke={color} strokeWidth={3} />
    <Circle cx={12} cy={6} r={6} fill="none" stroke={color} strokeWidth={3} />
    <Path d="M-12,6 L-2,-4 L8,-4 L12,6 M-4,-8 L4,-8" stroke={color} strokeWidth={4} fill="none" />
  </G>
);
const Arrow = ({ d, color = WHITE, w = 9 }: { d: 'up' | 'down' | 'left' | 'right'; color?: string; w?: number }) => {
  const rot = { up: 0, right: 90, down: 180, left: 270 }[d];
  return (
    <G transform={`rotate(${rot} 50 50)`}>
      <Line x1={50} y1={80} x2={50} y2={36} stroke={color} strokeWidth={w} />
      <Polygon points="50,18 68,40 32,40" fill={color} />
    </G>
  );
};
const Deer = ({ color = BLACK }: { color?: string }) => (
  <G transform="translate(48,64)">
    <Path d="M-16,2 Q-14,-8 0,-8 L10,-8 L14,-16 L18,-14 L16,-6 L14,0 L12,14 M10,0 L8,14 M-12,2 L-14,14 M-8,4 L-6,14" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
    <Path d="M14,-16 L12,-24 M14,-16 L20,-22 M16,-18 L22,-18" stroke={color} strokeWidth={2.5} />
  </G>
);
const Light = ({ on }: { on: ('r' | 'y' | 'g')[] }) => (
  <G>
    <Rect x={34} y={8} width={32} height={84} rx={8} fill="#222" />
    <Circle cx={50} cy={24} r={10} fill={on.includes('r') ? '#FF3B30' : '#4a1d1d'} />
    <Circle cx={50} cy={50} r={10} fill={on.includes('y') ? '#FFC107' : '#4a3b12'} />
    <Circle cx={50} cy={76} r={10} fill={on.includes('g') ? '#2ED158' : '#163d22'} />
  </G>
);
const Road = ({ children }: { children?: React.ReactNode }) => (
  <G>
    <Rect x={0} y={0} width={100} height={100} rx={8} fill="#5E6168" />
    {children}
  </G>
);
const Dash = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <G>
    <Rect x={4} y={4} width={92} height={92} rx={20} fill="#16181d" />
    <G stroke={color} fill="none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">{children}</G>
  </G>
);
const Officer = ({ arms }: { arms: 'side' | 'up' | 'front' }) => (
  <G>
    <Rect x={0} y={0} width={100} height={100} rx={8} fill="#E8EEF5" />
    <Circle cx={50} cy={22} r={9} fill="#2b3a55" />
    <Rect x={40} y={14} width={20} height={5} fill={WHITE} />
    <Rect x={40} y={32} width={20} height={34} rx={4} fill="#2b3a55" />
    <Rect x={42} y={64} width={7} height={30} fill="#2b3a55" />
    <Rect x={51} y={64} width={7} height={30} fill="#2b3a55" />
    {arms === 'side' ? <Path d="M40,38 L10,38 M60,38 L90,38" stroke="#2b3a55" strokeWidth={7} strokeLinecap="round" /> : null}
    {arms === 'up' ? <Path d="M58,36 L64,6" stroke="#2b3a55" strokeWidth={7} strokeLinecap="round" /> : null}
    {arms === 'front' ? <Path d="M40,38 L30,58 M60,38 L70,58" stroke="#2b3a55" strokeWidth={7} strokeLinecap="round" /> : null}
  </G>
);

function Pict({ id }: { id: string }) {
  switch (id) {
    // ───────── Gefahrzeichen ─────────
    case 'gefahr': return <Warn><Rect x={45} y={36} width={10} height={30} rx={3} fill={BLACK} /><Circle cx={50} cy={76} r={5.5} fill={BLACK} /></Warn>;
    case 'rechtsvorlinks': return <Warn><Path d="M36,44 L64,78 M64,44 L36,78" stroke={BLACK} strokeWidth={8} strokeLinecap="round" /></Warn>;
    case 'kurverechts': return <Warn><Path d="M42,82 L42,58 Q42,44 56,44 L58,44" stroke={BLACK} strokeWidth={7} fill="none" /><Polygon points="58,36 70,44 58,52" fill={BLACK} /></Warn>;
    case 'kurvelinks': return <Warn flip><Path d="M42,82 L42,58 Q42,44 56,44 L58,44" stroke={BLACK} strokeWidth={7} fill="none" /><Polygon points="58,36 70,44 58,52" fill={BLACK} /></Warn>;
    case 'doppelkurve': return <Warn><Path d="M44,84 L44,70 Q44,62 52,58 Q60,54 60,46 L60,42" stroke={BLACK} strokeWidth={6} fill="none" /><Polygon points="52,42 60,30 68,42" fill={BLACK} /></Warn>;
    case 'gefaelle': return <Warn><Polygon points="22,82 78,82 22,52" fill={BLACK} /><T x={66} y={68} s={12} t="10%" /></Warn>;
    case 'steigung': return <Warn><Polygon points="22,82 78,82 78,52" fill={BLACK} /><T x={34} y={68} s={12} t="10%" /></Warn>;
    case 'uneben': return <Warn><Path d="M20,78 Q30,62 40,78 Q50,62 60,78 Q70,62 80,78" stroke={BLACK} strokeWidth={6} fill="none" /></Warn>;
    case 'schleudergefahr': return <Warn><CarSide x={50} y={52} s={0.9} /><Path d="M32,64 Q40,70 34,78 M46,66 Q54,72 46,80 M60,64 Q68,70 60,78" stroke={BLACK} strokeWidth={3} fill="none" /></Warn>;
    case 'steinschlag': return <Warn><Polygon points="24,82 24,40 44,82" fill={BLACK} /><Circle cx={56} cy={50} r={5} fill={BLACK} /><Circle cx={64} cy={64} r={4} fill={BLACK} /><Circle cx={54} cy={72} r={5} fill={BLACK} /></Warn>;
    case 'seitenwind': return <Warn><Line x1={28} y1={40} x2={28} y2={82} stroke={BLACK} strokeWidth={4} /><Path d="M28,44 L70,48 L70,60 L28,64 Z" fill={RED} stroke={BLACK} strokeWidth={2} /><Path d="M42,46 L42,62 M56,47 L56,61" stroke={WHITE} strokeWidth={4} /></Warn>;
    case 'verengt': return <Warn><Path d="M34,84 L40,62 L40,40 M66,84 L60,62 L60,40" stroke={BLACK} strokeWidth={6} fill="none" /></Warn>;
    case 'verengtrechts': return <Warn><Path d="M36,84 L36,40 M66,84 L58,62 L58,40" stroke={BLACK} strokeWidth={6} fill="none" /></Warn>;
    case 'baustelle': return <Warn><Person x={46} y={66} s={1} /><Path d="M54,58 L66,76 M60,76 L72,76" stroke={BLACK} strokeWidth={4} /><Path d="M32,80 Q44,70 54,80 Z" fill={BLACK} /></Warn>;
    case 'stau': return <Warn><CarFront x={50} y={48} s={0.55} /><CarFront x={42} y={64} s={0.65} /><CarFront x={60} y={64} s={0.65} /><CarFront x={50} y={78} s={0.75} /></Warn>;
    case 'gegenverkehr': return <Warn><G transform="translate(-12,8) scale(0.6) translate(33,0)"><Arrow d="up" color={BLACK} w={10} /></G><G transform="translate(12,8) scale(0.6) translate(33,0)"><Arrow d="down" color={BLACK} w={10} /></G></Warn>;
    case 'ampelwarn': return <Warn><G transform="translate(36,36) scale(0.28)"><Light on={['r', 'y', 'g']} /></G></Warn>;
    case 'fussgaenger': return <Warn><Person x={50} y={66} s={1.1} /></Warn>;
    case 'kinder': return <Warn><Person x={42} y={66} s={1} /><Person x={60} y={70} s={0.75} /></Warn>;
    case 'radverkehr': return <Warn><Bike x={50} y={66} s={0.85} /></Warn>;
    case 'wildwechsel': return <Warn><Deer /></Warn>;
    case 'ufer': return <Warn><CarSide x={46} y={52} s={0.8} /><Path d="M22,80 Q32,72 42,80 Q52,72 62,80 Q72,72 80,80" stroke={BLACK} strokeWidth={4} fill="none" /><Path d="M60,58 L70,58 L70,70" stroke={BLACK} strokeWidth={4} fill="none" /></Warn>;
    case 'flugbetrieb': return <Warn><Path d="M30,70 L70,52 M46,64 L40,52 M52,60 L60,76 M64,55 L68,48" stroke={BLACK} strokeWidth={5} strokeLinecap="round" /></Warn>;
    case 'bahnuebergang': return <Warn><Rect x={30} y={50} width={40} height={6} fill={BLACK} /><Rect x={34} y={56} width={4} height={24} fill={BLACK} /><Rect x={62} y={56} width={4} height={24} fill={BLACK} /><Path d="M30,44 L70,44" stroke={BLACK} strokeWidth={3} strokeDasharray="6 4" /></Warn>;
    case 'bake3':
      return (
        <G>
          <Rect x={30} y={2} width={40} height={96} fill={WHITE} stroke={GREY} strokeWidth={1} />
          {[20, 48, 76].map((y) => <Polygon key={y} points={`30,${y + 10} 70,${y - 6} 70,${y + 6} 30,${y + 22}`} fill={RED} />)}
        </G>
      );

    // ───────── Vorschriftzeichen ─────────
    case 'andreaskreuz':
      return (
        <G>
          {[35, -35].map((r) => (
            <G key={r} transform={`rotate(${r} 50 50)`}><Rect x={8} y={42} width={84} height={16} fill={WHITE} stroke={RED} strokeWidth={3} /><Rect x={22} y={44} width={14} height={12} fill={RED} /><Rect x={64} y={44} width={14} height={12} fill={RED} /></G>
          ))}
        </G>
      );
    case 'vorfahrtgewaehren': return <Polygon points="4,10 96,10 50,94" fill={WHITE} stroke={RED} strokeWidth={9} strokeLinejoin="round" />;
    case 'stop': return <G><Polygon points="31,4 69,4 96,31 96,69 69,96 31,96 4,69 4,31" fill={RED} stroke={WHITE} strokeWidth={3} /><T y={60} s={27} c={WHITE} t="STOP" /></G>;
    case 'vorranggegenverkehr':
      return <Ring><G transform="translate(-14,2) scale(0.62) translate(30,0)"><Arrow d="down" color={BLACK} w={10} /></G><G transform="translate(14,2) scale(0.62) translate(30,0)"><Arrow d="up" color={RED} w={10} /></G></Ring>;
    case 'rechts': return <BlueDisc><Path d="M38,78 L38,48 Q38,38 50,38 L62,38" stroke={WHITE} strokeWidth={10} fill="none" /><Polygon points="60,24 80,38 60,52" fill={WHITE} /></BlueDisc>;
    case 'hierrechts': return <BlueDisc><Path d="M30,50 L62,50" stroke={WHITE} strokeWidth={10} /><Polygon points="60,32 82,50 60,68" fill={WHITE} /></BlueDisc>;
    case 'geradeausrechts': return <BlueDisc><Path d="M42,84 L42,30 M42,58 Q42,48 54,48 L62,48" stroke={WHITE} strokeWidth={8} fill="none" /><Polygon points="42,14 54,32 30,32" fill={WHITE} /><Polygon points="60,36 76,48 60,60" fill={WHITE} /></BlueDisc>;
    case 'kreisverkehr':
      return (
        <BlueDisc>
          {[0, 120, 240].map((r) => (
            <G key={r} transform={`rotate(${r} 50 50)`}><Path d="M50,22 A28,28 0 0,1 74,36" stroke={WHITE} strokeWidth={7} fill="none" /><Polygon points="80,30 78,46 66,38" fill={WHITE} /></G>
          ))}
        </BlueDisc>
      );
    case 'einbahnstrasse':
      return (
        <G>
          <Rect x={2} y={28} width={96} height={44} rx={4} fill={BLUE} stroke={WHITE} strokeWidth={2} />
          <Polygon points="10,42 70,42 70,34 92,50 70,66 70,58 10,58" fill={WHITE} />
          <T x={40} y={54} s={9} t="Einbahnstraße" />
        </G>
      );
    case 'rechtsvorbei': return <BlueDisc><Path d="M34,34 L62,62" stroke={WHITE} strokeWidth={10} /><Polygon points="72,72 50,70 70,50" fill={WHITE} /></BlueDisc>;
    case 'haltestelle':
      return <G><Circle cx={50} cy={50} r={46} fill={YELLOW} stroke={'#2e8b57'} strokeWidth={8} /><T y={66} s={46} c={'#2e8b57'} t="H" /></G>;
    case 'radweg': return <BlueDisc><Bike x={50} y={50} s={1} color={WHITE} /></BlueDisc>;
    case 'gehweg': return <BlueDisc><Person x={42} y={58} s={1.1} color={WHITE} /><Person x={60} y={64} s={0.7} color={WHITE} /></BlueDisc>;
    case 'gehradweg': return <BlueDisc><Person x={50} y={40} s={0.75} color={WHITE} /><Line x1={16} y1={52} x2={84} y2={52} stroke={WHITE} strokeWidth={3} /><Bike x={50} y={68} s={0.7} color={WHITE} /></BlueDisc>;
    case 'getrenntradgehweg': return <BlueDisc><Bike x={30} y={52} s={0.55} color={WHITE} /><Line x1={50} y1={10} x2={50} y2={90} stroke={WHITE} strokeWidth={3} /><Person x={70} y={58} s={0.8} color={WHITE} /></BlueDisc>;
    case 'fussgaengerzone': return <G><Rect x={14} y={4} width={72} height={92} rx={6} fill={WHITE} stroke={BLACK} strokeWidth={2} /><Circle cx={50} cy={42} r={30} fill={BLUE} /><Person x={42} y={50} s={0.9} color={WHITE} /><Person x={58} y={54} s={0.6} color={WHITE} /><T y={88} s={11} t="ZONE" /></G>;
    case 'fahrradstrasse': return <G><Rect x={14} y={4} width={72} height={92} rx={6} fill={WHITE} stroke={BLACK} strokeWidth={2} /><Circle cx={50} cy={42} r={30} fill={BLUE} /><Bike x={50} y={42} s={0.8} color={WHITE} /><T y={88} s={8} t="Fahrradstraße" /></G>;
    case 'busspur': return <BlueSq w={70} h={92}><T y={44} s={26} c={WHITE} t="BUS" /><Rect x={28} y={56} width={44} height={22} rx={3} fill={WHITE} /></BlueSq>;
    case 'verboteallerart': return <Ring />;
    case 'verbotkraftwagen': return <Ring><CarSide x={50} y={54} s={1.3} /></Ring>;
    case 'verbotlkw': return <Ring><Truck x={50} y={56} s={1.2} /><T y={84} s={0.1} t="" /></Ring>;
    case 'verbotrad': return <Ring><Bike x={50} y={52} s={0.95} /></Ring>;
    case 'verbotfussgaenger': return <Ring><Person x={50} y={58} s={1.2} /></Ring>;
    case 'verbotkfz': return <Ring><Moto x={50} y={34} s={0.8} /><CarSide x={50} y={68} s={1} /></Ring>;
    case 'gewicht55': return <Ring><T y={62} s={30} t="5,5t" /></Ring>;
    case 'breite2': return <Ring><T y={60} s={24} t="2m" /><Path d="M16,52 L26,46 L26,58 Z M84,52 L74,46 L74,58 Z" fill={BLACK} /></Ring>;
    case 'hoehe38': return <Ring><T y={58} s={22} t="3,8m" /><Path d="M50,14 L44,24 L56,24 Z M50,86 L44,76 L56,76 Z" fill={BLACK} /></Ring>;
    case 'einfahrtverboten': return <G><Circle cx={50} cy={50} r={46} fill={RED} stroke={WHITE} strokeWidth={3} /><Rect x={18} y={42} width={64} height={16} fill={WHITE} /></G>;
    case 'schneeketten': return <BlueDisc><Circle cx={50} cy={50} r={22} fill="none" stroke={WHITE} strokeWidth={6} />{[0, 45, 90, 135].map((r) => <Line key={r} x1={50} y1={22} x2={50} y2={34} stroke={WHITE} strokeWidth={4} transform={`rotate(${r} 50 50)`} />)}{[180, 225, 270, 315].map((r) => <Line key={r} x1={50} y1={22} x2={50} y2={34} stroke={WHITE} strokeWidth={4} transform={`rotate(${r} 50 50)`} />)}</BlueDisc>;
    case 'tempo30': return <Ring><T y={64} s={40} t="30" /></Ring>;
    case 'tempo50': return <Ring><T y={64} s={40} t="50" /></Ring>;
    case 'tempo70': return <Ring><T y={64} s={40} t="70" /></Ring>;
    case 'tempo100': return <Ring><T y={62} s={32} t="100" /></Ring>;
    case 'zone30': return <G><Rect x={8} y={2} width={84} height={96} rx={6} fill={WHITE} stroke="#999" strokeWidth={1.5} /><Circle cx={50} cy={38} r={27} fill={WHITE} stroke={RED} strokeWidth={7} /><T y={47} s={26} t="30" /><T y={88} s={18} t="ZONE" /></G>;
    case 'endezone30': return <G><Rect x={8} y={2} width={84} height={96} rx={6} fill={WHITE} stroke="#999" strokeWidth={1.5} /><G opacity={0.5}><Circle cx={50} cy={38} r={27} fill={WHITE} stroke={GREY} strokeWidth={7} /><T y={47} s={26} c={GREY} t="30" /><T y={88} s={18} c={GREY} t="ZONE" /></G><Line x1={14} y1={92} x2={86} y2={8} stroke={BLACK} strokeWidth={4} /></G>;
    case 'mindestgeschwindigkeit': return <BlueDisc><T y={64} s={40} c={WHITE} t="30" /></BlueDisc>;
    case 'ueberholverbot': return <Ring><CarSide x={34} y={52} color={RED} s={0.9} /><CarSide x={66} y={52} s={0.9} /></Ring>;
    case 'ueberholverbotlkw': return <Ring><Truck x={34} y={54} color={RED} s={0.75} /><CarSide x={68} y={52} s={0.85} /></Ring>;
    case 'endetempo70': return <EndRing><T y={64} s={40} c={GREY} t="70" /></EndRing>;
    case 'endeueberholverbot': return <EndRing><CarSide x={34} y={52} color={GREY} s={0.9} /><CarSide x={66} y={52} color={GREY} s={0.9} /></EndRing>;
    case 'endeverbote': return <EndRing />;
    case 'haltverbot': return <Ring fill={BLUE}><Path d="M22,22 L78,78 M78,22 L22,78" stroke={RED} strokeWidth={10} /></Ring>;
    case 'eingeschraenkteshaltverbot': return <Ring fill={BLUE}><Path d="M22,22 L78,78" stroke={RED} strokeWidth={10} /></Ring>;
    case 'haltverbotzone': return <G><Rect x={8} y={2} width={84} height={96} rx={6} fill={WHITE} stroke="#999" strokeWidth={1.5} /><Circle cx={50} cy={38} r={27} fill={BLUE} stroke={RED} strokeWidth={6} /><Line x1={32} y1={20} x2={68} y2={56} stroke={RED} strokeWidth={6} /><T y={88} s={18} t="ZONE" /></G>;

    // ───────── Richtzeichen ─────────
    case 'vorfahrt': return <Warn><Rect x={46} y={36} width={8} height={44} fill={BLACK} /><Rect x={38} y={52} width={24} height={3} fill={BLACK} /></Warn>;
    case 'vorfahrtstrasse': return <G><Polygon points="50,3 97,50 50,97 3,50" fill={WHITE} stroke="#999" strokeWidth={1} /><Polygon points="50,16 84,50 50,84 16,50" fill={YELLOW} /></G>;
    case 'endevorfahrtstrasse': return <G><Polygon points="50,3 97,50 50,97 3,50" fill={WHITE} stroke="#999" strokeWidth={1} /><Polygon points="50,16 84,50 50,84 16,50" fill={YELLOW} />{[-12, -4, 4, 12].map((o) => <Line key={o} x1={22 + o} y1={30 - o} x2={70 + o} y2={78 - o} stroke={BLACK} strokeWidth={3} />)}</G>;
    case 'vorrangvorgegenverkehr': return <BlueSq><G transform="translate(-14,2) scale(0.62) translate(30,0)"><Arrow d="down" color={RED} w={10} /></G><G transform="translate(14,2) scale(0.62) translate(30,0)"><Arrow d="up" color={WHITE} w={10} /></G></BlueSq>;
    case 'ortstafel': return <G><Rect x={2} y={22} width={96} height={56} rx={4} fill={YELLOW} stroke={BLACK} strokeWidth={3} /><T y={55} s={14} t="Musterstadt" /></G>;
    case 'ortsende': return <G><Rect x={2} y={22} width={96} height={56} rx={4} fill={YELLOW} stroke={BLACK} strokeWidth={3} /><T y={55} s={14} t="Musterstadt" /><Line x1={6} y1={74} x2={94} y2={26} stroke={RED} strokeWidth={6} /></G>;
    case 'parken': return <BlueSq><T y={74} s={64} c={WHITE} t="P" /></BlueSq>;
    case 'parkengehweg': return <BlueSq><T x={34} y={66} s={48} c={WHITE} t="P" /><Path d="M60,74 L88,74 M60,74 L60,50 M70,62 L88,62" stroke={WHITE} strokeWidth={4} /><CarSide x={76} y={44} color={WHITE} s={0.5} /></BlueSq>;
    case 'verkehrsberuhigt': return <G><Rect x={2} y={14} width={96} height={72} rx={6} fill={BLUE} stroke={WHITE} strokeWidth={3} /><Polygon points="12,52 24,40 36,52 36,74 12,74" fill={WHITE} /><Person x={52} y={70} s={0.75} color={WHITE} /><Circle cx={64} cy={72} r={4} fill={WHITE} /><CarSide x={82} y={66} color={WHITE} s={0.6} /></G>;
    case 'endeverkehrsberuhigt': return <G><Rect x={2} y={14} width={96} height={72} rx={6} fill={BLUE} stroke={WHITE} strokeWidth={3} /><G opacity={0.6}><Polygon points="12,52 24,40 36,52 36,74 12,74" fill={WHITE} /><Person x={52} y={70} s={0.75} color={WHITE} /><CarSide x={82} y={66} color={WHITE} s={0.6} /></G><Line x1={6} y1={82} x2={94} y2={18} stroke={RED} strokeWidth={5} /></G>;
    case 'tunnel': return <BlueSq><Path d="M20,82 L20,52 Q20,26 50,26 Q80,26 80,52 L80,82" stroke={WHITE} strokeWidth={8} fill="none" /><Path d="M42,82 L46,50 M58,82 L54,50" stroke={WHITE} strokeWidth={3} /></BlueSq>;
    case 'nothaltebucht': return <BlueSq><Path d="M22,86 L22,14 M30,86 Q30,60 56,52 Q76,46 76,14" stroke={WHITE} strokeWidth={5} fill="none" /><CarSide x={62} y={70} color={WHITE} s={0.55} /></BlueSq>;
    case 'autobahn': return <BlueSq><Path d="M20,86 L42,40 M80,86 L58,40" stroke={WHITE} strokeWidth={6} /><Line x1={50} y1={86} x2={50} y2={44} stroke={WHITE} strokeWidth={4} /><Path d="M14,40 Q50,14 86,40" stroke={WHITE} strokeWidth={6} fill="none" /></BlueSq>;
    case 'endeautobahn': return <BlueSq><G opacity={0.6}><Path d="M20,86 L42,40 M80,86 L58,40" stroke={WHITE} strokeWidth={6} /><Path d="M14,40 Q50,14 86,40" stroke={WHITE} strokeWidth={6} fill="none" /></G><Line x1={10} y1={90} x2={90} y2={10} stroke={RED} strokeWidth={6} /></BlueSq>;
    case 'kraftfahrstrasse': return <BlueSq><CarSide x={50} y={56} color={WHITE} s={1.7} /></BlueSq>;
    case 'endekraftfahrstrasse': return <BlueSq><G opacity={0.6}><CarSide x={50} y={56} color={WHITE} s={1.7} /></G><Line x1={10} y1={90} x2={90} y2={10} stroke={RED} strokeWidth={6} /></BlueSq>;
    case 'ausfahrt': return <G><Rect x={2} y={24} width={96} height={52} rx={4} fill={BLUE} stroke={WHITE} strokeWidth={2} /><Path d="M60,66 L60,50 L76,34" stroke={WHITE} strokeWidth={6} fill="none" /><Polygon points="82,28 80,44 66,30" fill={WHITE} /><T x={30} y={55} s={12} c={WHITE} t="Ausfahrt" /></G>;
    case 'fussgaengerueberweg': return <BlueSq><Polygon points="50,14 88,84 12,84" fill={WHITE} />{[0, 1, 2].map((i) => <Rect key={i} x={28 + i * 16} y={76} width={9} height={6} fill={BLACK} />)}<Person x={50} y={64} s={0.95} /></BlueSq>;
    case 'sackgasse': return <BlueSq><Rect x={42} y={28} width={16} height={60} fill={WHITE} /><Rect x={28} y={14} width={44} height={14} fill={RED} /></BlueSq>;
    case 'richtgeschwindigkeit': return <BlueSq><T y={62} s={34} c={WHITE} t="130" /></BlueSq>;
    case 'enderichtgeschwindigkeit': return <BlueSq><G opacity={0.6}><T y={62} s={34} c={WHITE} t="130" /></G><Line x1={10} y1={90} x2={90} y2={10} stroke={RED} strokeWidth={6} /></BlueSq>;
    case 'laternenring': return <G><Rect x={36} y={4} width={28} height={92} fill="#bbb" /><Rect x={36} y={30} width={28} height={40} fill={WHITE} />{[30, 50].map((y) => <Rect key={y} x={36} y={y} width={28} height={10} fill={RED} />)}</G>;
    case 'bundesstrasse': return <G><Rect x={18} y={28} width={64} height={44} rx={6} fill={YELLOW} stroke={BLACK} strokeWidth={3} /><T y={60} s={26} t="170" /></G>;
    case 'autobahnnummer': return <G><Polygon points="22,22 78,22 86,40 78,78 22,78 14,40" fill={BLUE} stroke={WHITE} strokeWidth={3} /><T y={60} s={28} c={WHITE} t="4" /></G>;
    case 'umleitung': return <G><Rect x={2} y={24} width={96} height={52} rx={4} fill={YELLOW} stroke={BLACK} strokeWidth={2} /><Polygon points="12,42 66,42 66,32 88,50 66,68 66,58 12,58" fill={BLACK} /><T x={40} y={54} s={11} c={YELLOW} t="Umleitung" /></G>;
    case 'ankuendigungsbake': return <G><Rect x={22} y={2} width={56} height={96} fill={BLUE} stroke={WHITE} strokeWidth={2} />{[18, 48, 78].map((y) => <Line key={y} x1={30} y1={y + 10} x2={70} y2={y - 10} stroke={WHITE} strokeWidth={7} />)}</G>;

    // ───────── Zusatzzeichen ─────────
    case 'z_naesse': return <Plate lines={['bei Nässe']} size={17} />;
    case 'z_schnee': return <G><Rect x={3} y={24} width={94} height={52} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} /><Path d="M50,32 L50,68 M34,41 L66,59 M34,59 L66,41" stroke={BLACK} strokeWidth={4} /></G>;
    case 'z_entfernung': return <Plate lines={['200 m']} size={22} />;
    case 'z_strecke': return <G><Rect x={3} y={24} width={94} height={52} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} /><Path d="M14,50 L86,50 M14,42 L14,58 M86,42 L86,58" stroke={BLACK} strokeWidth={3} /><T y={44} s={14} t="800 m" /></G>;
    case 'z_zeit': return <Plate lines={['Mo–Fr', '7–19 h']} size={15} />;
    case 'z_anlieger': return <Plate lines={['Anlieger frei']} size={15} />;
    case 'z_radfrei': return <G><Rect x={3} y={24} width={94} height={52} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} /><Bike x={42} y={48} s={0.7} /><T x={74} y={54} s={13} t="frei" /></G>;
    case 'z_schulbus': return <Plate lines={['Schulbus', '7–8 h, 13–16 h']} size={13} />;
    case 'z_abknickend': return <G><Rect x={10} y={10} width={80} height={80} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} /><Path d="M50,82 L50,50 L22,50" stroke={BLACK} strokeWidth={8} fill="none" /><Path d="M50,50 L50,18 M50,50 L78,50" stroke={BLACK} strokeWidth={2.5} /></G>;
    case 'z_strassenbahn': return <G><Rect x={3} y={24} width={94} height={52} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} /><Rect x={26} y={34} width={48} height={24} rx={4} fill={BLACK} /><Line x1={50} y1={34} x2={50} y2={28} stroke={BLACK} strokeWidth={2} /><Line x1={20} y1={66} x2={80} y2={66} stroke={BLACK} strokeWidth={3} /></G>;
    case 'z_parkscheibe': return <G><Rect x={3} y={24} width={94} height={52} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} /><Rect x={14} y={32} width={26} height={36} rx={3} fill={BLUE} /><Circle cx={27} cy={50} r={8} fill={WHITE} /><T x={66} y={56} s={18} t="2 Std." /></G>;
    case 'z_lkw': return <G><Rect x={3} y={24} width={94} height={52} rx={4} fill={WHITE} stroke={BLACK} strokeWidth={3} /><Truck x={50} y={52} s={1} /></G>;
    case 'z_unfall': return <Plate lines={['Unfall']} size={20} />;
    case 'z_ende': return <Plate lines={['Ende']} size={22} />;
    case 'z_glatteis': return <Plate lines={['Schnee- oder', 'Eisglätte']} size={14} />;

    // ───────── Markierungen ─────────
    case 'm_durchgezogen': return <Road><Line x1={50} y1={0} x2={50} y2={100} stroke={WHITE} strokeWidth={5} /></Road>;
    case 'm_leitlinie': return <Road><Line x1={50} y1={0} x2={50} y2={100} stroke={WHITE} strokeWidth={5} strokeDasharray="18 14" /></Road>;
    case 'm_einseitig': return <Road><Line x1={46} y1={0} x2={46} y2={100} stroke={WHITE} strokeWidth={4} /><Line x1={54} y1={0} x2={54} y2={100} stroke={WHITE} strokeWidth={4} strokeDasharray="18 14" /></Road>;
    case 'm_doppelt': return <Road><Line x1={45} y1={0} x2={45} y2={100} stroke={WHITE} strokeWidth={4} /><Line x1={55} y1={0} x2={55} y2={100} stroke={WHITE} strokeWidth={4} /></Road>;
    case 'm_haltlinie': return <Road><Rect x={50} y={0} width={50} height={100} fill="#6b6e75" /><Rect x={52} y={46} width={46} height={7} fill={WHITE} /><Line x1={50} y1={0} x2={50} y2={100} stroke={WHITE} strokeWidth={3} /></Road>;
    case 'm_wartelinie': return <Road><Line x1={4} y1={50} x2={96} y2={50} stroke={WHITE} strokeWidth={6} strokeDasharray="10 8" /></Road>;
    case 'm_haifisch': return <Road>{[8, 28, 48, 68, 88].map((x) => <Polygon key={x} points={`${x - 8},42 ${x + 8},42 ${x},60`} fill={WHITE} />)}</Road>;
    case 'm_sperrflaeche': return <Road><Polygon points="50,6 70,94 30,94" fill="none" stroke={WHITE} strokeWidth={3} />{[30, 46, 62, 78].map((y) => <Line key={y} x1={50 - (y - 6) * 0.22} y1={y} x2={50 + (y - 6) * 0.22} y2={y - 12} stroke={WHITE} strokeWidth={3} />)}</Road>;
    case 'm_zickzack': return <Road><Path d="M10,60 L22,44 L34,60 L46,44 L58,60 L70,44 L82,60 L94,44" stroke={WHITE} strokeWidth={4} fill="none" /><Rect x={0} y={74} width={100} height={26} fill="#8a8d94" /></Road>;
    case 'm_pfeil': return <Road><Path d="M30,88 L30,40 M70,88 L70,58 Q70,44 56,44" stroke={WHITE} strokeWidth={7} fill="none" /><Polygon points="30,18 42,40 18,40" fill={WHITE} /><Polygon points="44,44 58,32 58,56" fill={WHITE} /></Road>;
    case 'm_zebra': return <Road>{[0, 1, 2, 3, 4, 5].map((i) => <Rect key={i} x={6 + i * 16} y={30} width={9} height={40} fill={WHITE} />)}</Road>;
    case 'm_gelb': return <Road><Line x1={50} y1={0} x2={50} y2={100} stroke={WHITE} strokeWidth={4} opacity={0.4} /><Line x1={40} y1={0} x2={40} y2={100} stroke={YELLOW} strokeWidth={5} strokeDasharray="16 10" /></Road>;

    // ───────── Ampel & Polizei ─────────
    case 'a_rot': return <Light on={['r']} />;
    case 'a_rotgelb': return <Light on={['r', 'y']} />;
    case 'a_gruen': return <Light on={['g']} />;
    case 'a_gelb': return <Light on={['y']} />;
    case 'a_gelbblink': return <G><Light on={['y']} /><Path d="M74,40 L86,34 M74,50 L88,50 M74,60 L86,66" stroke="#FFC107" strokeWidth={3} /></G>;
    case 'a_gruenpfeil': return <G><Light on={['r']} /><Rect x={70} y={60} width={28} height={30} rx={3} fill={WHITE} stroke={BLACK} strokeWidth={1.5} /><Path d="M76,75 L90,75" stroke="#2E9E5B" strokeWidth={5} /><Polygon points="88,68 96,75 88,82" fill="#2E9E5B" /></G>;
    case 'a_pfeilampel': return <G><Rect x={34} y={8} width={32} height={84} rx={8} fill="#222" /><Circle cx={50} cy={24} r={10} fill="#4a1d1d" /><Circle cx={50} cy={50} r={10} fill="#4a3b12" /><Circle cx={50} cy={76} r={10} fill="#163d22" /><Path d="M54,76 L44,76" stroke="#2ED158" strokeWidth={4} /><Polygon points="42,70 36,76 42,82" fill="#2ED158" /></G>;
    case 'p_seite': return <Officer arms="side" />;
    case 'p_hoch': return <Officer arms="up" />;
    case 'p_front': return <Officer arms="front" />;

    // ───────── Kontrollleuchten ─────────
    case 'k_oel': return <Dash color="#FF3B30"><Path d="M20,62 L60,62 L76,46 L84,50 M28,62 L28,48 L56,48 L60,62" /><Path d="M84,58 Q84,66 80,66 Q76,66 76,58 Q80,52 84,58" fill="#FF3B30" stroke="none" /></Dash>;
    case 'k_bremse': return <Dash color="#FF3B30"><Circle cx={50} cy={50} r={20} /><Path d="M24,30 Q14,50 24,70 M76,30 Q86,50 76,70" /><Path d="M50,38 L50,52" /><Circle cx={50} cy={60} r={1.5} fill="#FF3B30" /></Dash>;
    case 'k_batterie': return <Dash color="#FF3B30"><Rect x={20} y={34} width={60} height={36} rx={3} /><Path d="M30,34 L30,28 M70,34 L70,28 M30,52 L40,52 M64,46 L64,58 M58,52 L70,52" /></Dash>;
    case 'k_kuehl': return <Dash color="#FF3B30"><Path d="M50,20 L50,62 M50,30 L60,30 M50,40 L60,40 M50,50 L60,50" /><Circle cx={50} cy={68} r={7} /><Path d="M24,80 Q32,74 40,80 Q48,86 56,80 Q64,74 72,80" /></Dash>;
    case 'k_airbag': return <Dash color="#FF3B30"><Circle cx={36} cy={28} r={6} /><Path d="M36,36 L36,56 L50,62 M36,46 L48,44" /><Circle cx={66} cy={48} r={14} fill="#FF3B30" stroke="none" /></Dash>;
    case 'k_gurt': return <Dash color="#FF3B30"><Circle cx={50} cy={24} r={7} /><Path d="M38,40 L62,40 L62,76 L38,76 Z M40,38 L60,72" /></Dash>;
    case 'k_abs': return <Dash color="#FFC107"><Circle cx={50} cy={50} r={22} /><Path d="M22,30 Q12,50 22,70 M78,30 Q88,50 78,70" /><SvgText x={50} y={57} fontSize={18} fontWeight="bold" fill="#FFC107" stroke="none" textAnchor="middle" fontFamily="Arial">ABS</SvgText></Dash>;
    case 'k_motor': return <Dash color="#FFC107"><Path d="M18,44 L26,44 L26,36 L52,36 L58,44 L74,44 L74,38 L82,38 L82,68 L74,68 L74,62 L62,72 L34,72 L26,62 L18,62 Z" /><Path d="M38,28 L54,28 M46,28 L46,36" /></Dash>;
    case 'k_reifen': return <Dash color="#FFC107"><Path d="M24,32 Q18,52 26,70 L74,70 Q82,52 76,32" /><Path d="M50,38 L50,54" /><Circle cx={50} cy={62} r={1.5} fill="#FFC107" /></Dash>;
    case 'k_tank': return <Dash color="#FFC107"><Rect x={26} y={24} width={30} height={52} rx={3} /><Rect x={32} y={30} width={18} height={12} /><Path d="M56,40 L66,40 L72,48 L72,68 L66,68" /></Dash>;
    case 'k_esp': return <Dash color="#FFC107"><CarSide x={50} y={40} color="#FFC107" s={1.4} /><Path d="M28,62 Q36,56 34,70 M48,62 Q56,56 54,70 M66,62 Q74,56 72,70" /></Dash>;
    case 'k_fernlicht': return <Dash color="#3D7BFF"><Path d="M48,30 Q30,30 30,50 Q30,70 48,70 Z" fill="#3D7BFF" stroke="none" /><Path d="M56,34 L80,34 M56,44 L80,44 M56,54 L80,54 M56,64 L80,64" /></Dash>;
    case 'k_abblendlicht': return <Dash color="#2ED158"><Path d="M48,30 Q30,30 30,50 Q30,70 48,70 Z" fill="#2ED158" stroke="none" /><Path d="M56,36 L78,44 M56,46 L78,54 M56,56 L78,64 M56,66 L78,74" /></Dash>;
    case 'k_nebelschluss': return <Dash color="#FFC107"><Path d="M52,30 Q70,30 70,50 Q70,70 52,70 Z" fill="#FFC107" stroke="none" /><Path d="M20,36 L44,36 M20,46 L44,46 M20,56 L44,56 M20,66 L44,66 M32,28 Q38,50 32,72" /></Dash>;
    case 'k_vorgluehen': return <Dash color="#FFC107"><Path d="M30,70 Q22,70 22,54 Q22,40 34,40 M70,70 Q78,70 78,54 Q78,40 66,40 M34,40 Q34,30 50,30 Q66,30 66,40 M40,52 Q46,46 50,52 Q54,58 60,52" /></Dash>;
    default: return <Warn />;
  }
}

export { SYMBOLS };
export type { SymbolInfo };
export const SIGNS = SYMBOLS;
export const SIGN_BY_ID: Record<string, SymbolInfo> = Object.fromEntries(SYMBOLS.map((s) => [s.id, s]));

export function Sign({ id, size = 110 }: { id: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Pict id={id} />
    </Svg>
  );
}
