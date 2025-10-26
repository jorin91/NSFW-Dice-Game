function canRemoveClothingPiece(key, clothingState) {
  const piece = clothingState[key];
  if (!piece) return false;
  const rules = piece.removeRules || [];
  // alle regels moeten voldoen
  return rules.every((rule) => {
    const notWorn = rule?.notWorn || [];
    return notWorn.every(
      (k) => clothingState[k] && clothingState[k].worn === false
    );
  });
}
