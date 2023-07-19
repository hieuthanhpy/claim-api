import { ApiProperty } from '@nestjs/swagger';

export class ClaimUpload {
  @ApiProperty()
  claimId: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
