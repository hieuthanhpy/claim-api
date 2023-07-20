import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClaimsFilters {
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
