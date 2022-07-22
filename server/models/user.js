const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		userId: {
			type: Number,
			required: true,
			unique: true,
			index: true,
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		current_streak: {
			type: Number,
			default: 0,
		},
		longest_streak: {
			type: Number,
			default: 0,
		},
		last_task_date: {
			type: Date,
		},
		tasks: [
			{
				type: String,
			},
		],
	},
	{ collection: 'users' }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
