import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// TODO:
// - Clean code
// - For demo purposes, check wether the streak is completed before 10 seconds. Else, reset streak to 0.

function Challenge() {
	const navigate = useNavigate();
	const [tasks, setTasks] = useState([]);
	const [completedTasks, setCompletedTasks] = useState([]);
	const [totalPoints, setTotalPoints] = useState(0);

	const user_id = window.location.pathname.split('/')[2];
	async function getTasks() {
		const response = await fetch(
			`http://localhost:3030/api/challenge/${user_id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const data = await response.json();
		setTasks(data.tasks);
		setCompletedTasks(data.completed_tasks);
		setTotalPoints(data.total_points);
	}

	async function updateStreak(task) {
		console.log(task);
		const response = await fetch(
			`http://localhost:3030/api/streak/${user_id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					user_id: user_id,
					task_id: task.task_id,
				}),
			}
		);

		const data = await response.json();

		if (data.status === 'success') {
			getTasks();
		} else if (data.status === 'done') {
			alert('You have already completed this task today!');
		} else {
			console.log('Error: ', data.message);
		}
	}

	async function removeTask(task) {
		const response = await fetch(
			`http://localhost:3030/api/removeTask/${user_id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					user_id: user_id,
					task_id: task.task_id,
				}),
			}
		);
		const data = await response.json();
		if (data.status === 'success') {
			getTasks();
		} else {
			console.log('Error: ', data.message);
		}
	}

	async function removeCompletedTask(task) {
		const response = await fetch(
			`http://localhost:3030/api/removeCompletedTask/${user_id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					user_id: user_id,
					task_id: task.task_id,
				}),
			}
		);
		const data = await response.json();
		if (data.status === 'success') {
			getTasks();
		} else {
			console.log('Error: ', data.message);
		}
	}

	getTasks();

	return (
		<div className="challenge">
			<div className="challenge-button">
				<button
					onClick={() => navigate(`/create/${user_id}`)}
					className="add-challenge-button"
					type="button"
				>
					Add Challenge
				</button>
				<button
					onClick={() => navigate('/')}
					className="logout-button"
					type="button"
				>
					Logout
				</button>
			</div>
			<div>
				<div className="banner">
					<h1 className="heading-challenge">Your Challenges</h1>
					<h1 className="heading-challenge">Total Points: {totalPoints}</h1>
				</div>
				<ul className="list">
					<div className="column-names">
						<div className="column-name">
							<h2 className="column-name-heading-task">Task</h2>
						</div>
						<div className="column-name">
							<h2 className="column-name-heading">Target</h2>
						</div>
						<div className="column-name">
							<h2 className="column-name-heading">Progress</h2>
						</div>
						<div className="column-name">
							<h2 className="column-name-heading">Next Reward</h2>
						</div>
						<div className="column-name">
							<h2 className="column-name-heading">Status</h2>
						</div>
					</div>
					{tasks.map(task => (
						<li className="list-entry" key={task.id}>
							<h2 className="task-title">{task.title}</h2>
							<div className="target">
								<p className="task-target">{task.target} days</p>
							</div>
							<progress
								className="progress-bar"
								value={(task.current_streak / task.target) * 100}
								max="100"
							/>
							<p className="next-reward">
								{task.rewards - (task.current_streak % task.rewards)} days
							</p>
							<div className="buttons">
								<button
									onClick={() => updateStreak(task)}
									className="list-button"
								>
									Done
								</button>
								<button
									onClick={() => removeTask(task)}
									className="list-button-remove"
								>
									Remove
								</button>
							</div>
						</li>
					))}
				</ul>
				<h1 className="heading-challenge">Completed Challenges</h1>
				<ul className="list">
					<div className="column-names-comp">
						<div className="column-name">
							<h2 className="column-name-heading-task">Task</h2>
						</div>
						<div className="column-name">
							<h2 className="column-name-heading">Target</h2>
						</div>
						<div className="column-name">
							<h2 className="column-name-heading">Points</h2>
						</div>
						<div className="column-name">
							<h2 className="column-name-heading">Remove</h2>
						</div>
					</div>
					{completedTasks.map(task => (
						<li className="completed-list-entry" key={task.id}>
							<h2 className="task-title">{task.title}</h2>
							<div className="target">
								<p className="task-target">{task.target} days</p>
							</div>
							<p className="task-target">{task.points}</p>
							<button
								onClick={() => removeCompletedTask(task)}
								className="list-button-remove-comp"
							>
								Remove
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Challenge;
