import { Module } from '@nestjs/common';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitEntity, PoliciesEntity } from './policies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoliciesEntity, BenefitEntity])],
  controllers: [PoliciesController],
  providers: [PoliciesService],
})
export class PoliciesModule {}
