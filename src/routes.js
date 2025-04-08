const { v4: uuid } = require('uuid');
const router = require('express').Router();

const userManager = require('./managers/userManager');
const championManager = require('./managers/championManager');

router.post('/register', async (req, res) => {
	const userData = req.body;
	const userId = req.cookies['userId'];
	if (userId) {
		return res.status(200).json({ message: 'User already logged in', userId });
	} else {
		const newUserId = uuid();
		res.cookie('userId', newUserId, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		try {
			const newUser = await userManager.register(userData);
			res
				.status(200)
				.json({ message: 'User registered successfully.', user: newUser });
		} catch (error) {
			res.status(400).json({ message: error.message });
		}
	}
});

router.post('/login', async (req, res) => {
	const userData = req.body;
	try {
		const loginUser = await userManager.login(userData);
		req.session.email = loginUser.email;
		const newUserId = uuid();
		res.cookie('userId', newUserId, {
			httpOnly: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.status(200).json({ message: 'Wellcome', user: loginUser });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.post('/add-champion', async (req, res) => {
	const championData = req.body;
	const userEmail = req.session.email;
	if (!userEmail) {
		return res.status(400).json({ message: 'User not logged in' });
	}

	const championWithEmail = { ...championData, creator: userEmail };
	try {
		const newChampion = await championManager.addChampion(championWithEmail);
		res.status(200).json({
			message: 'Champion added sucssesfully',
			champion: newChampion,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get('/catalog', async (req, res) => {
	try {
		const champions = await championManager.GiveAllChampions();
		res.status(200).json(champions);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error fetching champions', error: error.message });
	}
});

module.exports = router;
