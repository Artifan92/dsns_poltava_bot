import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const user = process.env.USER_MONGO,
	pass = process.env.PASS_MONGO;

async function connectToDb() {
	const mongoDB = `mongodb+srv://${user}:${pass}@telegrambot.anjvydp.mongodb.net/?retryWrites=true&w=majority`;
	await mongoose.connect(mongoDB, { dbName: 'bot' });
}

connectToDb().catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
		id: {
			type: Number,
			require: true,
		},
		is_bot: Boolean,
		first_name: String,
		last_name: String,
		username: String,
		language_code: String,
		is_premium: Boolean,
		admin: {
			type: Boolean,
			default: false,
		},
		dsns_user: {
			type: Boolean,
			default: false,
		},
	}),
	CommandSchema = new mongoose.Schema({
		command: String,
		description: String,
		text: String,
		opts: Object,
	}),
	KeyboardSchema = new mongoose.Schema({
		btn: String,
		text: String,
		id: String,
		opts: Object,
	}),
	CallbackSchema = new mongoose.Schema({
		callbackData: {
			type: String,
			require: true,
		},
		answerText: {
			type: String,
			require: true,
		},
		text: {
			type: String,
			default: null,
		},
		replyMarkup: {
			type: String,
			default: null,
		},
	});

const User = mongoose.model('user', UserSchema),
	CommandModel = mongoose.model('command', CommandSchema),
	KeyboardModel = mongoose.model('keyboard', KeyboardSchema),
	CallbackModel = mongoose.model('callback', CallbackSchema);

export { User, CommandModel, KeyboardModel, CallbackModel };
