class Keyboard {
	constructor(keyboardList, bot) {
		this.keyboardList = keyboardList;
		this.bot = bot;
	}

	answerMainMenu(msg) {
		this.keyboardList.forEach(async item => {
			const id = item.id,
				text = item.text,
				opts = item.opts,
				btn = item.btn,
				msgText = msg.text,
				msgChatId = msg.chat.id,
				msgId = msg.message_id;
			if (msgText == btn) {
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
