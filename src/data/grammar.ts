import { GRAMMAR2 } from './grammar2';
import { LEVELS, type GrammarLesson } from './types';

const GRAMMAR1: GrammarLesson[] = [
  {
    id: 'artikel', title: 'Der, die, das — gender & articles', titleDe: 'Artikel und Genus', level: 'A1', tag: 'artikel',
    summary: 'Every German noun has a grammatical gender. Learn the article with the noun — always.',
    sections: [
      { h: 'Three genders', text: 'Masculine nouns take "der", feminine "die", neuter "das". In the plural, all genders use "die". Gender is grammatical, not biological: das Mädchen (the girl) is neuter.',
        table: [['', 'definite', 'indefinite'], ['masculine', 'der Tisch', 'ein Tisch'], ['feminine', 'die Lampe', 'eine Lampe'], ['neuter', 'das Buch', 'ein Buch'], ['plural', 'die Bücher', '— Bücher']] },
      { h: 'Reliable patterns', text: 'Feminine: -ung, -heit, -keit, -schaft, -ion, -tät, -ei (die Zeitung, die Freiheit). Neuter: -chen, -lein, -ment, -um, nominalised infinitives (das Mädchen, das Essen). Masculine: days, months, seasons, -ling, -ismus, -er for agents (der Montag, der Lehrer).' },
      { h: 'Compounds', text: 'The LAST part decides the gender.', examples: [['das Haus + die Tür → die Haustür', 'house + door → the front door'], ['die Kranken + das Haus → das Krankenhaus', 'the sick + house → the hospital']] },
    ],
    exercises: [
      { type: 'mc', q: '___ Zeitung liegt auf dem Tisch.', options: ['Der', 'Die', 'Das'], answer: 1, explain: 'Nouns ending in -ung are always feminine: die Zeitung.' },
      { type: 'mc', q: '___ Mädchen spielt Fußball.', options: ['Der', 'Die', 'Das'], answer: 2, explain: '-chen nouns are always neuter: das Mädchen.' },
      { type: 'mc', q: 'Which article for "Bahnhof" (Bahn + Hof)?', options: ['der', 'die', 'das'], answer: 0, explain: 'The last part, der Hof, decides: der Bahnhof.' },
      { type: 'fill', q: '___ Freiheit ist wichtig.', answer: ['die'], explain: '-heit → feminine: die Freiheit.' },
    ],
  },
  {
    id: 'praesens', title: 'Present tense conjugation', titleDe: 'Präsens', level: 'A1', tag: 'present',
    summary: 'Stem + ending. Learn the regular endings, then the irregular stem changes.',
    sections: [
      { h: 'Regular endings', text: 'Remove -en from the infinitive to get the stem, then add the ending.',
        table: [['', 'lernen', 'arbeiten'], ['ich', 'lerne', 'arbeite'], ['du', 'lernst', 'arbeitest'], ['er/sie/es', 'lernt', 'arbeitet'], ['wir', 'lernen', 'arbeiten'], ['ihr', 'lernt', 'arbeitet'], ['sie/Sie', 'lernen', 'arbeiten']] },
      { h: 'Stem-vowel changes', text: 'Some strong verbs change the vowel in the du and er/sie/es forms only: e→i (essen → isst), e→ie (lesen → liest), a→ä (fahren → fährt).', examples: [['Du fährst zu schnell.', 'You drive too fast.'], ['Er liest jeden Tag die Zeitung.', 'He reads the newspaper every day.']] },
      { h: 'sein & haben', text: 'Irregular and essential.', table: [['', 'sein', 'haben'], ['ich', 'bin', 'habe'], ['du', 'bist', 'hast'], ['er/sie/es', 'ist', 'hat'], ['wir', 'sind', 'haben'], ['ihr', 'seid', 'habt'], ['sie/Sie', 'sind', 'haben']] },
    ],
    exercises: [
      { type: 'fill', q: 'Du ___ (sprechen) sehr gut Deutsch.', answer: ['sprichst'], explain: 'sprechen: e→i in du/er forms → du sprichst.' },
      { type: 'fill', q: 'Er ___ (fahren) mit dem Bus.', answer: ['fährt'], explain: 'fahren: a→ä → er fährt.' },
      { type: 'mc', q: 'Ihr ___ sehr nett.', options: ['sind', 'seid', 'seit'], answer: 1, explain: 'ihr seid. "seit" is the preposition "since".' },
      { type: 'fill', q: 'Sie (she) ___ (arbeiten) bei Bosch.', answer: ['arbeitet'], explain: 'Stems ending in -t/-d add an extra -e-: sie arbeitet.' },
    ],
  },
  {
    id: 'wortstellung', title: 'Word order: verb second', titleDe: 'Satzstellung (V2)', level: 'A1', tag: 'wortstellung',
    summary: 'In main clauses, the conjugated verb is always the second element.',
    sections: [
      { h: 'The V2 rule', text: 'Position 1 can be the subject, a time phrase, an object — anything. The conjugated verb is position 2. If something other than the subject is in position 1, the subject moves right after the verb (inversion).',
        examples: [['Ich lerne heute Deutsch.', 'I am learning German today.'], ['Heute lerne ich Deutsch.', 'Today I am learning German.'], ['Deutsch lerne ich heute.', 'German is what I\'m learning today.']] },
      { h: 'The sentence bracket', text: 'With two-part verbs (modal + infinitive, Perfekt, separable verbs), part one is in position 2 and part two goes to the END.', examples: [['Ich muss morgen früh aufstehen.', 'I have to get up early tomorrow.'], ['Wir haben gestern einen Film gesehen.', 'We watched a film yesterday.']] },
      { h: 'Time – Manner – Place', text: 'The typical middle-field order is TeKaMoLo: temporal, causal, modal, local.', examples: [['Ich fahre morgen wegen der Arbeit mit dem Zug nach Berlin.', 'Tomorrow I\'m going to Berlin by train for work.']] },
    ],
    exercises: [
      { type: 'order', words: ['ich', 'Morgen', 'nach', 'fahre', 'Hamburg'], answer: 'Morgen fahre ich nach Hamburg|Ich fahre morgen nach Hamburg', en: 'Tomorrow I\'m going to Hamburg.', explain: 'Time in position 1 → verb in 2 → subject in 3.' },
      { type: 'mc', q: 'Which is correct?', options: ['Am Montag ich habe frei.', 'Am Montag habe ich frei.', 'Am Montag frei habe ich.'], answer: 1, explain: 'Verb second: Am Montag (1) habe (2) ich (3).' },
      { type: 'order', words: ['Deutsch', 'kann', 'gut', 'sprechen', 'sie'], answer: 'sie kann gut Deutsch sprechen|sie kann Deutsch gut sprechen|Deutsch kann sie gut sprechen', en: 'She can speak German well.', explain: 'Modal in position 2, infinitive at the end.' },
    ],
  },
  {
    id: 'akkusativ', title: 'Akkusativ — the direct object', titleDe: 'Der Akkusativ', level: 'A2', tag: 'akkusativ',
    summary: 'Only masculine articles change in the Akkusativ: der → den, ein → einen.',
    sections: [
      { h: 'Forms', text: 'Ask "wen oder was?" to find the Akkusativ object.', table: [['', 'Nom', 'Akk'], ['masc', 'der / ein', 'den / einen'], ['fem', 'die / eine', 'die / eine'], ['neut', 'das / ein', 'das / ein'], ['plural', 'die', 'die']] },
      { h: 'Akkusativ prepositions', text: 'durch, für, gegen, ohne, um, bis, entlang (after the noun) always take Akkusativ. Mnemonic: "DOGFU".', examples: [['Das Geschenk ist für meinen Bruder.', 'The present is for my brother.'], ['Wir gehen durch den Park.', 'We walk through the park.']] },
      { h: 'Typical verbs', text: 'haben, brauchen, kaufen, sehen, besuchen, anrufen, es gibt + Akk.', examples: [['Es gibt einen Supermarkt in der Nähe.', 'There\'s a supermarket nearby.'], ['Ich rufe dich später an.', 'I\'ll call you later.']] },
    ],
    exercises: [
      { type: 'fill', q: 'Ich brauche ___ (ein) neuen Laptop.', answer: ['einen'], explain: 'der Laptop → Akkusativ masculine: einen.' },
      { type: 'mc', q: 'Wir gehen durch ___ Wald.', options: ['der', 'dem', 'den'], answer: 2, explain: '"durch" always takes Akkusativ → den Wald.' },
      { type: 'mc', q: 'Hast du ___ Zeit?', options: ['ein', 'keine', 'keinen'], answer: 1, explain: 'die Zeit is feminine: Akkusativ = keine.' },
      { type: 'fill', q: 'Es gibt ___ (ein) Problem.', answer: ['ein'], explain: 'das Problem is neuter: Akkusativ = ein.' },
    ],
  },
  {
    id: 'dativ', title: 'Dativ — the indirect object', titleDe: 'Der Dativ', level: 'A2', tag: 'dativ',
    summary: 'The Dativ marks the receiver ("to whom?") and follows many common prepositions.',
    sections: [
      { h: 'Forms', text: 'Ask "wem?". All genders change. Plural nouns add -n.', table: [['', 'Nom', 'Dat'], ['masc', 'der / ein', 'dem / einem'], ['fem', 'die / eine', 'der / einer'], ['neut', 'das / ein', 'dem / einem'], ['plural', 'die Kinder', 'den Kindern']] },
      { h: 'Dativ prepositions', text: 'aus, bei, mit, nach, seit, von, zu, gegenüber — always Dativ. Contractions: zu + dem = zum, zu + der = zur, bei + dem = beim, von + dem = vom.', examples: [['Ich fahre mit dem Fahrrad zur Uni.', 'I cycle to uni.'], ['Seit einem Jahr wohne ich in Dresden.', 'I\'ve been living in Dresden for a year.']] },
      { h: 'Dativ verbs', text: 'helfen, danken, gefallen, gehören, antworten, gratulieren take a Dativ object.', examples: [['Kannst du mir helfen?', 'Can you help me?'], ['Das Buch gehört meiner Schwester.', 'The book belongs to my sister.']] },
      { h: 'Two objects', text: 'Person (Dativ) usually before thing (Akkusativ): "Ich gebe dem Kind das Buch." With pronouns: Akkusativ pronoun first: "Ich gebe es ihm."' },
    ],
    exercises: [
      { type: 'mc', q: 'Ich wohne bei ___ Eltern.', options: ['meine', 'meinen', 'meiner'], answer: 1, explain: '"bei" + Dativ plural → meinen Eltern.' },
      { type: 'fill', q: 'Ich helfe ___ (der) Frau.', answer: ['der'], explain: '"helfen" takes Dativ; feminine Dativ = der.' },
      { type: 'mc', q: 'Wir fahren ___ Bahnhof.', options: ['zu der', 'zum', 'zur'], answer: 1, explain: 'der Bahnhof → zu + dem = zum.' },
      { type: 'fill', q: 'Seit ___ (ein) Monat lerne ich Deutsch.', answer: ['einem'], explain: '"seit" + Dativ; der Monat → einem Monat.' },
      { type: 'mc', q: 'Das gefällt ___ sehr.', options: ['mich', 'mir', 'ich'], answer: 1, explain: '"gefallen" takes Dativ → mir.' },
    ],
  },
  {
    id: 'modalverben', title: 'Modal verbs', titleDe: 'Modalverben', level: 'A2', tag: 'modal',
    summary: 'können, müssen, dürfen, sollen, wollen, mögen/möchten — with the infinitive at the end.',
    sections: [
      { h: 'Meanings', text: 'können = can; müssen = must/have to; dürfen = may/be allowed; sollen = should/supposed to; wollen = want; möchten = would like.' },
      { h: 'Conjugation', text: 'ich and er/sie/es forms are identical and have no ending.', table: [['', 'können', 'müssen', 'dürfen', 'wollen'], ['ich', 'kann', 'muss', 'darf', 'will'], ['du', 'kannst', 'musst', 'darfst', 'willst'], ['er/sie/es', 'kann', 'muss', 'darf', 'will'], ['wir', 'können', 'müssen', 'dürfen', 'wollen']] },
      { h: 'Watch out', text: '"nicht müssen" = not necessary; "nicht dürfen" = forbidden.', examples: [['Du musst nicht kommen.', 'You don\'t have to come.'], ['Hier darf man nicht parken.', 'You\'re not allowed to park here.']] },
    ],
    exercises: [
      { type: 'order', words: ['ich', 'heute', 'muss', 'lange', 'arbeiten'], answer: 'ich muss heute lange arbeiten|heute muss ich lange arbeiten', en: 'I have to work late today.', explain: 'Modal in position 2, infinitive at the end.' },
      { type: 'mc', q: 'In der Bibliothek ___ man nicht laut sprechen.', options: ['muss', 'darf', 'will'], answer: 1, explain: 'Prohibition = nicht dürfen.' },
      { type: 'fill', q: 'Er ___ (können) sehr gut kochen.', answer: ['kann'], explain: 'er kann — no ending.' },
    ],
  },
  {
    id: 'trennbar', title: 'Separable & inseparable verbs', titleDe: 'Trennbare und untrennbare Verben', level: 'A2', tag: 'trennbar',
    summary: 'Prefixes like an-, auf-, ein-, mit- split off and go to the end. be-, ver-, er-, ent- never do.',
    sections: [
      { h: 'Separable', text: 'Stressed prefixes (an, auf, aus, ein, mit, vor, zu, zurück, weg …) jump to the end of a main clause. In Perfekt, ge- goes between: angerufen.', examples: [['Der Zug kommt um 8 Uhr an.', 'The train arrives at 8.'], ['Ich habe meine Mutter angerufen.', 'I called my mother.']] },
      { h: 'Inseparable', text: 'Unstressed prefixes be-, emp-, ent-, er-, ge-, miss-, ver-, zer- stay attached and take no ge- in Perfekt.', examples: [['Ich verstehe das nicht.', 'I don\'t understand that.'], ['Sie hat mir alles erklärt.', 'She explained everything to me.']] },
      { h: 'In subordinate clauses', text: 'The verb is joined again at the end: "…, weil der Zug um 8 Uhr ankommt."' },
    ],
    exercises: [
      { type: 'order', words: ['auf', 'Ich', 'um', 'sieben', 'stehe'], answer: 'Ich stehe um sieben auf|Um sieben stehe ich auf', en: 'I get up at seven.', explain: 'aufstehen splits: stehe … auf.' },
      { type: 'mc', q: 'Perfekt of "verkaufen":', options: ['hat geverkauft', 'hat verkauft', 'hat vergekauft'], answer: 1, explain: 'ver- is inseparable → no ge-: verkauft.' },
      { type: 'fill', q: 'Perfekt: Wir haben gestern ___ (einkaufen).', answer: ['eingekauft'], explain: 'Separable: ein-ge-kauft.' },
    ],
  },
  {
    id: 'perfekt', title: 'Perfekt & Präteritum', titleDe: 'Perfekt und Präteritum', level: 'A2', tag: 'perfekt',
    summary: 'Spoken German uses Perfekt; written narratives use Präteritum.',
    sections: [
      { h: 'Perfekt = haben/sein + Partizip II', text: 'Most verbs use "haben". Verbs of movement or change of state without a direct object use "sein" (gehen, fahren, kommen, aufstehen, werden, bleiben, sein).', examples: [['Ich habe Pizza gegessen.', 'I ate pizza.'], ['Wir sind nach Prag gefahren.', 'We drove to Prague.']] },
      { h: 'Partizip II', text: 'Weak verbs: ge- + stem + -t (gemacht). Strong verbs: ge- + (changed) stem + -en (getrunken). Verbs in -ieren: no ge- (studiert).' },
      { h: 'Präteritum', text: 'Used in writing, and in speech for sein, haben, modals and es gibt: war, hatte, konnte, musste, gab.', examples: [['Gestern war ich müde.', 'Yesterday I was tired.'], ['Ich konnte nicht schlafen.', 'I couldn\'t sleep.']] },
    ],
    exercises: [
      { type: 'mc', q: 'Ich ___ gestern spät nach Hause gekommen.', options: ['habe', 'bin', 'war'], answer: 1, explain: 'kommen = movement → sein.' },
      { type: 'fill', q: 'Er hat Informatik ___ (studieren).', answer: ['studiert'], explain: '-ieren verbs have no ge-.' },
      { type: 'mc', q: 'Which is most natural in speech?', options: ['Ich habe gestern müde gewesen.', 'Ich war gestern müde.', 'Ich bin gestern müde.'], answer: 1, explain: 'With "sein", Germans prefer Präteritum in speech: Ich war …' },
      { type: 'fill', q: 'Wir ___ (trinken, Perfekt: aux) Kaffee getrunken.', answer: ['haben'], explain: 'trinken takes haben.' },
    ],
  },
  {
    id: 'wechselpraep', title: 'Two-way prepositions', titleDe: 'Wechselpräpositionen', level: 'A2', tag: 'wechselpraep',
    summary: 'an, auf, hinter, in, neben, über, unter, vor, zwischen: Wo? → Dativ, Wohin? → Akkusativ.',
    sections: [
      { h: 'Location vs. direction', text: 'If there is movement towards a destination (wohin?), use Akkusativ. If something is located somewhere (wo?), use Dativ.', examples: [['Ich lege das Buch auf den Tisch.', 'I put the book on the table. (wohin → Akk)'], ['Das Buch liegt auf dem Tisch.', 'The book is lying on the table. (wo → Dat)']] },
      { h: 'Verb pairs', text: 'legen/liegen, stellen/stehen, setzen/sitzen, hängen (trans.)/hängen (intrans.). The first of each pair = Akk, the second = Dat.' },
    ],
    exercises: [
      { type: 'mc', q: 'Wir gehen heute in ___ Kino.', options: ['dem', 'das', 'der'], answer: 1, explain: 'Direction (wohin?) → Akk: in das = ins Kino.' },
      { type: 'mc', q: 'Das Bild hängt an ___ Wand.', options: ['die', 'der', 'den'], answer: 1, explain: 'Location → Dativ; die Wand → der Wand.' },
      { type: 'fill', q: 'Ich stelle die Flasche in ___ (der) Kühlschrank.', answer: ['den'], explain: 'stellen = direction → Akk: den Kühlschrank.' },
    ],
  },
  {
    id: 'nebensatz', title: 'Subordinate clauses', titleDe: 'Nebensätze', level: 'B1', tag: 'nebensatz',
    summary: 'weil, dass, obwohl, wenn, als, ob, während … send the conjugated verb to the end.',
    sections: [
      { h: 'Verb to the end', text: 'In a subordinate clause, the conjugated verb is the last element. A comma always separates it from the main clause.', examples: [['Ich lerne Deutsch, weil ich in Deutschland studiere.', 'I learn German because I study in Germany.'], ['Ich weiß nicht, ob er heute kommt.', 'I don\'t know whether he\'s coming today.']] },
      { h: 'Subordinate clause first', text: 'The whole clause counts as position 1, so the main clause starts with the verb: verb, comma, verb.', examples: [['Wenn ich Zeit habe, rufe ich dich an.', 'If I have time, I\'ll call you.'], ['Obwohl es regnet, gehen wir spazieren.', 'Although it\'s raining, we\'re going for a walk.']] },
      { h: 'wenn vs. als', text: '"als" for a single event in the past; "wenn" for present/future or repeated past events.', examples: [['Als ich Kind war, wohnte ich in Lahore.', 'When I was a child, I lived in Lahore.'], ['Immer wenn ich ihn sah, lachte er.', 'Whenever I saw him, he laughed.']] },
      { h: 'Modal/Perfekt in the clause', text: 'The conjugated verb goes after the infinitive/participle: "…, weil ich arbeiten muss." "…, dass er gekommen ist."' },
    ],
    exercises: [
      { type: 'order', words: ['weil', 'ich', 'bin', 'müde'], answer: 'weil ich müde bin', en: 'because I am tired', explain: 'Conjugated verb at the end.' },
      { type: 'mc', q: '___ ich in Berlin war, habe ich das Museum besucht.', options: ['Wenn', 'Als', 'Ob'], answer: 1, explain: 'Single past event → als.' },
      { type: 'mc', q: 'Choose the correct sentence:', options: ['Ich glaube, dass er hat recht.', 'Ich glaube, dass er recht hat.', 'Ich glaube, dass hat er recht.'], answer: 1, explain: 'dass-clause: verb at the end.' },
      { type: 'order', words: ['Obwohl', 'teuer', 'ist,', 'es', 'kaufe', 'ich', 'es'], answer: 'Obwohl es teuer ist, kaufe ich es', en: 'Although it is expensive, I\'m buying it.', explain: 'Subordinate clause first → main clause starts with the verb.' },
      { type: 'fill', q: 'Ich weiß, dass du kommen ___ (können).', answer: ['kannst'], explain: 'Modal at the very end of the subordinate clause.' },
    ],
  },
  {
    id: 'adjendungen', title: 'Adjective endings', titleDe: 'Adjektivdeklination', level: 'B1', tag: 'adjendungen',
    summary: 'Adjectives before a noun take endings that depend on article type, gender and case.',
    sections: [
      { h: 'After der/die/das (weak)', text: 'Mostly -en; -e only in Nominativ singular (all genders) and Akkusativ singular fem./neut.', examples: [['der neue Kollege', 'the new colleague'], ['mit dem neuen Kollegen', 'with the new colleague']] },
      { h: 'After ein/kein/mein (mixed)', text: 'Where the article shows no gender ending, the adjective takes it: ein neuer Laptop (m), ein neues Handy (n), eine neue Wohnung (f). Otherwise -en in Dativ and in Akkusativ masculine.' ,
        table: [['', 'masc', 'fem', 'neut'], ['Nom', 'ein guter Wein', 'eine gute Idee', 'ein gutes Buch'], ['Akk', 'einen guten Wein', 'eine gute Idee', 'ein gutes Buch'], ['Dat', 'einem guten Wein', 'einer guten Idee', 'einem guten Buch']] },
      { h: 'No article (strong)', text: 'The adjective carries the article\'s ending: guter Wein, frische Milch, kaltes Wasser, mit kaltem Wasser.' },
    ],
    exercises: [
      { type: 'fill', q: 'Das ist ein gut___ Restaurant.', answer: ['es', 'gutes'], explain: 'Neuter, Nominativ, after "ein" → -es.' },
      { type: 'mc', q: 'Ich trinke gern kalt___ Wasser.', options: ['-e', '-en', '-es'], answer: 2, explain: 'No article, neuter, Akk → -es: kaltes Wasser.' },
      { type: 'mc', q: 'Wir wohnen in einer klein___ Wohnung.', options: ['-e', '-en', '-er'], answer: 1, explain: 'Dativ after "einer" → -en.' },
      { type: 'fill', q: 'Der neu___ Chef ist nett.', answer: ['e', 'neue'], explain: 'After der, Nominativ singular → -e.' },
    ],
  },
  {
    id: 'relativsatz', title: 'Relative clauses', titleDe: 'Relativsätze', level: 'B1', tag: 'relativsatz',
    summary: 'der/die/das as relative pronouns — gender from the noun, case from the role in the clause.',
    sections: [
      { h: 'How it works', text: 'The relative pronoun takes its gender and number from the noun it refers to, and its case from its function inside the relative clause. Verb goes to the end.', examples: [['Der Mann, der dort steht, ist mein Professor.', 'The man who is standing there is my professor.'], ['Der Mann, den ich gestern getroffen habe, …', 'The man whom I met yesterday …']] },
      { h: 'Forms', text: 'Same as definite articles except Dativ plural (denen) and Genitiv (dessen, deren).', table: [['', 'm', 'f', 'n', 'pl'], ['Nom', 'der', 'die', 'das', 'die'], ['Akk', 'den', 'die', 'das', 'die'], ['Dat', 'dem', 'der', 'dem', 'denen'], ['Gen', 'dessen', 'deren', 'dessen', 'deren']] },
      { h: 'With prepositions', text: 'The preposition comes first: "die Stadt, in der ich wohne".' },
    ],
    exercises: [
      { type: 'mc', q: 'Das ist die Frau, ___ ich geholfen habe.', options: ['die', 'der', 'den'], answer: 1, explain: 'helfen + Dativ; feminine Dativ → der.' },
      { type: 'mc', q: 'Die Studenten, mit ___ ich lerne, sind nett.', options: ['den', 'die', 'denen'], answer: 2, explain: 'mit + Dativ plural → denen.' },
      { type: 'fill', q: 'Das Buch, ___ ich lese, ist spannend.', answer: ['das'], explain: 'Neuter, Akkusativ object → das.' },
    ],
  },
  {
    id: 'genitiv', title: 'Genitiv', titleDe: 'Der Genitiv', level: 'B2', tag: 'genitiv',
    summary: 'Possession and formal prepositions: des/der + -(e)s on masculine/neuter nouns.',
    sections: [
      { h: 'Forms', text: 'masc/neut: des + noun-(e)s (des Mannes, des Kindes); fem/plural: der (der Frau, der Kinder).', examples: [['Das ist das Auto meines Vaters.', 'That\'s my father\'s car.'], ['die Meinung der Studierenden', 'the students\' opinion']] },
      { h: 'Genitiv prepositions', text: 'wegen, trotz, während, statt, innerhalb, außerhalb, aufgrund, hinsichtlich, infolge. In speech, wegen/trotz/während often take Dativ, but Genitiv is standard in writing.', examples: [['Wegen des Streiks fällt der Zug aus.', 'Because of the strike the train is cancelled.'], ['Trotz des Regens gingen wir spazieren.', 'Despite the rain we went for a walk.']] },
      { h: 'Spoken alternative', text: '"von + Dativ" replaces the Genitiv in casual speech: das Auto von meinem Vater.' },
    ],
    exercises: [
      { type: 'mc', q: 'Trotz ___ Wetters fahren wir los.', options: ['dem schlechten', 'des schlechten', 'das schlechte'], answer: 1, explain: 'trotz + Genitiv: des schlechten Wetters.' },
      { type: 'fill', q: 'Das ist das Büro ___ (die) Professorin.', answer: ['der'], explain: 'Feminine Genitiv → der.' },
      { type: 'mc', q: 'Innerhalb ___ Woche', options: ['einer', 'eine', 'einem'], answer: 0, explain: 'innerhalb + Genitiv; feminine → einer.' },
    ],
  },
  {
    id: 'passiv', title: 'Passive voice', titleDe: 'Passiv', level: 'B2', tag: 'passiv',
    summary: 'werden + Partizip II. Focus on the action, not the actor.',
    sections: [
      { h: 'Vorgangspassiv', text: 'Present: wird + Partizip II. Präteritum: wurde + Partizip II. Perfekt: ist + Partizip II + worden.', examples: [['Das Haus wird renoviert.', 'The house is being renovated.'], ['Der Brief wurde gestern geschickt.', 'The letter was sent yesterday.'], ['Die Daten sind analysiert worden.', 'The data has been analysed.']] },
      { h: 'Agent', text: 'von + Dativ for people, durch + Akkusativ for means/causes.', examples: [['Das Projekt wird von Frau Weber geleitet.', 'The project is led by Ms Weber.']] },
      { h: 'With modal verbs', text: 'Modal + Partizip II + werden (at the end).', examples: [['Der Antrag muss bis Freitag eingereicht werden.', 'The application must be submitted by Friday.']] },
      { h: 'Zustandspassiv', text: 'sein + Partizip II describes a resulting state: "Die Tür ist geschlossen." (The door is closed.)' },
    ],
    exercises: [
      { type: 'mc', q: 'Die Ergebnisse ___ morgen veröffentlicht.', options: ['werden', 'sind', 'haben'], answer: 0, explain: 'Present passive: werden + Partizip II.' },
      { type: 'fill', q: 'Das Formular muss unterschrieben ___.', answer: ['werden'], explain: 'Modal passive: … unterschrieben werden.' },
      { type: 'mc', q: 'Perfekt passive: Die Brücke ist 1990 gebaut ___.', options: ['geworden', 'worden', 'werden'], answer: 1, explain: 'In the passive Perfekt, "worden" (without ge-) is used.' },
      { type: 'order', words: ['wurde', 'Das', 'gestern', 'repariert', 'Auto'], answer: 'Das Auto wurde gestern repariert|Gestern wurde das Auto repariert', en: 'The car was repaired yesterday.', explain: 'wurde in position 2, Partizip II at the end.' },
    ],
  },
  {
    id: 'konjunktiv2', title: 'Konjunktiv II', titleDe: 'Konjunktiv II', level: 'B2', tag: 'konjunktiv2',
    summary: 'Wishes, polite requests, hypotheticals: würde + infinitive, or wäre/hätte/könnte.',
    sections: [
      { h: 'Forms', text: 'Most verbs: würde + infinitive. Common verbs have their own forms: sein → wäre, haben → hätte, können → könnte, müssen → müsste, dürfen → dürfte, werden → würde, wissen → wüsste.', examples: [['Ich würde gern nach Wien fahren.', 'I would like to go to Vienna.'], ['Wenn ich Zeit hätte, würde ich mitkommen.', 'If I had time, I would come along.']] },
      { h: 'Politeness', text: 'Könnten Sie …? Hätten Sie …? Würden Sie …? are standard in shops, offices and emails.', examples: [['Könnten Sie mir bitte helfen?', 'Could you please help me?'], ['Ich hätte gern einen Kaffee.', 'I\'d like a coffee.']] },
      { h: 'Past', text: 'hätte/wäre + Partizip II.', examples: [['Wenn ich das gewusst hätte, wäre ich früher gekommen.', 'If I had known that, I would have come earlier.']] },
    ],
    exercises: [
      { type: 'mc', q: 'Wenn ich reich ___, würde ich reisen.', options: ['bin', 'wäre', 'war'], answer: 1, explain: 'Hypothetical → Konjunktiv II: wäre.' },
      { type: 'fill', q: '___ Sie mir bitte das Salz geben? (können)', answer: ['Könnten'], explain: 'Polite request: Könnten Sie …?' },
      { type: 'mc', q: 'If I had known… →', options: ['Wenn ich das gewusst hätte', 'Wenn ich das wüsste hätte', 'Wenn ich das gewusst würde'], answer: 0, explain: 'Past Konjunktiv II: hätte + Partizip II.' },
    ],
  },
  {
    id: 'konjunktiv1', title: 'Konjunktiv I — reported speech', titleDe: 'Konjunktiv I (indirekte Rede)', level: 'C1', tag: 'konjunktiv1',
    summary: 'News and academic texts use Konjunktiv I to report what others said without endorsing it.',
    sections: [
      { h: 'Forms', text: 'Stem + -e endings: er habe, er komme, er könne; sein is special: er sei, sie seien. If Konjunktiv I looks like the indicative (mostly plural), use Konjunktiv II instead.', examples: [['Der Minister sagte, er sei nicht informiert worden.', 'The minister said he had not been informed.'], ['Sie behauptet, sie habe keine Zeit.', 'She claims she has no time.']] },
      { h: 'Replacement rule', text: '"Sie sagen, sie haben keine Zeit" is ambiguous (looks like indicative) → "Sie sagen, sie hätten keine Zeit."' },
      { h: 'Past', text: 'habe/sei + Partizip II: "Er sagte, er habe den Bericht gelesen."' },
    ],
    exercises: [
      { type: 'mc', q: 'Laut Bericht ___ die Lage stabil.', options: ['ist', 'sei', 'wäre'], answer: 1, explain: 'Reported speech, 3rd person singular → sei.' },
      { type: 'fill', q: 'Er sagt, er ___ (haben) keine Zeit.', answer: ['habe'], explain: 'Konjunktiv I: er habe.' },
      { type: 'mc', q: 'Die Studenten sagen, sie ___ keine Informationen. (haben)', options: ['haben', 'hätten', 'habe'], answer: 1, explain: 'Konj. I "haben" = indicative → replace with Konj. II "hätten".' },
    ],
  },
];

export const GRAMMAR: GrammarLesson[] = [...GRAMMAR1, ...GRAMMAR2].sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level));

export const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR.map((g) => [g.id, g]));
export const TAG_LABEL: Record<string, string> = { ...Object.fromEntries(GRAMMAR.map((g) => [g.tag, g.title])), passiv: 'Passive voice' };
