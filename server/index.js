const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
				user_id: Math.floor(Math.random() * 1000000),
				tasks: [],
				completed_tasks: [],
			});
			console.log('User created');
		} else {
			console.log(user);
		}
		res.json({ status: 'success', user_id: user.user_id });
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

// Login route
app.post('/api/login', async (req, res) => {
	console.log('login');
	const { password } = req.body;
	console.log(req.body);
	const user = await User.findOne({ username: req.body.username });
	if (!user) {
		return { status: 'error', message: 'User not found' };
	}
	if (password !== user.password) {
		return res.json({ status: 'error', message: 'Incorrect password' });
	}
	return res.json({ status: 'success', user_id: user.user_id });
});

// API route for getting the user's current streak
app.post('/api/streak/:id', async (req, res) => {
	console.log('streak-post');
	try {
		const user = await User.findOne({ user_id: req.body.user_id });
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

app.put('/api/streak/:id', async (req, res) => {
	console.log('streak-put');
	try {
		const user = await User.findOne({ user_id: req.body.user_id });
		if (!user) {
			res.json({ status: 'error', message: 'User not found' });
		}
		const { task_id } = req.body;
		const task = user.tasks.find(task => task.task_id === task_id);
		if (!task) {
			res.json({ status: 'error', message: 'Task not found' });
		} else {
			const today = new Date();
			const taskDate = new Date(task.last_task_date);
			if (today.getDate() === taskDate.getDate() && task.points > 0) {
				res.json({ status: 'done' });
			} else {
				const diff = Math.abs(today - taskDate);
				const days = Math.floor(diff / (1000 * 60 * 60 * 24));
				if (days > 1) {
					task.current_streak = 0;
				}
				task.current_streak++;
				task.last_task_date = new Date();
				if (task.current_streak % task.rewards === 0) {
					task.points += task.reward_amount;
					user.total_points += task.reward_amount;
				} else {
					task.points++;
					user.total_points++;
				}
				if (task.current_streak === task.target) {
					completed_task = {
						task_id: task.task_id,
						date: task.last_task_date,
						points: task.points,
						target: task.target,
						title: task.title,
					};
					user.completed_tasks.push(completed_task);
					user.tasks = user.tasks.filter(task => task.task_id !== task_id);
				}
				user.save();
				res.json({ status: 'success' });
			}
		}
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

app.post('/api/removeTask/:id', async (req, res) => {
	console.log('removeTask');
	try {
		const user = await User.findOne({ user_id: req.body.user_id });
		if (!user) {
			res.json({ status: 'error', message: 'User not found' });
		}
		const { task_id } = req.body;
		const task = user.tasks.find(task => task.task_id === task_id);
		if (!task) {
			res.json({ status: 'error', message: 'Task not found' });
		} else {
			user.tasks = user.tasks.filter(task => task.task_id !== task_id);
			user.save();
			res.json({ status: 'success' });
		}
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

app.post('/api/removeCompletedTask/:id', async (req, res) => {
	console.log('removeCompletedTask');
	try {
		const user = await User.findOne({ user_id: req.body.user_id });
		if (!user) {
			res.json({ status: 'error', message: 'User not found' });
		}
		const { task_id } = req.body;
		const task = user.completed_tasks.find(task => task.task_id === task_id);
		if (!task) {
			res.json({ status: 'error', message: 'Task not found' });
		}
		user.completed_tasks = user.completed_tasks.filter(
			task => task.task_id !== task_id
		);
		user.save();
		res.json({ status: 'success' });
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

app.post('/api/challenge/:id', async (req, res) => {
	console.log('challenge');
	try {
		const user = await User.findOne({ user_id: req.body.user_id });
		if (!user) {
			throw new Error('User not found');
		}

		const { title, target, rewards, reward_amount } = req.body;
		const task = {
			title,
			target,
			task_id: Math.floor(Math.random() * 1000000),
			rewards,
			reward_amount,
		};
		user.tasks.push(task);
		user.save();
		res.json({ status: 'success' });
	} catch (err) {
		res.json({ status: 'error', message: err.message });
	}
});

app.get('/api/challenge/:id', async (req, res) => {
	console.log('challenge-get');
	const user = await User.findOne({ user_id: req.params.id });
	if (!user) {
		res.json({ status: 'error', message: 'User not found' });
	}
	res.json({
		status: 'success',
		tasks: user.tasks,
		completed_tasks: user.completed_tasks,
		total_points: user.total_points,
	});
});

app.listen(3030, () => {
	console.log('Server is running on port 3030');
});
