import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  Body,
  Param,
  Get,
  Res,
  StreamableFile,
  NotFoundException,
  Query,
  Delete,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { ClaimUpload } from './models/claim-upload/claim-upload';
import { Response } from 'express';
import { FilterFile } from './models/filter-file/filter-file';

@ApiTags('File')
@Controller('api/file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  async getPolicies(@Query() query: FilterFile) {
    return await this.fileService.findAll(query);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: ClaimUpload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.uploadFileClaim(body, file);
  }

  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.fileService.deleteFile(id);
  }

  @Get('download/:fileId')
  async downloadFile(
    @Param('fileId') fileId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const fileDownload = await this.fileService.downloadFile(fileId);
    if (fileDownload == null) {
      throw new NotFoundException('File not found');
    }

    res.set({
      'Content-Type': fileDownload.mimeType,
    });

    return new StreamableFile(fileDownload.file);
  }
}
