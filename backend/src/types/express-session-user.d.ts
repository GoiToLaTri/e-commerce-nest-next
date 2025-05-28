import { SessionData } from '@/modules/session/interfaces';

declare module 'express';
interface Request {
  session_user?: Partial<SessionData>;
}
