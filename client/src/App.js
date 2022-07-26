import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/login';
import Register from './views/register';
import Challenge from './views/challenge';
import AddChallenge from './views/add_challenge';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/challenges/:userId" element={<Challenge />} />
					<Route path="/create/:userId" element={<AddChallenge />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
