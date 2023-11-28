import { Module } from '@nestjs/common';
import { NoteService } from './services/note.service';
import { NoteController } from './controllers/note.controller';
import { NoteRepository } from './domain/repositories/note.repository';
import { PrismaAdapter } from './data/adapters/prisma/prisma.adapter';

@Module({
  controllers: [NoteController],
  providers: [
    NoteService,
    {
      provide: NoteRepository,
      useClass: PrismaAdapter,
    },
  ],
})
export class NoteModule {}
