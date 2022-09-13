import { users } from '../services/data.js';

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
				if (msgText == '/start' && users.every(item => msgChatId != item.id)) {
					users.push({
						id: msg.from.id,
						is_bot: msg.from.is_bot,
						first_name: msg.from.first_name,
						last_name: msg.from.last_name,
						username: msg.from.username,
						language_code: msg.from.language_code,
						is_premium: msg.from.is_premium,
					});
					console.log(users);
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
