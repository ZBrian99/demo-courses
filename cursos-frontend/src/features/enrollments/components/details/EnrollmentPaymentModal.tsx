import React, { useEffect } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import { CustomDatePicker, CustomSelect, CustomTextarea, CustomTextInput } from '../../../../components/inputs';

// Definir el esquema de validación con Zod
const paymentSchema = z.object({
	monto: z
		.string()
		.regex(/^\d+([.]\d{1,2})?$/, 'Usar punto para decimales (máx 2)')
		.refine((val) => parseFloat(val) > 0, 'El monto debe ser mayor a cero'),
	moneda: z.string().min(3, 'Selecciona una moneda válida'),
	fechaPago: z
		.string()
		.min(1, 'La fecha de pago es obligatoria')
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener un formato válido.'),
	metodoPago: z.string().min(1, 'El método de pago es obligatorio'),
	tipoPago: z.string().min(1, 'La forma de pago es obligatoria'),
	observaciones: z.string().optional(),
	cuentaPropia: z.boolean(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface EnrollmentPaymentModalProps {
	onClose: () => void;
	onSubmit: (paymentData: PaymentFormData) => void;
	readOnly?: boolean;
	defaultValues: PaymentFormData;
}

export const EnrollmentPaymentModal: React.FC<EnrollmentPaymentModalProps> = ({
	onClose,
	onSubmit,
	readOnly = false,
	defaultValues,
}) => {
	const methods = useForm<PaymentFormData>({
		resolver: zodResolver(paymentSchema),
		mode: 'onBlur',
		defaultValues,
	});

	const { trigger, getValues, control } = methods;

	const handleSubmit = async () => {
		const isValid = await trigger();
		if (isValid) {
			const formData = getValues();
			onSubmit(formData);
		}
	};

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: '35rem',
				overflow: 'hidden',
				bgcolor: 'common.white',
				borderRadius: '.5rem',
			}}
		>
			<FormProvider {...methods}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<Box
						sx={{
							p: 3,
							borderRadius: '.5rem',
							height: '100%',
							maxHeight: 'calc(100vh - 2rem)', // Altura máxima visible
							overflowY: 'auto', // Scroll solo vertical
							width: '100%',
							gap: 4,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<Typography variant='h3' mb={1}>
							{readOnly ? 'Ver pago' : 'Cargar pago'}
						</Typography>
						<Box sx={{ display: 'flex', gap: 2 }}>
							<CustomTextInput label='Monto' name='monto' type='text' required fullWidth readOnly={readOnly} />
							<CustomSelect
								label='Moneda'
								name='moneda'
								options={[
									{ label: 'Peso argentino (ARS)', value: 'ARS' },
									{ label: 'Dólar estadounidense (USD)', value: 'USD' },
									{ label: 'Peso chileno (CLP)', value: 'CLP' },
									{ label: 'Real brasileño (BRL)', value: 'BRL' },
									{ label: 'Peso colombiano (COP)', value: 'COP' },
									{ label: 'Peso cubano (CUP)', value: 'CUP' },
									{ label: 'Euro (EUR)', value: 'EUR' },
									{ label: 'Colón salvadoreño (SVC)', value: 'SVC' },
									{ label: 'Quetzal guatemalteco (GTQ)', value: 'GTQ' },
									{ label: 'Lempira hondureño (HNL)', value: 'HNL' },
									{ label: 'Peso mexicano (MXN)', value: 'MXN' },
									{ label: 'Córdoba nicaragüense (NIO)', value: 'NIO' },
									{ label: 'Balboa panameño (PAB)', value: 'PAB' },
									{ label: 'Boliviano (BOB)', value: 'BOB' },
									{ label: 'Guaraní paraguayo (PYG)', value: 'PYG' },
									{ label: 'Sol peruano (PEN)', value: 'PEN' },
									{ label: 'Peso dominicano (DOP)', value: 'DOP' },
									{ label: 'Peso uruguayo (UYU)', value: 'UYU' },
									{ label: 'Bolívar venezolano (VES)', value: 'VES' },
									{ label: 'Libra esterlina (GBP)', value: 'GBP' },
									{ label: 'Dólar canadiense (CAD)', value: 'CAD' },
									{ label: 'Franco suizo (CHF)', value: 'CHF' },
									{ label: 'Yen japonés (JPY)', value: 'JPY' },
									{ label: 'Yuan chino (CNY)', value: 'CNY' },
								]}
								required
								fullWidth
								readOnly={readOnly}
							/>
						</Box>
						<Box
							sx={{
								display: 'flex',
								gap: 2,
								// display: 'grid',
								// gap: 2,
								// gridTemplateColumns: '1fr 1fr',
							}}
						>
							<CustomTextInput
								readOnly={readOnly}
								label='Método de pago'
								name='metodoPago'
								type='text'
								fullWidth
								required
							/>
							<CustomDatePicker readOnly={readOnly} label='Fecha de pago' name='fechaPago' fullWidth required />
						</Box>
						<Box
							sx={{
								display: 'grid',
								gap: 2,
								gridTemplateColumns: '1fr 1fr',
							}}
						>
							<CustomTextInput readOnly={readOnly} label='Forma de pago' name='tipoPago' type='text' required />
							<Controller
								name='cuentaPropia'
								control={control}
								render={({ field }) => (
									<FormControlLabel
										label='Cuenta Propia'
										sx={{
											mx: 'auto',
										}}
										control={<Switch {...field} disabled={readOnly} checked={field.value} color='primary' />}
									/>
								)}
							/>
						</Box>
						<CustomTextarea readOnly={readOnly} label='Comentarios' name='observaciones' rows={3} required />
						<Box
							sx={{
								display: 'flex',
								gap: 2,
								justifyContent: 'space-between',
							}}
						>
							<Button variant='text' onClick={onClose}>
								Atrás
							</Button>
							{!readOnly && (
								<Button variant='contained' color='primary' onClick={handleSubmit}>
									Cargar pago
								</Button>
							)}
						</Box>
					</Box>
				</form>
			</FormProvider>
		</Box>
	);
};

export default EnrollmentPaymentModal;
