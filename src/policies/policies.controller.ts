import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  FilterPolicies,
  PolicyDetail,
} from './models/filter-policies/filter-policies';

@ApiTags('Policies')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('api/policies')
export class PoliciesController {
  constructor(private policiesService: PoliciesService) {}

  @Get()
  async getPolicies(@Query() query: FilterPolicies) {
    return await this.policiesService.findAll(query);
  }

  @Get('one')
  async getPolicyByPolicyNumberAndIdCardNumber(@Query() query: PolicyDetail) {
    return await this.policiesService.getPolicy(query);
  }

  @Post('import')
  async importPolicies() {
    return await this.policiesService.importPolicies();
  }
}
