import { NoteUpdateDTO, NoteWriteDTO } from '../../dto/note.dto';
import { NoteEntity } from '../entities/note.entity';

export abstract class NoteRepository {
  abstract getMany(
    page?: number,
    limit?: number,
    hasFavorited?: boolean,
  ): Promise<NoteEntity[]>;
  abstract getById(id: string): Promise<NoteEntity>;
  abstract add(data: NoteWriteDTO): Promise<NoteEntity>;
  abstract update(id: string, data: NoteUpdateDTO): Promise<NoteEntity>;
  abstract remove(id: string): Promise<NoteEntity>;
}
