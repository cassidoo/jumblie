// Date of start, gonna just say October 3, 2023 for now
const startDate = new Date("October 3, 2023");

let currentDate = new Date();
let timeDifference = currentDate - startDate;
let dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

let wordsForTheDay = wordList[dayDifference % wordList.length];
