import { User } from '../data/dbModels.js';

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
				msgChatId = msg.chat.id;

			if (msgText == command) {
				await this.bot.sendMessage(msgChatId, text, opts);
				const ollUsers = await User.find();
				if (
					msgText == '/start' &&
					ollUsers.every(user => msgChatId != user.id)
				) {
					const addNewUser = new User({
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
