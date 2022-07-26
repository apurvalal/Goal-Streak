import React from 'react';
import { useState } from 'react';
import '../App.css';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	async function loginUser(event) {
		event.preventDefault();
		const response = await fetch('http://localhost:3030/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});
		const data = await response.json();
		if (data.status === 'success') {
			localStorage.setItem('token', data.token);
			alert('Login successful');
			const user_id = data.user_id;
			console.log(user_id);
			window.location.href = `/challenges/${user_id}`;
		} else {
			alert(data.message);
		}
	}
	return (
		<div className="lr">
			<div className="login">
				<h1 className="heading">Login</h1>
				<form onSubmit={loginUser}>
					<label className="label">Username:</label>
					<input
						className="input-field"
						type="text"
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
					<label className="label">Password:</label>
					<input
						className="input-field"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
					<button className="input-button" type="submit">
						Login
					</button>
					<a className="navigate" href="/register">
						New user? Sign Up
					</a>
				</form>
			</div>
		</div>
	);
}

export default Login;
