import { GenderType } from '@domain/enums/user/GenderType';
import { IsOptional, IsString } from '@shared/decorators/ValidationDecorator';

export class UpdateManagerInput {
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
}
