class Callback {
	constructor(
		inlineKeyboardList,
		bot,
		{ options: { parseMode = false, disableWebPagePreview = false } = {} },
	) {
		this.inlineKeyboardList = inlineKeyboardList;
		this.bot = bot;
		this.parseMode = parseMode;
		this.disableWebPagePreview = disableWebPagePreview;
	}

	eventCallback(callback) {
		this.inlineKeyboardList.forEach(async item => {
			const text = item.text,
				callbackData = item.callbackData,
				msgData = callback.data,
				answerText = item.answerText,
				options = {
					parse_mode: this.parseMode,
					disable_web_page_preview: this.disableWebPagePreview,
					chat_id: callback.message.chat.id,
					message_id: callback.message.message_id,
					reply_markup: item.replyMarkup,
				};

			if (callbackData == msgData) {
				await this.bot.answerCallbackQuery(callback.id, {
					text: answerText,
					show_alert: false,
				});

				await this.bot.editMessageText(text, options);
			}
		});
	}

	render() {
		this.bot.on('callback_query', callback => {
			this.eventCallback(callback);
		});
	}
}

export default Callback;
