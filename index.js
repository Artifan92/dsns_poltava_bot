import bot from './modules/botInit.js';
import { commands, keyboard } from './services/data.js';
import Commands from './modules/Commands.js';
import Keyboard from './modules/Keyboard.js';

/** SET COMMANDS BOT */
const setCommandsBot = new Commands(commands, bot);
setCommandsBot.render();

/** SET KEYBOARD */
const setKeyboard = new Keyboard(keyboard, bot);
setKeyboard.render();
