import { IJwtPayloadExtend } from '../models/authentication/IJwtPayloadExtend';
import { User } from '../../domain/entities/User';

export interface IAuthenticationService {
    sign(user: User): string;

    verify(token: string): IJwtPayloadExtend;
}
