import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { IncomingHttpHeaders } from 'http2';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
   
  @Get('check')
  @Auth()
  checkAuthStatus(@GetUser() user:User){
    
    return this.authService.checkAuthStatus(user);
  }

  @Get('users')
  getAllUsers(@Query() paginationDto:PaginationDto){
    return this.authService.getAllUsers(paginationDto);
  }
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @Req() request: Express.Request,
    @RawHeaders() rawHeader: Express.Request,
    @Headers() headers: IncomingHttpHeaders
  ) {

    return {
      ok: true,
      user,
      userEmail,
      headers
    }
  }
  // @SetMetadata('roles',['admin','super-user'])
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @Get('private2')
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user: user
    }
  }
  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivate3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user: user
    }
  }
}
