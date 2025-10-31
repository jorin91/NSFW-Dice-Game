const Dice = {
  id: 0,
  faces: [1, 2, 3, 4, 5, 6],
  value: 6,

  // Werpt de dobbelsteen en slaat de uitkomst op
  roll() {
    const rand = Math.floor(Math.random() * this.faces.length);
    this.value = this.faces[rand];
    return this.value;
  },

  // Geeft het huidige nummer terug (zonder nieuwe worp)
  getValue() {
    return this.value ?? this.roll(); // als nog niet gerold, doe dat nu
  },

  // Geeft het pad naar de juiste afbeelding terug
  getImagePath() {
    const v = this.getValue();
    return `../media/dice_${v}.png`;
  },

  // Helper: voert roll uit en retourneert meteen de afbeelding
  rollAndGetImage() {
    this.roll();
    return this.getImagePath();
  },
};

// Functie: maakt een nieuwe dobbelsteeninstantie met id
export function createDiceInstance(id) {
  const newDice = structuredClone(Dice); // maakt diepe kopie
  newDice.id = id;
  return newDice;
}

// Functie: maakt een lijst van dobbelstenen met automatisch ID
export function createDiceSet(amount = 1) {
  const diceSet = [];
  for (let i = 1; i <= amount; i++) {
    const id = `dice${i}`;
    const dice = createDiceInstance(id);
    diceSet.push(dice);
  }
  return diceSet;
}
