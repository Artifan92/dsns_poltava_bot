class Callback {
	constructor(
		CallbackModel,
		bot,
		UserModel,
		CommandModel,
		{ options: { parseMode = false, disableWebPagePreview = false } = {} },
	) {
		this.Callback = CallbackModel;
		this.bot = bot;
		this.parseMode = parseMode;
		this.disableWebPagePreview = disableWebPagePreview;
		this.User = UserModel;
		this.Command = CommandModel;
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

	async setMarkupToCommand(command, replyMarkup) {
		await this.Command.findOneAndUpdate(
			{ command: command },
			{ 'opts.reply_markup': replyMarkup },
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
			const callbackData = item.callbackData,
				typeCallback = item.typeCallback;

			/** ANSWER CALLBACK. EDITMEASSAGE OR EDITREPLYMARKUP */
			if (callbackData == msgData && !typeCallback) {
				const text = item.text,
					answerText = item.answerText;

				await this.bot.answerCallbackQuery(callback.id, {
					text: answerText,
					show_alert: false,
				});

				options = {
					...options,
					reply_markup: item.replyMarkup,
				};

				if (!options.reply_markup) {
					delete options.reply_markup;
				}

				if (text) {
					await this.bot.editMessageText(text, options);
				}
				if (!text && options.reply_markup) {
					await this.bot.editMessageReplyMarkup(options.reply_markup, options);
				}
			}

			/** TYPECALLBACK - ALARM */
			if (callbackData == msgData && typeCallback === 'alarm') {
				const answerText = item.answerText;

				await this.bot.answerCallbackQuery(callback.id, {
					text: answerText,
					show_alert: false,
				});

				options = {
					...options,
					reply_markup: item.replyMarkup,
				};

				if (!options.reply_markup) {
					delete options.reply_markup;
				}

				let sendMessage;

				if (msgData.match(/turn_off/)) {
					sendMessage = false;
				}
				if (msgData.match(/turn_on/)) {
					sendMessage = true;
				}
				this.setMarkupToCommand('/settings_alarm', options.reply_markup);
				this.setAlarmMessageToUsers(options.chat_id, sendMessage);
				await this.bot.editMessageReplyMarkup(options.reply_markup, options);
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
