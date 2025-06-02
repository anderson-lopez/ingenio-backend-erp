import { IBranch } from 'src/modules/authentication/interfaces/branch.interface';
export interface JWTPayload {
  id: number;
  name: string;
  email: string;
  active: boolean;
  profiles: string[];
  permissions: string[];
  branchs: IBranch[];
}
