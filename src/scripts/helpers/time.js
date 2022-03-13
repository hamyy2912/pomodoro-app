/**
 * CALCULATE ESTIMATE FINISH TIME
 * @param {number} number of acted pomodoro
 * @param {number} number of estimated pomodoro
 */
export const calculateFinishTime = (actPomo, estPomo) => {
  const now = new Date();
  const breakTime = 5 * (estPomo - actPomo);
  const workingTime = 25 * (estPomo - actPomo);
  const totalTime = breakTime + workingTime;
  const totalHour = parseInt(totalTime / 60);
  const totalMinute = totalTime - (60 * totalHour);

  let estMinute;
  let estHour;
  if (now.getMinutes() + totalMinute > 59) {
    estMinute = (now.getMinutes() + totalMinute) - 60;
    estHour = now.getHours() + totalHour + 1;
  } else {
    estMinute = now.getMinutes() + totalMinute;
    estHour = now.getHours() + totalHour;
  }
  estHour = estHour > 23 ? estHour - 24 : estHour;

  estHour = estHour < 10 ? '0' + estHour : estHour;
  estMinute = estMinute < 10 ? '0' + estMinute : estMinute;
  return [estHour, estMinute];
};
