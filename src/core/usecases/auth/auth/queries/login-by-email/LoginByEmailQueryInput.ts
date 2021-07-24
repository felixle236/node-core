import { IsEmail, IsString } from 'class-validator';

export class LoginByEmailQueryInput {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
