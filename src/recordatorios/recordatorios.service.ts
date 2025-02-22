import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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
export class RecordatoriosService {
  private readonly logger = new Logger(RecordatoriosService.name);

  constructor() {}

  /**
   * 🔄 Cron Job: Se ejecuta **una vez por minuto** para verificar recordatorios pendientes.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    this.logger.log('🔎 Buscando recordatorios que deben notificarse...');

    // Fecha de mañana para verificar recordatorios programados
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    // Simulación: Obtener recordatorios de la base de datos
    const reminders = await this.getRemindersForDate(tomorrow);

    if (reminders.length > 0) {
      this.logger.log(`📩 Hay ${reminders.length} recordatorios para enviar.`);
      
      // Enviar todas las notificaciones en paralelo
      await Promise.all(reminders.map(reminder =>
        this.notifyUser(reminder.userId, reminder.message)
      ));

      this.logger.log('✅ Recordatorios enviados correctamente.');
    } else {
      this.logger.log('✅ No hay recordatorios pendientes.');
    }
  }

  /**
   * Simula obtener recordatorios de la base de datos
   */
  async getRemindersForDate(date: Date) {
    // Aquí deberías hacer una consulta real a tu base de datos
    return [
      { userId: 1, message: '📅 Tienes una cita médica mañana a las 10 AM' },
      { userId: 2, message: '📌 No olvides revisar el contrato mañana a las 3 PM' }
    ];
  }

  /**
   * Simula enviar una notificación a un usuario
   */
  async notifyUser(userId: number, message: string) {
    this.logger.log(`📩 Enviando notificación a usuario ${userId}: ${message}`);
    // Aquí podrías integrar un servicio de email, SMS o push notifications.
  }
}
