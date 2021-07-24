import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordByEmailCommandInput {
    @IsString()
    forgotKey: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
