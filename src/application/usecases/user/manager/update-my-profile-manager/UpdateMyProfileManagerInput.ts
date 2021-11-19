import { GenderType } from 'domain/enums/user/GenderType';
import { IsDateOnlyString, IsEnum, IsOptional, IsString, MaxLength } from 'shared/decorators/ValidationDecorator';

export class UpdateMyProfileManagerInput {
    @IsString()
    @MaxLength(20)
    firstName: string;

    @IsString()
    @MaxLength(20)
    @IsOptional()
    lastName?: string;

    @IsEnum(GenderType)
    @IsOptional()
    gender?: GenderType;

    @IsDateOnlyString()
    @IsOptional()
    birthday?: string;
}
