export const computeSustainabilityScore = ({
  monthlyEmissionKg = 0,
  challengeParticipation = 0,
  treesPlanted = 0,
  csrImpact = 0,
  communityImpact = 0
}) => {
  const emissionScore = Math.max(0, 40 - monthlyEmissionKg / 10);
  const challengeScore = Math.min(20, challengeParticipation * 4);
  const treeScore = Math.min(20, treesPlanted * 2);
  const csrScore = Math.min(10, csrImpact);
  const socialScore = Math.min(10, communityImpact);
  return Math.round(emissionScore + challengeScore + treeScore + csrScore + socialScore);
};
