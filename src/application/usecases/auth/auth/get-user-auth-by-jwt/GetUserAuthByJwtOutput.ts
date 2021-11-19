import { AuthType } from 'domain/enums/auth/AuthType';
import { RefSchemaObject } from 'shared/decorators/RefSchema';
import { IsEnum, IsObject, IsUUID } from 'shared/decorators/ValidationDecorator';
import { DataResponse } from 'shared/usecase/DataResponse';

export class GetUserAuthByJwtData {
    @IsUUID()
    userId: string;

    @IsUUID()
    roleId: string;

    @IsEnum(AuthType)
    type: AuthType;
}

export class GetUserAuthByJwtOutput extends DataResponse<GetUserAuthByJwtData> {
    @IsObject()
    @RefSchemaObject(GetUserAuthByJwtData)
    data: GetUserAuthByJwtData;
}
