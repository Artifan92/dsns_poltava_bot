'use strict';
import TelegramApi from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import {
	UserModel,
	CommandModel,
	KeyboardModel,
	CallbackModel,
	RegionModel,
	TypeAlarmModel,
} from './data/dbModels.js';
import Commands from './modules/Commands.js';
import Keyboard from './modules/Keyboard.js';
import Callback from './modules/Callback.js';
import Alarm from './modules/Alarm.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_CONFIG_TOKEN,
	alarm_token = process.env.ALARM_API_CONFIG_TOKEN,
	webhookUrl = process.env.ALARM_API_CONFIG_WEBHOOK_URL,
	PORT = process.env.EXPRESS_CONFIG_PORT,
	postUrl = process.env.EXPRESS_CONFIG_POST_URL;

/** GET DATA FROM DB */
const commands = await CommandModel.find(),
	keyboard = await KeyboardModel.find(),
	callback = await CallbackModel.find();

/** BOT INIT */
const bot = new TelegramApi(token, { polling: true });

/** SET COMMANDS BOT */
const setCommandsBot = new Commands(commands, bot, UserModel);
setCommandsBot.render();

/** SET KEYBOARD */
const setKeyboard = new Keyboard(keyboard, bot);
setKeyboard.render();

/** CALLBACK */
const initcallback = new Callback(callback, bot, UserModel, {
	options: {
		parseMode: 'Markdown',
		disableWebPagePreview: false,
	},
});
initcallback.render();

/** ALARM INIT */
const alarm = new Alarm(
	alarm_token,
	PORT,
	webhookUrl,
	postUrl,
	bot,
	UserModel,
	RegionModel,
	TypeAlarmModel,
);
alarm.render();