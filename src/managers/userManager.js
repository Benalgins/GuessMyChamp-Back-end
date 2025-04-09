const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (userData) => {
	try {
		const user = await User.findOne({ email: userData.email });

		if (!user) {
			throw new Error('Username not found');
		}

		const isValid = await bcrypt.compare(userData.password, user.password);
		if (!isValid) {
			throw new Error('Wrong password');
		}
		return user;
	} catch (error) {
		throw error;
	}
};

exports.register = async (userData) => {
	try {
		const existingUser = await User.findOne({ email: userData.email });
		if (existingUser) {
			throw new Error('User already exists');
		}
		const newUser = await User.create(userData);
		return newUser;
	} catch (error) {
		throw error;
	}
};

exports.topUsers = async () => {
	try {
		const users = await User.find().sort({ points: -1 });

		const usernames = users.map((user) => {
			const namePart = user.email.split('@')[0];
			return {
				username: namePart,
				points: user.points,
			};
		});

		return usernames;
	} catch (error) {
		throw error;
	}
};
