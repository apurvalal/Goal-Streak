// TODO:
// 1. Check if PUT request is working. (Done)
// 2. Implement longest streak check. (Done)
// 3. Implement streak reset check. (Done)
// 4. Design a better UI. (Done)
// 5. last_task_date is undefined. (Done)
// 6. Fetch tasks
// 7. Add progress bar (Done)

import React from 'react';
import '../App.css';

function Tasks() {
	const [streak, setStreak] = React.useState(0);
	const [longestStreak, setLongestStreak] = React.useState(0);

	const tasks = [
		{
			task: 'Learn React',
			completed: false,
		},
		{
			task: 'Learn Node',
			completed: false,
		},
		{
			task: 'Learn MongoDB',
			completed: false,
		},
		{
			task: 'Learn Express',
			completed: false,
		},
	];

	const userId = window.location.pathname.split('/')[2];

	function getDateDiff(date1, date2) {
		const diff = Math.abs(date2 - date1);
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		return days;
	}

	function getDateDiffMilliseconds(date1, date2) {
		const diff = Math.abs(date2 - date1);
		return diff;
	}

	async function markTaskAsComplete() {
		const getResponse = await fetch(
			`http://localhost:3030/api/streak/${userId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
				}),
			}
		);

		const data = await getResponse.json();
		const { current_streak, longest_streak, last_task_date } = data;
		if (last_task_date === null) {
			console.log('If 1st');
			await fetch(`http://localhost:3030/api/streak/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
					current_streak: current_streak + 1,
					longest_streak: longest_streak + 1,
					// last_task_date: new Date(),
					last_task_date: Date.now(),
				}),
			});
			setStreak(current_streak + 1);
			setLongestStreak(longest_streak + 1);
			// } else if (getDateDiff(last_task_date, new Date()) > 1) {
		} else if (
			getDateDiffMilliseconds(new Date(data.last_task_date), Date.now()) >
				10000 ||
			current_streak + 1 === 30
		) {
			await fetch(`http://localhost:3030/api/streak/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
					current_streak: 0,
					// last_task_date: new Date(),
					last_task_date: Date.now(),
				}),
			});
			setStreak(0);
			if (current_streak + 1 === 30) {
				await fetch(`http://localhost:3030/api/streak/${userId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: userId,
						longest_streak: 30,
					}),
				});
				setLongestStreak(30);
			}
			// } else if (getDateDiff(last_task_date, new Date()) === 1) {
		} else if (
			getDateDiffMilliseconds(new Date(data.last_task_date), Date.now()) <=
			10000
		) {
			console.log('If 3rd');
			if (current_streak + 1 > longest_streak) {
				await fetch(`http://localhost:3030/api/streak/${userId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: userId,
						current_streak: current_streak + 1,
						longest_streak: current_streak + 1,
						// last_task_date: new Date(),
						last_task_date: Date.now(),
					}),
				});
				setStreak(current_streak + 1);
				setLongestStreak(current_streak + 1);
			} else {
				await fetch(`http://localhost:3030/api/streak/${userId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: userId,
						current_streak: current_streak + 1,
						// last_task_date: new Date(),
						last_task_date: Date.now(),
					}),
				});
				setStreak(current_streak + 1);
				setLongestStreak(longest_streak);
			}
		} else {
			await fetch(`http://localhost:3030/api/streak/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
					last_task_date: new Date(),
				}),
			});
			setStreak(current_streak);
			setLongestStreak(longest_streak);
		}
	}

	return (
		<div className="tasks">
			<h1 className="heading">Tasks</h1>
			<ul className="complete-list">
				{tasks.map(task => (
					<li className="list-items" key={task.task}>
						{task.task}
						<button className="list-button" onClick={markTaskAsComplete}>
							Mark as complete
						</button>
					</li>
				))}
			</ul>
			<div className="streaks">
				<div className="streak-container">
					<h2 className="heading-streak">Current Streak:</h2>
					<p className="progress-text">{streak}</p>
					<progress
						className="progress-bar"
						value={(streak / 30) * 100}
						max="100"
					/>
				</div>
				<div className="streak-container">
					<h2 className="heading-streak">Longest Streak:</h2>
					<p className="progress-text">{longestStreak}</p>
				</div>
			</div>
		</div>
	);
}
export default Tasks;
