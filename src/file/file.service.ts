import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClaimUpload } from './models/claim-upload/claim-upload';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { FileUploadEntity } from './file-upload.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDownload } from './models/file-download/file-download';
import { FilterFile } from './models/filter-file/filter-file';
import { ClaimEntity } from 'src/claim/claim.entity';

export type FileUpload = any;

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileUploadEntity)
    private fileUploadRepository: Repository<FileUploadEntity>,
    @InjectRepository(ClaimEntity)
    private claimRepo: Repository<ClaimEntity>,
  ) {}

  async findAll(filter: FilterFile): Promise<FileUpload | undefined> {
    return this.fileUploadRepository.find({
      where: {
        relationId: filter.relationId,
      },
    });
  }

  async uploadFileClaim(
    body: ClaimUpload,
    file: Express.Multer.File,
  ): Promise<ClaimEntity> {
    const myuuid = uuidv4();
    const dirname = __dirname + '/upload';
    if (!existsSync(dirname)) {
      mkdirSync(dirname);
    }
    const fileName = myuuid + '_' + file.originalname;
    const filePath = dirname + '/' + fileName;
    const ws = createWriteStream(filePath);
    ws.write(file.buffer);

    const fileUploadEntity = new FileUploadEntity();
    fileUploadEntity.id = myuuid;
    fileUploadEntity.fileName = fileName;
    fileUploadEntity.mimeType = file.mimetype;
    fileUploadEntity.relationType = 'Claim';
    fileUploadEntity.relationId = body.claimId;
    fileUploadEntity.fileType = body.type;

    return this.fileUploadRepository
      .save(fileUploadEntity)
      .then((file) => this.updateClaimAttachment(body.claimId, file));
  }

  async updateClaimAttachment(claimId: string, file: FileUploadEntity) {
    const claim = await this.claimRepo.findOne({
      where: {
        claimId,
      },
    });

    if (!claim) throw new NotFoundException('not found claim');

    const data = JSON.parse(claim.data);
    const currentAttachments = data.attachments;
    currentAttachments.files.push(file);

    if (
      ['Giấy xuất viện', 'Giấy nhập viện', 'Hoá đơn'].every((type) => {
        return currentAttachments.files.some((file) => file.fileType === type);
      })
    ) {
      currentAttachments.status = 'Đã đủ hồ sơ';
    } else {
      currentAttachments.status = 'Cần bổ sung hồ sơ';
    }

    return await this.claimRepo
      .save({
        ...claim,
        data: JSON.stringify(data),
      })
      .then((claim) => {
        const transfer = { ...claim, data: JSON.parse(claim.data) };
        return transfer;
      });
  }

  async downloadFile(fileId: string): Promise<FileDownload> {
    const fileEntity = await this.fileUploadRepository.findOne({
      where: {
        id: fileId,
      },
    });

    const dirname = __dirname + '/upload';
    if (fileEntity == null) {
      return null;
    }

    const filePath = dirname + '/' + fileEntity.fileName;
    const file = createReadStream(filePath);

    const fileDownload = new FileDownload();
    fileDownload.mimeType = fileEntity.mimeType;
    fileDownload.file = file;
    return fileDownload;
  }

  async deleteFile(fileId: string): Promise<ClaimEntity> {
    const file = await this.fileUploadRepository.findOne({
      where: {
        id: fileId,
      },
    });

    if (!file) throw new NotFoundException('not found file');

    return await this.fileUploadRepository
      .delete(file)
      .then(() => this.deleteClaimAttachment(file.relationId, file))
      .then((claim) => ({ ...claim, data: JSON.parse(claim.data) }));
  }

  async deleteClaimAttachment(claimId: string, file: FileUploadEntity) {
    const claim = await this.claimRepo.findOne({
      where: {
        claimId,
      },
    });

    if (!claim) throw new NotFoundException('not found claim');

    const data = JSON.parse(claim.data);
    const currentAttachments = data.attachments;
    currentAttachments.files = currentAttachments.files.filter(
      (attachFile) => attachFile.id !== file.id,
    );

    if (
      ['Giấy xuất viện', 'Giấy nhập viện', 'Hoá đơn'].every((type) => {
        return currentAttachments.files.some((file) => file.fileType === type);
      })
    ) {
      currentAttachments.status = 'Đã đủ hồ sơ';
    } else {
      currentAttachments.status = 'Cần bổ sung hồ sơ';
    }

    return await this.claimRepo.save({
      ...claim,
      data: JSON.stringify(data),
    });
  }
}
