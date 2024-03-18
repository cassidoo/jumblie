const fs = require("fs");

module.exports = {
	onPreBuild: async () => {
		const supabaseUrl = process.env.SUPABASE_URL;
		const supabaseKey = process.env.SUPABASE_KEY;
		const tableName = "wordlist";
		const outputFile = "./forCheaters.js";

		try {
			const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
				headers: {
					"Content-Type": "application/json",
					apikey: supabaseKey,
				},
			});

			if (!response.ok) {
				throw new Error(
					`Failed to fetch data from Supabase: ${response.status} ${response.statusText}`
				);
			}

			let data = await response.json();
			data = data.sort((a, b) => a.id - b.id);
			console.log(data);

			const fileContent = `const wordList = ${JSON.stringify(data)};`;
			fs.writeFileSync(outputFile, fileContent);

			console.log(`Successfully saved word list to ${outputFile} 🔥`);
		} catch (error) {
			console.error("An error occurred:", error);
		}
	},
};
