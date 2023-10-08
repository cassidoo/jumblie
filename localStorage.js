function updateStreakAndFastestTimes(time, scoreString) {
	const currentDate = new Date();
	let now = `${
		currentDate.getMonth() + 1
	}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
	const lastPlayedDate = localStorage.getItem("lastPlayedDate");

	if (lastPlayedDate) {
		const lastDate = new Date(lastPlayedDate);
		lastDate.setDate(lastDate.getDate() + 1);
		const yesterday = new Date(now);
		yesterday.setDate(yesterday.getDate() - 1);

		if (lastDate.getTime() !== yesterday.getTime()) {
			localStorage.setItem("currentStreak", "1");
		}
	}

	localStorage.setItem("lastPlayedDate", now);

	let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
	currentStreak++;
	localStorage.setItem("currentStreak", currentStreak);

	let longestStreak = parseInt(localStorage.getItem("longestStreak")) || 0;
	if (currentStreak > longestStreak) {
		localStorage.setItem("longestStreak", currentStreak);
	}

	let totalDaysPlayed = parseInt(localStorage.getItem("totalDaysPlayed")) || 0;
	totalDaysPlayed++;
	localStorage.setItem("totalDaysPlayed", totalDaysPlayed);

	let fastestTimes = JSON.parse(localStorage.getItem("fastestTimes")) || [];
	fastestTimes.push({ time, date: now });
	fastestTimes.sort((a, b) => a.time - b.time);
	if (fastestTimes.length > 3) {
		fastestTimes.pop();
	}
	localStorage.setItem("fastestTimes", JSON.stringify(fastestTimes));

	localStorage.setItem("latestScoreString", scoreString);
}

function hasPlayedToday() {
	let today = new Date();
	let now = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
	let lastPlayedDate = localStorage.getItem("lastPlayedDate");

	return lastPlayedDate === now;
}
