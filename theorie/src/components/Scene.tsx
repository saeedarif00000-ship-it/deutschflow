import Svg, { Circle, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

/**
 * Top-down junction drawings for right-of-way questions.
 * "S" (bottom) is always your own car, driving north (up the screen).
 */
export type Arm = 'S' | 'N' | 'E' | 'W';
export type Turn = 'straight' | 'left' | 'right';
export interface SceneCar {
  arm: Arm;
  color: 'blue' | 'red' | 'green' | 'yellow' | 'white';
  turn: Turn;
  label?: string;
  kind?: 'car' | 'bike' | 'tram' | 'truck';
}
export interface SceneSpec {
  layout: 'cross' | 'tee';
  cars: SceneCar[];
  signs?: Partial<Record<Arm, 'vorfahrtstrasse' | 'vorfahrtgewaehren' | 'stop'>>;
  zebra?: Arm;
  pedestrian?: Arm;
  priorityBend?: boolean;
}

const COLORS = { blue: '#2F6FE0', red: '#D33A3A', green: '#2E9E5B', yellow: '#E8B21A', white: '#F2F2F2' };
const ROT: Record<Arm, number> = { S: 0, N: 180, W: 90, E: 270 };

// path the vehicle will take, in the S-arm reference frame (vehicle at bottom heading up)
const TURN_PATH: Record<Turn, string> = {
  straight: 'M110,150 L110,50',
  right: 'M110,150 Q110,118 150,112',
  left: 'M110,150 Q110,95 60,90',
};

function Vehicle({ car }: { car: SceneCar }) {
  const fill = COLORS[car.color];
  return (
    <G transform={`rotate(${ROT[car.arm]} 100 100)`}>
      <Path d={TURN_PATH[car.turn]} stroke={fill} strokeWidth={3} strokeDasharray="5 4" fill="none" opacity={0.9} />
      {car.kind === 'bike' ? (
        <G>
          <Rect x={107} y={150} width={6} height={18} rx={3} fill={fill} />
          <Circle cx={110} cy={150} r={3} fill="#222" />
          <Circle cx={110} cy={168} r={3} fill="#222" />
        </G>
      ) : car.kind === 'tram' ? (
        <Rect x={101} y={150} width={18} height={46} rx={4} fill={fill} stroke="#333" strokeWidth={1} />
      ) : car.kind === 'truck' ? (
        <G>
          <Rect x={101} y={150} width={18} height={34} rx={2} fill={fill} stroke="#333" strokeWidth={1} />
          <Rect x={102} y={150} width={16} height={8} fill="#222" opacity={0.4} />
        </G>
      ) : (
        <G>
          <Rect x={102} y={152} width={16} height={26} rx={4} fill={fill} stroke="#333" strokeWidth={1} />
          <Rect x={104} y={156} width={12} height={6} rx={1.5} fill="#bcd7ff" opacity={0.9} />
        </G>
      )}
      {/* indicator */}
      {car.turn !== 'straight' ? <Circle cx={car.turn === 'right' ? 118 : 102} cy={153} r={2.6} fill="#FFB020" /> : null}
    </G>
  );
}

function MiniSign({ arm, kind }: { arm: Arm; kind: 'vorfahrtstrasse' | 'vorfahrtgewaehren' | 'stop' }) {
  return (
    <G transform={`rotate(${ROT[arm]} 100 100)`}>
      <G transform="translate(134,136)">
        {kind === 'vorfahrtstrasse' ? (
          <G><Polygon points="0,-10 10,0 0,10 -10,0" fill="#fff" stroke="#888" /><Polygon points="0,-6 6,0 0,6 -6,0" fill="#F6C445" /></G>
        ) : kind === 'vorfahrtgewaehren' ? (
          <Polygon points="-10,-8 10,-8 0,10" fill="#fff" stroke="#C1121F" strokeWidth={3} />
        ) : (
          <Polygon points="-4,-10 4,-10 10,-4 10,4 4,10 -4,10 -10,4 -10,-4" fill="#C1121F" />
        )}
      </G>
    </G>
  );
}

export function Scene({ spec, size = 300 }: { spec: SceneSpec; size?: number }) {
  const tee = spec.layout === 'tee';
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Rect x={0} y={0} width={200} height={200} fill="#9BC48A" />
      {/* roads */}
      <Rect x={70} y={tee ? 70 : 0} width={60} height={tee ? 130 : 200} fill="#5E6168" />
      <Rect x={0} y={70} width={200} height={60} fill="#5E6168" />
      {/* centre lines */}
      <Line x1={100} y1={tee ? 130 : 0} x2={100} y2={70} stroke="#fff" strokeWidth={1.5} strokeDasharray="8 7" opacity={tee ? 0 : 0.8} />
      <Line x1={100} y1={130} x2={100} y2={200} stroke="#fff" strokeWidth={1.5} strokeDasharray="8 7" opacity={0.8} />
      <Line x1={0} y1={100} x2={70} y2={100} stroke="#fff" strokeWidth={1.5} strokeDasharray="8 7" opacity={0.8} />
      <Line x1={130} y1={100} x2={200} y2={100} stroke="#fff" strokeWidth={1.5} strokeDasharray="8 7" opacity={0.8} />
      {/* zebra */}
      {spec.zebra ? (
        <G transform={`rotate(${ROT[spec.zebra]} 100 100)`}>
          {[0, 1, 2, 3, 4, 5].map((i) => <Rect key={i} x={73 + i * 9.5} y={136} width={6} height={12} fill="#fff" />)}
        </G>
      ) : null}
      {spec.pedestrian ? (
        <G transform={`rotate(${ROT[spec.pedestrian]} 100 100)`}>
          <Circle cx={66} cy={142} r={4} fill="#7A3FD1" />
          <Path d="M66,146 L66,156" stroke="#7A3FD1" strokeWidth={3} />
        </G>
      ) : null}
      {spec.signs ? (Object.entries(spec.signs) as [Arm, any][]).map(([arm, kind]) => <MiniSign key={arm} arm={arm} kind={kind} />) : null}
      {spec.cars.map((c, i) => <Vehicle key={i} car={c} />)}
      {/* labels */}
      {spec.cars.map((c, i) => {
        const pos: Record<Arm, [number, number]> = { S: [128, 186], N: [72, 20], E: [186, 74], W: [14, 130] };
        const [x, y] = pos[c.arm];
        return c.label ? (
          <SvgText key={`l${i}`} x={x} y={y} fontSize={11} fontWeight="bold" fill="#fff" stroke="#000" strokeWidth={0.4} textAnchor="middle" fontFamily="Arial">
            {c.label}
          </SvgText>
        ) : null;
      })}
      <SvgText x={196} y={196} fontSize={7} fill="#2b2b2b" textAnchor="end" fontFamily="Arial">↑ N</SvgText>
    </Svg>
  );
}
