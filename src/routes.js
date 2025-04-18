const router = require('express').Router();

const userManager = require('./managers/userManager');
const championManager = require('./managers/championManager');

router.post('/register', async (req, res) => {
	const userData = req.body;
	const userId = req.cookies['userId'];
	if (userId) {
		return res.status(200).json({ message: 'User already logged in', userId });
	}
	try {
		const newUser = await userManager.register(userData);

		req.session.email = newUser.email;
		res.cookie('userId', newUser._id.toString());

		res.status(200).json({
			message: 'User registered successfully.',
			user: newUser,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.post('/login', async (req, res) => {
	const userData = req.body;
	try {
		const loginUser = await userManager.login(userData);
		req.session.email = loginUser.email;

		res.cookie('userId', loginUser._id.toString());
		res.status(200).json({ message: 'Wellcome', user: loginUser });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.post('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			console.error('Session destroy error:', error);
			return res.status(500).json({ message: 'Logout failed' });
		}

		res.clearCookie('userId');
		res.status(200).json({ message: 'Logged out successfully' });
	});
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
router.get('/catalog', async (req, res) => {
	try {
		const champions = await championManager
			.GiveAllChampions()
			.select('name -_id')
			.sort({ name: 1 });
		res.status(200).json(champions.map((c) => c.name));
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error fetching champions', error: error.message });
	}
});

router.get('/leaderboard', async (req, res) => {
	try {
		const users = await userManager.topUsers();
		res.status(200).json(users);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error fetching users', error: error.message });
	}
});

router.get('/my-champions', async (req, res) => {
	const userEmail = req.session.email;
	if (!userEmail) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const userChampions = await championManager.UserChampions(userEmail);
		res.status(200).json(userChampions);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error fetching Data', error: error.message });
	}
});

router.delete('/champions/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const { deletedChampion, user } = await championManager.deleteChampion(id);

		res.status(200).json({
			message: 'Champion deleted successfully, and 10 points deducted.',
			champion: deletedChampion,
			updatedUser: user,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get('/champions/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const champion = await championManager.getChampionById(id);
		if (!champion) {
			return res.status(404).json({ message: 'Champion not found' });
		}

		res.status(200).json(champion);
	} catch (error) {
		res
			.status(500)
			.json({ message: 'Error retrieving champion', error: error.message });
	}
});

router.put('/champions/:id', async (req, res) => {
	try {
		const updated = await championManager.updateChampion(
			req.params.id,
			req.body
		);
		res
			.status(200)
			.json({ message: 'Champion updated successfully', champion: updated });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.get('/demo', async (req, res) => {
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
