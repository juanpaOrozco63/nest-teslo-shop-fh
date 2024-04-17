import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { IResponseAuthUsers } from './auth-users.model';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService:JwtService
  ){

  }
  async checkAuthStatus(user:User){
    return {
      ...user,
      token:this.getJsonWebToken({id:user.id})
    }

  }
  async getAllUsers(paginationDto: PaginationDto){
    let response: IResponseAuthUsers;
    let users: User[];
    let count: number = 0;
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      count = await this.userRepository.count({});
      users = await this.userRepository.find({
        take: limit,
        skip: offset,
      });

      if (count === 0)
        return 'No users available'
      response = { count,users };
      return response;
    } catch (error) {

    }
  }
  async create(createUserDto: CreateUserDto) {
    const { password,...userData } = createUserDto;
    try {
      const user =  this.userRepository.create({
        ...userData,
        password:bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password
      return {...user,
        token:this.getJsonWebToken({id:user.id})
      };
    } catch (error) {
      this.handleErrorDBErrors(error);
    }
  }
  async loginUser(loginUserDto:LoginUserDto){
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({where:{email},select:{email:true,password:true,id:true}});
    if(!user)
      throw new UnauthorizedException('Invalid credentials')
    if(!bcrypt.compareSync(password,user.password))
      throw new UnauthorizedException('Invalid credentials')
    return {...user,
      token:this.getJsonWebToken({id:user.id})
    };
  }

  private getJsonWebToken(payload:JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;

  }
  private handleErrorDBErrors(error: any): never {
    if (error.code === '23505') 
      throw new BadRequestException(error.detail)
    
    throw new InternalServerErrorException('Please check de server logs')
    
  } 
 
}
