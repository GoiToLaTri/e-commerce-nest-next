import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/enums/role.enum';
import { AccessContorlService } from 'src/shared/access-control.service';
import { ROLE_KEY } from '../decorators/roles.decorator';

// export class TokenDto {
//   id: number;
//   role: Role;
// }

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessContorlService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean | undefined =
      this.reflector.getAllAndOverride<boolean>('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);

    if (isPublic) return true; // Placeholder, replace with actual validation

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context
      .switchToHttp()
      .getRequest<{ session_user: { user: { roleId: string } } }>();

    if (!request.session_user || !request.session_user.user) return false; // No session user or user data available
    const user_role: Role = request.session_user.user.roleId as Role;
    console.log(requiredRoles, user_role);
    for (const role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRole: user_role,
      });
      console.log(result);
      if (result) return true;
    }

    return false;
  }
}
