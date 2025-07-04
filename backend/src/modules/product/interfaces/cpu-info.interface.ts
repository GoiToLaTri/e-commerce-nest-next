export interface ICPUInfo {
  brand: 'Intel' | 'AMD';
  family: string; // "Core", "Ryzen", ...
  series: string; // "i5", "Ryzen 7", ...
  generation: number;
  sku: string; // "13500H", "7840HS"
  suffix?: string; // "H", "X3D", "U", etc.
  model: string; // full name input
  is_laptop?: boolean;
  has_integrated_gpu?: boolean;
}
