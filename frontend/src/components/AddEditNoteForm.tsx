import { Button, Form, Modal } from 'react-bootstrap';
import { Note } from '../models/note';
import { NoteInput } from '../network/notes_api';
import { useForm } from 'react-hook-form';
import * as NotesApi from '../network/notes_api';
import TextInputField from './form/TextInputField';

interface AddEditNoteFormProps {
	noteToEdit?: Note;
	onDismiss: () => void;
	onNoteSaved: (note: Note) => void;
}

const AddEditNoteForm = ({
	noteToEdit,
	onDismiss,
	onNoteSaved,
}: AddEditNoteFormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<NoteInput>({
		defaultValues: {
			title: noteToEdit?.title || '',
			text: noteToEdit?.text || '',
		},
	});

	async function onSubmit(input: NoteInput) {
		try {
			let noteResponse: Note;
			if (noteToEdit) {
				noteResponse = await NotesApi.updateNote(noteToEdit._id, input);
			} else {
				noteResponse = await NotesApi.createNote(input);
			}

			onNoteSaved(noteResponse);
		} catch (error) {
			console.error(error);
			alert(error);
		}
	}

	return (
		<Modal show onHide={onDismiss}>
			<Modal.Header>
				<Modal.Title>{noteToEdit ? 'Edit note' : 'Add note'}</Modal.Title>
			</Modal.Header>

			<Modal.Body>
				<Form id='addEditNoteForm' onSubmit={handleSubmit(onSubmit)}>
					<TextInputField
						name='title'
						label='Title'
						type='text'
						placeholder='Title'
						register={register}
						registerOptions={{ required: 'Required' }}
						error={errors.title}
					/>
					<TextInputField
						name='text'
						label='Description'
						as='textarea'
						rows={5}
						placeholder='text'
						register={register}
					/>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button type='submit' form='addEditNoteForm' disabled={isSubmitting}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};
export default AddEditNoteForm;
