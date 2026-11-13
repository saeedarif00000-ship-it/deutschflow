/**
 * All traffic signs, markings, lights, police signals and dashboard symbols
 * used in the app, with explanations. Numbers follow the StVO (Anlage 1–4)
 * where one exists. Texts are our own summaries, not the official catalogue.
 */
export type SymbolGroup = 'Gefahr' | 'Vorschrift' | 'Richtung' | 'Zusatz' | 'Markierung' | 'Ampel' | 'Kontroll';

export type SymbolInfo = {
  id: string;
  nr: string;
  de: string;
  en: string;
  group: SymbolGroup;
  /** What it means (DE) */
  meaning: string;
  /** What it means (EN) */
  meaningEn: string;
  /** Typical exam trap / extra tip */
  tip?: string;
};

export const GROUPS: { id: SymbolGroup; de: string; en: string; info: string }[] = [
  { id: 'Gefahr', de: 'Gefahrzeichen', en: 'Warning signs', info: 'Rotes Dreieck, Spitze oben. Warnt vor einer Gefahrstelle – außerorts meist 150–250 m davor, innerorts kurz davor. Geschwindigkeit anpassen, bremsbereit sein.' },
  { id: 'Vorschrift', de: 'Vorschriftzeichen', en: 'Regulatory signs', info: 'Gebote und Verbote (meist rund). Gelten ab dem Schild bis zur nächsten Kreuzung/Einmündung oder bis zum Ende-Zeichen.' },
  { id: 'Richtung', de: 'Richtzeichen', en: 'Information signs', info: 'Geben Hinweise, regeln aber teilweise auch Vorfahrt (301, 306, 308) oder besondere Bereiche (Autobahn, verkehrsberuhigter Bereich).' },
  { id: 'Zusatz', de: 'Zusatzzeichen', en: 'Additional panels', info: 'Weiße Schilder unter einem Hauptzeichen. Sie schränken das Hauptzeichen ein, erweitern es oder erläutern es – sie gelten nie allein.' },
  { id: 'Markierung', de: 'Markierungen', en: 'Road markings', info: 'Weiße Markierungen sind Vorschriften oder Richtzeichen. Gelbe Markierungen (Baustelle) heben weiße auf.' },
  { id: 'Ampel', de: 'Ampel & Polizei', en: 'Lights & police', info: 'Reihenfolge: Polizeibeamte vor Ampel vor Verkehrszeichen vor allgemeinen Regeln (§ 36/37 StVO).' },
  { id: 'Kontroll', de: 'Kontrollleuchten', en: 'Dashboard lights', info: 'Rot = Gefahr, sofort anhalten bzw. nicht weiterfahren. Gelb = Störung, bald prüfen lassen. Grün/Blau = Funktion an.' },
];

const S = (id: string, nr: string, group: SymbolGroup, de: string, en: string, meaning: string, meaningEn: string, tip?: string): SymbolInfo => ({ id, nr, group, de, en, meaning, meaningEn, tip });

export const SYMBOLS: SymbolInfo[] = [
  // ───────── Gefahrzeichen (Anlage 1) ─────────
  S('gefahr', '101', 'Gefahr', 'Gefahrstelle', 'Danger', 'Allgemeine Gefahrstelle. Das Zusatzzeichen nennt oft die Art der Gefahr (z. B. Unfall, Ölspur).', 'General hazard; a panel often names the type.', 'Ohne Zusatzzeichen: besonders aufmerksam und bremsbereit fahren.'),
  S('rechtsvorlinks', '102', 'Gefahr', 'Kreuzung, Einmündung mit Vorfahrt von rechts', 'Junction – priority to the right', 'An der nächsten Kreuzung oder Einmündung gilt „rechts vor links“.', 'At the next junction, traffic from the right has priority.', 'Gilt auch, wenn die eigene Straße breiter aussieht.'),
  S('kurvelinks', '103-10', 'Gefahr', 'Kurve (links)', 'Bend to the left', 'Gefährliche Linkskurve. Vorher abbremsen, nicht in der Kurve stark bremsen.', 'Dangerous left bend.', 'Vor der Kurve bremsen, in der Kurve leicht Gas geben.'),
  S('kurverechts', '103-20', 'Gefahr', 'Kurve (rechts)', 'Bend to the right', 'Gefährliche Rechtskurve. Geschwindigkeit vorher verringern.', 'Dangerous right bend.'),
  S('doppelkurve', '105', 'Gefahr', 'Doppelkurve', 'Double bend', 'Zwei aufeinanderfolgende Kurven; erste Kurve wie im Bild (hier zuerst links).', 'Two bends in a row; first one as shown.', 'Überholen ist hier besonders gefährlich.'),
  S('gefaelle', '108', 'Gefahr', 'Gefälle', 'Steep descent', 'Starkes Gefälle (z. B. 10 %). Rechtzeitig in einen niedrigeren Gang schalten und mit der Motorbremse fahren.', 'Steep downhill. Use a lower gear / engine braking.', 'Dauerbremsen überhitzt die Bremsen.'),
  S('steigung', '110', 'Gefahr', 'Steigung', 'Steep ascent', 'Starke Steigung. Langsame Fahrzeuge möglich; beim Anfahren am Berg Handbremse nutzen.', 'Steep uphill.', 'An engen Steigungen hat in der Regel der Bergauffahrende Vorrang – nicht darauf bestehen.'),
  S('uneben', '112', 'Gefahr', 'Unebene Fahrbahn', 'Uneven road', 'Schlaglöcher, Bodenwellen. Langsamer fahren, Lenkrad gut festhalten.', 'Bumps or potholes ahead.'),
  S('schleudergefahr', '114', 'Gefahr', 'Schleuder- oder Rutschgefahr', 'Slippery road', 'Gefahr bei Nässe oder Verschmutzung. Sanft bremsen, lenken, beschleunigen.', 'Road may be slippery when wet or dirty.', 'Oft mit Zusatzzeichen „bei Nässe“ – dann gilt es nur bei nasser Fahrbahn.'),
  S('steinschlag', '101-15', 'Gefahr', 'Steinschlag', 'Falling rocks', 'Steine können auf die Fahrbahn fallen oder liegen. Vorsichtig fahren, nicht halten.', 'Falling or fallen rocks.'),
  S('seitenwind', '117', 'Gefahr', 'Seitenwind', 'Crosswind', 'Starker Seitenwind (Brücken, Waldschneisen). Lenkrad fest halten, langsamer fahren – besonders mit Anhänger oder Dachbox.', 'Strong crosswind.', 'Beim Überholen von Lkw kann der Wind plötzlich wirken.'),
  S('verengt', '120', 'Gefahr', 'Verengte Fahrbahn', 'Road narrows', 'Die Fahrbahn wird beidseitig schmaler. Auf Gegenverkehr achten, ggf. warten.', 'Road narrows on both sides.'),
  S('verengtrechts', '121-20', 'Gefahr', 'Einseitig verengte Fahrbahn', 'Road narrows on one side', 'Die Fahrbahn wird auf einer Seite schmaler. Reißverschluss beachten, wenn ein Fahrstreifen endet.', 'Road narrows on one side.'),
  S('baustelle', '123', 'Gefahr', 'Arbeitsstelle', 'Roadworks', 'Baustelle: Arbeiter, Fahrzeuge, verschmutzte oder verengte Fahrbahn. Langsam fahren, gelbe Markierungen gelten.', 'Roadworks ahead.', 'Gelbe Markierungen heben weiße auf.'),
  S('stau', '124', 'Gefahr', 'Stau', 'Queues likely', 'Stauende möglich. Bremsbereit sein; bei Stau Warnblinklicht einschalten und Rettungsgasse bilden.', 'Traffic jam ahead.', 'Rettungsgasse: zwischen linkstem und dem rechts daneben liegenden Fahrstreifen.'),
  S('gegenverkehr', '125', 'Gefahr', 'Gegenverkehr', 'Two-way traffic', 'Nach einem Abschnitt mit getrennten Fahrbahnen oder Einbahnstraße kommt wieder Gegenverkehr.', 'Two-way traffic ahead.'),
  S('ampelwarn', '131', 'Gefahr', 'Lichtzeichenanlage', 'Traffic lights ahead', 'Ampel kommt, mit der man nicht rechnet. Bremsbereit sein.', 'Unexpected traffic lights ahead.'),
  S('fussgaenger', '133', 'Gefahr', 'Fußgänger', 'Pedestrians', 'Fußgänger können die Fahrbahn betreten. Kein Fußgängerüberweg!', 'Pedestrians may cross.', 'Fußgänger haben hier keinen Vorrang – trotzdem rücksichtsvoll fahren.'),
  S('kinder', '136', 'Gefahr', 'Kinder', 'Children', 'Kinder in der Nähe (Schule, Spielplatz). Langsam fahren, bremsbereit, mit plötzlichem Auftauchen rechnen.', 'Children may run onto the road.', 'Kinder unterschätzen Geschwindigkeit und Entfernung.'),
  S('radverkehr', '138', 'Gefahr', 'Radverkehr', 'Cyclists', 'Radfahrer kreuzen oder fahren auf die Fahrbahn ein.', 'Cyclists crossing or joining.', 'Überholabstand zu Radfahrern: innerorts mind. 1,5 m, außerorts mind. 2 m.'),
  S('wildwechsel', '142-10', 'Gefahr', 'Wildwechsel', 'Wild animals', 'Wild kann die Straße kreuzen, besonders in der Dämmerung. Langsamer, Fernlicht abblenden, hupen. Nicht riskant ausweichen.', 'Deer may cross, especially at dusk.', 'Lieber kontrolliert bremsen und gerade fahren als ausweichen (Gegenverkehr, Baum).'),
  S('ufer', '129', 'Gefahr', 'Ufer', 'Quayside / river bank', 'Die Straße führt an ein ungesichertes Ufer. Langsam fahren.', 'Road leads to an unprotected bank.'),
  S('flugbetrieb', '144', 'Gefahr', 'Flugbetrieb', 'Low-flying aircraft', 'Tief fliegende Flugzeuge: plötzlicher Lärm, nicht erschrecken lassen.', 'Low-flying aircraft – sudden noise.'),
  S('bahnuebergang', '151', 'Gefahr', 'Bahnübergang', 'Level crossing', 'Bahnübergang kommt. Vor dem Andreaskreuz warten, wenn Zug kommt, Schranken sich senken oder rotes Licht blinkt.', 'Level crossing ahead.', 'Schienenfahrzeuge haben immer Vorrang.'),
  S('bake3', '156', 'Gefahr', 'Dreistreifige Bake (Bahnübergang)', 'Countdown marker (3 stripes)', 'Etwa 240 m vor dem Bahnübergang. Dann folgen zwei Streifen (ca. 160 m) und ein Streifen (ca. 80 m).', 'About 240 m before a level crossing (then 160 m, 80 m).', 'Ab den Baken bis zum Übergang: nicht überholen (Kfz), nicht halten/parken.'),

  // ───────── Vorschriftzeichen (Anlage 2) ─────────
  S('andreaskreuz', '201', 'Vorschrift', 'Andreaskreuz', 'St Andrew’s cross', 'Schienenverkehr hat Vorrang. Parkverbot innerorts 5 m, außerorts 50 m vor und hinter dem Kreuz.', 'Trains have priority. No parking 5 m (town) / 50 m (outside) before/after.'),
  S('vorfahrtgewaehren', '205', 'Vorschrift', 'Vorfahrt gewähren', 'Give way', 'Vorfahrt der kreuzenden Straße beachten. Nur weiterfahren, wenn man niemanden gefährdet oder behindert.', 'Give way to traffic on the crossing road.', 'Bis 10 m vor dem Zeichen nicht halten, wenn es dadurch verdeckt würde.'),
  S('stop', '206', 'Vorschrift', 'Halt. Vorfahrt gewähren.', 'Stop and give way', 'Immer anhalten – an der Haltlinie, sonst dort, wo die Straße eingesehen werden kann. Dann Vorfahrt gewähren.', 'Always stop, then give way.', 'Auch wenn frei ist: vollständig anhalten (Räder stehen still).'),
  S('vorranggegenverkehr', '208', 'Vorschrift', 'Vorrang des Gegenverkehrs', 'Give way to oncoming traffic', 'An der Engstelle hat der Gegenverkehr Vorrang. Warten, bis die Engstelle frei ist.', 'Oncoming traffic has priority at the narrow section.'),
  S('rechts', '209', 'Vorschrift', 'Vorgeschriebene Fahrtrichtung rechts', 'Turn right', 'An der nächsten Kreuzung nur nach rechts abbiegen.', 'You must turn right ahead.'),
  S('hierrechts', '211', 'Vorschrift', 'Hier rechts', 'Turn right here', 'Genau hier nach rechts abbiegen.', 'Turn right here.'),
  S('geradeausrechts', '214', 'Vorschrift', 'Vorgeschriebene Fahrtrichtung geradeaus oder rechts', 'Straight on or right', 'Nur geradeaus oder rechts erlaubt – nicht links.', 'Only straight ahead or right.'),
  S('kreisverkehr', '215', 'Vorschrift', 'Kreisverkehr', 'Roundabout', 'Im Kreis rechts herum fahren. Beim Einfahren nicht blinken, beim Ausfahren rechts blinken. Auf der Kreisfahrbahn nicht halten.', 'Drive counter-clockwise. No indicator entering, indicate right when leaving.', 'Der Kreis hat nur Vorfahrt, wenn zusätzlich „Vorfahrt gewähren“ (205) steht.'),
  S('einbahnstrasse', '220', 'Vorschrift', 'Einbahnstraße', 'One-way street', 'Nur in Pfeilrichtung fahren. Halten und Parken auch links erlaubt.', 'Drive only in the arrow direction. Parking allowed on the left too.', 'Radfahrer dürfen nur dann entgegen fahren, wenn ein Zusatzzeichen das erlaubt.'),
  S('rechtsvorbei', '222', 'Vorschrift', 'Rechts vorbei', 'Pass on the right', 'Das Hindernis (z. B. Verkehrsinsel) rechts umfahren.', 'Keep right of the obstacle.'),
  S('haltestelle', '224', 'Vorschrift', 'Haltestelle', 'Bus/tram stop', '15 m vor und hinter dem Zeichen nicht parken. Hält ein Bus mit Warnblinklicht: nur mit Schrittgeschwindigkeit und genügend Abstand vorbeifahren.', 'No parking 15 m before/after. Pass a bus with hazard lights only at walking speed.', 'Nähert sich ein Bus mit Warnblinklicht der Haltestelle: nicht überholen.'),
  S('radweg', '237', 'Vorschrift', 'Radweg', 'Cycle path', 'Radfahrer müssen den Radweg benutzen. Andere dürfen ihn nicht befahren.', 'Mandatory cycle path; others not allowed.'),
  S('gehweg', '239', 'Vorschrift', 'Gehweg', 'Footpath', 'Nur für Fußgänger. Andere nur mit Zusatzzeichen (z. B. „Radfahrer frei“ – dann Schrittgeschwindigkeit).', 'Pedestrians only.'),
  S('gehradweg', '240', 'Vorschrift', 'Gemeinsamer Geh- und Radweg', 'Shared path', 'Fußgänger und Radfahrer teilen sich den Weg; Radfahrer müssen auf Fußgänger Rücksicht nehmen.', 'Shared path for pedestrians and cyclists.'),
  S('getrenntradgehweg', '241', 'Vorschrift', 'Getrennter Rad- und Gehweg', 'Segregated path', 'Radfahrer und Fußgänger benutzen jeweils ihre Seite.', 'Separate sides for cyclists and pedestrians.'),
  S('fussgaengerzone', '242.1', 'Vorschrift', 'Beginn einer Fußgängerzone', 'Pedestrian zone', 'Fahrzeugverkehr verboten, außer ein Zusatzzeichen erlaubt ihn (dann Schrittgeschwindigkeit).', 'No vehicles unless a panel allows (then walking speed).'),
  S('fahrradstrasse', '244.1', 'Vorschrift', 'Beginn einer Fahrradstraße', 'Cycle street', 'Andere Fahrzeuge nur mit Zusatzzeichen. Höchstens 30 km/h. Radfahrer dürfen nebeneinander fahren.', 'Other vehicles only if permitted; max 30 km/h.'),
  S('busspur', '245', 'Vorschrift', 'Bussonderfahrstreifen', 'Bus lane', 'Nur für Linienbusse (und durch Zusatzzeichen erlaubte Fahrzeuge, z. B. Taxis, Radfahrer).', 'Buses only (unless a panel allows others).', 'Zum Rechtsabbiegen darf man meist kurz vorher einordnen, wenn die Markierung unterbrochen ist.'),
  S('verboteallerart', '250', 'Vorschrift', 'Verbot für Fahrzeuge aller Art', 'No vehicles', 'Kein Fahrzeug darf hier fahren. Fahrräder und Mofas dürfen geschoben werden.', 'No vehicles at all. Bikes may be pushed.'),
  S('verbotkraftwagen', '251', 'Vorschrift', 'Verbot für Kraftwagen', 'No motor vehicles (cars)', 'Verbot für Kraftwagen und sonstige mehrspurige Kraftfahrzeuge. Motorräder dürfen fahren.', 'No cars / multi-track motor vehicles. Motorcycles allowed.'),
  S('verbotlkw', '253', 'Vorschrift', 'Verbot für Kfz über 3,5 t', 'No lorries over 3.5 t', 'Verbot für Kfz mit zulässiger Gesamtmasse über 3,5 t (inkl. Anhänger), außer Pkw und Busse.', 'No vehicles over 3.5 t permitted weight (except cars and buses).'),
  S('verbotrad', '254', 'Vorschrift', 'Verbot für Radverkehr', 'No cycling', 'Radfahren verboten.', 'No bicycles.'),
  S('verbotfussgaenger', '259', 'Vorschrift', 'Verbot für Fußgänger', 'No pedestrians', 'Fußgänger dürfen hier nicht gehen.', 'No pedestrians.'),
  S('verbotkfz', '260', 'Vorschrift', 'Verbot für Krafträder und Kraftwagen', 'No motor vehicles', 'Verbot für alle Kraftfahrzeuge (Motorräder, Mopeds, Autos). Fahrräder erlaubt.', 'No motorcycles or cars; bicycles allowed.'),
  S('gewicht55', '262', 'Vorschrift', 'Tatsächliche Masse', 'Weight limit', 'Verbot für Fahrzeuge, deren tatsächliches Gewicht die Angabe (hier 5,5 t) überschreitet.', 'No vehicles heavier (actual weight) than shown.', 'Es zählt das tatsächliche Gewicht – nicht die zulässige Gesamtmasse.'),
  S('breite2', '264', 'Vorschrift', 'Tatsächliche Breite', 'Width limit', 'Verbot für Fahrzeuge, die einschließlich Ladung breiter sind als angegeben.', 'No vehicles wider than shown (incl. load).', 'Außenspiegel zählen bei der Fahrzeugbreite nicht mit.'),
  S('hoehe38', '265', 'Vorschrift', 'Tatsächliche Höhe', 'Height limit', 'Verbot für Fahrzeuge, die einschließlich Ladung höher sind als angegeben.', 'No vehicles higher than shown (incl. load).', 'Dachbox und Fahrräder auf dem Dach zählen mit!'),
  S('einfahrtverboten', '267', 'Vorschrift', 'Verbot der Einfahrt', 'No entry', 'Hier nicht einfahren – meist das Ende einer Einbahnstraße.', 'No entry (usually end of a one-way street).'),
  S('schneeketten', '268', 'Vorschrift', 'Schneeketten vorgeschrieben', 'Snow chains required', 'Nur mit Schneeketten weiterfahren; mit Ketten höchstens 50 km/h.', 'Snow chains required; max 50 km/h with chains.'),
  S('tempo30', '274', 'Vorschrift', 'Zulässige Höchstgeschwindigkeit 30', 'Speed limit 30', 'Nicht schneller als 30 km/h fahren. Gilt bis zum Ende-Zeichen oder einem anderen Tempo-Schild.', 'Max 30 km/h until cancelled.', 'Ein Tempolimit endet nicht automatisch an einer Kreuzung – erst durch ein Ende-Zeichen oder ein neues Limit.'),
  S('tempo50', '274', 'Vorschrift', 'Zulässige Höchstgeschwindigkeit 50', 'Speed limit 50', 'Nicht schneller als 50 km/h fahren.', 'Max 50 km/h.'),
  S('tempo70', '274', 'Vorschrift', 'Zulässige Höchstgeschwindigkeit 70', 'Speed limit 70', 'Nicht schneller als 70 km/h fahren. Gilt nicht automatisch nach einer Kreuzung als aufgehoben.', 'Max 70 km/h.', 'Streckenverbote gelten auch nach Kreuzungen weiter (anders als z. B. Haltverbote mit Zone).'),
  S('tempo100', '274', 'Vorschrift', 'Zulässige Höchstgeschwindigkeit 100', 'Speed limit 100', 'Nicht schneller als 100 km/h fahren.', 'Max 100 km/h.'),
  S('zone30', '274.1', 'Vorschrift', 'Beginn einer Tempo-30-Zone', 'Start of 30 zone', 'Im ganzen Gebiet höchstens 30 km/h. Meist gilt „rechts vor links“.', 'Max 30 km/h in the whole zone; usually priority to the right.'),
  S('endezone30', '274.2', 'Vorschrift', 'Ende einer Tempo-30-Zone', 'End of 30 zone', 'Ende der Zone – danach gilt wieder die allgemeine Höchstgeschwindigkeit (innerorts 50 km/h).', 'End of zone; general limit applies again.'),
  S('mindestgeschwindigkeit', '275', 'Vorschrift', 'Vorgeschriebene Mindestgeschwindigkeit', 'Minimum speed', 'Nicht langsamer fahren als angegeben (außer Verkehr/Wetter verlangt es). Langsamere Fahrzeuge dürfen die Straße nicht benutzen.', 'Do not drive slower than shown.'),
  S('ueberholverbot', '276', 'Vorschrift', 'Überholverbot', 'No overtaking', 'Kfz dürfen mehrspurige Kfz und Krafträder mit Beiwagen nicht überholen.', 'Motor vehicles may not overtake multi-track motor vehicles.', 'Einspurige Fahrzeuge (Fahrrad, Mofa, Motorrad ohne Beiwagen) dürfen überholt werden.'),
  S('ueberholverbotlkw', '277', 'Vorschrift', 'Überholverbot für Kfz über 3,5 t', 'No overtaking for lorries', 'Kfz über 3,5 t zulässige Gesamtmasse dürfen andere mehrspurige Kfz nicht überholen. Pkw dürfen überholen.', 'Vehicles over 3.5 t may not overtake; cars may.', 'Pkw mit Anhänger und Busse sind ausgenommen.'),
  S('endetempo70', '278', 'Vorschrift', 'Ende der zulässigen Höchstgeschwindigkeit', 'End of speed limit', 'Das Tempolimit 70 ist aufgehoben. Es gilt wieder die allgemeine Höchstgeschwindigkeit.', 'End of the 70 limit.'),
  S('endeueberholverbot', '280', 'Vorschrift', 'Ende des Überholverbots', 'End of no-overtaking', 'Ab hier darf wieder überholt werden (wenn es sicher ist).', 'Overtaking allowed again.'),
  S('endeverbote', '282', 'Vorschrift', 'Ende sämtlicher Streckenverbote', 'End of all restrictions', 'Alle vorher angeordneten Streckenverbote (Tempo, Überholverbot) sind aufgehoben.', 'All previous restrictions end.'),
  S('haltverbot', '283', 'Vorschrift', 'Absolutes Haltverbot', 'No stopping', 'Halten ist verboten – auch nicht kurz zum Ein- oder Aussteigen.', 'No stopping at all.', 'Gilt nur auf der Fahrbahn (mit Zusatzzeichen auch auf dem Seitenstreifen).'),
  S('eingeschraenkteshaltverbot', '286', 'Vorschrift', 'Eingeschränktes Haltverbot', 'Limited stopping', 'Halten nur bis 3 Minuten, außer zum Ein-/Aussteigen oder Be-/Entladen.', 'Stop max 3 min unless loading or passengers.'),
  S('haltverbotzone', '290.1', 'Vorschrift', 'Beginn eines eingeschränkten Haltverbots für eine Zone', 'Limited-stopping zone', 'In der ganzen Zone eingeschränktes Haltverbot; Parken nur auf gekennzeichneten Flächen.', 'Limited stopping in the whole zone; park only where marked.'),

  // ───────── Richtzeichen (Anlage 3) ─────────
  S('vorfahrt', '301', 'Richtung', 'Vorfahrt', 'Priority at next junction', 'Vorfahrt nur an der nächsten Kreuzung oder Einmündung.', 'Priority at the next junction only.'),
  S('vorfahrtstrasse', '306', 'Richtung', 'Vorfahrtstraße', 'Priority road', 'Vorfahrt an allen folgenden Kreuzungen bis zum Ende-Zeichen. Außerorts Parkverbot auf der Fahrbahn.', 'Priority at all junctions until it ends. No parking on the carriageway outside towns.', 'Biegt die Vorfahrtstraße ab (Zusatzzeichen), beim Folgen trotzdem blinken.'),
  S('endevorfahrtstrasse', '307', 'Richtung', 'Ende der Vorfahrtstraße', 'End of priority road', 'Die Vorfahrt endet. An der nächsten Kreuzung auf neue Regelung achten.', 'Priority ends.'),
  S('vorrangvorgegenverkehr', '308', 'Richtung', 'Vorrang vor dem Gegenverkehr', 'Priority over oncoming traffic', 'An der Engstelle hat man Vorrang vor dem Gegenverkehr.', 'You have priority at the narrow section.', 'Trotzdem nicht erzwingen, wenn der Gegenverkehr schon in der Engstelle ist.'),
  S('ortstafel', '310', 'Richtung', 'Ortstafel (Vorderseite)', 'Town entrance', 'Ab hier innerorts: höchstens 50 km/h, wenn nichts anderes angeordnet ist.', 'Built-up area starts: max 50 km/h.'),
  S('ortsende', '311', 'Richtung', 'Ortstafel (Rückseite)', 'Town exit', 'Ende des Ortes: außerorts gilt für Pkw höchstens 100 km/h.', 'Built-up area ends: max 100 km/h for cars.'),
  S('parken', '314', 'Richtung', 'Parken', 'Parking', 'Parken erlaubt (Zusatzzeichen können Zeit, Parkscheibe oder Fahrzeugart regeln).', 'Parking allowed.'),
  S('parkengehweg', '315', 'Richtung', 'Parken auf Gehwegen', 'Parking on pavement', 'Parken auf dem Gehweg erlaubt – nur Fahrzeuge bis 2,8 t, und so wie im Bild gezeigt (ganz oder halb).', 'Pavement parking allowed (vehicles up to 2.8 t).'),
  S('verkehrsberuhigt', '325.1', 'Richtung', 'Beginn eines verkehrsberuhigten Bereichs', 'Traffic-calmed area', 'Schrittgeschwindigkeit. Fußgänger dürfen die ganze Straße nutzen, Kinder überall spielen. Parken nur auf gekennzeichneten Flächen.', 'Walking speed; pedestrians use the whole street; park only where marked.', 'Beim Ausfahren aus dem Bereich muss man allen Vorfahrt gewähren.'),
  S('endeverkehrsberuhigt', '325.2', 'Richtung', 'Ende eines verkehrsberuhigten Bereichs', 'End of traffic-calmed area', 'Ende des Bereichs. Beim Hinausfahren dem fließenden Verkehr Vorrang lassen.', 'End of area; give way when leaving.'),
  S('tunnel', '327', 'Richtung', 'Tunnel', 'Tunnel', 'Abblendlicht einschalten. Wenden und Rückwärtsfahren verboten. Bei Panne: Warnblinker, Motor aus, Notruf.', 'Dipped headlights; no U-turns or reversing.'),
  S('nothaltebucht', '328', 'Richtung', 'Nothalte- und Pannenbucht', 'Emergency lay-by', 'Nur für Notfälle und Pannen halten.', 'Stop only in emergencies.'),
  S('autobahn', '330.1', 'Richtung', 'Autobahn', 'Motorway', 'Nur für Kfz, die bauartbedingt schneller als 60 km/h fahren können. Halten, Wenden, Rückwärtsfahren verboten. Richtgeschwindigkeit 130 km/h.', 'Only for vehicles able to exceed 60 km/h. No stopping, U-turns or reversing.'),
  S('endeautobahn', '330.2', 'Richtung', 'Ende der Autobahn', 'End of motorway', 'Die Autobahnregeln enden.', 'Motorway rules end.'),
  S('kraftfahrstrasse', '331.1', 'Richtung', 'Kraftfahrstraße', 'Expressway', 'Wie Autobahn: nur Kfz über 60 km/h bauartbedingt. Halten nur auf Parkplätzen, Wenden verboten. An Kreuzungen hat man Vorfahrt.', 'Like a motorway: only vehicles >60 km/h; no stopping on the road.'),
  S('endekraftfahrstrasse', '331.2', 'Richtung', 'Ende der Kraftfahrstraße', 'End of expressway', 'Die Regeln der Kraftfahrstraße enden.', 'Expressway rules end.'),
  S('ausfahrt', '332', 'Richtung', 'Ausfahrt (Autobahn)', 'Motorway exit', 'Ausfahrt von der Autobahn. Rechtzeitig rechts einordnen und Blinker setzen, erst auf dem Verzögerungsstreifen bremsen.', 'Motorway exit; brake on the deceleration lane.'),
  S('ankuendigungsbake', '450', 'Richtung', 'Ankündigungsbake', 'Exit countdown marker', 'Kündigt die Autobahnausfahrt an: 3 Streifen ≈ 300 m, 2 ≈ 200 m, 1 ≈ 100 m.', 'Countdown to the exit: 300/200/100 m.'),
  S('fussgaengerueberweg', '350', 'Richtung', 'Fußgängerüberweg', 'Zebra crossing', 'Fußgängern, die erkennbar den Überweg benutzen wollen, das Überqueren ermöglichen. Nicht überholen. 5 m davor nicht halten.', 'Let pedestrians cross. No overtaking; no stopping 5 m before.'),
  S('sackgasse', '357', 'Richtung', 'Sackgasse', 'Dead end', 'Die Straße endet – für Fahrzeuge keine Durchfahrt.', 'No through road.'),
  S('richtgeschwindigkeit', '380', 'Richtung', 'Richtgeschwindigkeit', 'Recommended speed', 'Empfohlene Höchstgeschwindigkeit (130 km/h) – keine Pflicht.', 'Recommended (not mandatory) speed.', 'Wer schneller fährt, kann bei einem Unfall eine Mitschuld bekommen.'),
  S('enderichtgeschwindigkeit', '381', 'Richtung', 'Ende der Richtgeschwindigkeit', 'End of recommended speed', 'Die Empfehlung endet.', 'Recommendation ends.'),
  S('laternenring', '394', 'Richtung', 'Laternenring', 'Lamp-post ring', 'Diese Laterne brennt nicht die ganze Nacht. Wer dort parkt, muss sein Fahrzeug ggf. selbst beleuchten (Parkleuchte).', 'Light not on all night; parked vehicles may need parking lights.'),
  S('bundesstrasse', '401', 'Richtung', 'Nummernschild Bundesstraße', 'Federal road number', 'Kennzeichnet eine Bundesstraße (gelbes Schild). Keine Vorfahrtsregel!', 'Federal road number – not a priority sign.'),
  S('autobahnnummer', '405', 'Richtung', 'Nummernschild Autobahn', 'Motorway number', 'Nummer der Autobahn (blaues Schild).', 'Motorway number.'),
  S('umleitung', '454', 'Richtung', 'Umleitung', 'Diversion', 'Der Umleitung folgen (oft wegen Baustelle).', 'Follow the diversion.'),

  // ───────── Zusatzzeichen ─────────
  S('z_naesse', 'ZZ', 'Zusatz', 'bei Nässe', 'When wet', 'Das Hauptzeichen gilt nur bei nasser Fahrbahn.', 'Main sign applies only when the road is wet.'),
  S('z_schnee', 'ZZ', 'Zusatz', 'Schneeflocke', 'Snowflake', 'Gefahr durch Schnee- oder Eisglätte.', 'Risk of snow or ice.'),
  S('z_glatteis', 'ZZ', 'Zusatz', 'Schnee- oder Eisglätte', 'Snow or ice', 'Erklärt die Gefahr: Glätte durch Schnee oder Eis.', 'Explains danger: snow/ice.'),
  S('z_entfernung', 'ZZ', 'Zusatz', 'Entfernung (200 m)', 'Distance', 'Das Hauptzeichen gilt erst in 200 m Entfernung.', 'Main sign applies in 200 m.'),
  S('z_strecke', 'ZZ', 'Zusatz', 'Länge einer Strecke (800 m)', 'Length', 'Das Hauptzeichen gilt auf den nächsten 800 m.', 'Applies for the next 800 m.'),
  S('z_zeit', 'ZZ', 'Zusatz', 'Zeitangabe (Mo–Fr 7–19 h)', 'Times', 'Das Hauptzeichen gilt nur zu diesen Zeiten.', 'Applies only during these times.'),
  S('z_anlieger', 'ZZ', 'Zusatz', 'Anlieger frei', 'Access only', 'Anlieger (Anwohner, Besucher, Lieferanten) dürfen trotz Verbot fahren.', 'Residents/visitors exempt.'),
  S('z_radfrei', 'ZZ', 'Zusatz', 'Radverkehr frei', 'Cyclists exempt', 'Radfahrer sind vom Verbot ausgenommen (z. B. Einbahnstraße in Gegenrichtung).', 'Cyclists exempt.'),
  S('z_schulbus', 'ZZ', 'Zusatz', 'Schulbus mit Zeitangabe', 'School bus', 'Die Haltestelle ist zu diesen Zeiten auch Schulbushaltestelle.', 'School bus stop at these times.'),
  S('z_abknickend', 'ZZ', 'Zusatz', 'Abknickende Vorfahrt', 'Priority road bends', 'Der dicke Strich zeigt den Verlauf der Vorfahrtstraße. Wer ihr folgt, muss blinken.', 'Thick line shows the priority road; indicate when following it.', 'Der Verkehr auf der Vorfahrtstraße untereinander: es gilt rechts vor links bzw. Linksabbieger warten.'),
  S('z_strassenbahn', 'ZZ', 'Zusatz', 'Straßenbahn', 'Tram', 'Achtung Straßenbahn kreuzt oder hat Vorrang (meist mit 205 oder 206).', 'Watch for trams.'),
  S('z_parkscheibe', 'ZZ', 'Zusatz', 'Parkscheibe 2 Std.', 'Parking disc', 'Parken mit Parkscheibe höchstens 2 Stunden. Ankunftszeit auf die nächste halbe Stunde einstellen.', 'Max 2 h with parking disc.'),
  S('z_lkw', 'ZZ', 'Zusatz', 'Nur Lkw', 'Lorries', 'Das Hauptzeichen gilt nur für Lkw (Kfz über 3,5 t).', 'Applies to lorries only.'),
  S('z_unfall', 'ZZ', 'Zusatz', 'Unfall', 'Accident', 'Unter Gefahrzeichen 101: Unfallstelle voraus.', 'Accident ahead.'),
  S('z_ende', 'ZZ', 'Zusatz', 'Ende', 'End', 'Hier endet die Regelung des Hauptzeichens (z. B. Haltverbot).', 'Restriction ends here.'),

  // ───────── Markierungen ─────────
  S('m_durchgezogen', '295', 'Markierung', 'Fahrstreifenbegrenzung (durchgezogen)', 'Solid line', 'Nicht überfahren, auch nicht teilweise. Links davon nicht halten/parken, wenn zwischen Linie und Fahrbahnrand weniger als 3 m bleiben.', 'Do not cross. Not even partly.'),
  S('m_doppelt', '295', 'Markierung', 'Doppelte Fahrstreifenbegrenzung', 'Double solid line', 'Trennt die Fahrtrichtungen. Niemals überfahren.', 'Separates directions; never cross.'),
  S('m_einseitig', '296', 'Markierung', 'Einseitige Fahrstreifenbegrenzung', 'Solid + broken line', 'Von der gestrichelten Seite darf man überfahren, von der durchgezogenen Seite nicht.', 'May cross from the broken side only.'),
  S('m_leitlinie', '340', 'Markierung', 'Leitlinie (gestrichelt)', 'Broken line', 'Darf überfahren werden, wenn niemand gefährdet wird.', 'May be crossed if safe.'),
  S('m_haltlinie', '294', 'Markierung', 'Haltlinie', 'Stop line', 'Hier anhalten, wenn ein Zeichen (Stopp, Ampel, Polizei) das verlangt.', 'Stop here when required.'),
  S('m_wartelinie', '341', 'Markierung', 'Wartelinie', 'Give-way line', 'Hier ggf. warten, um Vorfahrt zu gewähren.', 'Wait here if needed to give way.'),
  S('m_haifisch', '342', 'Markierung', 'Haifischzähne', 'Shark teeth', 'Wie „Vorfahrt gewähren“: Vorfahrt beachten.', 'Same as give way.'),
  S('m_sperrflaeche', '298', 'Markierung', 'Sperrfläche', 'Hatched area', 'Darf nicht befahren werden – auch nicht zum Halten oder Parken.', 'Do not drive on it.'),
  S('m_zickzack', '299', 'Markierung', 'Grenzmarkierung für Halt- und Parkverbote', 'Zigzag line', 'Verbietet Halten/Parken in diesem Bereich (z. B. vor Haltestellen, Ausfahrten) oder verlängert/verkürzt ein Verbot.', 'No stopping/parking in this area.'),
  S('m_pfeil', '297', 'Markierung', 'Pfeilmarkierung', 'Lane arrows', 'Fahrtrichtung für den Fahrstreifen. Wer sich so eingeordnet hat, muss in Pfeilrichtung fahren.', 'Lane direction is mandatory once in the lane.'),
  S('m_zebra', '293', 'Markierung', 'Fußgängerüberweg (Zebrastreifen)', 'Zebra marking', 'Fußgänger haben Vorrang, wenn sie erkennbar über die Straße wollen. Nicht überholen, nicht davor halten (5 m).', 'Pedestrians have priority.'),
  S('m_gelb', '—', 'Markierung', 'Gelbe Markierung (Baustelle)', 'Yellow marking', 'Vorübergehende Markierung. Gilt vor den weißen Markierungen.', 'Temporary marking; overrides white.'),

  // ───────── Ampel & Polizei ─────────
  S('a_rot', '§ 37', 'Ampel', 'Rot', 'Red', 'Vor der Kreuzung bzw. Haltlinie anhalten.', 'Stop before the junction/stop line.', 'Rotlichtverstoß über 1 Sekunde: Fahrverbot.'),
  S('a_rotgelb', '§ 37', 'Ampel', 'Rot und Gelb', 'Red and amber', 'Gleich kommt Grün. Bereit machen, aber noch nicht losfahren.', 'Green comes next; do not go yet.'),
  S('a_gruen', '§ 37', 'Ampel', 'Grün', 'Green', 'Fahrt frei – aber beim Abbiegen auf Fußgänger und Gegenverkehr achten.', 'Go, but watch pedestrians when turning.'),
  S('a_gelb', '§ 37', 'Ampel', 'Gelb', 'Amber', 'Vor der Kreuzung auf das nächste Zeichen warten – wenn man noch sicher anhalten kann.', 'Stop if you can do so safely.'),
  S('a_gelbblink', '§ 38', 'Ampel', 'Gelbes Blinklicht', 'Flashing amber', 'Warnt: besonders vorsichtig fahren. Es gelten die Verkehrszeichen bzw. Vorfahrtregeln.', 'Caution; signs or priority rules apply.'),
  S('a_gruenpfeil', '720', 'Ampel', 'Grünpfeil-Schild', 'Green arrow plate', 'Bei Rot nach rechts abbiegen erlaubt – aber erst nach vollständigem Anhalten und ohne andere zu behindern.', 'Right turn on red after a full stop.', 'Leuchtender grüner Pfeil ≠ Blechschild: der leuchtende Pfeil erlaubt Abbiegen ohne Anhalten.'),
  S('a_pfeilampel', '§ 37', 'Ampel', 'Pfeil im Lichtzeichen', 'Arrow signal', 'Gilt nur für die Pfeilrichtung. Grüner Pfeil links: Linksabbiegen geschützt, Gegenverkehr hat Rot.', 'Applies to the arrow direction only.'),
  S('p_seite', '§ 36', 'Ampel', 'Polizei: Arme seitlich (Seite/Front zu dir)', 'Police: arms out', 'Wer den Beamten von vorn oder hinten sieht: Halt (wie Rot). Der Querverkehr (Seite) hat frei (wie Grün).', 'Facing front/back: stop. From the side: go.'),
  S('p_hoch', '§ 36', 'Ampel', 'Polizei: Arm hoch', 'Police: arm raised', 'Wie Gelb: vor der Kreuzung warten. Wer schon in der Kreuzung ist, muss sie räumen.', 'Like amber: wait; clear the junction if in it.'),

  // ───────── Kontrollleuchten ─────────
  S('k_oel', '—', 'Kontroll', 'Öldruck (rot)', 'Oil pressure', 'Öldruck zu niedrig. Sofort anhalten, Motor aus, Ölstand prüfen.', 'Low oil pressure – stop immediately.'),
  S('k_bremse', '—', 'Kontroll', 'Bremsanlage (rot)', 'Brake system', 'Handbremse angezogen oder Störung/zu wenig Bremsflüssigkeit. Nicht weiterfahren.', 'Parking brake on or brake fault.'),
  S('k_batterie', '—', 'Kontroll', 'Batterie/Ladekontrolle (rot)', 'Battery / charging', 'Lichtmaschine lädt nicht. Werkstatt aufsuchen, Verbraucher ausschalten.', 'Alternator not charging.'),
  S('k_kuehl', '—', 'Kontroll', 'Kühlmitteltemperatur (rot)', 'Coolant temperature', 'Motor überhitzt. Anhalten, Motor abkühlen lassen, Kühlmittel prüfen (nicht heiß öffnen!).', 'Engine overheating.'),
  S('k_airbag', '—', 'Kontroll', 'Airbag-Störung (rot)', 'Airbag fault', 'Airbag-System gestört – Airbag löst evtl. nicht aus. Werkstatt.', 'Airbag fault.'),
  S('k_gurt', '—', 'Kontroll', 'Gurtwarnung (rot)', 'Seat belt', 'Jemand ist nicht angeschnallt.', 'Seat belt not fastened.'),
  S('k_abs', '—', 'Kontroll', 'ABS (gelb)', 'ABS', 'ABS gestört. Normale Bremse funktioniert, aber Räder können blockieren.', 'ABS fault; brakes work but wheels can lock.'),
  S('k_motor', '—', 'Kontroll', 'Motorkontrolle (gelb)', 'Engine check', 'Störung an Motor/Abgasanlage. Bald Werkstatt; blinkt sie, langsam fahren.', 'Engine/emission fault.'),
  S('k_reifen', '—', 'Kontroll', 'Reifendruck (gelb)', 'Tyre pressure', 'Reifendruck zu niedrig. Druck prüfen.', 'Low tyre pressure.'),
  S('k_tank', '—', 'Kontroll', 'Kraftstoffreserve (gelb)', 'Low fuel', 'Tank fast leer – bald tanken.', 'Low fuel.', 'Auf der Autobahn ist Liegenbleiben wegen leerem Tank eine Ordnungswidrigkeit.'),
  S('k_esp', '—', 'Kontroll', 'ESP (gelb)', 'Stability control', 'Blinkt: ESP greift gerade ein (glatte Fahrbahn) – Fuß vom Gas. Leuchtet dauerhaft: Störung.', 'Flashing: ESP active. Constant: fault.'),
  S('k_vorgluehen', '—', 'Kontroll', 'Vorglühen (Diesel, gelb)', 'Glow plugs', 'Diesel: warten, bis die Leuchte erlischt, dann starten.', 'Diesel: wait until it goes out, then start.'),
  S('k_nebelschluss', '—', 'Kontroll', 'Nebelschlussleuchte (gelb)', 'Rear fog light', 'Nebelschlussleuchte ist an. Nur bei Sicht unter 50 m durch Nebel – dann max. 50 km/h.', 'Rear fog light on – only below 50 m visibility, max 50 km/h.'),
  S('k_abblendlicht', '—', 'Kontroll', 'Abblendlicht (grün)', 'Dipped beam', 'Abblendlicht eingeschaltet.', 'Dipped headlights on.'),
  S('k_fernlicht', '—', 'Kontroll', 'Fernlicht (blau)', 'Main beam', 'Fernlicht an. Bei Gegenverkehr oder Vorausfahrenden rechtzeitig abblenden.', 'High beam on – dip for others.'),
];
