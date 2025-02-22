import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ollama from 'ollama'
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IaModelService {

    constructor(
        // private readonly configService: ConfigService,
        private readonly messageService: MessagesService,
        private readonly userService: UsersService,
        private readonly configService: ConfigService,

    ) {
        const apiPath = this.configService.get<string>('API_URL')
        // const ollamaUrl = `${apiPath}:11434/api`;
    }


    async getOllamaMessage(prompt: string, userPhone: string, model: string = 'deepseek-r1:7b') {
        try {

            const userFound = await this.userService.findUser(userPhone);
            if (!userFound) {
                throw new Error('User with phone number not found')
            }

            const userMessages = await this.messageService.findAllUserMessages(userFound?.id)
            userMessages.push({ role: 'user', content: prompt })

            const response = await ollama.chat({
                model: model,
                messages: userMessages,
            })

            console.log(response.message.content)
            return response.message.content;
        } catch (error) {
            console.log(`Unexpected error while communicating with Ollama: ${error}`)
            throw new Error("Error al generar mensajes con Ollama");
        }
    }
}
