import { IRead } from '../../domain/common/persistence/IRead';
import { IWrite } from '../../domain/common/persistence/IWrite';
import { Message } from '../../domain/entities/Message';

export interface IMessageRepository extends IRead<Message, number>, IWrite<Message, number> {

}
