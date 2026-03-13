const tipsByHabit = ({ travelKmPerDay = 0, electricityKwh = 0, meatMealsPerDay = 0 }) => {
  const tips = [];
  let savings = 0;

  if (travelKmPerDay > 10) {
    tips.push("Reduce car travel by 30% and use bus/train for short trips.");
    savings += travelKmPerDay * 0.12 * 0.3;
  }
  if (electricityKwh > 6) {
    tips.push("Switch to LED lighting and unplug idle devices.");
    savings += (electricityKwh - 6) * 0.5;
  }
  if (meatMealsPerDay >= 2) {
    tips.push("Replace one meat meal with a plant-based option.");
    savings += 1.2;
  }
  if (!tips.length) {
    tips.push("Great progress. Keep logging activity and target micro-improvements each week.");
    savings += 0.3;
  }

  return {
    eco_tips: tips,
    reduction_plan: [
      "Set a weekly commute cap.",
      "Track appliance usage every evening.",
      "Plan two low-carbon meals this week."
    ],
    estimated_CO2_savings: Number(savings.toFixed(2))
  };
};

export const generateAdvice = (data) => tipsByHabit(data);
