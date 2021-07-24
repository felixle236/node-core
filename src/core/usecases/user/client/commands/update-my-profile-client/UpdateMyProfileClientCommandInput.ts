import { GenderType } from '@domain/enums/user/GenderType';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMyProfileClientCommandInput {
    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
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

    @IsString()
    @IsOptional()
    locale: string;
}
