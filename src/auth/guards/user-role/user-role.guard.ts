import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector:Reflector
  ){

  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validateRoles: string[] = this.reflector.get<string[]>(META_ROLES,context.getHandler());
    if(!validateRoles || validateRoles.length === 0) 
      return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if(!user)
      throw new BadRequestException('User not found')

    for (const role of user.roles) {
      if(validateRoles.includes(role))
        return true;
    } 
    throw new ForbiddenException('You do not have permission to access this route');
  }
}
