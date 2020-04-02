import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
				let visitedRms = res.data.map(data => data['room_id']);
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

				setConnections({
					[`${res.data.room_id}`]: rmConnections
				});
				setStack(allExits);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		if (currentRoom) {
			const dft = startingRoom => {
				console.log(stack);
				axios
					.get('http://localhost:8000')
					.then(res => {
						let visitedRms = res.data.map(data => data['room_id']);
						setVisited(visitedRms);
					})
					.catch(err => console.log(err));

				let path = stack.pop();

				console.log(path);
				axios
					.post(
						'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
						{ direction: path[1] },
						{
							headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
						}
					)
					.then(res => {
						console.log(res.data.room_id, stack[stack.length - 1]);
						if (res.data.room_id !== stack[stack.length - 1]) {
							axios
								.post('http://localhost:8000/path', {
									curRm: res.data.room_id,
									dest: stack[stack.length - 1]
								})
								.then(res => {
									while (res.data.length > 0) {
										let dir = res.data.unshift();
										axios
											.post(
												'https://lambda-treasure-hunt.herokuapp.com/api/adv/move/',
												{ direction: dir },
												{
													headers: {
														Authorization: process.env.REACT_APP_EXPLORER_TOKEN
													}
												}
											)
											.then(res => console.log(res))
											.catch(res => console.log(res));
									}
								})
								.catch(err => console.log(err));
						}

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

			setTimeout(dft, 1000 * 16, currentRoom);
			// let postRM = {
			// 	...currentRoom,
			// 	knownConnections: connections,
			// 	stack: stack
			// };
			// axios
			// 	.post('http://localhost:8000', postRM)
			// 	.then(res => console.log(res))
			// 	.catch(err => console.log(err));
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
		</div>
	);
}

export default App;
