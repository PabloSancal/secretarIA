import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
    private logger = new Logger();

    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async createUser(userName: string, phoneNumber: string) {
        try {
            const newUser = await this.user.create({
                data: {
                    name: userName,
                    phoneNumber: phoneNumber
                }
            });

            return newUser;
        } catch (error) {
            this.logger.error(`Unexpected error while creating users - ${error}`);
            throw error;
        }
    }

    async removeUser(userId?: string, phoneNumber?: string) {
        try {
            const userRemoved = await this.user.delete({
                where: {
                    phoneNumber: phoneNumber,
                    id: userId,
                }
            });

            return userRemoved;
        } catch (error) {
            this.logger.error(`Unexpected error while removing users - ${error}`);
            throw error;
        }
    }
}
