import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClaimService } from './claim.service';
import { ApproveClaim, Claim, ClaimFilter, UpdateClaim } from './claim.model';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Claim')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('api/claim')
export class ClaimController {
  constructor(private claimService: ClaimService) {}

  @Get()
  async getClaims() {
    return this.claimService.getClaims();
  }

  @Get('history')
  async getClaimHistories(@Param() query: ClaimFilter) {
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

  @Post('approve')
  async approveRejectClaim(@Body() body: ApproveClaim) {
    return this.claimService.approveClaim(body);
  }

  @Put()
  async updateClaim(@Body() body: UpdateClaim) {
    return this.claimService.updateClaim(body);
  }
}
