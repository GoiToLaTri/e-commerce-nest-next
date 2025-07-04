import { Role } from "@/common/enums";

export {};

declare global {
  interface IUserSession {
    id: string;
    user_id: string;
    session_id: string;
    expires_at: string;
    created_at: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      avatar: string;
      created_at: string;
      roleId: Role;
    };
  }
}
