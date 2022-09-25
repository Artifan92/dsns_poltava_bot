'use strict';
import TelegramApi from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import {
	User,
	CommandModel,
	KeyboardModel,
	CallbackModel,
} from './data/dbModels.js';
import Commands from './modules/Commands.js';
import Keyboard from './modules/Keyboard.js';
import Callback from './modules/Callback.js';
import { getRegion, webHook } from './modules/allarm.js';

dotenv.config();
const token = process.env.TOKEN;

const commands = await CommandModel.find(),
	keyboard = await KeyboardModel.find(),
	callback = await CallbackModel.find();

/** BOT INIT */
const bot = new TelegramApi(token, { polling: true });

/** SET COMMANDS BOT */
const setCommandsBot = new Commands(commands, bot, User);
setCommandsBot.render();

/** SET KEYBOARD */
const setKeyboard = new Keyboard(keyboard, bot);
setKeyboard.render();

/** CALLBACK */
const initcallback = new Callback(callback, bot, {
	options: {
		parseMode: 'Markdown',
		disableWebPagePreview: false,
	},
});
initcallback.render();

webHook();

getRegion().then(async data => {
	await bot.sendMessage(
		252263254,
		`Область: ${data[0].regionName}; ${data[0].activeAlerts}`,
		{
			parse_mode: 'Markdown',
			disable_web_page_preview: false,
		},
	);
	console.log(data);
	console.log(data[0].activeAlerts);
});
