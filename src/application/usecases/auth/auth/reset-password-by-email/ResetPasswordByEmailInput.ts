import { IsEmail, IsString, Length, MinLength } from 'shared/decorators/ValidationDecorator';

export class ResetPasswordByEmailInput {
    @IsString()
    @MinLength(64)
    forgotKey: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 20)
    password: string;
}
