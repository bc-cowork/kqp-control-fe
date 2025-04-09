import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

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
    graph: (node: string) => `/apik/${node}/node/performance/time-series`,
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
    },
  },
};
