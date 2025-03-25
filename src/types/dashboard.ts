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
