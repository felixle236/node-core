/* eslint-disable @typescript-eslint/ban-types */
import { Server } from 'http';
import { ApiService } from 'exposes/api/mobile/ApiService';
import express, { Request } from 'express';
import { HttpServer } from 'infras/servers/http/HttpServer';
import { useContainer } from 'routing-controllers';
import { i18n } from 'shared/localization/Localization';
import { LogTracing } from 'shared/request/LogTracing';
import { Container } from 'typeorm-typedi-extensions';

export const mockHttpRequest = (req: Request): Request => {
  req.tracing = new LogTracing();
  req.tracing.getFromHttpHeader(req.headers);
  return req;
};

export const mockMobileApi = (controller: string | Function, port = 3000, callback?: () => void): Server => {
  useContainer(Container);

  const app = express();
  app.use((req: any, _res, next) => {
    mockHttpRequest(req);
    next();
  });
  app.use(i18n.init);

  const options = ApiService.getRoutingOptions();
  options.development = true;
  options.controllers = [controller as any];

  const httpServer = new HttpServer();
  return httpServer.start(app, port, options, callback);
};
