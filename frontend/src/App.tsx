import React, { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Button, Col, Container, Row } from 'react-bootstrap';
import styles from './styles/NotesPage.module.css';
import styleUtils from './styles/utils.module.css';
import * as NotesApi from './network/notes_api';
import AddNoteForm from './components/AddNoteForm';

function App() {
	const [notes, setNotes] = useState<NoteModel[]>([]);
	const [showAddNoteForm, setShowAddNoteForm] = useState(false);

	useEffect(() => {
		async function loadNotes() {
			try {
				const notes = await NotesApi.fetchNotes();
				setNotes(notes);
			} catch (error) {
				console.error(error);
				alert(error);
			}
		}
		loadNotes();
	}, []);

	return (
		<Container>
			<Button
				className={`mb-4 ${styleUtils.blockCenter}`}
				onClick={() => setShowAddNoteForm(true)}
			>
				Add new note
			</Button>
			<Row xs={1} md={2} xl={3} className='g-4'>
				{notes.map((note) => (
					<Col key={note._id}>
						<Note note={note} className={styles.note} />
					</Col>
				))}
			</Row>
			{showAddNoteForm && (
				<AddNoteForm
					onDismiss={() => setShowAddNoteForm(false)}
					onNoteSaved={(newNote) => {
						setNotes([...notes, newNote]);
						setShowAddNoteForm(false);
					}}
				/>
			)}
		</Container>
	);
}

export default App;
