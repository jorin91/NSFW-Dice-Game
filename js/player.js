function createPlayer(name, sex, age, preferSex, consent) {
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
