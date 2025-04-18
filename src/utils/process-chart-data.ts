import type { ServiceStatus, MemoryMetrics, ChartDataPoint } from 'src/types/dashboard';

export function processChartData(metrics: ServiceStatus[]): ChartDataPoint[] {
  return metrics.map((entry) => {
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
      inbound_count: entry.inbound_count,
      outbound_count: entry.outbound_count,
    };
  });
}

export function processMemoryChartData(metrics: MemoryMetrics[]) {
  return metrics.map((entry) => {
    const hours = entry.hhmmss.slice(0, 2);
    const minutes = entry.hhmmss.slice(2, 4);
    const timestamp = `${hours}:${minutes}`;

    return {
      timestamp,
      memory: entry.memory,
    };
  });
}
