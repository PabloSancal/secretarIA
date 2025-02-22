import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindUserMessagesDto } from './dto/find-user-messages.dto';

/**
 * @controller MessagesController
 * @brief Handles operations related to messages like creating and retrieving messages.
 */
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * @brief Creates a new message.
   * @returns A message confirming the creation of the new message.
   */
  @Post()
  createMessage(
    @Body() createMessageDto: CreateMessageDto  
  ) {
    return this.messagesService.createMessage(createMessageDto.userId, createMessageDto.messageText);
  }

  /**
   * @brief Retrieves all messages for a specific user.
   * @returns A list of messages from the user.
   */
  @Get('all')
  findUserMessages(
    @Query() findUserMessagesDto: FindUserMessagesDto,  
  ) {
    return this.messagesService.findAllUserMessages(findUserMessagesDto.userId);
  }
}
