import { IsEmail } from '@shared/decorators/ValidationDecorator';

export class ForgotPasswordByEmailInput {
    @IsEmail()
    email: string;
}
