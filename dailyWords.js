// Date of start, gonna just say October 2, 2023 for now
const startDate = new Date("October 2, 2023");

let currentDate = new Date();
let timeDifference = currentDate - startDate;
let dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

let wordsForTheDay = wordList[dayDifference % wordList.length];
