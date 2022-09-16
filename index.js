import TelegramApi from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { commands, keyboard, callback } from './services/data.js';
import Commands from './modules/Commands.js';
import Keyboard from './modules/Keyboard.js';
import Callback from './modules/Callback.js';

dotenv.config();
const token = process.env.TOKEN;

/** BOT INIT */
const bot = new TelegramApi(token, { polling: true });

/** SET COMMANDS BOT */
const setCommandsBot = new Commands(commands, bot);
setCommandsBot.render();

/** SET KEYBOARD */
const setKeyboard = new Keyboard(keyboard, bot);
setKeyboard.render();

/** CALLBACK */
const initcallback = new Callback(callback, bot, {
	options: {
		parseMode: 'Markdown',
		disableWebPagePreview: true,
	},
});
initcallback.render();
