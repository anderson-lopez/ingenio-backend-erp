// dto/dte-build.dto.ts
import { IsObject, IsArray, IsOptional } from 'class-validator';

export class DteBuildDto {
  @IsObject() identificacion: object;
  @IsObject() emisor: object;
  @IsObject() receptor: object;

  @IsArray({ each: true })
  cuerpoDocumento: object[];

  @IsObject() resumen: object;

  @IsOptional() @IsObject() otrosDocumentos?: object;
  @IsOptional() @IsObject() ventaTercero?: object;
  @IsOptional() @IsObject() extension?: object;
  @IsOptional() @IsObject() apendice?: object;
}
