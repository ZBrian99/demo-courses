import React from 'react';
import { Box, Typography, Card, CardContent, Chip, IconButton, Tooltip, Divider } from '@mui/material';
import { CommissionWithEnrollmentData } from '../types/enrollmentsTypes';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../appState/slices/appStateSlice';
import { useGenerateReferalLinkMutation } from '../api/enrollmentsApi';
import DescriptionIcon from '@mui/icons-material/Description';
import { ExcelGenerationModal } from './modals/ExcelGenerationModal';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useAppSelector } from '../../../hooks/hooks';
import { Role } from '../../users/types/types';
dayjs.extend(isSameOrBefore);

type CommissionsListProps = {
	commissions: CommissionWithEnrollmentData[];
	onCopyLinkError: (link: string) => void;
};

export const EnrollmentsCommissionsList: React.FC<CommissionsListProps> = ({ 
	commissions,
	onCopyLinkError
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [generateReferalLink, { isLoading }] = useGenerateReferalLinkMutation();
	const [selectedCommission, setSelectedCommission] = React.useState<{
		id: string;
		name: string;
	} | null>(null);
const { user } = useAppSelector((state) => state.auth);
  const isVendedor = user?.rol === Role.VENDEDOR || user?.rol === Role.PROFESORVENDEDOR;
  
	const handleCommissionNavigation = (commissionId: string) => {
		navigate(`/enrollments/${commissionId}`);
	};

	const handleCopyLink = async (event: React.MouseEvent, linkReferido: string) => {
		event.stopPropagation();
		try {
			const fullUrl = `${window.location.origin}/ref/${linkReferido}`;
			await navigator.clipboard.writeText(fullUrl);
			dispatch(
				showSnackbar({
					message: 'Link copiado al portapapeles',
					severity: 'success',
				})
			);
		} catch (error) {
			const fullUrl = `${window.location.origin}/ref/${linkReferido}`;
			onCopyLinkError(fullUrl);
		}
	};

	const handleGenerateLink = async (event: React.MouseEvent, comisionId: string) => {
		event.stopPropagation();
		try {
			await generateReferalLink({ comisionId }).unwrap();
			dispatch(
				showSnackbar({
					message: 'Link de inscripción generado exitosamente',
					severity: 'success',
				})
			);
		} catch (error) {
			dispatch(
				showSnackbar({
					message: 'Error al generar el link de inscripción',
					severity: 'error',
				})
			);
		}
	};

	const handleExcelClick = (event: React.MouseEvent, commission: CommissionWithEnrollmentData) => {
		event.stopPropagation();
		setSelectedCommission({
			id: commission.id,
			name: commission.codigoComision,
		});
	};

	return (
		<>
			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						sm: 'repeat(auto-fit, minmax(20rem, 1fr))',
					},
					gap: '1rem',
					alignItems: 'start',
				}}
			>
				{commissions.map((commission) => (
					<Card
						key={commission.id}
						onClick={() => handleCommissionNavigation(commission.id)}
						sx={{
							borderRadius: '.75rem',
							cursor: 'pointer',
							boxShadow: 'none',
							bgcolor: 'background.default',
							position: 'relative',
							border: '1px solid',
							borderColor: 'divider',
							transition: 'border-color 0.1s ease-in-out',
							'&:hover': {
								borderColor: 'primary.main',
							},
						}}
					>
						<CardContent
							sx={{
								padding: { xs: '1rem', sm: '1.5rem' },
								color: 'gray.900',
								display: 'flex',
								flexDirection: 'column',
								gap: '1rem',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									flexDirection: { xs: 'column', sm: 'row-reverse' },
									gap: { xs: '1rem', sm: '.75rem' },
                  alignItems: { sm: 'flex-start' },
                  
								}}
							>
								<Chip
									label={commission.estado}
									color={
										commission.estado === 'Finalizada'
											? 'secondary'
											: commission.estado === 'En curso'
											? 'success'
											: commission.estado === 'Próxima'
											? 'warning'
											: 'error'
									}
									sx={{ 
										fontWeight: 500,
										minWidth: 'fit-content',
										alignSelf: { xs: 'flex-start'},
									}}
								/>
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										variant='h5'
										sx={{
											fontWeight: 600,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
											mb: 0.5,
											fontSize: '1.5rem',
										}}
									>
										{commission.codigoComision}
									</Typography>
									<Typography
                    color='text.secondary'
										sx={{
											fontSize: '1rem',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}
									>
										{commission.formulario?.nombre || commission.formulario?.title || 'N/D'}
									</Typography>
								</Box>
							</Box>

							<Divider />

							<Box sx={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
									<Typography variant="subtitle1" color="text.secondary">
										Inscriptos:
									</Typography>
									<Typography
										sx={{
											color: 'primary.main',
											bgcolor: 'primary.light',
											borderRadius: '5rem',
											padding: '.25rem 1rem',
											fontWeight: '500',
                      fontSize: { xs: '0.875rem', sm: '1rem', whiteSpace: 'nowrap' },
										}}
									>
										{`${commission.cantidadInscritos} / ${commission.totalInscripciones}`}
									</Typography>
								</Box>

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
									<Box sx={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
										<Typography variant="subtitle1" color="text.secondary">
											Inicia:
										</Typography>
										<Typography variant="body1">
											{commission.fechaInicio ? dayjs(commission.fechaInicio).format('DD/MM/YYYY') : 'N/D'}
										</Typography>
									</Box>
									<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
										<Box sx={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
											<Typography variant="subtitle1" color="text.secondary">
												Finaliza:
											</Typography>
											<Typography variant="body1">
												{commission.fechaFin ? dayjs(commission.fechaFin).format('DD/MM/YYYY') : 'N/D'}
											</Typography>
										</Box>
										<Box sx={{ display: 'flex', gap: '.5rem' }}>
                      <Tooltip arrow placement='bottom' title={
                       commission.linkReferido ? 'Copiar link de inscripción' : 'Generar link de inscripción'
                      }>
												<span>
													<IconButton
														size='medium'
														onClick={(e) =>
															commission.linkReferido
																? handleCopyLink(e, commission.linkReferido)
																: handleGenerateLink(e, commission.id)
														}
														disabled={isLoading}
														sx={{
															color: 'primary.main',
															'&:hover': {
																color: 'primary.dark',
															},
														}}
													>
														{commission.linkReferido ? (
															<ContentCopyIcon fontSize='medium' />
														) : (
															<AddLinkIcon fontSize='medium' />
														)}
													</IconButton>
												</span>
											</Tooltip>

											{!isVendedor && (
												<Tooltip arrow placement='bottom' title="Generar Excel">
													<span>
														<IconButton
															size="medium"
															onClick={(e) => handleExcelClick(e, commission)}
														>
                              <DescriptionIcon
                               fontSize='medium'  
																sx={{ 
																	color: 'primary.main',
																}} 
															/>
														</IconButton>
													</span>
												</Tooltip>
											)}
										</Box>
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>

			{selectedCommission && (
				<ExcelGenerationModal
					open={!!selectedCommission}
					onClose={() => setSelectedCommission(null)}
					comisionId={selectedCommission.id}
					comisionName={selectedCommission.name}
				/>
			)}
		</>
	);
};
