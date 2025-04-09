const express = require('express');
const router = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./managers/userManager');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: 'apple',
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000,
		},
	})
);

app.use(router);

mongoose
	.connect('mongodb://127.0.0.1:27017/GuessMyChamp')
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error(err));

app.listen(5000, console.log('Listening on port 5000'));
