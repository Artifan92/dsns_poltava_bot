class Callback {
	constructor(
		inlineKeyboardList,
		bot,
		UserModel,
		{ options: { parseMode = false, disableWebPagePreview = false } = {} },
	) {
		this.inlineKeyboardList = inlineKeyboardList;
		this.bot = bot;
		this.parseMode = parseMode;
		this.disableWebPagePreview = disableWebPagePreview;
		this.User = UserModel;
	}

	async eventCallback(callback) {
		const msgData = callback.data;
		let options = {
			parse_mode: this.parseMode,
			disable_web_page_preview: this.disableWebPagePreview,
			chat_id: callback.message.chat.id,
			message_id: callback.message.message_id,
		};

		/** ITERATION CALLBACK */
		this.inlineKeyboardList.forEach(async item => {
			const text = item.text,
				callbackData = item.callbackData,
				answerText = item.answerText;
			options = {
				...options,
				reply_markup: item.replyMarkup,
			};

			/** FOR ALLARM */
			if (
				!options.reply_markup &&
				(msgData === 'turn_on_notify_allarm' ||
					msgData === 'turn_off_notify_allarm')
			) {
				let inlineKeyboard;
				switch (msgData) {
					case 'turn_on_notify_allarm':
						await this.User.findOneAndUpdate(
							{ id: options.chat_id },
							{ allarm_message: true },
							{
								new: true,
							},
						);
						inlineKeyboard = [
							[
								{
									text: '🟢 Сповіщення про повітряну тривогу',
									callback_data: 'turn_off_notify_allarm',
								},
							],
						];
						break;
					case 'turn_off_notify_allarm':
						await this.User.findOneAndUpdate(
							{ id: options.chat_id },
							{ allarm_message: false },
							{
								new: true,
							},
						);
						inlineKeyboard = [
							[
								{
									text: '🔴 Сповіщення про повітряну тривогу',
									callback_data: 'turn_on_notify_allarm',
								},
							],
						];
						break;
				}
				options.reply_markup = JSON.stringify({
					inline_keyboard: inlineKeyboard,
				});
			}

			/** IF REPLY_MARKUP UNDEFINE - DELETE REPLY_MARKUP */
			if (!options.reply_markup) {
				delete options.reply_markup;
			}

			/** ANSWER CALLBACK. EDITMEASSAGE OR EDITREPLYMARKUP */
			if (callbackData == msgData) {
				await this.bot.answerCallbackQuery(callback.id, {
					text: answerText,
					show_alert: false,
				});
				if (text) {
					await this.bot.editMessageText(text, options);
				}
				if (!text && options.reply_markup) {
					await this.bot.editMessageReplyMarkup(options.reply_markup, options);
				}
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
