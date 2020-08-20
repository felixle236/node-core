import { IBaseRepository } from '../../domain/common/persistence/IBaseRepository';
import { Message } from '../../domain/entities/Message';

export interface IMessageRepository extends IBaseRepository<Message, string> {

}
