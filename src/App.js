import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Queue, Stack } from './util';
import './App.css';

function App() {
	useEffect(() => {
		axios
			.get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', {
				headers: { Authorization: process.env.REACT_APP_EXPLORER_TOKEN }
			})
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	return <div className="App">Explorer</div>;
}

export default App;
