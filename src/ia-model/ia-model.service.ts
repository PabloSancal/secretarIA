import { Injectable } from '@nestjs/common';
import ollama from 'ollama'
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class IaModelService {

    constructor(
        private readonly messageService: MessagesService,
    ) {}


    async getOllamaMessage(prompt: string, userId: string, model: string = 'deepseek-r1:7b') {
        try {

            const userMessages = await this.messageService.findAllUserMessages(userId)
            userMessages.push({ role: 'user', content: prompt })

            const response = await ollama.chat({
                model: model,
                messages: userMessages,
            })

            console.log(response.message.content)
            return response.message.content;
            
        } catch (error) {
            if (error.message === 'User with phone number not found') {
                return 'A user must be logged'
            }
            console.log(`Unexpected error while communicating with Ollama: ${error}`)
            throw error;
        }
    }
}
