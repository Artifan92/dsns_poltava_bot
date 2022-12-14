import fetch from 'node-fetch';
import express from 'express';
import ParseTime from '../services/ParseTime.js';

class Alarm {
	constructor(
		alarmToken,
		port,
		webhookUrl,
		postUrl,
		bot,
		UserModel,
		RegionModel,
		TypeAlarmModel,
	) {
		this.bot = bot;
		this.alarm_token = alarmToken;
		this.port = port;
		this.webhookUrl = webhookUrl;
		this.postUrl = postUrl;
		this.User = UserModel;
		this.Region = RegionModel;
		this.TypeAlarm = TypeAlarmModel;
	}

	async webHook() {
		const res = await fetch(this.webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: this.alarm_token,
			},
			body: JSON.stringify({
				webHookUrl: `${this.postUrl}/alarm`,
			}),
		});

		if (!res.ok) {
			throw new Error(
				`Could notfetch ${this.webhookUrl}, status ${res.status}`,
			);
		}
	}

	async getAlarmTypes() {
		return await this.TypeAlarm.find();
	}

	async getRregions() {
		return await this.Region.find();
	}

	async sendMessageAboutAlarm(status, id, time, regionName, nameAlarm) {
		const act = 'activate',
			deact = 'deactivate',
			messageAboutAct = `🔴 <strong>${time} ${nameAlarm} в ${regionName}.</strong>\nСлідкуйте за подальшими повідомленнями.\n#Тривога #${regionName.replace(
				' ',
				'_',
			)}`,
			messageAboutDeact = `🟢 <strong>${time} Відбій тривоги в ${regionName}.</strong>\nСлідкуйте за подальшими повідомленнями.\n#Тривога #${regionName.replace(
				' ',
				'_',
			)}`;

		switch (status.toLowerCase()) {
			case act:
				await this.bot.sendMessage(id, messageAboutAct, {
					parse_mode: 'HTML',
				});
				break;
			case deact:
				await this.bot.sendMessage(id, messageAboutDeact, {
					parse_mode: 'HTML',
				});
				break;
		}
	}

	async alarmPost(req, res, regions, alarmTypes) {
		const ctx = req.body,
			{ status, regionId, alarmType, createdAt } = ctx,
			findUsers = await this.User.find({ alarm_message: true }).exec();

		findUsers.forEach(async user => {
			await user.alarm_region_id.forEach(async region => {
				if (regionId == region) {
					const time = new ParseTime(createdAt).render(),
						region = regions.find(region => region.regionId == regionId),
						regionName = region.regionName,
						regionType = region.regionType,
						nameAlarm = alarmTypes.find(
							type => type.alarmType == alarmType,
						).message;
					await this.sendMessageAboutAlarm(
						status,
						user.id,
						time,
						regionName,
						nameAlarm,
					);
				}
			});
		});
	}

	async render() {
		this.webHook();

		const app = express();

		app.use(express.json());

		app.listen(this.port, () =>
			console.log(`🚀 Server running on port ${this.port}`),
		);

		const alarmTypes = await this.getAlarmTypes();

		const regions = await this.getRregions();

		app.post('/alarm', (req, res) => {
			console.log(req.body);
			res.status(200).end();
			this.alarmPost(req, res, regions, alarmTypes);
		});
	}
}

export default Alarm;
