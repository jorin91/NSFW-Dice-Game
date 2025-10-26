import { deepCopy } from "./utils";
import { CLOTHING_MODEL } from './clothing.js';

export const PLAYER_MODEL = {
  id: null,
  name: null,
  age: 18,
  sex: null,
  preferSex: null,
  consent: false,
  score: 0,
  safe: false, //  <- Safe = ronde gewonnen dus geen opdracht
  clothing: null, // <- niet vooraf invullen met kopie
};

export function createPlayer(name, sex, age, preferSex, consent) {
  const player = deepCopy(PLAYER_MODEL);
  player.id = crypto.randomUUID();
  player.name = name;
  player.sex = sex;
  player.age = age;
  player.preferSex = preferSex;
  player.consent = consent;
  
  player.clothing = deepCopy(CLOTHING_MODEL); // <- kopie hier
  return player;
}
