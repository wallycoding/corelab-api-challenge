import { plainToClass } from 'class-transformer';
import { NoteWriteDTO, NoteUpdateDTO } from './note.dto';
import { validate } from 'class-validator';

describe('NoteDTO', () => {
  describe('NoteWriteDTO', () => {
    it('should pass without errors when provided with the correct data', async () => {
      const dto = plainToClass(NoteWriteDTO, {
        title: 'any',
        description: 'any',
        hasFavorited: false,
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
    it('should fail when not provided correct data', async () => {
      const bodies = [
        { description: 'any' },
        { title: 'any' },
        { hasFavorited: true },
        {},
      ];
      const expectedNumberOfErrors = [2, 2, 2, 3];
      for (const i in bodies) {
        const totalErrors = expectedNumberOfErrors[i];
        const dto = plainToClass(NoteWriteDTO, bodies[i]);
        const errors = await validate(dto);
        expect(errors).toHaveLength(totalErrors);
      }
    });
  });
  describe('NoteUpdateDTO', () => {
    it('should pass without errors when provided with the correct data', async () => {
      const bodies = [
        { description: 'any' },
        { title: 'any' },
        { hasFavorited: true },
        { color: 'any_color' },
      ];

      for (const body of bodies) {
        const dto = plainToClass(NoteUpdateDTO, body);
        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      }
    });
    it('should fail when not provided correct data', async () => {
      const dto = plainToClass(NoteUpdateDTO, {});
      const errors = await validate(dto);
      expect(errors).toHaveLength(4);
    });
  });
});
