import { IsEmail } from 'class-validator';

export class ResendActivationCommandInput {
    @IsEmail()
    email: string;
}
