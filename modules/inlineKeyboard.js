import bot from './botInit.js';
import path from './path.js';

function inlineKeyboard() {
	const inlineKeyboardCallBack = [
		{
			callback_data: 'leadership',
			reply_markup: JSON.stringify({
				inline_keyboard: [
					[
						{
							text: `Керівництво!!!${'\u{1F468}\u{200D}\u{1F692}'}`,
							callback_data: 'leadership',
						},
					],
					[
						{
							text: `Структура!!!${'\u{1F692}'}`,
							callback_data: 'structure',
						},
					],
				],
			}),
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
				chat_id: 252263254,
				message_id: 380,
			},
		},
	];

	bot.on('callback_query', msg => {
		console.log(msg);
		inlineKeyboardCallBack.forEach(async item => {
			const keyboard = item.reply_markup,
				opts = item.opts;

			if (item.callback_data == msg.data) {
				await bot.editMessageReplyMarkup(keyboard, opts);
			}
		});
	});
}

export default inlineKeyboard;
