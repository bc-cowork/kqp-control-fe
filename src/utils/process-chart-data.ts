import type { ServiceStatus, ChartDataPoint } from 'src/types/dashboard';

export function processChartData(serviceStatus: ServiceStatus[]): ChartDataPoint[] {
  return serviceStatus.map((entry) => {
    // Convert "HHMMSS" (e.g., "160000") to "HH:MM" (e.g., "16:00")
    const hours = entry.hhmmss.slice(0, 2);
    const minutes = entry.hhmmss.slice(2, 4);
    const timestamp = `${hours}:${minutes}`;

    return {
      timestamp,
      cpu: entry.cpu,
      memory: entry.memory,
      inbound_bytes: entry.inbound_bytes,
      outbound_bytes: entry.outbound_bytes,
    };
  });
}
