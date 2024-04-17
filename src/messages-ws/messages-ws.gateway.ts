import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'dgram';

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleDisconnect(client: Socket) {
    console.log(client,'Disconnect')
  }
  handleConnection(client: Socket) {
    console.log(client,'Connect')
  }
  
}
