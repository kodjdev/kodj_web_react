import { useUserService } from '@/services/apiService/fetchUserService';
import { useFetchEventService } from '@/services/apiService/fetchEventService';
import { useRegisterEventService } from '@/services/apiService/registerEventService';
import { useFetchNewsService } from '@/services/apiService/fetchNewsService';
import { useFetchCommentsService } from '@/services/apiService/fetchCommentsService';
import { useFetchStatsService } from '@/services/apiService/fetchStatsService';

/**
 * API Service - Centralized API Service
 * This file contains functions to interact with the API for user management, and event management.
 * @module apiService
 * It includes functions for user details retrieval, event registration, and speaker registration.
 * @returns {Object} - An object containing all the API service functions.
 */
export default function useApiService() {
    const userDetailsService = useUserService();
    const eventFetchService = useFetchEventService();
    const eventRegisterService = useRegisterEventService();
    const newsFetchService = useFetchNewsService();
    const commentFetchService = useFetchCommentsService();
    const statsFetchService = useFetchStatsService();

    return {
        ...userDetailsService,
        ...eventFetchService,
        ...eventRegisterService,
        ...newsFetchService,
        ...commentFetchService,
        ...statsFetchService,
    };
}
