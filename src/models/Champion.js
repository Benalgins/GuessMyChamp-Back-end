const mongoose = require('mongoose');

const championSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	position: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	releaseYear: {
		type: Number,
		required: true,
	},
	creator: {
		type: String,
		required: true,
	},
});

const Champion = mongoose.model('Champion', championSchema);
module.exports = Champion;
