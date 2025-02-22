import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
    private messagesService: MessagesService,
  ) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        product: "chrome",
        executablePath: "/usr/bin/chromium-browser",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless']
      }
    });
  }

  onModuleInit() {
    this.client.on('qr', (qr) => {
      const port = this.configService.get<number>('PORT');
      const apiPath = this.configService.get<string>('API_URL');
      this.logger.log(`QrCode: ${apiPath}:${port}/whatsapp/qrcode`);
      this.eventEmitter.emit('qrcode.created', qr);
    });

    this.client.on('ready', () => {
      this.logger.log('Conexión exitosa !!');
    });

    this.client.on('message', (msg) => {
      this.logger.verbose(`${msg.from}: ${msg.body}`);

      const commandMatch = msg.body.match(/^!(\S*)/);
      if (commandMatch && msg.body.charAt(0) === '!') {
        const command = commandMatch[0];

        switch (command) {
          case '!hi':
            msg.reply('Buenas y santas');
            break;

          case '!message':
            const message = msg.body.slice(command.length + 1);
            this.messagesService.createMessage(
              'a2946dce-4719-40f8-97e8-95121b8230b6',
              message,
            );
            break;

          case '!nombre':
            msg.reply('Para cambiar tu nombre usa: !nombre [nuevo nombre]');
            break;

          case '!help':
            msg.reply('Comandos disponibles:\n!nombre - Cambiar nombre\n!help - Decir comandos\n!diario - Notas diarias\n!perfil - Muestra listado de perfiles\n!perfil -n. - Cambia el perfil');
            break;

          case '!diario':
            msg.reply('Aquí están tus notas diarias...');
            break;

          case '!perfil':
            const profileArgs = msg.body.split(' ');
            if (profileArgs.length > 1 && profileArgs[1] === '-n') {
              msg.reply('Perfil cambiado correctamente.');
            } else {
              msg.reply('Listado de perfiles: [perfil1, perfil2, perfil3]');
            }
            break;

          case '!sorpresa': 
            msg.reply('🎉 ¡Sorpresa! Has descubierto un comando secreto. 🎉');
            break;

          default:
            msg.reply('Comando no reconocido');
            break;
        }
      }
    });

    this.client.initialize();
  }
}
