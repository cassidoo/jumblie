const defaultSettings = {
	difficulty: "hard",
	theme: "light",
	letters: "lowercase",
	visibilityAssist: false,
};

function getEmoji(index) {
	switch (index) {
		case 0:
			return "🔴";
		case 1:
			return "🟠";
		case 2:
			return "🟢";
		case 3:
			return "🔵";
	}
}
