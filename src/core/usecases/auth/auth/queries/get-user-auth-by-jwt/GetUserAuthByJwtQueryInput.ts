import { IsJWT } from 'class-validator';

export class GetUserAuthByJwtQueryInput {
    @IsJWT()
    token: string;
}
