import { IsEmail, IsOptional, IsString } from '@shared/decorators/ValidationDecorator';

export class CreateManagerInput {
    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
