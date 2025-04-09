const Champion = require('../models/Champion');
const User = require('../models/User');
const mongoose = require('mongoose');

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

exports.UserChampions = async (userEmail) => {
	const normalizedEmail = userEmail.toLowerCase();
	try {
		const champions = await Champion.find({ creator: normalizedEmail }).select(
			'name position gender releaseYear'
		);
		return champions;
	} catch (error) {
		throw error;
	}
};

exports.deleteChampion = async (championId) => {
	try {
		const champion = await Champion.findById(championId);

		if (!champion) {
			throw new Error('Champion not found');
		}

		const userEmail = champion.creator;
		const user = await User.findOne({ email: userEmail });

		if (!user) {
			throw new Error('User not found');
		}

		user.points -= 10;
		await user.save();
		const deletedChampion = await Champion.findByIdAndDelete(championId);

		if (!deletedChampion) {
			throw new Error('Error deleting champion');
		}

		return { deletedChampion, user };
	} catch (error) {
		throw error;
	}
};

exports.getChampionById = async (id) => {
	const mongoose = require('mongoose');
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new Error('Invalid ID');
	}

	const champion = await Champion.findById(id);
	return champion;
};

exports.updateChampion = async (id, updatedData) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		throw new Error('Invalid champion ID');
	}

	const champion = await Champion.findById(id);
	if (!champion) {
		throw new Error('Champion not found');
	}

	champion.name = updatedData.name || champion.name;
	champion.gender = updatedData.gender || champion.gender;
	champion.position = updatedData.position || champion.position;
	champion.releaseYear = updatedData.releaseYear || champion.releaseYear;

	await champion.save();

	return champion;
};
