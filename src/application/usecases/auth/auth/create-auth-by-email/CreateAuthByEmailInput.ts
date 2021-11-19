import { IsEmail, IsString, IsUUID, Length } from 'shared/decorators/ValidationDecorator';

export class CreateAuthByEmailInput {
    @IsUUID()
    userId: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(6, 20)
    password: string;
}
