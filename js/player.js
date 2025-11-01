import { deepCopy } from "./utils.js";
import { gameSaveState } from "./gamestate.js";

export const PLAYER_MODEL = {
  id: null,
  name: null,
  age: 18,
  sex: null,
  preferSex: null,
  consent: false,
  score: 0,
  roundScore: 0,
  executedTasks: 0,
  safe: false, //  <- Safe = ronde gewonnen dus geen opdracht
  clothing: null, // <- niet vooraf invullen met kopie
};

export function createPlayer(name, sex, age, preferSex, consent, clothing) {
  const player = getPlayerModel();
  player.id = crypto.randomUUID();
  player.name = name;
  player.sex = sex;
  player.age = age;
  player.preferSex = preferSex;
  player.consent = consent;
  player.clothing = clothing;

  window.GAME.players.push(player);
  gameSaveState();
}

export function getPlayerModel() {
  return deepCopy(PLAYER_MODEL);
}
