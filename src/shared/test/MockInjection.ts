/* eslint-disable @typescript-eslint/ban-types */
import Container, { Token } from 'typedi';
import { mockFunction } from './MockFunction';

export const mockInjection = <T>(name: string | Function | Token<any>, value: any): T => {
  Container.set(name as any, value);
  return value;
};

export const mockUsecaseInjection = <T>(func: Function, objectExt: object = {}): T => {
  const usecase = {
    handle: mockFunction(),
    ...objectExt,
  };
  Container.set(func, usecase);
  return usecase as any;
};

export const mockRepositoryInjection = <T>(name: string, functions: (keyof T)[] = []): T => {
  const obj = {} as T;
  const funcs = (functions as string[]).concat(
    'findAll',
    'find',
    'findOne',
    'findAndCount',
    'count',
    'get',
    'create',
    'createGet',
    'createMultiple',
    'update',
    'updateGet',
    'updateFields',
    'delete',
    'deleteMultiple',
    'softDelete',
    'softDeleteMultiple',
    'restore',
    'restoreMultiple',
  );

  funcs.forEach((func) => {
    obj[func] = mockFunction();
  });
  Container.set(name, obj);
  return obj;
};
