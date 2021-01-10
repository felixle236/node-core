import 'reflect-metadata';
import './databases/DatabaseRegister';
import './services/ServiceRegister';
import * as routingController from 'routing-controllers';
import * as typedi from 'typedi';
import * as typeorm from 'typeorm';

typeorm.useContainer(typedi.Container);
routingController.useContainer(typedi.Container);
