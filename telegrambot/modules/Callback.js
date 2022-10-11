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

	async setReplyMarkup(chatId, user) {
		const notifyUser = user.alarm_message;
		const regionsUser = user.alarm_region_id;
		const regions = await this.Callback.find(
			{ typeCallback: 'alarm' },
			'callbackData answerText replyMarkup',
		).exec();

		const regionReduce = regions.reduce((acum, curent) => {
			regionsUser.forEach(region => {
				if (
					region == curent.callbackData.replace(/\D/gi, '') &&
					curent.callbackData.match(/turn_on/)
				) {
					acum.push([
						JSON.parse(curent.replyMarkup[0]),
						JSON.parse(curent.replyMarkup[1]),
					]);
				}
				if (
					region != curent.callbackData.replace(/\D/gi, '') &&
					curent.callbackData.match(/turn_off/)
				) {
					acum.push([
						JSON.parse(curent.replyMarkup[0]),
						JSON.parse(curent.replyMarkup[1]),
					]);
				}
			});

			return acum;
		}, []);

		if (notifyUser) {
			await this.setAlarmMessageToUsers(chatId, false);
			return JSON.stringify({
				inline_keyboard: [
					[
						JSON.parse(
							(
								await this.Callback.findOne({
									callbackData: 'turn_off_notify_alarm',
								})
							).replyMarkup,
						),
					],
					...regionReduce,
				],
			});
		}

		if (!notifyUser) {
			await this.setAlarmMessageToUsers(chatId, true);
			return JSON.stringify({
				inline_keyboard: [
					[
						JSON.parse(
							(
								await this.Callback.findOne({
									callbackData: 'turn_on_notify_alarm',
								})
							).replyMarkup,
						),
					],
					...regionReduce,
				],
			});
		}
	}

	async changesUsersRegionToNotify(msgChatId, msgData, user) {
		const regionsUser = user.alarm_region_id;
		regionsUser.forEach(async (region, index) => {
			if (region == msgData.replace(/\D/gi, '') && msgData.match(/turn_off/)) {
				console.log(true);
				await this.User.findOneAndUpdate(
					{ id: msgChatId },
					{ alarm_region_id: [...regionsUser, msgData.replace(/\D/gi, '')] },
					{
						new: true,
					},
				);
			}

			if (region != msgData.replace(/\D/gi, '') && msgData.match(/turn_on/)) {
				console.log(false);
				// await this.User.findOneAndUpdate(
				// 	{ id: msgChatId },
				// 	{
				// 		alarm_region_id: regionsUser.push(msgData.replace(/\D/gi, '')),
				// 	},
				// 	{
				// 		new: true,
				// 	},
				// );
			}
		});
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
				const findUser = await this.User.findOne({
						id: options.chat_id,
					}).exec(),
					text = item.text,
					answerText = item.answerText,
					typeCallback = item.typeCallback,
					replyMarkup = item.replyMarkup;

				await this.bot.answerCallbackQuery(callback.id, {
					text: answerText,
					show_alert: false,
				});

				if (replyMarkup) {
					options = {
						...options,
						reply_markup: JSON.stringify([[{ inline_keyboard: replyMarkup }]]),
					};
				}

				/** !TYPECALLBACK */
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

				/** TYPECALLBACK - ALARM */
				if (callbackData == msgData && typeCallback === 'alarm') {
					await this.changesUsersRegionToNotify(
						options.chat_id,
						msgData,
						findUser,
					);
					// options.reply_markup = await this.setReplyMarkup(
					// 	options.chat_id,
					// 	findUser,
					// );
					// await this.bot.editMessageReplyMarkup(options.reply_markup, options);
				}
				if (callbackData == msgData && typeCallback === 'alarmNotify') {
					options.reply_markup = await this.setReplyMarkup(
						options.chat_id,
						findUser,
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
