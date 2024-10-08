import type { MessageHandler, MessageHandlerInboundMessage } from '../../../agent/MessageHandler'
import { ConnectionService } from '../services'
import { OutOfBandService } from '../../oob'

import { SignatureExchangeService } from '../services'
import { SignatureExchangeResponseMessage } from '../messages/SignatureExchangeResponseMessage'

import { OutboundMessageContext } from '../../../agent/models'

export class SignatureExchangeResponseHandler implements MessageHandler {
  private signatureExchangeService: SignatureExchangeService
  private outOfBandService: OutOfBandService
  private connectionService: ConnectionService

  public supportedMessages = [SignatureExchangeResponseMessage]

  public constructor(
    signatureExchangeService: SignatureExchangeService,
    outOfBandService: OutOfBandService,
    connectionService: ConnectionService,
  ) {
    this.signatureExchangeService = signatureExchangeService
    this.outOfBandService = outOfBandService
    this.connectionService = connectionService
  }

  public async handle(messageContext: MessageHandlerInboundMessage<SignatureExchangeResponseHandler>) {
    const { message } = messageContext
    
    
    const {returnMessage, connectionId} = await this.signatureExchangeService.processResponse(message,messageContext.agentContext)
    const connectionRecord = await this.connectionService.getById(messageContext.agentContext,connectionId)
    let outOfBandRecord
    if(connectionRecord.outOfBandId){
      outOfBandRecord = await this.outOfBandService.getById(messageContext.agentContext,connectionRecord.outOfBandId)
    }
    return new OutboundMessageContext(returnMessage, {
      agentContext: messageContext.agentContext,
      connection: connectionRecord,
      outOfBand: outOfBandRecord,
    })
    
    
  }
}
