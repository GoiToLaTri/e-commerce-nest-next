import { IGPUInfo } from './gpu-info.interface';

export interface IGPU extends IGPUInfo {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
}
