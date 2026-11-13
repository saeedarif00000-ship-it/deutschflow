import { VOCAB } from './vocab';

/** Function words and frequent inflected forms: lowercase form → [English, part of speech] */
const F = `
der,the|article;die,the|article;das,the / that|article;den,the|article;dem,the|article;des,of the|article
ein,a|article;eine,a|article;einen,a|article;einem,a|article;einer,a / of a|article;eines,of a|article
kein,no|article;keine,no|article;keinen,no|article;keinem,no|article;keiner,no / nobody|article
ich,I|pronoun;du,you|pronoun;er,he / it|pronoun;sie,she / they / you|pronoun;es,it|pronoun;wir,we|pronoun;ihr,you (pl.) / her|pronoun;man,one / you|pronoun
mich,me|pronoun;dich,you|pronoun;ihn,him / it|pronoun;uns,us|pronoun;euch,you (pl.)|pronoun;sich,oneself|pronoun
mir,(to) me|pronoun;dir,(to) you|pronoun;ihm,(to) him|pronoun;ihnen,(to) them / you|pronoun
mein,my|pronoun;meine,my|pronoun;meinen,my|pronoun;meinem,my|pronoun;meiner,my|pronoun;meines,of my|pronoun
dein,your|pronoun;deine,your|pronoun;deinen,your|pronoun;deinem,your|pronoun;deiner,your|pronoun
sein,his / to be|pronoun;seine,his|pronoun;seinen,his|pronoun;seinem,his|pronoun;seiner,his|pronoun
ihre,her / their|pronoun;ihren,her / their|pronoun;ihrem,her / their|pronoun;ihrer,her / their|pronoun
unser,our|pronoun;unsere,our|pronoun;unseren,our|pronoun;unserem,our|pronoun;euer,your (pl.)|pronoun
dieser,this|pronoun;diese,this / these|pronoun;dieses,this|pronoun;diesen,this|pronoun;diesem,this|pronoun;dies,this|pronoun
jeder,every|pronoun;jede,every|pronoun;jedes,every|pronoun;jeden,every|pronoun;jedem,every|pronoun
alle,all|pronoun;alles,everything|pronoun;viele,many|adj;wenige,few|adj;einige,some|pronoun;andere,other|adj;anderen,other|adj
nichts,nothing|pronoun;etwas,something|pronoun;jemand,someone|pronoun;niemand,nobody|pronoun;was,what|pronoun;wer,who|pronoun;wen,whom|pronoun;wem,(to) whom|pronoun
bin,am|verb;bist,are|verb;ist,is|verb;sind,are|verb;seid,are|verb;war,was|verb;waren,were|verb;warst,were|verb;gewesen,been|verb
habe,have|verb;hast,have|verb;hat,has|verb;haben,have|verb;habt,have|verb;hatte,had|verb;hatten,had|verb;gehabt,had|verb
werde,will / become|verb;wirst,will / become|verb;wird,will / becomes / is (passive)|verb;werden,will / become|verb;wurde,was / became|verb;wurden,were / became|verb;worden,been (passive)|verb;geworden,become|verb
kann,can|verb;kannst,can|verb;können,can|verb;konnte,could|verb;könnte,could|verb;könnten,could|verb
muss,must|verb;musst,must|verb;müssen,must|verb;musste,had to|verb;müsste,would have to|verb
will,want(s)|verb;willst,want|verb;wollen,want|verb;wollte,wanted|verb
darf,may|verb;dürfen,may|verb;durfte,was allowed|verb;soll,should|verb;sollen,should|verb;sollte,should|verb;sollten,should|verb
möchte,would like|verb;möchtest,would like|verb;möchten,would like|verb;mag,like(s)|verb
wäre,would be|verb;wären,would be|verb;hätte,would have|verb;hätten,would have|verb;würde,would|verb;würden,would|verb;sei,is (reported)|verb
gibt,gives / there is|verb;geht,goes|verb;gehe,go|verb;kommt,comes|verb;komme,come|verb;macht,makes / does|verb;mache,make / do|verb
heißt,is called / means|verb;wohnt,lives|verb;arbeitet,works|verb;fährt,drives / goes|verb;fahre,go (by vehicle)|verb;liegt,lies / is located|verb;steht,stands|verb
und,and|conj;oder,or|conj;aber,but|conj;denn,because|conj;sondern,but rather|conj;weil,because|conj;dass,that|conj;ob,whether|conj;wenn,if / when|conj;als,when / than / as|conj;wie,how / as / like|conj
obwohl,although|conj;damit,so that / with it|conj;bevor,before|conj;nachdem,after|conj;während,while / during|conj;bis,until|conj;seit,since|prep;sodass,so that|conj;indem,by (doing)|conj
in,in|prep;im,in the|prep;ins,into the|prep;an,at / on|prep;am,at / on the|prep;auf,on|prep;aus,from / out of|prep;bei,at / with|prep;beim,at the|prep;mit,with|prep;nach,to / after|prep
von,from / of|prep;vom,from the|prep;zu,to / too|prep;zum,to the|prep;zur,to the|prep;für,for|prep;ohne,without|prep;gegen,against|prep;um,at / around|prep;durch,through|prep
über,over / about|prep;unter,under / among|prep;vor,before / in front of|prep;hinter,behind|prep;neben,next to|prep;zwischen,between|prep;wegen,because of|prep;trotz,despite|prep
nicht,not|adv;auch,also|adv;nur,only|adv;noch,still / yet|adv;schon,already|adv;sehr,very|adv;so,so / like this|adv;dann,then|adv;jetzt,now|adv;hier,here|adv;da,there / since|adv;dort,there|adv
heute,today|adv;morgen,tomorrow|adv;gestern,yesterday|adv;immer,always|adv;oft,often|adv;nie,never|adv;mehr,more|adv;sehr,very|adv;gern,gladly|adv;gerne,gladly|adv;wieder,again|adv
ja,yes|particle;nein,no|particle;doch,but / yes (contradiction)|particle;mal,once / just|particle;denn,then (particle)|particle;eben,just|particle;halt,just|particle;zu,to|particle
eins,one|number;zwei,two|number;drei,three|number;vier,four|number;fünf,five|number;sechs,six|number;sieben,seven|number;acht,eight|number;neun,nine|number;zehn,ten|number
elf,eleven|number;zwölf,twelve|number;zwanzig,twenty|number;dreißig,thirty|number;hundert,hundred|number;tausend,thousand|number
gut,good|adj;neu,new|adj;erst,only / first|adv;bisschen,a bit|adv;mittags,at midday|adv;abends,in the evening|adv;morgens,in the morning|adv;meistens,mostly|adv;lieber,rather / prefer|adv;normalerweise,normally|adv;einmal,once|adv;daher,therefore|adv;selbst,oneself / even|adv;dabei,in doing so|adv;kaum,hardly|adv;nämlich,namely / you see|adv;etwa,for instance / about|adv;mitunter,sometimes|adv;stattdessen,instead|adv;dadurch,thereby|adv;hiermit,hereby|adv;umgehend,immediately|adv;gezielt,targeted|adv;ungern,reluctantly|adv;ausdrücklich,explicitly|adv;langfristig,in the long term|adv;monatelang,for months|adv;häufig,often|adv;häufiger,more often|adv;regelmäßig,regularly|adv;oberflächlich,on the surface|adv;ehrenamtlich,voluntarily|adv;projektbezogen,project-based|adv;fließend,fluent(ly)|adv;zurück,back|adv;pro,per|prep;bar,(in) cash|adv;online,online|adv;kellner,waiter|noun;stück,piece|noun;freunden,friends|noun;altstadt,old town|noun;touristen,tourists|noun;studentinnen,(female) students|noun;putzplan,cleaning rota|noun;wochenmarkt,weekly market|noun;tomaten,tomatoes|noun;region,region|noun;verkäuferin,saleswoman|noun;käsestand,cheese stall|noun;automaten,(cash) machine|noun;meldebescheinigung,registration certificate|noun;studierende,students|noun;uni,university|noun;semesterticket,semester ticket|noun;personalchefin,HR manager (f.)|noun;baufirma,construction company|noun;ende,end|noun;arbeitstag,working day|noun;zusage,acceptance / job offer|noun;mülltonnen,bins|noun;tonne,bin|noun;verpackungen,packaging|noun;plastik,plastic|noun;essensreste,food leftovers|noun;biotonne,organic waste bin|noun;container,container|noun;farben,colours|noun;pfand,deposit (bottles)|noun;system,system|noun;rohstoffe,raw materials|noun;jahren,years|noun;arbeitsweg,commute|noun;kontakt,contact|noun;modell,model|noun;mischung,mix|noun;seltenheit,rarity|noun;servicestelle,service centre|noun;terminsuche,appointment search|noun;weihnachtsmärkte,Christmas markets|noun;jahrhundert,century|noun;dezember,December|noun;besucher,visitors|noun;welt,world|noun;glühwein,mulled wine|noun;stollen,Stollen (Christmas cake)|noun;christstollen,Christmas Stollen|noun;rosinen,raisins|noun;butter,butter|noun;adventskranz,Advent wreath|noun;heiligabend,Christmas Eve|noun;talent,talent|noun;forscher,researchers|noun;sätzen,sentences|noun;tagen,days|noun;fehlern,mistakes|noun;pflegekräfte,nurses / carers|noun;itspezialisten,IT specialists|noun;hauptursache,main cause|noun;wandel,change|noun;rente,pension / retirement|noun;einwanderung,immigration|noun;fachkräften,skilled workers|noun;kritiker,critics|noun;anerkennung,recognition|noun;deutschkenntnisse,German skills|noun;hürde,hurdle|noun;sprachkurse,language courses|noun;autoverkehr,car traffic|noun;innenstädten,city centres|noun;parkplätze,car parks|noun;radwege,cycle paths|noun;fußgängerzonen,pedestrian zones|noun;befürworter,supporters|noun;luft,air|noun;einzelhändler,retailers|noun;innenstadt,city centre|noun;fußgänger,pedestrians|noun;radfahrer,cyclists|noun;mengen,quantities|noun;nahverkehr,local public transport|noun;alternativen,alternatives|noun;kiprogramme,AI programs|noun;sekunden,seconds|noun;hochschulen,universities|noun;dozenten,lecturers|noun;einsatz,use|noun;kisysteme,AI systems|noun;ki,AI|noun;prüfungsformen,exam formats|noun;sommern,summers|noun;grundwasserspiegel,groundwater level(s)|noun;regionen,regions|noun;regenfälle,rainfall|noun;boden,soil / ground|noun;überschwemmungen,floods|noun;experten,experts|noun;flächen,surfaces / areas|noun;regenwasser,rainwater|noun;landwirtschaft,agriculture|noun;industrie,industry|noun;erwachsene,adults|noun;feuerwehr,fire brigade|noun;sportverein,sports club|noun;flüchtlingshilfe,refugee support|noun;freiwillige,volunteers|noun;motive,motives|noun;kontakte,contacts|noun;zugezogene,newcomers|noun;ehrenamt,volunteer work|noun;chance,chance|noun;anschluss,connection / belonging|noun;nachwuchsprobleme,recruitment problems|noun;lieferung,delivery|noun;bestellung,order|noun;märz,March|noun;werktagen,working days|noun;ersatzgerät,replacement device|noun;kaufpreis,purchase price|noun;betrat,entered|verb;aussieht,looks|verb;sortiert,sorts|verb;abgibt,hands in|verb;verliert,loses|verb;einteilen,organise|verb;fehlt,is missing|verb;setzen,set / bet on|verb;versuchen,try|verb;reduzieren,reduce|verb;argumentieren,argue|verb;befürchten,fear|verb;abbringen,dissuade|verb;verfassen,write|verb;prüfen,check|verb;liefern,deliver|verb;erfinden,invent|verb;verlangen,demand|verb;offengelegt,disclosed|verb;aufnehmen,absorb / take in|verb;fließt,flows|verb;entsiegeln,unseal|verb;umgehen,deal with|verb;funktionieren,work|verb;zurückgeben,give back|verb;sammeln,collect|verb;klagen,complain|verb;binden,commit / bind|verb;gewinnen,gain / win|verb;einschalten,switch on|verb;zuzusenden,to send|verb;erstatten,refund|verb;nachkommen,come after|verb;gegenzusteuern,to counteract|verb;erleichtert,made easier|verb;bemängeln,criticise|verb;bieten,offer|verb;lassen,let / can be|verb;dürften,are likely to|verb;seien,are (reported)|verb;besichtigt,visited|verb;zurückgefahren,travelled back|verb;umzieht,moves|verb;gestohlen,stolen|verb;mitbringen,bring along|verb;dauert,lasts|verb;kompliziert,complicated|adj;eigenes,own|adj;glatt,slippery|adj;typische,typical|adj;einfache,simple|adj;blaue,blue|adj;gelbe,yellow|adj;braune,brown|adj;mehreren,several|adj;dringenden,urgent|adj;dresdner,Dresden's|adj;ältesten,oldest|adj;besonderes,special|adj;wichtiger,more important|adj;besser,better|adj;leichter,easier|adj;zahlreichen,numerous|adj;unbesetzt,vacant|adj;demografische,demographic|adj;ausländischer,foreign|adj;größere,bigger|adj;neuer,new|adj;breitere,wider|adj;sauberer,cleaner|adj;höher,higher|adj;weniger,fewer / less|adj;kleineren,smaller|adj;entscheidend,decisive|adj;ausgebauter,well-developed|adj;öffentlicher,public|adj;attraktive,attractive|adj;wenigsten,fewest|adj;unumstritten,undisputed|adj;korrekte,correct|adj;mündlichen,oral|adj;unbegrenzte,unlimited|adj;trockenen,dry|adj;trockene,dry|adj;manchen,some|adj;kurze,short|adj;heftige,heavy|adj;effizienter,more efficient|adj;dritte,third|adj;flexible,flexible|adj;beschädigt,damaged|adj;dankbar,grateful|adj;schwerer,heavy|adj;großer,big|adj;freier,more freely|adj;beste,best|adj;gutes,good|adj;letztes,last|adj;erstes,first|adj;letzte,last|adj;typischer,typical|adj;schneller,faster|adj;frischer,fresher|adj;manche,some|pronoun;vieles,much|pronoun;denen,whom / which|pronoun;neue,new|adj;neuen,new|adj;neues,new|adj;groß,big|adj;große,big|adj;großen,big|adj;klein,small|adj;kleine,small|adj;kleinen,small|adj
`;

export const FUNCTION_GLOSS: Record<string, [string, string]> = Object.fromEntries(
  F.split(/[;\n]/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => {
      const [k, rest] = x.split(',');
      const [en, pos] = rest.split('|');
      return [k, [en, pos] as [string, string]];
    }),
);

const posShort = (p: string) => p.replace('adjective', 'adj').replace('adverb', 'adv').replace('preposition', 'prep').replace('conjunction', 'conj');

/** All known German forms (vocab lemmas, plurals, verb forms + function words) → gloss */
export const GLOSS: Record<string, [string, string]> = (() => {
  const g: Record<string, [string, string]> = { ...FUNCTION_GLOSS };
  for (const w of VOCAB) {
    const en = w.en.split(/[/(]/)[0].trim();
    const add = (form?: string, note = '') => {
      if (!form) return;
      for (const part of form.split(/\s+/)) {
        const k = part.toLowerCase().replace(/[^a-zäöüß]/g, '');
        if (k.length < 2 || ['die', 'der', 'das', 'sich', 'hat', 'ist', 'no', 'plural', 'rare'].includes(k)) continue;
        if (!g[k]) g[k] = [en + note, posShort(w.pos)];
      }
    };
    add(w.de);
    if (w.plural && !w.plural.startsWith('—')) add(w.plural.replace(/^die /, ''), ' (pl.)');
    if (w.verb) {
      add(w.verb.present);
      add(w.verb.praeteritum, ' (past)');
      add(w.verb.perfekt.split(' ').slice(-1)[0], ' (past participle)');
    }
  }
  return g;
})();

/** English → German index for the reverse lookup in the translator */
export const EN_INDEX: { en: string; id: string }[] = VOCAB.flatMap((w) =>
  w.en
    .split(/[/;,]/)
    .map((e) => e.replace(/\(.*?\)/g, '').replace(/^to /, '').trim().toLowerCase())
    .filter(Boolean)
    .map((en) => ({ en, id: w.id })),
);

const ENDINGS = ['en', 'em', 'er', 'es', 'e', 'st', 't', 'n', 's'];

/** Lookup with light stemming: tries the form, then common inflection endings and ge-…-t participles. */
export function glossFor(token: string, extra?: Record<string, [string, string]>): [string, string] | undefined {
  const k = token.toLowerCase().replace(/[^a-zäöüß]/g, '');
  if (!k) return undefined;
  const hit = (x: string) => extra?.[x] ?? GLOSS[x];
  if (hit(k)) return hit(k);
  for (const e of ENDINGS) if (k.length > e.length + 2 && k.endsWith(e) && hit(k.slice(0, -e.length))) return hit(k.slice(0, -e.length));
  for (const e of ENDINGS) if (k.length > e.length + 2 && k.endsWith(e) && hit(k.slice(0, -e.length) + 'en')) return hit(k.slice(0, -e.length) + 'en');
  const pp = k.match(/^(\w*?)ge(\w+?)(t|en)$/);
  if (pp && hit(pp[1] + pp[2] + 'en')) return [hit(pp[1] + pp[2] + 'en')![0] + ' (past participle)', 'verb'];
  return undefined;
}
