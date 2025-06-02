import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { AuthenticationService } from './services/authentication.service';
import { LoginDto, RefreshTokenDto, SignupDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/security/permissions.guard';
import { Permissions } from 'src/common/security/permissions.decorator';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() request: LoginDto): Promise<LoginResponseDto> {
    return this.authenticationService.login(request);
  }

  @Post('signup')
  register(@Body() request: SignupDto): Promise<LoginResponseDto> {
    console.log('this is the request: ', request);
    return this.authenticationService.signup(request);
  }

  // get all profiles
  @Get('users')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read_users')
  getAllUsers() {
    return this.authenticationService.getAllUsers();
  }

  // get all profiles
  @Get('profiles')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Permissions('read_profiles')
  getAllProfiles() {
    return this.authenticationService.getAllProfiles();
  }

  // get all permissions with auth guard
  @Get('permissions')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Permissions('read_permissions')
  getAllPermissions() {
    return this.authenticationService.getAllPermissions();
  }

  // refresh token
  @Post('refresh-token')
  @Permissions('refresh_token')
  refreshToken(@Body() request: RefreshTokenDto): Promise<LoginResponseDto> {
    return this.authenticationService.refreshToken(
      request.email,
      request.refreshToken,
    );
  }

  @Get('manager/:userId')
  @ApiOperation({
    summary:
      'Find Manager of user Id selected for current branch asociated to user',
  })
  @ApiParam({ name: 'userId', required: true, type: 'number', example: 1 })
  getManager(@Param('userId') userId: number) {
    return this.authenticationService.getManagerByUserId(userId);
  }
}
