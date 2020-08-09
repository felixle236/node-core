import { IFilterModel } from '../../../../domain/common/inputs/IFilterModel';

export interface IMessageFilter extends IFilterModel {
    room?: number;
    receiverId?: number;
    keyword?: string;
}
