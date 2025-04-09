const express = require('express');
const router = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const PORT = 5000; //Change it if 5000 is used.

const app = express();
app.use(
	cors({
		origin: 'http://localhost:5173', //!!Change it to your localhost based on the FRONT-END !!
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
	.connect('mongodb://127.0.0.1:27017/GuessMyChamp') //Change it to your mongoDB port
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error(err));

app.listen(PORT, console.log(`Listening on port ${PORT}`));
