import { SocketController } from 'socket-controllers';
import { Service } from 'typedi';
import { SocketNamespace } from '../../web.core/domain/common/socket/SocketNamespace';

@Service()
@SocketController('/' + SocketNamespace.TRACKING.NAME)
export default class ConfigurationController {

}
