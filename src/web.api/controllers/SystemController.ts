import * as path from 'path';
import { Authorized, ContentType, Get, JsonController, Post, Res } from 'routing-controllers';
import { BulkActionResult } from '../../web.core/domain/common/outputs/BulkActionResult';
import { CreateDummyUserInput } from '../../web.core/interactors/user/create-dummy-user/Input';
import { CreateDummyUserInteractor } from '../../web.core/interactors/user/create-dummy-user/Interactor';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
import { readFile } from '../../libs/file';

@Service()
@JsonController('/systems')
export class SystemController {
    constructor(
        private _createDummyUserInteractor: CreateDummyUserInteractor
    ) {}

    @Post('/dummy-users')
    @Authorized(RoleId.SUPER_ADMIN)
    async createDummyUser(): Promise<BulkActionResult> {
        const param = new CreateDummyUserInput();
        param.users = require('../../resources/data/dummy-users');
        return await this._createDummyUserInteractor.handle(param);
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
