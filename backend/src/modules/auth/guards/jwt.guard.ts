import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    // This guard is used to protect routes that require a valid JWT token
    super({
      property: 'session_user', // The property where the user data will be stored in the request object
    });
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Implement your JWT validation logic here
    const isPublic: boolean | undefined =
      this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);

    if (isPublic) return true; // Placeholder, replace with actual validation

    return super.canActivate(context);
  }
}
