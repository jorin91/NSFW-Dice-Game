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
  const inst = Object.create(Dice);     // erft methodes van Dice
  inst.id = id;                         // eigen id
  inst.value = value;                    // start zonder waarde
  inst.faces = Dice.faces.slice(0);     // eigen kopie van faces-array
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
