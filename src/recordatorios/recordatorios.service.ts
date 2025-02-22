import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
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
