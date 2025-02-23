import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class RecordatoriosService {
    private readonly logger = new Logger(RecordatoriosService.name);

    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => WhatsappService))
        private readonly whatsappService: WhatsappService,
    ) { }
    
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
            console.log(`Unexpected error while creating reminder: ${error}`)
            throw error;
        }
    }

    async removeReminder(reminderId: string) {
        try {
            const removedReminder = await this.prisma.reminder.delete({
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
            const allReminders = await this.prisma.reminder.findMany({
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

    //* El método obtiene los recordatorios 1 dia previo a la fecha, 10 minutos previos y a la hora.
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
            console.log(`Unexpected error while finding reminders: ${error}`)
            throw error;
        }
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async checkReminders() {
        this.logger.log('🔎 Buscando recordatorios que deben notificarse...');

        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);

        const reminders = await this.getRemindersForDate(now);

        if (reminders.length > 0) {


            await Promise.all(reminders.map(reminder =>
                this.whatsappService.notifyUser(reminder.userId, `${reminder.name} - ${reminder.date}`)
            ));

            this.logger.log('✅ Recordatorios enviados correctamente.');
        } else {
            this.logger.log('✅ No hay recordatorios pendientes.');
        }
    }

    async getRemindersForDate(date: Date) {

        return await this.findAllReminders(date)
    }


}
