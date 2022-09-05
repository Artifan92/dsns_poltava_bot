import TelegramApi from 'node-telegram-bot-api';
import { token } from './modules/secret.js';

const bot = new TelegramApi(token, { polling: true });

bot.on('message', msg => {
	const text = msg.text,
		chatId = msg.chat.id;

	bot.sendMessage(chatId, `Ви написали: ${text}`);
});
