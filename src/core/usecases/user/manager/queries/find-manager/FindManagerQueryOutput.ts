import { Manager } from '@domain/entities/user/Manager';
import { RefSchemaArray } from '@shared/decorators/RefSchema';
import { PaginationResponse } from '@shared/usecase/PaginationResponse';
import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindManagerQueryData {
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

    constructor(data: Manager) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.firstName = data.firstName;
        if (data.lastName)
            this.lastName = data.lastName;
        this.email = data.email;
        if (data.avatar)
            this.avatar = data.avatar;
    }
}

export class FindManagerQueryOutput extends PaginationResponse<FindManagerQueryData> {
    @IsArray()
    @RefSchemaArray(FindManagerQueryData)
    data: FindManagerQueryData[];

    setData(list: Manager[]): void {
        this.data = list.map(item => new FindManagerQueryData(item));
    }
}
