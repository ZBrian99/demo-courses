import { baseApi } from '../../../services/baseApi';
import { 
  User, 
  CreateUserData, 
  UpdateUserData,
  PaginatedUsersResponse 
} from '../types/types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<PaginatedUsersResponse, Partial<{ 
      page: number;
      limit: number;
      search?: string;
    }>>({
      query: (params) => ({
        url: '/users/students',
        method: 'GET',
        params,
      }),
      providesTags: ['Students', 'Users'],
    }),
    
    getStaff: builder.query<PaginatedUsersResponse, Partial<{ 
      page: number;
      limit: number;
      search?: string;
      rol?: string;
    }>>({
      query: (params) => ({
        url: '/users/staff',
        method: 'GET',
        params,
      }),
      providesTags: ['Staff', 'Users'],
    }),

    getUserById: builder.query<User, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [
        { type: 'User', id },
        'Users'
      ],
    }),

    createUser: builder.mutation<User, CreateUserData>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users', 'Students', 'Staff'],
    }),

    updateUser: builder.mutation<User, { id: string; data: UpdateUserData }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'User', id },
        'Users',
        'Students',
        'Staff'
      ],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}?permanent=true`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Students', 'Staff'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStaffQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi; 