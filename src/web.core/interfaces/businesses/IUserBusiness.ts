import { BulkActionResponse } from '../../dtos/common/BulkActionResponse';
import { ResultListResponse } from '../../dtos/common/ResultListResponse';
import { UserAuthenticated } from '../../dtos/common/UserAuthenticated';
import { UserCommonFilterRequest } from '../../dtos/user/requests/UserCommonFilterRequest';
import { UserCommonResponse } from '../../dtos/user/responses/UserCommonResponse';
import { UserCreateRequest } from '../../dtos/user/requests/UserCreateRequest';
import { UserFilterRequest } from '../../dtos/user/requests/UserFilterRequest';
import { UserRegisterRequest } from '../../dtos/user/requests/UserRegisterRequest';
import { UserResponse } from '../../dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../../dtos/user/requests/UserUpdateRequest';

export interface IUserBusiness {
    find(filter: UserFilterRequest, userAuth: UserAuthenticated): Promise<ResultListResponse<UserResponse>>;

    findCommon(filter: UserCommonFilterRequest, userAuth: UserAuthenticated): Promise<ResultListResponse<UserCommonResponse>>;

    getById(id: number): Promise<UserResponse | undefined>;
    getById(id: number, userAuth: UserAuthenticated): Promise<UserResponse | undefined>;

    create(data: UserCreateRequest, userAuth: UserAuthenticated): Promise<UserResponse | undefined>;

    update(id: number, data: UserUpdateRequest): Promise<UserResponse | undefined>;
    update(id: number, data: UserUpdateRequest, userAuth: UserAuthenticated): Promise<UserResponse | undefined>;

    updatePassword(id: number, password: string, newPassword: string): Promise<boolean>;

    uploadAvatar(id: number, buffer: Buffer): Promise<string>;

    register(data: UserRegisterRequest): Promise<UserResponse | undefined>;

    active(confirmKey: string): Promise<boolean>;

    resendActivation(email: string): Promise<boolean>;

    forgotPassword(email: string): Promise<boolean>;

    resetPassword(confirmKey: string, password: string): Promise<boolean>;

    archive(id: number, userAuth: UserAuthenticated): Promise<boolean>;

    delete(id: number, userAuth: UserAuthenticated): Promise<boolean>;

    createSampleData(): Promise<BulkActionResponse>;
}
