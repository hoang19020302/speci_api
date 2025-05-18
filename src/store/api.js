import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    // Tương tự tên Slice khi tạo Slice thông thường
    reducerPath: 'userApi',

    // Cấu hình chung cho tất cả request
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL,
        credentials: 'include',  // Đảm bảo gửi cookie với mỗi yêu cầu
        prepareHeaders: (headers, { getState }) => {
            // getState() giúp lấy ra toàn bộ state trong store
            // getState().user lấy ra state trong userSlice
            const token = getState().user?.auth;

            // Nếu có token thì thêm vào headers
            if (token) {
                headers.set('Authorization', `Bearer ${token?.token_customer}`);
            }

            return headers;
        },
    }),

    // Các endpoints (lệnh gọi request)
    endpoints: (builder) => ({
        userLogin: builder.mutation({
            query: (credentials) => {
                return {
                    url: `users/login`,
                    method: 'POST',
                    body: credentials,
                };
            },
        }),

        userLogout: builder.mutation({
            query: () => {
                return {
                    url: `users/logout`,
                    method: 'POST',
                };
            },
        }),

        userRegister: builder.mutation({
            query: (body) => ({
                url: 'users/register',
                method: 'POST',
                body: body,
            }),
        }),

        getPersonalResults: builder.query({
            query: (fillter) => {
                const params = { pageNum: fillter.pageNum, pageSize: fillter.pageSize, type: fillter.questionBankType };
                return {
                    url: `users/${fillter.id}/personalResults`,
                    params: params,
                };
            },
        }),

        getExamResultDetail: builder.query({
            query: (fillter) => {
                if (fillter.idGroup) {
                    return `groupInformations/${fillter.idGroup}/personalResults/${fillter.idExam}`;
                }
                return `personalResults/${fillter.idExam}`;
            },
        }),

        getGroupInfomation: builder.query({
            query: (fillter) => {
                const params = { pageNum: fillter.pageNum, pageSize: fillter.pageSize };
                return {
                    url: `users/${fillter.id}/groupInformations`,
                    params: params,
                };
            },
        }),

        getGroupInfomationDetail: builder.query({
            query: (id) => `groupInformations/${id}`,
        }),

        getQuestions: builder.query({
            query: () => 'questions',
        }),

        userSubmitExamResult: builder.mutation({
            query: (body) => {
                return {
                    url: 'personalResults',
                    method: 'POST',
                    body: body,
                };
            },
        }),

        getQuestionBankWithID: builder.query({
            query: (questionBankID) => `questionBanks/${questionBankID}`,
        }),

        getQuestionWithIDBank: builder.query({
            query: (questionBankID) => {
                return `questionBanks/${questionBankID}/questions`;
            },
        }),

        getQuestionBankWithType: builder.query({
            query: (type) => `questionBanks/type/${type}`,
        }),

        userCreateGroup: builder.mutation({
            query: (body) => {
                return {
                    url: 'send-email',
                    method: 'POST',
                    body: body,
                };
            },
        }),

        useEditPassword: builder.mutation({
            query: (body) => {
                return {
                    url: 'users/password',
                    method: 'PUT',
                    body: body,
                };
            },
        }),

        getUserProfileSocial: builder.query({
            query: (params) => {
                return {
                    url: 'social/user-info',
                    params: params,
                };
            },
        }),

        userEditProfile: builder.mutation({
            query: (body) => {
                return {
                    url: 'users/information',
                    body: body,
                    method: 'PUT',
                };
            },
        }),
    }),
});

export const {
    usePrefetch,
    useUserLoginMutation,
    useUserLogoutMutation,
    useUserRegisterMutation,
    useGetPersonalResultsQuery,
    useGetExamResultDetailQuery,
    useGetGroupInfomationQuery,
    useGetGroupInfomationDetailQuery,
    useGetQuestionsQuery,
    useUserSubmitExamResultMutation,
    useGetQuestionBankWithIDQuery,
    useGetQuestionBankWithTypeQuery,
    useGetQuestionWithIDBankQuery,
    useUserCreateGroupMutation,
    useUseEditPasswordMutation,
    useGetUserProfileSocialQuery,
    useUserEditProfileMutation,
} = userApi;
