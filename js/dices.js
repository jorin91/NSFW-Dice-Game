// Bestaand basismodel
const Dice = {
  id: 0,
  faces: [1, 2, 3, 4, 5, 6],
  value: 6,
  hold: false,

  roll() {
    const rand = Math.floor(Math.random() * this.faces.length);
    this.value = this.faces[rand];
    return this.value;
  },

  getValue() {
    return this.value ?? this.roll();
  },

  getImagePath() {
    const v = this.getValue();
    return `media/dice_${v}.png`;
  },

  rollAndGetImage() {
    this.roll();
    return this.getImagePath();
  },
};

// Maakt een nieuwe instance met eigen state, gebaseerd op Dice
export function createDiceInstance(id, value = null) {
  const inst = Object.create(Dice); // erft methodes van Dice
  inst.id = id; // eigen id
  inst.value = value; // start zonder waarde
  inst.faces = Dice.faces.slice(0); // eigen kopie van faces-array
  return inst;
}

export function createDiceSet(amount = 1) {
  const diceSet = [];
  for (let i = 1; i <= amount; i++) {
    diceSet.push(createDiceInstance(`dice${i}`));
  }
  return diceSet;
}

export function bindDiceToImage(dice, imgEl) {
  // init
  const refresh = () => {
    imgEl.src = dice.getImagePath();
    imgEl.alt = `Dice ${dice.getValue()}`;
  };
  refresh();

  // patch roll zodat het element altijd meeloopt
  const originalRoll = dice.roll.bind(dice);
  dice.roll = function () {
    const val = originalRoll();
    refresh();
    return val;
  };

  // optioneel handig: expliciet setValue met refresh
  dice.setValue = function (v) {
    if (dice.faces.includes(v)) {
      dice.value = v;
      refresh();
    }
    return dice.value;
  };

  // expose een refresh helper op het object
  dice.refresh = refresh;

  return dice; // zelfde object, nu met img-binding
}

export function rollAllDice(DiceSet = []) {
  if (!Array.isArray(DiceSet) || DiceSet.length === 0) return;

  /*
  DiceSet.forEach(dice => {
    if (!dice.hold) dice.roll();   // alleen rollen als hold == false
  });
  */

  animateRollAllDice(DiceSet, {
    frameMs: 70, // trager/sneller "ratelen"
    durationMs: 1000, // totale duur per steen
    staggerMs: 150, // hoeveel ms tussen elke start
  });

  gameSaveState(); // optioneel, zodat de waarden bewaard blijven
}

function animateSingleDice(
  dice,
  {
    frameMs = 60, // hoe snel een nieuw "frame"
    durationMs = 700, // totale animatieduur voor deze steen
    respectHold = true, // sla hold-stenen over
  } = {}
) {
  return new Promise((resolve) => {
    if (respectHold && dice.hold) {
      // niet animeren; wel zorgen dat de UI klopt
      dice.refresh?.();
      return resolve(false);
    }

    const start = Date.now();
    const tick = setInterval(() => {
      // tussentijds willekeurige waarde laten 'flikkeren'
      const rand = 1 + Math.floor(Math.random() * 6);
      dice.value = rand;
      dice.refresh?.();

      const elapsed = Date.now() - start;
      if (elapsed >= durationMs) {
        clearInterval(tick);
        // echte worp als eindresultaat
        dice.roll(); // jouw gepatchte roll() triggert refresh
        resolve(true);
      }
    }, frameMs);
  });
}

// Roll alle dobbelstenen met een kleine "stagger" zodat ze 1 voor 1 eindigen
export async function animateRollAllDice(
  DiceSet = [],
  {
    frameMs = 60,
    durationMs = 700,
    staggerMs = 120, // vertraging tussen starten per steen
    respectHold = true,
  } = {}
) {
  if (!Array.isArray(DiceSet) || DiceSet.length === 0) return;

  const jobs = [];
  DiceSet.forEach((dice, i) => {
    const job = new Promise((resolve) => {
      setTimeout(async () => {
        await animateSingleDice(dice, { frameMs, durationMs, respectHold });
        resolve();
      }, i * staggerMs);
    });
    jobs.push(job);
  });

  await Promise.all(jobs);
  gameSaveState?.(); // waarden bewaren na alle animaties
}
