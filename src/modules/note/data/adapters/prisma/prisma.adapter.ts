import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { NoteEntity } from 'src/modules/note/domain/entities/note.entity';
import { NoteRepository } from 'src/modules/note/domain/repositories/note.repository';
import { NoteWriteDTO, NoteUpdateDTO } from 'src/modules/note/dto/note.dto';

@Injectable()
export class PrismaAdapter implements NoteRepository {
  constructor(private prisma: PrismaService) {}
  getMany(
    page: number = 0,
    limit: number = 50,
    hasFavorited: boolean = false,
  ): Promise<NoteEntity[]> {
    const skip = page < 1 ? 0 : page - 1;
    return this.prisma.note.findMany({
      skip: skip * limit,
      take: limit,
      where: { hasFavorited },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }
  getById(id: string): Promise<NoteEntity> {
    return this.prisma.note.findUnique({
      where: {
        id,
      },
    });
  }
  add(data: NoteWriteDTO): Promise<NoteEntity> {
    return this.prisma.note.create({ data });
  }
  async update(id: string, data: NoteUpdateDTO): Promise<NoteEntity> {
    const note = await this.getById(id);
    if (!note) return;
    return await this.prisma.note.update({
      where: { id },
      data,
    });
  }
  async remove(id: string): Promise<NoteEntity> {
    const note = await this.getById(id);
    if (!note) return;
    return await this.prisma.note.delete({
      where: { id },
    });
  }
}
