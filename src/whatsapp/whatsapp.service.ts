import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { MessagesService } from '../messages/messages.service';

/**
 * @brief Service responsible for managing the WhatsApp client and handling events such as QR code generation and incoming messages.
 * This service initializes a WhatsApp client, listens for events, and processes commands received in messages.
 */
@Injectable()
export class WhatsappService implements OnModuleInit {
  private client: Client = new Client({
    authStrategy: new LocalAuth(),  // Use local authentication strategy for WhatsApp Web client
  });
  private readonly logger = new Logger(WhatsappService.name);  // Logger to track service activity

  constructor(
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
    private messagesService: MessagesService,
  ) {}

  /**
   * @brief Initializes the WhatsApp client and sets up event listeners for QR code creation, connection readiness, and incoming messages.
   */

  onModuleInit() {
    // Listen for QR code generation
    this.client.on('qr', (qr) => {
      const port = this.configService.get<number>('PORT');  // Get the port from configuration
      const apiPath = this.configService.get<string>('API_URL');  // Get the API URL from configuration
      this.logger.log(`QrCode: ${apiPath}:${port}/whatsapp/qrcode`);  // Log the QR code URL
      this.eventEmitter.emit('qrcode.created', qr);  // Emit the 'qrcode.created' event with the generated QR code
    });

    // Listen for the client being ready (connected to WhatsApp)
    this.client.on('ready', () => {
      this.logger.log('Conexión exitosa !!');  // Log successful connection
    });

    // Listen for incoming messages
    this.client.on('message', (msg) => {
      this.logger.verbose(`${msg.from}: ${msg.body}`);  

      // Match and process commands starting with "!"
      const commandMatch = msg.body.match(/^!(\S*)/);  
      if (commandMatch && msg.body.charAt(0) === '!') {
        const command = commandMatch[0];  

        // Handle different commands
        switch (command) {

          case '!message':
            const message = msg.body.slice(command.length + 1);  
            this.messagesService.createMessage(
              'a2946dce-4719-40f8-97e8-95121b8230b6',  
              message,  
            );
            break;

          case '!nombre':
            msg.reply('Para cambiar tu nombre usa: !nombre [nuevo nombre]');  // Provide instructions for changing the name
            //TODO: Implement logic for changing name after it's set
            break;

          case '!help':
            msg.reply('Comandos disponibles:\n!nombre - Cambiar nombre\n!help - Decir comandos\n!diario - Notas diarias\n!perfil - Muestra listado de perfiles\n!perfil -n. - Cambia el perfil');
            break;

          case '!perfil':
            const profileArgs = msg.body.split(' ');  // Split the message to parse the profile command
            if (profileArgs.length > 1 && profileArgs[1] === '-n') {
              msg.reply('Perfil cambiado correctamente.');  // Confirm profile change
            } else {
              msg.reply('Listado de perfiles: [perfil1, perfil2, perfil3]');  // Show available profiles
            }
            break;

          default:
            msg.reply('Comando no reconocido. \nUtiliza !help para ver la lista de comandos.');
            break;
        }
      }
    });

    // Initialize the WhatsApp client (connect to WhatsApp Web)
    this.client.initialize();
  }
}
