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
  loser: 2,
  winner: 3,
});

// STAGE_ENUM — beschrijft het spanningsverloop van het spel.
// Van onschuldig contact tot volledig seksuele interactie.
export const STAGE_ENUM = Object.freeze({
  INNOCENT: "STAGE_ENUM.INNOCENT",
  /*
    Doel:
      Neutraal en sociaal veilig; luchtig, gezellig en zonder ondeugd of prikkels.
    Mood:
      Onschuldig, ontspannen, vriendelijk.
    Fysiek:
      Alledaags contact zoals een hand, schouder of high-five.
      Geen spanning of plagerij bedoeld.
    Intieme Zones:
      Niet. Geen aanraking, geen nabijheid, geen verwijzing.
    Focus:
      Gewone interactie, lachen, simpele opdrachten zonder lichamelijke toon.
    Kleding:
      Volledig normaal gekleed.
    Voorbeelden:
      High-fiveketting, korte samenwerkingsoefening, oogcontactspel.
  */

  PLAYFUL: "STAGE_ENUM.PLAYFUL",
  /*
    Doel:
      Ondeugend, plagend, licht prikkelend — zonder seksuele ondertoon.
    Mood:
      Speels, uitdagend, charmant, humoristisch.
    Fysiek:
      Mag voorbij sociaal veilige aanraking gaan, zoals kietelen op buik of zij,
      maar blijft weg van intieme zones.
    Intieme Zones:
      Niet. Niet aanraken of benaderen.
    Focus:
      Uitdagen, lachen, spanning creëren door plagen of timing.
    Kleding:
      Gedeeltelijk uitkleden toegestaan tot ondergoed of zwemkleding.
    Voorbeelden:
      Kietelopdracht, speelse houding, “doe je {piece} af” tot ondergoed.
  */

  INTIMATE: "STAGE_ENUM.INTIMATE",
  /*
    Doel:
      Ontdekkend en nabij; spanning door blootstelling en nabijheid, niet door aanraking.
    Mood:
      Teder, warm, nieuwsgierig.
    Fysiek:
      Dichtbij staan, langzaam bewegen, zachte aanraking mogelijk maar niet opwindend.
      Intieme zones worden vermeden of slechts toevallig geraakt.
    Intieme Zones:
      Niet doelbewust. “Zien mag, aanraken niet.”
    Focus:
      Kwetsbaarheid tonen, kijken, poseren, spanning in nabijheid.
    Kleding:
      Volledig uitkleden toegestaan; naakt en kijken is onderdeel van het spel.
    Voorbeelden:
      Naakt poseren op afstand, traag uitkleden, kijkopdrachten zonder aanraking.
  */

  SENSUAL: "STAGE_ENUM.SENSUAL",
  /*
    Doel:
      Verleiding en opwinding opwekken zonder daadwerkelijke seksuele handeling.
    Mood:
      Intens, prikkelend, verleidelijk.
    Fysiek:
      Aanrakingen kunnen intiem zijn, maar blijven teasend of oppervlakkig.
      Bijvoorbeeld borst aanraken zonder nadruk op tepel, of buitenzijde van het geslacht aanraken zonder verder te gaan.
    Intieme Zones:
      Ja, aanraken toegestaan, maar zonder expliciete stimulatie.
    Focus:
      Dichtbij komen, laten zien, verleiden, uitdagen zonder door te zetten.
    Kleding:
      Naakt; kleding kan speels worden ingezet.
    Voorbeelden:
      Exposure-opdracht, “net-niet”-aanraking, tease met oogcontact of houding.
  */

  EROTIC: "STAGE_ENUM.EROTIC",
  /*
    Doel:
      Seksuele aanraking en voorspel; voelen en ervaren staan centraal.
    Mood:
      Zinnelijk, intiem, verlangend.
    Fysiek:
      Zachte stimulatie en lichte seksuele handelingen mogelijk, zoals handmatig of licht oraal.
      Nog gericht op ervaren en opbouwen, niet op afronding.
    Intieme Zones:
      Volledig toegankelijk; aanraken en stimuleren toegestaan.
    Focus:
      Verkennen, voelen, proeven, spelen met tempo en reactie.
    Kleding:
      Naakt; kleding kan creatief worden gebruikt als decoratie of hulpmiddel.
    Voorbeelden:
      Handmatige verkenning, lichte orale aanraking, langzame ritmische tease.
  */

  SEXUAL: "STAGE_ENUM.SEXUAL",
  /*
    Doel:
      Volledig seksuele interactie.
    Mood:
      Passioneel, fysiek, direct.
    Fysiek:
      Alle seksuele handelingen toegestaan; tempo en intensiteit vrij.
    Intieme Zones:
      Volledig vrij.
    Focus:
      Seksuele daad, ritme, opbouw en afronding.
    Kleding:
      Naakt.
    Voorbeelden:
      Penetratie, gericht stimuleren, wisselen tussen ritmes, samen tot hoogtepunt komen.
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

// Waarmee of met welk middel de handeling wordt uitgevoerd
export const ACT_WITH_ENUM = Object.freeze({
  BODY: "ACT_WITH_ENUM.BODY", // algemeen lichaamscontact (wrijven, schuren)
  HAND: "ACT_WITH_ENUM.HAND", // handmatig (handen/vingers)
  MOUTH: "ACT_WITH_ENUM.MOUTH", // mond/tong
  TOY: "ACT_WITH_ENUM.TOY", // speeltje
  OBJECT: "ACT_WITH_ENUM.OBJECT", // willekeurig voorwerp
  GENITAL: "ACT_WITH_ENUM.GENITAL", // eigen geslachtsdeel
});

// Waarop / doellocatie – oplopend van veilig → seksueel beladen
export const ACT_ON_ENUM = Object.freeze({
  // Sociaal veilige/algemene zones (armen, schouders, rug, handen, benen buiten binnenkant, voeten, etc.)
  NEUTRAL_BODY: "ACT_ON_ENUM.NEUTRAL_BODY",

  // Intieme zones (zonder directe genitale/anaal focus).
  // Richtlijn per zone (seksuele lading: light / medium / high) + unisex / geslachtspecifiek
  //
  // • Neck/nek (light–medium): zijkant/achterkant nek, unisex.
  // • Collarbone/sleutelbeen (light): unisex.
  // • Inner arms/binnenkant armen en pols (light): unisex.
  // • Chest/borstkas niet-specifiek (light): unisex.
  // • Breasts/borsten, inclusief tepels/areola (medium–high): typisch vrouwelijk (maar bij mannen: tepels bestaan ook; meestal light–medium afhankelijk van consent/context).
  // • Sides/zij, flanken, ribben (light–medium): unisex, vaak kietel/sensitief.
  // • Abdomen/buik, navelzone (light–medium): unisex.
  // • Hips/heupen (light–medium): unisex; nabij kledingrand kan medium aanvoelen.
  // • Inner thighs/binnenkant bovenbenen (medium–high): unisex, duidelijk intiem door nabijheid genitaliën.
  // • Buttocks/billen, buitenkant (medium): unisex; over kleding meestal medium, direct huid contact kan high aanvoelen.
  // • Lower back/onderrug en tailbone-streek (light–medium): unisex.
  // • Lips/lippen (kussen/zoenen) (medium–high): unisex; mondcontact wordt vaak als intiem ervaren.
  INTIMATE_BODY: "ACT_ON_ENUM.INTIMATE_BODY",
  // Mond/Orale locatie als doel (bijv. iets op/aan/in de mond gericht: kussen, likken, orale handeling ontvangen).
  MOUTH: "ACT_ON_ENUM.MOUTH",
  // Geslachtsdelen
  GENITAL: "ACT_ON_ENUM.GENITAL",
  // Anale zone als doel (extern of intern; je kunt later subgradaties/flags toevoegen).
  ANAL: "ACT_ON_ENUM.ANAL",
});
