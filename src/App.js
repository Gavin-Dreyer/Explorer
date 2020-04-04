import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PathFinder from './components/PathFinder';
//import { Queue, Stack } from './util';
import './App.css';

function App() {
	const [currentRoom, setCurrentRoom] = useState();
	const [visited, setVisited] = useState([]);
	const [connections, setConnections] = useState();
	const [stack, setStack] = useState([]);
	const [path, setPath] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:8000')
			.then(res => {
				console.log(res.data);
				let connects = {};
				let visitedRms = res.data.map(data => data['room_id']);

				res.data.forEach(rm => {
					connects = {
						...connects,
						[`${rm.room_id}`]: {
							n: rm.n_to,
							s: rm.s_to,
							e: rm.e_to,
							w: rm.w_to
						}
					};
				});

				setConnections(connects);
				setVisited(visitedRms);
			})
			.catch(err => console.log(err));
		axios
			.get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', {
				headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
			})
			.then(res => {
				let allExits = [];
				let rmConnections = {};
				setCurrentRoom(res.data);

				res.data.exits.forEach(exit => {
					allExits = [...allExits, [res.data.room_id, exit]];
					rmConnections = { ...rmConnections, [`${exit}`]: '?' };
				});

				// setConnections({
				// 	[`${res.data.room_id}`]: rmConnections
				// });
				setStack([...stack]);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		if (currentRoom) {
			console.log(connections);
			const dft = startingRoom => {
				//console.log(stack);
				axios
					.get('http://localhost:8000')
					.then(res => {
						let visitedRms = res.data.map(data => data['room_id']);
						setVisited(visitedRms);
					})
					.catch(err => console.log(err));

				let path = stack.pop();

				//console.log(path);
				axios
					.post(
						'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
						{ direction: path[1] },
						{
							headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
						}
					)
					.then(res => {
						if (path[1] === 'w') {
							let allExits = [];
							let rmConnections = {};

							connections[currentRoom.room_id].w = res.data.room_id;

							res.data.exits.forEach(exit => {
								allExits = [...allExits, [res.data.room_id, exit]];
								if (exit === 'e') {
									rmConnections = {
										...rmConnections,
										[`${exit}`]: currentRoom.room_id
									};
								} else {
									rmConnections = { ...rmConnections, [`${exit}`]: '?' };
								}
							});
							setConnections({
								...connections,
								[`${res.data.room_id}`]: rmConnections
							});
							setCurrentRoom(res.data);

							if (!visited.includes(res.data.room_id)) {
								setStack([...stack, ...allExits]);
							} else {
								setStack([...stack]);
							}
						} else if (path[1] === 'e') {
							let allExits = [];
							let rmConnections = {};

							connections[currentRoom.room_id].e = res.data.room_id;

							res.data.exits.forEach(exit => {
								allExits = [...allExits, [res.data.room_id, exit]];
								if (exit === 'w') {
									rmConnections = {
										...rmConnections,
										[`${exit}`]: currentRoom.room_id
									};
								} else {
									rmConnections = { ...rmConnections, [`${exit}`]: '?' };
								}
							});

							setConnections({
								...connections,
								[`${res.data.room_id}`]: rmConnections
							});
							setCurrentRoom(res.data);

							if (!visited.includes(res.data.room_id)) {
								setStack([...stack, ...allExits]);
							} else {
								setStack([...stack]);
							}
						} else if (path[1] === 'n') {
							let allExits = [];
							let rmConnections = {};

							connections[currentRoom.room_id].n = res.data.room_id;

							res.data.exits.forEach(exit => {
								allExits = [...allExits, [res.data.room_id, exit]];
								if (exit === 's') {
									rmConnections = {
										...rmConnections,
										[`${exit}`]: currentRoom.room_id
									};
								} else {
									rmConnections = { ...rmConnections, [`${exit}`]: '?' };
								}
							});
							setConnections({
								...connections,
								[`${res.data.room_id}`]: rmConnections
							});
							setCurrentRoom(res.data);

							if (!visited.includes(res.data.room_id)) {
								setStack([...stack, ...allExits]);
							} else {
								setStack([...stack]);
							}
						} else {
							let allExits = [];
							let rmConnections = {};

							connections[currentRoom.room_id].s = res.data.room_id;

							res.data.exits.forEach(exit => {
								allExits = [...allExits, [res.data.room_id, exit]];
								if (exit === 'n') {
									rmConnections = {
										...rmConnections,
										[`${exit}`]: currentRoom.room_id
									};
								} else {
									rmConnections = { ...rmConnections, [`${exit}`]: '?' };
								}
							});
							setConnections({
								...connections,
								[`${res.data.room_id}`]: rmConnections
							});
							setCurrentRoom(res.data);

							if (!visited.includes(res.data.room_id)) {
								setStack([...stack, ...allExits]);
							} else {
								setStack([...stack]);
							}
						}
					})
					.catch(err => {
						console.log(err);
					});
			};

			console.log(stack);
			console.log(currentRoom.room_id, stack[stack.length - 1][0]);
			if (currentRoom.room_id !== stack[stack.length - 1][0]) {
				let path = [];
				let postRM = {
					...currentRoom,
					knownConnections: connections,
					stack: stack
				};
				axios
					.post('http://localhost:8000', postRM)
					.then(res =>
						axios
							.post('http://localhost:8000/path', {
								curRm: Number(currentRoom.room_id),
								dest: Number(stack[stack.length - 1][0])
							})
							.then(res => {
								path = [...res.data];
							})
					)
					.catch(err => console.log(err));

				let intervalID = setInterval(function() {
					if (path.length < 1) {
						clearInterval(intervalID);
						setStack([...stack]);
					} else {
						console.log(path, 'path before setInt post');
						axios
							.post(
								'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
								{ direction: path[0] },
								{
									headers: {
										Authorization: process.env.REACT_APP_EXPLORER_TOKEN
									}
								}
							)
							.then(res => {
								console.log(res.data, currentRoom, 'AFTER PATH POST');
								setCurrentRoom(res.data);
							})
							.catch(err => console.log(err));

						path = path.slice(1, path.length);
					}
				}, (currentRoom.cooldown + 2) * 1000);

				postRM = {
					...currentRoom,
					knownConnections: connections,
					stack: stack
				};

				axios
					.post('http://localhost:8000', postRM)
					.then(res => console.log(res))
					.catch(err => console.log(err));
			} else {
				setTimeout(dft, (currentRoom.cooldown + 2) * 1000, currentRoom);
				let postRM = {
					...currentRoom,
					knownConnections: connections,
					stack: stack
				};
				axios
					.post('http://localhost:8000', postRM)
					.then(res => console.log(res.data))
					.catch(err => console.log(err));
			}
		}
	}, [stack]);

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
			<PathFinder />
		</div>
	);
}

export default App;
