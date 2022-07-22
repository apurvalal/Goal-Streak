import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './views/login';
import Register from './views/register';
import Tasks from './views/tasks';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					{/* <Route path="/tasks/:userId" component={Tasks} /> */}
					<Route path="/tasks/:userId" element={<Tasks />} />

					{/* <Route path="/tasks/:userId" element={<h1>OK NO</h1>} /> */}
				</Routes>
			</Router>
		</div>
	);
}

export default App;
