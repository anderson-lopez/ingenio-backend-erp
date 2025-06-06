import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { JWTPayload } from 'src/common/security/jwt.payload';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/loginResponse.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/Profiles.entity';
import { Permission } from '../entities/Permision.entity';
import { UserSignupAuthentication } from '../interfaces/authentication.interface';
import { IBranch } from '../interfaces/branch.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll() {
    return this.userService.findAll();
  }

  async login(request: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = request;
    const valid = await this.validateUser(email, password);
    if (!valid) throw new UnauthorizedException('Not Valid Credentials');
    const user = await this.userService.getUserInformation(email);
    const userBranches = await this.userService.getBranchsByUser(user.id);

    const data: UserSignupAuthentication = {
      ...user,
      profiles: user.profiles.map((profile) => profile.name),
      permissions: user.profiles
        .map((profile) =>
          profile.permissions.map((permission) => permission.name),
        )
        .flat(),
    };
    const token = await this.generateAccessToken(data, userBranches);

    return token;
  }

  private async validateUser(username: string, password: string) {
    const user = await this.userService.findByEmail(username);
    return await this.userService.validatePassword(password, user.password);
  }

  private async generateAccessToken(
    data: UserSignupAuthentication,
    branchs: IBranch[],
  ): Promise<LoginResponseDto> {
    const payload: JWTPayload = {
      ...data,
      branchs,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(request: any): Promise<LoginResponseDto> {
    const user = await this.userService.createUser(request);
    const userData: UserSignupAuthentication = {
      ...user,
      profiles: user.profiles.map((profile) => profile.name),
      permissions: user.profiles
        .map((profile) =>
          profile.permissions.map((permission) => permission.name),
        )
        .flat(),
    };
    const userBranches = await this.userService.getBranchsByUser(user.id);

    return await this.generateAccessToken(userData, userBranches);
  }

  async getAllUsers() {
    return await this.userService.getAllwithProfiles();
  }

  async getAllProfiles() {
    return await this.profileRepository.find({ relations: ['permissions'] });
  }

  async getAllPermissions() {
    return await this.permissionRepository.find();
  }
  //     refreshToken
  async refreshToken(email: string, refreshToken: string) {
    const valid = await this.userService.findByEmail(email);
    if (!valid) throw new UnauthorizedException('Not Valid Credentials');
    const user = await this.userService.getUserInformation(email);
    const validToken = await this.jwtService.decode(refreshToken);
    if (validToken?.email !== email)
      throw new UnauthorizedException('Not Valid Credentials');

    const data = {
      ...user,
      profiles: user.profiles.map((profile) => profile.name),
      permissions: user.profiles
        .map((profile) =>
          profile.permissions.map((permission) => permission.name),
        )
        .flat(),
    };

    const userBranches = await this.userService.getBranchsByUser(user.id);
    const newToken = await this.generateAccessToken(data, userBranches);

    return newToken;
  }

  async getManagerByUserId(userId: number) {
    return await this.userService.getManagerByUserId(userId);
  }
}
