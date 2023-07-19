import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadEntity } from './file-upload.entity';
import { ClaimEntity } from 'src/claim/claim.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileUploadEntity, ClaimEntity])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
