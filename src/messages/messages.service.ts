import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MessagesService extends PrismaClient implements OnModuleInit {

    private logger = new Logger();

    async onModuleInit() {
        await this.$connect();
    }


    async createMessage(userId: string, messageText: string) {
        try {
            const newMessage = await this.message.create({
                data: {
                    messageText: messageText,
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
}
