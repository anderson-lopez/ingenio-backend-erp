import { IsObject, IsOptional, IsString } from 'class-validator';

/* ----  DTO que enviamos a /dte/sign  ---- */
export class SignDteDto {
  @IsObject()
  dte: Record<string, any>;
}

/* ----  DTO que enviamos opcionalmente a /dte/send  ---- */
export class SendSignedDteDto {
  @IsObject()
  signedDte: Record<string, any>;

  @IsString()
  token: string;        // token obtenido en /dte/auth
}
