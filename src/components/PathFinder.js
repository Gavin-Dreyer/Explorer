import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PathFinder() {
	const [rooms, setRooms] = useState({
		curRm: '',
		dest: ''
	});

	const handleChange = event => {
		setRooms({ ...rooms, [event.target.name]: event.target.value });
	};

	const handleSubmit = event => {
		event.preventDefault();
		axios
			.post('http://localhost:8000', rooms)
			.then(res => console.log(res))
			.catch(err => console.log(err));
	};
	return (
		<form onSubmit={event => handleSubmit(event)}>
			<input
				type="number"
				value={rooms.curRm}
				onChange={event => handleChange(event)}
			/>
			<input
				type="number"
				value={rooms.dest}
				onChange={event => handleChange(event)}
			/>
		</form>
	);
}

export default PathFinder;
