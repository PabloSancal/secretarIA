import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  createMessage(
    @Body() createMessageDto: CreateMessageDto
  ){
    return this.messagesService.createMessage(createMessageDto.userId, createMessageDto.messageText );
  }
}
