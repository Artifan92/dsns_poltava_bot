class Commands {
	constructor(CommandModel, bot, UserModel, CallbackModel) {
		this.commandsList = CommandModel;
		this.bot = bot;
		this.User = UserModel;
		this.Callback = CallbackModel;
	}

	async setCommandsList() {
		const commands = await this.commandsList
			.find({ show: true }, 'command description', {
				sort: { numberOfOrder: 1 },
			})
			.exec();

		return commands.reduce((acum, current) => {
			acum.push({
				command: current.command,
				description: current.description,
			});
			return acum;
		}, []);
	}

	async addNewUser(user) {
		const addNewUser = new this.User(user);
		await addNewUser.save();
	}

	async updateUser(msgChatId, user) {
		await this.User.findOneAndUpdate({ id: msgChatId }, user, {
			new: true,
		});
	}

	async setReplyMarkup(user) {
		const notifyUser = user.alarm_message;
		const regionsUser = user.alarm_region_id;
		const regions = await this.Callback.find(
			{ typeCallback: 'alarm' },
			'callbackData answerText replyMarkup',
		).exec();

		const regionReduce = regions.reduce((acum, curent) => {
			regionsUser.forEach(region => {
				if (
					region == curent.callbackData.replace(/\D/gi, '') &&
					curent.callbackData.match(/turn_on/)
				) {
					acum.push([
						JSON.parse(curent.replyMarkup[0]),
						JSON.parse(curent.replyMarkup[1]),
					]);
				}
				if (
					region != curent.callbackData.replace(/\D/gi, '') &&
					curent.callbackData.match(/turn_off/)
				) {
					acum.push([
						JSON.parse(curent.replyMarkup[0]),
						JSON.parse(curent.replyMarkup[1]),
					]);
				}
			});

			return acum;
		}, []);

		if (notifyUser) {
			return JSON.stringify({
				inline_keyboard: [
					[
						JSON.parse(
							(
								await this.Callback.findOne({
									callbackData: 'turn_on_notify_alarm',
								})
							).replyMarkup,
						),
					],
					...regionReduce,
				],
			});
		}

		if (!notifyUser) {
			return JSON.stringify({
				inline_keyboard: [
					[
						JSON.parse(
							(
								await this.Callback.findOne({
									callbackData: 'turn_off_notify_alarm',
								})
							).replyMarkup,
						),
					],
					...regionReduce,
				],
			});
		}
	}

	async listenerComands(msg) {
		const commands = await this.commandsList.find(),
			msgText = msg.text;

		commands.forEach(async item => {
			const { text, opts, command } = item;

			if (msgText == command) {
				const {
						id,
						is_bot,
						first_name,
						last_name,
						username,
						language_code,
						is_premium,
					} = msg.from,
					msgChatId = msg.chat.id,
					findUser = await this.User.findOne({ id: msgChatId }).exec();

				/**FOR START */
				if (msgText == '/start' && !findUser) {
					await this.addNewUser({
						id,
						is_bot,
						first_name,
						last_name,
						username,
						language_code,
						is_premium,
					});
				} else if (msgText == '/start' && findUser) {
					await this.updateUser(msgChatId, {
						id,
						is_bot,
						first_name,
						last_name,
						username,
						language_code,
						is_premium,
					});
				}

				/**FOR SETTINGS ALARM */
				if (msgText == '/settings_alarm') {
					opts.reply_markup = await this.setReplyMarkup(findUser);
				}

				await this.bot.sendMessage(msgChatId, text, opts);
			}
		});
	}

	async render() {
		/** SET COMMANDS */
		this.bot.setMyCommands(await this.setCommandsList());

		/** LISTENER COMMANDS */
		this.bot.onText(/\//, msg => {
			this.listenerComands(msg);
		});
	}
}

export default Commands;
