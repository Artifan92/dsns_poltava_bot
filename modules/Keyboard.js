class Keyboard {
	constructor(keyboardList, bot) {
		this.keyboardList = keyboardList;
		this.bot = bot;
	}

	answerMainMenu(msg) {
		this.keyboardList.forEach(async item => {
			const { text, opts, btn } = item,
				msgText = msg.text;

			if (msgText == btn) {
				const msgChatId = msg.chat.id;
				await this.bot.sendMessage(msgChatId, text, opts);
			}
		});
	}

	render() {
		this.bot.on('message', msg => {
			this.answerMainMenu(msg);
		});
	}
}

export default Keyboard;
