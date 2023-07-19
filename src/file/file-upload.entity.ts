import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class FileUploadEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  mimeType: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  relationType: string;

  @Column()
  relationId: string;
}
