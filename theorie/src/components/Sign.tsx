import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

/**
 * Hand-drawn SVG illustrations of German traffic signs (StVO).
 * Pictograms are simplified; colours, shapes and layout follow the official signs.
 */
const RED = '#C1121F';
const BLUE = '#1F4FA3';
const YELLOW = '#F6C445';
const BLACK = '#1A1A1A';

const Warn = ({ children }: { children?: React.ReactNode }) => (
  <G>
    <Polygon points="50,6 96,90 4,90" fill="#fff" stroke={RED} strokeWidth={9} strokeLinejoin="round" />
    {children}
  </G>
);
const Ring = ({ fill = '#fff', children }: { fill?: string; children?: React.ReactNode }) => (
  <G>
    <Circle cx={50} cy={50} r={44} fill={fill} stroke={RED} strokeWidth={10} />
    {children}
  </G>
);
const BlueDisc = ({ children }: { children?: React.ReactNode }) => (
  <G>
    <Circle cx={50} cy={50} r={46} fill={BLUE} stroke="#fff" strokeWidth={3} />
    {children}
  </G>
);
const BlueSquare = ({ children }: { children?: React.ReactNode }) => (
  <G>
    <Rect x={5} y={5} width={90} height={90} rx={8} fill={BLUE} stroke="#fff" strokeWidth={3} />
    {children}
  </G>
);
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
const CarSide = ({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) => (
  <G transform={`translate(${x},${y}) scale(${s})`}>
    <Path d="M-16,4 L-16,-2 L-10,-4 L-6,-11 L7,-11 L12,-4 L16,-2 L16,4 Z" fill={color} />
    <Circle cx={-9} cy={5} r={3.5} fill={color} />
    <Circle cx={9} cy={5} r={3.5} fill={color} />
  </G>
);
const Num = ({ n, color = BLACK, size = 40, y = 64 }: { n: string; color?: string; size?: number; y?: number }) => (
  <SvgText x={50} y={y} fontSize={size} fontWeight="bold" fill={color} textAnchor="middle" fontFamily="Arial">
    {n}
  </SvgText>
);

export interface SignInfo {
  id: string;
  nr: string;
  de: string;
  en: string;
  group: 'Gefahr' | 'Vorschrift' | 'Richtung';
  meaning: string;
}

export const SIGNS: SignInfo[] = [
  { id: 'gefahr', nr: '101', de: 'Gefahrstelle', en: 'Danger point', group: 'Gefahr', meaning: 'General danger ahead — read the additional plate if there is one.' },
  { id: 'rechtsvorlinks', nr: '102', de: 'Kreuzung oder Einmündung mit Vorfahrt von rechts', en: 'Junction with priority from the right', group: 'Gefahr', meaning: 'At the next junction "right before left" applies.' },
  { id: 'kinder', nr: '136', de: 'Kinder', en: 'Children', group: 'Gefahr', meaning: 'Children may run onto the road (school, playground). Slow down, be ready to brake.' },
  { id: 'fussgaenger', nr: '133', de: 'Fußgänger', en: 'Pedestrians', group: 'Gefahr', meaning: 'Pedestrians may cross or walk on the road.' },
  { id: 'radverkehr', nr: '138', de: 'Radverkehr', en: 'Cyclists', group: 'Gefahr', meaning: 'Cyclists cross or join the road.' },
  { id: 'baustelle', nr: '123', de: 'Arbeitsstelle', en: 'Roadworks', group: 'Gefahr', meaning: 'Roadworks ahead — workers, narrowing, dirt on the road.' },
  { id: 'bahnuebergang', nr: '151', de: 'Bahnübergang', en: 'Level crossing', group: 'Gefahr', meaning: 'Level crossing ahead (often with barriers).' },
  { id: 'andreaskreuz', nr: '201', de: 'Andreaskreuz', en: 'St Andrew\'s cross', group: 'Vorschrift', meaning: 'Trains have priority. Stop when a train approaches or signals show red.' },
  { id: 'vorfahrtgewaehren', nr: '205', de: 'Vorfahrt gewähren', en: 'Give way', group: 'Vorschrift', meaning: 'Give priority to traffic on the crossing road.' },
  { id: 'stop', nr: '206', de: 'Halt. Vorfahrt gewähren.', en: 'Stop and give way', group: 'Vorschrift', meaning: 'Stop completely at the stop line, then give priority.' },
  { id: 'vorfahrt', nr: '301', de: 'Vorfahrt', en: 'Priority at next junction', group: 'Vorschrift', meaning: 'You have priority at the next junction only.' },
  { id: 'vorfahrtstrasse', nr: '306', de: 'Vorfahrtstraße', en: 'Priority road', group: 'Vorschrift', meaning: 'You have priority at all junctions until the sign "Ende der Vorfahrtstraße".' },
  { id: 'endevorfahrtstrasse', nr: '307', de: 'Ende der Vorfahrtstraße', en: 'End of priority road', group: 'Vorschrift', meaning: 'From here, normal priority rules (often right before left) apply again.' },
  { id: 'kreisverkehr', nr: '215', de: 'Kreisverkehr', en: 'Roundabout', group: 'Vorschrift', meaning: 'Drive counter-clockwise; traffic in the roundabout has priority when combined with "Vorfahrt gewähren".' },
  { id: 'rechts', nr: '209', de: 'Vorgeschriebene Fahrtrichtung rechts', en: 'Turn right only', group: 'Vorschrift', meaning: 'You must turn right.' },
  { id: 'verboteallerart', nr: '250', de: 'Verbot für Fahrzeuge aller Art', en: 'No vehicles', group: 'Vorschrift', meaning: 'No vehicles of any kind (bicycles may be pushed).' },
  { id: 'einfahrtverboten', nr: '267', de: 'Verbot der Einfahrt', en: 'No entry', group: 'Vorschrift', meaning: 'You must not drive in from this side (typically the wrong end of a one-way street).' },
  { id: 'tempo30', nr: '274', de: 'Zulässige Höchstgeschwindigkeit 30', en: 'Speed limit 30', group: 'Vorschrift', meaning: 'Maximum 30 km/h.' },
  { id: 'tempo70', nr: '274', de: 'Zulässige Höchstgeschwindigkeit 70', en: 'Speed limit 70', group: 'Vorschrift', meaning: 'Maximum 70 km/h.' },
  { id: 'zone30', nr: '274.1', de: 'Beginn einer Tempo-30-Zone', en: '30 zone', group: 'Vorschrift', meaning: 'Max 30 km/h in the whole zone; usually "right before left" at junctions.' },
  { id: 'ueberholverbot', nr: '276', de: 'Überholverbot für Kraftfahrzeuge aller Art', en: 'No overtaking', group: 'Vorschrift', meaning: 'Motor vehicles must not overtake multi-track motor vehicles.' },
  { id: 'endeverbote', nr: '282', de: 'Ende sämtlicher Streckenverbote', en: 'End of all restrictions', group: 'Vorschrift', meaning: 'Speed limits and overtaking bans indicated earlier end here.' },
  { id: 'mindestgeschwindigkeit', nr: '275', de: 'Vorgeschriebene Mindestgeschwindigkeit', en: 'Minimum speed', group: 'Vorschrift', meaning: 'You must drive at least the speed shown (unless conditions require slower).' },
  { id: 'haltverbot', nr: '283', de: 'Absolutes Haltverbot', en: 'No stopping', group: 'Vorschrift', meaning: 'No stopping at all on the road.' },
  { id: 'eingeschraenkteshaltverbot', nr: '286', de: 'Eingeschränktes Haltverbot', en: 'Restricted stopping', group: 'Vorschrift', meaning: 'Stopping max. 3 minutes, only to load/unload or let people in/out.' },
  { id: 'radweg', nr: '237', de: 'Radweg', en: 'Cycle path', group: 'Vorschrift', meaning: 'Cycle path — compulsory for cyclists, forbidden for cars.' },
  { id: 'gehweg', nr: '239', de: 'Gehweg', en: 'Footpath', group: 'Vorschrift', meaning: 'For pedestrians only.' },
  { id: 'gehradweg', nr: '240', de: 'Gemeinsamer Geh- und Radweg', en: 'Shared foot and cycle path', group: 'Vorschrift', meaning: 'Shared by pedestrians and cyclists; cyclists must take care of pedestrians.' },
  { id: 'parken', nr: '314', de: 'Parken', en: 'Parking', group: 'Richtung', meaning: 'Parking area / parking permitted.' },
  { id: 'fussgaengerueberweg', nr: '350', de: 'Fußgängerüberweg', en: 'Zebra crossing', group: 'Richtung', meaning: 'Zebra crossing — let pedestrians cross; no overtaking.' },
  { id: 'autobahn', nr: '330.1', de: 'Autobahn', en: 'Motorway', group: 'Richtung', meaning: 'Start of motorway — only vehicles faster than 60 km/h by design.' },
  { id: 'richtgeschwindigkeit', nr: '380', de: 'Richtgeschwindigkeit', en: 'Recommended speed', group: 'Richtung', meaning: 'Recommended (not mandatory) maximum speed, 130 km/h on motorways.' },
  { id: 'verkehrsberuhigt', nr: '325.1', de: 'Verkehrsberuhigter Bereich', en: 'Traffic-calmed area', group: 'Richtung', meaning: 'Walking pace; children may play everywhere; park only in marked spaces.' },
  { id: 'ortstafel', nr: '310', de: 'Ortstafel (Anfang)', en: 'Town sign (start)', group: 'Richtung', meaning: 'Built-up area begins: 50 km/h unless signed otherwise.' },
  { id: 'ortsende', nr: '311', de: 'Ortstafel (Ende)', en: 'Town sign (end)', group: 'Richtung', meaning: 'Built-up area ends: 100 km/h for cars outside towns unless signed otherwise.' },
];

export const SIGN_BY_ID = Object.fromEntries(SIGNS.map((s) => [s.id, s]));

function Pict({ id }: { id: string }) {
  switch (id) {
    case 'gefahr':
      return <Warn><Rect x={45} y={36} width={10} height={30} rx={3} fill={BLACK} /><Circle cx={50} cy={76} r={5.5} fill={BLACK} /></Warn>;
    case 'rechtsvorlinks':
      return <Warn><Path d="M36,44 L64,78 M64,44 L36,78" stroke={BLACK} strokeWidth={8} strokeLinecap="round" /></Warn>;
    case 'kinder':
      return <Warn><Person x={42} y={66} s={1} /><Person x={60} y={70} s={0.75} /></Warn>;
    case 'fussgaenger':
      return <Warn><Person x={50} y={66} s={1.1} /></Warn>;
    case 'radverkehr':
      return <Warn><Bike x={50} y={66} s={0.85} /></Warn>;
    case 'baustelle':
      return <Warn><Person x={46} y={66} s={1} /><Path d="M54,58 L66,76 M60,76 L72,76" stroke={BLACK} strokeWidth={4} /><Path d="M32,80 Q44,70 54,80 Z" fill={BLACK} /></Warn>;
    case 'bahnuebergang':
      return <Warn><Rect x={30} y={50} width={40} height={6} fill={BLACK} /><Rect x={34} y={56} width={4} height={24} fill={BLACK} /><Rect x={62} y={56} width={4} height={24} fill={BLACK} /><Path d="M30,44 L70,44" stroke={BLACK} strokeWidth={3} strokeDasharray="6 4" /></Warn>;
    case 'andreaskreuz':
      return (
        <G>
          <G transform="rotate(35 50 50)"><Rect x={8} y={42} width={84} height={16} fill="#fff" stroke={RED} strokeWidth={3} /><Rect x={22} y={44} width={14} height={12} fill={RED} /><Rect x={64} y={44} width={14} height={12} fill={RED} /></G>
          <G transform="rotate(-35 50 50)"><Rect x={8} y={42} width={84} height={16} fill="#fff" stroke={RED} strokeWidth={3} /><Rect x={22} y={44} width={14} height={12} fill={RED} /><Rect x={64} y={44} width={14} height={12} fill={RED} /></G>
        </G>
      );
    case 'vorfahrtgewaehren':
      return <Polygon points="4,10 96,10 50,94" fill="#fff" stroke={RED} strokeWidth={9} strokeLinejoin="round" />;
    case 'stop':
      return (
        <G>
          <Polygon points="31,4 69,4 96,31 96,69 69,96 31,96 4,69 4,31" fill={RED} stroke="#fff" strokeWidth={3} />
          <SvgText x={50} y={60} fontSize={27} fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="Arial">STOP</SvgText>
        </G>
      );
    case 'vorfahrt':
      return <Warn><Rect x={46} y={36} width={8} height={44} fill={BLACK} /><Rect x={38} y={52} width={24} height={3} fill={BLACK} /></Warn>;
    case 'vorfahrtstrasse':
      return <G><Polygon points="50,3 97,50 50,97 3,50" fill="#fff" stroke="#999" strokeWidth={1} /><Polygon points="50,16 84,50 50,84 16,50" fill={YELLOW} /></G>;
    case 'endevorfahrtstrasse':
      return (
        <G>
          <Polygon points="50,3 97,50 50,97 3,50" fill="#fff" stroke="#999" strokeWidth={1} />
          <Polygon points="50,16 84,50 50,84 16,50" fill={YELLOW} />
          {[-12, -4, 4, 12].map((o) => <Line key={o} x1={22 + o} y1={30 - o} x2={70 + o} y2={78 - o} stroke={BLACK} strokeWidth={3} />)}
        </G>
      );
    case 'kreisverkehr':
      return (
        <BlueDisc>
          {[0, 120, 240].map((r) => (
            <G key={r} transform={`rotate(${r} 50 50)`}>
              <Path d="M50,22 A28,28 0 0,1 74,36" stroke="#fff" strokeWidth={7} fill="none" />
              <Polygon points="80,30 78,46 66,38" fill="#fff" />
            </G>
          ))}
        </BlueDisc>
      );
    case 'rechts':
      return <BlueDisc><Path d="M38,78 L38,48 Q38,38 50,38 L62,38" stroke="#fff" strokeWidth={10} fill="none" /><Polygon points="60,24 80,38 60,52" fill="#fff" /></BlueDisc>;
    case 'verboteallerart':
      return <Ring />;
    case 'einfahrtverboten':
      return <G><Circle cx={50} cy={50} r={46} fill={RED} stroke="#fff" strokeWidth={3} /><Rect x={18} y={42} width={64} height={16} fill="#fff" /></G>;
    case 'tempo30':
      return <Ring><Num n="30" /></Ring>;
    case 'tempo70':
      return <Ring><Num n="70" /></Ring>;
    case 'zone30':
      return (
        <G>
          <Rect x={8} y={2} width={84} height={96} rx={6} fill="#fff" stroke="#999" strokeWidth={1.5} />
          <Circle cx={50} cy={38} r={27} fill="#fff" stroke={RED} strokeWidth={7} />
          <Num n="30" size={26} y={47} />
          <SvgText x={50} y={88} fontSize={18} fontWeight="bold" fill={BLACK} textAnchor="middle" fontFamily="Arial">ZONE</SvgText>
        </G>
      );
    case 'ueberholverbot':
      return <Ring><CarSide x={34} y={52} color={RED} s={0.9} /><CarSide x={66} y={52} color={BLACK} s={0.9} /></Ring>;
    case 'endeverbote':
      return (
        <G>
          <Circle cx={50} cy={50} r={45} fill="#fff" stroke="#777" strokeWidth={2} />
          {[-12, -6, 0, 6, 12].map((o) => <Line key={o} x1={24 + o} y1={24 - o} x2={76 + o} y2={76 - o} stroke="#555" strokeWidth={2.5} />)}
        </G>
      );
    case 'mindestgeschwindigkeit':
      return <BlueDisc><Num n="30" color="#fff" /></BlueDisc>;
    case 'haltverbot':
      return <Ring fill={BLUE}><Path d="M22,22 L78,78 M78,22 L22,78" stroke={RED} strokeWidth={10} /></Ring>;
    case 'eingeschraenkteshaltverbot':
      return <Ring fill={BLUE}><Path d="M22,22 L78,78" stroke={RED} strokeWidth={10} /></Ring>;
    case 'radweg':
      return <BlueDisc><Bike x={50} y={50} s={1} color="#fff" /></BlueDisc>;
    case 'gehweg':
      return <BlueDisc><Person x={42} y={58} s={1.1} color="#fff" /><Person x={60} y={64} s={0.7} color="#fff" /></BlueDisc>;
    case 'gehradweg':
      return <BlueDisc><Person x={50} y={40} s={0.75} color="#fff" /><Line x1={16} y1={52} x2={84} y2={52} stroke="#fff" strokeWidth={3} /><Bike x={50} y={68} s={0.7} color="#fff" /></BlueDisc>;
    case 'parken':
      return <BlueSquare><SvgText x={50} y={74} fontSize={64} fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="Arial">P</SvgText></BlueSquare>;
    case 'fussgaengerueberweg':
      return (
        <BlueSquare>
          <Polygon points="50,14 88,84 12,84" fill="#fff" />
          {[0, 1, 2].map((i) => <Rect key={i} x={28 + i * 16} y={76} width={9} height={6} fill={BLACK} />)}
          <Person x={50} y={64} s={0.95} />
        </BlueSquare>
      );
    case 'autobahn':
      return (
        <BlueSquare>
          <Path d="M20,86 L42,40 M80,86 L58,40" stroke="#fff" strokeWidth={6} />
          <Line x1={50} y1={86} x2={50} y2={44} stroke="#fff" strokeWidth={4} />
          <Path d="M14,40 Q50,14 86,40" stroke="#fff" strokeWidth={6} fill="none" />
        </BlueSquare>
      );
    case 'richtgeschwindigkeit':
      return <BlueSquare><Num n="130" color="#fff" size={34} y={62} /></BlueSquare>;
    case 'verkehrsberuhigt':
      return (
        <G>
          <Rect x={2} y={14} width={96} height={72} rx={6} fill={BLUE} stroke="#fff" strokeWidth={3} />
          <Polygon points="12,52 24,40 36,52 36,74 12,74" fill="#fff" />
          <Person x={52} y={70} s={0.75} color="#fff" />
          <Circle cx={64} cy={72} r={4} fill="#fff" />
          <CarSide x={82} y={66} color="#fff" s={0.6} />
        </G>
      );
    case 'ortstafel':
      return (
        <G>
          <Rect x={2} y={22} width={96} height={56} rx={4} fill={YELLOW} stroke={BLACK} strokeWidth={3} />
          <SvgText x={50} y={56} fontSize={18} fontWeight="bold" fill={BLACK} textAnchor="middle" fontFamily="Arial">Musterstadt</SvgText>
        </G>
      );
    case 'ortsende':
      return (
        <G>
          <Rect x={2} y={22} width={96} height={56} rx={4} fill={YELLOW} stroke={BLACK} strokeWidth={3} />
          <SvgText x={50} y={56} fontSize={18} fontWeight="bold" fill={BLACK} textAnchor="middle" fontFamily="Arial">Musterstadt</SvgText>
          <Line x1={6} y1={74} x2={94} y2={26} stroke={RED} strokeWidth={6} />
        </G>
      );
    default:
      return <Warn />;
  }
}

export function Sign({ id, size = 110 }: { id: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Pict id={id} />
    </Svg>
  );
}
