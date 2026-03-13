export const resolveBadges = ({ score = 0, treesPlanted = 0, emissionReduction = 0 }) => {
  const badges = new Set();
  if (emissionReduction >= 10) badges.add("Carbon Reducer");
  if (treesPlanted >= 5) badges.add("Tree Guardian");
  if (score >= 70) badges.add("Earth Protector");
  if (score >= 90 && treesPlanted >= 10) badges.add("Climate Hero");
  return [...badges];
};
