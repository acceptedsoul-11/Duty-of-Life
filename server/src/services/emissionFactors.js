export const EMISSION_FACTORS = {
  car: 0.12,
  bus: 0.07,
  train: 0.04,
  bicycle: 0,
  walking: 0,
  flight: 0.255
};

export const calculateEmissionKg = (distanceKm, mode) => {
  const factor = EMISSION_FACTORS[mode] ?? EMISSION_FACTORS.car;
  return Number((distanceKm * factor).toFixed(2));
};

export const greenerAlternative = (distanceKm, mode) => {
  const current = calculateEmissionKg(distanceKm, mode);
  const alternatives = Object.keys(EMISSION_FACTORS)
    .filter((key) => key !== mode)
    .map((key) => ({
      mode: key,
      emissions: calculateEmissionKg(distanceKm, key)
    }))
    .sort((a, b) => a.emissions - b.emissions);

  const best = alternatives[0];
  const reductionPct = current === 0 ? 0 : Math.round(((current - best.emissions) / current) * 100);
  return { ...best, reductionPct };
};
