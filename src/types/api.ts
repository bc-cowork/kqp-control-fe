// Base response structure (common to all endpoints)
interface ApiResponse<T> {
  okay: boolean;
  msg: string;
  data: T;
  meta?: {
    has_previous_page: boolean;
    has_next_page: boolean;
    current_page: number;
    total_pages: number;
  };
}

// Shared utility types
type MarketValues = {
  nxt: number;
  uni: number;
  krx: number;
};

// ---- useGetIssues ----
interface Issue {
  compet: number;
  name: string;
  code: string;
  seq: number;
  daily_info_dates: [number, number, number];
}

interface IssuesData {
  nodeId: string;
  max_issue_count: number;
  compet_count: number;
  issueList: Issue[];
}

type GetIssuesResponse = ApiResponse<IssuesData>;

// ---- useGetIssueItemInfo ----
interface IssueInfo {
  code: string;
  vol_accum: MarketValues;
  amt_accum: MarketValues;
  seq: number;
  high: MarketValues;
  compet: number;
  last_price: MarketValues;
  last_vol: MarketValues;
  g1_ssn_id: [string | null, string, string];
  open: MarketValues;
  name: string;
  low: MarketValues;
}

interface IssueItemInfoData {
  nodeId: string;
  issueInfo: IssueInfo;
}

type GetIssueItemInfoResponse = ApiResponse<IssueItemInfoData>;

// ---- useGetIssueItemQuotes ----
interface OrderBookEntry {
  uni: number;
  price: number;
  nxt: number;
  krx: number;
}

interface OrderBook {
  bid: {
    [key: string]: OrderBookEntry; // "1" to "10" and "sum"
    sum: OrderBookEntry;
  };
  ask: {
    [key: string]: OrderBookEntry; // "1" to "10" and "sum"
    sum: OrderBookEntry;
  };
}

interface IssueQuote {
  name: string;
  code: string;
  order_book: OrderBook;
}

interface IssueItemQuotesData {
  nodeId: string;
  issueQuote: IssueQuote;
}

type GetIssueItemQuotesResponse = ApiResponse<IssueItemQuotesData>;

// ---- useAuditLogList ----
interface AuditLog {
  kind: string;
  date: string;
  size: number;
  id: number;
  fname: string;
}

interface AuditLogListData {
  nodeId: string;
  auditLogList: AuditLog[];
}

type GetAuditLogListResponse = ApiResponse<AuditLogListData>;

// ---- useAuditFrameList ----
interface Frame {
  size: number;
  rid: number;
  head: string;
  seq: number;
}

interface AuditFrameListData {
  file_size: number;
  max_frame: number;
  file: string;
  nodeId: string;
  desc: string;
  date: number;
  frame_list: Frame[];
}

type GetAuditFrameListResponse = ApiResponse<AuditFrameListData>;

// ---- useGetAuditLogFrame ----
interface FrameFragment {
  data: string;
  len: number;
  desc: string;
  id: number;
}

interface FrameSpec {
  date: number;
  seq: number;
  head: string;
  time_ms: string;
  rid: number;
  time_us: string;
  file_size: number;
  max_frame: number;
  time: string;
  frags: FrameFragment[];
  data: string;
  size: number;
}

interface AuditLogFrameData {
  file: string;
  nodeId: string;
  desc: string;
  spec: FrameSpec;
}

type GetAuditLogFrameResponse = ApiResponse<AuditLogFrameData>;

// ---- useGetChannelList (inbound and outbound) ----
interface Channel {
  name: string;
  utype: 'multicast' | 'unicast' | 'broadcast';
  port: number;
  is_running: boolean;
  mip: string;
  id: number;
  count: number;
  type: 'UDP';
  topic: string;
  nic: string;
}

interface ChannelListData {
  nodeId: string;
  kind: 'inbound' | 'outbound';
  list: Channel[];
}

type GetChannelListResponse = ApiResponse<ChannelListData>;

// ---- useGetGraphData ----
interface TimeSeriesEntry {
  name: string;
  outbound_bytes: number;
  outbound_count: number;
  hhmmss: string;
  inbound_count: number;
  cpu: number;
  memory: number;
  inbound_bytes: number;
}

interface GraphData {
  nodeId: string;
  time_series: TimeSeriesEntry[];
}

type GetGraphDataResponse = ApiResponse<GraphData>;

// ---- useGetProcesses ----
interface Process {
  PARAM: string;
  PPID: string;
  MEM: string;
  NAME: string;
  PID: string;
  CPU: string;
  COMMAND: string;
}

interface ProcessGroup {
  data: Process[] | Record<string, never>; // Can be empty object or array of processes
  target: string;
}

interface ProcessesData {
  nodeId: string;
  processList: ProcessGroup[];
}

type GetProcessesResponse = ApiResponse<ProcessesData>;

// ---- useGetStatus ----
interface Verify {
  master_receive: boolean;
  cacheclear: boolean;
  process: boolean;
  dailyclear: boolean;
}

interface MasterProcess {
  cmd: string;
  mem: number;
  owner: string;
  id: string;
  pname: string;
  inst: string;
  cpur: number;
  pid: number;
}

interface ProcessStatus {
  [processName: string]: {
    [instanceId: string]: MasterProcess;
  };
}

interface Task {
  msg: string;
  date: number;
  time: string;
}

interface Masters {
  distributable_issues: string[];
  krx_count: number;
  nxt_count: number;
  common_count: number;
}

interface Audit {
  masters: Masters;
  process: ProcessStatus;
  tasks: Task[];
}

interface ServiceStatus {
  idate: number;
  okay: boolean;
  date: string;
  time: number;
  log: Record<string, never>; // Empty object in sample
  verify: Verify;
  emittable: boolean;
  wday: string;
  audit: Audit;
}

interface StatusData {
  nodeId: string;
  service_status: ServiceStatus;
}

type GetStatusResponse = ApiResponse<StatusData>;

// ---- useGetNodes ----
interface Node {
  id: string;
  emittable: boolean;
  emit_count: number;
  name: string;
  desc: string;
  online_status: boolean;
}

interface NodesData {
  nodeList: Node[];
}

type GetNodesResponse = ApiResponse<NodesData>;

interface LoginData {
  id: string;
}

type GetLoginResponse = ApiResponse<LoginData>;

interface MemoryGraphData {
  metrics: any; // TODO: add type
  nodeId: string;
}

type MemoryGraphResponse = ApiResponse<MemoryGraphData>;

// Export all types
export type {
  GetNodesResponse,
  GetLoginResponse,
  GetIssuesResponse,
  GetStatusResponse,
  MemoryGraphResponse,
  GetGraphDataResponse,
  GetProcessesResponse,
  GetChannelListResponse,
  GetAuditLogListResponse,
  GetIssueItemInfoResponse,
  GetAuditLogFrameResponse,
  GetAuditFrameListResponse,
  GetIssueItemQuotesResponse,
};
