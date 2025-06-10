import { useEffect, useMemo, useCallback, useState } from 'react';
import { Box, Button, CircularProgress, Divider, LinearProgress, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FormList } from '../components/FormList';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { deleteForm, fetchForms } from '../slices/formsSlice';
import { useNavigate } from 'react-router-dom';
import { AddCircle } from '@mui/icons-material';
import { useForm, useWatch } from 'react-hook-form';
import { debounce } from 'lodash';
import { setBreadcrumbs } from '../../appState/slices/appStateSlice';
import CustomPagination from '../../../components/CustomPagination';

interface FormFields {
	nombre: string;
	estado: string;
	modalidad: string;
}

const FormsPage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { forms, status, error, pagination } = useAppSelector((state) => state.forms);
	const [page, setPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [formIdToDelete, setFormIdToDelete] = useState<string | null>(null);
	const [linkDialogOpen, setLinkDialogOpen] = useState(false);
	const [currentLink, setCurrentLink] = useState('');

	const { control, reset, register, setValue } = useForm<FormFields>({
		defaultValues: {
			nombre: '',
			estado: '',
			modalidad: '',
		},
	});

	// Observamos los valores de los campos de texto y selectores
	const nombre = useWatch({ control, name: 'nombre' });
	const estado = useWatch({ control, name: 'estado' });
	const modalidad = useWatch({ control, name: 'modalidad' });

	// Debounced function to avoid lag while typing
	const debouncedSetValue = useCallback(
		debounce((field: keyof FormFields, value: string) => {
			setValue(field, value);
		}, 300),
		[setValue]
	);

	// Efecto para cargar los formularios
	useEffect(() => {
		dispatch(fetchForms({ page, itemsPerPage }));
	}, [page, itemsPerPage]);

	// Filtrar los formularios localmente según los valores actuales de los filtros
	const filteredForms = useMemo(() => {
		return forms.filter((form) => {
			let matches = true;

			if (nombre) {
				const searchTerm = nombre.toLowerCase();
				matches =
					((matches && form.title?.toLowerCase().includes(searchTerm)) ||
						(matches && form.comision?.curso?.nombre?.toLowerCase().includes(searchTerm)) ||
						(matches && form.comision?.codigoComision?.toLowerCase().includes(searchTerm))) ??
					false;
			}

			if (estado && estado !== 'Todos') {
				matches = matches && (estado === 'Activos' ? form.isActive : !form.isActive);
			}

			if (modalidad && modalidad !== 'Todas') {
				matches = (matches && form.comision?.modalidad?.toLowerCase().includes(modalidad.toLowerCase())) ?? false;
			}

			return matches;
		});
	}, [forms, nombre, estado, modalidad]);

	useEffect(() => {
		setPage(1); // Resetea la página cuando cambian los filtros
	}, [nombre, estado, modalidad]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleItemsPerPageChange = (newItemsPerPage: number) => {
		setItemsPerPage(newItemsPerPage);
		setPage(1);
	};

	// Borrar los filtros y resetear el formulario
	const clearFilters = () => {
		reset({
			nombre: '',
			estado: '',
			modalidad: '',
		});
		setPage(1);
	};

	const handleCreate = () => navigate('/forms/create');
	const handleDuplicate = (id: string) => navigate(`/forms/duplicate/${id}`);
	const handleEdit = (id: string) => navigate(`/forms/edit/${id}`);
	const handleDeleteClick = (id: string) => {
		setFormIdToDelete(id);
		setOpenDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (formIdToDelete) {
			dispatch(deleteForm(formIdToDelete));
			setOpenDeleteDialog(false);
			setFormIdToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setOpenDeleteDialog(false);
		setFormIdToDelete(null);
	};

	const handleCopyLinkError = (link: string) => {
		setCurrentLink(link);
		setLinkDialogOpen(true);
	};

	useEffect(() => {
		dispatch(setBreadcrumbs([{ label: 'Formularios', path: '/forms' }]));
	}, []);

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				borderRadius: { xs: 0, md: '1rem' },
				maxWidth: '80rem',
				width: '100%',
				mx: 'auto',
				// minHeight: '100%',
				padding: '1.5rem',
				flexGrow: 1,
				bgcolor: 'common.white',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					mb: '1rem',
					flexWrap: 'wrap',
					gap: '1rem',
				}}
			>
				<Typography color='gray.900' variant='h4'>
					Formularios
				</Typography>
				<Button variant='contained' startIcon={<AddCircle />} onClick={handleCreate}>
					Crear Formulario
				</Button>
			</Box>
			<Divider sx={{ mb: '2rem' }} />
			{/* <Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '.trem',
					width: '100%',
					// p: '.5rem',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					borderRadius: '.5rem',
					backgroundColor: 'common.white',
				}}
			>
				<Filters
					control={control}
					register={register}
					clearFilters={clearFilters}
					setDebouncedValue={debouncedSetValue}
				/>
			</Box> */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '1rem',
					// overflow: 'hidden',
					borderRadius: '1rem',
					flexGrow: 1,
					backgroundColor: 'common.white',
				}}
			>
				<FormList
					forms={filteredForms}
					handleDuplicateForm={handleDuplicate}
					handleEditForm={handleEdit}
					handleDeleteForm={handleDeleteClick}
					currentPage={page}
					setCurrentPage={setPage}
					itemsPerPage={itemsPerPage}
					status={status}
					onCopyLinkError={handleCopyLinkError}
				/>

				<CustomPagination
					currentPage={pagination.currentPage}
					totalItems={pagination.totalItems}
					itemsPerPage={itemsPerPage}
					totalPages={pagination.totalPages}
					hasNextPage={pagination.hasNextPage}
					hasPreviousPage={pagination.hasPreviousPage}
					onPageChange={handlePageChange}
					onItemsPerPageChange={handleItemsPerPageChange}
				/>
			</Box>

			<Dialog open={openDeleteDialog} onClose={handleDeleteCancel} maxWidth='xs' fullWidth>
				<DialogTitle>Confirmar eliminación</DialogTitle>
				<DialogContent>
					<Typography>
						¿Estás seguro de que deseas eliminar este formulario? Esta acción no se puede deshacer.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel}>Cancelar</Button>
					<Button onClick={handleDeleteConfirm} color='error' variant='contained'>
						Eliminar
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} maxWidth='sm' fullWidth>
				<DialogContent>
						<Typography
							component='a'
							href={currentLink}
							target='_blank'
							sx={{
								userSelect: 'all',
								wordBreak: 'break-all',
								whiteSpace: 'pre-wrap',
							}}
						>
							{currentLink}
						</Typography>
				</DialogContent>
			</Dialog>
		</Paper>
	);
};

export default FormsPage;
