const Champion = require('../models/Champion');
const User = require('../models/User');

exports.addChampion = async (championData) => {
	try {
		const response = await fetch(
			'https://ddragon.leagueoflegends.com/cdn/15.7.1/data/en_US/champion.json'
		);
		const championsData = await response.json();
		const championsList = Object.keys(championsData.data);

		if (!championsList.includes(championData.name)) {
			throw new Error('Champion not found in the League of Legends database');
		}

		const newChampion = new Champion({
			name: championData.name,
			position: championData.position,
			gender: championData.gender,
			releaseYear: Number(championData.releaseYear),
			creator: championData.creator,
		});

		await newChampion.save();

		await User.findOneAndUpdate(
			{ email: championData.creator },
			{
				$push: { championsCreated: championData.name },
				$inc: { points: 10 },
			},
			{ new: true }
		);

		return newChampion;
	} catch (error) {
		throw error;
	}
};

exports.GiveAllChampions = async () => {
	try {
		const champions = await Champion.find().select('name').sort({ name: 1 });
		return champions;
	} catch (error) {
		throw error;
	}
};
