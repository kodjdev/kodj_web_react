import { meetupNewsAtom, newsCacheStatusAtom, newsDetailsAtom, socialNewsAtom, techNewsAtom } from '@/atoms/news';
import useAxios from '@/hooks/useAxios/useAxios';
import { FilterTypes } from '@/pages/News';
import { ApiResponse, PaginatedResponse } from '@/types/fetch';
import { NewsItem } from '@/types/news';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { CACHE_DURATION } from '@/services/api/fetchEventService';

/**
 * News Service - For News Data  Fetching
 * This file contains functions to interact with the news API endpoints.
 * @module useNewsService
 * @description This module provides functions to fetch news data from the API.
 */
export const useFetchNewsService = () => {
    const fetchData = useAxios();
    const [techNews, setTechNews] = useRecoilState(techNewsAtom);
    const [meetupNews, setMeetupNews] = useRecoilState(meetupNewsAtom);
    const [socialNews, setSocialNews] = useRecoilState(socialNewsAtom);

    const [cacheStatus, setCacheStatus] = useRecoilState(newsCacheStatusAtom);
    const [newsDetailsCache, setNewsDetailsCache] = useRecoilState(newsDetailsAtom);

    const isCacheValid = (lastFetch: number | null): boolean => {
        if (!lastFetch) return false;
        return Date.now() - lastFetch < CACHE_DURATION;
    };

    const getNewsAtomByType = (type: FilterTypes) => {
        switch (type) {
            case FilterTypes.TECH:
                return techNews;
            case FilterTypes.MEETUP:
                return meetupNews;
            case FilterTypes.SOCIAL:
                return socialNews;
        }
    };

    const setNewsAtomByType = (type: FilterTypes, data: NewsItem[]) => {
        switch (type) {
            case FilterTypes.TECH:
                setTechNews(data);
                break;
            case FilterTypes.MEETUP:
                setMeetupNews(data);
                break;
            case FilterTypes.SOCIAL:
                setSocialNews(data);
                break;
        }
    };

    const updateNewCache = (
        response: ApiResponse<{ data: PaginatedResponse<NewsItem>; message: string; statusCode: number }>,
        type: FilterTypes,
    ) => {
        const now = Date.now();

        if (response.statusCode === 200 && response.data?.data?.content) {
            const newsItems = response.data?.data?.content;

            if (newsItems && Array.isArray(newsItems)) {
                setNewsAtomByType(type, newsItems);

                setCacheStatus((prev) => ({
                    ...prev,
                    [type]: { loaded: true, lastFetch: now },
                }));

                console.log(`${type} news cached successfully`);
                return;
            } else {
                setNewsAtomByType(type, []);
                setCacheStatus((prev) => ({
                    ...prev,
                    [type]: { loaded: true, lastFetch: now },
                }));
            }
        }
    };

    return useMemo(
        () => ({
            getAllNews: async (
                newsType?: FilterTypes,
            ): Promise<ApiResponse<{ data: PaginatedResponse<NewsItem>; message: string; statusCode: number }>> => {
                const type = newsType || FilterTypes.TECH;
                const cacheInfo = cacheStatus[type];

                if (cacheInfo.loaded && isCacheValid(cacheInfo.lastFetch)) {
                    console.log(`Using cached ${type} news`);
                    const cachedNews = getNewsAtomByType(type);

                    const paginationData: PaginatedResponse<NewsItem> = {
                        content: cachedNews,
                        totalElements: cachedNews.length,
                        totalPages: 1,
                        size: cachedNews.length,
                        number: 0,
                        first: true,
                        last: true,
                        empty: cachedNews.length === 0,
                        numberOfElements: cachedNews.length,
                        pageAble: {
                            pageNumber: 0,
                            pageSize: cachedNews.length,
                            sort: { empty: true, sorted: false, unsorted: true },
                            offset: 0,
                            paged: true,
                            unpaged: false,
                        },
                        sort: { empty: true, sorted: false, unsorted: true },
                    };

                    return {
                        data: {
                            data: paginationData,
                            message: `success`,
                            statusCode: 200,
                        },
                        statusCode: 200,
                        message: 'success',
                    };
                }

                console.log(`Fetching fresh ${type} news from API`);

                const params: Record<string, string> = {};
                if (newsType) {
                    params.type = newsType;
                }

                const response = await fetchData<{
                    data: PaginatedResponse<NewsItem>;
                    message: string;
                    statusCode: number;
                }>({
                    endpoint: '/public/news',
                    method: 'GET',
                    params,
                });

                updateNewCache(response, type);

                return response;
            },

            getNewsById: async (id: string): Promise<ApiResponse<{ data: NewsItem }>> => {
                const cachedDetail = newsDetailsCache[id];

                if (cachedDetail && isCacheValid(cachedDetail.lastFetch)) {
                    return {
                        data: { data: cachedDetail.data },
                        statusCode: 200,
                        message: 'success',
                    };
                }

                console.log(`Fetching fresh news details for ID: ${id}`);

                const response = await fetchData<{ data: NewsItem }>({
                    endpoint: `/public/news/${id}`,
                    method: 'GET',
                });

                if (response.statusCode === 200 && response.data?.data) {
                    const now = Date.now();
                    setNewsDetailsCache((prev) => ({
                        ...prev,
                        [id]: {
                            data: response.data.data,
                            lastFetch: now,
                        },
                    }));
                }

                return response;
            },

            // cache management utility
            clearCache: () => {
                setTechNews([]);
                setMeetupNews([]);
                setSocialNews([]);
                setNewsDetailsCache({});
                setCacheStatus({
                    TECH: { loaded: false, lastFetch: null },
                    MEETUP: { loaded: false, lastFetch: null },
                    SOCIAL: { loaded: false, lastFetch: null },
                });
            },

            forceRefresh: (type?: 'TECH' | 'MEETUP' | 'SOCIAL') => {
                if (type) {
                    setCacheStatus((prev) => ({
                        ...prev,
                        [type]: { loaded: false, lastFetch: null },
                    }));
                } else {
                    setCacheStatus({
                        TECH: { loaded: false, lastFetch: null },
                        MEETUP: { loaded: false, lastFetch: null },
                        SOCIAL: { loaded: false, lastFetch: null },
                    });
                    setNewsDetailsCache({});
                }
                console.log(`Force refresh triggered for: ${type || 'all'}`);
            },
        }),
        [
            fetchData,
            techNews,
            meetupNews,
            socialNews,
            cacheStatus,
            newsDetailsCache,
            setTechNews,
            setMeetupNews,
            setSocialNews,
            setCacheStatus,
            setNewsDetailsCache,
        ],
    );
};
