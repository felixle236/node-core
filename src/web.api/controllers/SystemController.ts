import * as path from 'path';
import { Authorized, ContentType, Get, JsonController, Post, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { BulkActionResponse } from '../../web.core/dtos/common/BulkActionResponse';
import { IUserInteractor } from '../../web.core/usecase/boundaries/interactors/IUserInteractor';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { readFile } from '../../libs/file';

@Service()
@JsonController('/systems')
export class SystemController {
    @Inject('user.interactor')
    private readonly _userInteractor: IUserInteractor;

    @Post('/sample-data')
    @Authorized(RoleId.SUPER_ADMIN)
    async createSampleData(): Promise<BulkActionResponse> {
        return await this._userInteractor.createSampleData();
    }

    // Demo API download file binary
    @Get('/export-pdf')
    @ContentType('application/octet-stream')
    exportPDF(@Res() res): Promise<Buffer> {
        const filePath = path.join(__dirname, '../../resources/documents/sample.pdf');
        res.set('Content-disposition', 'attachment; filename=sample.pdf');
        return readFile(filePath);
    }
}
