// Eigen of gewenst ander geslacht
export const SEX_ENUM = Object.freeze({
  Male: "SEX_ENUM.Male",
  Female: "SEX_ENUM.Female",
  Both: "SEX_ENUM.Both",
});

// Type speler
export const PLAYERTARGET_ENUM = Object.freeze({
  Self: 0,
  Other: 1,
});

// Opbouwfase — bepaalt zowel de sfeer als het toegestane niveau van fysiek contact.
// Hoe verder in de fase, hoe intiemer, sensueler of seksueler het contact mag zijn.
export const STAGE_ENUM = Object.freeze({
  INNOCENT: "STAGE_ENUM.INNOCENT",
  /*
     Algemeen, veilig en onschuldig.
     - Doel: neutraal sociaal contact, zonder enige ondertoon van plagen, ondeugd of prikkeling.
     - Fysiek contact: volledig binnen veilige, alledaagse grenzen — wat je ook buiten het spel zou kunnen doen.
       Denk aan: hand geven, high five, een vriendschappelijke aai op arm of schouder, of een lichte aanraking bij een grap.
     - Geen aanraking van of nabij intieme zones. Geen speelse of suggestieve bedoelingen.
  */

  PLAYFUL: "STAGE_ENUM.PLAYFUL",
  /*
     Speels, grappig, plagend of licht prikkelend.
     - Doel: spanning of nieuwsgierigheid opbouwen door ondeugendheid, zonder dat het seksueel wordt.
     - Fysiek contact: mag de focus leggen op of dichtbij intieme zones, maar zonder ze aan te raken.
       Bijvoorbeeld: kietelen aan heupen of zij, spelen met kledingranden, of lichte aanrakingen met een speelse toon.
     - De spanning ontstaat uit plagen, nabijheid of dubbelzinnige situaties — niet uit daadwerkelijke seksuele aanraking.
  */

  ROMANTIC: "STAGE_ENUM.ROMANTIC",
  /*
     Teder en intiem, gericht op affectie en verbondenheid.
     - Doel: emotionele en lichamelijke nabijheid zonder dat het expliciet seksueel wordt.
     - Fysiek contact: aanraken van intieme zones is toegestaan, maar niet seksueel.
       Bijvoorbeeld: strelen over borsten of rug, zacht wrijven over buik of buitenzijde van geslachtsdelen
       zonder directe stimulatie van schaamlippen, clitoris of eikel.
     - Het contact draait om warmte, spanning en verbinding, niet om prikkeling of {masked_word}.
  */

  SENSUAL: "STAGE_ENUM.SENSUAL",
  /*
     Sensueel, verleidelijk en uitdagend met een duidelijke seksuele toon.
     - Doel: bewust prikkelen, verlangen opwekken en spanning vergroten zonder expliciete seks.
     - Fysiek contact: intieme zones mogen gericht worden aangeraakt of gestimuleerd,
       maar het blijft in de sfeer van teasen en opbouwen — niet van ontlading of daadwerkelijke daad.
       Bijvoorbeeld: langzame of suggestieve aanrakingen, zachte orale of handmatige verkenning,
       uitdagende houdingen of opdrachten met seksuele spanning.
     - De kern van deze fase is opwinding en verleiding — het spel van controle, tempo en verlangen,
       zonder dat er al penetratie of volledige seksuele handelingen plaatsvinden.
  */

  SEXUAL: "STAGE_ENUM.SEXUAL",
  /*
     Volledig seksueel en zonder beperking in aanraking.
     - Doel: seksuele interactie en orgasme.
     - Fysiek contact: alles is toegestaan.
  */
});

/* INTENSITY_ENUM — prikkelsterkte en aanhoudendheid (handelingen-kant).
   • Alleen voor fysieke/seksuele acts (niet voor sfeer).
   • Definieert: tempo, frequentie, duur/continuïteit en ervaren prikkel (druk/ritme).
   • Werkt binnen de “normale” bandbreedte (diepte/maat binnen wat regulier is).
     Alles “groter/dieper/harder dan normaal” valt onder EXTREMITY_ENUM.
   • Relatie tot orgasmes:
     – Bepaalt hoe snel je richting een orgasme gaat, hoe lang je op of net over de grens blijft,
       en of je doorgaans doorstoot naar een volgende golf.
     – EXTREMITY_ENUM kan dit begrenzen (pauze/verminderen/doorzetten voorbij de grens).

   Richtlijn per niveau:
   - VERY_LOW: minimale prikkel; traag en zacht; korte, losse impulsen.
     Doel: subtiele opwarming; orgasme niet actief nagestreefd.
   - LOW: rustige, gelijkmatige prikkel; bescheiden tempo/druk.
     Doel: ontspannen opbouw; orgasme secundair.
   - MEDIUM: steady prikkel; normaal tempo/frequentie; duidelijke sensatie.
     Doel: opbouwende opwinding met progressie richting orgasme, zonder focus of forceren.
   - HIGH: sterke, aanhoudende prikkel; hoger tempo/frequentie.
     Doel: doelgericht toewerken naar orgasme; doorgaans doorpakken na een piek,
           tenzij EXTREMITY terugschakelen vraagt.
   - VERY_HIGH: maximale, vrijwel non-stop prikkel; zeer hoog tempo/frequentie.
     Doel: snelle of meervoudige pieken en blijven op/over de grens van een orgasme;
           terugnemen alleen als EXTREMITY dat voorschrijft.
*/
export const INTENSITY_ENUM = Object.freeze({
  VERY_LOW: "INTENSITY_ENUM.VERY_LOW", // minimale prikkeling; traag, zacht, lichte aanraking
  LOW: "INTENSITY_ENUM.LOW", // rustige prikkeling; bescheiden tempo/druk
  MEDIUM: "INTENSITY_ENUM.MEDIUM", // normale prikkeling; steady tempo/druk
  HIGH: "INTENSITY_ENUM.HIGH", // sterke prikkeling; snel/aanhoudend, duidelijk gericht op climax
  VERY_HIGH: "INTENSITY_ENUM.VERY_HIGH", // maximale prikkeling; non-stop, zeer doelgericht op climax/overprikkeling
});

/* EXTREMITY_ENUM — grensoprekking en hardheid (grenzen-kant)
   • Opdracht wordt ALTIJD uitgevoerd (instemming is geregeld bij deelname).
   • Bepaalt:
     – hoe voorzichtig of ruw de uitvoering is (grenzen, comfort, pijn),
     – in welke mate de uitvoerder rekening houdt met signalen of feedback van de ontvanger,
     – in hoeverre formaat, diepte of druk wordt opgevoerd (binnen of buiten wat aanemelijk normaal is),
     – en hoe wordt omgegaan met de climaxfase (pauzeren, afbouwen of doorgaan).
   • “Normaal” = gebruikelijke maat/diepte/druk voor betrokken spelers; 
     het is een neutrale referentie, niet afhankelijk van persoonlijke grenzen.

   Niveaus:
   - VERY_LOW:
     Grenzen: de ontvanger bepaalt volledig, maar de opdracht wordt altijd uitgevoerd. 
               De uitvoerder volgt strikt binnen deze grenzen.
     Pijn/comfort: geen pijn of discomfort; voorkomen waar mogelijk en direct aanpassen bij signalen.
     Formaat/diepte: klein en ondiep, duidelijk onder normaal. Indien de ontvanger ruimere grenzen aangeeft, 
                     hier rustig naartoe werken zonder te forceren.
     Climax: direct en snel afbouwen naar een pauze of minimale intensiteit zodat herstel kan plaatsvinden.

   - LOW:
     Grenzen: de ontvanger bepaalt bijna volledig; de opdracht wordt altijd uitgevoerd. 
              De uitvoerder mag voorzichtig proberen grenzen iets op te rekken zolang de ontvanger hier niet op reageert.
     Pijn/comfort: minimaal; lichte ongemakken voorkomen of onmiddellijk corrigeren (langzamer, lichter, minder diep). 
                   Meer dan minimaal ongemak mag niet voorkomen.
     Formaat/diepte: iets kleiner of ondieper dan normaal. 
                     Indien de ontvanger ruimere grenzen aangeeft, hier rustig naartoe werken.
     Climax: langzaam en geleidelijk afbouwen naar een pauze of minimale intensiteit zodat herstel mogelijk is.

   - MEDIUM:
     Grenzen: de uitvoerder heeft de regie, maar houdt rekening met comfort, pijn en aangegeven grenzen van de ontvanger. 
              Grenzen worden actief en geleidelijk iets opgerekt voorbij de aangegeven grenzen.
     Pijn/comfort: milde pijn of discomfort kan worden geaccepteerd als onderdeel van opbouw; 
                   abrupte of extreme stappen worden vermeden.
     Formaat/diepte: opbouw verloopt rustig richting een aanemelijk normaal niveau.
     Climax: niet stoppen; afbouwen of terugschakelen in intensiteit en op dat lagere niveau blijven.

   - HIGH:
     Grenzen: de uitvoerder bepaalt de uitvoering; weinig rekening met comfort, pijn, signalen of grenzen van de ontvanger. 
              Grenzen worden stevig opgerekt en kunnen bewust worden overschreden.
     Pijn/comfort: redelijke pijn of discomfort wordt doelmatig ingezet zolang het houdbaar blijft.
     Formaat/diepte: buiten-normaal toegestaan; indien nodig kort aanpassen bij overbelasting, maar niet structureel verminderen.
     Climax: niet stoppen; intensiteit vasthouden en de ontvanger in de climaxfase houden. 
             Daarna tijdelijk afbouwen of terugschakelen in intensiteit en vervolgens voluit verder richting een volgende climax.

   - VERY_HIGH:
     Grenzen: de uitvoerder bepaalt volledig zonder rekening te houden met grenzen, pijn, signalen of comfort van de ontvanger.
     Pijn/comfort: pijn, discomfort en weerstand worden genegeerd zolang de opdracht uitvoerbaar blijft.
     Formaat/diepte: volledig vrij; continu doorgaan, ook bij sterk buiten-normale maat, diepte of druk.
     Climax: geen pauzes of terugschakeling; bewust doorzetten voorbij de climaxgrens en langdurig vasthouden in de climaxfase.
*/
export const EXTREMITY_ENUM = Object.freeze({
  VERY_LOW: "EXTREMITY_ENUM.VERY_LOW",
  LOW: "EXTREMITY_ENUM.LOW",
  MEDIUM: "EXTREMITY_ENUM.MEDIUM",
  HIGH: "EXTREMITY_ENUM.HIGH",
  VERY_HIGH: "EXTREMITY_ENUM.VERY_HIGH",
});

// Act-type (waarop/waardóór de handeling plaatsvindt)
export const ACT_ENUM = Object.freeze({
  MANUAL: "ACT_ENUM.MANUAL",
  ORAL: "ACT_ENUM.ORAL",
  GENITAL: "ACT_ENUM.GENITAL",
  ANAL: "ACT_ENUM.ANAL",
  TOY: "ACT_ENUM.TOY",
  OBJECT: "ACT_ENUM.OBJECT",
});
