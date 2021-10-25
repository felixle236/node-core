import { IsEmail, IsString } from '@shared/decorators/ValidationDecorator';

export class LoginByEmailInput {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
