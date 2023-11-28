import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { NoteRepository } from 'src/modules/note/domain/repositories/note.repository';
import { createFakeNote } from 'src/modules/note/test-utils/note.utils';

const createMockNoteRepository = () => ({
  getMany: jest.fn(),
  getById: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const mockNoteRepository = createMockNoteRepository();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(null)
      .overrideProvider(NoteRepository)
      .useValue(mockNoteRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /notes/list', () => {
    it('should return an empty array when there are no notes', () => {
      mockNoteRepository.getMany.mockResolvedValue([]);
      return request(app.getHttpServer())
        .get('/notes/list')
        .expect(200)
        .expect('[]');
    });
    it('should return a note from the list when notes exist', async () => {
      const fakeNote = createFakeNote(
        {
          title: 'any',
          description: 'any',
          color: 'any_color',
          hasFavorited: false,
        },
        true,
      );
      mockNoteRepository.getMany.mockResolvedValue([fakeNote]);
      const response = await request(app.getHttpServer()).get('/notes/list');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([fakeNote]);
    });

    it("should return a 'bad request' when passing invalid page", () => {
      return request(app.getHttpServer())
        .get('/notes/list?page=invalid_query')
        .expect(400);
    });

    it('should return 3 items per pagination in descending order', async () => {
      const ITEMS_PER_PAGE = 3;
      const allFakeNotes = Array.from({ length: 9 }, (_, i) =>
        createFakeNote(
          {
            title: 'any',
            description: `Item(${i + 1})`,
            color: 'any_color',
            hasFavorited: false,
          },
          true,
        ),
      );
      for (let i = 0; i < 3; i++) {
        const itemsPerPage = allFakeNotes.slice(
          i * ITEMS_PER_PAGE,
          i * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
        );
        mockNoteRepository.getMany.mockResolvedValue(itemsPerPage);
        const response = await request(app.getHttpServer()).get(
          `/notes/list?page=${i + 1}`,
        );

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body).toEqual(itemsPerPage);
        expect(mockNoteRepository.getMany).toBeCalledWith(
          i + 1,
          expect.any(Number),
          false,
        );
        expect(mockNoteRepository.getMany).toBeCalledTimes(i + 1);
      }
    });
  });

  describe('GET /notes/:id', () => {
    it('should return an existing note when a valid id is provided', async () => {
      const fakeNote = createFakeNote(
        {
          title: 'any',
          description: 'any',
          color: 'any_color',
          hasFavorited: false,
        },
        true,
      );
      mockNoteRepository.getById.mockResolvedValue(fakeNote);
      const response = await request(app.getHttpServer()).get(
        `/notes/${fakeNote.id}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(fakeNote);
    });
    it("should return 'not found' when attempting to access a non-existent note by id", () => {
      return request(app.getHttpServer()).get('/notes/invalid_id').expect(404);
    });
  });

  describe('POST /notes/add', () => {
    it('should return a successfully created note when valid data is provided', async () => {
      const noteBody = {
        title: 'any',
        description: 'any',
        color: 'any_color',
        hasFavorited: false,
      };
      const fakeNote = createFakeNote(noteBody, true);
      mockNoteRepository.add.mockResolvedValue(fakeNote);
      const response = await request(app.getHttpServer())
        .post('/notes/add')
        .send(noteBody);
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(fakeNote);
    });
    it('should fail to create a note when incorrect data is passed', async () => {
      const failBodies = [{ content: 'any' }, { done: false }, {}];
      for (const body of failBodies) {
        const response = await request(app.getHttpServer())
          .post('/notes/add')
          .send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });

  describe('PATCH /notes/:id', () => {
    it('should return an updated note when a valid id and data are provided', async () => {
      const fakeNote = createFakeNote(
        {
          title: 'any',
          description: 'any',
          color: 'any_color',
          hasFavorited: false,
        },
        true,
      );
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
        const response = await request(app.getHttpServer())
          .patch('/notes/valid_id')
          .send(body);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(fakeNoteUpdated);
      }
    });
    it("should return 'not found' when attempting to update a non-existent note by id", async () => {
      return request(app.getHttpServer())
        .patch('/notes/invalid_id')
        .send({
          title: 'any',
          description: 'any',
          color: 'any_color',
          hasFavorited: false,
        })
        .expect(404);
    });
    it('should fail to update a note when incorrect data is passed', async () => {
      const fakeNote = createFakeNote(
        {
          title: 'any',
          description: 'any',
          color: 'any_color',
          hasFavorited: false,
        },
        true,
      );
      mockNoteRepository.update.mockResolvedValue(fakeNote);
      return request(app.getHttpServer())
        .patch(`/notes/${fakeNote.id}`)
        .send({})
        .expect(400);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should return the deleted note when a valid id is provided', async () => {
      const fakeNote = createFakeNote(
        {
          title: 'any',
          description: 'any',
          color: 'any_color',
          hasFavorited: false,
        },
        true,
      );
      mockNoteRepository.remove.mockResolvedValue(fakeNote);
      const response = await request(app.getHttpServer()).delete(
        `/notes/${fakeNote.id}`,
      );
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(fakeNote);
    });
    it("should return 'not found' when attempting to delete a non-existent note by id", async () => {
      return request(app.getHttpServer())
        .delete('/notes/invalid_id')
        .expect(404);
    });
  });
});
