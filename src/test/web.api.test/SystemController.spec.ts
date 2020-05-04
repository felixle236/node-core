import 'mocha';
import '../mocks';
import '../../ModuleRegister';
import * as requestPromise from 'request-promise';
import { SinonSandbox, createSandbox } from 'sinon';
import { ApiService } from '../../web.api/ApiService';
import { AuthenticationBusiness } from '../../web.core/businesses/AuthenticationBusiness';
import { BulkActionResponse } from '../../web.core/dtos/common/BulkActionResponse';
import { Response } from 'request';
import { Role } from '../../web.core/models/Role';
import { Server } from 'http';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { UserBusiness } from '../../web.core/businesses/UserBusiness';
import { expect } from 'chai';

const generateUserAuth = () => {
    const userAuth = new UserAuthenticated();
    userAuth.id = 1;
    userAuth.role = new Role({ id: 1 } as any);
    userAuth.accessToken = 'access-token';
    userAuth.claims = [];
    return userAuth;
};

describe('System controller testing', () => {
    let sandbox: SinonSandbox;
    let server: Server;
    const port = 3000;
    const url = `http://localhost:${port}/api/v1/systems`;
    const request = requestPromise.defaults({ headers: { 'Content-Type': 'application/json' }, json: true });
    let userAuth: UserAuthenticated;

    before(function(done) {
        this.timeout(6000);
        sandbox = createSandbox();
        server = ApiService.start(done);
    });

    beforeEach(() => {
        userAuth = generateUserAuth();
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(done => {
        server.close(done);
    });

    it('Init data without permission', async () => {
        await request.post(url + '/sample-data').catch((response: Response) => {
            expect(response.statusCode).to.eq(401);
        });
    });

    it('Init data successfully', async () => {
        const bulkActionRequest = new BulkActionResponse(1);
        bulkActionRequest.success();
        sandbox.stub(AuthenticationBusiness.prototype, 'authenticateUser').resolves(userAuth);
        sandbox.stub(UserBusiness.prototype, 'createSampleData').resolves(bulkActionRequest);

        const { data }: {data: BulkActionResponse} = await request.post(url + '/sample-data');
        expect(data.total === bulkActionRequest.total && data.successes === bulkActionRequest.successes).to.eq(true);
    });

    it('Demo api export pdf by binary', async () => {
        const data = await request.get(url + '/export-pdf');
        expect(data).to.not.eq(undefined);
    });
});
