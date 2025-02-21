import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindUserMessagesDto } from './dto/find-user-messages.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  createMessage(
    @Body() createMessageDto: CreateMessageDto
  ){
    return this.messagesService.createMessage(createMessageDto.userId, createMessageDto.messageText );
  }

  @Get('all')
  findUserMessages(
    @Query() findUserMessagesDto: FindUserMessagesDto,
  ) {
    return this.messagesService.findAllUserMessages(findUserMessagesDto.userId)
  }
}
