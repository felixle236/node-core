import { IsEmail, IsString } from 'class-validator';

export class ValidateForgotKeyForEmailCommandInput {
    @IsString()
    forgotKey: string;

    @IsEmail()
    email: string;
}
