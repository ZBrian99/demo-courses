import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Option, Question, Stage } from '../../forms/types/types';
import { CustomMultiCheckbox, CustomRadioGroup, CustomTextarea, CustomTextInput } from '../../../components/inputs';
import { ResponsePayload, User } from '../types/types';
import CustomStepperNew from '../../../components/CustomStepperNew';
import { z, ZodSchema } from 'zod';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useFindFormByIdQuery, useSubmitFormResponsesMutation } from '../api/preinscripcionApi';
import { useParams } from 'react-router-dom';
import { CustomDatePicker, CustomSelect, CustomMultiSelect } from '../../../components/inputs';
dayjs.locale('es');

interface PreInscriptionFormProps {
	user: User;
	formId: string;
	setStep: React.Dispatch<React.SetStateAction<number>>;
}

// Función para crear un esquema dinámico en base a las preguntas
const createDynamicSchema = (questions: Question[]): ZodSchema => {
	const schemaShape = questions.reduce((acc, question) => {
		let fieldSchema;

		// Definir validación en base al tipo de pregunta y condiciones
		switch (question.type) {
			case 'TEXTO_CORTO':
				fieldSchema = question.isRequired
					? z.string().min(1, 'Debe tener al menos 1 caracter').max(100, 'No puede exceder los 100 caracteres')
					: z.string().optional();
				break;
			case 'TEXTO_LARGO':
				fieldSchema = question.isRequired
					? z.string().min(1, 'Debe tener al menos 1 caracter').max(300, 'No puede exceder los 300 caracteres')
					: z.string().optional();
				break;
			case 'SELECCION':
				fieldSchema = question.isRequired ? z.string().min(1, 'Seleccione una opción') : z.string().optional();
				break;
			case 'CHECKBOX':
				fieldSchema = question.isRequired
					? z.array(z.string()).min(1, 'Seleccione al menos una opción')
					: z.array(z.string()).optional().default([]);
				break;
			case 'FECHA':
				fieldSchema = question.isRequired ? z.string().min(1, 'La fecha es requerida') : z.string().optional();
				break;
			case 'DESPLEGABLE':
				fieldSchema = question.isRequired ? z.string().min(1, 'Debe seleccionar una opción') : z.string().optional();
				break;
			case 'DESPLEGABLE_MULTIPLE':
				fieldSchema = question.isRequired
					? z.array(z.string()).min(1, 'Debe seleccionar al menos una opción')
					: z.array(z.string()).optional().default([]);
				break;
			default:
				fieldSchema = z.string().optional();
				break;
		}

		acc[`${question.id}`] = fieldSchema;
		return acc;
	}, {} as Record<string, ZodSchema>);

	return z.object(schemaShape);
};

const PreInscriptionForm: React.FC<PreInscriptionFormProps> = ({ user, formId, setStep }) => {
	const { data: formData, error, isLoading } = useFindFormByIdQuery({ id: formId });
	const [activeStep, setActiveStep] = useState(0);
	// const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitFormResponses, { isLoading: isSubmitting, isError }] = useSubmitFormResponsesMutation();
	const { id } = useParams<{ id: string }>();

	const methods = useForm({
		mode: 'onBlur',
	});

	const { handleSubmit, setValue, getValues, trigger } = methods;

	useEffect(() => {
		if (formData) {
			// console.log(formData);
			const dynamicSchema = createDynamicSchema(formData.stages.flatMap((stage) => stage.questions));

			methods.reset({}, { keepErrors: true });
			methods.control._options.resolver = zodResolver(dynamicSchema);

			formData.stages.forEach((stage) => {
				stage.questions.forEach((question) => {
					const initialValue = ['CHECKBOX', 'DESPLEGABLE_MULTIPLE'].includes(question.type) ? [] : '';
					methods.setValue(`${question.id}`, initialValue);
				});
			});
		}
	}, [formData, setValue]);

	if (isLoading)
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	if (error) return <div>Error cargando formulario</div>;

	const renderQuestion = (question: Question, index: number) => {
		switch (question.type) {
			case 'TEXTO_CORTO':
				return (
					<CustomTextInput
						key={question.id}
						label={`${question.text}`}
						name={`${question.id}`}
						required={question.isRequired}
						fullWidth
						shrink={false}
					/>
				);
			case 'TEXTO_LARGO':
				return (
					<CustomTextarea
						key={question.id}
						label={`${question.text}`}
						name={`${question.id}`}
						rows={4}
						required={question.isRequired}
						fullWidth
						shrink={false}
					/>
				);
			case 'SELECCION':
				return (
					<CustomRadioGroup
						key={question.id}
						label={`${question.text}`}
						name={`${question.id}`}
						required={question.isRequired}
						fullWidth
						options={
							question.options?.map((option: Option) => ({
								label: option.text,
								value: option.id || '',
							})) || []
						}
					/>
				);
			case 'CHECKBOX':
				return (
					<CustomMultiCheckbox
						key={question.id}
						label={`${question.text}`}
						name={`${question.id}`}
						required={question.isRequired}
						fullWidth
						options={
							question.options?.map((option: Option) => ({
								label: option.text,
								value: option.id || '',
							})) || []
						}
					/>
				);
			case 'FECHA':
				return (
					<CustomDatePicker
						key={question.id}
						label={question.text}
						name={`${question.id}`}
						required={question.isRequired}
						fullWidth
						shrink={false}
					/>
				);
			case 'DESPLEGABLE':
				return (
					<CustomSelect
						key={question.id}
						label={question.text}
						name={`${question.id}`}
						required={question.isRequired}
						fullWidth
						shrink={false}
						options={
							question.options?.map((option) => ({
								label: option.text,
								value: option.id || '',
							})) || []
						}
					/>
				);
			case 'DESPLEGABLE_MULTIPLE':
				return (
					<CustomMultiSelect
						key={question.id}
						label={question.text}
						name={`${question.id}`}
						required={question.isRequired}
						fullWidth
						shrink={false}
						options={
							question.options?.map((option) => ({
								label: option.text,
								value: option.id || '',
							})) || []
						}
					/>
				);
			default:
				return null;
		}
	};

	const onSubmit = async () => {
		if (isSubmitting) return;
		const formValues = getValues();
		const responses: ResponsePayload[] = Object.keys(formValues)
			.map((key) => {
				const questionId = key;
				const question = formData?.stages.flatMap((stage) => stage.questions).find((q) => q.id === questionId);

				if (!question) return null;

				switch (question.type) {
					case 'CHECKBOX':
					case 'DESPLEGABLE_MULTIPLE':
						return {
							preguntaId: questionId,
							opciones: formValues[key].length > 0 ? formValues[key].map((id: string) => ({ opcionId: id })) : [],
						};

					case 'SELECCION':
					case 'DESPLEGABLE':
						return {
							preguntaId: questionId,
							opciones: formValues[key] ? [{ opcionId: formValues[key] }] : [],
						};

					case 'TEXTO_CORTO':
					case 'TEXTO_LARGO':
					case 'FECHA':
						return {
							preguntaId: questionId,
							textValue: formValues[key] || null,
						};

					default:
						return null;
				}
			})
			.filter(Boolean) as ResponsePayload[];

		try {
			// console.log({ alumnoId: user?.id, respuestas: responses });
			if (id) {
				await submitFormResponses({ ref: id, alumnoId: user.id, respuestas: responses }).unwrap();
				setStep(5);
			}
		} catch (error: any) {
			console.error('Error al enviar respuestas:', error);
			if (error?.data?.message === 'El alumno ya está inscrito en esta comisión') {
				setStep(6);
			}
		}
	};

	const handleNext = async () => {
		// Obtener las preguntas de la etapa actual
		const currentStageQuestions = formData?.stages[activeStep].questions || [];

		// Generar los nombres de los campos a validar en esta etapa
		const currentStageFieldNames = currentStageQuestions.map((question) => `${question.id}`);

		// Disparar la validación de los campos actuales
		const isValid = await trigger(currentStageFieldNames);

		if (isValid) {
			if (activeStep < (formData?.stages.length || 0) - 1) {
				setActiveStep((prevStep) => prevStep + 1);
			}
		}
	};

	const handleBack = () => {
		if (activeStep > 0) {
			setActiveStep((prevStep) => prevStep - 1);
		} else {
			setStep(3);
		}
	};

	return (
		<Paper
			sx={{
				padding: '1.5rem',
				width: '100%',
				maxWidth: '50rem',
				display: 'flex',
				flexDirection: 'column',
				gap: '2rem',
				borderRadius: '1rem',
			}}
			elevation={3}
		>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					{formData && (
						<CustomStepperNew
							title={formData.title}
							subtitle={formData.descripcion || ''}
							label='Formulario de preinscripción'
							steps={formData.stages.map((stage) => stage.title)}
							activeStep={activeStep}
						/>
					)}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '1rem',
							mt: '2rem',
							fontWeight: 500,
							color: 'gray.800',
						}}
					>
						{formData?.stages[activeStep].questions.map((question: Question, index) => (
							<Box key={question.id} sx={{ mb: '1rem' }}>
								{renderQuestion(question, index)}
							</Box>
						))}
					</Box>

					<Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
						<Button variant='outlined' color='primary' onClick={handleBack}>
							Atrás
						</Button>
						{activeStep === (formData?.stages.length || 0) - 1 ? (
							<Button variant='contained' color='primary' onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										Enviando
										<CircularProgress size={20} sx={{ marginLeft: '0.5rem', color: 'inherit' }} />
									</>
								) : isError ? (
									'Reintentar'
								) : (
									'Finalizar'
								)}
							</Button>
						) : (
							<Button variant='contained' color='primary' onClick={handleNext}>
								Siguiente
							</Button>
						)}
					</Box>
				</form>
			</FormProvider>
		</Paper>
	);
};

export default PreInscriptionForm;
