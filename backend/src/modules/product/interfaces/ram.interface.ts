import { IRamInfo } from './ram-info.interface';

export interface IRam extends IRamInfo {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
}
