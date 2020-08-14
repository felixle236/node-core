import 'reflect-metadata';
import './services/ServiceRegister';
import * as routingController from 'routing-controllers';
import * as socketController from 'socket-controllers';
import * as typedi from 'typedi';
import * as typeorm from 'typeorm';

typeorm.useContainer(typedi.Container);
routingController.useContainer(typedi.Container);
socketController.useContainer(typedi.Container);
