import TelegramApi from 'node-telegram-bot-api';
import { token } from '../services/secret.js';

const bot = new TelegramApi(token, { polling: true });

export default bot;
