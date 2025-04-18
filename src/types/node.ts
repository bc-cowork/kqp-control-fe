// Channel Item (matches GetChannelListResponse['data']['list'])
export interface IChannelItem {
  id: number;
  name: string; // Updated from number to string per API
  count: number;
  port: number; // Updated from string to number per API
  mip: string;
  nic: string;
  utype: 'multicast' | 'unicast' | 'broadcast';
  type: 'UDP';
  topic: string;
  is_running: boolean;
}

// Audit Log Item (matches GetAuditLogListResponse['data']['auditLogList'])
export interface IAuditLogItem {
  id: number;
  size: number;
  date: string;
  kind: string;
  fname: string;
}

// Audit Log Frame Fragment (matches GetAuditLogFrameResponse['data']['spec']['frags'])
export interface AuditLogFrameFragItem {
  id: number;
  len: number;
  data: string;
  desc: string;
}

// Audit Log Frame Item (matches GetAuditFrameListResponse['data']['frame_list'])
export interface AuditLogFrameItem {
  seq: number;
  head: string;
  rid: number;
  size: number;
}

// Issue Item (matches GetIssuesResponse['data']['issueList'])
export interface IssueItem {
  compet: number;
  name: string;
  code: string;
  seq: number;
  daily_info_dates: [number, number, number];
}

// Issue Info (matches GetIssueItemInfoResponse['data']['issueInfo'])
export interface IssueInfo {
  code: string;
  vol_accum: { nxt: number; uni: number; krx: number };
  amt_accum: { nxt: number; uni: number; krx: number };
  seq: number;
  high: { nxt: number; uni: number; krx: number };
  compet: number;
  last_price: { nxt: number; uni: number; krx: number };
  last_vol: { nxt: number; uni: number; krx: number };
  g1_ssn_id: [string | null, string, string];
  open: { nxt: number; uni: number; krx: number };
  name: string;
  low: { nxt: number; uni: number; krx: number };
}

// Order Book Entry (matches GetIssueItemQuotesResponse['data']['issueQuote']['order_book'])
export interface OrderBookEntry {
  uni: number;
  price: number;
  nxt: number;
  krx: number;
}

// Audit Log Item (matches GetAuditLogListResponse['data']['auditLogList'])
export interface IPaginationMeta {
  current_page: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  total_pages: number;
}
