import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Queue, Stack } from './util';
import './App.css';

function App() {
	const [currentRoom, setCurrentRoom] = useState();

	useEffect(() => {
		axios
			.get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', {
				headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
			})
			.then(res => {
				setCurrentRoom(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		if (currentRoom) {
			const interval = setInterval(() => {
				axios
					.post(
						'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
						{ direction: 'n' },
						{
							headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
						}
					)
					.then(res => {
						setCurrentRoom(res.data);
					})
					.catch(err => {
						console.log(err);
					});
			}, 1000 * currentRoom.cooldown);

			return () => clearInterval(interval);
		}
	}, [currentRoom]);

	if (!currentRoom) {
		return <div>loading...</div>;
	}

	return (
		<div className="App">
			<h3>Explorer</h3>
			<div className="room">{currentRoom.room_id}</div>
			<div className="room">{currentRoom.title}</div>
			<div className="room">{currentRoom.description}</div>
			<div className="room">{currentRoom.coordinates}</div>
			<div className="room">{currentRoom.elevation}</div>
			<div className="room">{currentRoom.terrain}</div>
			<div className="room">{currentRoom.items}</div>
			<div className="room">
				{currentRoom.exits.map((exit, idx) => (
					<span className="exits" key={idx}>
						{exit}
					</span>
				))}
			</div>
			<div className="room">{currentRoom.errors}</div>
			<div className="room">{currentRoom.messages}</div>
		</div>
	);
}

export default App;
