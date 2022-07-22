// In this page, we will display the tasks of the user. The tasks will have a button that will allow the user to mark the task as complete.
// On marking the task as complete, the user will be congratulated and the streak will be increased.
// We will also display the current streak and the longest streak.
// We will fetch the tasks from the database and display them in a list.
// We will update the database when the user marks a task as complete.

// TODO:
// 1. Check if PUT request is working. (Done)
// 2. Implement longest streak check.
// 3. Implement streak reset check.
// 4. Design a better UI. (Done)
// 5. last_task_date is undefined. (Done)
// 6. Fetch tasks
// 7. Add progress bar

import React from 'react';
import '../App.css';

function Tasks() {
	// We will fetch the tasks from the database and display them in a list.
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

	//const userId = this.props.match.params.userId;
	// const userId = window.location.pathname.split('/')[2];
	const userId = 840911;
	function getDateDiff(date1, date2) {
		const diff = Math.abs(date2 - date1);
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		return days;
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
					last_task_date: new Date(),
				}),
			});
			setStreak(current_streak + 1);
			setLongestStreak(longest_streak + 1);
		} else if (getDateDiff(last_task_date, new Date()) > 1) {
			console.log('If 2nd');
			// If the user has completed a task more than 1 day ago, we will reset the streak.
			await fetch(`http://localhost:3030/api/streak/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
					current_streak: 0,
					last_task_date: new Date(),
				}),
			});
			setStreak(0);
			setLongestStreak(longest_streak);
		} else if (getDateDiff(last_task_date, new Date()) === 1) {
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
						last_task_date: new Date(),
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
						last_task_date: new Date(),
					}),
				});
				setStreak(current_streak + 1);
				setLongestStreak(longest_streak);
			}
		} else {
			console.log('If 4th');
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
			<div>
				<h2>Current Streak</h2>
				<p>{streak}</p>
				<h2>Longest Streak</h2>
				<p>{longestStreak}</p>
			</div>
		</div>
	);
}
export default Tasks;
