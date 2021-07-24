import { Client } from '@domain/entities/user/Client';
import { GenderType } from '@domain/enums/user/GenderType';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class FindClientQueryData {
    @IsUUID()
    id: string;

    @IsDateString()
    createdAt: Date;

    @IsString()
    firstName: string;

    @IsString()
    @IsOptional()
    lastName: string;

    @IsString()
    email: string;

    @IsString()
    @IsOptional()
    avatar: string;

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

    @IsString()
    @IsOptional()
    locale: string;

    constructor(data: Client) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.firstName = data.firstName;
        if (data.lastName)
            this.lastName = data.lastName;
        this.email = data.email;
        if (data.avatar)
            this.avatar = data.avatar;
        if (data.gender)
            this.gender = data.gender;
        if (data.birthday)
            this.birthday = data.birthday;
        if (data.phone)
            this.phone = data.phone;
        if (data.address)
            this.address = data.address;
        if (data.locale)
            this.locale = data.locale;
    }
}

export class FindClientQueryOutput extends PaginationResponse<FindClientQueryData> {
    @IsArray()
    @JSONSchema({ type: 'array', items: { $ref: '#/components/schemas/' + FindClientQueryData.name } })
    data: FindClientQueryData[];

    setData(list: Client[]): void {
        this.data = list.map(item => new FindClientQueryData(item));
    }
}
