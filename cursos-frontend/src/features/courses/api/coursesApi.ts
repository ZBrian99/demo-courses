import { baseApi } from '../../../services/baseApi';
import { Course, createCourseData, updateCourseData, CoursesResponse } from '../types/types';

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<CoursesResponse, Partial<{ 
      page: number;
      limit: number;
      search?: string;
    }>>({
      query: (params) => ({
        url: '/courses',
        method: 'GET',
        params,
      }),
      providesTags: ['Courses'],
    }),

    getCourseById: builder.query<Course, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [
        { type: 'Course', id },
        'Courses'
      ],
    }),

    createCourse: builder.mutation<Course, createCourseData>({
      query: (courseData) => ({
        url: '/courses',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: ['Courses'],
    }),

    updateCourse: builder.mutation<Course, { id: string; data: updateCourseData }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Course', id },
        'Courses'
      ],
    }),

    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/courses/${id}?permanent=true`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi; 