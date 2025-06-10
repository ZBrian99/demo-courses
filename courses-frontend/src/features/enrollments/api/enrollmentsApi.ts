import dayjs from 'dayjs';
import { baseApi } from '../../../services/baseApi';
import {
	AddObservation,
	CommissionsFiltersQuery,
	Enrollment,
	EnrollmentsFiltersQuery,
	EnrollmentStatus,
	Observation,
	PaginatedCommissionEnrollmentsResponse,
	PaginatedEnrollmentsResponse,
	Payment,
	RespuestasPorInscripcion,
	ExcelGenerationData,
	ExcelGenerationResponse,
} from '../types/enrollmentsTypes';

// Define etiquetas de tipo
type TagType = 'Payments' | 'Enrollment' | 'Enrollments';

export const enrollmentsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getEnrollments: builder.query<PaginatedEnrollmentsResponse, Partial<EnrollmentsFiltersQuery>>({
			query: (filters) => ({
				url: '/enrollments',
				method: 'GET',
				params: filters,
			}),
			providesTags: ['Enrollments'], // Etiqueta para la lista general
		}),
		getCommissionsWithEnrollments: builder.query<
			PaginatedCommissionEnrollmentsResponse,
			Partial<CommissionsFiltersQuery>
		>({
			query: (filters) => ({
				url: '/commissions/enrollments',
				method: 'GET',
				params: filters,
			}),
			providesTags: ['Enrollments'], // Etiqueta para la lista de comisiones con inscripciones
		}),
		updateEnrollmentStatus: builder.mutation<void, { id: string; estado: EnrollmentStatus }>({
			query: ({ id, estado }) => ({
				url: `/enrollments/${id}/status`,
				method: 'PATCH',
				body: { estado },
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Enrollment', id }, 'Enrollments'], // Invalidar detalles, lista general y comisiones
		}),

		getEnrollmentById: builder.query<Enrollment, string>({
			query: (id) => ({
				url: `/enrollments/${id}`,
				method: 'GET',
			}),
			providesTags: (result, error, id) => [{ type: 'Enrollment', id }], // Etiqueta para detalles específicos
		}),
		createEnrollment: builder.mutation<Enrollment, Partial<Enrollment>>({
			query: (newEnrollment) => ({
				url: '/enrollments',
				method: 'POST',
				body: newEnrollment,
			}),
			invalidatesTags: ['Enrollments'], // Invalida la lista general
		}),
		updateEnrollment: builder.mutation<Enrollment, { id: string; data: Partial<Enrollment> }>({
			query: ({ id, data }) => ({
				url: `/enrollments/${id}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Enrollment', id }, 'Enrollments'],
		}),
		getPaymentsByEnrollmentId: builder.query<Payment[], string>({
			query: (enrollmentId) => ({
				url: `/enrollments/${enrollmentId}/payments`,
				method: 'GET',
			}),
			providesTags: ['Payments'],
		}),
		addPayment: builder.mutation<Payment, { id: string; payment: Partial<Payment> }>({
			query: ({ id, payment }) => ({
				url: `/enrollments/${id}/payments`,
				method: 'POST',
				body: payment,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Enrollment', id },
				'Enrollments',
				'Payments', // Invalida la lista general, detalles específicos, comisiones y pagos
			],
		}),
		getResponsesByInscriptionId: builder.query<RespuestasPorInscripcion, string>({
			query: (inscriptionId) => ({
				url: `/responses/enrollment`,
				method: 'GET',
				params: { inscripcionId: inscriptionId },
			}),
		}),
		addObservation: builder.mutation<Observation, { id: string; observation: AddObservation }>({
			query: ({ id, observation }) => ({
				url: `/enrollments/${id}/observations`,
				method: 'POST',
				body: observation,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Enrollment', id }, 'Enrollments'],
		}),
		generateReferalLink: builder.mutation<{ linkReferido: string }, { comisionId: string; customLink?: string }>({
			query: ({ comisionId, customLink }) => ({
				url: '/forms/referal-link',
				method: 'POST',
				body: { comisionId, customLink },
			}),
			invalidatesTags: ['Enrollments'], // Invalida para actualizar la lista de comisiones
		}),
		generateExcel: builder.mutation<ExcelGenerationResponse, ExcelGenerationData>({
			query: (data) => ({
				url: '/enrollments/report',
				method: 'POST',
				body: data,
				responseHandler: async (response: Response) => {
					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						throw new Error(errorData.message || 'Error al generar el reporte');
					}

					const blob = await response.blob();
					const fileName = getFileNameFromResponse(response) || 'reporte.xlsx';
					await downloadFile(blob, fileName);

					return {
						success: true,
						message: 'Reporte generado exitosamente',
						fileName,
					};
				},
			}),
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetEnrollmentsQuery,
	useGetEnrollmentByIdQuery,
	useCreateEnrollmentMutation,
	useUpdateEnrollmentMutation,
	useGetPaymentsByEnrollmentIdQuery,
	useAddPaymentMutation,
	useGetCommissionsWithEnrollmentsQuery,
	useGetResponsesByInscriptionIdQuery,
	useUpdateEnrollmentStatusMutation,
	useAddObservationMutation,
	useGenerateReferalLinkMutation,
	useGenerateExcelMutation,
} = enrollmentsApi;

// Funciones auxiliares
const getFileNameFromResponse = (response: Response): string | null => {
  const contentDisposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
  if (!contentDisposition) return null;

  let fileName = null;

  // Intentar extraer filename* (codificado en UTF-8)
  const fileNameMatch = contentDisposition.match(/filename\*=(?:UTF-8'')?([^;]+)/);
  if (fileNameMatch && fileNameMatch.length > 1) {
    fileName = decodeURIComponent(fileNameMatch[1]);
  } else {
    // Intentar extraer filename (sin codificar)
    const fileNameMatch = contentDisposition.match(/filename="([^"]+)"/);
    if (fileNameMatch && fileNameMatch.length > 1) {
      fileName = fileNameMatch[1];
    }
  }

  return fileName;
};


const downloadFile = async (blob: Blob, fileName: string): Promise<void> => {
	const url = window.URL.createObjectURL(blob);
	try {
		const link = document.createElement('a');
		link.style.display = 'none';
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
	} finally {
		window.URL.revokeObjectURL(url);
	}
};
