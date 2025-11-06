// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    nodes: {
      root: '/dashboard/nodes',
      node: (node: string) => `/dashboard/nodes/${node}`,
      dashboard: (node: string) => `/dashboard/nodes/${node}/node-dashboard`,
      process: (node: string) => `/dashboard/nodes/${node}/process`,
      memory: (node: string) => `/dashboard/nodes/${node}/memory`,
      auditLog: (node: string) => `/dashboard/nodes/${node}/audit-log`,
      channelsInbound: (node: string) => `/dashboard/nodes/${node}/channels-inbound`,
      channelsOutbound: (node: string) => `/dashboard/nodes/${node}/channels-outbound`,
      rules: (node: string) => `/dashboard/nodes/${node}/rules`,
      actionList: (node: string) => `/dashboard/nodes/${node}/action-list`,
      actionDetail: (node: string, action: string) => `/dashboard/nodes/${node}/action/${encodeURIComponent(action)}`,
      specList: (node: string) => `/dashboard/nodes/${node}/spec-list`,
      identifyList: (node: string) => `/dashboard/nodes/${node}/identify-list`,
      dailyReportList: (node: string) => `/dashboard/nodes/${node}/daily-report-list`,
      alertsList: (node: string) => `/dashboard/nodes/${node}/alerts-list`,
    },
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
