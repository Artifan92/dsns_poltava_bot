import bot from './botInit.js';

function keyboard() {
	const mainKeyboard = [
		{
			btn: `Про Головне управління${'\u{1F1FA}\u{1F1E6}'}`,
			text: `Про Головне управління меню`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
				reply_markup: JSON.stringify({
					inline_keyboard: [
						[
							{
								text: `Керівництво${'\u{1F468}\u{200D}\u{1F692}'}`,
								callback_data: 'leadership',
							},
						],
						[
							{
								text: `Структура${'\u{1F692}'}`,
								callback_data: 'structure',
							},
						],
					],
				}),
			},
		},
		{
			btn: `Нормативна база${'\u{1F5C4}'}`,
			text: `Нормативна база меню`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
			},
		},
		{
			btn: `Бізнесу${'\u{1F468}\u{200D}\u{1F4BB}'}`,
			text: `Бізнесу меню`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
			},
		},
		{
			btn: `Громадянам${'\u{1F468}\u{200D}\u{1F469}\u{200D}\u{1F467}\u{200D}\u{1F466}'}`,
			text: `Громадянам меню`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
			},
		},
		{
			btn: `Інформація${'\u{2139}'}`,
			text: `Інформація меню`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
			},
		},
		{
			btn: `Допомога${'\u{1F64B}'}`,
			text: `Допомога меню`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
			},
		},
	];

	function keyboardBtn() {
		return [
			[mainKeyboard[0].btn, mainKeyboard[1].btn],
			[mainKeyboard[2].btn, mainKeyboard[3].btn],
			[mainKeyboard[4].btn, mainKeyboard[5].btn],
		];
	}

	function answerMainMenu(msg) {
		mainKeyboard.forEach(async item => {
			const text = item.text,
				opts = item.opts,
				chatId = msg.chat.id;

			if (msg.text == item.btn) {
				await bot.sendMessage(chatId, text, opts);
			}
		});
	}

	bot.on('message', answerMainMenu);

	return keyboardBtn();
}

export default keyboard;
