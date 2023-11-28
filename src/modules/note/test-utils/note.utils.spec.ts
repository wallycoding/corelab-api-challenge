import { createFakeNote } from './note.utils';

describe('note.utils', () => {
  it('should return a note entity with date', () => {
    const data = createFakeNote({
      title: 'any',
      description: 'any',
      color: 'any',
      hasFavorited: true,
    });
    expect(data).toEqual({
      id: expect.any(String),
      title: 'any',
      description: 'any',
      color: 'any',
      hasFavorited: true,
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
    });
  });
  it('should return a note entity with string', () => {
    const data = createFakeNote(
      { title: 'any', description: 'any', color: 'any', hasFavorited: true },
      true,
    );
    expect(data).toEqual({
      id: expect.any(String),
      title: 'any',
      description: 'any',
      color: 'any',
      hasFavorited: true,
      updatedAt: expect.any(String),
      createdAt: expect.any(String),
    });
  });
});
