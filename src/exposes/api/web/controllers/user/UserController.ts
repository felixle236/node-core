import { RoleId } from 'domain/enums/user/RoleId';
import { ImportClientTestHandler } from 'application/usecases/user/client/import-client-test/ImportClientTestHandler';
import { ImportManagerTestHandler } from 'application/usecases/user/manager/import-manager-test/ImportManagerTestHandler';
import { GetListOnlineStatusByIdsHandler } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsHandler';
import {
  GetListOnlineStatusByIdsInput,
  GetListOnlineStatusByIdsOutput,
} from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsSchema';
import { UploadAvatarHandler } from 'application/usecases/user/user/upload-avatar/UploadAvatarHandler';
import { UploadAvatarInput, UploadAvatarOutput } from 'application/usecases/user/user/upload-avatar/UploadAvatarSchema';
import { Type } from 'class-transformer';
import { STORAGE_UPLOAD_DIR } from 'config/Configuration';
import { PrivateAccessMiddleware } from 'exposes/api/web/middlewares/PrivateAccessMiddleware';
import multer from 'multer';
import { Authorized, Get, JsonController, Post, QueryParams, UseBefore, UploadedFile, CurrentUser, Body } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { RefSchemaArray } from 'shared/decorators/RefSchema';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsPositive, IsString, MaxLength, ValidateNested } from 'shared/decorators/ValidationDecorator';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { Service } from 'typedi';
import { generateAuthRequiredDoc } from 'utils/Common';

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, STORAGE_UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}`);
  },
});

export class ListObjectItem {
  @IsString()
  @MaxLength(6)
  content: string;

  @IsPositive()
  @IsOptional()
  order?: number;
}

class ListObjectDemo {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => ListObjectItem)
  @RefSchemaArray(ListObjectItem)
  list: ListObjectItem[];
}

@Service()
@JsonController('/v1/users')
export class UserController {
  constructor(
    private readonly _uploadAvatarHandler: UploadAvatarHandler,
    private readonly _getListOnlineStatusByIdsHandler: GetListOnlineStatusByIdsHandler,
    private readonly _importManagerTestHandler: ImportManagerTestHandler,
    private readonly _importClientTestHandler: ImportClientTestHandler,
  ) {}

  @Post('/avatar')
  @Authorized()
  @OpenAPI({ summary: 'Upload avatar', description: generateAuthRequiredDoc() })
  @ResponseSchema(UploadAvatarOutput)
  uploadAvatar(
    @UploadedFile('avatar', { required: true, options: { storage } }) file: Express.Multer.File,
    @CurrentUser() userAuth: UserAuthenticated,
  ): Promise<UploadAvatarOutput> {
    const param = new UploadAvatarInput();
    param.file = file;
    return this._uploadAvatarHandler.handle(userAuth.userId, param);
  }

  @Get('/list-online-status')
  @Authorized()
  @OpenAPI({ summary: 'Get list online status', description: generateAuthRequiredDoc() })
  @ResponseSchema(GetListOnlineStatusByIdsOutput)
  getListOnlineStatusByIds(@QueryParams() param: GetListOnlineStatusByIdsInput): Promise<GetListOnlineStatusByIdsOutput> {
    return this._getListOnlineStatusByIdsHandler.handle(param);
  }

  @Get('/api-private-demo')
  @UseBefore(PrivateAccessMiddleware)
  accessApiPrivateDemo(): Promise<{ data: boolean }> {
    return Promise.resolve({ data: true });
  }

  @Post('/list-object-demo')
  postListObjectDemo(@Body() _param: ListObjectDemo): Promise<{ data: boolean }> {
    return Promise.resolve({ data: true });
  }

  @Post('/import-user-test')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Import user test', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  async importUserTest(): Promise<{ data: boolean }> {
    await this._importManagerTestHandler.handle();
    await this._importClientTestHandler.handle();
    return { data: true };
  }
}
