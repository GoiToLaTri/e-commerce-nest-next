import { ICPUInfo } from './cpu-info.interface';

export interface ICPU extends ICPUInfo {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
}
