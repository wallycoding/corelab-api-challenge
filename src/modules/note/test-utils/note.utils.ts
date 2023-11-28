import { randomUUID } from 'node:crypto';
import { NoteEntity } from '../domain/entities/note.entity';
import { NoteUpdateDTO } from '../dto/note.dto';

interface CustomNoteEntity extends Omit<NoteEntity, 'updatedAt' | 'createdAt'> {
  updatedAt: Date | string;
  createdAt: Date | string;
}

export const createFakeNote = (
  { title, description, color, hasFavorited }: NoteUpdateDTO,
  isIsoString = false,
): CustomNoteEntity => {
  const timestamp = isIsoString ? new Date().toISOString() : new Date();
  return {
    id: randomUUID(),
    title,
    description,
    color,
    hasFavorited,
    updatedAt: timestamp,
    createdAt: timestamp,
  };
};
