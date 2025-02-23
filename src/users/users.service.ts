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
          phoneNumber: phoneNumber,
        },
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
        },
      });
      return userFound;
    } catch (error) {
      this.logger.error(`Unexpected error while finding users - ${error}`);
      throw error;
    }
  }

  async getUserIdByNumber(phoneNumber?: string) {
    try {
      if (!phoneNumber) throw new Error('You must provide the phone number');
      const userId = await this.user.findMany({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      return userId;
    } catch (error) {
      this.logger.error(`Unexpected error while searching UserId - ${error}`);
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
        },
      });
      return userRemoved;
    } catch (error) {
      this.logger.error(`Unexpected error while removing users - ${error}`);
      throw error;
    }
  }

  /**
   * Updates a user's name by phone number.
   * @returns The updated user object.
   */
  async createProfile(userId: string, profileNumber: number) {
    try {
      const profile = await this.profile.create({
        data: {
          userId: userId,
          number: profileNumber,
        },
      });

      await this.user.update({
        data: {
          currentProfile: profile.id,
        },
        where: {
          id: userId,
        },
      });

      return profile;
    } catch (error) {
      this.logger.error(`Unexpected error while creating profiles - ${error}`);
      throw error;
    }
  }

  /**
   * @brief Retrieves all profiles associated with a given user.
   * @param userId - The ID of the user.
   * @returns A list of user profiles.
   * @throws An error if the operation fails.
   */
  async getAllProfiles(userId: string) {
    try {
      console.log({ userId });
      const userProfiles = await this.profile.findMany({
        where: {
          userId: userId,
        },
      });

      return userProfiles;
    } catch (error) {
      this.logger.error(
        `Unexpected error while retrieving profiles - ${error}`,
      );
      throw error;
    }
  }

  /**
   * @brief Changes the name of a user.
   * @param newName - The new name to set.
   * @param phoneNumber - (Optional) The phone number of the user.
   * @returns The updated user information.
   * @throws An error if the update fails.
   */
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

  /**
   * Removes a user by ID or phone number.
   * @returns The removed user object.
   */
  async removeProfile(profileNumber: number, userId: string) {
    try {
      const profileFound = await this.profile.findUnique({
        where: {
          userId_number: {
            userId: userId,
            number: profileNumber,
          },
        },
      });

      if (!profileFound) {
        return `👩🏻‍💼 El perfil indicado no existe`;
      }

      const profileRemoved = await this.profile.delete({
        where: {
          userId_number: {
            userId: userId,
            number: profileNumber,
          },
        },
      });

      return `👩🏻‍💼 Perfil borrado exitosamente `;
    } catch (error) {
      this.logger.error(`Unexpected error while removing users - ${error}`);
      throw error;
    }
  }
}
