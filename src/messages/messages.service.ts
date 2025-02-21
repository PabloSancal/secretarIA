import { HttpException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CryptoUtils } from './CryptoUtils/CryptoUtils';

@Injectable()
export class MessagesService extends PrismaClient implements OnModuleInit {

    private logger = new Logger();

    constructor(
        private readonly cryptoService: CryptoUtils,
    ) {
        super();
    }
    async onModuleInit() {
        await this.$connect();
    }

    async createMessage(userId: string, messageText: string) {
        try {

            let messageBuffer = this.cryptoService.encryptMessage(messageText);
            console.log({ messageText })
            const newMessage = await this.message.create({
                data: {
                    messageText: messageBuffer.toString('hex'),
                    userId: userId,
                    Date: new Date()
                }
            });

            return newMessage;

        } catch (error) {
            this.logger.error(`Unexpected error while creating message - ${error}`)
            throw error;
        }
    }

    async findAllUserMessages(userId: string) {
        try {
            //Todo: comprobar que user existe con userdb

            const messages = await this.message.findMany({
                where: {
                    userId: userId
                }
            });

            const messagesFound = messages.map(message => {
                return {
                    ...message,
                    messageText: this.cryptoService.decryptMessage(message.messageText),
                }
            })

            return messagesFound;

        } catch (error) {
            this.logger.error(`Unexpected error while finding user messages - ${error}`)
            throw error;
        }
    }
}
