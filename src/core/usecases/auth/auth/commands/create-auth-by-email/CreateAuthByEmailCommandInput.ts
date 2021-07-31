import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateAuthByEmailCommandInput {
    @IsUUID()
    userId: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
