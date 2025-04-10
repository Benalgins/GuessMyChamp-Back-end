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
		enum: ['Male', 'Female', 'Cosmic', 'Demon'],
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
