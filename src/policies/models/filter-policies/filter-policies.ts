import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FilterPolicies {
  @ApiPropertyOptional({
    description: ' Search by Policy No, Full Name, Group or ID Card...',
  })
  keyword: string;

  @ApiPropertyOptional()
  @ApiProperty({ description: 'The page index', required: false, default: 1 })
  page?: number;

  @ApiPropertyOptional()
  @ApiProperty({
    description: 'The size per page',
    default: 10,
  })
  limit?: number;

  @ApiPropertyOptional()
  sortDir?: 'asc' | 'desc ';

  @ApiPropertyOptional({
    default: 'policyNumber',
  })
  sortBy: string;
}

export class PolicyDetail {
  @ApiPropertyOptional()
  @ApiProperty({ description: 'Policy Number' })
  policyNumber?: string;

  @ApiPropertyOptional()
  @ApiProperty({ description: 'Policy Number' })
  idCardNumber?: string;
}
