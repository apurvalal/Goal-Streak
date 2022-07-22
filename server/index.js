// We are going to make a web app which will record our daily streak of doing tasks.
// Users will be able to sign up and log in. Then they will be able to do tasks and see their progress.
// The app will record the date and time of each task in order to keep track of their streak.
// If the user fails to do a task on a certain day, their streak will be reset.
// If the user does a task on a certain day, their streak will be incremented.
// The app will also keep track of the longest streak ever achieved.

// Folder structure:
// server/
//   index.js
//   package.json
//   models/
//     user.js
//     task.js
// client/
//   src/
//     index.js
//     App.js
//     index.css
//   views/
//     index.html
//     login.html
//     signup.html
//     tasks.html
//     progress.html

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/streak');

// Signup route
app.post('/api/register', (req, res) => {
	try {
		// Check if user already exists
		const user = User.findOne({ email: req.body.email });
		if (user) {
			const { username, email, password } = req.body;
			User.create({
				username,
				email,
				password,
				userId: Math.floor(Math.random() * 1000000),
				current_streak: 0,
				longest_streak: 0,
				last_task_date: null,
				tasks: [],
			});
		}
		res.json({ status: 'success' });
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

// Login route
app.post('/api/login', async (req, res) => {
	const { password } = req.body;
	const user = await User.findOne({ username: req.body.username });
	console.log(password, user.password);
	if (!user) {
		return { status: 'error', message: 'User not found' };
	}
	if (password !== user.password) {
		return res.json({ status: 'error', message: 'Incorrect password' });
	}
	return res.json({ status: 'success', userId: user.userId });
});

// API route for getting the user's current streak
app.post('/api/streak/:id', async (req, res) => {
	try {
		const user = await User.findOne({ userId: req.body.userId });
		if (!user) {
			res.json({ status: 'error', message: 'User not found' });
			throw new Error('User not found');
		}
		res.json({
			status: 'success',
			current_streak: user.current_streak,
			longest_streak: user.longest_streak,
			last_task_date: user.last_task_date,
		});
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

app.put('/api/streak/:id', (req, res) => {
	try {
		const user = User.findOne({ userId: req.body.userId });
		if (!user) {
			res.json({ status: 'error', message: 'User not found' });
			throw new Error('User not found');
		}
		const { current_streak, longest_streak, last_task_date } = req.body;
		User.findOneAndUpdate(
			{ userId: req.body.userId },
			{
				$set: {
					current_streak,
					longest_streak,
					last_task_date,
				},
			},
			{ new: true },
			(err, doc) => {
				if (err) {
					res.json({ status: 'error', message: err.message });
				} else {
					res.json({ status: 'success' });
				}
			}
		);
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

app.listen(3030, () => {
	console.log('Server is running on port 3030');
});
