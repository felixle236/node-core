import { IsEmail, IsString } from '@shared/decorators/ValidationDecorator';

export class ValidateForgotKeyForEmailInput {
    @IsEmail()
    email: string;

    @IsString()
    forgotKey: string;
}
