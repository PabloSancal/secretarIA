import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RecordatoriosService extends PrismaClient implements OnModuleInit {

    async onModuleInit() {
        await this.$connect();
    }

    async createReminder(reminderName: string, reminderDate: Date, userId: string) {
        try {
            const newReminder = await this.reminder.create({
                data: {
                    name: reminderName,
                    date: reminderDate,
                    userId: userId,
                }
            });

            return newReminder;

        } catch (error) {
            console.log(`Unexpected error while creating reminder: ${error}`)
            throw error;
        }
    }

    async removeReminder(reminderId: string) {
        try {
            const removedReminder = await this.reminder.delete({
                where: {
                    id: reminderId,
                }
            })

            return removedReminder;

        } catch (error) {
            console.log(`Unexpected error while creating reminder: ${error}`)
            throw error;
        }
    }

    async findAllUserReminders(userId: string) {
        try {
            const allReminders = await this.reminder.findMany({
                where: {
                    userId: userId,
                }
            });

            return allReminders;

        } catch (error) {
            console.log(`Unexpected error while finding user reminders: ${error}`)
            throw error;
        }
    }

    async findAllReminders() {
        try {
            const allReminders = await this.reminder.findMany();

            return allReminders;

        } catch (error) {
            console.log(`Unexpected error while finding reminders: ${error}`)
            throw error;
        }
    }
}
