import type { Reading } from './types';

const R = (r: Omit<Reading, 'gloss'> & { gloss?: Reading['gloss'] }): Reading => ({ gloss: {}, ...r });

export const READINGS2: Reading[] = [
  // ───────── A1 ─────────
  R({
    id: 'a1-familie', level: 'A1', title: 'Meine Familie', titleEn: 'My family', topic: 'relationships',
    sentences: [
      { de: 'Ich heiße Tom und bin 22 Jahre alt.', en: 'My name is Tom and I am 22 years old.' },
      { de: 'Meine Familie wohnt in Hamburg.', en: 'My family lives in Hamburg.' },
      { de: 'Mein Vater ist Ingenieur, und meine Mutter ist Ärztin.', en: 'My father is an engineer and my mother is a doctor.', note: 'No article before professions.' },
      { de: 'Ich habe eine Schwester und einen Bruder.', en: 'I have a sister and a brother.', note: 'haben + Akkusativ: einen Bruder (masc.).' },
      { de: 'Meine Schwester heißt Lisa und ist 16.', en: 'My sister is called Lisa and is 16.' },
      { de: 'Mein Bruder ist noch klein. Er ist erst sechs.', en: 'My brother is still little. He is only six.' },
      { de: 'Am Wochenende telefoniere ich mit meinen Eltern.', en: 'At the weekend I phone my parents.' },
    ],
    grammar: [
      { title: 'Possessive articles', text: 'mein Vater (m), meine Mutter (f), mein Kind (n), meine Eltern (pl). Akkusativ masculine: meinen / einen Bruder.' },
      { title: 'sein & haben', text: 'Ich bin 22 (I am 22). Ich habe eine Schwester.' },
    ],
    vocab: ['vater', 'mutter', 'schwester', 'bruder', 'eltern', 'familie'],
    questions: [
      { q: 'Wo wohnt Toms Familie?', options: ['In Berlin', 'In Hamburg', 'In Dresden'], answer: 1 },
      { q: 'Was ist Toms Mutter von Beruf?', options: ['Ingenieurin', 'Lehrerin', 'Ärztin'], answer: 2 },
      { q: 'Wie alt ist der Bruder?', options: ['Sechs', 'Sechzehn', 'Zweiundzwanzig'], answer: 0 },
    ],
  }),
  R({
    id: 'a1-tagesablauf', level: 'A1', title: 'Mein Tag', titleEn: 'My day', topic: 'daily',
    sentences: [
      { de: 'Ich stehe jeden Tag um sieben Uhr auf.', en: 'I get up at seven every day.', note: 'aufstehen is separable: stehe … auf.' },
      { de: 'Zum Frühstück trinke ich Tee und esse ein Brötchen.', en: 'For breakfast I drink tea and eat a roll.' },
      { de: 'Um acht Uhr fahre ich mit dem Bus zur Arbeit.', en: 'At eight I take the bus to work.' },
      { de: 'Ich arbeite in einem Büro.', en: 'I work in an office.' },
      { de: 'Mittags esse ich mit meinen Kollegen.', en: 'At lunchtime I eat with my colleagues.' },
      { de: 'Um fünf Uhr habe ich Feierabend.', en: 'At five I finish work.' },
      { de: 'Abends koche ich und sehe ein bisschen fern.', en: 'In the evening I cook and watch a bit of TV.', note: 'fernsehen: sehe … fern.' },
      { de: 'Um elf Uhr gehe ich ins Bett.', en: 'At eleven I go to bed.' },
    ],
    grammar: [
      { title: 'Time + verb second', text: '"Um acht Uhr fahre ich …", "Abends koche ich …" — the verb stays in position 2.' },
      { title: 'Separable verbs', text: 'aufstehen → ich stehe … auf; fernsehen → ich sehe … fern.' },
    ],
    vocab: ['aufstehen', 'fruehstueck', 'bus', 'buero', 'feierabend', 'kochen'],
    questions: [
      { q: 'Wann steht die Person auf?', options: ['Um sechs', 'Um sieben', 'Um acht'], answer: 1 },
      { q: 'Wie fährt die Person zur Arbeit?', options: ['Mit dem Auto', 'Mit dem Fahrrad', 'Mit dem Bus'], answer: 2 },
      { q: 'Was macht die Person abends?', options: ['Sie kocht und sieht fern.', 'Sie geht joggen.', 'Sie arbeitet.'], answer: 0 },
    ],
  }),
  R({
    id: 'a1-cafe', level: 'A1', title: 'Im Café', titleEn: 'At the café', topic: 'daily',
    sentences: [
      { de: 'Anna und Ben sind im Café.', en: 'Anna and Ben are at the café.' },
      { de: 'Der Kellner fragt: „Was möchten Sie trinken?“', en: 'The waiter asks: "What would you like to drink?"' },
      { de: 'Anna möchte einen Kaffee mit Milch.', en: 'Anna would like a coffee with milk.' },
      { de: 'Ben nimmt einen Tee und ein Stück Kuchen.', en: 'Ben has a tea and a piece of cake.' },
      { de: 'Der Kuchen ist sehr lecker.', en: 'The cake is very delicious.' },
      { de: 'Zusammen kostet das neun Euro fünfzig.', en: 'Together that costs nine euros fifty.' },
      { de: 'Ben bezahlt und gibt einen Euro Trinkgeld.', en: 'Ben pays and gives a one-euro tip.' },
    ],
    grammar: [
      { title: 'möchten', text: 'Polite wish: ich möchte, du möchtest, er/sie möchte, Sie möchten.' },
      { title: 'Akkusativ', text: 'einen Kaffee, einen Tee (masc.) — ein Stück (neut.) stays the same.' },
    ],
    vocab: ['kaffee', 'tee', 'kuchen', 'milch', 'trinkgeld', 'lecker'],
    questions: [
      { q: 'Was trinkt Anna?', options: ['Tee', 'Kaffee mit Milch', 'Wasser'], answer: 1 },
      { q: 'Was isst Ben?', options: ['Ein Brötchen', 'Kuchen', 'Nichts'], answer: 1 },
      { q: 'Wer bezahlt?', options: ['Anna', 'Ben', 'Der Kellner'], answer: 1 },
    ],
  }),

  // ───────── A2 ─────────
  R({
    id: 'a2-wochenende', level: 'A2', title: 'Ein Wochenende in Prag', titleEn: 'A weekend in Prague', topic: 'travel',
    sentences: [
      { de: 'Letztes Wochenende bin ich mit zwei Freunden nach Prag gefahren.', en: 'Last weekend I went to Prague with two friends.', note: 'Perfekt with sein: bin … gefahren.' },
      { de: 'Der Zug von Dresden nach Prag braucht nur gut zwei Stunden.', en: 'The train from Dresden to Prague takes just over two hours.' },
      { de: 'Am Samstag haben wir die Altstadt und die Karlsbrücke besichtigt.', en: 'On Saturday we visited the old town and the Charles Bridge.' },
      { de: 'Es war sehr voll, weil viele Touristen da waren.', en: 'It was very crowded because there were many tourists.' },
      { de: 'Am Abend haben wir in einem kleinen Restaurant gegessen.', en: 'In the evening we ate in a small restaurant.' },
      { de: 'Das Essen war lecker und nicht teuer.', en: 'The food was delicious and not expensive.' },
      { de: 'Am Sonntag sind wir spät aufgestanden und dann zurückgefahren.', en: 'On Sunday we got up late and then travelled back.' },
      { de: 'Ich möchte bald wieder nach Prag fahren.', en: 'I\'d like to go to Prague again soon.' },
    ],
    grammar: [
      { title: 'Perfekt: haben or sein?', text: 'Movement → sein (bin gefahren, sind aufgestanden). Other verbs → haben (haben besichtigt, haben gegessen).' },
      { title: 'weil', text: '"…, weil viele Touristen da waren." Verb at the end.' },
    ],
    vocab: ['zug', 'reise', 'sehenswuerdigkeit', 'besuchen', 'restaurant'],
    questions: [
      { q: 'Wie lange dauert die Zugfahrt?', options: ['Etwa eine Stunde', 'Gut zwei Stunden', 'Fünf Stunden'], answer: 1 },
      { q: 'Warum war es voll?', options: ['Weil Feiertag war', 'Weil viele Touristen da waren', 'Weil es regnete'], answer: 1 },
      { q: 'Wie war das Essen?', options: ['Teuer', 'Lecker und günstig', 'Nicht gut'], answer: 1 },
    ],
  }),
  R({
    id: 'a2-wg', level: 'A2', title: 'Das Leben in der WG', titleEn: 'Life in a shared flat', topic: 'university',
    sentences: [
      { de: 'Seit einem Jahr wohne ich in einer WG in Leipzig.', en: 'For a year I have been living in a shared flat in Leipzig.' },
      { de: 'Wir sind vier Leute: zwei Studentinnen, ein Student und ich.', en: 'We are four people: two (female) students, a student and me.' },
      { de: 'Jeder hat ein eigenes Zimmer, aber die Küche und das Bad teilen wir.', en: 'Everyone has their own room, but we share the kitchen and the bathroom.' },
      { de: 'Wir haben einen Putzplan, damit die Wohnung sauber bleibt.', en: 'We have a cleaning rota so that the flat stays clean.' },
      { de: 'Diese Woche muss ich das Bad putzen.', en: 'This week I have to clean the bathroom.' },
      { de: 'Manchmal kochen wir zusammen und essen am großen Tisch.', en: 'Sometimes we cook together and eat at the big table.' },
      { de: 'Das Leben in der WG ist günstig und selten langweilig.', en: 'Life in the shared flat is cheap and rarely boring.' },
    ],
    grammar: [
      { title: 'damit', text: '"…, damit die Wohnung sauber bleibt." — purpose clause, verb at the end.' },
      { title: 'Modal verb', text: '"Diese Woche muss ich das Bad putzen." — muss in position 2, putzen at the end.' },
    ],
    vocab: ['wg', 'kueche', 'bad', 'teilen', 'putzen', 'sauber'],
    questions: [
      { q: 'Wie viele Leute wohnen in der WG?', options: ['Zwei', 'Drei', 'Vier'], answer: 2 },
      { q: 'Was teilen die Mitbewohner?', options: ['Die Zimmer', 'Küche und Bad', 'Nichts'], answer: 1 },
      { q: 'Warum gibt es einen Putzplan?', options: ['Damit die Wohnung sauber bleibt', 'Weil der Vermieter es will', 'Weil es Spaß macht'], answer: 0 },
    ],
  }),
  R({
    id: 'a2-einkauf', level: 'A2', title: 'Einkaufen auf dem Wochenmarkt', titleEn: 'Shopping at the weekly market', topic: 'daily',
    sentences: [
      { de: 'Jeden Samstag gehe ich auf den Wochenmarkt.', en: 'Every Saturday I go to the weekly market.' },
      { de: 'Dort ist das Gemüse frischer als im Supermarkt.', en: 'There the vegetables are fresher than in the supermarket.', note: 'Comparative: frisch → frischer als.' },
      { de: 'Ich kaufe meistens Tomaten, Kartoffeln und Äpfel aus der Region.', en: 'I usually buy tomatoes, potatoes and apples from the region.' },
      { de: 'Die Verkäuferin am Käsestand kennt mich schon.', en: 'The saleswoman at the cheese stall already knows me.' },
      { de: 'Sie lässt mich immer zuerst probieren.', en: 'She always lets me try first.' },
      { de: 'Am Markt bezahlt man oft noch bar.', en: 'At the market people often still pay cash.' },
      { de: 'Deshalb hole ich vorher Geld am Automaten.', en: 'That\'s why I get money from the machine beforehand.', note: 'deshalb in position 1 → verb next.' },
    ],
    grammar: [
      { title: 'Comparative', text: 'frisch → frischer, billig → billiger, gut → besser. "als" = than.' },
      { title: 'deshalb', text: 'Adverb: "Deshalb hole ich …" — inversion, unlike weil.' },
    ],
    vocab: ['gemuese', 'frisch', 'kartoffel', 'probieren', 'bezahlen', 'deshalb'],
    questions: [
      { q: 'Warum geht die Person auf den Markt?', options: ['Es ist billiger.', 'Das Gemüse ist frischer.', 'Der Supermarkt ist geschlossen.'], answer: 1 },
      { q: 'Wie bezahlt man oft auf dem Markt?', options: ['Mit Karte', 'Bar', 'Mit dem Handy'], answer: 1 },
      { q: 'Was macht die Verkäuferin?', options: ['Sie lässt die Person probieren.', 'Sie gibt Rabatt.', 'Sie verkauft Fleisch.'], answer: 0 },
    ],
  }),
  R({
    id: 'a2-buergeramt', level: 'A2', title: 'Die Anmeldung', titleEn: 'Registering your address', topic: 'daily',
    sentences: [
      { de: 'Wer in Deutschland umzieht, muss sich innerhalb von zwei Wochen anmelden.', en: 'Anyone who moves in Germany must register within two weeks.' },
      { de: 'Das macht man beim Bürgeramt der Stadt.', en: 'You do that at the city\'s citizens\' office.' },
      { de: 'Zuerst braucht man einen Termin, den man online buchen kann.', en: 'First you need an appointment, which you can book online.' },
      { de: 'Man muss den Pass und die Wohnungsgeberbestätigung mitbringen.', en: 'You have to bring your passport and the landlord\'s confirmation.' },
      { de: 'Die Wohnungsgeberbestätigung bekommt man vom Vermieter.', en: 'You get the landlord\'s confirmation from the landlord.' },
      { de: 'Der Termin dauert meistens nur zehn Minuten.', en: 'The appointment usually only takes ten minutes.' },
      { de: 'Danach bekommt man eine Meldebescheinigung, die man oft braucht, zum Beispiel für die Bank.', en: 'Afterwards you get a registration certificate, which you often need, for example for the bank.' },
    ],
    grammar: [
      { title: '"man" + verb', text: '"man" = one / you (people in general): man braucht, man muss, man bekommt.' },
      { title: 'Relative clause', text: '"einen Termin, den man online buchen kann" — den refers to der Termin (Akkusativ).' },
    ],
    vocab: ['buergeramt', 'termin', 'anmeldung', 'pass', 'vermieter', 'bescheinigung'],
    questions: [
      { q: 'Bis wann muss man sich anmelden?', options: ['Innerhalb von zwei Wochen', 'Innerhalb eines Jahres', 'Sofort'], answer: 0 },
      { q: 'Was bekommt man vom Vermieter?', options: ['Den Pass', 'Die Wohnungsgeberbestätigung', 'Die Meldebescheinigung'], answer: 1 },
      { q: 'Wofür braucht man die Meldebescheinigung zum Beispiel?', options: ['Für die Bank', 'Für das Kino', 'Für den Supermarkt'], answer: 0 },
    ],
  }),
  R({
    id: 'a2-fahrrad', level: 'A2', title: 'Mit dem Fahrrad zur Uni', titleEn: 'Cycling to uni', topic: 'university',
    sentences: [
      { de: 'Viele Studierende in Dresden fahren mit dem Fahrrad zur Uni.', en: 'Many students in Dresden cycle to uni.' },
      { de: 'Das ist schneller als der Bus und kostet nichts.', en: 'That\'s faster than the bus and costs nothing.' },
      { de: 'Im Winter ist es aber manchmal sehr kalt und glatt.', en: 'In winter, though, it is sometimes very cold and slippery.' },
      { de: 'Dann nehmen viele lieber die Straßenbahn.', en: 'Then many prefer to take the tram.', note: 'lieber = preferably (comparative of gern).' },
      { de: 'Mit dem Semesterticket ist die Straßenbahn kostenlos.', en: 'With the semester ticket the tram is free.' },
      { de: 'Wichtig ist ein gutes Schloss, denn leider werden oft Fahrräder gestohlen.', en: 'A good lock is important, because unfortunately bikes are often stolen.', note: 'Passive: werden … gestohlen.' },
    ],
    grammar: [
      { title: 'gern – lieber – am liebsten', text: '"nehmen lieber die Straßenbahn" = prefer to take the tram.' },
      { title: 'denn', text: '"…, denn leider werden oft Fahrräder gestohlen." — denn keeps main-clause word order.' },
    ],
    vocab: ['fahrrad', 'strassenbahn', 'kostenlos', 'schnell', 'denn'],
    questions: [
      { q: 'Warum fahren viele mit dem Fahrrad?', options: ['Es ist schneller und kostenlos.', 'Es gibt keinen Bus.', 'Es ist Pflicht.'], answer: 0 },
      { q: 'Was machen viele im Winter?', options: ['Sie bleiben zu Hause.', 'Sie nehmen die Straßenbahn.', 'Sie fahren Auto.'], answer: 1 },
      { q: 'Warum braucht man ein gutes Schloss?', options: ['Weil Fahrräder oft gestohlen werden', 'Weil es Vorschrift ist', 'Weil es schön aussieht'], answer: 0 },
    ],
  }),

  // ───────── B1 ─────────
  R({
    id: 'b1-vorstellungsgespraech', level: 'B1', title: 'Das erste Vorstellungsgespräch', titleEn: 'The first job interview', topic: 'work',
    sentences: [
      { de: 'Letzte Woche hatte Sara ihr erstes Vorstellungsgespräch auf Deutsch.', en: 'Last week Sara had her first job interview in German.' },
      { de: 'Sie hatte sich gut vorbereitet und typische Fragen geübt.', en: 'She had prepared well and practised typical questions.', note: 'Plusquamperfekt: hatte … vorbereitet.' },
      { de: 'Trotzdem war sie sehr nervös, als sie das Büro betrat.', en: 'Nevertheless she was very nervous when she entered the office.' },
      { de: 'Die Personalchefin war aber freundlich und stellte zuerst einfache Fragen.', en: 'The HR manager was friendly, though, and asked simple questions first.' },
      { de: 'Sara erzählte von ihrem Studium und ihrem Praktikum in einer Baufirma.', en: 'Sara talked about her studies and her internship at a construction company.' },
      { de: 'Bei der Frage nach ihren Schwächen musste sie kurz überlegen.', en: 'At the question about her weaknesses she had to think for a moment.' },
      { de: 'Am Ende fragte sie, wie ein typischer Arbeitstag aussieht.', en: 'At the end she asked what a typical working day looks like.', note: 'Indirect question: verb at the end.' },
      { de: 'Zwei Tage später bekam sie eine Zusage.', en: 'Two days later she received an offer.' },
    ],
    grammar: [
      { title: 'Präteritum in stories', text: 'Written narratives use Präteritum: war, stellte, erzählte, musste, fragte, bekam.' },
      { title: 'Indirect questions', text: '"…, wie ein typischer Arbeitstag aussieht." — question word + verb at the end.' },
    ],
    vocab: ['vorstellungsgespraech', 'nervoes', 'praktikum', 'schwaeche', 'trotzdem', 'erzaehlen'],
    questions: [
      { q: 'Wie hatte Sara sich vorbereitet?', options: ['Gar nicht', 'Sie hatte typische Fragen geübt.', 'Sie hatte einen Kurs besucht.'], answer: 1 },
      { q: 'Bei welcher Frage musste sie überlegen?', options: ['Nach dem Gehalt', 'Nach ihren Schwächen', 'Nach ihrem Studium'], answer: 1 },
      { q: 'Wie ging die Geschichte aus?', options: ['Sie bekam eine Absage.', 'Sie bekam eine Zusage.', 'Sie wartet noch.'], answer: 1 },
    ],
  }),
  R({
    id: 'b1-muelltrennung', level: 'B1', title: 'Mülltrennung in Deutschland', titleEn: 'Waste separation in Germany', topic: 'culture',
    sentences: [
      { de: 'Wer neu nach Deutschland kommt, ist oft überrascht, wie viele Mülltonnen es gibt.', en: 'Anyone who is new to Germany is often surprised how many bins there are.' },
      { de: 'Papier kommt in die blaue Tonne, Verpackungen aus Plastik in die gelbe.', en: 'Paper goes in the blue bin, plastic packaging in the yellow one.' },
      { de: 'Für Essensreste gibt es die braune Biotonne.', en: 'For food waste there is the brown organic bin.' },
      { de: 'Glas bringt man zum Container und sortiert es nach Farben.', en: 'You take glass to the container and sort it by colour.' },
      { de: 'Für viele Flaschen bekommt man außerdem Pfand zurück, wenn man sie im Supermarkt abgibt.', en: 'For many bottles you also get a deposit back if you return them at the supermarket.' },
      { de: 'Das System ist zwar kompliziert, aber es hilft, Rohstoffe zu sparen.', en: 'The system is complicated, admittedly, but it helps to save raw materials.', note: 'zwar … aber; helfen + zu-infinitive.' },
      { de: 'Wenn man sich nicht an die Regeln hält, können die Nachbarn sich beschweren.', en: 'If you don\'t follow the rules, the neighbours may complain.' },
    ],
    grammar: [
      { title: 'wer … (der)', text: '"Wer neu nach Deutschland kommt, ist …" = Anyone who …' },
      { title: 'zwar … aber', text: 'Concedes a point, then contrasts it.' },
    ],
    vocab: ['muell', 'trennen', 'regel', 'sparen', 'sich-beschweren', 'ueberrascht'],
    questions: [
      { q: 'Wohin kommt Papier?', options: ['In die gelbe Tonne', 'In die blaue Tonne', 'In die braune Tonne'], answer: 1 },
      { q: 'Was ist Pfand?', options: ['Geld zurück für Flaschen', 'Eine Strafe', 'Eine Mülltonne'], answer: 0 },
      { q: 'Was ist ein Vorteil des Systems?', options: ['Es ist einfach.', 'Es spart Rohstoffe.', 'Es kostet nichts.'], answer: 1 },
    ],
  }),
  R({
    id: 'b1-homeoffice', level: 'B1', title: 'Homeoffice: Fluch oder Segen?', titleEn: 'Working from home: curse or blessing?', topic: 'work',
    sentences: [
      { de: 'Seit einigen Jahren arbeiten viele Menschen regelmäßig im Homeoffice.', en: 'For some years many people have worked from home regularly.' },
      { de: 'Ein großer Vorteil ist, dass man keine Zeit für den Arbeitsweg verliert.', en: 'A big advantage is that you lose no time commuting.' },
      { de: 'Außerdem kann man sich die Arbeitszeit oft freier einteilen.', en: 'Moreover you can often organise your working hours more freely.' },
      { de: 'Andererseits fehlt vielen der Kontakt zu den Kollegen.', en: 'On the other hand, many people miss contact with colleagues.' },
      { de: 'Manche haben auch Probleme, Arbeit und Freizeit zu trennen.', en: 'Some also have problems separating work and free time.' },
      { de: 'Viele Firmen setzen deshalb auf ein Modell, bei dem man zwei oder drei Tage pro Woche ins Büro kommt.', en: 'That\'s why many companies opt for a model in which you come to the office two or three days a week.' },
      { de: 'Meiner Meinung nach ist diese Mischung die beste Lösung.', en: 'In my opinion this mix is the best solution.' },
    ],
    grammar: [
      { title: 'Giving opinions', text: '"Meiner Meinung nach ist …" (verb next), "Ein Vorteil ist, dass …", "Andererseits …".' },
      { title: 'Relative clause with preposition', text: '"ein Modell, bei dem man …" — preposition + relative pronoun.' },
    ],
    vocab: ['homeoffice', 'vorteil', 'nachteil', 'ausserdem', 'loesung', 'meiner-meinung-nach'],
    questions: [
      { q: 'Was ist ein Vorteil des Homeoffice?', options: ['Man spart den Arbeitsweg.', 'Man verdient mehr.', 'Man hat mehr Kollegen.'], answer: 0 },
      { q: 'Was fehlt vielen Menschen?', options: ['Geld', 'Der Kontakt zu Kollegen', 'Ein Computer'], answer: 1 },
      { q: 'Welches Modell nutzen viele Firmen?', options: ['Nur Büro', 'Nur Homeoffice', 'Eine Mischung'], answer: 2 },
    ],
  }),
  R({
    id: 'b1-arzttermin', level: 'B1', title: 'Warum es so schwer ist, einen Facharzttermin zu bekommen', titleEn: 'Why it\'s so hard to get a specialist appointment', topic: 'daily',
    sentences: [
      { de: 'Wer in Deutschland zum Facharzt will, braucht oft viel Geduld.', en: 'Anyone who wants to see a specialist in Germany often needs a lot of patience.' },
      { de: 'Wartezeiten von mehreren Wochen sind keine Seltenheit.', en: 'Waiting times of several weeks are not unusual.' },
      { de: 'Normalerweise geht man zuerst zum Hausarzt, der einen dann überweist.', en: 'Normally you first go to the GP, who then refers you.' },
      { de: 'Mit einer dringenden Überweisung bekommt man schneller einen Termin.', en: 'With an urgent referral you get an appointment more quickly.' },
      { de: 'Es gibt auch eine Servicestelle, die bei der Terminsuche hilft.', en: 'There is also a service centre that helps with finding appointments.' },
      { de: 'Im Notfall sollte man natürlich nicht warten, sondern die 112 anrufen.', en: 'In an emergency, of course, you shouldn\'t wait but call 112.' },
    ],
    grammar: [
      { title: 'Comparative adverb', text: 'schnell → schneller: "bekommt man schneller einen Termin".' },
      { title: 'nicht …, sondern …', text: 'Correction after a negation: "nicht warten, sondern anrufen".' },
    ],
    vocab: ['facharzt', 'hausarzt', 'wartezeit', 'ueberweisung', 'notfall', 'geduld'],
    questions: [
      { q: 'Wohin geht man normalerweise zuerst?', options: ['Ins Krankenhaus', 'Zum Hausarzt', 'Zur Apotheke'], answer: 1 },
      { q: 'Was hilft, schneller einen Termin zu bekommen?', options: ['Eine dringende Überweisung', 'Ein Brief an den Arzt', 'Nichts'], answer: 0 },
      { q: 'Was soll man im Notfall tun?', options: ['Warten', 'Die 112 anrufen', 'Eine E-Mail schreiben'], answer: 1 },
    ],
  }),
  R({
    id: 'b1-feste', level: 'B1', title: 'Weihnachten in Dresden', titleEn: 'Christmas in Dresden', topic: 'culture',
    sentences: [
      { de: 'Der Dresdner Striezelmarkt gilt als einer der ältesten Weihnachtsmärkte Deutschlands.', en: 'Dresden\'s Striezelmarkt is considered one of Germany\'s oldest Christmas markets.', note: 'gelten als = to be considered.' },
      { de: 'Er findet seit dem 15. Jahrhundert statt.', en: 'It has taken place since the 15th century.' },
      { de: 'Im Dezember kommen Besucher aus der ganzen Welt, um Glühwein zu trinken und Stollen zu probieren.', en: 'In December visitors come from all over the world to drink mulled wine and try Stollen.', note: 'um … zu = in order to.' },
      { de: 'Der Dresdner Christstollen ist ein schwerer Kuchen mit Rosinen und viel Butter.', en: 'Dresden Christstollen is a heavy cake with raisins and lots of butter.' },
      { de: 'Für viele Familien gehört auch der Adventskranz zur Tradition.', en: 'For many families the Advent wreath is also part of the tradition.' },
      { de: 'Am Heiligabend, dem 24. Dezember, bekommen die Kinder ihre Geschenke.', en: 'On Christmas Eve, 24 December, the children get their presents.' },
    ],
    grammar: [
      { title: 'Superlative', text: '"einer der ältesten Weihnachtsmärkte" = one of the oldest — Genitiv plural.' },
      { title: 'um … zu', text: 'Purpose with the same subject: "um Glühwein zu trinken".' },
    ],
    vocab: ['tradition', 'geschenk', 'kuchen', 'probieren', 'kultur'],
    questions: [
      { q: 'Seit wann gibt es den Striezelmarkt?', options: ['Seit 1990', 'Seit dem 15. Jahrhundert', 'Seit 1900'], answer: 1 },
      { q: 'Was ist Stollen?', options: ['Ein Getränk', 'Ein Kuchen', 'Ein Geschenk'], answer: 1 },
      { q: 'Wann bekommen die Kinder Geschenke?', options: ['Am 6. Dezember', 'Am 24. Dezember', 'Am 31. Dezember'], answer: 1 },
    ],
  }),
  R({
    id: 'b1-sprachenlernen', level: 'B1', title: 'Tipps zum Sprachenlernen', titleEn: 'Tips for learning languages', topic: 'university',
    sentences: [
      { de: 'Viele Menschen glauben, dass man für Sprachen ein besonderes Talent braucht.', en: 'Many people believe you need a special talent for languages.' },
      { de: 'Forscher sind jedoch der Meinung, dass regelmäßiges Üben wichtiger ist.', en: 'Researchers, however, are of the opinion that regular practice is more important.' },
      { de: 'Es ist besser, jeden Tag zwanzig Minuten zu lernen als einmal pro Woche drei Stunden.', en: 'It\'s better to study twenty minutes every day than three hours once a week.' },
      { de: 'Neue Wörter merkt man sich leichter, wenn man sie in Sätzen lernt.', en: 'You remember new words more easily if you learn them in sentences.' },
      { de: 'Außerdem hilft es, die Wörter nach einigen Tagen zu wiederholen.', en: 'It also helps to review the words after a few days.' },
      { de: 'Wer keine Angst vor Fehlern hat, spricht schneller fließend.', en: 'Anyone who isn\'t afraid of mistakes becomes fluent faster.' },
    ],
    grammar: [
      { title: 'zu-infinitive', text: '"Es ist besser, … zu lernen", "Es hilft, … zu wiederholen".' },
      { title: 'wenn-clause', text: '"…, wenn man sie in Sätzen lernt." Verb at the end.' },
    ],
    vocab: ['sich-merken', 'wiederholen', 'fehler', 'angst', 'ueben'],
    questions: [
      { q: 'Was ist laut Forschern wichtiger als Talent?', options: ['Regelmäßiges Üben', 'Ein gutes Buch', 'Ein Lehrer'], answer: 0 },
      { q: 'Wie merkt man sich Wörter leichter?', options: ['Allein', 'In Sätzen', 'Nur mit Bildern'], answer: 1 },
      { q: 'Wer spricht schneller fließend?', options: ['Wer keine Angst vor Fehlern hat', 'Wer viel liest', 'Wer nicht spricht'], answer: 0 },
    ],
  }),

  // ───────── B2 ─────────
  R({
    id: 'b2-fachkraefte', level: 'B2', title: 'Fachkräftemangel: Deutschland sucht Personal', titleEn: 'Skills shortage: Germany is looking for staff', topic: 'news',
    sentences: [
      { de: 'In zahlreichen Branchen bleiben Stellen monatelang unbesetzt.', en: 'In numerous sectors, positions remain unfilled for months.' },
      { de: 'Besonders gesucht werden Pflegekräfte, Handwerker und IT-Spezialisten.', en: 'Nurses, tradespeople and IT specialists are particularly sought after.', note: 'Passive with inversion for emphasis.' },
      { de: 'Als Hauptursache gilt der demografische Wandel: Mehr Menschen gehen in Rente, als junge nachkommen.', en: 'The main cause is considered to be demographic change: more people are retiring than young people are coming through.' },
      { de: 'Um gegenzusteuern, hat die Regierung die Einwanderung von Fachkräften erleichtert.', en: 'To counteract this, the government has made immigration easier for skilled workers.' },
      { de: 'Kritiker bemängeln allerdings, dass die Anerkennung ausländischer Abschlüsse noch immer zu lange dauert.', en: 'Critics complain, however, that the recognition of foreign qualifications still takes too long.' },
      { de: 'Zudem seien gute Deutschkenntnisse häufig eine größere Hürde als die Bürokratie, heißt es aus der Wirtschaft.', en: 'Moreover, good German skills are often a bigger hurdle than bureaucracy, according to business representatives.', note: 'Konjunktiv I "seien" = reported speech.' },
      { de: 'Viele Unternehmen bieten daher inzwischen selbst Sprachkurse an.', en: 'Many companies therefore now offer language courses themselves.' },
    ],
    grammar: [
      { title: 'Passive & emphasis', text: '"Besonders gesucht werden Pflegekräfte …" — the participle is fronted for emphasis.' },
      { title: 'Reported speech', text: '"…, seien … eine größere Hürde, heißt es" — Konjunktiv I distances the writer from the claim.' },
    ],
    vocab: ['fachkraeftemangel', 'branche', 'fachkraft', 'buerokratie', 'zudem', 'anbieten'],
    questions: [
      { q: 'Was gilt als Hauptursache?', options: ['Der demografische Wandel', 'Zu hohe Löhne', 'Die Digitalisierung'], answer: 0 },
      { q: 'Was kritisieren Kritiker?', options: ['Zu viele Sprachkurse', 'Die lange Anerkennung von Abschlüssen', 'Zu viel Einwanderung'], answer: 1 },
      { q: 'Wie reagieren viele Unternehmen?', options: ['Sie bieten Sprachkurse an.', 'Sie zahlen weniger.', 'Sie schließen.'], answer: 0 },
    ],
  }),
  R({
    id: 'b2-verkehrswende', level: 'B2', title: 'Die Verkehrswende in der Stadt', titleEn: 'The transport transition in cities', topic: 'news',
    sentences: [
      { de: 'Immer mehr Städte versuchen, den Autoverkehr in den Innenstädten zu reduzieren.', en: 'More and more cities are trying to reduce car traffic in city centres.' },
      { de: 'Statt neuer Parkplätze entstehen breitere Radwege und Fußgängerzonen.', en: 'Instead of new car parks, wider cycle paths and pedestrian zones are being built.' },
      { de: 'Befürworter argumentieren, dass dadurch die Luft sauberer und die Lebensqualität höher werde.', en: 'Supporters argue that this makes the air cleaner and the quality of life higher.' },
      { de: 'Einzelhändler befürchten hingegen, dass weniger Kunden in die Innenstadt kommen.', en: 'Retailers, on the other hand, fear that fewer customers will come into the city centre.' },
      { de: 'Studien zeigen jedoch, dass Fußgänger und Radfahrer häufiger einkaufen, wenn auch in kleineren Mengen.', en: 'Studies show, however, that pedestrians and cyclists shop more often, albeit in smaller quantities.' },
      { de: 'Entscheidend für den Erfolg ist ein gut ausgebauter öffentlicher Nahverkehr.', en: 'A well-developed public transport system is crucial for success.', note: 'Participle as adjective: gut ausgebaut.' },
      { de: 'Ohne attraktive Alternativen lassen sich die wenigsten Menschen vom Auto abbringen.', en: 'Without attractive alternatives, very few people can be persuaded to give up their cars.', note: 'sich lassen + infinitive = can be done.' },
    ],
    grammar: [
      { title: 'statt + Genitiv', text: '"Statt neuer Parkplätze" — Genitiv plural without article.' },
      { title: 'Passive alternative', text: '"lassen sich … abbringen" = can be dissuaded.' },
    ],
    vocab: ['verkehr', 'lebensqualitaet', 'hingegen', 'jedoch', 'entstehen', 'oeffentlich'],
    questions: [
      { q: 'Was entsteht statt Parkplätzen?', options: ['Neue Straßen', 'Radwege und Fußgängerzonen', 'Einkaufszentren'], answer: 1 },
      { q: 'Was befürchten Einzelhändler?', options: ['Weniger Kunden', 'Höhere Mieten', 'Mehr Lärm'], answer: 0 },
      { q: 'Was ist laut Text entscheidend?', options: ['Billiges Benzin', 'Ein guter Nahverkehr', 'Mehr Autos'], answer: 1 },
    ],
  }),
  R({
    id: 'b2-ki-studium', level: 'B2', title: 'Künstliche Intelligenz im Studium', titleEn: 'AI in university studies', topic: 'technology',
    sentences: [
      { de: 'Seit KI-Programme Texte in Sekunden verfassen können, diskutieren Hochschulen über neue Regeln.', en: 'Since AI programs can write texts in seconds, universities have been discussing new rules.' },
      { de: 'Einige Dozenten verbieten den Einsatz vollständig, andere fördern ihn ausdrücklich.', en: 'Some lecturers ban its use completely, others explicitly encourage it.' },
      { de: 'Unumstritten ist, dass Studierende lernen müssen, die Ergebnisse kritisch zu prüfen.', en: 'What is undisputed is that students must learn to check the results critically.' },
      { de: 'KI-Systeme liefern nämlich nicht immer korrekte Informationen und erfinden mitunter Quellen.', en: 'AI systems don\'t always deliver correct information, you see, and sometimes invent sources.' },
      { de: 'Viele Universitäten verlangen daher, dass der Einsatz von KI in Hausarbeiten offengelegt wird.', en: 'Many universities therefore require the use of AI in term papers to be disclosed.' },
      { de: 'Langfristig dürften sich auch die Prüfungsformen verändern, etwa hin zu mündlichen Prüfungen.', en: 'In the long term, examination formats are also likely to change, for example towards oral exams.', note: '"dürften" = probably (assumption).' },
    ],
    grammar: [
      { title: 'Subordinate clause first', text: '"Seit KI-Programme … können, diskutieren Hochschulen …" — verb, comma, verb.' },
      { title: 'Epistemic "dürfte"', text: 'dürfte/dürften expresses a probable assumption: "dürften sich … verändern".' },
    ],
    vocab: ['kuenstliche-intelligenz', 'verbieten', 'foerdern', 'quelle', 'kritisch', 'veraendern'],
    questions: [
      { q: 'Was ist unumstritten?', options: ['KI ist verboten.', 'Studierende müssen Ergebnisse kritisch prüfen.', 'KI ist immer korrekt.'], answer: 1 },
      { q: 'Was verlangen viele Universitäten?', options: ['Dass der KI-Einsatz offengelegt wird', 'Dass niemand KI nutzt', 'Dass KI bezahlt wird'], answer: 0 },
      { q: 'Wie könnten sich Prüfungen verändern?', options: ['Mehr mündliche Prüfungen', 'Keine Prüfungen mehr', 'Nur Online-Prüfungen'], answer: 0 },
    ],
  }),
  R({
    id: 'b2-wasser', level: 'B2', title: 'Wasserknappheit trotz Regen', titleEn: 'Water scarcity despite rain', topic: 'news',
    sentences: [
      { de: 'Auch in Deutschland ist Wasser keine unbegrenzte Ressource mehr.', en: 'Even in Germany water is no longer an unlimited resource.' },
      { de: 'Nach mehreren trockenen Sommern sind die Grundwasserspiegel in manchen Regionen deutlich gesunken.', en: 'After several dry summers, groundwater levels have fallen significantly in some regions.' },
      { de: 'Kurze, heftige Regenfälle helfen dabei kaum, da der trockene Boden das Wasser nicht schnell genug aufnehmen kann.', en: 'Short, heavy rainfall hardly helps, since the dry soil can\'t absorb the water quickly enough.', note: 'da = since (cause), verb at the end.' },
      { de: 'Stattdessen fließt es oberflächlich ab und verursacht mitunter Überschwemmungen.', en: 'Instead it runs off on the surface and sometimes causes flooding.' },
      { de: 'Experten fordern deshalb, Flächen zu entsiegeln und Regenwasser gezielt zu speichern.', en: 'Experts therefore call for surfaces to be unsealed and rainwater to be stored in a targeted way.' },
      { de: 'Darüber hinaus sollten Landwirtschaft und Industrie effizienter mit Wasser umgehen.', en: 'Beyond that, agriculture and industry should use water more efficiently.' },
    ],
    grammar: [
      { title: 'da (cause)', text: '"da der trockene Boden … nicht … aufnehmen kann" — like weil, verb at the end; often used for known reasons.' },
      { title: 'fordern + zu-infinitive', text: '"fordern, Flächen zu entsiegeln und Regenwasser … zu speichern".' },
    ],
    vocab: ['ressource', 'sinken', 'verursachen', 'darueber-hinaus', 'effizient', 'fordern'],
    questions: [
      { q: 'Warum helfen kurze Regenfälle kaum?', options: ['Der Boden nimmt das Wasser nicht schnell genug auf.', 'Es regnet zu wenig.', 'Das Wasser ist schmutzig.'], answer: 0 },
      { q: 'Was fordern Experten?', options: ['Mehr Flächen versiegeln', 'Flächen entsiegeln und Regenwasser speichern', 'Weniger Regen'], answer: 1 },
      { q: 'Was passiert mit dem Wasser stattdessen?', options: ['Es verdunstet sofort.', 'Es fließt oberflächlich ab.', 'Es wird getrunken.'], answer: 1 },
    ],
  }),
  R({
    id: 'b2-ehrenamt', level: 'B2', title: 'Ehrenamt: Wenn Arbeit kein Geld bringt', titleEn: 'Volunteering: when work doesn\'t pay', topic: 'culture',
    sentences: [
      { de: 'Fast jeder dritte Erwachsene in Deutschland engagiert sich ehrenamtlich.', en: 'Almost one in three adults in Germany volunteers.' },
      { de: 'Ob bei der Feuerwehr, im Sportverein oder in der Flüchtlingshilfe – ohne Freiwillige würde vieles nicht funktionieren.', en: 'Whether in the fire brigade, a sports club or refugee support – without volunteers many things wouldn\'t work.', note: 'Konjunktiv II: würde … funktionieren.' },
      { de: 'Die Motive sind vielfältig: Manche wollen etwas zurückgeben, andere suchen Kontakte oder sammeln Erfahrungen.', en: 'The motives are diverse: some want to give something back, others look for contacts or gain experience.' },
      { de: 'Gerade für Zugezogene kann ein Ehrenamt eine Chance sein, die Sprache zu üben und Anschluss zu finden.', en: 'Especially for newcomers, volunteering can be a chance to practise the language and make connections.' },
      { de: 'Allerdings klagen viele Vereine über Nachwuchsprobleme, weil junge Leute sich ungern langfristig binden.', en: 'However, many clubs complain about recruiting problems, because young people are reluctant to commit long-term.' },
      { de: 'Flexible Angebote, bei denen man sich projektbezogen engagieren kann, gewinnen daher an Bedeutung.', en: 'Flexible offers, where you can get involved on a project basis, are therefore gaining in importance.' },
    ],
    grammar: [
      { title: 'Konjunktiv II for hypotheses', text: '"ohne Freiwillige würde vieles nicht funktionieren" — hypothetical consequence.' },
      { title: 'Relative clause with preposition', text: '"Angebote, bei denen man …" — dative plural relative pronoun denen.' },
    ],
    vocab: ['sich-engagieren', 'verein', 'vielfaeltig', 'allerdings', 'erfahrung', 'bedeutung'],
    questions: [
      { q: 'Wie viele Erwachsene engagieren sich?', options: ['Fast jeder dritte', 'Jeder zehnte', 'Fast alle'], answer: 0 },
      { q: 'Welches Problem haben viele Vereine?', options: ['Zu viel Geld', 'Nachwuchsprobleme', 'Zu viele Mitglieder'], answer: 1 },
      { q: 'Was gewinnt an Bedeutung?', options: ['Flexible, projektbezogene Angebote', 'Lange Verträge', 'Bezahlte Jobs'], answer: 0 },
    ],
  }),
  R({
    id: 'b2-email', level: 'B2', title: 'Eine formelle Beschwerde-E-Mail', titleEn: 'A formal complaint email', topic: 'work',
    sentences: [
      { de: 'Sehr geehrte Damen und Herren,', en: 'Dear Sir or Madam,' },
      { de: 'hiermit möchte ich mich über die Lieferung meiner Bestellung vom 3. März beschweren.', en: 'I am writing to complain about the delivery of my order of 3 March.' },
      { de: 'Obwohl mir eine Lieferung innerhalb von drei Werktagen zugesagt worden war, erhielt ich das Paket erst nach zwei Wochen.', en: 'Although delivery within three working days had been promised to me, I only received the parcel after two weeks.', note: 'Plusquamperfekt passive: zugesagt worden war.' },
      { de: 'Darüber hinaus war das Gerät beschädigt und lässt sich nicht einschalten.', en: 'In addition, the device was damaged and cannot be switched on.' },
      { de: 'Ich bitte Sie daher, mir umgehend ein Ersatzgerät zuzusenden oder den Kaufpreis zu erstatten.', en: 'I therefore ask you to send me a replacement device immediately or refund the purchase price.' },
      { de: 'Für eine Rückmeldung bis zum 20. März wäre ich Ihnen dankbar.', en: 'I would be grateful for a reply by 20 March.', note: 'Konjunktiv II for politeness.' },
      { de: 'Mit freundlichen Grüßen', en: 'Kind regards' },
    ],
    grammar: [
      { title: 'Formal register', text: 'hiermit, daher, umgehend, darüber hinaus, wäre ich Ihnen dankbar — typical of formal letters.' },
      { title: 'zu-infinitive with separable verbs', text: '"zuzusenden" (zusenden), "zu erstatten".' },
    ],
    vocab: ['mit-freundlichen-gruessen', 'sehr-geehrte-damen-und-herren', 'rueckmeldung', 'darueber-hinaus', 'beschwerde'],
    questions: [
      { q: 'Worüber beschwert sich die Person?', options: ['Über einen Kellner', 'Über eine späte Lieferung und ein kaputtes Gerät', 'Über die Miete'], answer: 1 },
      { q: 'Was fordert die Person?', options: ['Ein Ersatzgerät oder das Geld zurück', 'Einen Rabatt', 'Nichts'], answer: 0 },
      { q: 'Bis wann erwartet sie eine Antwort?', options: ['Bis zum 3. März', 'Bis zum 20. März', 'Sofort'], answer: 1 },
    ],
  }),
];
