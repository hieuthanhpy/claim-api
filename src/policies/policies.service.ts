import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BENEFITS, insuredList } from './policies.data';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitEntity, PoliciesEntity } from './policies.entity';
import { Brackets, Repository } from 'typeorm';
import {
  FilterPolicies,
  PolicyDetail,
} from './models/filter-policies/filter-policies';
import { paginate } from 'nestjs-typeorm-paginate';

export type Policies = any;

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(PoliciesEntity)
    private policiesRepository: Repository<PoliciesEntity>,
    @InjectRepository(BenefitEntity)
    private benefitRepository: Repository<BenefitEntity>,
  ) {}

  private readonly policies = insuredList;
  private readonly benefits = BENEFITS;
  async findAll(filter: FilterPolicies): Promise<Policies | undefined> {
    try {
      const { keyword, sortBy, sortDir, page, limit } = filter;

      const queryBuilder =
        this.policiesRepository.createQueryBuilder('policies_entity');

      /* Search by Policy No, Full Name, Group or ID Card... */
      if (keyword) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.orWhere('policies_entity.policyNumber LIKE :keyword', {
              keyword: `%${keyword}%`,
            })
              .orWhere('policies_entity.fullName LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('policies_entity.groupName LIKE :keyword', {
                keyword: `%${keyword}%`,
              })
              .orWhere('policies_entity.idCardNumber LIKE :keyword', {
                keyword: `%${keyword}%`,
              });
          }),
        );
      }

      /* Sort and order */
      if (sortBy && sortDir) {
        sortDir.toUpperCase() === 'DESC'
          ? queryBuilder.orderBy(`policies_entity.${sortBy}`, 'DESC')
          : queryBuilder.orderBy(`policies_entity.${sortBy}`, 'ASC');
      }

      /* Paginating if have page and limit parameters */
      if (page && limit) {
        return await paginate<Policies>(queryBuilder, { page, limit });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPolicy(filter: PolicyDetail): Promise<Policies | null> {
    try {
      const policy = await this.policiesRepository.findOneBy({
        idCardNumber: filter.idCardNumber,
        policyNumber: filter.policyNumber,
      });

      if (!policy) {
        throw new NotFoundException('not found policy');
      }

      const benefits = await this.benefitRepository.find({
        where: {
          policyNumber: policy.policyNumber,
        },
      });

      return { ...policy, benefits: benefits };
    } catch (error) {
      throw new NotFoundException('not found policy');
    }
  }

  async importPolicies(): Promise<boolean> {
    this.policies.INSUREDLIST.forEach((x) => {
      const policy = new PoliciesEntity();
      policy.policyNumber = x.POLICY_NO;
      policy.idCardNumber = x.ID_CARD_NUMBER;
      policy.effectiveDate = x.EFFECTIVE_DATE;
      policy.expiryDate = x.EXPIRY_DATE;
      policy.issueDate = x.ISSUE_DATE;
      policy.groupName = x.GROUP_NAME;
      policy.planCode = x.PLAN_CODE;
      policy.sequenceNumber = x.SEQUENCE_NUMBER;
      policy.fullName = x.FULL_NAME;
      policy.dob = x.DATE_OF_BIRTH;
      policy.insuredEffDate = x.INSURED_EFF_DATE;
      policy.insuredExpDate = x.INSURED_EXP_DATE;
      policy.insuredSI = x.INSURED_SI;
      policy.currencyCode = x.CURRENCY_CODE;
      policy.polExchangeRate = x.POL_EXCHANGE_RATE;

      this.policiesRepository.save(policy);
    });

    this.benefits.forEach((x) => {
      const benefit = new BenefitEntity();
      benefit.policyNumber = x.POLICY_NO;
      benefit.endoNo = x.ENDO_NO;
      benefit.effectiveDate = x.EFFECTIVE_DATE;
      benefit.expiryDate = x.EXPIRY_DATE;
      benefit.issueDate = x.ISSUE_DATE;
      benefit.issueDate = x.ISSUE_DATE;
      benefit.groupName = x.GROUP_NAME;
      benefit.planCode = x.PLAN_CODE;
      benefit.coverageCode = x.COVERAGE_CODE;
      benefit.coverageName = x.COVERAGE_NAME;
      benefit.subCoverageCode = x.SUB_COVERAGE_CODE;
      benefit.subCoverageName = x.SUB_COVERAGE_NAME;
      benefit.limit = x.LIMIT;
      benefit.remainInsured = x.LIMIT;

      this.benefitRepository.save(benefit);
    });
    return true;
  }
}
