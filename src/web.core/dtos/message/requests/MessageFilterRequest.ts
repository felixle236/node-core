import { BaseFilterRequest } from '../../common/BaseFilterRequest';

export class MessageFilterRequest extends BaseFilterRequest {
    room?: number;
    receiverId?: number;
    keyword?: string;
}
