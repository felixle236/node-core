import * as path from 'path';
import { Authorized, ContentType, Get, JsonController, Post, Res } from 'routing-controllers';
import { CreateDummyUserCommand, DummyUser } from '../../web.core/interactors/user/commands/create-dummy-user/CreateDummyUserCommand';
import { BulkActionResult } from '../../web.core/domain/common/interactor/BulkActionResult';
import { CreateDummyUserCommandHandler } from '../../web.core/interactors/user/commands/create-dummy-user/CreateDummyUserCommandHandler';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
import { readFile } from '../../libs/file';

@Service()
@JsonController('/systems')
export class SystemController {
    constructor(
        private _createDummyUserCommandHandler: CreateDummyUserCommandHandler
    ) {}

    @Post('/dummy-users')
    @Authorized(RoleId.SUPER_ADMIN)
    async createDummyUser(): Promise<BulkActionResult> {
        const list: DummyUser[] = require('../../resources/data/dummy-users');
        const param = new CreateDummyUserCommand();
        param.users = [];
        list.forEach(item => {
            const user = new DummyUser();
            user.roleId = item.roleId;
            user.firstName = item.firstName;
            user.lastName = item.lastName;
            user.email = item.email;
            user.password = item.password;
            user.gender = item.gender;
            user.avatar = item.avatar;

            param.users.push(user);
        });
        return await this._createDummyUserCommandHandler.handle(param);
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
