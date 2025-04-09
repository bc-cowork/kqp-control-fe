export type INodeItem = {
  id: string;
  name: string;
  desc: string;
  emittable: boolean;
  emit_count: number;
  online_status: boolean;
};

export type IProcessResponse = {
  nodeId: string;
  processList: {
    data: IProcessItem[];
    target: string;
  };
};

export type IProcessItem = {
  PID: string;
  NAME: string;
  PARAM: string;
  CPU: string;
  MEM: string;
  PPID: string;
  COMMAND: string;
};

export type IStatus = {
  nodeId: string;
  service_status: any;
};

// export type IServiceStatus = {
//   okay: boolean;
// }

export interface ServiceStatus {
  cpu: number;
  hhmmss: string; // Time in "HHMMSS" format (e.g., "160000")
  inbound_bytes: number;
  inbound_count: number;
  memory: number;
  name: string;
  outbound_bytes: number;
  outbound_count: number;
}

export interface GraphDataResponse {
  data: {
    nodeId: string;
    service_status: ServiceStatus[];
    msg: string;
    okay: boolean;
  };
}

export interface ChartDataPoint {
  timestamp: string; // Formatted time for the X-axis (e.g., "16:00")
  cpu: number;
  memory: number;
  inbound_bytes: number;
  outbound_bytes: number;
}
