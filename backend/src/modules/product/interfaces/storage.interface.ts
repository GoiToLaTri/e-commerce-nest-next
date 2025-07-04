import { IStorageInfo } from './storage-info.interface';

export interface IStorage extends IStorageInfo {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
}
