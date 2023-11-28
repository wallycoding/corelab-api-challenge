import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { NoteModule } from './modules/note/note.module';

@Module({
  imports: [PrismaModule, NoteModule],
})
export class AppModule {}
