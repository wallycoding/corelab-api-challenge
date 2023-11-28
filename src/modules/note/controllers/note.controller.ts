import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { NoteEntity } from '../domain/entities/note.entity';
import { NoteWriteDTO, NoteUpdateDTO } from '../dto/note.dto';
import { NoteService } from '../services/note.service';

type ListQuery = {
  page?: string | number;
  target?: 'favorite' | 'unfavorite';
};

type ParamId = {
  id: string;
};

@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'target',
    required: false,
    type: 'favorite | unfavorite',
  })
  @Get('list')
  async getMany(@Query() query: ListQuery): Promise<NoteEntity[]> {
    const page = typeof query.page === 'undefined' ? 0 : +query.page;
    if (isNaN(page)) throw new BadRequestException('Invalid page argument');
    const hasFavorited = query?.target === 'favorite';

    return await this.noteService.getMany(page, 100, hasFavorited);
  }
  @Get(':id')
  async getById(@Param() param: ParamId): Promise<NoteEntity> {
    const note = await this.noteService.getById(param.id);
    if (!note) throw new NotFoundException('Not found');
    return note;
  }

  @Post('add')
  add(
    @Body() { description, hasFavorited, title, color }: NoteWriteDTO,
  ): Promise<NoteEntity> {
    return this.noteService.add({ description, hasFavorited, title, color });
  }

  @Patch(':id')
  async update(
    @Param() param: ParamId,
    @Body() { description, hasFavorited, title, color }: NoteUpdateDTO,
  ): Promise<NoteEntity> {
    const note = await this.noteService.update(param.id, {
      description,
      hasFavorited,
      title,
      color,
    });
    if (!note) throw new NotFoundException('Not found');
    return note;
  }

  @Delete(':id')
  async remove(@Param() param: ParamId): Promise<NoteEntity> {
    const note = await this.noteService.remove(param.id);
    if (!note) throw new NotFoundException('Not found');
    return note;
  }
}
