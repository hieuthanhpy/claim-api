import { ApiProperty } from '@nestjs/swagger';
import { ClaimStatus } from './claim.entity';

export class Claim {
  @ApiProperty()
  data: string;

  @ApiProperty()
  policyNumber: string;

  @ApiProperty()
  idCardNumber: string;
}

export class UpdateStatusClaim {
  @ApiProperty()
  status: ClaimStatus;

  @ApiProperty()
  claimId: string;

  @ApiProperty()
  benefits: any;
}

export class UpdateClaim {
  @ApiProperty()
  data: string;

  @ApiProperty()
  claimId: string;
}

export class ClaimFilter {
  @ApiProperty()
  policyNumber: string;

  @ApiProperty()
  idCardNumber: string;
}
