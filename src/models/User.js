const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	points: {
		type: Number,
		default: 0,
	},
	championsCreated: {
		type: Array,
		default: [],
	},
});

userSchema.virtual('repeatPassword').set(function (value) {
	if (this.password !== value) {
		throw new Error('Password missmatch');
	}
});

userSchema.pre('save', async function () {
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
