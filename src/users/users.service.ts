import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


/**
 * UsersService - A service that manages user operations using Prisma.
 */
@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
    private logger = new Logger();

    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    /**
     * Creates a new user with the given phone number and optional username.
     * @returns The created user object.
     */
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

    /**
     * Finds a user by phone number or user ID.
     * @returns The found user object or null if not found.
     */
    async findUser(phoneNumber?: string, userId?: string) {
        try {
            if (!userId && !phoneNumber) {
                throw new Error('You must provide the user ID or the phone number');
            }

            const userFound = await this.user.findUnique({
                where: {
                    phoneNumber: phoneNumber,
                    id: userId,
                }
            });
            return userFound;
        } catch (error) {
            this.logger.error(`Unexpected error while finding users - ${error}`);
            throw error;
        }
    }

    /**
     * Removes a user by ID or phone number.
     * @returns The removed user object.
     */
    async removeUser(phoneNumber?: string) {
        try {
            if (!phoneNumber) {
                throw new Error('You must provide the phone number');
            }

            const userRemoved = await this.user.delete({
                where: {
                    phoneNumber: phoneNumber,
                }
            });
            return userRemoved;
        } catch (error) {
            this.logger.error(`Unexpected error while removing users - ${error}`);
            throw error;
        }
    }

<<<<<<< HEAD
    /**
     * Updates a user's name by phone number.
     * @returns The updated user object.
     */
=======
    async createProfile(userId: string, profileNumber: number) {
        try {
            const profile = await this.profile.create({
                data: {
                    userId: userId,
                    number: profileNumber,
                }
            });

            return profile;

        } catch (error) {
            this.logger.error(`Unexpected error while creating profiles - ${error}`);
            throw error;
        }
    }

    async getAllProfiles(userId: string) {
        try {
            const userProfiles = await this.profile.findMany({
                where: {
                    userId: userId,
                }
            });

            return userProfiles;

        } catch (error) {
            this.logger.error(`Unexpected error while creating profiles - ${error}`);
            throw error;
        }
    }

>>>>>>> main
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