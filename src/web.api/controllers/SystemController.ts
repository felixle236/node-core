import * as path from 'path';
import { Authorized, ContentType, Get, JsonController, Post, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { BulkActionResponse } from '../../web.core/dtos/common/BulkActionResponse';
import { IUserBusiness } from '../../web.core/interfaces/businesses/IUserBusiness';
import { SystemClaim } from '../../constants/claims/SystemClaim';
import { readFile } from '../../libs/file';

@Service()
@JsonController('/systems')
export class SystemController {
    @Inject('user.business')
    private readonly _userBusiness: IUserBusiness;

    @Post('/sample-data')
    @Authorized(SystemClaim.INIT_DATA)
    async createSampleData(): Promise<BulkActionResponse> {
        return await this._userBusiness.createSampleData();
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
