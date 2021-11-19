import { IsString } from 'shared/decorators/ValidationDecorator';

export class AddressInfoData {
    @IsString()
    street: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    country: string;

    @IsString()
    zipCode: string;
}
