import app from './app';
import env from './util/envalid';
import mongoose from 'mongoose';

const port = env.PORT;

mongoose
	.connect(env.MONGO_CONNECTION_STRING)
	.then(() => {
		console.log('Connection to MongoDB Atlas was successful.');
		app.listen(port, () => console.log('Server is running on port: ' + port));
	})
	.catch(console.error);
