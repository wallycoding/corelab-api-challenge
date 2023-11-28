export interface NoteEntity {
  id: string;
  title: String;
  description: String;
  color: String;
  hasFavorited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
