import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClaimEntity, ClaimStatus } from './claim.entity';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UpdateStatusClaim,
  Claim,
  ClaimFilter,
  UpdateClaim,
} from './claim.model';
import { BenefitEntity } from 'src/policies/policies.entity';
import { ContextService } from 'src/services/context';
import { Role } from 'src/users/users.enum';
import { ClaimsFilters } from './model/claims-filters/claims-filters';
import { paginate } from 'nestjs-typeorm-paginate';

export type Claims = any;
@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(ClaimEntity)
    private claimRepo: Repository<ClaimEntity>,
    @InjectRepository(BenefitEntity)
    private benefitRepo: Repository<BenefitEntity>,
    private contextService: ContextService,
  ) {}

  async getClaims(filter: ClaimsFilters): Promise<Claims | undefined> {
    try {
      const { keyword, sortBy, sortDir, page, limit } = filter;

      const queryBuilder = this.claimRepo.createQueryBuilder('claims_entity');

      /* Search by Policy No, Full Name, Group or ID Card... */
      if (keyword) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.orWhere('claims_entity.policyNumber LIKE :keyword', {
              keyword: `%${keyword}%`,
            })
              .orWhere('claims_entity.claimId LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('claims_entity.idCardNumber LIKE :keyword', {
                keyword: `%${keyword}%`,
              });
          }),
        );
      }

      /* Sort and order */
      if (sortBy && sortDir) {
        sortDir.toUpperCase() === 'DESC'
          ? queryBuilder.orderBy(`claims_entity.${sortBy}`, 'DESC')
          : queryBuilder.orderBy(`claims_entity.${sortBy}`, 'ASC');
      }

      /* Paginating if have page and limit parameters */
      if (page && limit) {
        return await paginate<Claims>(queryBuilder, { page, limit }).then(
          (value) => ({
            ...value,
            items: value.items.map((item) => ({
              ...item,
              data: JSON.parse(item.data),
            })),
          }),
        );
      }

      return await queryBuilder.getMany();
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
      const queryBuilder = this.claimRepo.createQueryBuilder('claim_entity');

      queryBuilder
        .where({
          idCardNumber: filter?.idCardNumber,
        })
        .andWhere({
          policyNumber: filter?.policyNumber,
        });

      return await queryBuilder
        .getMany()
        .then((claims) =>
          claims.map((item) => ({ ...item, data: JSON.parse(item.data) })),
        );
    } catch (error) {
      console.log('error', error);
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: this.contextService.role,
        })
        .then((claim) => ({
          ...claim,
          data: JSON.parse(claim.data),
        }));
    } catch (error) {
      throw new NotFoundException('not found claim');
    }
  }

  async updateStatus({
    claimId,
    status,
  }: UpdateStatusClaim): Promise<ClaimEntity | undefined> {
    try {
      const claim = await this.claimRepo.findOneBy({ claimId: claimId });

      if (!claim) {
        throw new NotFoundException('not found claim');
      } else {
        if (
          this.contextService.role !== Role.MANAGER &&
          [ClaimStatus.APPROVED, ClaimStatus.REJECTED].includes(status)
        ) {
          throw new NotFoundException(
            'User do not have permission for this action',
          );
        }

        status === ClaimStatus.APPROVED &&
          JSON.parse(claim.data).general.sumInsured.forEach(
            async (item: BenefitEntity & { finalInsuredClaim: number }) => {
              const benefit = await this.benefitRepo.findOneBy({
                policyNumber: item.policyNumber,
                subCoverageCode: item.subCoverageCode,
              });

              if (benefit) {
                await this.benefitRepo.save({
                  ...benefit,
                  remainInsured: (
                    parseInt(benefit.remainInsured) - item.finalInsuredClaim
                  ).toString(),
                });
              }
            },
          );

        return this.claimRepo
          .save({
            ...claim,
            status: status,
            updatedAt: new Date().toISOString(),
          })
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
