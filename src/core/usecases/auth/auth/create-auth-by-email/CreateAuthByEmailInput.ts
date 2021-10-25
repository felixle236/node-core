import { IsEmail, IsString, IsUUID } from '@shared/decorators/ValidationDecorator';

export class CreateAuthByEmailInput {
    @IsUUID()
    userId: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
