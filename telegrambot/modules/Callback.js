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

	async changesUsersRegionsToNotify(msgChatId, msgData, user) {
		let regionsUser = user.alarm_region_id;

		if (msgData.match(/turn_off/)) {
			regionsUser = regionsUser.filter(region => {
				return region != +msgData.replace(/\D/gi, '');
			});

			await this.User.findOneAndUpdate(
				{ id: msgChatId },
				{ alarm_region_id: regionsUser },
				{
					new: true,
				},
			);
		}

		if (msgData.match(/turn_on/)) {
			regionsUser.push(+msgData.replace(/\D/gi, ''));

			await this.User.findOneAndUpdate(
				{ id: msgChatId },
				{ alarm_region_id: regionsUser },
				{
					new: true,
				},
			);
		}

		return await this.User.findOne({
			id: msgChatId,
		}).exec();
	}

	async setReplyMarkupToAlarmMessage(chatId, user, typeCallback, region) {
		const notifyUser = user.alarm_message;
		let callbackData;
		let stateNotify;

		if (notifyUser) {
			stateNotify = false;
			callbackData =
				typeCallback === 'alarmNotify'
					? 'turn_off_notify_alarm'
					: 'turn_on_notify_alarm';
		}
		if (!notifyUser) {
			stateNotify = true;
			callbackData =
				typeCallback === 'alarmNotify'
					? 'turn_on_notify_alarm'
					: 'turn_off_notify_alarm';
		}

		if (typeCallback === 'alarmNotify') {
			await this.setAlarmMessageToUsers(chatId, stateNotify);
		}

		return JSON.stringify({
			inline_keyboard: [
				(
					await this.Callback.findOne({
						callbackData: callbackData,
					})
				).replyMarkup,
				...region,
			],
		});
	}

	async setReplyMarkup(chatId, user, typeCallback) {
		const regionsUser = user.alarm_region_id;
		const regions = await this.Callback.find(
			{ typeCallback: 'alarm' },
			'callbackData answerText replyMarkup numberOfOrder',
		).exec();

		const regionAll = regions
			.filter(region => {
				if (region.callbackData.match(/turn_on/)) {
					return regionsUser.includes(+region.callbackData.replace(/\D/gi, ''));
				}
				if (region.callbackData.match(/turn_off/)) {
					return !regionsUser.includes(
						+region.callbackData.replace(/\D/gi, ''),
					);
				}
			})
			.sort((a, b) => a.numberOfOrder - b.numberOfOrder)
			.reduce((acum, curent) => {
				acum.push([curent.replyMarkup[0], curent.replyMarkup[1]]);

				return acum;
			}, []);

		return await this.setReplyMarkupToAlarmMessage(
			chatId,
			user,
			typeCallback,
			regionAll,
		);
	}

	async eventCallback(callback, callbacksAll) {
		const msgData = callback.data;

		let options = {
			parse_mode: this.parseMode,
			disable_web_page_preview: this.disableWebPagePreview,
			chat_id: callback.message.chat.id,
			message_id: callback.message.message_id,
		};

		/** ITERATION CALLBACK */
		callbacksAll.forEach(async item => {
			const callbackData = item.callbackData;

			/** ANSWER CALLBACK. EDITMEASSAGE OR EDITREPLYMARKUP */
			if (callbackData == msgData) {
				let findUser = await this.User.findOne({
					id: options.chat_id,
				}).exec();

				const text = item.text,
					answerText = item.answerText,
					typeCallback = item.typeCallback,
					replyMarkup = item.replyMarkup;

				await this.bot.answerCallbackQuery(callback.id, {
					text: answerText,
					show_alert: false,
				});

				if (replyMarkup.length) {
					options = {
						...options,
						reply_markup: JSON.stringify({ inline_keyboard: replyMarkup }),
					};
				}

				/** WITHOUT TYPECALLBACK */
				if (!typeCallback) {
					if (text) {
						await this.bot.editMessageText(text, options);
					}
					if (!text && options.reply_markup) {
						await this.bot.editMessageReplyMarkup(
							options.reply_markup,
							options,
						);
					}
				}

				/** TYPECALLBACK - ALARMNOTIFY */
				if (callbackData == msgData && typeCallback === 'alarmNotify') {
					options.reply_markup = await this.setReplyMarkup(
						options.chat_id,
						findUser,
						typeCallback,
					);

					await this.bot.editMessageReplyMarkup(options.reply_markup, options);
				}

				/** TYPECALLBACK - ALARM */
				if (callbackData == msgData && typeCallback === 'alarm') {
					findUser = await this.changesUsersRegionsToNotify(
						options.chat_id,
						msgData,
						findUser,
					);

					options.reply_markup = await this.setReplyMarkup(
						options.chat_id,
						findUser,
						typeCallback,
					);

					await this.bot.editMessageReplyMarkup(options.reply_markup, options);
				}
			}
		});
	}

	async render() {
		const callbacksAll = await this.getAlarmTypes();

		this.bot.on('callback_query', callback => {
			this.eventCallback(callback, callbacksAll);
		});
	}
}

export default Callback;
