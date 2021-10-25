import { IsEmail, IsString } from '@shared/decorators/ValidationDecorator';

export class ResetPasswordByEmailInput {
    @IsString()
    forgotKey: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
