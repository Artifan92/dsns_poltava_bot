class Commands {
	constructor(commandList, bot) {
		this.commandList = commandList;
		this.bot = bot;
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
			const text = item.text,
				opts = item.opts,
				command = item.command,
				msgText = msg.text,
				msgChatId = msg.chat.id;

			if (msgText == command) {
				await this.bot.sendMessage(msgChatId, text, opts);
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
