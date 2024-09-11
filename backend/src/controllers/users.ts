import { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
	const authenticatedUserId = req.session.userId;

	try {
		if (!authenticatedUserId) {
			throw createHttpError(401, 'User not authenticated.');
		}

		const user = await UserModel.findById(authenticatedUserId)
			.select('+email')
			.exec();
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
};

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

		req.session.userId = newUser._id;

		res.status(201).json(newUser);
	} catch (error) {
		next(error);
	}
};

interface LoginBody {
	username?: string;
	password?: string;
}

export const login: RequestHandler<
	unknown,
	unknown,
	LoginBody,
	unknown
> = async (req, res, next) => {
	const { username, password } = req.body;

	try {
		if (!username || !password) {
			throw createHttpError(400, 'Parameters missing.');
		}

		const user = await UserModel.findOne({ username })
			.select('+password +email')
			.exec();

		if (!user) {
			throw createHttpError(401, 'Invalid credentials.');
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			throw createHttpError(401, 'Invalid credentials.');
		}

		req.session.userId = user._id;
		res.status(201).json(user);
	} catch (error) {
		next(error);
	}
};
