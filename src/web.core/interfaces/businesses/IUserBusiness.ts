import { BulkActionResponse } from '../../dtos/common/BulkActionResponse';
import { ResultListResponse } from '../../dtos/common/ResultListResponse';
import { UserAuthenticated } from '../../dtos/user/UserAuthenticated';
import { UserCreateRequest } from '../../dtos/user/requests/UserCreateRequest';
import { UserFilterRequest } from '../../dtos/user/requests/UserFilterRequest';
import { UserLookupFilterRequest } from '../../dtos/user/requests/UserLookupFilterRequest';
import { UserLookupResponse } from '../../dtos/user/responses/UserLookupResponse';
import { UserPasswordUpdateRequest } from '../../dtos/user/requests/UserPasswordUpdateRequest';
import { UserResponse } from '../../dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../../dtos/user/requests/UserUpdateRequest';

export interface IUserBusiness {
    find(filter: UserFilterRequest): Promise<ResultListResponse<UserResponse>>;
    find(filter: UserFilterRequest, userAuth: UserAuthenticated): Promise<ResultListResponse<UserResponse>>;

    lookup(filter: UserLookupFilterRequest): Promise<ResultListResponse<UserLookupResponse>>;
    lookup(filter: UserLookupFilterRequest, userAuth: UserAuthenticated): Promise<ResultListResponse<UserLookupResponse>>;

    getById(id: number): Promise<UserResponse | undefined>;
    getById(id: number, userAuth: UserAuthenticated): Promise<UserResponse | undefined>;

    create(data: UserCreateRequest): Promise<UserResponse | undefined>;
    create(data: UserCreateRequest, userAuth: UserAuthenticated): Promise<UserResponse | undefined>;

    update(id: number, data: UserUpdateRequest): Promise<UserResponse | undefined>;
    update(id: number, data: UserUpdateRequest, userAuth: UserAuthenticated): Promise<UserResponse | undefined>;

    updatePassword(id: number, data: UserPasswordUpdateRequest): Promise<boolean>;
    updatePassword(id: number, data: UserPasswordUpdateRequest, userAuth: UserAuthenticated): Promise<boolean>;

    uploadAvatar(id: number, buffer: Buffer): Promise<string>;
    uploadAvatar(id: number, buffer: Buffer, userAuth: UserAuthenticated): Promise<string>;

    delete(id: number): Promise<boolean>;
    delete(id: number, userAuth: UserAuthenticated): Promise<boolean>;

    createSampleData(): Promise<BulkActionResponse>;
}
