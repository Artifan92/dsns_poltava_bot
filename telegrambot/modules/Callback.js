class Callback {
	constructor(
		CallbackModel,
		bot,
		UserModel,
		{ options: { parseMode = false, disableWebPagePreview = false } = {} },
	) {
		this.Callback = CallbackModel;
		this.bot = bot;
		this.parseMode = parseMode;
		this.disableWebPagePreview = disableWebPagePreview;
		this.User = UserModel;
	}

	async getAlarmTypes(type) {
		if (type) {
			return await this.Callback.find({ typeCallback: type }).exec();
		} else {
			return await this.Callback.find();
		}
	}

	async setAlarmMessageToUsers(id, alarmMessage) {
		await this.User.findOneAndUpdate(
			{ id: id },
			{ alarm_message: alarmMessage },
			{
				new: true,
			},
		);
	}

	async eventCallback(callback, callbacksAll, alarmCallbacks) {
		const msgData = callback.data;
		let options = {
			parse_mode: this.parseMode,
			disable_web_page_preview: this.disableWebPagePreview,
			chat_id: callback.message.chat.id,
			message_id: callback.message.message_id,
		};

		/** ITERATION CALLBACK */
		callbacksAll.forEach(async item => {
			const text = item.text,
				callbackData = item.callbackData,
				answerText = item.answerText,
				textEditInlineKeyboard = item.textEditInlineKeyboard,
				callbackDataEditInlineKeyboard = item.callbackDataEditInlineKeyboard;

			options = {
				...options,
				reply_markup: item.replyMarkup
					? item.replyMarkup
					: delete options.reply_markup,
			};

			/** FOR ALARM */
			if (callback.typeCallback === 'alarm') {
				let inlineKeyboard;
				switch (msgData) {
					case 'turn_on_notify_alarm':
						this.setAlarmMessageToUsers(options.chat_id, true);

						inlineKeyboard = [
							[
								{
									text: textEditInlineKeyboard,
									callback_data: callbackDataEditInlineKeyboard,
								},
							],
						];
						break;
					case 'turn_off_notify_alarm':
						this.setAlarmMessageToUsers(options.chat_id, false);

						inlineKeyboard = [
							[
								{
									text: textEditInlineKeyboard,
									callback_data: callbackDataEditInlineKeyboard,
								},
							],
						];
						break;
				}
				options.reply_markup = JSON.stringify({
					inline_keyboard: inlineKeyboard,
				});
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

	async render() {
		const callbacksAll = await this.getAlarmTypes();
		const alarmCallbacks = await this.getAlarmTypes('alarm');

		this.bot.on('callback_query', callback => {
			this.eventCallback(callback, callbacksAll, alarmCallbacks);
		});
	}
}

export default Callback;
