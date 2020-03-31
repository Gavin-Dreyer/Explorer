const express = require('express');
const cors = require('cors');
const db = require('../data/db-config.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', async (req, res) => {
	try {
		const rooms = await db('rooms');
		res.status(200).json(rooms);
	} catch (err) {
		res.status(400).json(err);
	}
});

server.post('/', async (req, res) => {
	let exits = req.body.exits.join();
	let items = req.body.items.join();
	let messages = req.body.messages.join();

	console.log(req.body.knownConnections[req.body.room_id]);

	let e = req.body.knownConnections[req.body.room_id].e;
	let n = req.body.knownConnections[req.body.room_id].n;
	let s = req.body.knownConnections[req.body.room_id].s;
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
			let connections = { n_to: n, s_to: s, e_to: e, w_to: w };
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
