// frontend/src/store/rtkApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import type { RootState } from './index';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const axiosBaseQuery =
  ({ baseUrl = BASE } = { baseUrl: BASE }) =>
  async (
    { url, method = 'get', data, params }: any,
    api?: { getState?: () => unknown }
  ) => {
    try {
      const token =
        (api?.getState ? (api.getState() as RootState).auth?.accessToken : null) ||
        null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        withCredentials: true,
        headers,
      });
      return { data: result.data };
    } catch (axiosError: any) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        },
      };
    }
  };

export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: BASE }),
  endpoints: (builder) => ({
    // AUTH
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: '/api/auth/login', method: 'post', data: body }),
    }),
    register: builder.mutation<any, any>({
      query: (body) => ({ url: '/api/auth/register', method: 'post', data: body }),
    }),
    refreshToken: builder.mutation<any, { token: string }>({
      query: (body) => ({ url: '/api/auth/refresh', method: 'post', data: body }),
    }),

    // EXAM (existing)
    getQuestions: builder.query<any, number>({
      query: (step) => ({ url: `/api/exam/questions/${step}`, method: 'get' }),
    }),
    submitAnswers: builder.mutation<any, any>({
      query: (body) => ({ url: '/api/exam/submit', method: 'post', data: body }),
    }),

    // PROFILE endpoints (if you have them already)
    getProfile: builder.query<any, void>({
      query: () => ({ url: '/api/user/me', method: 'get' }),
    }),
    updateProfile: builder.mutation<any, { name?: string; phone?: string; photo?: File | null }>(
      {
        query: (body) => {
          const form = new FormData();
          if (body.name) form.append('name', body.name);
          if (body.phone) form.append('phone', body.phone);
          if (body.photo) form.append('photo', body.photo);
          return { url: '/api/user/me', method: 'put', data: form };
        },
      }
    ),

    // ---- NEW: exam eligibility + start ----
    getExamEligibility: builder.query<
      { completedSteps: number[]; eligibleForStep2: boolean; eligibleForStep3: boolean },
      void
    >({
      query: () => ({ url: '/api/exam/eligibility', method: 'get' }),
    }),

    startExam: builder.mutation<any, number>({
      query: (step) => ({ url: `/api/exam/start/${step}`, method: 'post', data: {} }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useGetQuestionsQuery,
  useSubmitAnswersMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetExamEligibilityQuery,
  useStartExamMutation,
} = api;
