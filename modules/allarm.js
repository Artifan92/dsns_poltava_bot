'use strict';
import fetch from 'node-fetch';

async function getRegion() {
	const url = 'https://api.ukrainealarm.com/api/v3/alerts/22';
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			authorization: '921cf6a5:a4972ab17dfea62e685225e9fae5731d',
		},
	});

	if (!res.ok) {
		throw new Error(`Could notfetch ${url}, status ${res.status}`);
	}

	return await res.json();
}

async function webHook() {
	const url = 'https://api.ukrainealarm.com/api/v3/webhook';
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			authorization: '921cf6a5:a4972ab17dfea62e685225e9fae5731d',
		},
		body: JSON.stringify({
			webHookUrl: 'https://api.ukrainealarm.com/api/v3/alerts/22',
		}),
	});

	if (!res.ok) {
		throw new Error(`Could notfetch ${url}, status ${res.status}`);
	}
}

export { getRegion, webHook };
