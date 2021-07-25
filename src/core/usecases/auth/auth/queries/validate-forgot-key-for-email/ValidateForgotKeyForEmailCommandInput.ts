import { IsEmail, IsString } from 'class-validator';

export class ValidateForgotKeyForEmailCommandInput {
    @IsEmail()
    email: string;

    @IsString()
    forgotKey: string;
}
