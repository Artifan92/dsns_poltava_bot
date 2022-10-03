class Commands {
	constructor(CommandModel, bot, UserModel) {
		this.commandsList = CommandModel;
		this.bot = bot;
		this.User = UserModel;
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

	listenerComands(msg, commands) {
		commands.forEach(async item => {
			const { text, opts, command } = item,
				msgText = msg.text;

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

				/**FOR ALARM */
				if (msgText == '/settings_alarm') {
					const alarmMessage = findUser.alarm_message;
					let inlineKeyboard;
					if (alarmMessage) {
						inlineKeyboard = [
							[
								{
									text: '🟢 Сповіщення про повітряну тривогу',
									callback_data: 'turn_off_notify_alarm',
								},
							],
						];
					} else {
						inlineKeyboard = [
							[
								{
									text: '🔴 Сповіщення про повітряну тривогу',
									callback_data: 'turn_on_notify_alarm',
								},
							],
						];
					}
					await this.bot.sendMessage(msgChatId, text, {
						...opts,
						reply_markup: JSON.stringify({
							inline_keyboard: inlineKeyboard,
						}),
					});
				} else {
					await this.bot.sendMessage(msgChatId, text, opts);
				}

				/**FOR START */
				if (msgText == '/start' && !findUser) {
					const addNewUser = new this.User({
						id,
						is_bot,
						first_name,
						last_name,
						username,
						language_code,
						is_premium,
					});
					await addNewUser.save();
				} else if (msgText == '/start' && findUser) {
					await this.User.findOneAndUpdate(
						{ id: msgChatId },
						{
							id,
							is_bot,
							first_name,
							last_name,
							username,
							language_code,
							is_premium,
						},
						{
							new: true,
						},
					);
				}
			}
		});
	}

	async render() {
		const commands = await this.commandsList.find();

		/** SET COMMANDS */
		this.bot.setMyCommands(await this.setCommandsList());

		/** LISTENER COMMANDS */
		this.bot.onText(/\//, msg => {
			this.listenerComands(msg, commands);
		});
	}
}

export default Commands;
