import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ClaimStatus {
  PENDING = 'PENDING',
  INCOMPLETE = 'INCOMPLETE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
@Entity()
export class ClaimEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  data: string;

  @Column()
  status: ClaimStatus;

  @Column()
  claimId: string;

  @Column()
  policyNumber: string;

  @Column()
  idCardNumber: string;
}
