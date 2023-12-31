import { Role } from "src/users/users.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum ClaimStatus {
  PENDING = "PENDING",
  INCOMPLETE = "INCOMPLETE",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUBMITTED = "SUBMITTED",
}
@Entity()
export class ClaimEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "text",
  })
  data: string;

  @Column()
  status: ClaimStatus;

  @Column()
  claimId: string;

  @Column()
  policyNumber: string;

  @Column()
  idCardNumber: string;

  @Column()
  createdAt: string;

  @Column()
  createdBy: Role;

  @Column()
  updatedAt: string;
}
