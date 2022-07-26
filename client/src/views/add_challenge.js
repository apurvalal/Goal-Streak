import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../App.css';

function AddChallenge() {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [target, setTarget] = useState('');
	const [rewards, setRewards] = useState('');
	const [rewardAmount, setRewardAmount] = useState('');

	async function addChallenge(event) {
		const user_id = window.location.pathname.split('/')[2];
		event.preventDefault();
		const response = await fetch(
			`http://localhost:3030/api/challenge/${user_id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					user_id: user_id,
					title: title,
					target: parseInt(target),
					rewards: parseInt(rewards),
					reward_amount: parseInt(rewardAmount),
				}),
			}
		);

		const data = await response.json();
		if (data.status === 'success') {
			navigate(`/challenges/${user_id}`);
		} else {
			console.log('Error: ', data.message);
		}
	}
	return (
		<div className="lr">
			<div className="register">
				<h1 className="heading">Add Challenge</h1>
				<form onSubmit={addChallenge}>
					<label className="label">Task Title:</label>
					<input
						className="input-field"
						type="text"
						value={title}
						onChange={e => setTitle(e.target.value)}
					/>
					<label className="label">Target Streak(in days):</label>
					<input
						className="input-field"
						type="number"
						value={target}
						onChange={e => setTarget(e.target.value)}
					/>
					<label className="label">Reward every:</label>
					<input
						className="input-field"
						type="number"
						value={rewards}
						onChange={e => setRewards(e.target.value)}
					/>

					<label className="label">Reward amount:</label>
					<input
						className="input-field"
						type="number"
						value={rewardAmount}
						onChange={e => setRewardAmount(e.target.value)}
					/>
					<button className="input-button" type="submit">
						Add Challenge
					</button>
				</form>
			</div>
		</div>
	);
}

export default AddChallenge;
