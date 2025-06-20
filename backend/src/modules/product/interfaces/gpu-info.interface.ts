export interface IGPUInfo {
  manufacturer: 'NVIDIA' | 'AMD' | 'Intel';
  brand: string;
  prefix: string;
  series: string;
  model: string;
  vram_gb: number | null;
  memory_type: string | null;
  name: string;
}
