const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		user_id: {
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
		total_points: {
			type: Number,
			required: true,
			default: 0,
		},
		tasks: [
			{
				title: {
					type: String,
					required: true,
				},
				target: {
					type: Number,
					required: true,
				},
				task_id: {
					type: Number,
					required: true,
				},
				rewards: {
					type: Number,
					required: true,
					default: 1,
				},
				current_streak: {
					type: Number,
					required: true,
					default: 0,
				},
				last_task_date: {
					type: Date,
					required: true,
					default: new Date(),
				},
				points: {
					type: Number,
					required: true,
					default: 0,
				},
				reward_amount: {
					type: Number,
					required: true,
					default: 1,
				},
			},
		],
		completed_tasks: [
			{
				title: {
					type: String,
					required: true,
				},
				target: {
					type: Number,
					required: true,
				},
				task_id: {
					type: Number,
					required: true,
				},
				points: {
					type: Number,
					required: true,
					default: 1,
				},
				date: {
					type: Date,
					required: true,
					default: new Date(),
				},
			},
		],
	},
	{ collection: 'users' }
);

UserSchema.statics = {
	async get(id) {
		return await this.findOne({ user_id: id }).populate('tasks').exec();
	},
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
