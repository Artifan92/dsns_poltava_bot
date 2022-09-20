// Импортировать модуль mongoose
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const opts = {
	dbName: 'bot',
	user: process.env.USER_MONGO,
	pass: process.env.PASS_MONGO,
};

async function connectToDb() {
	const mongoDB =
		'mongodb+srv://telegrambot.anjvydp.mongodb.net/?retryWrites=true&w=majority';
	await mongoose.connect(mongoDB, opts);
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
		callbackData: String,
		answerText: String,
		replyMarkup: String,
	});

const User = mongoose.model('user', UserSchema),
	CommandModel = mongoose.model('command', CommandSchema),
	KeyboardModel = mongoose.model('keyboard', KeyboardSchema),
	CallbackModel = mongoose.model('callback', CallbackSchema);

export { User, CommandModel, KeyboardModel, CallbackModel };
