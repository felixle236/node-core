import { Service } from 'typedi';
import { SocketController } from 'socket-controllers';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';

@Service()
@SocketController('/' + SocketNamespace.TRACKING.NAME)
export default class ConfigurationController {

}
