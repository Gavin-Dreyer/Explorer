const express = require('express');
const cors = require('cors');
const db = require('../data/db-config.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', async (req, res) => {
	try {
		const rooms = await db('rooms').select(['room_id']);
		res.status(200).json(rooms);
	} catch (err) {
		res.status(400).json(err);
	}
});

server.post('/', async (req, res) => {
	let exits = req.body.exits.join();
	let items = req.body.items.join();
	let messages = req.body.messages.join();

	let n = req.body.knownConnections[req.body.room_id].n;
	let s = req.body.knownConnections[req.body.room_id].s;
	let e = req.body.knownConnections[req.body.room_id].e;
	let w = req.body.knownConnections[req.body.room_id].w;

	const roomInfo = {
		room_id: req.body.room_id,
		title: req.body.title,
		description: req.body.description,
		coordinates: req.body.coordinates,
		elevation: req.body.elevation,
		terrain: req.body.terrain,
		items: items,
		exits: exits,
		messages: messages,
		visited: true,
		n_to: n,
		s_to: s,
		e_to: e,
		w_to: w
	};

	try {
		const checkIfRoomExists = await db('rooms').where(
			'room_id',
			req.body.room_id
		);

		if (checkIfRoomExists.length > 0) {
			let arr = [
				checkIfRoomExists[0].n_to,
				checkIfRoomExists[0].s_to,
				checkIfRoomExists[0].e_to,
				checkIfRoomExists[0].w_to
			];

			arr = await arr.map((item, idx) => {
				if ((item === '?' || item === null) && idx === 0) {
					return (item = n);
				} else if ((item === '?' || item === null) && idx === 1) {
					return (item = s);
				} else if ((item === '?' || item === null) && idx === 2) {
					return (item = e);
				} else if ((item === '?' || item === null) && idx === 3) {
					return (item = w);
				} else {
					return item;
				}
			});

			let connections = {
				n_to: arr[0],
				s_to: arr[1],
				e_to: arr[2],
				w_to: arr[3]
			};

			await db('rooms')
				.where('room_id', req.body.room_id)
				.update(connections);

			res.status(200).json({ message: 'Successfully updated' });
		} else {
			await db('rooms').insert(roomInfo);
			res.status(201).json({ message: 'Successfully posted' });
		}
	} catch (err) {
		res.status(400).json(err);
	}
});

module.exports = server;
