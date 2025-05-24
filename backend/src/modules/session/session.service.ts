import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}
  createSession(user_id: string) {
    const session_id = `session-${nanoid(16)}-${Date.now()}`;
    return this.prisma.session.create({
      data: {
        session_id,
        user_id,
        expires_at: new Date(Date.now() + 60 * 60 * 24), // 1 day expiration
      },
    });
  }

  findBySessionId(session_id: string) {
    return this.prisma.session.findUnique({
      where: { session_id },
      include: { user: true },
    });
  }

  removeBySessionId(session_id: string) {
    return this.prisma.session.delete({
      where: { session_id },
    });
  }
}
