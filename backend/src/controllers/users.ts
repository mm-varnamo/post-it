import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';

interface SignUpBody {
	username?: string;
	email?: string;
	password?: string;
}

export const signUp: RequestHandler<
	unknown,
	unknown,
	SignUpBody,
	unknown
> = async (req, res, next) => {
	const { username, email, password: passwordRaw } = req.body;

	try {
		if (!username || !email || !passwordRaw) {
			throw createHttpError(400, 'Parameters missing');
		}

		const existingUsername = await UserModel.findOne({ username }).exec();

		if (existingUsername) {
			throw createHttpError(400, 'Invalid username.');
		}

		const existingEmail = await UserModel.findOne({ email }).exec();

		if (existingEmail) {
			throw createHttpError(409, 'Invalid email.');
		}

		const passwordHashed = await bcrypt.hash(passwordRaw, 12);

		const newUser = await UserModel.create({
			username,
			email,
			password: passwordHashed,
		});

		res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
};
