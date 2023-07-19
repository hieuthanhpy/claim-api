import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClaimEntity, ClaimStatus } from './claim.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApproveClaim, Claim, ClaimFilter, UpdateClaim } from './claim.model';
import { BenefitEntity } from 'src/policies/policies.entity';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private claimRepo: Repository<ClaimEntity>,
    @InjectRepository(BenefitEntity)
    private benefitRepo: Repository<BenefitEntity>,
  ) {}

  async getClaims(): Promise<Claim[] | undefined> {
    try {
      const claims = await this.claimRepo.find();

      if (!claims) throw new NotFoundException('not found claim');

      return claims.map((item) => ({ ...item, data: JSON.parse(item.data) }));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getClaimByClaimId(claimId: string): Promise<Claim | undefined> {
    try {
      const claim = await this.claimRepo.findOne({
        where: {
          claimId,
        },
      });

      if (!claim) throw new NotFoundException('not found claim');

      return { ...claim, data: JSON.parse(claim.data) };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getClaimHistories(filter: ClaimFilter): Promise<Claim[] | undefined> {
    try {
      const queryBuilder = this.claimRepo.createQueryBuilder('claim');

      queryBuilder.where({
        idCardNumber: filter?.idCardNumber,
        policyNumber: filter?.policyNumber,
      });

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createClaim(claim: Claim): Promise<ClaimEntity | undefined> {
    try {
      const claimId = 'ITC_CLAIM_' + new Date().getTime();

      return this.claimRepo
        .save({
          claimId: claimId,
          data: JSON.stringify(claim.data),
          status: ClaimStatus.INCOMPLETE,
          policyNumber: claim.policyNumber,
          idCardNumber: claim.idCardNumber,
        })
        .then((claim) => ({ ...claim, data: JSON.parse(claim.data) }));
    } catch (error) {
      throw new NotFoundException('not found claim');
    }
  }

  async approveClaim({
    claimId,
    status,
    benefits,
  }: ApproveClaim): Promise<ClaimEntity | undefined> {
    try {
      const claim = await this.claimRepo.findOneBy({ claimId: claimId });

      if (!claim) {
        throw new NotFoundException('not found claim');
      } else {
        benefits.forEach(
          async (item: BenefitEntity & { initialReserve: number }) => {
            const benefit = await this.benefitRepo.findOneBy({
              policyNumber: item.policyNumber,
              subCoverageCode: item.subCoverageCode,
            });

            if (benefit) {
              await this.benefitRepo.save({
                ...benefit,
                remainInsured: (
                  parseInt(benefit.remainInsured) - item.initialReserve
                ).toString(),
              });
            }
          },
        );

        return this.claimRepo
          .save({ ...claim, status: status })
          .then((claim) => ({ ...claim, data: JSON.parse(claim.data) }));
      }
    } catch (error) {
      console.log('error', error);
      throw new NotFoundException('not found claim');
    }
  }

  async updateClaim(body: UpdateClaim): Promise<ClaimEntity | undefined> {
    try {
      const claim = await this.claimRepo.findOneBy({ claimId: body.claimId });

      if (!claim) {
        throw new NotFoundException('not found claim');
      }

      return this.claimRepo
        .save({ ...claim, data: JSON.stringify(body.data) })
        .then((claim) => ({ ...claim, data: JSON.parse(claim.data) }));
    } catch (error) {
      throw new NotFoundException('not found claim');
    }
  }
}
