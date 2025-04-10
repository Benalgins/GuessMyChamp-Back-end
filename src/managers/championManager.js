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
		const existingChamp = await Champion.findOne({
			name: championData.name,
		});
		const championName = championData.name;
		if (existingChamp) {
			throw new Error('Champion already exists');
		}
		if (!championsList.includes(championName)) {
			throw new Error('Champion not found in the League of Legends database');
		}

		const newChampion = new Champion({
			name: championData.name,
			position: championData.position.toLowerCase(),
			gender: championData.gender.toLowerCase(),
			resource: championData.resource.toLowerCase(),
			range: championData.range.toLowerCase(),
			region: championData.region.toLowerCase(),
			releaseYear: Number(championData.releaseYear),
			creator: championData.creator.toLowerCase(),
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
		const champions = await Champion.find();
		return champions;
	} catch (error) {
		throw error;
	}
};

exports.UserChampions = async (userEmail) => {
	const normalizedEmail = userEmail.toLowerCase();
	try {
		const champions = await Champion.find({ creator: normalizedEmail }).select(
			'name position gender releaseYear region range resource'
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
		user.championsCreated = user.championsCreated.filter(
			(name) => name !== champion.name
		);

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
	const existingChamp = await Champion.findOne({ name: updatedData.name });
	if (existingChamp && existingChamp._id.toString() !== id) {
		throw new Error('Champion with this name already exists');
	}
	if (updatedData.releaseYear !== undefined) {
		const year = Number(updatedData.releaseYear);
		const currentYear = new Date().getFullYear();
		if (!Number.isInteger(year) || year < 2009 || year > currentYear) {
			throw new Error(`Release year must be between 2009 and ${currentYear}`);
		}
	}
	const champion = await Champion.findById(id);
	if (!champion) {
		throw new Error('Champion not found');
	}

	champion.name = updatedData.name || champion.name;
	champion.gender =
		updatedData.gender.toLowerCase() || champion.gender.toLowerCase();
	champion.position =
		updatedData.position.toLowerCase() || champion.position.toLowerCase();
	champion.range =
		updatedData.range.toLowerCase() || champion.range.toLowerCase();
	champion.region =
		updatedData.region.toLowerCase() || champion.region.toLowerCase();
	champion.resource =
		updatedData.resource.toLowerCase() || champion.resource.toLowerCase();
	champion.releaseYear = updatedData.releaseYear || champion.releaseYear;

	await champion.save();

	return champion;
};
