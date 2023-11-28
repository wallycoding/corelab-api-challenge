import { Test, TestingModule } from '@nestjs/testing';
import { PrismaAdapter } from './prisma.adapter';
import { createFakeNote } from 'src/modules/note/test-utils/note.utils';
import { PrismaService } from 'src/modules/prisma/prisma.service';

const createMockPrismaService = () => ({
  note: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('PrismaService', () => {
  let service: PrismaAdapter;
  const mockPrismaService = createMockPrismaService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaAdapter, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<PrismaAdapter>(PrismaAdapter);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMany', () => {
    it('should return an empty array when there are no notes', async () => {
      mockPrismaService.note.findMany.mockResolvedValue([]);
      const data = await service.getMany();
      expect(Array.isArray(data)).toBeTruthy();
      expect(data).toHaveLength(0);
      expect(mockPrismaService.note.findMany).toBeCalledTimes(1);
    });
    it('should return a note from the when notes exist', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any',
        hasFavorited: true,
      });
      mockPrismaService.note.findMany.mockResolvedValue([fakeNote]);
      const data = await service.getMany();
      expect(Array.isArray(data)).toBeTruthy();
      expect(data).toHaveLength(1);
      expect(data).toEqual([fakeNote]);
      expect(mockPrismaService.note.findMany).toBeCalledTimes(1);
    });
    it('should return 3 items per pagination in descending order', async () => {
      const ITEMS_PER_PAGE = 3;
      const allFakeNotes = Array.from({ length: 9 }, (_, i) =>
        createFakeNote({
          description: `Item(${i + 1})`,
          hasFavorited: false,
          title: 'any',
          color: 'any',
        }),
      );
      for (let i = 0; i < 3; i++) {
        const itemsPerPage = allFakeNotes.slice(
          i * ITEMS_PER_PAGE,
          i * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
        );
        mockPrismaService.note.findMany.mockResolvedValue(itemsPerPage);
        const data = await service.getMany(i + 1, ITEMS_PER_PAGE);
        expect(Array.isArray(data)).toBeTruthy();
        expect(data).toHaveLength(3);
        expect(data).toEqual(itemsPerPage);
        expect(mockPrismaService.note.findMany).toBeCalledWith({
          skip: i * ITEMS_PER_PAGE,
          take: ITEMS_PER_PAGE,
          where: { hasFavorited: false },
          orderBy: {
            updatedAt: 'desc',
          },
        });
        expect(mockPrismaService.note.findMany).toBeCalledTimes(i + 1);
      }
    });
  });
  describe('getById', () => {
    it('should return an existing note when a valid id is provided', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any',
        hasFavorited: true,
      });
      mockPrismaService.note.findUnique.mockResolvedValue(fakeNote);

      const data = await service.getById(fakeNote.id);

      expect(data).toEqual(fakeNote);
      expect(mockPrismaService.note.findUnique).toBeCalledWith({
        where: { id: fakeNote.id },
      });
      expect(mockPrismaService.note.findUnique).toBeCalledTimes(1);
    });
    it('should return undefined when attempting to access a non-existent note by id', async () => {
      const invalidId = 'invalid_id';
      const data = await service.getById(invalidId);
      expect(data).toBeUndefined();
      expect(mockPrismaService.note.findUnique).toBeCalledWith({
        where: { id: invalidId },
      });
      expect(mockPrismaService.note.findUnique).toBeCalledTimes(1);
    });
  });
  describe('add', () => {
    it('should return a successfully created note when valid data is provided', async () => {
      const noteBody = {
        title: 'any',
        description: 'any',
        hasFavorited: true,
      };
      const fakeNote = createFakeNote(noteBody);
      mockPrismaService.note.create.mockResolvedValue(fakeNote);
      const data = await service.add(noteBody);

      expect(data).toEqual(fakeNote);
      expect(mockPrismaService.note.create).toBeCalledWith({
        data: noteBody,
      });
      expect(mockPrismaService.note.create).toBeCalledTimes(1);
    });
  });
  describe('update', () => {
    it('should return an updated note when a valid id and data are provided', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any',
        hasFavorited: false,
      });
      const validBodies = [
        { title: 'any_updated' },
        { description: 'any_updated' },
        { hasFavorited: true },
        { color: 'any_updated' },
        { description: 'any_updated', hasFavorited: false },
      ];

      mockPrismaService.note.findUnique.mockResolvedValue(fakeNote);

      for (const body of validBodies) {
        const fakeNoteUpdated = { ...fakeNote, ...body };
        mockPrismaService.note.update.mockResolvedValue(fakeNoteUpdated);
        const data = await service.update(fakeNote.id, body);

        expect(data).toEqual(fakeNoteUpdated);
        expect(mockPrismaService.note.findUnique).toBeCalledWith({
          where: { id: fakeNote.id },
        });
        expect(mockPrismaService.note.update).toBeCalledWith({
          where: { id: fakeNote.id },
          data: body,
        });
      }

      expect(mockPrismaService.note.findUnique).toBeCalledTimes(
        validBodies.length,
      );
      expect(mockPrismaService.note.update).toBeCalledTimes(validBodies.length);
    });
    it('should return undefined when attempting to update a non-existent note by id', async () => {
      const invalidId = 'invalid_id';
      mockPrismaService.note.findUnique.mockResolvedValue(undefined);
      const data = await service.update(invalidId, { description: 'valid' });

      expect(data).toBeUndefined();
      expect(mockPrismaService.note.findUnique).toBeCalledWith({
        where: { id: invalidId },
      });
      expect(mockPrismaService.note.findUnique).toBeCalledTimes(1);
      expect(mockPrismaService.note.update).toBeCalledTimes(0);
    });
  });
  describe('remove', () => {
    it('should return the deleted note when a valid id is provided', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any',
        hasFavorited: false,
      });
      mockPrismaService.note.findUnique.mockResolvedValue(fakeNote);
      mockPrismaService.note.delete.mockResolvedValue(fakeNote);
      const data = await service.remove(fakeNote.id);
      expect(data).toEqual(fakeNote);
      expect(mockPrismaService.note.findUnique).toBeCalledWith({
        where: { id: fakeNote.id },
      });
      expect(mockPrismaService.note.delete).toBeCalledWith({
        where: { id: fakeNote.id },
      });
      expect(mockPrismaService.note.findUnique).toBeCalledTimes(1);
      expect(mockPrismaService.note.delete).toBeCalledTimes(1);
    });
    it('should return undefined when attempting to delete a non-existent note by id', async () => {
      const invalidId = 'invalid_id';
      mockPrismaService.note.findUnique.mockResolvedValue(undefined);
      const data = await service.remove(invalidId);

      expect(data).toBeUndefined();
      expect(mockPrismaService.note.findUnique).toBeCalledWith({
        where: { id: invalidId },
      });
      expect(mockPrismaService.note.findUnique).toBeCalledTimes(1);
      expect(mockPrismaService.note.delete).toBeCalledTimes(0);
    });
  });
});
