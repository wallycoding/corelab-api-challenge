import { Test, TestingModule } from '@nestjs/testing';
import { NoteController } from './note.controller';
import { NoteService } from '../services/note.service';
import { createFakeNote } from '../test-utils/note.utils';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const createMockNoteService = () => ({
  getMany: jest.fn(),
  getById: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('NoteController', () => {
  let controller: NoteController;
  const mockNoteRepository = createMockNoteService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [NoteService],
    })
      .overrideProvider(NoteService)
      .useValue(mockNoteRepository)
      .compile();

    controller = module.get<NoteController>(NoteController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMany', () => {
    it('should return an empty array when there are no notes', async () => {
      mockNoteRepository.getMany.mockResolvedValue([]);
      const data = await controller.getMany({});
      expect(Array.isArray(data)).toBeTruthy();
      expect(data).toHaveLength(0);
      expect(mockNoteRepository.getMany).toBeCalledTimes(1);
    });
    it('should return a note from the when notes exist', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any_color',
        hasFavorited: false,
      });
      mockNoteRepository.getMany.mockResolvedValue([fakeNote]);
      const data = await controller.getMany({});
      expect(Array.isArray(data)).toBeTruthy();
      expect(data).toHaveLength(1);
      expect(data).toEqual([fakeNote]);
      expect(mockNoteRepository.getMany).toBeCalledTimes(1);
    });
    it("should return a 'bad request' when passing invalid page", async () => {
      const errorData = await controller
        .getMany({ page: 'invalid_data' })
        .catch((err) => err);
      expect(errorData instanceof BadRequestException).toBeTruthy();
      expect(mockNoteRepository.getMany).toBeCalledTimes(0);
    });

    it('should return 3 items per pagination in descending order', async () => {
      const ITEMS_PER_PAGE = 3;
      const allFakeNotes = Array.from({ length: 9 }, (_, i) =>
        createFakeNote({
          title: 'any',
          description: `Item(${i + 1})`,
          color: 'any_color',
          hasFavorited: false,
        }),
      );
      for (let i = 0; i < 3; i++) {
        const itemsPerPage = allFakeNotes.slice(
          i * ITEMS_PER_PAGE,
          i * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
        );
        mockNoteRepository.getMany.mockResolvedValue(itemsPerPage);
        const data = await controller.getMany({
          page: i + 1,
          target: 'unfavorite',
        });
        expect(Array.isArray(data)).toBeTruthy();
        expect(data).toHaveLength(3);
        expect(data).toEqual(itemsPerPage);
        expect(mockNoteRepository.getMany).toBeCalledWith(
          i + 1,
          expect.any(Number),
          false,
        );
        expect(mockNoteRepository.getMany).toBeCalledTimes(i + 1);
      }
    });
  });
  describe('getById', () => {
    it('should return an existing note when a valid id is provided', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any_color',
        hasFavorited: false,
      });
      mockNoteRepository.getById.mockResolvedValue(fakeNote);

      const data = await controller.getById({ id: fakeNote.id });

      expect(data).toEqual(fakeNote);
      expect(mockNoteRepository.getById).toBeCalledWith(fakeNote.id);
      expect(mockNoteRepository.getById).toBeCalledTimes(1);
    });
    it('should return undefined when attempting to access a non-existent note by id', async () => {
      const invalidId = 'invalid_id';
      const errorData = await controller
        .getById({ id: invalidId })
        .catch((err) => err);

      expect(errorData instanceof NotFoundException);
      expect(mockNoteRepository.getById).toBeCalledWith(invalidId);
      expect(mockNoteRepository.getById).toBeCalledTimes(1);
    });
  });
  describe('add', () => {
    it('should return a successfully created note when valid data is provided', async () => {
      const noteBody = {
        title: 'any',
        description: 'any',
        color: 'any_color',
        hasFavorited: false,
      };
      const fakeNote = createFakeNote(noteBody);
      mockNoteRepository.add.mockResolvedValue(fakeNote);
      const data = await controller.add(noteBody);

      expect(data).toEqual(fakeNote);
      expect(mockNoteRepository.add).toBeCalledWith(noteBody);
      expect(mockNoteRepository.add).toBeCalledTimes(1);
    });
  });
  describe('update', () => {
    it('should return an updated note when a valid id and data are provided', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any_color',
        hasFavorited: false,
      });
      const validBodies = [
        { title: 'any_updated' },
        { description: 'any_updated' },
        { hasFavorited: true },
        { color: 'any_updated' },
        { description: 'any_updated', hasFavorited: false },
      ];

      for (const body of validBodies) {
        const fakeNoteUpdated = { ...fakeNote, ...validBodies };
        mockNoteRepository.update.mockResolvedValue(fakeNoteUpdated);
        const data = await controller.update({ id: fakeNote.id }, body);

        expect(data).toEqual(fakeNoteUpdated);
        expect(mockNoteRepository.update).toBeCalledWith(fakeNote.id, body);
      }

      expect(mockNoteRepository.update).toBeCalledTimes(validBodies.length);
    });
    it('should return undefined when attempting to update a non-existent note by id', async () => {
      const invalidId = 'invalid_id';
      const body = {
        title: 'any',
        description: 'any',
        color: 'any_color',
        hasFavorited: false,
      };
      const errorData = await controller
        .update({ id: invalidId }, body)
        .catch((err) => err);

      expect(errorData instanceof NotFoundException);
      expect(mockNoteRepository.update).toBeCalledTimes(1);
      expect(mockNoteRepository.update).toBeCalledWith(invalidId, body);
    });
  });
  describe('remove', () => {
    it('should return the deleted note when a valid id is provided', async () => {
      const fakeNote = createFakeNote({
        title: 'any',
        description: 'any',
        color: 'any_color',
        hasFavorited: false,
      });
      mockNoteRepository.remove.mockResolvedValue(fakeNote);
      const data = await controller.remove({ id: fakeNote.id });

      expect(data).toEqual(fakeNote);
      expect(mockNoteRepository.remove).toBeCalledWith(fakeNote.id);
      expect(mockNoteRepository.remove).toBeCalledTimes(1);
    });
    it('should return undefined when attempting to delete a non-existent note by id', async () => {
      const invalidId = 'invalid_id';
      const errorData = await controller
        .remove({ id: invalidId })
        .catch((err) => err);
      expect(errorData instanceof NotFoundException);
      expect(mockNoteRepository.remove).toBeCalledTimes(1);
      expect(mockNoteRepository.remove).toBeCalledWith(invalidId);
    });
  });
});
