export type IChannelItem = {
  id: number;
  name: number;
  count: number;
  port: string;
  mip: string;
  nic: string;
  utype: string;
  type: string;
  topic: string;
  is_running: boolean;
};

export type IAuditLogItem = {
  id: number;
  size: number;
  date: string;
  kind: string;
  fname: string;
};
