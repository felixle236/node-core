import { IsEmail } from 'class-validator';

export class ForgotPasswordByEmailCommandInput {
    @IsEmail()
    email: string;
}
