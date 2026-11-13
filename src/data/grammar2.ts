import type { GrammarLesson } from './types';

export const GRAMMAR2: GrammarLesson[] = [
  {
    id: 'reflexiv', title: 'Reflexive verbs', titleDe: 'Reflexive Verben', level: 'A2', tag: 'reflexiv',
    summary: 'Verbs like sich freuen, sich waschen: the subject acts on itself — the pronoun changes with the person.',
    sections: [
      { h: 'Forms', text: 'Most reflexive verbs use the Akkusativ pronoun. With an extra direct object (sich die Hände waschen) the pronoun becomes Dativ — that only shows in ich/du.',
        table: [['', 'Akkusativ', 'Dativ'], ['ich', 'mich', 'mir'], ['du', 'dich', 'dir'], ['er/sie/es', 'sich', 'sich'], ['wir', 'uns', 'uns'], ['ihr', 'euch', 'euch'], ['sie/Sie', 'sich', 'sich']] },
      { h: 'Position', text: 'In main clauses the pronoun comes right after the conjugated verb (or after the subject if it follows the verb).', examples: [['Ich freue mich auf das Wochenende.', 'I\'m looking forward to the weekend.'], ['Heute erholen wir uns.', 'Today we\'re resting.'], ['Ich wasche mir die Hände.', 'I wash my hands.']] },
      { h: 'Common verbs + prepositions', text: 'sich freuen auf (+Akk, future) / über (+Akk, present), sich interessieren für, sich ärgern über, sich erinnern an, sich gewöhnen an, sich kümmern um, sich bewerben um.' },
    ],
    exercises: [
      { type: 'fill', q: 'Ich interessiere ___ für Musik.', answer: ['mich'], explain: 'ich → mich (Akkusativ).' },
      { type: 'mc', q: 'Wir treffen ___ um acht.', options: ['sich', 'uns', 'euch'], answer: 1, explain: 'wir → uns.' },
      { type: 'mc', q: 'Ich putze ___ die Zähne.', options: ['mich', 'mir', 'sich'], answer: 1, explain: 'With a separate direct object (die Zähne) → Dativ: mir.' },
      { type: 'fill', q: 'Freust du ___ auf die Ferien?', answer: ['dich'], explain: 'du → dich.' },
    ],
  },
  {
    id: 'zuinfinitiv', title: 'zu + infinitive, um … zu', titleDe: 'Infinitiv mit zu', level: 'B1', tag: 'zuinfinitiv',
    summary: 'Ich habe keine Lust, zu lernen. — um … zu (purpose), ohne … zu, statt … zu.',
    sections: [
      { h: 'After certain verbs & phrases', text: 'versuchen, vergessen, anfangen, aufhören, Lust haben, Zeit haben, es ist wichtig … + zu + infinitive at the end. Separable verbs: zu goes inside (anzurufen).', examples: [['Ich habe vergessen, dich anzurufen.', 'I forgot to call you.'], ['Es ist schwer, eine Wohnung zu finden.', 'It\'s hard to find a flat.']] },
      { h: 'No zu after modals', text: 'Modal verbs, werden, lassen, and gehen/sehen/hören take the bare infinitive: Ich muss lernen (not "zu lernen").' },
      { h: 'um … zu / ohne … zu / statt … zu', text: 'um … zu = in order to; ohne … zu = without …ing; statt … zu = instead of …ing. Same subject in both clauses — otherwise use damit / ohne dass / statt dass.', examples: [['Ich lerne Deutsch, um in Deutschland zu arbeiten.', 'I\'m learning German in order to work in Germany.'], ['Er ging, ohne sich zu verabschieden.', 'He left without saying goodbye.'], ['Statt zu lernen, sieht sie fern.', 'Instead of studying, she watches TV.']] },
    ],
    exercises: [
      { type: 'mc', q: 'Ich habe keine Zeit, ___ .', options: ['zu kochen', 'kochen', 'um kochen'], answer: 0, explain: '"keine Zeit haben" + zu + infinitive.' },
      { type: 'fill', q: 'Vergiss nicht, mich ___ (anrufen).', answer: ['anzurufen'], explain: 'Separable verb: zu goes between prefix and stem → anzurufen.' },
      { type: 'mc', q: 'Ich spare, ___ ein Auto zu kaufen.', options: ['damit', 'um', 'ohne'], answer: 1, explain: 'Purpose + same subject → um … zu.' },
      { type: 'mc', q: 'Ich muss heute ___ .', options: ['zu arbeiten', 'arbeiten', 'um arbeiten'], answer: 1, explain: 'No zu after modal verbs.' },
    ],
  },
  {
    id: 'praepverben', title: 'Verbs with prepositions & da-/wo-words', titleDe: 'Verben mit Präpositionen', level: 'B1', tag: 'praepverben',
    summary: 'warten auf, denken an, sich freuen über … — and how to say "about it" (darüber) or "about what?" (worüber?).',
    sections: [
      { h: 'Fixed prepositions', text: 'Many verbs have a fixed preposition and case you must learn together: warten auf (+Akk), denken an (+Akk), sprechen über (+Akk), teilnehmen an (+Dat), sich beschäftigen mit (+Dat), Angst haben vor (+Dat), abhängen von (+Dat).', examples: [['Ich warte auf den Bus.', 'I\'m waiting for the bus.'], ['Er nimmt an dem Kurs teil.', 'He\'s taking part in the course.']] },
      { h: 'da- + preposition (things)', text: 'To replace a thing: da + preposition (dar- before a vowel): darauf, daran, darüber, damit, davon. For people use preposition + pronoun: auf ihn.', examples: [['Wartest du auf den Brief? – Ja, ich warte darauf.', 'Are you waiting for the letter? – Yes, I\'m waiting for it.'], ['Wartest du auf Tom? – Ja, ich warte auf ihn.', 'Are you waiting for Tom? – Yes, I\'m waiting for him.']] },
      { h: 'wo- + preposition (questions)', text: 'Questions about things: worauf, woran, worüber, womit, wovon. About people: auf wen? mit wem?', examples: [['Worüber sprecht ihr?', 'What are you talking about?'], ['Mit wem sprichst du?', 'Who are you talking to?']] },
    ],
    exercises: [
      { type: 'mc', q: 'Ich denke oft ___ meine Familie.', options: ['an', 'auf', 'über'], answer: 0, explain: 'denken an + Akk.' },
      { type: 'mc', q: '„Freust du dich auf die Reise?“ – „Ja, ich freue mich ___.“', options: ['darauf', 'auf sie', 'worauf'], answer: 0, explain: 'A thing (die Reise) → da(r) + auf = darauf.' },
      { type: 'fill', q: '___ wartest du? – Auf den Bus.', answer: ['Worauf', 'worauf'], explain: 'Question about a thing with "warten auf" → worauf.' },
      { type: 'mc', q: 'Er hat Angst ___ der Prüfung.', options: ['vor', 'von', 'für'], answer: 0, explain: 'Angst haben vor + Dativ.' },
    ],
  },
  {
    id: 'plusquamperfekt', title: 'Plusquamperfekt', titleDe: 'Plusquamperfekt', level: 'B1', tag: 'plusquamperfekt',
    summary: 'The "past of the past": hatte/war + Partizip II — often with nachdem.',
    sections: [
      { h: 'Form', text: 'Präteritum of haben/sein + Partizip II. The choice of haben/sein is the same as in the Perfekt.', examples: [['Ich hatte schon gegessen, als er kam.', 'I had already eaten when he came.'], ['Sie war schon gegangen.', 'She had already left.']] },
      { h: 'With nachdem', text: 'nachdem + Plusquamperfekt, main clause in Präteritum (or Perfekt).', examples: [['Nachdem ich die Prüfung bestanden hatte, feierten wir.', 'After I had passed the exam, we celebrated.']] },
    ],
    exercises: [
      { type: 'mc', q: 'Als ich ankam, ___ der Zug schon abgefahren.', options: ['hatte', 'war', 'ist'], answer: 1, explain: 'abfahren takes sein → war … abgefahren.' },
      { type: 'fill', q: 'Nachdem er gegessen ___, ging er schlafen.', answer: ['hatte'], explain: 'essen → haben: hatte gegessen.' },
      { type: 'order', words: ['hatte', 'Ich', 'vergessen', 'Schlüssel', 'meinen'], answer: 'Ich hatte meinen Schlüssel vergessen', en: 'I had forgotten my key.', explain: 'hatte in position 2, participle at the end.' },
    ],
  },
  {
    id: 'futur', title: 'Futur I & II', titleDe: 'Futur I und II', level: 'B1', tag: 'futur',
    summary: 'werden + infinitive for plans, predictions and assumptions. Often the present tense is enough.',
    sections: [
      { h: 'Futur I', text: 'werden (conjugated) + infinitive at the end. Germans often use the present with a time word instead: "Morgen fahre ich nach Berlin."', examples: [['Es wird morgen regnen.', 'It will rain tomorrow.'], ['Ich werde dir helfen.', 'I will help you.']] },
      { h: 'Assumptions', text: 'With wohl/sicher, Futur I expresses a guess about the present.', examples: [['Er wird wohl krank sein.', 'He\'s probably ill.']] },
      { h: 'Futur II', text: 'werden + Partizip II + haben/sein: something will have happened, or a guess about the past.', examples: [['Bis Juni werde ich die Arbeit geschrieben haben.', 'By June I will have written the paper.'], ['Er wird den Bus verpasst haben.', 'He\'ll have missed the bus.']] },
    ],
    exercises: [
      { type: 'mc', q: 'Nächstes Jahr ___ ich in München studieren.', options: ['werde', 'wird', 'würde'], answer: 0, explain: 'ich werde + infinitive.' },
      { type: 'order', words: ['wird', 'Es', 'regnen', 'bestimmt'], answer: 'Es wird bestimmt regnen', en: 'It will definitely rain.', explain: 'werden in position 2, infinitive at the end.' },
      { type: 'mc', q: '„Wo ist Anna?“ – „Sie ___ wohl noch arbeiten.“', options: ['wird', 'würde', 'hat'], answer: 0, explain: 'Futur I + wohl = assumption about now.' },
    ],
  },
  {
    id: 'konnektoren', title: 'Two-part connectors', titleDe: 'Zweiteilige Konnektoren', level: 'B2', tag: 'konnektoren',
    summary: 'sowohl … als auch, weder … noch, entweder … oder, nicht nur … sondern auch, zwar … aber, je … desto.',
    sections: [
      { h: 'Meaning', text: 'sowohl … als auch = both … and; weder … noch = neither … nor; entweder … oder = either … or; nicht nur … sondern auch = not only … but also; zwar … aber = admittedly … but.', examples: [['Ich spreche sowohl Englisch als auch Urdu.', 'I speak both English and Urdu.'], ['Er hat weder Zeit noch Lust.', 'He has neither time nor inclination.'], ['Die Wohnung ist zwar klein, aber günstig.', 'The flat is small, admittedly, but cheap.']] },
      { h: 'je … desto / umso', text: 'je + comparative, verb at the END; desto + comparative, then verb, then subject.', examples: [['Je mehr ich lese, desto besser verstehe ich.', 'The more I read, the better I understand.'], ['Je früher wir fahren, umso weniger Verkehr gibt es.', 'The earlier we leave, the less traffic there is.']] },
    ],
    exercises: [
      { type: 'mc', q: 'Ich trinke ___ Kaffee noch Tee.', options: ['weder', 'entweder', 'sowohl'], answer: 0, explain: 'weder … noch = neither … nor.' },
      { type: 'mc', q: 'Er ist nicht nur klug, ___ auch fleißig.', options: ['aber', 'sondern', 'oder'], answer: 1, explain: 'nicht nur … sondern auch.' },
      { type: 'order', words: ['Je', 'übe,', 'mehr', 'ich', 'desto', 'spreche', 'besser', 'ich'], answer: 'Je mehr ich übe, desto besser spreche ich', en: 'The more I practise, the better I speak.', explain: 'je-clause: verb last; desto + comparative + verb + subject.' },
      { type: 'mc', q: '___ du kommst mit, oder du bleibst hier.', options: ['Weder', 'Entweder', 'Zwar'], answer: 1, explain: 'entweder … oder.' },
    ],
  },
  {
    id: 'ndeklination', title: 'n-declension', titleDe: 'n-Deklination', level: 'B2', tag: 'ndeklination',
    summary: 'Some masculine nouns add -(e)n in every case except Nominativ singular: der Student → den Studenten.',
    sections: [
      { h: 'Which nouns?', text: 'Masculine nouns ending in -e (der Kollege, der Junge, der Kunde), many nationalities (der Pole), -ent, -ant, -ist, -at, -oge (der Student, der Praktikant, der Polizist, der Kandidat, der Biologe) and a few others: der Mensch, der Herr, der Nachbar, der Bär.' },
      { h: 'Forms', text: 'Only the Nominativ singular has no ending.', table: [['', 'singular', 'plural'], ['Nom', 'der Kollege', 'die Kollegen'], ['Akk', 'den Kollegen', 'die Kollegen'], ['Dat', 'dem Kollegen', 'den Kollegen'], ['Gen', 'des Kollegen', 'der Kollegen']] },
      { h: 'Examples', text: 'Note Herr → Herrn (singular), Herren (plural).', examples: [['Ich frage den Studenten.', 'I ask the student.'], ['Das ist das Büro des Präsidenten.', 'That is the president\'s office.'], ['Ich schreibe Herrn Weber.', 'I\'m writing to Mr Weber.']] },
    ],
    exercises: [
      { type: 'fill', q: 'Ich helfe dem neuen Kolleg___.', answer: ['en', 'Kollegen'], explain: 'n-declension: dem Kollegen.' },
      { type: 'mc', q: 'Kennst du den ___?', options: ['Student', 'Studenten', 'Studente'], answer: 1, explain: 'Akkusativ → den Studenten.' },
      { type: 'mc', q: 'Sehr geehrter ___ Müller,', options: ['Herr', 'Herrn', 'Herren'], answer: 0, explain: 'Salutation is Nominativ → Herr. (But: Ich schreibe Herrn Müller.)' },
    ],
  },
  {
    id: 'partizipien', title: 'Participles as adjectives', titleDe: 'Partizipien als Adjektive', level: 'B2', tag: 'partizipien',
    summary: 'die steigenden Mieten, das gelesene Buch — participles replace relative clauses in formal German.',
    sections: [
      { h: 'Partizip I (active, ongoing)', text: 'infinitive + d + adjective ending: steigen → steigend → die steigenden Preise (= die Preise, die steigen).', examples: [['Das schlafende Kind', 'The sleeping child'], ['bei steigenden Temperaturen', 'with rising temperatures']] },
      { h: 'Partizip II (passive / completed)', text: 'Partizip II + adjective ending: das reparierte Auto (= das Auto, das repariert wurde).', examples: [['die veröffentlichte Studie', 'the published study'], ['ein gut bezahlter Job', 'a well-paid job']] },
      { h: 'Extended attributes', text: 'Academic and news German packs whole clauses before the noun: "die im letzten Jahr veröffentlichte Studie" = the study published last year. Read from the article to the noun, then go back.' },
    ],
    exercises: [
      { type: 'mc', q: 'Die Mieten steigen. → die ___ Mieten', options: ['gestiegene', 'steigenden', 'steigende'], answer: 1, explain: 'After "die" (plural) → -en: die steigenden Mieten.' },
      { type: 'mc', q: 'Das Auto wurde repariert. → das ___ Auto', options: ['reparierende', 'reparierte', 'repariert'], answer: 1, explain: 'Passive / completed → Partizip II + ending: das reparierte Auto.' },
      { type: 'fill', q: 'ein gut bezahlt___ Job (masc., Nom.)', answer: ['er', 'bezahlter'], explain: 'Mixed declension, masculine Nominativ → -er.' },
    ],
  },
  {
    id: 'nominalisierung', title: 'Nominal style', titleDe: 'Nominalisierung', level: 'B2', tag: 'nominalisierung',
    summary: 'Formal German turns verbs into nouns: weil es regnet → wegen des Regens.',
    sections: [
      { h: 'Verb → noun', text: 'Typical endings: -ung (entscheiden → die Entscheidung), infinitive as noun (das Lernen), stem (beginnen → der Beginn), -e (helfen → die Hilfe).' },
      { h: 'Clause → prepositional phrase', text: 'weil → wegen/aufgrund (+Gen); obwohl → trotz (+Gen); wenn/falls → bei (+Dat); nachdem → nach (+Dat); bevor → vor (+Dat); während → während (+Gen); damit/um … zu → zur/zum (+Dat).',
        examples: [['Weil die Kosten steigen, … → Aufgrund der steigenden Kosten …', 'Because costs are rising … → Due to the rising costs …'], ['Bevor ich abreise, … → Vor meiner Abreise …', 'Before I leave … → Before my departure …'], ['Um Energie zu sparen, … → Zum Sparen von Energie …', 'In order to save energy … → For saving energy …']] },
    ],
    exercises: [
      { type: 'mc', q: 'Obwohl es regnete, … →', options: ['Trotz des Regens', 'Wegen des Regens', 'Bei Regen'], answer: 0, explain: 'obwohl → trotz + Genitiv.' },
      { type: 'mc', q: 'Nachdem er angekommen war, … →', options: ['Vor seiner Ankunft', 'Nach seiner Ankunft', 'Bei seiner Ankunft'], answer: 1, explain: 'nachdem → nach + Dativ.' },
      { type: 'fill', q: 'entscheiden → die ___', answer: ['Entscheidung'], explain: 'Verb stem + -ung.' },
    ],
  },
  {
    id: 'passiversatz', title: 'Passive alternatives', titleDe: 'Passiversatzformen', level: 'B2', tag: 'passiv',
    summary: 'man, sich lassen, sein + zu, -bar: four ways to avoid werden-passive.',
    sections: [
      { h: 'Forms', text: '"man" (Man repariert das Auto.) · sich lassen + infinitive = can be done (Das lässt sich ändern.) · sein + zu + infinitive = can/must be done (Die Aufgabe ist bis Montag zu erledigen.) · adjective in -bar = possible (Das ist machbar.)',
        examples: [['Das Problem lässt sich leicht lösen.', 'The problem can be solved easily.'], ['Der Antrag ist bis Freitag einzureichen.', 'The application must be submitted by Friday.'], ['Das Wasser ist nicht trinkbar.', 'The water isn\'t drinkable.']] },
    ],
    exercises: [
      { type: 'mc', q: 'Das kann man nicht ändern. =', options: ['Das lässt sich nicht ändern.', 'Das ist nicht ändern.', 'Das wird nicht ändern.'], answer: 0, explain: 'sich lassen + infinitive = can be done.' },
      { type: 'mc', q: 'Das Formular muss ausgefüllt werden. =', options: ['Das Formular ist auszufüllen.', 'Das Formular lässt auszufüllen.', 'Das Formular ist ausfüllbar.'], answer: 0, explain: 'sein + zu + infinitive = must be done.' },
      { type: 'fill', q: 'Das kann man lesen. = Das ist ___.', answer: ['lesbar'], explain: 'Stem + -bar = can be done.' },
    ],
  },
];
