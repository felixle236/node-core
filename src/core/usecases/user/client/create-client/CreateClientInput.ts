import { GenderType } from '@domain/enums/user/GenderType';
import { IsEmail, IsEnum, IsLocale, IsOptional, IsString } from '@shared/decorators/ValidationDecorator';

export class CreateClientInput {
    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(GenderType)
    @IsOptional()
    gender: GenderType;

    @IsString()
    @IsOptional()
    birthday: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsLocale()
    @IsOptional()
    locale: string;
}
