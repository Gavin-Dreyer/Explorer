import React, { useEffect, useState } from 'react';
import axios from 'axios';

//import { Queue, Stack } from './util';
import './App.css';

function App() {
	const [currentRoom, setCurrentRoom] = useState();
	const [visited, setVisited] = useState([]);
	const [stack, setStack] = useState([]);
	const [connections, setConnections] = useState();

	useEffect(() => {
		axios
			.get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', {
				headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
			})
			.then(res => {
				let allExits = [];
				let rmConnections = {};

				setCurrentRoom(res.data);
				setVisited([...visited, res.data.room_id]);

				res.data.exits.forEach(exit => {
					allExits = [...allExits, [res.data.room_id, exit]];
					rmConnections = { ...rmConnections, [`${exit}`]: '?' };
				});

				setStack(allExits);
				setConnections({ [`${res.data.room_id}`]: rmConnections });
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	console.log(stack, connections);
	useEffect(() => {
		if (currentRoom) {
			const dft = startingRoom => {
				let visitedRms = new Set();

				console.log(stack, connections);

				// while (stack.size() > 0) {
				// let prevRm = startingRoom;
				//let path = stack.pop();

				// axios
				// 	.post(
				// 		'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
				// 		{ direction: path[1] },
				// 		{
				// 			headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
				// 		}
				// 	)
				// 	.then(res => {
				// 		setCurrentRoom(res.data);
				// 		if (path[1] === 'w') {
				// 			connections[prevRm].w = currentRoom.room_id;
				// 		} else if (path[1] === 'e') {
				// 			connections[prevRm].e = currentRoom.room_id;
				// 		} else if (path[1] === 'n') {
				// 			connections[prevRm].n = currentRoom.room_id;
				// 		} else {
				// 			connections[prevRm].s = currentRoom.room_id;
				// 		}
				// 		setVisited([...visited, res.data.room_id]);
				// 	})
				// 	.catch(err => {
				// 		console.log(err);
				// 	});
				//don't
				//}
			};
			dft(currentRoom);

			//setTimeout(dft, 1000 * currentRoom.cooldown, currentRoom);
			//console.log(stack, connections);
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
			<div>{visited}</div>
		</div>
	);
}

export default App;
