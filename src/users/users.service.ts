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

    async createUser(phoneNumber: string, userName?: string) {
        try {
            const newUser = await this.user.create({
                data: {
                    name: userName ?? 'user',
                    phoneNumber: phoneNumber
                }
            });

            return newUser;
        } catch (error) {
            this.logger.error(`Unexpected error while creating users - ${error}`);
            throw error;
        }
    }

    async findUser(phoneNumber?: string, userId?: string) {
        try {
            if (!userId && !phoneNumber) {
                throw new Error('You must provide the user ID or the phone number')
            }

            const userFound = await this.user.findUnique({
                where: {
                    phoneNumber: phoneNumber,
                    id: userId,
                }
            })

            return userFound;

        } catch (error) {
            this.logger.error(`Unexpected error while finding users - ${error}`);
            throw error;
        }
    }


    async removeUser(userId?: string, phoneNumber?: string) {
        try {
            if (!userId && !phoneNumber) {
                throw new Error('You must provide the user ID or the phone number')
            }

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

    async changeName(newName: string, phoneNumber?: string) {
        try {
            if (!phoneNumber) {
                throw new Error('You must provide the phone number');
            }
    
            const updatedUser = await this.user.update({
                where: {
                    phoneNumber: phoneNumber,
                },
                data: {
                    name: newName, 
                },
            });
    
            return updatedUser;
    
        } catch (error) {
            this.logger.error(`Error changing user name - ${error}`);
            throw new Error('Failed to update user name');
        }
    }
    
}
