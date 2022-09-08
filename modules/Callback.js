class Callback {
	constructor(inlineKeyboardList, bot) {
		this.inlineKeyboardList = inlineKeyboardList;
		this.bot = bot;
	}

	eventCallback(msg) {
		this.inlineKeyboardList.forEach(async item => {
			const keyboard = item.reply_markup,
				opts = item.opts,
				callbackData = item.callback_data,
				msgData = msg.data;

			if (callbackData == msgData) {
				await bot.editMessageReplyMarkup(keyboard, opts);
			}
		});
	}

	render() {
		this.bot.on('callback_query', msg => {
			eventCallback(msg);
		});
	}
}

export default Callback;
