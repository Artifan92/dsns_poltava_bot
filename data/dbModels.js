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
		allarm_message: {
			type: Boolean,
			default: false,
		},
		allarm_region_id: {
			type: Array,
			default: [19],
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
	}),
	RegionSchema = new mongoose.Schema({
		regionId: {
			type: Number,
			require: true,
		},
		regionName: {
			type: String,
			require: true,
		},
		regionType: {
			type: String,
			require: true,
		},
		regionChildIds: {
			type: Array,
			require: true,
		},
	}),
	TypeAllarmSchema = new mongoose.Schema({
		allarmType: {
			type: String,
			require: true,
		},
		message: {
			type: String,
			require: true,
		},
	});

const UserModel = mongoose.model('user', UserSchema),
	CommandModel = mongoose.model('command', CommandSchema),
	KeyboardModel = mongoose.model('keyboard', KeyboardSchema),
	CallbackModel = mongoose.model('callback', CallbackSchema),
	RegionModel = mongoose.model('region', RegionSchema),
	TypeAllarmModel = mongoose.model('typeallarm', TypeAllarmSchema);

export {
	UserModel,
	CommandModel,
	KeyboardModel,
	CallbackModel,
	RegionModel,
	TypeAllarmModel,
};
