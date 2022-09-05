import bot from './botInit.js';

function commands() {
	const commandsInfo = [
		{
			command: '/start',
			description: 'Почати',
			text: `Вітаю в Telegram BOT ГУ ДСНС України у Полтавській області ${'\u{1F1FA}\u{1F1E6}'}`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
				reply_markup: JSON.stringify({
					keyboard: [
						['Меню 1', 'Меню 2', 'Меню 3'],
						['Меню 4', 'Меню 5', 'Меню 6'],
					],
					resize_keyboard: true,
					one_time_keyboard: true,
				}),
			},
		},
		{
			command: '/contacts',
			description: 'Контакти Головного управління',
			text: `
*Контакти:*

Адреса: [вул. Маршала Бірюзова, 26/1, м. Полтава, Україна, 36007](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.google.com%2Fmaps%2Fdir%2F%3Fapi%3D1%26destination%3D49.600308569509%252C34.519708156586%26fbclid%3DIwAR3cPekPRLYGDd0CgTpQYKkmJgF5LWwb7s4Kflo4PXsFu3zHOL1sYDlxWdc&h=AT05JOFQlmpVSOvLNm513xUgCTmSYoeASppUwPUDrZpKTc9p3ZiPPIh9InUlV_cZXQ2GqunYBot-pUgxAitOWpvvdGPdWPh-4Y5FaDNmH4TZKB_d4iZONH0tQ_502eURLPzqbQ)

Телефон: +380532564602

[Official site](https://dsns.gov.ua) / [facebook](https://www.facebook.com/DSNSPOLTAVA) / [YouTube](https://www.youtube.com/channel/UCwU1Gvq7fhSXkNH2lgiRF1Q) / [Instagram](https://www.instagram.com/dsns_poltavska_oblast) / [WhatsApp](https://wa.me/380676785917)`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
			},
		},
		{
			command: '/links',
			description: 'Корисні посилання',
			text: `
*Корисні посилання:*

[ДСНС ПОЛТАВА СИРЕНА](https://t.me/dsns_poltava_syrena)

Розмінування України: [${'\u{1F916}'} Android](https://play.google.com/store/apps/details?id=com.infotech.mines) / [${'\u{1F4F1}'} IOS](https://apps.apple.com/ua/app/%D1%80%D0%BE%D0%B7%D0%BC%D1%96%D0%BD%D1%83%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F-%D1%83%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8/id1612813056)

Мінна безпека: [${'\u{1F916}'} Android](https://play.google.com/store/apps/details?id=com.minefree) / [${'\u{1F4F1}'} IOS](https://apps.apple.com/ua/app/minefree/id1624507845)

Повітряна тривога: [${'\u{1F916}'} Android](https://play.google.com/store/apps/details?id=com.ukrainealarm) / [${'\u{1F4F1}'} IOS](https://apps.apple.com/ua/app/%D0%BF%D0%BE%D0%B2%D1%96%D1%82%D1%80%D1%8F%D0%BD%D0%B0-%D1%82%D1%80%D0%B8%D0%B2%D0%BE%D0%B3%D0%B0/id1611955391)
			`,
			opts: {
				parse_mode: 'Markdown',
				disable_web_page_preview: true,
			},
		},
	];

	const commandsList = commandsInfo.reduce((start, current) => {
		start.push({
			command: current.command,
			description: current.description,
		});
		return start;
	}, []);

	/** SET COMMANDS */
	bot.setMyCommands(commandsList);

	/** LISTENER COMMANDS */
	bot.on('message', msg => {
		commandsInfo.forEach(async item => {
			const text = item.text,
				chatId = msg.chat.id;

			if (msg.text == item.command) {
				await bot.sendMessage(chatId, text, item.opts);
			}
		});
	});
}

export default commands;
