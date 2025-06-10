import { Box, Button, IconButton, Typography, TextField } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { CustomTextInput } from '../../../components/inputs';
import { useEffect } from 'react';

const StepForm3: React.FC = () => {
	        const { control } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'links',
	});

	useEffect(() => {
		if (fields.length === 0) {
			append({ titulo: '', url: '' });
		}
	}, []);

	return (
		<Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<Typography variant='h6' fontWeight='500' mb={'0.5rem'}>
				Ingresá los links
			</Typography>

			{fields.map((field, index) => (
				<Box
					key={field.id}
					sx={{
						display: 'flex',
						gap: '1rem',
						alignItems: 'center',
					}}
				>
					<Controller
						name={`links.${index}.titulo`}
						control={control}
						render={({ field: inputField, fieldState: { error }  }) => (
							<TextField
								{...inputField}
								label='Título'
								placeholder='Link a classroom'
								size="small"
								error={!!error}
								helperText={error?.message as string}
								sx={{
									flexGrow: 0.2,
								}}
							/>
						)}
					/>
					<Controller
						name={`links.${index}.url`}
						control={control}
						render={({ field: inputField, fieldState: { error } }) => (
							<TextField
								{...inputField}
								label='URL'
								placeholder='http://www.linkejemplo.com'
								size="small"
								error={!!error}
								helperText={error?.message as string}
								sx={{
									flexGrow: 1,
								}}
							/>
						)}
					/>
					<IconButton 
						onClick={() => remove(index)}
						disabled={fields.length === 1}
					>
						<RemoveCircleOutline />
					</IconButton>
				</Box>
			))}

			<Button
				startIcon={<AddCircleOutline />}
				onClick={() => append({ titulo: '', url: '' })}
				variant='text'
				sx={{ alignSelf: 'flex-start'}}
			>
				Agregar otro link
			</Button>
		</Box>
	);
};

export default StepForm3;
