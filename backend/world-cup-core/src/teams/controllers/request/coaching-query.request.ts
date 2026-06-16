import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LanguageEnum } from '../../../basic/model/language.enum';

export class CoachingSelectStrategy {
  @ApiPropertyOptional({ enum: [LanguageEnum.ES, LanguageEnum.EN], default: LanguageEnum.ES })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEnum(LanguageEnum)
  lang?: LanguageEnum;

  @ApiProperty({ example: "ATTACK", description: 'estrategia elegida por el usuario' })
  @IsString({ message: 'La opción debe ser una estrategia valida' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsNotEmpty()
  strategy: string;
}
export class CoachingSelectFormation {
  @ApiPropertyOptional({ enum: [LanguageEnum.ES, LanguageEnum.EN], default: LanguageEnum.ES })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEnum(LanguageEnum)
  lang?: LanguageEnum;

  @ApiProperty({ example: "4-4-2", description: 'formacion elegida por el usuario' })
  @IsString({ message: 'La opción debe ser una formacion valida' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty()
  formation: string;
}

