import type { Expression, Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'restaurant', title: 'Ordering food', titleDe: 'Im Restaurant', level: 'A1', icon: 'restaurant',
    goal: 'Order a drink and a main course, ask for the bill and pay.', role: 'a friendly waiter in a German restaurant',
    script: [
      { tutor: 'Guten Abend! Haben Sie reserviert?', en: 'Good evening! Do you have a reservation?', suggestions: ['Nein, einen Tisch für zwei, bitte.', 'Ja, auf den Namen Weber.'] },
      { tutor: 'Sehr gern. Was möchten Sie trinken?', en: 'Certainly. What would you like to drink?', suggestions: ['Ich hätte gern ein Wasser, bitte.', 'Eine Apfelschorle, bitte.'] },
      { tutor: 'Und was darf es zum Essen sein?', en: 'And what would you like to eat?', suggestions: ['Ich nehme die Gemüsesuppe.', 'Was können Sie empfehlen?'] },
      { tutor: 'Hat es Ihnen geschmeckt?', en: 'Did you enjoy your meal?', suggestions: ['Ja, sehr lecker, danke!', 'Die Rechnung, bitte.'] },
      { tutor: 'Zusammen oder getrennt?', en: 'Together or separately?', suggestions: ['Getrennt, bitte.', 'Zusammen. Kann ich mit Karte zahlen?'] },
      { tutor: 'Das macht 24,50 Euro. Vielen Dank und einen schönen Abend!', en: 'That comes to 24.50 euros. Thank you and have a nice evening!', suggestions: ['Machen Sie 26. Schönen Abend!', 'Danke, Ihnen auch!'] },
    ],
  },
  {
    id: 'arzt', title: 'At the doctor\'s', titleDe: 'Beim Arzt', level: 'A2', icon: 'medkit',
    goal: 'Describe your symptoms, answer questions and understand the advice.', role: 'a calm general practitioner (Hausarzt)',
    script: [
      { tutor: 'Guten Tag, nehmen Sie bitte Platz. Was fehlt Ihnen?', en: 'Hello, please take a seat. What seems to be the problem?', suggestions: ['Ich habe seit drei Tagen Halsschmerzen.', 'Mir ist schwindelig und ich habe Fieber.'] },
      { tutor: 'Haben Sie auch Fieber oder Husten?', en: 'Do you also have a fever or a cough?', suggestions: ['Ja, ich habe leichtes Fieber.', 'Nein, nur Kopfschmerzen.'] },
      { tutor: 'Nehmen Sie zurzeit Medikamente?', en: 'Are you currently taking any medication?', suggestions: ['Nein, keine.', 'Ja, manchmal Ibuprofen.'] },
      { tutor: 'Ich schreibe Sie für drei Tage krank. Brauchen Sie eine Bescheinigung für die Uni?', en: 'I\'ll give you a sick note for three days. Do you need a certificate for university?', suggestions: ['Ja, bitte. Ich habe morgen eine Prüfung.', 'Nein, danke.'] },
      { tutor: 'Trinken Sie viel und ruhen Sie sich aus. Gute Besserung!', en: 'Drink a lot and get some rest. Get well soon!', suggestions: ['Vielen Dank, Herr Doktor!', 'Muss ich noch einmal kommen?'] },
    ],
  },
  {
    id: 'vermieter', title: 'Talking to your landlord', titleDe: 'Mit dem Vermieter sprechen', level: 'B1', icon: 'home',
    goal: 'Report a problem in your flat (broken heating), agree on a repair date.', role: 'a busy but fair landlord (Herr Becker)',
    script: [
      { tutor: 'Becker, guten Tag. Wie kann ich Ihnen helfen?', en: 'Becker speaking, hello. How can I help you?', suggestions: ['Guten Tag, hier ist … aus der Wohnung 3. Die Heizung funktioniert nicht.', 'Ich rufe wegen eines Problems in meiner Wohnung an.'] },
      { tutor: 'Oh, seit wann haben Sie das Problem?', en: 'Oh, since when have you had this problem?', suggestions: ['Seit gestern Abend ist es ganz kalt.', 'Schon seit einer Woche.'] },
      { tutor: 'Ich schicke einen Handwerker. Wann sind Sie zu Hause?', en: 'I\'ll send a tradesperson. When are you at home?', suggestions: ['Morgen ab 14 Uhr passt es mir gut.', 'Könnte er vielleicht am Vormittag kommen?'] },
      { tutor: 'Gut, dann kommt Herr Schulz morgen um 15 Uhr. Gibt es sonst noch etwas?', en: 'Okay, then Mr Schulz will come tomorrow at 3 pm. Anything else?', suggestions: ['Ja, das Fenster im Bad schließt auch nicht richtig.', 'Nein, das war alles. Vielen Dank!'] },
    ],
  },
  {
    id: 'vorlesung', title: 'University lecture & office hours', titleDe: 'In der Sprechstunde', level: 'B1', icon: 'school',
    goal: 'Ask your professor about the exam and an extension for your assignment.', role: 'a professor during office hours (Sprechstunde)',
    script: [
      { tutor: 'Herein! Was kann ich für Sie tun?', en: 'Come in! What can I do for you?', suggestions: ['Guten Tag, ich habe eine Frage zur Klausur.', 'Ich wollte nach einer Fristverlängerung fragen.'] },
      { tutor: 'Worum genau geht es?', en: 'What exactly is it about?', suggestions: ['Welche Themen sind für die Prüfung relevant?', 'Ich war krank und konnte die Hausarbeit nicht rechtzeitig abgeben.'] },
      { tutor: 'Haben Sie dafür einen Nachweis?', en: 'Do you have proof of that?', suggestions: ['Ja, ich habe ein ärztliches Attest dabei.', 'Ich kann es Ihnen per E-Mail schicken.'] },
      { tutor: 'In Ordnung, dann verlängere ich die Frist um eine Woche.', en: 'All right, then I\'ll extend the deadline by one week.', suggestions: ['Vielen Dank für Ihr Verständnis!', 'Bis wann genau muss ich sie abgeben?'] },
    ],
  },
  {
    id: 'bewerbung', title: 'Job interview', titleDe: 'Das Vorstellungsgespräch', level: 'B2', icon: 'briefcase',
    goal: 'Introduce yourself, talk about your strengths and experience, ask questions about the role.', role: 'an HR manager interviewing for a working-student position',
    script: [
      { tutor: 'Schön, dass Sie da sind. Erzählen Sie doch kurz etwas über sich.', en: 'Nice to have you here. Tell us a little about yourself.', suggestions: ['Gern. Ich studiere im Master an der TU und habe einen Bachelor in Informatik.', 'Ich interessiere mich besonders für Datenanalyse.'] },
      { tutor: 'Warum haben Sie sich gerade bei uns beworben?', en: 'Why did you apply to us in particular?', suggestions: ['Weil Ihre Projekte im Bereich Nachhaltigkeit mich sehr ansprechen.', 'Ich möchte praktische Erfahrungen sammeln.'] },
      { tutor: 'Was sind Ihre Stärken – und woran arbeiten Sie noch?', en: 'What are your strengths – and what are you still working on?', suggestions: ['Ich arbeite strukturiert und lerne schnell.', 'Mein Deutsch verbessere ich gerade gezielt.'] },
      { tutor: 'Haben Sie noch Fragen an uns?', en: 'Do you have any questions for us?', suggestions: ['Wie sieht ein typischer Arbeitstag aus?', 'Wie flexibel sind die Arbeitszeiten während der Prüfungsphase?'] },
    ],
  },
  {
    id: 'buergeramt', title: 'Registering your address', titleDe: 'Beim Bürgeramt', level: 'A2', icon: 'document-text',
    goal: 'Register your new address (Anmeldung) and provide the right documents.', role: 'a clerk at the Bürgeramt',
    script: [
      { tutor: 'Guten Morgen. Haben Sie einen Termin?', en: 'Good morning. Do you have an appointment?', suggestions: ['Ja, um 9:30 Uhr. Ich möchte mich anmelden.', 'Ja, hier ist meine Terminbestätigung.'] },
      { tutor: 'Ihren Pass und die Wohnungsgeberbestätigung, bitte.', en: 'Your passport and the landlord\'s confirmation, please.', suggestions: ['Hier, bitte.', 'Brauchen Sie auch den Mietvertrag?'] },
      { tutor: 'Wohnen Sie allein in der Wohnung?', en: 'Do you live alone in the flat?', suggestions: ['Nein, in einer WG mit zwei Mitbewohnern.', 'Ja, allein.'] },
      { tutor: 'So, fertig. Hier ist Ihre Meldebescheinigung.', en: 'There, done. Here is your registration certificate.', suggestions: ['Vielen Dank! Einen schönen Tag noch.', 'Muss ich noch etwas machen?'] },
    ],
  },
];

export const EXPRESSIONS: Expression[] = [
  { de: 'Na?', en: 'Hey, how\'s it going?', register: 'colloquial', example: ['Na, alles gut?', 'Hey, everything okay?'], why: 'A one-syllable greeting among friends. "Na?" can be answered with "Na?" — and that is a complete conversation.' },
  { de: 'Passt schon.', en: 'It\'s fine / keep the change', register: 'colloquial', example: ['„Sorry, ich bin zu spät.“ – „Passt schon.“', '"Sorry I\'m late." – "It\'s fine."'], why: 'Southern German understatement: things don\'t need to be perfect, they just need to "fit".' },
  { de: 'Alles klar.', en: 'Got it / all right', register: 'neutral', example: ['Alles klar, bis morgen!', 'All right, see you tomorrow!'], why: 'Confirms understanding — used constantly at work and in shops.' },
  { de: 'Feierabend!', en: 'Done for the day!', register: 'neutral', example: ['Endlich Feierabend!', 'Finally, work is over!'], why: 'There\'s no English single word: it marks the sacred boundary between work and free time — a very German value.' },
  { de: 'Das ist mir Wurst.', en: 'I don\'t care', register: 'colloquial', example: ['Pizza oder Pasta? Das ist mir Wurst.', 'Pizza or pasta? I don\'t mind.'], why: 'Sausage has two ends that are the same — so it doesn\'t matter which you pick.' },
  { de: 'Ich verstehe nur Bahnhof.', en: 'It\'s all Greek to me', register: 'idiom', example: ['Physik? Ich verstehe nur Bahnhof.', 'Physics? It\'s all Greek to me.'], why: 'Said to come from WWI soldiers who only wanted to hear "Bahnhof" — the station that would take them home.' },
  { de: 'Ich drücke dir die Daumen.', en: 'I\'ll keep my fingers crossed', register: 'idiom', example: ['Morgen ist deine Prüfung? Ich drücke dir die Daumen!', 'Your exam is tomorrow? Fingers crossed!'], why: 'Germans press their thumbs instead of crossing fingers.' },
  { de: 'Krass!', en: 'Wow / crazy!', register: 'slang', example: ['Du hast den Job? Krass!', 'You got the job? Wow!'], why: 'Youth slang for anything extreme, good or bad.' },
  { de: 'Quatsch!', en: 'Nonsense!', register: 'colloquial', example: ['Ach Quatsch, das stimmt doch nicht.', 'Oh nonsense, that\'s not true.'], why: 'Mild and friendly — not rude among friends.' },
  { de: 'Kein Ding.', en: 'No problem', register: 'slang', example: ['„Danke fürs Helfen!“ – „Kein Ding.“', '"Thanks for helping!" – "No worries."'], why: 'Casual reply to thanks among young people.' },
  { de: 'Mahlzeit!', en: 'Enjoy your lunch (greeting)', register: 'colloquial', example: ['Mahlzeit! Geht ihr auch in die Kantine?', 'Lunchtime! Are you going to the canteen too?'], why: 'In many offices this is THE greeting around midday, even when passing in a corridor.' },
  { de: 'Doch!', en: 'Yes (contradicting a negative)', register: 'neutral', example: ['„Du kommst nicht mit, oder?“ – „Doch!“', '"You\'re not coming, are you?" – "Yes, I am!"'], why: 'German has a special word for contradicting a negative statement — English has none.' },
  { de: 'Das kannst du knicken.', en: 'Forget it', register: 'colloquial', example: ['Den Bus kannst du knicken, der ist weg.', 'You can forget the bus, it\'s gone.'], why: 'Like folding (knicken) a ticket you no longer need.' },
  { de: 'Schwein gehabt!', en: 'Lucky!', register: 'idiom', example: ['Der Zug hatte Verspätung – Schwein gehabt!', 'The train was late – lucky me!'], why: 'Pigs were symbols of luck and wealth; a pig as a prize meant good fortune.' },
  { de: 'auf Augenhöhe', en: 'as equals', register: 'idiom', example: ['Wir wollen auf Augenhöhe verhandeln.', 'We want to negotiate as equals.'], why: 'Literally "at eye level" — common in work and politics.' },
];

export const PRONUNCIATION = [
  { sound: 'ch (ich-Laut)', tip: 'After e, i, ä, ö, ü, ei, eu and consonants: a soft hiss, tongue near the palate — like a whispered "h" in "huge".', words: ['ich', 'nicht', 'Milch', 'wichtig'] },
  { sound: 'ch (ach-Laut)', tip: 'After a, o, u, au: from the back of the throat, like Scottish "loch".', words: ['acht', 'Buch', 'auch', 'machen'] },
  { sound: 'ü', tip: 'Say "ee" and round your lips like "oo" without moving your tongue.', words: ['für', 'müde', 'Prüfung', 'Tür'] },
  { sound: 'ö', tip: 'Say "eh" and round your lips.', words: ['schön', 'können', 'hören', 'Öl'] },
  { sound: 'r', tip: 'Standard German r is in the throat (uvular). After vowels it often becomes a soft "a": "besser" ≈ "bessa".', words: ['rot', 'Reise', 'Bruder', 'hier'] },
  { sound: 'z', tip: 'Always "ts".', words: ['Zeit', 'Zimmer', 'zehn', 'Zug'] },
  { sound: 'w / v', tip: 'w = English v; v is usually English f.', words: ['Wasser', 'wohnen', 'Vater', 'viel'] },
  { sound: 'ei / ie', tip: 'ei = "eye", ie = "ee". Rule: say the second letter in English.', words: ['mein', 'Bier', 'Wein', 'Liebe'] },
  { sound: 'Final devoicing', tip: 'b, d, g at the end of a syllable sound like p, t, k.', words: ['Tag', 'Kind', 'gelb', 'Abend'] },
];
