import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClaimService } from './claim.service';
import {
  UpdateStatusClaim,
  Claim,
  ClaimFilter,
  UpdateClaim,
} from './claim.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { ClaimsFilters } from './model/claims-filters/claims-filters';

@ApiTags('Claim')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/claim')
export class ClaimController {
  constructor(private claimService: ClaimService) {}

  @Get()
  async getClaims(@Query() query: ClaimsFilters) {
    return this.claimService.getClaims(query);
  }

  @Get('history')
  async getClaimHistories(@Query() query: ClaimFilter) {
    return this.claimService.getClaimHistories(query);
  }

  @Get(':claimId')
  async getClaimByClaimId(@Param('claimId') claimId: string) {
    return this.claimService.getClaimByClaimId(claimId);
  }

  @Post()
  async generateClaim(@Body() body: Claim) {
    return this.claimService.createClaim(body);
  }

  @Post('status')
  async updateStatus(@Body() body: UpdateStatusClaim) {
    return this.claimService.updateStatus(body);
  }

  @Put()
  async updateClaim(@Body() body: UpdateClaim) {
    return this.claimService.updateClaim(body);
  }
}
