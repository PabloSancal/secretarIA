import { HttpException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CryptoUtils } from './CryptoUtils/CryptoUtils';

/**
 * @service MessagesService
 * @brief Service responsible for handling message creation and retrieval.
 */
@Injectable()
export class MessagesService extends PrismaClient implements OnModuleInit {

    private logger = new Logger(MessagesService.name);

    /**
     * @brief Constructor that initializes the service with dependencies.
     * @param cryptoService The service responsible for encrypting and decrypting messages.
     */
    constructor(
        private readonly cryptoService: CryptoUtils,
    ) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    /**
     * @brief Creates a new message, encrypting its content before storing.
     * @returns The newly created message, including the encrypted message text.
     */
    async createMessage(userId: string, messageText: string) {
        try {
            // Encrypt the message text before saving it to the database
            let messageBuffer = this.cryptoService.encryptMessage(messageText);
            
            const newMessage = await this.message.create({
                data: {
                    messageText: messageBuffer.toString('hex'),  
                    userId: userId,
                    Date: new Date() 
                }
            });

            return newMessage;  // Return the newly created message

        } catch (error) {
            this.logger.error(`Unexpected error while creating message - ${error}`);
            throw error;  // Rethrow the error to be handled by the calling function
        }
    }

    /**
     * @brief Retrieves all messages for a specific user, decrypting the message text before returning.
     * @returns A list of messages, including the decrypted message text.
     */
    async findAllUserMessages(userId: string) {
        try {
            // Fetch all messages for the given user from the database
            const messages = await this.message.findMany({
                where: {
                    userId: userId
                }
            });

            // Decrypt each message's text before returning it
            const messagesFound = messages.map(message => {
                return {
                    ...message,
                    messageText: this.cryptoService.decryptMessage(message.messageText),  // Decrypt the message text
                }
            });

            return messagesFound;  // Return the decrypted messages

        } catch (error) {
            this.logger.error(`Unexpected error while finding user messages - ${error}`);
            throw error;  
        }
    }
}
