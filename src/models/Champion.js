const mongoose = require('mongoose');

const championSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true,
		enum: ['marksman', 'support', 'top', 'mid', 'jungle'],
	},
	gender: {
		type: String,
		required: true,
		enum: ['male', 'female', 'cosmic', 'demon'],
	},
	range: {
		type: String,
		required: true,
		enum: ['range', 'melee'],
	},
	resource: {
		type: String,
		required: true,
		enum: [
			'mana',
			'manaless',
			'energy',
			'fury',
			'flow',
			'heat',
			'ammo',
			'health',
		],
	},
	region: {
		type: String,
		required: true,
		enum: [
			'demacia',
			'noxus',
			'piltover',
			'zaun',
			'bandle city',
			'shurima',
			'the void',
			'shadow isles',
			'bilgewater',
			'targon',
			'freljord',
			'ixtal',
			'ionia',
			'kathkan',
			'camavor',
		],
	},
	releaseYear: {
		type: Number,
		required: true,
		validate: {
			validator: function (v) {
				const currentYear = new Date().getFullYear();
				return Number.isInteger(v) && v >= 2009 && v <= currentYear;
			},
			message: (props) =>
				`Release year must be between 2009 and the current year. Got: ${props.value}`,
		},
	},
	creator: {
		type: String,
		required: true,
	},
});

const Champion = mongoose.model('Champion', championSchema);
module.exports = Champion;
