import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

import mockData from '../mocks/mock-data.json'; // Import the mock data

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    // In development mode, return mock data directly
    if (CONFIG.apiDataType === 'dummy') {
      // Construct the full URL with query params if present
      let fullUrl = url;
      if (config?.params) {
        const params = new URLSearchParams(config.params).toString();
        fullUrl = params ? `${url}?${params}` : url;
      }

      // Split the URL into base path and query parameters
      const [baseUrl] = fullUrl.split('?');

      // First, try to find an exact match (including query parameters)
      if (fullUrl in mockData) {
        return mockData[fullUrl as keyof typeof mockData];
      }

      // If no exact match, find a key that matches the base URL (ignoring query parameters)
      const matchedKey = Object.keys(mockData).find((key) => {
        const [keyBaseUrl] = key.split('?');
        return keyBaseUrl === baseUrl;
      });

      if (matchedKey) {
        return mockData[matchedKey as keyof typeof mockData];
      }

      throw new Error(`No mock data found for URL: ${fullUrl}`);
    }

    // In production, make the real API request
    const res = await axiosInstance.get(url, { ...config });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    login: '/apik/login',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  dashboard: {
    nodeList: '/apik/node/list',
    serviceStatus: (node: string) => `/apik/${node}/service/status`,
    processList: (node: string) => `/apik/${node}/process/list`,
    issueList: (node: string) => `/apik/${node}/issue/list`,
    graph: (node: string) => `/apik/${node}/node/metrics`,
  },
  actions: {
    list: (node: string) => `/apik/${node}/action/list`,
  },
  nodes: {
    channelInbound: {
      list: (node: string) => `/apik/${node}/channel/list`,
    },
    auditLog: {
      list: (node: string) => `/apik/${node}/auditlog/list`,
      frameList: (node: string) => `/apik/${node}/auditlog/frame-list`,
      frame: (node: string) => `/apik/${node}/auditlog/frame`,
    },
    issues: {
      list: (node: string) => `/apik/${node}/issue/list`,
      search: (node: string) => `/apik/${node}/issue/search`,
      info: (node: string) => `/apik/${node}/issue/info`,
      quote: (node: string) => `/apik/${node}/issue/quote`,
      graph: (node: string) => `/apik/${node}/node/metrics/memory`,
    },
  },
};
