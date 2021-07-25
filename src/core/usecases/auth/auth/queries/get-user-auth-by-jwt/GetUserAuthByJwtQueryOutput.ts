import { AuthType } from '@domain/enums/auth/AuthType';
import { RefSchemaObject } from '@shared/decorators/RefSchema';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsEnum, IsObject, IsUUID } from 'class-validator';

export class GetUserAuthByJwtQueryData {
    @IsUUID()
    userId: string;

    @IsUUID()
    roleId: string;

    @IsEnum(AuthType)
    type: AuthType;
}

export class GetUserAuthByJwtQueryOutput extends DataResponse<GetUserAuthByJwtQueryData> {
    @IsObject()
    @RefSchemaObject(GetUserAuthByJwtQueryData)
    data: GetUserAuthByJwtQueryData;

    setData(param: {userId: string, roleId: string, type: AuthType}): void {
        this.data = new GetUserAuthByJwtQueryData();
        this.data.userId = param.userId;
        this.data.roleId = param.roleId;
        this.data.type = param.type;
    }
}
