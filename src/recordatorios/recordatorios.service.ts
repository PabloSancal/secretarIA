import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

/**
 * @brief Service for managing reminders.
 */
@Injectable()
export class RecordatoriosService {
    private readonly logger = new Logger(RecordatoriosService.name);

    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => WhatsappService))
        private readonly whatsappService: WhatsappService,
    ) { }

    /**
     * @brief Creates a new reminder.
     * @param reminderName - The name of the reminder.
     * @param reminderDate - The date and time for the reminder.
     * @param userId - The ID of the user associated with the reminder.
     * @returns The newly created reminder.
     * @throws An error if the creation fails.
     */
    async createReminder(reminderName: string, reminderDate: Date, userId: string) {
        try {
            reminderDate.setSeconds(0, 0);
            const newReminder = await this.prisma.reminder.create({
                data: {
                    name: reminderName,
                    date: reminderDate,
                    userId: userId,
                }
            });

            return newReminder;
        } catch (error) {
            console.log(`Unexpected error while creating reminder: ${error}`);
            throw error;
        }
    }

    /**
     * @brief Removes a reminder by its ID.
     * @param reminderId - The ID of the reminder to remove.
     * @returns The removed reminder.
     * @throws An error if the removal fails.
     */
    async removeReminder(reminderId: string) {
        try {
            const removedReminder = await this.prisma.reminder.delete({
                where: {
                    id: reminderId,
                }
            });

            return removedReminder;
        } catch (error) {
            console.log(`Unexpected error while removing reminder: ${error}`);
            throw error;
        }
    }

    /**
     * @brief Retrieves all reminders associated with a user.
     * @param userId - The ID of the user.
     * @returns A list of all user reminders.
     * @throws An error if the retrieval fails.
     */
    async findAllUserReminders(userId: string) {
        try {
            const allReminders = await this.prisma.reminder.findMany({
                where: {
                    userId: userId,
                }
            });

            return allReminders;
        } catch (error) {
            console.log(`Unexpected error while finding user reminders: ${error}`);
            throw error;
        }
    }

    /**
     * @brief Retrieves reminders set for specific times: one day before, ten minutes before, and at the exact time.
     * @param currDate - The current date to check reminders.
     * @returns A list of reminders matching the given times.
     * @throws An error if the retrieval fails.
     */
    async findAllReminders(currDate: Date) {
        try {
            const targetHour = currDate.getHours();
            const targetMinutes = currDate.getMinutes();

            const previousDay = new Date(currDate);
            previousDay.setDate(previousDay.getDate() - 1);

            const oneDayBeforeExact = new Date(previousDay);
            oneDayBeforeExact.setHours(targetHour, targetMinutes, 0, 0);

            const tenMinutesBefore = new Date(oneDayBeforeExact);
            tenMinutesBefore.setMinutes(tenMinutesBefore.getMinutes() - 10);

            const exactNow = new Date(currDate);
            exactNow.setSeconds(0, 0);

            const allReminders = await this.prisma.reminder.findMany({
                where: {
                    OR: [
                        { date: oneDayBeforeExact },
                        { date: tenMinutesBefore },
                        { date: exactNow }
                    ]
                }
            });

            return allReminders;
        } catch (error) {
            console.log(`Unexpected error while finding reminders: ${error}`);
            throw error;
        }
    }

    /**
     * @brief Scheduled task that checks and notifies users of their reminders every minute.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async checkReminders() {
        this.logger.log('🔎 Checking for reminders that need to be notified...');

        const now = new Date();
        const reminders = await this.getRemindersForDate(now);

        if (reminders.length > 0) {
            await Promise.all(reminders.map(reminder =>
                this.whatsappService.notifyUser(reminder.userId, `${reminder.name} - ${reminder.date}`)
            ));

            this.logger.log('✅ Reminders successfully sent.');
        } else {
            this.logger.log('✅ No pending reminders.');
        }
    }

    /**
     * @brief Retrieves reminders for a given date.
     * @param date - The date to find reminders for.
     * @returns A list of reminders for the specified date.
     */
    async getRemindersForDate(date: Date) {
        return await this.findAllReminders(date);
    }
}
