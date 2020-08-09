import { IJwtPayload } from './IJwtPayload';

export interface IJwtPayloadExtend extends IJwtPayload {
    roleId: number;
}
