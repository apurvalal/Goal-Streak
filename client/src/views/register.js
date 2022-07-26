import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	async function registerUser(event) {
		event.preventDefault();
		const response = await fetch('http://localhost:3030/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
				email,
			}),
		});

		const data = await response.json();
		if (data.status === 'success') {
			navigate('/login');
		}
	}

	return (
		<div className="lr">
			<div className="register">
				<h1 className="heading">Register</h1>
				<form onSubmit={registerUser}>
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
					<label className="label">Email:</label>
					<input
						className="input-field"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<button className="input-button" type="submit">
						Register
					</button>
					<a className="navigate" href="/login">
						Already a user? Login
					</a>
				</form>
			</div>
		</div>
	);
}

export default Register;
