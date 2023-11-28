import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
  ValidateIf,
} from 'class-validator';

const allIsUndefined = <T extends object>(o: T, ...fields: (keyof T)[]) =>
  fields.every((field) => typeof o[field] === 'undefined');

export class NoteWriteDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 50)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 1000)
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  hasFavorited: boolean;

  @ApiProperty()
  @IsOptional()
  @Length(2, 50)
  color?: string;
}

export class NoteUpdateDTO {
  @ApiProperty()
  @ValidateIf((o: NoteUpdateDTO) =>
    allIsUndefined(o, 'description', 'color', 'hasFavorited'),
  )
  @IsNotEmpty()
  @Length(3, 50)
  title?: string;

  @ApiProperty()
  @ValidateIf((o: NoteUpdateDTO) =>
    allIsUndefined(o, 'title', 'color', 'hasFavorited'),
  )
  @IsNotEmpty()
  @Length(3, 1000)
  description?: string;

  @ApiProperty()
  @ValidateIf((o: NoteUpdateDTO) =>
    allIsUndefined(o, 'title', 'description', 'color'),
  )
  @IsNotEmpty()
  @IsBoolean()
  hasFavorited?: boolean;

  @ApiProperty()
  @ValidateIf((o: NoteUpdateDTO) =>
    allIsUndefined(o, 'title', 'description', 'hasFavorited'),
  )
  @IsNotEmpty()
  @Length(2, 50)
  color?: string;
}
