
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, ClientOptions, LocalAuth } from 'whatsapp-web.js';
import { MessagesService } from '../messages/messages.service';
import { IaModelService } from 'src/ia-model/ia-model.service';
import { UsersService } from 'src/users/users.service';
import * as os from 'os';



/**
 * WhatsappService - Handles interactions with WhatsApp Web using whatsapp-web.js.
 */
@Injectable()
export class WhatsappService implements OnModuleInit {
<<<<<<< HEAD
  private client: Client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      product: 'chrome',
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless'],
    },  
  });

  private readonly logger = new Logger(WhatsappService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
    private messagesService: MessagesService,
    private iaModelService: IaModelService,
    private userService: UsersService,
  ) {}

  /**
   * Lifecycle hook that initializes the WhatsApp client and sets up event listeners.
   */
  onModuleInit() {
    this.client.on('qr', (qr) => {
      const port = this.configService.get<number>('PORT');
      const apiPath = this.configService.get<string>('API_URL');
      this.logger.log(`QrCode: ${apiPath}:${port}/whatsapp/qrcode`);
      this.eventEmitter.emit('qrcode.created', qr);
    });

    this.client.on('ready', () => {
      this.logger.log("Conexión exitosa !!");
    });

    /**
     * Listens for incoming messages and processes commands.
     */
    this.client.on('message', async (msg) => {
      this.logger.verbose(`${msg.from}: ${msg.body}`);
      const phoneNumber = msg.from.split('@')[0];
      let userFound = await this.userService.findUser(phoneNumber);
  
      console.log(userFound);
      if (!userFound) {
        userFound = await this.userService.createUser(phoneNumber);
      }
  
      const command = msg.body.match(/^!(\S*)/);
      
      if (command && msg.body.charAt(0) === '!') {
        const commandName = command[0];
        const message = msg.body.slice(commandName.length + 1);
  
        switch (commandName) {
          case '!help':
            msg.reply(
              "🌟 *SecretarIA - Comandos Disponibles* 🌟\n\n" +
              "📌 `!help` - Muestra esta lista de comandos.\n" +
              "💬 `!message <texto>` - Habla con el modelo de IA.\n" +
              "📝 `!username <nombre>` - Cambia tu nombre de usuario.\n\n" +
              "❓ *Ejemplo de uso:*\n" +
              "👉 `!message Hola, ¿cómo estás?`\n" +
              "👉 `!username JuanPerez`\n\n" +
              "⚡ _¡Escribe un comando y explora SecretarIA!_\n\n"
=======
    private readonly isMacOS: boolean = os.platform() === 'darwin';
    private client: Client;
    private readonly logger = new Logger(WhatsappService.name);


    constructor(
        private eventEmitter: EventEmitter2,
        private configService: ConfigService,
        private iaModelService: IaModelService,
        private userService: UsersService,
    ) {
        const clientConfig: ClientOptions = {
            authStrategy: new LocalAuth(),
        };

        if (!this.isMacOS) {
            clientConfig.puppeteer = {
                product: 'chrome',
                executablePath: '/usr/bin/chromium-browser',
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless'],
            };
        }

        this.client = new Client(clientConfig);

    };



    onModuleInit() {

        this.client.on('qr', (qr) => {
            const port = this.configService.get<number>('PORT')
            const apiPath = this.configService.get<string>('API_URL')
            this.logger.log(
                `QrCode: ${apiPath}:${port}/whatsapp/qrcode`,
>>>>>>> main
            );
            break;
  
          case '!remove':
            const deletedUser = await this.userService.removeUser(phoneNumber)
            return msg.reply(`${deletedUser.name} - ${deletedUser.phoneNumber} ha sido borrado.`)

<<<<<<< HEAD
          case '!username':
            const userName = await this.userService.changeName(message, phoneNumber);
            return msg.reply('Nombre de usuario cambiado.');
  
          case '!message':
            const reply = await this.iaModelService.getOllamaMessage(message, userFound.id);
            return msg.reply(reply);
  
          default:
            msg.reply('Comando no reconocido, usa !help para ver la lista de comandos.');
            break;
        }
      }
    });
    
    this.client.initialize();
  }
}
=======
        this.client.on('ready', () => {
            this.logger.log("Conexión exitosa !!");
        });

        this.client.on('message', async (msg) => {
            this.logger.verbose(`${msg.from}: ${msg.body}`);
            const phoneNumber = msg.from.split('@')[0];
            let userFound = await this.userService.findUser(phoneNumber);

            if (!userFound) {
                userFound = await this.userService.createUser(phoneNumber)
            }

            const command = msg.body.match(/^!(\S*)/);
            if (command && msg.body.charAt(0) === '!') {
                if (command[0] === '!name') {
                    //TODO: actualizar name de user
                } else if (command[0] === '!hi') {
                    msg.reply('Buenas y santas');
                    

                } else if (command[0] === '!username') {
                    const message = msg.body.slice(command[0].length + 1)
                    const userName = await this.userService.changeName(message, phoneNumber)
                    return msg.reply(userName.name)

                } else if (command[0] === '!message') {
                    const message = msg.body.slice(command[0].length + 1)
                    console.log('sending message to ollama...')
                    const reply = await this.iaModelService.getOllamaMessage(message, userFound.id)
                    return msg.reply(reply)
                }

            }
        });
        this.client.initialize();
    }
}
>>>>>>> main
