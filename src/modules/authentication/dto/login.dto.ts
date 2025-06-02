import { ApiProperty } from '@nestjs/swagger';
import { IsPositive } from 'class-validator';
export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class SignupDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @IsPositive({ message: 'El profile_id debe ser un número positivo' })
  @ApiProperty()
  profile_id: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  client_category_id: number;

  @ApiProperty()
  total_month_purchases: number;

  @IsPositive({ message: 'El user_type_id debe ser un número positivo' })
  @ApiProperty()
  user_type_id: number;
}

export class RefreshTokenDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  refreshToken: string;
}
