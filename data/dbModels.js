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
});

// UserSchema.methods.speak = function speak() {
// 	const greeting = this.name
// 		? 'Meow name is ' + this.name
// 		: "I don't have a name";
// 	console.log(greeting);
// };

const User = mongoose.model('user', UserSchema);

export { User };
