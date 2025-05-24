import { IUser } from '@/modules/user/interfaces';

export interface SessionData {
  id: string;
  user_id: string;
  session_id: string;
  expires_at: Date;
  created_at: Date;
  user: IUser;
}
