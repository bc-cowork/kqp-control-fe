// Node Item (matches GetNodesResponse)
export interface INodeItem {
  id: string;
  name: string;
  desc: string;
  emittable: boolean;
  emit_count: number;
  online_status: boolean;
}

// Process Item (matches Process in GetProcessesResponse)
export interface IProcessItem {
  PID: string;
  NAME: string;
  PARAM: string;
  CPU: string;
  MEM: string;
  PPID: string;
  COMMAND: string;
}

// Process Response (updated to match GetProcessesResponse)
export interface IProcessResponse {
  nodeId: string;
  processList: {
    target: string;
    data: IProcessItem[] | Record<string, never>; // Can be empty object or array
  }[];
}

// Status (matches GetStatusResponse['data'])
export interface IStatus {
  nodeId: string;
  service_status: {
    idate: number;
    okay: boolean;
    date: string;
    time: number;
    log: Record<string, never>;
    verify: {
      master_receive: boolean;
      cacheclear: boolean;
      process: boolean;
      dailyclear: boolean;
    };
    emittable: boolean;
    wday: string;
    audit: {
      masters: {
        distributable_issues: string[];
        krx_count: number;
        nxt_count: number;
        common_count: number;
      };
      process: {
        [processName: string]: {
          [instanceId: string]: {
            cmd: string;
            mem: number;
            owner: string;
            id: string;
            pname: string;
            inst: string;
            cpur: number;
            pid: number;
          };
        };
      };
      tasks: {
        msg: string;
        date: number;
        time: string;
      }[];
    };
  };
}

// Graph Data Time Series Entry (matches GetGraphDataResponse['data']['time_series'])
export interface ServiceStatus {
  name: string;
  hhmmss: string; // e.g., "160000"
  cpu: number;
  memory: number;
  inbound_bytes: number;
  outbound_bytes: number;
  inbound_count: number;
  outbound_count: number;
}

// Chart Data Point (for frontend visualization, unchanged)
export interface ChartDataPoint {
  timestamp: string; // e.g., "16:00"
  cpu: number;
  memory: number;
  inbound_bytes: number;
  outbound_bytes: number;
  inbound_count: number;
  outbound_count: number;
}

export interface MemoryMetrics {
  name: string;
  hhmmss: string;
  memory: number;
}
