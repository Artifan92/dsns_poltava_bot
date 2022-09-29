class Commands {
	constructor(commandList, bot, UserModel) {
		this.commandList = commandList;
		this.bot = bot;
		this.User = UserModel;
	}

	setCommandsList() {
		return this.commandList.reduce((acum, current) => {
			acum.push({
				command: current.command,
				description: current.description,
			});
			return acum;
		}, []);
	}

	listenerComands(msg) {
		this.commandList.forEach(async item => {
			const { text, opts, command } = item,
				{
					id,
					is_bot,
					first_name,
					last_name,
					username,
					language_code,
					is_premium,
				} = msg.from,
				msgText = msg.text,
				msgChatId = msg.chat.id,
				findUser = await this.User.find({ id: msgChatId });

			if (msgText == command) {
				if (msgText == '/settings_allarm') {
					let inlineKeyboard;
					if (findUser.alarm_message) {
						inlineKeyboard = [
							[{ text: 'Відключити', callback_data: 'turn_off_notify_allarm' }],
						];
					} else {
						inlineKeyboard = [
							[{ text: 'Включити', callback_data: 'turn_on_notify_allarm' }],
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

				if (msgText == '/start' && findUser.length === 0) {
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
				}
			}
		});
	}

	render() {
		/** SET COMMANDS */
		this.bot.setMyCommands(this.setCommandsList());

		/** LISTENER COMMANDS */
		this.bot.on('message', msg => {
			this.listenerComands(msg);
		});
	}
}

export default Commands;
