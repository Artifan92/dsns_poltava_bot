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
