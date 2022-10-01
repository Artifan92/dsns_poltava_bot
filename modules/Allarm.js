import fetch from 'node-fetch';
import express from 'express';
import ParseTime from '../services/ParseTime.js';

class Allarm {
	constructor(
		allarmToken,
		PORT,
		webhookUrl,
		postUrl,
		bot,
		UserModel,
		RegionModel,
		TypeAllarmModel,
	) {
		this.bot = bot;
		this.allarm_token = allarmToken;
		this.PORT = PORT;
		this.webhookUrl = webhookUrl;
		this.postUrl = postUrl;
		this.User = UserModel;
		this.Region = RegionModel;
		this.TypeAllarm = TypeAllarmModel;
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

	async allarmTypes() {
		return await this.TypeAllarm.find();
	}

	async allarmPost(req, res, allarmTypes) {
		const ctx = req.body,
			{ regionId, allarmType, createdAt, status } = ctx,
			act = 'activate',
			deact = 'deactivate',
			time = new ParseTime(createdAt).render(),
			findUsers = await this.User.find(),
			findRegions = await this.Region.find(),
			region = findRegions.find(region => region.regionId == regionId),
			regionName = region.regionName,
			regionType = region.regionType,
			nameAllarm = allarmTypes.find(
				type => type.allarmType == allarmType,
			).message;

		console.log(ctx);

		findUsers.forEach(async user => {
			await user.allarm_region_id.forEach(async region => {
				if (user.allarm_message && regionId == region) {
					switch (status.toLowerCase()) {
						case act:
							await this.bot.sendMessage(
								user.id,
								`🔴 <strong>${time} ${nameAllarm} в ${regionName}.</strong>\nСлідкуйте за подальшими повідомленнями.\n#${regionName.replace(
									' ',
									'_',
								)}`,
								{
									parse_mode: 'HTML',
								},
							);

							break;
						case deact:
							await this.bot.sendMessage(
								user.id,
								`🟢 <strong>${time} Відбій тривоги в ${regionName}.</strong>\nСлідкуйте за подальшими повідомленнями.\n#${regionName.replace(
									' ',
									'_',
								)}`,
								{
									parse_mode: 'HTML',
								},
							);

							break;
					}
				}
			});
		});

		res.status(200).end();
	}

	async render() {
		this.webHook();

		const app = express();

		app.use(express.json());

		app.listen(this.PORT, () =>
			console.log(`🚀 Server running on port ${this.PORT}`),
		);

		const allarmTypes = await this.allarmTypes();

		app.post('/', (req, res) => {
			this.allarmPost(req, res, allarmTypes);
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
