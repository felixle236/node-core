import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import path from 'path';
import { AccessDeniedError } from '@shared/exceptions/AccessDeniedError';
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { InternalServerError } from '@shared/exceptions/InternalServerError';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { mockLogService } from '@shared/test/MockLogService';
import axios from 'axios';
import { expect } from 'chai';
import { useContainer } from 'class-validator';
import { Get, JsonController } from 'routing-controllers';
import { createSandbox } from 'sinon';
import Container from 'typedi';
import { ApiService } from './ApiService';

@JsonController('/test')
export class TestController {
    @Get('/')
    async test(): Promise<{data: string}> {
        return {
            data: 'test'
        };
    }

    @Get('/test-400-validation-error')
    async test400ValidationError(): Promise<boolean> {
        throw new InputValidationError([]);
    }

    @Get('/test-400-not-cover-yet')
    async test400NotCoverYet(): Promise<boolean> {
        const error = new Error();
        (error as any).httpCode = 400;
        throw error;
    }

    @Get('/test-400-logic')
    async test400Logic(): Promise<boolean> {
        throw new SystemError(MessageError.OTHER);
    }

    @Get('/test-403-access-denied')
    async test403AccessDenied(): Promise<boolean> {
        throw new AccessDeniedError();
    }

    @Get('/test-50x-internal-server-error')
    async test50xInternalServerError(): Promise<boolean> {
        throw new Error();
    }
}

describe('Api service', () => {
    useContainer(Container);
    const sandbox = createSandbox();
    let server: Server;
    const port = 3456;
    const endpoint = `http://localhost:${port}`;

    before(done => {
        Container.set('log.service', mockLogService());
        const options = ApiService.getOptions({
            controllers: [TestController],
            middlewares: [
                path.join(__dirname, './middlewares/*Middleware{.js,.ts}')
            ],
            interceptors: [
                path.join(__dirname, './interceptors/*Interceptor{.js,.ts}')
            ],
            validation: true,
            development: true
        });
        sandbox.stub(ApiService, 'getOptions').returns(options);

        server = ApiService.init(port, done);
    });

    after(done => {
        sandbox.restore();
        Container.reset();
        server.close(done);
    });

    it('Health check', async () => {
        const { status, data } = await axios.get(endpoint + '/health');

        expect(status).to.eq(200);
        expect(data).to.eq('ok');
    });

    it('Test api', async () => {
        const { status } = await axios.get(endpoint + '/api/test');
        expect(status).to.eq(200);
    });

    it('Test 400 validation error', async () => {
        const { status, data } = await axios.get(endpoint + '/api/test/test-400-validation-error').catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
        expect(data.fields).to.not.eq(undefined);
    });

    it('Test 400 not cover yet', async () => {
        const { status, data } = await axios.get(endpoint + '/api/test/test-400-not-cover-yet').catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new SystemError(MessageError.OTHER).code);
    });

    it('Test 400 logic error', async () => {
        const { status, data } = await axios.get(endpoint + '/api/test/test-400-logic').catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new SystemError(MessageError.OTHER).code);
    });

    it('Test 403 access denied', async () => {
        const { status, data } = await axios.get(endpoint + '/api/test/test-403-access-denied').catch(error => error.response);

        expect(status).to.eq(403);
        expect(data.code).to.eq(new AccessDeniedError().code);
    });

    it('Test 50x internal server error', async () => {
        const { status, data } = await axios.get(endpoint + '/api/test/test-50x-internal-server-error').catch(error => error.response);

        expect(status).to.eq(500);
        expect(data.code).to.eq(new InternalServerError().code);
    });
});
