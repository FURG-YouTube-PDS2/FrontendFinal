import moment from "moment";
import "moment/locale/pt-br";

export const diffDate = (dateOne, dateTwo) => {
  var momOne = moment(dateOne);
  var momTwo = moment(dateTwo);
  var diff = momOne.diff(momTwo);
  var diffDur = moment.duration(diff);
  var minutes = diffDur.asMinutes();

  if (minutes < 1) {
    return "Há " + diffDur.seconds() + " Segundo(s)";
  } else if (minutes <= 60) {
    return "Há " + diffDur.minutes() + " Minuto(s)";
  } else if (minutes <= 1440) {
    return "Há " + diffDur.hours() + " Hora(s)";
  } else if (minutes <= 10080) {
    return "Há " + diffDur.days() + " Dia(s)";
  } else if (minutes <= 43800) {
    return "Há " + diffDur.weeks() + " Semana(s)";
  } else if (minutes <= 525600) {
    return "Há " + diffDur.months() + " Mes(es)";
  } else {
    return "Há " + diffDur.years() + " Ano(s)";
  }
};

export const nowTime = () => {
  moment.locale("pt-br");
  return moment().format("LT");
};
