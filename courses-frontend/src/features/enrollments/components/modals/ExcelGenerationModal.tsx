import React from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress } from '@mui/material';
import { CustomDatePicker } from '../../../../components/inputs/CustomDatePicker';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useGenerateExcelMutation } from '../../api/enrollmentsApi';
import { useAppDispatch } from '../../../../hooks/hooks';
import { showSnackbar } from '../../../appState/slices/appStateSlice';
import dayjs from 'dayjs';
import { ExcelGenerationData } from '../../types/enrollmentsTypes';

const excelSchema = z
	.object({
		fechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
		fechaFin: z.string().min(1, 'La fecha de fin es obligatoria'),
	})
	.refine(
		(data) => {
			return dayjs(data.fechaInicio).isSameOrBefore(dayjs(data.fechaFin));
		},
		{
			message: 'La fecha de inicio no puede ser posterior a la fecha de fin',
			path: ['fechaFin'],
		}
	);

type ExcelFormData = z.infer<typeof excelSchema>;

interface ExcelGenerationModalProps {
	open: boolean;
	onClose: () => void;
	comisionId: string;
	comisionName: string;
}

export const ExcelGenerationModal: React.FC<ExcelGenerationModalProps> = ({
	open,
	onClose,
	comisionId,
	comisionName,
}) => {
	const dispatch = useAppDispatch();
	const [generateExcel, { isLoading }] = useGenerateExcelMutation();

	const methods = useForm<ExcelFormData>({
		resolver: zodResolver(excelSchema),
		mode: 'onBlur',
		defaultValues: {
			fechaInicio: '2024-01-01',
			fechaFin: '2026-01-31',
		},
	});

	const fechaInicio = useWatch({
		control: methods.control,
		name: 'fechaInicio',
	});

	const fechaFin = useWatch({
		control: methods.control,
		name: 'fechaFin',
	});

	const handleClose = () => {
		methods.reset();
		onClose();
	};

	const handleGenerateExcel = async (data: ExcelGenerationData) => {
		try {
			const result = await generateExcel(data).unwrap();
			dispatch(
				showSnackbar({
					message: result.message,
					severity: 'success',
				})
			);
			return true;
		} catch (error) {
			const errorMessage = error instanceof Error 
				? error.message 
				: 'No hay alumnos inscriptos en el período seleccionado';
			
			dispatch(
				showSnackbar({
					message: errorMessage,
					severity: 'error',
				})
			);
			return false;
		}
	};

	const onSubmit = async (data: ExcelFormData) => {
		const success = await handleGenerateExcel({
			comisionId,
			fechaInicio: data.fechaInicio,
			fechaFin: data.fechaFin,
		});

		if (success) {
			handleClose();
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
			<DialogTitle>Generar Excel - {comisionName}</DialogTitle>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<DialogContent>
						<Box sx={{ display: 'flex', gap: '1rem' }}>
							<CustomDatePicker 
								label='Fecha de Inicio' 
								name='fechaInicio' 
								required 
								maxDate={fechaFin}
								dependentFields={['fechaFin']} 
							/>
							<CustomDatePicker
								label='Fecha de Fin'
								name='fechaFin'
								required
								minDate={fechaInicio}
								dependentFields={['fechaInicio']}
							/>
						</Box>
					</DialogContent>
					<DialogActions sx={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
						<Button onClick={handleClose} variant='outlined' disabled={isLoading}>
							Cancelar
						</Button>
						<Button
							type='submit'
							variant='contained'
							disabled={isLoading}
							startIcon={isLoading ? <CircularProgress size={20} /> : <FileDownloadIcon />}
						>
							{isLoading ? 'Generando...' : 'Generar y Descargar'}
						</Button>
					</DialogActions>
				</form>
			</FormProvider>
		</Dialog>
	);
};
