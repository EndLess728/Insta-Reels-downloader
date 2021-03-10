export default function () {
  let dateTime;
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds
  var milisecond = new Date().getMilliseconds(); //Current MiliSeconds

  dateTime = `-${date}${month}${year}-${hours}${min}${sec}-${milisecond}`;

  return dateTime;
}
