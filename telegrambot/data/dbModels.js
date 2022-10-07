import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const user = process.env.MONGO_CONFIG_USER,
	pass = process.env.MONGO_CONFIG_PASS;

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
		alarm_message: {
			type: Boolean,
			default: false,
		},
		alarm_region_id: {
			type: Array,
			default: [19],
		},
	}),
	CommandSchema = new mongoose.Schema({
		command: String,
		numberOfOrder: Number,
		show: Boolean,
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
		replyMarkup: String,
		typeCallback: String,
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
	TypeAlarmSchema = new mongoose.Schema({
		alarmType: {
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
	TypeAlarmModel = mongoose.model('typealarm', TypeAlarmSchema);

export {
	UserModel,
	CommandModel,
	KeyboardModel,
	CallbackModel,
	RegionModel,
	TypeAlarmModel,
};
