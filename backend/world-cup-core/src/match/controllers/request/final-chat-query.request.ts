import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional} from 'class-validator';
import { LanguageEnum } from '../../../basic/model/language.enum';

export class FinalChatQueryPreviewRequest {
  @ApiPropertyOptional({ enum: [LanguageEnum.ES, LanguageEnum.EN], default: LanguageEnum.ES })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEnum(LanguageEnum)
  lang?: LanguageEnum;
}

export class FinalChatBodyStart {
  @ApiPropertyOptional({ enum: [LanguageEnum.ES, LanguageEnum.EN], default: LanguageEnum.ES })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEnum(LanguageEnum)
  lang?: LanguageEnum;
}

export class FinalChatBodyPlay {
  @ApiPropertyOptional({ enum: [LanguageEnum.ES, LanguageEnum.EN], default: LanguageEnum.ES })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEnum(LanguageEnum)
  lang?: LanguageEnum;

  @ApiProperty({ example: 1, description: 'Opción numérica elegida por el usuario para el turno' })
  @IsInt({ message: 'La opción debe ser un número entero' }) 
  @IsNotEmpty()
  option:number;
}

