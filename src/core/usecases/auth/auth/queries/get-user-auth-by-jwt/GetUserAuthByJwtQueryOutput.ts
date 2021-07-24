import { AuthType } from '@domain/enums/auth/AuthType';
import { DataResponse } from '@shared/usecase/DataResponse';
import { IsEnum, IsObject, IsUUID } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

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
    @JSONSchema({ type: 'object', $ref: '#/components/schemas/' + GetUserAuthByJwtQueryData.name })
    data: GetUserAuthByJwtQueryData;

    setData(param: {userId: string, roleId: string, type: AuthType}): void {
        this.data = new GetUserAuthByJwtQueryData();
        this.data.userId = param.userId;
        this.data.roleId = param.roleId;
        this.data.type = param.type;
    }
}
