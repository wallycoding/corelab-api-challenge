import { Injectable } from '@nestjs/common';
import { NoteRepository } from '../domain/repositories/note.repository';
import { NoteEntity } from '../domain/entities/note.entity';
import { NoteWriteDTO, NoteUpdateDTO } from '../dto/note.dto';

@Injectable()
export class NoteService {
  constructor(private noteRepository: NoteRepository) {}
  getMany(
    page?: number,
    limit?: number,
    hasFavorited?: boolean,
  ): Promise<NoteEntity[]> {
    return this.noteRepository.getMany(page, limit, hasFavorited);
  }
  getById(id: string): Promise<NoteEntity> {
    return this.noteRepository.getById(id);
  }
  add(data: NoteWriteDTO): Promise<NoteEntity> {
    return this.noteRepository.add(data);
  }
  update(id: string, data: NoteUpdateDTO): Promise<NoteEntity> {
    return this.noteRepository.update(id, data);
  }
  remove(id: string): Promise<NoteEntity> {
    return this.noteRepository.remove(id);
  }
}
