import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimEntity } from './claim.entity';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';
import { BenefitEntity } from 'src/policies/policies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClaimEntity, BenefitEntity])],
  controllers: [ClaimController],
  providers: [ClaimService],
})
export class ClaimModule {}
