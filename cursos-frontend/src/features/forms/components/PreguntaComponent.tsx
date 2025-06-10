import React from 'react';
import {
	Box,
	Select,
	MenuItem,
	FormControlLabel,
	Button,
	TextField,
	IconButton,
	Switch,
	Divider,
	Paper,
	Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import PreguntaOpcionComponent from './PreguntaOpcionComponent';
import { SelectChangeEvent } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '../types/types';
import { CustomDatePicker } from '../../../components/inputs';

interface PreguntaProps {
	etapaIndex: number;
	preguntaIndex: number;
	removePregunta: () => void;
	onDeleteClick: (
		type: 'etapa' | 'pregunta',
		onConfirm: () => void,
		etapaIndex?: number,
		preguntaIndex?: number
	) => void;
}

const PreguntaComponent: React.FC<PreguntaProps> = ({ etapaIndex, preguntaIndex, removePregunta, onDeleteClick }) => {
	const { register, setValue, control, resetField } = useFormContext();
	const { fields: opcionesFields, append: appendOpcion } = useFieldArray({
		control,
		name: `stages.${etapaIndex}.questions.${preguntaIndex}.options`,
	});

	const [tipoPregunta, isRequired, isDropdown] = useWatch({
		name: [
			`stages.${etapaIndex}.questions.${preguntaIndex}.type`,
			`stages.${etapaIndex}.questions.${preguntaIndex}.isRequired`,
			`stages.${etapaIndex}.questions.${preguntaIndex}.isDropdown`,
		],
		control,
	});

	setValue(`stages.${etapaIndex}.questions.${preguntaIndex}.order`, preguntaIndex);

	const handleChangeTipo = (e: SelectChangeEvent<string>) => {
		const nuevoTipo = e.target.value as Question['type'];
		
		if (nuevoTipo === 'SELECCION' || nuevoTipo === 'CHECKBOX') {
			setValue(`stages.${etapaIndex}.questions.${preguntaIndex}.type`, nuevoTipo);
			resetField(`stages.${etapaIndex}.questions.${preguntaIndex}.respuesta`);
			setValue(`stages.${etapaIndex}.questions.${preguntaIndex}.options`, [{ id: uuidv4(), text: '' }]);
		} else {
			setValue(`stages.${etapaIndex}.questions.${preguntaIndex}.type`, nuevoTipo);
			setValue(`stages.${etapaIndex}.questions.${preguntaIndex}.options`, []);
			resetField(`stages.${etapaIndex}.questions.${preguntaIndex}.respuesta`);
		}
	};

	const handleDropdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isDropdown = e.target.checked;
		const currentType = tipoPregunta;

		if (currentType === 'SELECCION' || currentType === 'DESPLEGABLE') {
			setValue(
				`stages.${etapaIndex}.questions.${preguntaIndex}.type`,
				isDropdown ? 'DESPLEGABLE' : 'SELECCION'
			);
		} else if (currentType === 'CHECKBOX' || currentType === 'DESPLEGABLE_MULTIPLE') {
			setValue(
				`stages.${etapaIndex}.questions.${preguntaIndex}.type`,
				isDropdown ? 'DESPLEGABLE_MULTIPLE' : 'CHECKBOX'
			);
		}
	};

	const isDropdownType = tipoPregunta === 'DESPLEGABLE' || tipoPregunta === 'DESPLEGABLE_MULTIPLE';
	const baseType = tipoPregunta === 'DESPLEGABLE' || tipoPregunta === 'SELECCION' 
		? 'SELECCION' 
		: tipoPregunta === 'DESPLEGABLE_MULTIPLE' || tipoPregunta === 'CHECKBOX'
			? 'CHECKBOX'
			: tipoPregunta;

	const renderInputComponent = () => {
		switch (baseType) {
			case 'TEXTO_CORTO':
				return <TextField label='Vista previa (Texto Corto)' fullWidth />;
			case 'TEXTO_LARGO':
				return <TextField label='Vista previa (Texto Largo)' fullWidth multiline rows={4} />;
			case 'SELECCION':
			case 'CHECKBOX':
				return (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<PreguntaOpcionComponent 
							etapaIndex={etapaIndex} 
							preguntaIndex={preguntaIndex} 
							tipo={baseType}
						/>
					</Box>
				);
			case 'FECHA':
				return (
					<CustomDatePicker
						label='Vista previa (Fecha)'
						name={`preview_${etapaIndex}_${preguntaIndex}`}
						// disabled
						fullWidth
					/>
				);
			default:
				return null;
		}
	};

	return (
		<Paper
			sx={{
				display: 'flex',
				gap: '1.5rem',
				p: { xs: '1rem', sm: '1.5rem' },
				flexDirection: { xs: 'column', md: 'row' },
				borderRadius: '1rem',
				border: '1px solid',
				borderColor: 'divider',
				transition: 'all 0.2s ease',
        bgcolor: 'transparent',
				'&:hover': {
					borderColor: 'primary.main',
				},
			}}
			elevation={0}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					gap: '1rem',
				}}
			>
				<Box sx={{ position: 'relative' }}>
					
					<TextField
						{...register(`stages.${etapaIndex}.questions.${preguntaIndex}.text`, { required: true })}
						label='Texto de la pregunta'
						fullWidth
						size="small"
						sx={{
							'& .MuiOutlinedInput-root': {
								borderRadius: '0.5rem',
							}
						}}
					/>
				</Box>

				{renderInputComponent()}
			</Box>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					flex: { xs: 1, md: 0.7 },
					gap: '1rem',
					minWidth: { md: '250px' },
				}}
			>
				<Box sx={{ position: 'relative', mb: 'auto' }}>
				
					<Select
						value={baseType}
						onChange={handleChangeTipo}
						size="small"
						sx={{
							width: '100%',
							'& .MuiOutlinedInput-root': {
								borderRadius: '0.5rem',
              },
						}}
					>
						<MenuItem value='TEXTO_CORTO'>Texto Corto</MenuItem>
						<MenuItem value='TEXTO_LARGO'>Texto Largo</MenuItem>
						<MenuItem value='SELECCION'>Selección</MenuItem>
						<MenuItem value='CHECKBOX'>Checkbox</MenuItem>
						<MenuItem value='FECHA'>Fecha</MenuItem>
					</Select>
				</Box>

				{(baseType === 'SELECCION' || baseType === 'CHECKBOX') && (
					<FormControlLabel
						sx={{
              mx: 0,
							'& .MuiFormControlLabel-label': {
								flex: 1,
								color: 'text.secondary',
							},
						}}
						control={
							<Switch
								checked={isDropdownType}
								onChange={handleDropdownChange}
								size="small"
							/>
						}
						label='Mostrar como desplegable'
						labelPlacement='start'
					/>
				)}

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: '1rem',
						justifyContent: 'space-between',
						pt: 1,
						borderTop: '1px solid',
						borderColor: 'divider',
					}}
				>
					<FormControlLabel
						control={
							<Switch
								checked={isRequired || false}
								onChange={(e) =>
									setValue(`stages.${etapaIndex}.questions.${preguntaIndex}.isRequired`, e.target.checked)
								}
								size="small"
							/>
						}
						label='Obligatoria'
						labelPlacement='start'
						sx={{
							mx: 0,
							'& .MuiFormControlLabel-label': {
								color: 'text.secondary',
							},
						}}
					/>
					
					<IconButton
						onClick={() => onDeleteClick('pregunta', removePregunta, etapaIndex, preguntaIndex)}
						size="small"
						sx={{
							color: 'text.secondary',
							'&:hover': {
								color: 'error.main',
							},
						}}
					>
						<Delete fontSize="small" />
					</IconButton>
				</Box>
			</Box>
		</Paper>
	);
};

export default PreguntaComponent;
