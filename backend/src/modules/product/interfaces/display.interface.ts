import { IDisplayInfo } from './display-info.interface';

export interface IDisplay extends IDisplayInfo {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
}
