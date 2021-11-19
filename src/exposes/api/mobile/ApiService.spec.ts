/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import 'mocha';
import { Server } from 'http';
import { ILogService } from 'application/interfaces/services/ILogService';
import axios from 'axios';
import { expect } from 'chai';
import { Body, Get, JsonController, Post } from 'routing-controllers';
import { IsEmail, IsString } from 'shared/decorators/ValidationDecorator';
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { InputValidationError } from 'shared/exceptions/InputValidationError';
import { InternalServerError } from 'shared/exceptions/InternalServerError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { TraceRequest } from 'shared/request/TraceRequest';
import { mockInjection } from 'shared/test/MockInjection';
import { mockLogService } from 'shared/test/MockLogService';
import { InjectService } from 'shared/types/Injection';
import { createSandbox } from 'sinon';
import { Container } from 'typedi';
import { ApiService } from './ApiService';

export class LoginByEmailInput {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

@JsonController('/test')
export class TestController {
    @Get('/')
    async test(): Promise<{data: string}> {
        return {
            data: 'test'
        };
    }

    @Post('/test-400-validation-error')
    test400ValidationError(@Body() _data: LoginByEmailInput): void { }

    @Get('/test-400-not-cover-yet')
    async test400NotCoverYet(): Promise<boolean> {
        const error = new Error();
        (error as any).httpCode = 400;
        throw error;
    }

    @Get('/test-400-logic')
    async test400Logic(): Promise<boolean> {
        throw new SystemError(MessageError.UNKNOWN);
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
    const sandbox = createSandbox();
    let server: Server;
    const port = 6789;
    const endpoint = `http://localhost:${port}`;

    before(done => {
        mockInjection<ILogService>(InjectService.Log, mockLogService());
        const options = ApiService.getRoutingOptions();
        options.controllers = [TestController];
        options.development = true;

        sandbox.stub(ApiService, 'getRoutingOptions').returns(options);
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

    it('Send trace id header to out site', async () => {
        const headers = {};
        const trace = new TraceRequest();
        trace.setToHttpHeader(headers);
        const { status } = await axios.get(endpoint + '/api/test', headers);

        expect(status).to.eq(200);
    });

    it('Test api', async () => {
        const { status } = await axios.get(endpoint + '/api/test');
        expect(status).to.eq(200);
    });

    it('Test 400 validation error', async () => {
        const { status, data } = await axios.post(endpoint + '/api/test/test-400-validation-error').catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new InputValidationError().code);
        expect(data.fields.length).to.eq(2);
    });

    it('Test 400 not cover yet', async () => {
        const { status, data } = await axios.get(endpoint + '/api/test/test-400-not-cover-yet').catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new SystemError(MessageError.UNKNOWN).code);
    });

    it('Test 400 logic error', async () => {
        const { status, data } = await axios.get(endpoint + '/api/test/test-400-logic').catch(error => error.response);

        expect(status).to.eq(400);
        expect(data.code).to.eq(new SystemError(MessageError.UNKNOWN).code);
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
