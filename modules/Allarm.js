import fetch from 'node-fetch';
import express from 'express';
import ParseTime from '../services/ParseTime';

class Allarm {
	constructor(allarm_token, PORT, webhookUrl, postUrl, bot) {
		this.bot = bot;
		this.allarm_token = allarm_token;
		this.PORT = PORT;
		this.webhookUrl = webhookUrl;
		this.postUrl = postUrl;
	}

	async webHook() {
		const res = await fetch(this.webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: this.allarm_token,
				accept: '/',
			},
			body: JSON.stringify({
				webHookUrl: `${this.postUrl}:${this.PORT}`,
			}),
		});

		if (!res.ok) {
			throw new Error(
				`Could notfetch ${this.webhookUrl}, status ${res.status}`,
			);
		}
	}

	async allarmPost(req, res) {
		const ctx = req.body,
			{ regionId, allarmType, createdAt, status } = ctx,
			act = 'activate',
			deact = 'deactivate',
			time = new ParseTime(createdAt);

		if (regionId == 19) {
			switch (status.toLowerCase()) {
				case act:
					await this.bot.sendMessage(
						252263254,
						`🔴 <strong>${time} Повітряна тривога в Полтавська область.</strong>\nСлідкуйте за подальшими повідомленнями.\n#Полтавська_область`,
						{
							parse_mode: 'HTML',
						},
					);

					break;
				case deact:
					await this.bot.sendMessage(
						252263254,
						`🟢 <strong>${time} Відбій тривоги в Полтавська область.</strong>\nСлідкуйте за подальшими повідомленнями.\n#Полтавська_область`,
						{
							parse_mode: 'HTML',
						},
					);

					break;
			}
		}

		res.status(200).end();
	}

	render() {
		this.webHook();

		const app = express();

		app.use(express.json());

		app.listen(this.PORT, () =>
			console.log(`🚀 Server running on port ${this.PORT}`),
		);

		app.post('/', (req, res) => {
			this.allarmPost(req, res);
		});
	}
}

export default Allarm;

// async function getRegion() {
// 	const url = 'https://api.ukrainealarm.com/api/v3/alerts/status';
// 	const res = await fetch(url, {
// 		method: 'GET',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			authorization: process.env.ALLARM_TOKEN,
// 		},
// 	});

// 	if (!res.ok) {
// 		throw new Error(`Could notfetch ${url}, status ${res.status}`);
// 	}

// 	return await res.json();
// }

// getRegion().then(data => console.log(data));
