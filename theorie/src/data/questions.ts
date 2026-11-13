import type { SceneSpec } from '@/components/Scene';
import { SYMBOLS } from '@/data/symbols';

/**
 * Original practice questions written for this app, covering the topics of the
 * official German Class B theory exam (Grundstoff + Zusatzstoff B).
 * They are NOT the official TÜV | DEKRA catalogue questions (those are licensed).
 * Format follows the real exam: one or more answers may be correct; 2–5 error points.
 */
export type Topic =
  | 'vorfahrt' | 'zeichen' | 'geschwindigkeit' | 'abstand' | 'ueberholen' | 'halten'
  | 'verhalten' | 'autobahn' | 'alkohol' | 'licht' | 'gefahren' | 'unfall' | 'umwelt' | 'technik' | 'recht';

export const TOPICS: { id: Topic; de: string; en: string; icon: string }[] = [
  { id: 'vorfahrt', de: 'Vorfahrt', en: 'Right of way', icon: 'git-merge' },
  { id: 'zeichen', de: 'Verkehrszeichen', en: 'Traffic signs', icon: 'warning' },
  { id: 'geschwindigkeit', de: 'Geschwindigkeit', en: 'Speed', icon: 'speedometer' },
  { id: 'abstand', de: 'Abstand & Anhalteweg', en: 'Distance & stopping', icon: 'resize' },
  { id: 'ueberholen', de: 'Überholen', en: 'Overtaking', icon: 'swap-horizontal' },
  { id: 'halten', de: 'Halten & Parken', en: 'Stopping & parking', icon: 'car' },
  { id: 'verhalten', de: 'Fußgänger, Rad & Bus', en: 'Pedestrians, cyclists & buses', icon: 'walk' },
  { id: 'autobahn', de: 'Autobahn', en: 'Motorway', icon: 'trail-sign' },
  { id: 'alkohol', de: 'Alkohol & Drogen', en: 'Alcohol & drugs', icon: 'wine' },
  { id: 'licht', de: 'Licht & Sicht', en: 'Lights & visibility', icon: 'bulb' },
  { id: 'gefahren', de: 'Gefahrenlehre', en: 'Hazard awareness', icon: 'eye' },
  { id: 'unfall', de: 'Unfall & Notfall', en: 'Accidents & emergencies', icon: 'medkit' },
  { id: 'umwelt', de: 'Umwelt', en: 'Environment', icon: 'leaf' },
  { id: 'technik', de: 'Technik & Ladung (B)', en: 'Vehicle & load (B)', icon: 'construct' },
  { id: 'recht', de: 'Führerschein & Recht', en: 'Licence & law', icon: 'document-text' },
];

export interface Option { de: string; en: string; ok: boolean }
export interface Question {
  id: string;
  cat: 'G' | 'B'; // Grundstoff / Zusatzstoff Klasse B
  topic: Topic;
  pts: 2 | 3 | 4 | 5;
  de: string;
  en: string;
  opts?: Option[];
  num?: { answer: number; unit: string }; // number-entry question
  sign?: string;
  scene?: SceneSpec;
  exp: string; // explanation (English)
}

const o = (de: string, en: string, ok = false): Option => ({ de, en, ok });

const BASE_QUESTIONS: Question[] = [
  // ─────────── Vorfahrt (scenes) ───────────
  {
    id: 'v1', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Es gibt keine Verkehrszeichen. Wer darf zuerst fahren?', en: 'There are no traffic signs. Who may go first?',
    scene: { layout: 'cross', cars: [{ arm: 'S', color: 'blue', turn: 'straight', label: 'Ich' }, { arm: 'E', color: 'red', turn: 'straight', label: 'Rot' }] },
    opts: [o('Der rote Pkw', 'The red car', true), o('Ich', 'Me'), o('Wer zuerst an der Kreuzung ist', 'Whoever reaches the junction first')],
    exp: 'Without signs, "right before left" applies. The red car comes from your right, so it goes first.',
  },
  {
    id: 'v2', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Es gibt keine Verkehrszeichen. Wie verhalten Sie sich?', en: 'There are no traffic signs. How do you behave?',
    scene: { layout: 'cross', cars: [{ arm: 'S', color: 'blue', turn: 'straight', label: 'Ich' }, { arm: 'W', color: 'green', turn: 'straight', label: 'Grün' }] },
    opts: [o('Ich darf vor dem grünen Pkw fahren', 'I may go before the green car', true), o('Ich muss den grünen Pkw vorlassen', 'I must let the green car go first'), o('Der grüne Pkw muss warten', 'The green car must wait', true)],
    exp: 'The green car comes from your left. With "right before left" it must give way to you.',
  },
  {
    id: 'v3', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Sie wollen links abbiegen. Wie verhalten Sie sich?', en: 'You want to turn left. What do you do?',
    scene: { layout: 'cross', cars: [{ arm: 'S', color: 'blue', turn: 'left', label: 'Ich' }, { arm: 'N', color: 'yellow', turn: 'straight', label: 'Gelb' }] },
    opts: [o('Ich lasse den gelben Pkw zuerst fahren', 'I let the yellow car go first', true), o('Ich fahre zuerst, weil ich schon blinke', 'I go first because I\'m already indicating'), o('Ich fahre bis zur Mitte der Kreuzung vor und warte dort', 'I move up to the middle of the junction and wait there', true)],
    exp: 'Left-turners must give way to oncoming traffic going straight or turning right. You may pull forward into the junction to wait.',
  },
  {
    id: 'v4', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'In welcher Reihenfolge fahren die Fahrzeuge? (keine Verkehrszeichen)', en: 'In which order do the vehicles go? (no traffic signs)',
    scene: { layout: 'cross', cars: [{ arm: 'S', color: 'blue', turn: 'straight', label: 'Ich' }, { arm: 'E', color: 'red', turn: 'straight', label: 'Rot' }, { arm: 'N', color: 'green', turn: 'straight', label: 'Grün' }] },
    opts: [o('Grün – Rot – Ich', 'Green – Red – Me', true), o('Rot – Grün – Ich', 'Red – Green – Me'), o('Ich – Rot – Grün', 'Me – Red – Green')],
    exp: 'Green has nobody on its right (west arm is empty) → goes first. Red must wait for green (green is on red\'s right). You wait for red.',
  },
  {
    id: 'v5', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Sie fahren auf der Vorfahrtstraße geradeaus. Wer darf zuerst fahren?', en: 'You are going straight on the priority road. Who goes first?',
    scene: { layout: 'cross', signs: { S: 'vorfahrtstrasse', N: 'vorfahrtstrasse', E: 'vorfahrtgewaehren', W: 'vorfahrtgewaehren' }, cars: [{ arm: 'S', color: 'blue', turn: 'straight', label: 'Ich' }, { arm: 'E', color: 'red', turn: 'straight', label: 'Rot' }] },
    opts: [o('Ich', 'Me', true), o('Der rote Pkw', 'The red car'), o('Der rote Pkw, weil er von rechts kommt', 'The red car, because it comes from the right')],
    exp: 'Signs beat "right before left". The red car has "Vorfahrt gewähren" and must wait.',
  },
  {
    id: 'v6', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'An Ihrer Einmündung steht „Vorfahrt gewähren“. Wen müssen Sie durchfahren lassen?', en: 'Your road has "give way". Whom must you let pass?',
    scene: { layout: 'cross', signs: { S: 'vorfahrtgewaehren', N: 'vorfahrtgewaehren', E: 'vorfahrtstrasse', W: 'vorfahrtstrasse' }, cars: [{ arm: 'S', color: 'blue', turn: 'straight', label: 'Ich' }, { arm: 'W', color: 'green', turn: 'straight', label: 'Grün' }, { arm: 'E', color: 'red', turn: 'straight', label: 'Rot' }] },
    opts: [o('Den grünen Pkw', 'The green car', true), o('Den roten Pkw', 'The red car', true), o('Niemanden', 'Nobody')],
    exp: 'Both cars are on the priority road. You must let both pass before crossing.',
  },
  {
    id: 'v7', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Vor Ihnen steht ein Stoppschild. Was müssen Sie tun?', en: 'There is a stop sign in front of you. What must you do?',
    scene: { layout: 'tee', signs: { S: 'stop' }, cars: [{ arm: 'S', color: 'blue', turn: 'right', label: 'Ich' }] },
    opts: [o('An der Haltlinie anhalten, auch wenn die Straße frei ist', 'Stop at the stop line even if the road is clear', true), o('Nur anhalten, wenn ein Fahrzeug kommt', 'Only stop if a vehicle is coming'), o('Den Verkehr auf der Querstraße durchfahren lassen', 'Let traffic on the crossing road pass', true)],
    exp: 'Sign 206 requires a full stop at the line (or where you can see) — always — and then giving way.',
  },
  {
    id: 'v8', cat: 'G', topic: 'vorfahrt', pts: 4,
    de: 'Ein Radfahrer kommt von rechts. Es gibt keine Verkehrszeichen. Wer hat Vorfahrt?', en: 'A cyclist comes from the right. No signs. Who has priority?',
    scene: { layout: 'cross', cars: [{ arm: 'S', color: 'blue', turn: 'straight', label: 'Ich' }, { arm: 'E', color: 'yellow', turn: 'straight', label: 'Rad', kind: 'bike' }] },
    opts: [o('Der Radfahrer', 'The cyclist', true), o('Ich, weil ich ein Auto fahre', 'Me, because I\'m driving a car'), o('Wer schneller ist', 'Whoever is faster')],
    exp: '"Right before left" applies to cyclists too.',
  },
  {
    id: 'v9', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Sie biegen rechts ab. Ein Fußgänger überquert die Straße, in die Sie einbiegen. Was tun Sie?', en: 'You are turning right. A pedestrian is crossing the road you\'re turning into. What do you do?',
    scene: { layout: 'cross', pedestrian: 'E', cars: [{ arm: 'S', color: 'blue', turn: 'right', label: 'Ich' }] },
    opts: [o('Ich warte, bis der Fußgänger die Straße überquert hat', 'I wait until the pedestrian has crossed', true), o('Ich hupe und fahre weiter', 'I sound the horn and continue'), o('Ich fahre langsam am Fußgänger vorbei', 'I drive slowly past the pedestrian')],
    exp: 'When turning, you must give priority to pedestrians crossing the road you are entering (§ 9 StVO).',
  },
  {
    id: 'v10', cat: 'G', topic: 'vorfahrt', pts: 4,
    de: 'Wer muss am Fußgängerüberweg warten?', en: 'Who must wait at the zebra crossing?',
    scene: { layout: 'cross', zebra: 'N', pedestrian: 'N', cars: [{ arm: 'S', color: 'blue', turn: 'straight', label: 'Ich' }] },
    opts: [o('Ich muss den Fußgänger über die Straße gehen lassen', 'I must let the pedestrian cross', true), o('Der Fußgänger muss warten', 'The pedestrian must wait'), o('Ich darf nur mit mäßiger Geschwindigkeit heranfahren, wenn jemand die Straße überqueren will', 'I may only approach at moderate speed if someone wants to cross', true)],
    exp: 'At a zebra crossing pedestrians who want to cross have priority. Approach at moderate speed and stop if needed (§ 26 StVO).',
  },
  {
    id: 'v11', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Sie fahren auf der Vorfahrtstraße und wollen links abbiegen. Ihnen kommt ein Pkw entgegen, der geradeaus fährt. Wer fährt zuerst?', en: 'You are on the priority road and want to turn left. An oncoming car goes straight. Who goes first?',
    scene: { layout: 'cross', signs: { S: 'vorfahrtstrasse', N: 'vorfahrtstrasse', E: 'vorfahrtgewaehren', W: 'vorfahrtgewaehren' }, cars: [{ arm: 'S', color: 'blue', turn: 'left', label: 'Ich' }, { arm: 'N', color: 'red', turn: 'straight', label: 'Rot' }] },
    opts: [o('Der rote Pkw', 'The red car', true), o('Ich', 'Me'), o('Wer zuerst blinkt', 'Whoever indicates first')],
    exp: 'Both are on the priority road, so the turning rule applies: left-turners yield to oncoming traffic.',
  },
  {
    id: 'v12', cat: 'G', topic: 'vorfahrt', pts: 4,
    de: 'Was gilt im Kreisverkehr mit den Zeichen „Kreisverkehr“ und „Vorfahrt gewähren“?', en: 'What applies at a roundabout with the signs "roundabout" and "give way"?',
    sign: 'kreisverkehr',
    opts: [o('Fahrzeuge im Kreis haben Vorfahrt', 'Vehicles in the roundabout have priority', true), o('Beim Einfahren muss ich blinken', 'I must indicate when entering'), o('Beim Ausfahren muss ich blinken', 'I must indicate when leaving', true)],
    exp: 'Traffic already in the roundabout has priority. Don\'t indicate when entering, but do indicate when exiting.',
  },
  {
    id: 'v13', cat: 'G', topic: 'vorfahrt', pts: 4,
    de: 'Die Ampel zeigt Grün. Ein Polizist gibt Ihnen ein Haltzeichen. Was gilt?', en: 'The traffic light is green. A police officer signals you to stop. What applies?',
    opts: [o('Die Anweisung des Polizisten', 'The police officer\'s instruction', true), o('Die grüne Ampel', 'The green light'), o('Die Verkehrszeichen', 'The traffic signs')],
    exp: 'Order of precedence: police instructions → traffic lights → signs → general rules.',
  },
  {
    id: 'v14', cat: 'G', topic: 'vorfahrt', pts: 4,
    de: 'Was bedeutet ein grüner Pfeil (Blechschild) neben der roten Ampel?', en: 'What does a green arrow plate next to a red light mean?',
    opts: [o('Ich darf nach dem Anhalten rechts abbiegen, wenn niemand behindert wird', 'After stopping I may turn right if nobody is obstructed', true), o('Ich darf ohne Anhalten rechts abbiegen', 'I may turn right without stopping'), o('Ich habe beim Abbiegen Vorfahrt', 'I have priority when turning')],
    exp: 'The green-arrow sign requires a full stop first; you must not obstruct pedestrians, cyclists or crossing traffic.',
  },
  {
    id: 'v15', cat: 'G', topic: 'vorfahrt', pts: 5,
    de: 'Ein Einsatzfahrzeug mit Blaulicht und Martinshorn nähert sich. Was müssen Sie tun?', en: 'An emergency vehicle with blue lights and siren approaches. What must you do?',
    opts: [o('Sofort freie Bahn schaffen', 'Make way immediately', true), o('Notfalls auch bei Rot vorsichtig in die Kreuzung einfahren, wenn es gefahrlos möglich ist', 'If necessary, carefully move into the junction even at red, if safe', true), o('Weiterfahren, weil ich Grün habe', 'Keep driving because I have green')],
    exp: 'Blue light + siren: all road users must make way immediately.',
  },
  {
    id: 'v16', cat: 'G', topic: 'vorfahrt', pts: 3,
    de: 'Was bedeutet das gelbe Licht einer Ampel, wenn Sie noch weit entfernt sind?', en: 'What does an amber light mean if you are still far away?',
    opts: [o('Vor der Kreuzung auf das nächste Zeichen warten', 'Wait before the junction for the next signal', true), o('Beschleunigen, um noch durchzufahren', 'Accelerate to get through'), o('Es kommt gleich Grün', 'Green is coming soon')],
    exp: 'Amber means: wait for the next signal — stop if you can do so safely.',
  },

  // ─────────── Verkehrszeichen ───────────
  { id: 'z1', cat: 'G', topic: 'zeichen', pts: 4, sign: 'vorfahrt', de: 'Was bedeutet dieses Verkehrszeichen?', en: 'What does this sign mean?',
    opts: [o('Vorfahrt an der nächsten Kreuzung oder Einmündung', 'Priority at the next junction', true), o('Vorfahrtstraße für die nächsten Kilometer', 'Priority road for the next kilometres'), o('Achtung, Gefahrstelle', 'Caution, danger point')], exp: 'Sign 301 gives priority only at the very next junction.' },
  { id: 'z2', cat: 'G', topic: 'zeichen', pts: 4, sign: 'vorfahrtstrasse', de: 'Was bedeutet dieses Verkehrszeichen?', en: 'What does this sign mean?',
    opts: [o('Vorfahrtstraße', 'Priority road', true), o('Vorfahrt nur an der nächsten Kreuzung', 'Priority only at the next junction'), o('Halteverbot', 'No stopping')], exp: 'Sign 306: priority at all junctions until the end sign. Parking outside towns is not allowed on the carriageway of a priority road.' },
  { id: 'z3', cat: 'G', topic: 'zeichen', pts: 4, sign: 'rechtsvorlinks', de: 'Was kündigt dieses Zeichen an?', en: 'What does this sign announce?',
    opts: [o('Kreuzung mit Vorfahrt von rechts', 'Junction with priority from the right', true), o('Bahnübergang', 'Level crossing'), o('Ende der Vorfahrtstraße', 'End of priority road')], exp: 'Sign 102: at the next junction "right before left" applies.' },
  { id: 'z4', cat: 'G', topic: 'zeichen', pts: 4, sign: 'einfahrtverboten', de: 'Was bedeutet dieses Zeichen?', en: 'What does this sign mean?',
    opts: [o('Verbot der Einfahrt', 'No entry', true), o('Halteverbot', 'No stopping'), o('Einbahnstraße – Einfahrt erlaubt', 'One-way street – entry allowed')], exp: 'Sign 267: you must not drive in. Typically the exit end of a one-way street.' },
  { id: 'z5', cat: 'G', topic: 'zeichen', pts: 4, sign: 'verboteallerart', de: 'Wer darf hier fahren?', en: 'Who may drive here?',
    opts: [o('Keine Fahrzeuge', 'No vehicles', true), o('Nur Pkw', 'Only cars'), o('Fahrräder dürfen geschoben werden', 'Bicycles may be pushed', true)], exp: 'Sign 250 bans all vehicles. Pushing a bike makes you a pedestrian.' },
  { id: 'z6', cat: 'G', topic: 'zeichen', pts: 4, sign: 'ueberholverbot', de: 'Was ist verboten?', en: 'What is prohibited?',
    opts: [o('Mehrspurige Kraftfahrzeuge zu überholen', 'Overtaking multi-track motor vehicles', true), o('Einspurige Fahrzeuge wie Radfahrer zu überholen', 'Overtaking single-track vehicles such as cyclists'), o('Schneller als 50 km/h zu fahren', 'Driving faster than 50 km/h')], exp: 'Sign 276: no overtaking of motor vehicles with more than two wheels; cyclists and motorbikes may be overtaken.' },
  { id: 'z7', cat: 'G', topic: 'zeichen', pts: 3, sign: 'endeverbote', de: 'Was bedeutet dieses Zeichen?', en: 'What does this sign mean?',
    opts: [o('Ende sämtlicher Streckenverbote', 'End of all restrictions', true), o('Ende der Autobahn', 'End of motorway'), o('Beginn einer Tempo-30-Zone', 'Start of a 30 zone')], exp: 'Sign 282 ends earlier speed limits and overtaking bans.' },
  { id: 'z8', cat: 'G', topic: 'zeichen', pts: 4, sign: 'haltverbot', de: 'Was gilt bei diesem Zeichen?', en: 'What applies with this sign?',
    opts: [o('Halten auf der Fahrbahn ist verboten', 'Stopping on the carriageway is prohibited', true), o('Bis zu 3 Minuten halten ist erlaubt', 'Stopping up to 3 minutes is allowed'), o('Parken ist erlaubt', 'Parking is allowed')], exp: 'Sign 283: absolute no-stopping zone.' },
  { id: 'z9', cat: 'G', topic: 'zeichen', pts: 4, sign: 'eingeschraenkteshaltverbot', de: 'Wie lange dürfen Sie hier höchstens halten?', en: 'How long may you stop here at most?',
    num: { answer: 3, unit: 'Minuten / minutes' }, exp: 'Sign 286: stopping only up to 3 minutes, or for loading/unloading and letting passengers in/out.' },
  { id: 'z10', cat: 'G', topic: 'zeichen', pts: 4, sign: 'verkehrsberuhigt', de: 'Was gilt in diesem Bereich?', en: 'What applies in this area?',
    opts: [o('Schrittgeschwindigkeit', 'Walking pace', true), o('Kinder dürfen überall spielen', 'Children may play everywhere', true), o('Parken ist überall erlaubt', 'Parking is allowed everywhere')], exp: 'Sign 325.1: walking pace, pedestrians may use the whole road, park only in marked spaces.' },
  { id: 'z11', cat: 'G', topic: 'zeichen', pts: 3, sign: 'zone30', de: 'Was gilt in diesem Bereich in der Regel?', en: 'What usually applies in this area?',
    opts: [o('Höchstens 30 km/h', 'Max. 30 km/h', true), o('An Kreuzungen meist „rechts vor links“', 'At junctions usually "right before left"', true), o('Mindestens 30 km/h', 'At least 30 km/h')], exp: 'In 30 zones the speed limit applies throughout; junctions are usually right before left.' },
  { id: 'z12', cat: 'G', topic: 'zeichen', pts: 3, sign: 'richtgeschwindigkeit', de: 'Was bedeutet dieses Zeichen?', en: 'What does this sign mean?',
    opts: [o('Empfohlene Höchstgeschwindigkeit', 'Recommended maximum speed', true), o('Vorgeschriebene Höchstgeschwindigkeit', 'Mandatory maximum speed'), o('Mindestgeschwindigkeit', 'Minimum speed')], exp: 'Sign 380: recommendation only — but if you crash at a higher speed you may share the blame.' },
  { id: 'z13', cat: 'G', topic: 'zeichen', pts: 3, sign: 'mindestgeschwindigkeit', de: 'Was schreibt dieses Zeichen vor?', en: 'What does this sign require?',
    opts: [o('Mindestens 30 km/h, wenn die Verhältnisse es zulassen', 'At least 30 km/h if conditions permit', true), o('Höchstens 30 km/h', 'At most 30 km/h'), o('Empfohlene Geschwindigkeit 30 km/h', 'Recommended speed 30 km/h')], exp: 'Sign 275 (blue disc) is a minimum speed.' },
  { id: 'z14', cat: 'G', topic: 'zeichen', pts: 4, sign: 'andreaskreuz', de: 'Was bedeutet das Andreaskreuz?', en: 'What does the St Andrew\'s cross mean?',
    opts: [o('Schienenfahrzeuge haben Vorrang', 'Rail vehicles have priority', true), o('Kreuzung mit Vorfahrt von rechts', 'Junction with priority from the right'), o('Fußgängerüberweg', 'Zebra crossing')], exp: 'Sign 201: trains always have priority. Stop if a train approaches or lights/barriers signal.' },
  { id: 'z15', cat: 'G', topic: 'zeichen', pts: 3, sign: 'kinder', de: 'Womit müssen Sie rechnen?', en: 'What must you expect?',
    opts: [o('Kinder können plötzlich auf die Straße laufen', 'Children may suddenly run onto the road', true), o('Ein Spielplatz ist in der Nähe', 'A playground is nearby'), o('Ich muss immer anhalten', 'I must always stop')], exp: 'Sign 136 warns of children. Slow down and be ready to brake.' },
  { id: 'z16', cat: 'G', topic: 'zeichen', pts: 3, sign: 'radweg', de: 'Wer darf diesen Weg benutzen?', en: 'Who may use this path?',
    opts: [o('Radfahrer', 'Cyclists', true), o('Pkw zum Parken', 'Cars for parking'), o('Fußgänger', 'Pedestrians')], exp: 'Sign 237: cycle path only.' },
  { id: 'z17', cat: 'G', topic: 'zeichen', pts: 3, sign: 'ortstafel', de: 'Welche Höchstgeschwindigkeit gilt nach diesem Schild für Pkw, wenn nichts anderes angegeben ist?', en: 'What speed limit applies for cars after this sign unless otherwise signed?',
    num: { answer: 50, unit: 'km/h' }, exp: 'The town sign starts the built-up area: 50 km/h.' },
  { id: 'z18', cat: 'G', topic: 'zeichen', pts: 3, sign: 'ortsende', de: 'Welche Höchstgeschwindigkeit gilt nach diesem Schild für Pkw auf der Landstraße, wenn nichts anderes angegeben ist?', en: 'What speed limit applies for cars on a country road after this sign unless otherwise signed?',
    num: { answer: 100, unit: 'km/h' }, exp: 'Outside built-up areas the limit for cars is 100 km/h.' },
  { id: 'z19', cat: 'G', topic: 'zeichen', pts: 4, sign: 'stop', de: 'Was müssen Sie an diesem Zeichen tun?', en: 'What must you do at this sign?',
    opts: [o('Anhalten', 'Stop', true), o('Vorfahrt gewähren', 'Give way', true), o('Nur bremsen, wenn Verkehr kommt', 'Only brake if traffic is coming')], exp: 'Sign 206: always stop, then give way.' },
  { id: 'z20', cat: 'G', topic: 'zeichen', pts: 3, sign: 'endevorfahrtstrasse', de: 'Was bedeutet dieses Zeichen?', en: 'What does this sign mean?',
    opts: [o('Ende der Vorfahrtstraße', 'End of the priority road', true), o('Ab hier gilt wieder die allgemeine Vorfahrtregel, wenn nichts anderes angezeigt ist', 'From here the general rule applies unless otherwise signed', true), o('Beginn der Vorfahrtstraße', 'Start of the priority road')], exp: 'Sign 307 cancels the priority road.' },
  { id: 'z21', cat: 'G', topic: 'zeichen', pts: 3, sign: 'gehradweg', de: 'Was gilt auf diesem Weg?', en: 'What applies on this path?',
    opts: [o('Fußgänger und Radfahrer benutzen ihn gemeinsam', 'Pedestrians and cyclists share it', true), o('Radfahrer müssen Rücksicht auf Fußgänger nehmen', 'Cyclists must be considerate of pedestrians', true), o('Mofas dürfen immer fahren', 'Mopeds may always ride')], exp: 'Sign 240: shared path; pedestrians must not be endangered.' },
  { id: 'z22', cat: 'G', topic: 'zeichen', pts: 4, sign: 'vorfahrtgewaehren', de: 'Was bedeutet dieses Zeichen?', en: 'What does this sign mean?',
    opts: [o('Vorfahrt gewähren', 'Give way', true), o('Vorfahrt an der nächsten Kreuzung', 'Priority at the next junction'), o('Einbahnstraße', 'One-way street')], exp: 'Sign 205: you must let traffic on the crossing road go first.' },
  { id: 'z23', cat: 'G', topic: 'zeichen', pts: 3, sign: 'baustelle', de: 'Womit müssen Sie rechnen?', en: 'What must you expect?',
    opts: [o('Mit Arbeitern auf der Fahrbahn', 'Workers on the road', true), o('Mit Verschmutzung und Fahrbahnverengung', 'Dirt and lane narrowing', true), o('Mit einem Bahnübergang', 'A level crossing')], exp: 'Sign 123: roadworks.' },
  { id: 'z24', cat: 'G', topic: 'zeichen', pts: 3, sign: 'fussgaengerueberweg', de: 'Was ist am Fußgängerüberweg verboten?', en: 'What is prohibited at a zebra crossing?',
    opts: [o('Überholen', 'Overtaking', true), o('Fußgänger behindern', 'Obstructing pedestrians', true), o('Mit Schrittgeschwindigkeit fahren', 'Driving at walking pace')], exp: 'No overtaking at zebra crossings; pedestrians who want to cross have priority.' },
  { id: 'z25', cat: 'G', topic: 'zeichen', pts: 3, sign: 'rechts', de: 'Was schreibt dieses Zeichen vor?', en: 'What does this sign require?',
    opts: [o('Ich muss rechts abbiegen', 'I must turn right', true), o('Ich darf rechts abbiegen oder geradeaus fahren', 'I may turn right or go straight'), o('Rechts ist ein Parkplatz', 'There is a car park on the right')], exp: 'Sign 209: compulsory direction.' },

  // ─────────── Geschwindigkeit ───────────
  { id: 'g1', cat: 'G', topic: 'geschwindigkeit', pts: 3, de: 'Wie schnell dürfen Sie mit einem Pkw innerorts höchstens fahren, wenn keine Zeichen etwas anderes anordnen?', en: 'What is the max speed for a car in built-up areas unless signed otherwise?',
    num: { answer: 50, unit: 'km/h' }, exp: '50 km/h inside built-up areas.' },
  { id: 'g2', cat: 'G', topic: 'geschwindigkeit', pts: 3, de: 'Wie schnell dürfen Sie mit einem Pkw außerorts (Landstraße) höchstens fahren?', en: 'Max speed for a car outside built-up areas (country road)?',
    num: { answer: 100, unit: 'km/h' }, exp: '100 km/h for cars outside built-up areas.' },
  { id: 'g3', cat: 'G', topic: 'geschwindigkeit', pts: 4, de: 'Bei Nebel beträgt die Sichtweite weniger als 50 m. Wie schnell dürfen Sie höchstens fahren?', en: 'Fog: visibility below 50 m. What is your maximum speed?',
    num: { answer: 50, unit: 'km/h' }, exp: 'Visibility under 50 m due to fog, snow or rain: max. 50 km/h, even on the motorway.' },
  { id: 'g4', cat: 'G', topic: 'geschwindigkeit', pts: 4, de: 'Wonach richten Sie Ihre Geschwindigkeit?', en: 'What do you base your speed on?',
    opts: [o('Nach Straßen-, Verkehrs-, Sicht- und Wetterverhältnissen', 'Road, traffic, visibility and weather conditions', true), o('Nach meinen Fähigkeiten und den Eigenschaften des Fahrzeugs', 'My abilities and the vehicle\'s characteristics', true), o('Nur nach dem Verkehrszeichen', 'Only the speed sign')], exp: '§ 3 StVO: speed must suit all conditions — the limit is a maximum, not a target.' },
  { id: 'g5', cat: 'G', topic: 'geschwindigkeit', pts: 4, de: 'Wie schnell dürfen Sie fahren, wenn Sie Schneeketten aufgezogen haben?', en: 'Maximum speed with snow chains fitted?',
    num: { answer: 50, unit: 'km/h' }, exp: 'With snow chains: max. 50 km/h.' },
  { id: 'g6', cat: 'G', topic: 'geschwindigkeit', pts: 4, de: 'Sie müssen so fahren, dass Sie innerhalb welcher Strecke anhalten können?', en: 'You must drive so that you can stop within what distance?',
    opts: [o('Innerhalb der überschaubaren Strecke', 'Within the distance you can see to be clear', true), o('Innerhalb von 100 m', 'Within 100 m'), o('Innerhalb der halben Sichtweite auf schmalen Straßen, wenn Gegenverkehr möglich ist', 'Within half the visible distance on narrow roads where oncoming traffic is possible', true)], exp: 'Golden rule: stop within the distance you can see. On narrow roads with oncoming traffic: half of it.' },
  { id: 'g7', cat: 'G', topic: 'geschwindigkeit', pts: 3, de: 'Was bedeutet „Schrittgeschwindigkeit“ ungefähr?', en: 'What does "walking pace" roughly mean?',
    opts: [o('Etwa 4–7 km/h', 'About 4–7 km/h', true), o('Etwa 20 km/h', 'About 20 km/h'), o('Etwa 30 km/h', 'About 30 km/h')], exp: 'Walking pace is a few km/h — in practice up to about 7 km/h.' },

  // ─────────── Abstand & Anhalteweg ───────────
  { id: 'a1', cat: 'G', topic: 'abstand', pts: 3, de: 'Wie lang ist der Reaktionsweg bei 50 km/h nach der Faustformel (v/10 × 3)?', en: 'How long is the reaction distance at 50 km/h by the rule of thumb (v/10 × 3)?',
    num: { answer: 15, unit: 'm' }, exp: '50/10 = 5; 5 × 3 = 15 m.' },
  { id: 'a2', cat: 'G', topic: 'abstand', pts: 3, de: 'Wie lang ist der Bremsweg bei 50 km/h bei normaler Bremsung nach der Faustformel (v/10)²?', en: 'How long is the braking distance at 50 km/h (normal braking, (v/10)²)?',
    num: { answer: 25, unit: 'm' }, exp: '(50/10)² = 25 m.' },
  { id: 'a3', cat: 'G', topic: 'abstand', pts: 4, de: 'Wie lang ist der Anhalteweg bei 50 km/h (normale Bremsung) nach den Faustformeln?', en: 'How long is the stopping distance at 50 km/h (normal braking) by the rules of thumb?',
    num: { answer: 40, unit: 'm' }, exp: 'Stopping distance = reaction (15 m) + braking (25 m) = 40 m.' },
  { id: 'a4', cat: 'G', topic: 'abstand', pts: 4, de: 'Wie verändert sich der Bremsweg, wenn Sie die Geschwindigkeit verdoppeln?', en: 'How does the braking distance change if you double your speed?',
    opts: [o('Er vervierfacht sich', 'It quadruples', true), o('Er verdoppelt sich', 'It doubles'), o('Er bleibt gleich', 'It stays the same')], exp: 'Braking distance grows with the square of speed: 2× speed → 4× distance.' },
  { id: 'a5', cat: 'G', topic: 'abstand', pts: 4, de: 'Wie groß sollte der Sicherheitsabstand außerorts mindestens sein? (Faustregel)', en: 'Minimum safety distance outside towns? (rule of thumb)',
    opts: [o('„Halber Tacho“ in Metern', '"Half the speedometer" in metres', true), o('Etwa zwei Sekunden Abstand', 'About two seconds', true), o('Eine Fahrzeuglänge', 'One car length')], exp: 'At 100 km/h keep at least 50 m (about 2 seconds).' },
  { id: 'a6', cat: 'G', topic: 'abstand', pts: 4, de: 'Welche Faktoren verlängern den Reaktionsweg?', en: 'Which factors lengthen the reaction distance?',
    opts: [o('Müdigkeit', 'Tiredness', true), o('Alkohol und Medikamente', 'Alcohol and medication', true), o('Ablenkung, z. B. durch das Handy', 'Distraction, e.g. by the phone', true)], exp: 'Anything that slows your reaction lengthens the distance travelled before braking.' },
  { id: 'a7', cat: 'G', topic: 'abstand', pts: 4, de: 'Wie lang ist der Bremsweg bei einer Gefahrbremsung aus 100 km/h nach der Faustformel ((v/10)² ÷ 2)?', en: 'Braking distance in an emergency stop from 100 km/h ((v/10)² ÷ 2)?',
    num: { answer: 50, unit: 'm' }, exp: '(100/10)² = 100; ÷ 2 = 50 m.' },
  { id: 'a8', cat: 'G', topic: 'abstand', pts: 3, de: 'Wodurch wird der Bremsweg länger?', en: 'What makes the braking distance longer?',
    opts: [o('Nasse oder vereiste Fahrbahn', 'Wet or icy road', true), o('Abgefahrene Reifen', 'Worn tyres', true), o('Höhere Geschwindigkeit', 'Higher speed', true)], exp: 'Grip and speed decide the braking distance.' },

  // ─────────── Überholen ───────────
  { id: 'u1', cat: 'G', topic: 'ueberholen', pts: 5, de: 'Wann dürfen Sie nicht überholen?', en: 'When must you not overtake?',
    opts: [o('Bei unklarer Verkehrslage', 'When the traffic situation is unclear', true), o('Wenn Gegenverkehr behindert werden könnte', 'If oncoming traffic could be obstructed', true), o('Wenn ich schneller fahre als das vorausfahrende Fahrzeug', 'If I am faster than the vehicle in front')], exp: 'Overtaking is forbidden when unclear, with oncoming traffic, before zebra crossings and where signs prohibit it.' },
  { id: 'u2', cat: 'G', topic: 'ueberholen', pts: 4, de: 'Welchen Seitenabstand müssen Sie innerorts beim Überholen von Radfahrern mindestens einhalten?', en: 'Minimum lateral distance when overtaking cyclists in town?',
    num: { answer: 1.5, unit: 'm' }, exp: 'Since 2020: at least 1.5 m inside, 2 m outside built-up areas.' },
  { id: 'u3', cat: 'G', topic: 'ueberholen', pts: 4, de: 'Welchen Seitenabstand müssen Sie außerorts beim Überholen von Radfahrern mindestens einhalten?', en: 'Minimum lateral distance when overtaking cyclists outside town?',
    num: { answer: 2, unit: 'm' }, exp: 'Outside built-up areas: at least 2 m.' },
  { id: 'u4', cat: 'G', topic: 'ueberholen', pts: 4, de: 'Auf welcher Seite wird grundsätzlich überholt?', en: 'On which side do you normally overtake?',
    opts: [o('Links', 'Left', true), o('Rechts', 'Right'), o('Schienenfahrzeuge in der Regel rechts', 'Trams normally on the right', true)], exp: 'Overtake on the left; trams on the right (unless the rails are too far right).' },
  { id: 'u5', cat: 'G', topic: 'ueberholen', pts: 4, de: 'Sie werden überholt. Wie verhalten Sie sich?', en: 'You are being overtaken. How do you behave?',
    opts: [o('Ich darf meine Geschwindigkeit nicht erhöhen', 'I must not speed up', true), o('Ich halte mich möglichst weit rechts', 'I keep as far right as possible', true), o('Ich beschleunige, damit es schneller geht', 'I accelerate so it goes faster')], exp: 'The vehicle being overtaken must not accelerate.' },
  { id: 'u6', cat: 'G', topic: 'ueberholen', pts: 5, de: 'Ein Linienbus mit eingeschaltetem Warnblinklicht nähert sich einer Haltestelle. Was gilt?', en: 'A bus with hazard lights on is approaching a stop. What applies?',
    opts: [o('Ich darf den Bus nicht überholen', 'I must not overtake the bus', true), o('Ich darf ihn mit 50 km/h überholen', 'I may overtake it at 50 km/h'), o('Ich muss damit rechnen, dass Fahrgäste die Straße überqueren', 'I must expect passengers to cross the road', true)], exp: '§ 20 StVO: no overtaking a bus approaching a stop with hazard lights; at the stop pass only at walking pace.' },

  // ─────────── Halten & Parken ───────────
  { id: 'h1', cat: 'G', topic: 'halten', pts: 3, de: 'Wie weit vor und hinter Kreuzungen und Einmündungen ist das Parken verboten?', en: 'How far before and after junctions is parking prohibited?',
    num: { answer: 5, unit: 'm' }, exp: 'Up to 5 m from the intersection of the kerb lines.' },
  { id: 'h2', cat: 'G', topic: 'halten', pts: 3, de: 'Wo ist das Halten verboten?', en: 'Where is stopping prohibited?',
    opts: [o('Auf Fußgängerüberwegen und bis zu 5 m davor', 'On zebra crossings and up to 5 m before them', true), o('In engen und unübersichtlichen Straßenstellen', 'In narrow places with poor visibility', true), o('Auf Parkplätzen', 'In car parks')], exp: 'Stopping is forbidden wherever it endangers or obstructs others, e.g. on and just before zebra crossings.' },
  { id: 'h3', cat: 'G', topic: 'halten', pts: 3, de: 'Was ist beim Aussteigen auf der Fahrbahnseite zu beachten?', en: 'What must you watch for when getting out on the road side?',
    opts: [o('Vor dem Öffnen der Tür nach hinten schauen (Schulterblick)', 'Look back before opening the door (shoulder check)', true), o('Die Tür mit der rechten Hand öffnen („Holländischer Griff“)', 'Open the door with the right hand ("Dutch reach")', true), o('Die Tür schnell öffnen', 'Open the door quickly')], exp: 'Dooring accidents with cyclists are common — always check behind.' },
  { id: 'h4', cat: 'G', topic: 'halten', pts: 3, de: 'Wann parken Sie, wann halten Sie?', en: 'When are you parking rather than stopping?',
    opts: [o('Wenn ich das Fahrzeug verlasse oder länger als 3 Minuten halte', 'When I leave the vehicle or stop longer than 3 minutes', true), o('Wenn ich nur kurz jemanden aussteigen lasse', 'When I briefly let someone out'), o('Wenn ich im Stau stehe', 'When I am in a traffic jam')], exp: 'Parking = leaving the vehicle or stopping for more than 3 minutes.' },

  // ─────────── Verhalten (Fußgänger, Rad, Bus, Kinder) ───────────
  { id: 'r1', cat: 'G', topic: 'verhalten', pts: 5, de: 'Ein Ball rollt vor Ihnen auf die Fahrbahn. Womit müssen Sie rechnen?', en: 'A ball rolls onto the road ahead. What must you expect?',
    opts: [o('Ein Kind läuft hinterher', 'A child will run after it', true), o('Der Ball ist ungefährlich', 'The ball is harmless'), o('Ich muss bremsbereit sein', 'I must be ready to brake', true)], exp: 'Where there is a ball, there is often a child.' },
  { id: 'r2', cat: 'G', topic: 'verhalten', pts: 4, de: 'Wie verhalten Sie sich gegenüber älteren Menschen, Kindern und hilfsbedürftigen Personen?', en: 'How do you behave towards elderly people, children and people needing help?',
    opts: [o('Geschwindigkeit verringern und bremsbereit sein', 'Reduce speed and be ready to brake', true), o('Durch Hupen warnen', 'Warn them with the horn'), o('Eine Gefährdung ausschließen', 'Rule out any danger to them', true)], exp: '§ 3 (2a) StVO: you must exclude any endangerment of these groups.' },
  { id: 'r3', cat: 'G', topic: 'verhalten', pts: 4, de: 'Ein Schulbus hält mit Warnblinklicht an einer Haltestelle. Wie dürfen Sie vorbeifahren?', en: 'A school bus has stopped at a stop with hazard lights. How may you pass?',
    opts: [o('Nur mit Schrittgeschwindigkeit', 'Only at walking pace', true), o('Nur so, dass Fahrgäste nicht gefährdet werden; notfalls anhalten', 'Only without endangering passengers; stop if necessary', true), o('Mit 30 km/h', 'At 30 km/h')], exp: 'Applies to both directions.' },
  { id: 'r4', cat: 'G', topic: 'verhalten', pts: 4, de: 'Ein Radfahrer fährt auf der Fahrbahn, obwohl daneben ein Radweg ohne Benutzungspflicht ist. Was gilt?', en: 'A cyclist rides on the road although there is an optional cycle path. What applies?',
    opts: [o('Das ist erlaubt', 'That is allowed', true), o('Ich darf ihn durch Hupen auf den Radweg schicken', 'I may honk to send him to the path'), o('Ich muss beim Überholen ausreichend Abstand halten', 'I must keep enough distance when overtaking', true)], exp: 'Only cycle paths marked with blue signs are compulsory.' },
  { id: 'r5', cat: 'G', topic: 'verhalten', pts: 4, de: 'Sie wollen rechts abbiegen. Auf dem Radweg rechts neben Ihnen fährt ein Radfahrer geradeaus. Was tun Sie?', en: 'You want to turn right. A cyclist on the cycle path to your right goes straight. What do you do?',
    opts: [o('Ich lasse den Radfahrer zuerst fahren', 'I let the cyclist go first', true), o('Ich mache einen Schulterblick nach rechts', 'I do a shoulder check to the right', true), o('Ich biege zügig vor ihm ab', 'I turn quickly in front of him')], exp: 'Cyclists going straight have priority over turning vehicles. Blind-spot check!' },
  { id: 'r6', cat: 'G', topic: 'verhalten', pts: 3, de: 'Ab welchem Alter dürfen Kinder mit dem Fahrrad nicht mehr auf dem Gehweg fahren?', en: 'From what age may children no longer cycle on the footpath?',
    num: { answer: 10, unit: 'Jahren / years' }, exp: 'Under 8 they must, until 10 they may use the footpath; from 10 they must use road or cycle path.' },

  // ─────────── Autobahn ───────────
  { id: 'b1', cat: 'G', topic: 'autobahn', pts: 4, sign: 'autobahn', de: 'Welche Fahrzeuge dürfen die Autobahn benutzen?', en: 'Which vehicles may use the motorway?',
    opts: [o('Kraftfahrzeuge mit einer bauartbedingten Höchstgeschwindigkeit von mehr als 60 km/h', 'Motor vehicles with a design speed above 60 km/h', true), o('Alle Kraftfahrzeuge', 'All motor vehicles'), o('Mofas', 'Mopeds (25 km/h)')], exp: 'Motorways are for vehicles able to go faster than 60 km/h.' },
  { id: 'b2', cat: 'G', topic: 'autobahn', pts: 5, de: 'Auf der Autobahn bildet sich ein Stau. Wo bilden Sie die Rettungsgasse auf einer dreispurigen Fahrbahn?', en: 'Traffic jam on a three-lane motorway. Where do you form the emergency corridor?',
    opts: [o('Zwischen dem linken und dem mittleren Fahrstreifen', 'Between the left and the middle lane', true), o('Zwischen dem mittleren und dem rechten Fahrstreifen', 'Between the middle and the right lane'), o('Auf dem Standstreifen', 'On the hard shoulder')], exp: 'Rule: left lane moves left, all others move right.' },
  { id: 'b3', cat: 'G', topic: 'autobahn', pts: 4, de: 'Wann müssen Sie eine Rettungsgasse bilden?', en: 'When must you form an emergency corridor?',
    opts: [o('Sobald der Verkehr stockt und mit Schrittgeschwindigkeit fährt oder steht', 'As soon as traffic slows to walking pace or stops', true), o('Erst wenn ich das Martinshorn höre', 'Only when I hear the siren'), o('Auf Autobahnen und Außerortsstraßen mit mindestens zwei Fahrstreifen je Richtung', 'On motorways and rural roads with at least two lanes per direction', true)], exp: '§ 11 StVO: form it before emergency vehicles arrive.' },
  { id: 'b4', cat: 'G', topic: 'autobahn', pts: 4, de: 'Was ist auf der Autobahn verboten?', en: 'What is prohibited on the motorway?',
    opts: [o('Wenden und Rückwärtsfahren', 'U-turns and reversing', true), o('Halten auf dem Seitenstreifen ohne Notfall', 'Stopping on the hard shoulder without an emergency', true), o('Auf dem Beschleunigungsstreifen beschleunigen', 'Accelerating on the slip road')], exp: 'Reversing, turning and stopping (except emergencies) are prohibited.' },
  { id: 'b5', cat: 'G', topic: 'autobahn', pts: 3, de: 'Welche Richtgeschwindigkeit gilt auf Autobahnen für Pkw?', en: 'What is the recommended speed for cars on motorways?',
    num: { answer: 130, unit: 'km/h' }, exp: '130 km/h is recommended where no limit is posted.' },
  { id: 'b6', cat: 'G', topic: 'autobahn', pts: 4, de: 'Wie fahren Sie richtig auf die Autobahn auf?', en: 'How do you join the motorway correctly?',
    opts: [o('Auf dem Beschleunigungsstreifen auf die Geschwindigkeit des Verkehrs beschleunigen', 'Accelerate to traffic speed on the slip road', true), o('Den Verkehr auf der durchgehenden Fahrbahn nicht behindern', 'Not obstruct traffic on the main carriageway', true), o('Am Ende des Beschleunigungsstreifens anhalten', 'Stop at the end of the slip road')], exp: 'Traffic on the motorway has priority; merge at matching speed.' },

  // ─────────── Alkohol & Drogen ───────────
  { id: 'l1', cat: 'G', topic: 'alkohol', pts: 5, de: 'Wie viel Promille Alkohol sind für Fahranfänger in der Probezeit erlaubt?', en: 'How much blood alcohol is allowed for novice drivers on probation?',
    num: { answer: 0, unit: '‰' }, exp: 'Zero tolerance during the probation period and for everyone under 21.' },
  { id: 'l2', cat: 'G', topic: 'alkohol', pts: 5, de: 'Ab welcher Blutalkoholkonzentration begeht ein Fahrer außerhalb der Probezeit (über 21) eine Ordnungswidrigkeit, auch ohne Ausfallerscheinungen?', en: 'From which BAC does a driver over 21, not on probation, commit an offence even without symptoms?',
    num: { answer: 0.5, unit: '‰' }, exp: '0.5 ‰ = administrative offence (fine, points, driving ban). From 0.3 ‰ with symptoms or 1.1 ‰ in any case = criminal offence.' },
  { id: 'l3', cat: 'G', topic: 'alkohol', pts: 5, de: 'Welche Wirkungen hat Alkohol?', en: 'What effects does alcohol have?',
    opts: [o('Die Reaktionszeit wird länger', 'Reaction time increases', true), o('Die Risikobereitschaft steigt', 'Willingness to take risks increases', true), o('Das Sehvermögen wird besser', 'Vision improves')], exp: 'Alcohol slows reactions, narrows vision (tunnel vision) and increases risk-taking.' },
  { id: 'l4', cat: 'G', topic: 'alkohol', pts: 5, de: 'Wie kann man den Alkoholabbau beschleunigen?', en: 'How can you speed up alcohol breakdown?',
    opts: [o('Gar nicht', 'Not at all', true), o('Mit starkem Kaffee', 'With strong coffee'), o('Mit frischer Luft und Bewegung', 'With fresh air and exercise')], exp: 'The body breaks down roughly 0.1 ‰ per hour; nothing speeds this up.' },
  { id: 'l5', cat: 'G', topic: 'alkohol', pts: 5, de: 'Was gilt für Fahranfänger in der Probezeit beim Thema Cannabis?', en: 'What applies to cannabis for novice drivers on probation?',
    opts: [o('Absolutes Cannabisverbot am Steuer', 'Absolute ban on cannabis while driving', true), o('Bis 3,5 ng/ml THC ist erlaubt', 'Up to 3.5 ng/ml THC is allowed'), o('Erlaubt, wenn man sich fit fühlt', 'Allowed if you feel fit')], exp: 'Since 2024 the THC limit of 3.5 ng/ml applies to experienced drivers; novice drivers and under-21s have an absolute ban.' },
  { id: 'l6', cat: 'G', topic: 'alkohol', pts: 4, de: 'Sie nehmen ein Medikament. Was sollten Sie tun?', en: 'You are taking medication. What should you do?',
    opts: [o('Den Beipackzettel lesen', 'Read the package leaflet', true), o('Arzt oder Apotheker nach der Fahrtüchtigkeit fragen', 'Ask a doctor or pharmacist about fitness to drive', true), o('Mit Alkohol ist es unbedenklich', 'Combined with alcohol it is harmless')], exp: 'Many medicines impair driving; combined with alcohol effects can multiply.' },

  // ─────────── Licht & Sicht ───────────
  { id: 'i1', cat: 'G', topic: 'licht', pts: 3, de: 'Wann dürfen Sie die Nebelschlussleuchte einschalten?', en: 'When may you switch on the rear fog light?',
    opts: [o('Wenn die Sichtweite durch Nebel weniger als 50 m beträgt', 'When fog reduces visibility below 50 m', true), o('Bei Dunkelheit', 'In the dark'), o('Bei leichtem Regen', 'In light rain')], exp: 'Only with visibility below 50 m due to fog — and then max. 50 km/h.' },
  { id: 'i2', cat: 'G', topic: 'licht', pts: 3, de: 'Wann müssen Sie Abblendlicht einschalten?', en: 'When must you switch on dipped headlights?',
    opts: [o('In Tunneln', 'In tunnels', true), o('Bei Dämmerung und Dunkelheit', 'At dusk and in the dark', true), o('Wenn die Sicht durch Nebel, Schnee oder Regen erheblich behindert ist', 'When visibility is significantly reduced by fog, snow or rain', true)], exp: 'Daytime running lights are not enough in these situations.' },
  { id: 'i3', cat: 'G', topic: 'licht', pts: 3, de: 'Sie fahren nachts mit Fernlicht. Ihnen kommt ein Fahrzeug entgegen. Was tun Sie?', en: 'You drive at night with high beam. A vehicle approaches. What do you do?',
    opts: [o('Rechtzeitig abblenden', 'Dip the headlights in good time', true), o('Fernlicht anlassen, damit ich besser sehe', 'Keep high beam to see better'), o('Den Blick an den rechten Fahrbahnrand richten, um nicht geblendet zu werden', 'Look at the right edge of the road to avoid glare', true)], exp: 'Avoid dazzling others; look to the right edge if dazzled.' },

  // ─────────── Gefahrenlehre ───────────
  { id: 'f1', cat: 'G', topic: 'gefahren', pts: 5, de: 'Worauf müssen Sie bei Glätte achten?', en: 'What must you pay attention to on slippery roads?',
    opts: [o('Gefühlvoll lenken, bremsen und Gas geben', 'Steer, brake and accelerate gently', true), o('Größeren Abstand halten', 'Keep a larger distance', true), o('Auf Brücken kann es zuerst glatt werden', 'Bridges can freeze first', true)], exp: 'Black ice often forms first on bridges, in forests and shaded areas.' },
  { id: 'f2', cat: 'G', topic: 'gefahren', pts: 4, de: 'Was ist Aquaplaning?', en: 'What is aquaplaning?',
    opts: [o('Die Reifen verlieren auf einem Wasserfilm den Kontakt zur Fahrbahn', 'The tyres lose contact with the road on a film of water', true), o('Ein Spritzwasserschutz', 'A splash guard'), o('Rutschen auf Laub', 'Sliding on leaves')], exp: 'Respond by declutching, not braking hard and keeping the steering straight. Prevent it: slower, good tyres.' },
  { id: 'f3', cat: 'G', topic: 'gefahren', pts: 4, de: 'Was ist der „tote Winkel“?', en: 'What is the "blind spot"?',
    opts: [o('Ein Bereich, den man in den Spiegeln nicht sieht', 'An area you can\'t see in the mirrors', true), o('Er wird durch den Schulterblick kontrolliert', 'It is checked with a shoulder check', true), o('Ein dunkler Bereich in Tunneln', 'A dark area in tunnels')], exp: 'Always shoulder-check before changing lanes, turning or pulling out.' },
  { id: 'f4', cat: 'G', topic: 'gefahren', pts: 4, de: 'Sie werden auf einer langen Fahrt müde. Was hilft wirklich?', en: 'You get tired on a long drive. What really helps?',
    opts: [o('Eine Pause mit Bewegung oder kurzem Schlaf', 'A break with exercise or a short nap', true), o('Lautes Radio und offenes Fenster', 'Loud radio and an open window'), o('Schneller fahren, um früher anzukommen', 'Drive faster to arrive earlier')], exp: 'Microsleep is extremely dangerous. Plan a break about every 2 hours.' },
  { id: 'f5', cat: 'G', topic: 'gefahren', pts: 5, de: 'Sie fahren an parkenden Autos vorbei. Womit müssen Sie rechnen?', en: 'You pass parked cars. What must you expect?',
    opts: [o('Dass plötzlich eine Tür geöffnet wird', 'A door suddenly opening', true), o('Dass Fußgänger zwischen den Autos hervortreten', 'Pedestrians stepping out between cars', true), o('Mit nichts Besonderem', 'Nothing special')], exp: 'Keep enough side distance and be ready to brake.' },
  { id: 'f6', cat: 'G', topic: 'gefahren', pts: 4, de: 'Darf man während der Fahrt ein Handy in der Hand halten und benutzen?', en: 'May you hold and use a mobile phone while driving?',
    opts: [o('Nein, nur mit Freisprecheinrichtung oder Sprachsteuerung', 'No, only hands-free or with voice control', true), o('Ja, an der roten Ampel bei laufendem Motor', 'Yes, at a red light with the engine running'), o('Ja, wenn ich langsam fahre', 'Yes, if I drive slowly')], exp: 'Holding a phone is forbidden unless the vehicle is stopped and the engine fully off (start-stop does not count).' },

  // ─────────── Unfall & Notfall ───────────
  { id: 'n1', cat: 'G', topic: 'unfall', pts: 4, de: 'Sie kommen an eine Unfallstelle. Was tun Sie zuerst?', en: 'You arrive at an accident. What do you do first?',
    opts: [o('Die Unfallstelle absichern (Warnblinklicht, Warndreieck)', 'Secure the scene (hazard lights, warning triangle)', true), o('Den Notruf 112 wählen', 'Call 112', true), o('Erste Hilfe leisten', 'Give first aid', true)], exp: 'Secure – call – help. Put on a high-visibility vest.' },
  { id: 'n2', cat: 'G', topic: 'unfall', pts: 3, de: 'In welcher Entfernung stellen Sie das Warndreieck auf der Autobahn ungefähr auf?', en: 'At roughly what distance do you place the warning triangle on the motorway?',
    num: { answer: 200, unit: 'm' }, exp: 'Rule of thumb: about 50 m in town, 100 m on rural roads, 200 m on motorways (posts every 50 m help).' },
  { id: 'n3', cat: 'G', topic: 'unfall', pts: 5, de: 'Sie haben ein parkendes Auto beschädigt und der Halter ist nicht da. Was müssen Sie tun?', en: 'You damaged a parked car and the owner isn\'t there. What must you do?',
    opts: [o('Eine angemessene Zeit warten', 'Wait a reasonable time', true), o('Danach unverzüglich die Polizei verständigen', 'Then inform the police without delay', true), o('Einen Zettel hinter den Scheibenwischer klemmen und wegfahren', 'Leave a note under the wiper and drive off')], exp: 'Leaving the scene (Unfallflucht) is a criminal offence. A note is not enough.' },
  { id: 'n4', cat: 'G', topic: 'unfall', pts: 3, de: 'Welche Notrufnummer gilt in ganz Europa für Rettungsdienst und Feuerwehr?', en: 'Which emergency number works across Europe for ambulance and fire brigade?',
    num: { answer: 112, unit: '' }, exp: '112 is the European emergency number.' },

  // ─────────── Umwelt ───────────
  { id: 'e1', cat: 'G', topic: 'umwelt', pts: 2, de: 'Wie fahren Sie umweltbewusst und sparsam?', en: 'How do you drive in an eco-friendly and economical way?',
    opts: [o('Früh hochschalten und niedertourig fahren', 'Shift up early and drive at low revs', true), o('Vorausschauend fahren und unnötiges Bremsen vermeiden', 'Anticipate and avoid unnecessary braking', true), o('Den Motor im Stand warmlaufen lassen', 'Let the engine warm up while stationary')], exp: 'Warming up while stationary is prohibited and wasteful.' },
  { id: 'e2', cat: 'G', topic: 'umwelt', pts: 2, de: 'Was erhöht den Kraftstoffverbrauch?', en: 'What increases fuel consumption?',
    opts: [o('Zu niedriger Reifendruck', 'Low tyre pressure', true), o('Ein Dachgepäckträger ohne Ladung', 'An empty roof rack', true), o('Hohe Geschwindigkeit', 'High speed', true)], exp: 'Air resistance and rolling resistance cost fuel.' },
  { id: 'e3', cat: 'G', topic: 'umwelt', pts: 2, de: 'Sie warten an einer geschlossenen Bahnschranke. Was tun Sie?', en: 'You are waiting at a closed level-crossing barrier. What do you do?',
    opts: [o('Den Motor abstellen', 'Switch off the engine', true), o('Den Motor laufen lassen', 'Leave the engine running'), o('Hupen', 'Honk')], exp: 'Unnecessary idling is forbidden when waiting longer.' },

  // ─────────── Technik & Ladung (Zusatzstoff B) ───────────
  { id: 't1', cat: 'B', topic: 'technik', pts: 3, de: 'Wie tief muss das Reifenprofil gesetzlich mindestens sein?', en: 'What is the legal minimum tyre tread depth?',
    num: { answer: 1.6, unit: 'mm' }, exp: 'Legally 1.6 mm; for winter tyres at least 4 mm is recommended.' },
  { id: 't2', cat: 'B', topic: 'technik', pts: 3, de: 'Welche Reifen sind bei Glatteis, Schnee und Schneematsch vorgeschrieben?', en: 'Which tyres are required in ice, snow and slush?',
    opts: [o('Reifen mit Alpine-Symbol (Bergpiktogramm mit Schneeflocke)', 'Tyres with the Alpine symbol (mountain with snowflake)', true), o('Sommerreifen mit 8 mm Profil', 'Summer tyres with 8 mm tread'), o('Ganzjahresreifen mit Alpine-Symbol', 'All-season tyres with the Alpine symbol', true)], exp: 'Situational winter-tyre obligation. Tyres marked only "M+S" no longer count (since Oct 2024).' },
  { id: 't3', cat: 'B', topic: 'technik', pts: 3, de: 'Wann müssen Kinder im Auto in einem Kindersitz gesichert werden?', en: 'When must children be secured in a child seat?',
    opts: [o('Bis zum 12. Geburtstag, wenn sie kleiner als 150 cm sind', 'Until their 12th birthday if shorter than 150 cm', true), o('Nur bis zum 6. Geburtstag', 'Only until their 6th birthday'), o('Nur auf dem Beifahrersitz', 'Only on the front passenger seat')], exp: 'Children under 12 and under 150 cm need a suitable child restraint.' },
  { id: 't4', cat: 'B', topic: 'technik', pts: 4, de: 'Was müssen Sie beim rückwärts gerichteten Kindersitz auf dem Beifahrersitz beachten?', en: 'What must you consider with a rear-facing child seat on the front passenger seat?',
    opts: [o('Der Beifahrer-Airbag muss abgeschaltet sein', 'The passenger airbag must be deactivated', true), o('Der Airbag schützt das Kind zusätzlich', 'The airbag protects the child additionally'), o('Es ist ohne Weiteres erlaubt', 'It is allowed without restriction')], exp: 'An airbag deploying into a rear-facing seat can be fatal.' },
  { id: 't5', cat: 'B', topic: 'technik', pts: 3, de: 'Wie sichern Sie Ladung im Pkw richtig?', en: 'How do you secure a load in a car properly?',
    opts: [o('Schwere Gegenstände unten und nah an der Rückbank verstauen', 'Store heavy items low and close to the rear seat', true), o('Ladung mit Gurten oder Netzen sichern', 'Secure the load with straps or nets', true), o('Lose Gegenstände auf die Hutablage legen', 'Put loose items on the parcel shelf')], exp: 'In a crash loose objects become projectiles.' },
  { id: 't6', cat: 'B', topic: 'technik', pts: 4, de: 'Ladung ragt mehr als 1 m nach hinten hinaus. Wie müssen Sie sie kennzeichnen?', en: 'A load sticks out more than 1 m at the back. How must it be marked?',
    opts: [o('Mit einer hellroten Fahne oder einem Schild (mind. 30 × 30 cm)', 'With a bright red flag or plate (at least 30 × 30 cm)', true), o('Bei Dunkelheit zusätzlich mit roter Leuchte', 'Additionally with a red light in the dark', true), o('Gar nicht', 'Not at all')], exp: '§ 22 StVO.' },
  { id: 't7', cat: 'B', topic: 'technik', pts: 3, de: 'Woran erkennen Sie, dass die Bremsanlage nicht in Ordnung ist?', en: 'How can you tell the brakes are faulty?',
    opts: [o('Das Fahrzeug zieht beim Bremsen zur Seite', 'The car pulls to one side when braking', true), o('Das Bremspedal lässt sich weiter durchtreten als sonst', 'The brake pedal goes further down than usual', true), o('Die Bremskontrollleuchte leuchtet während der Fahrt', 'The brake warning light comes on while driving', true)], exp: 'Have it checked immediately; don\'t drive on.' },
  { id: 't8', cat: 'B', topic: 'technik', pts: 3, de: 'Wann ist der Reifendruck zu prüfen?', en: 'When should tyre pressure be checked?',
    opts: [o('Regelmäßig, am besten bei kalten Reifen', 'Regularly, ideally with cold tyres', true), o('Vor langen Fahrten und bei hoher Beladung', 'Before long trips and with heavy loads', true), o('Nur bei der Hauptuntersuchung', 'Only at the MOT/HU')], exp: 'Wrong pressure affects braking, handling and fuel use.' },
  { id: 't9', cat: 'B', topic: 'technik', pts: 4, de: 'Welche Anhänger dürfen Sie mit der Klasse B ziehen?', en: 'Which trailers may you tow with a Class B licence?',
    opts: [o('Anhänger bis 750 kg zulässige Gesamtmasse', 'Trailers up to 750 kg gross weight', true), o('Schwerere Anhänger, wenn die Kombination höchstens 3.500 kg wiegt', 'Heavier trailers if the combination is max. 3,500 kg', true), o('Jeden Anhänger', 'Any trailer')], exp: 'Beyond that you need B96 or BE.' },
  { id: 't10', cat: 'B', topic: 'technik', pts: 3, de: 'Wie schnell darf ein Pkw mit Anhänger außerorts höchstens fahren (ohne Tempo-100-Zulassung)?', en: 'Max speed for a car with trailer outside towns (without 100 km/h approval)?',
    num: { answer: 80, unit: 'km/h' }, exp: '80 km/h, also on motorways, unless the combination has a 100 km/h approval.' },
  { id: 't11', cat: 'B', topic: 'technik', pts: 3, de: 'Was bedeutet es, wenn die Öldruck-Kontrollleuchte während der Fahrt aufleuchtet?', en: 'What does it mean if the oil pressure warning light comes on while driving?',
    opts: [o('Sofort anhalten und den Motor abstellen', 'Stop immediately and switch off the engine', true), o('Weiterfahren bis zur nächsten Werkstatt', 'Drive on to the next garage'), o('Es droht ein Motorschaden', 'Engine damage is imminent', true)], exp: 'Without oil pressure the engine can be destroyed within minutes.' },
  { id: 't12', cat: 'B', topic: 'technik', pts: 2, de: 'Wie oft muss ein Pkw zur Hauptuntersuchung (HU), wenn er älter als drei Jahre ist?', en: 'How often must a car older than three years go for the general inspection (HU)?',
    opts: [o('Alle zwei Jahre', 'Every two years', true), o('Jedes Jahr', 'Every year'), o('Alle fünf Jahre', 'Every five years')], exp: 'New cars: first HU after 3 years, then every 2 years.' },
  { id: 't13', cat: 'B', topic: 'technik', pts: 3, de: 'Wie stellen Sie die Kopfstütze richtig ein?', en: 'How do you adjust the head restraint correctly?',
    opts: [o('Die Oberkante auf Höhe des Scheitels', 'Top edge level with the top of the head', true), o('Möglichst nah am Hinterkopf', 'As close to the back of the head as possible', true), o('Ganz unten', 'All the way down')], exp: 'Protects against whiplash in rear-end collisions.' },

  // ─────────── Führerschein & Recht ───────────
  { id: 'p1', cat: 'G', topic: 'recht', pts: 3, de: 'Wie lange dauert die Probezeit für Fahranfänger?', en: 'How long is the probation period for novice drivers?',
    num: { answer: 2, unit: 'Jahre / years' }, exp: '2 years; extended to 4 years if you must attend a remedial course.' },
  { id: 'p2', cat: 'G', topic: 'recht', pts: 3, de: 'Welche Dokumente müssen Sie beim Fahren mitführen?', en: 'Which documents must you carry when driving?',
    opts: [o('Führerschein', 'Driving licence', true), o('Zulassungsbescheinigung Teil I (Fahrzeugschein)', 'Registration certificate part I', true), o('Zulassungsbescheinigung Teil II (Fahrzeugbrief)', 'Registration certificate part II')], exp: 'Part II (the title) should be kept safely at home.' },
  { id: 'p3', cat: 'G', topic: 'recht', pts: 4, de: 'Was droht Fahranfängern bei einem schwerwiegenden Verstoß in der Probezeit?', en: 'What happens to novice drivers after a serious offence during probation?',
    opts: [o('Teilnahme an einem Aufbauseminar', 'Attending a remedial course', true), o('Verlängerung der Probezeit auf vier Jahre', 'Probation extended to four years', true), o('Nichts, wenn es das erste Mal ist', 'Nothing, if it\'s the first time')], exp: 'Category A offences (e.g. speeding 21+ km/h, red light) trigger these measures.' },
  { id: 'p4', cat: 'G', topic: 'recht', pts: 3, de: 'Welche Verhaltensweise ist laut § 1 StVO die Grundregel im Straßenverkehr?', en: 'What is the basic rule of road traffic according to § 1 StVO?',
    opts: [o('Ständige Vorsicht und gegenseitige Rücksicht', 'Constant care and mutual consideration', true), o('Niemanden mehr als unvermeidbar behindern oder belästigen', 'Obstruct or inconvenience nobody more than unavoidable', true), o('Wer Vorfahrt hat, muss nie bremsen', 'Whoever has priority never needs to brake')], exp: '§ 1 is the foundation for all other rules.' },
];

/** One picture question per symbol: "What does this sign mean?" (4 options, distractors from the same group). */
const SIGN_QUESTIONS: Question[] = SYMBOLS.map((s, idx) => {
  const same = SYMBOLS.filter((x) => x.group === s.group && x.de !== s.de);
  const picks: typeof same = [];
  for (let k = 1; picks.length < 3 && k <= same.length * 3; k++) {
    const c = same[(idx * 7 + k * 5) % same.length];
    if (!picks.includes(c)) picks.push(c);
  }
  const nm = (t: string) => t.replace(/ \((Diesel, )?(rot|gelb|grün|blau)\)/, '');
  const opts = [o(nm(s.de), s.en, true), ...picks.map((x) => o(nm(x.de), x.en))];
  const rot = idx % opts.length; // vary the position of the right answer
  const dash = s.group === 'Kontroll';
  return {
    id: 'sq_' + s.id,
    cat: dash ? 'B' : 'G',
    topic: dash ? 'technik' : 'zeichen',
    pts: s.group === 'Gefahr' || s.group === 'Kontroll' ? 3 : 4,
    de: dash ? 'Was zeigt diese Kontrollleuchte an?' : s.group === 'Markierung' ? 'Was bedeutet diese Markierung?' : s.group === 'Ampel' ? 'Was bedeutet dieses Lichtzeichen bzw. Zeichen?' : 'Was bedeutet dieses Zeichen?',
    en: dash ? 'What does this warning light indicate?' : 'What does this sign / marking mean?',
    opts: [...opts.slice(rot), ...opts.slice(0, rot)],
    sign: s.id,
    exp: `${s.meaning}${s.tip ? ' ' + s.tip : ''} — ${s.meaningEn}`,
  } as Question;
});

export const QUESTIONS: Question[] = [...BASE_QUESTIONS, ...SIGN_QUESTIONS];

export const Q_BY_ID = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));
