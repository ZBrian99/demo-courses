import React, { useState } from 'react';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Tooltip,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Snackbar,
	Alert,
	CircularProgress,
	Backdrop,
	LinearProgress,
	Typography,
	Menu,
} from '@mui/material';

import {
	EditOutlined as Edit,
	DeleteOutlined as Delete,
	ContentCopyOutlined as ContentCopy,
	CopyAllOutlined as CopyAll,
	LinkSharp,
	LibraryAddOutlined as LibraryAdd,
	ContentPasteOutlined as ContentPaste,
	ShareOutlined as Share,
	LinkOutlined as LinkIcon,
	RemoveCircleOutlined as RemoveCircle,
	DeleteForeverOutlined as DeleteForever,
	AddLinkOutlined as AddLink,
	LinkOutlined,
	InsertLinkOutlined as InsertLink,
	VisibilityOutlined as Visibility,
	RemoveRedEyeOutlined as RemoveRedEye,
	SearchOutlined as Search,
	PageviewOutlined as Pageview,
	PreviewOutlined as Preview,
	MoreVert,
	CheckCircle,
} from '@mui/icons-material';

import { useAppDispatch } from '../../../hooks/hooks';
import { deleteForm, generateReferalLink } from '../slices/formsSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from '../types/types';
import dayjs from 'dayjs';
import CustomPagination from '../../../components/CustomPagination';

interface FormsListProps {
	forms: Form[];
	handleDuplicateForm: (formId: string) => void;
	handleEditForm: (formId: string) => void;
	handleDeleteForm: (formId: string) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	itemsPerPage: number;
	status: string;
	onCopyLinkError: (link: string) => void;
}

export const FormList: React.FC<FormsListProps> = ({
	forms,
	handleDuplicateForm,
	handleEditForm,
	handleDeleteForm,
	currentPage,
	setCurrentPage,
	itemsPerPage,
	status,
	onCopyLinkError,
}) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const dispatch = useAppDispatch();
	const handleGenerateLink = (comisionId: string) => {
		dispatch(generateReferalLink({ comisionId }));
		// setSnackbarOpen(true);
		// setSnackbarMessage('Link generado correctamente');
	};

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, formId: string) => {
		setAnchorEl(event.currentTarget);
		setSelectedFormId(formId);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedFormId(null);
	};

	const handleCopyLink = (link: string) => {
		const fullUrl = `${window.location.origin}/ref/${link}`;
		try {
			navigator.clipboard.writeText(fullUrl).then(() => {
				setSnackbarOpen(true);
				setSnackbarMessage('Link copiado al portapapeles');
			}).catch(() => {
				onCopyLinkError(fullUrl);
			});
		} catch (error) {
			onCopyLinkError(fullUrl);
		}
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	if (status === 'loading') {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (!forms.length) {
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
				<Typography>No se encontraron formularios.</Typography>
			</Box>
		);
	}
	return (
		<Box>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow
							sx={{
								'& th': {
									pt: '1rem',
									pb: '.5rem',
									backgroundColor: '#F8F7F9',
									borderBottom: '1px solid rgba(224, 224, 224, 1)',
								},
							}}
						>
							<TableCell>Curso</TableCell>
							<TableCell>Comision</TableCell>
							<TableCell>Código</TableCell>
							<TableCell>Titulo</TableCell>
							<TableCell>Modalidad</TableCell>
							<TableCell>Estado</TableCell>
							<TableCell>Acciones</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{forms.map((form: Form) => (
							<TableRow key={form.id}>
								<TableCell>{form.comision?.curso?.codigo ?? 'N/A'}</TableCell>
								<TableCell>{form.comision?.codigoComision ?? 'N/A'}</TableCell>
								<TableCell>{form.nombre}</TableCell>
								<TableCell>{form.title}</TableCell>
								<TableCell>
									{form.comision?.modalidad === 'Mixto' ? 'Pres + Virtual' : form.comision?.modalidad ?? 'N/A'}
								</TableCell>
								<TableCell>{form.isActive ? 'Activo' : 'Inactivo'}</TableCell>

								<TableCell>
									<IconButton aria-label='más acciones' onClick={(event) => handleMenuOpen(event, form.id)}>
										<MoreVert />
									</IconButton>

									<Menu
										anchorEl={anchorEl}
										open={selectedFormId === form.id}
										onClose={handleMenuClose}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
									>
										{/* <MenuItem
											disabled={true}
											onClick={() => {
												handleMenuClose();
												// Navegar a la vista del formulario
											}}
										>
											<ListItemIcon>
												<RemoveRedEye />
											</ListItemIcon>
											<ListItemText>Ver</ListItemText>
										</MenuItem> */}

										<MenuItem
											disabled={!form.comision?.vendedores?.[0]?.linkReferido}
											onClick={() => {
												handleMenuClose();
												handleCopyLink(form.comision?.vendedores?.[0]?.linkReferido || '');
											}}
										>
											<ListItemIcon>
												<LinkIcon />
											</ListItemIcon>
											<ListItemText>Copiar Link</ListItemText>
                    </MenuItem>
                    
										<MenuItem
											onClick={() => {
												handleMenuClose();
												handleEditForm(form.id);
											}}
										>
											<ListItemIcon>
												<Edit />
											</ListItemIcon>
											<ListItemText>Editar</ListItemText>
										</MenuItem>

										{/* <MenuItem
											onClick={() => {
												handleMenuClose();
												handleDuplicateForm(form.id);
											}}
										>
											<ListItemIcon>
												<ContentCopy />
											</ListItemIcon>
											<ListItemText>Duplicar</ListItemText>
                    </MenuItem> */}

										<MenuItem
											onClick={() => {
												handleMenuClose();
												handleDeleteForm(form.id);
											}}
										>
											<ListItemIcon>
												<Delete />
											</ListItemIcon>
											<ListItemText>Eliminar</ListItemText>
										</MenuItem>

										<MenuItem
											disabled={!form.comision || !!form.comision?.vendedores?.[0]?.linkReferido} // Deshabilita si no hay comision o ya existe un link de referido
											onClick={() => {
												handleMenuClose();
												handleGenerateLink(form.comision?.id || '');
											}}
										>
											<ListItemIcon>
												<AddLink />
											</ListItemIcon>
											<ListItemText>Generar Link</ListItemText>
										</MenuItem>
									</Menu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity='success'
					icon={<CheckCircle fontSize='inherit' />}
					sx={{
						boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
					}}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};
