import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * @brief Service for managing the Prisma database connection.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    /**
     * @brief Initializes the database connection when the module starts.
     */
    async onModuleInit() {
        await this.$connect();
    }

    /**
     * @brief Closes the database connection when the module is destroyed.
     */
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
