import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { fetchFormById } from '../slices/formsSlice';
import { useParams } from 'react-router-dom';

export const ViewForm: React.FC = () => {
	const dispatch = useAppDispatch();
	const { id } = useParams<{ id: string }>();
	const formState = useAppSelector((state) => state.forms);
	const form = formState.forms.find((f) => f.id === id);

	useEffect(() => {
		if (id) {
			dispatch(fetchFormById(id));
		}
	}, [dispatch, id]);

	if (!form) return <p>Cargando...</p>;

	return (
		<div>
			<h1>{form.title}</h1>
			{form.stages.map((stage) => (
				<div key={stage.id}>
					<h2>{stage.title}</h2>
					{stage.questions.map((question) => (
						<div key={question.id}>
							<p>{question.text}</p>
							{/* Renderizado condicional para los tipos de preguntas */}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default ViewForm;
