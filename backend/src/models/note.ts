import { InferSchemaType, model, Schema } from 'mongoose';

const noteSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
		},
	},
	{ timestamps: true }
);

// Add custom TS type
type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>('Note', noteSchema);
