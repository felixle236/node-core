import 'reflect-metadata';
import * as routingController from 'routing-controllers';
import * as socketController from 'socket-controllers';
import * as typedi from 'typedi';
import * as typeorm from 'typeorm';
import * as validator from 'class-validator';

typeorm.useContainer(typedi.Container);
routingController.useContainer(typedi.Container);
socketController.useContainer(typedi.Container);
validator.useContainer(typedi.Container);
