import { Manager } from '@domain/entities/user/Manager';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsDateString, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class GetMyProfileManagerQueryData {
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

export class GetMyProfileManagerQueryOutput extends DataResponse<GetMyProfileManagerQueryData> {
    @IsObject()
    @JSONSchema({ type: 'object', $ref: '#/components/schemas/' + GetMyProfileManagerQueryData.name })
    data: GetMyProfileManagerQueryData;

    setData(data: Manager): void {
        this.data = new GetMyProfileManagerQueryData(data);
    }
}
