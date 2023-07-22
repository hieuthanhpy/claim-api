import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PoliciesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  policyNumber: string;

  @Column()
  idCardNumber: string;

  @Column()
  effectiveDate: string;

  @Column()
  expiryDate: string;

  @Column()
  issueDate: string;

  @Column()
  groupName: string;

  @Column()
  planCode: string;

  @Column()
  sequenceNumber: string;

  @Column()
  fullName: string;

  @Column()
  dob: string;

  @Column()
  insuredEffDate: string;

  @Column()
  insuredExpDate: string;

  @Column()
  insuredSI: string;

  @Column()
  currencyCode: string;

  @Column()
  polExchangeRate: string;
}
@Entity()
export class BenefitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  policyNumber: string;

  @Column()
  endoNo: string;

  @Column()
  effectiveDate: string;

  @Column()
  expiryDate: string;

  @Column()
  issueDate: string;

  @Column()
  groupName: string;

  @Column()
  planCode: string;

  @Column()
  coverageCode: string;

  @Column()
  coverageName: string;

  @Column()
  subCoverageCode: string;

  @Column()
  subCoverageName: string;

  @Column()
  limit: string;

  @Column({
    default: 0,
  })
  adjusted: number;

  @Column({
    default: 0,
  })
  deductible: number;

  @Column({
    default: 0,
    type: 'float',
  })
  copay: number;

  @Column({
    default: 0,
    type: 'float',
  })
  punishment: number;

  @Column()
  remainInsured: string;
}
