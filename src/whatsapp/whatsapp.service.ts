
import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, ClientOptions, LocalAuth } from 'whatsapp-web.js';
import { MessagesService } from '../messages/messages.service';
import { IaModelService } from 'src/ia-model/ia-model.service';
import { UsersService } from 'src/users/users.service';
import { PersonalityService } from 'src/personality/personality.service';
import * as os from 'os';
import { RecordatoriosService } from 'src/recordatorios/recordatorios.service';



/**
 * WhatsappService - Handles interactions with WhatsApp Web using whatsapp-web.js.
 */
@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly isMacOS: boolean = os.platform() === 'darwin';
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);

  private userQuestion : string;

  constructor(
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
    private iaModelService: IaModelService,
    private userService: UsersService,
    @Inject(forwardRef(() => RecordatoriosService))
    private recordatoriosService: RecordatoriosService,
    private personalityService: PersonalityService,
    private messageService: MessagesService,
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
  }

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
      this.logger.log('Conexión exitosa !!');
    });

    /**
     * Listens for incoming messages and processes commands.
     */
    this.client.on('message', async (msg) => {
      this.logger.verbose(`${msg.from}: ${msg.body}`);
      const phoneNumber = msg.from.split('@')[0];
      let userFound = await this.userService.findUser(phoneNumber);

      if (!userFound) {
        userFound = await this.userService.createUser(phoneNumber);
      }

      if (!userFound.currentProfile) {
        let userProfiles = await this.userService.getAllProfiles(userFound.id);

        if (userProfiles.length === 0) {
          userFound.currentProfile = (
            await this.userService.createProfile(userFound.id, 1)
          ).id;
        } else {
          userFound.currentProfile = userProfiles[0].id;
        }
      }

      if(msg.hasQuotedMsg){
        const quotedMsg = await msg.getQuotedMessage();
        
        console.log(quotedMsg.body)

        if(quotedMsg.body === this.userQuestion){

          const userEmotion = `El usuario ha respondido a ${quotedMsg.body} que se siente ${msg.body}`

          this.messageService.createMessage(userFound.currentProfile, userEmotion);
          return msg.reply(`🔍 ¡Gracias por responder a la pregunta!`);
        }

      }

      const command = msg.body.match(/^!(\S*)/);
      console.log({command})
      
      if (command && msg.body.charAt(0) === '!') {
        const commandName = command[0];
        const message = msg.body.slice(commandName.length + 1);
        switch (commandName) {
          case '!personalidad':
            const questions = this.personalityService.getQuestions();
        
            if (!questions || questions.length === 0) {
                return msg.reply('⚠️ No hay preguntas de personalidad disponibles en este momento.');
            }
        
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)]; // Obtener una pregunta aleatoria
        
            this.userQuestion = `❓ ${randomQuestion.question}\nOpciones: ${randomQuestion.options.join(', ')}`

            await msg.reply(
                `❓ ${randomQuestion.question}\nOpciones: ${randomQuestion.options.join(', ')}`,
            );
            break;
                    
          case '!help':
            msg.reply(
              "🌟 *SecretarIA - Comandos Disponibles* 🌟\n\n" +
              "📌 `!help` - Muestra esta lista de comandos.\n" +
              "💬 `!message <texto>` - Habla con el modelo de IA.\n" +
              "📝 `!username <nombre>` - Cambia tu nombre de usuario.\n\n" +
              "❓ *Ejemplo de uso:*\n" +
              "👉 `!message Hola, ¿cómo estás?`\n" +
              "👉 `!username JuanPerez`\n\n" +
              "👉 `!recordatorios - Puedes ver todos tus recordatorios`\n\n" +
              "⚡ _¡Escribe un comando y explora SecretarIA!_\n\n"
            );
            break;

          
          
          case '!remove':
            const deletedUser = await this.userService.removeUser(phoneNumber);
            return msg.reply(
              `🚫 *${deletedUser.name}* con número 📞 *${deletedUser.phoneNumber}* ha sido eliminado correctamente.`,
            );

          case '!username':
            if (!message)
              return msg.reply(
                '⚠️ *Debes especificar un nuevo nombre de usuario.*\n\n📝 Ejemplo: `!username Pablo`',
              );
            const userName = await this.userService.changeName(
              message,
              phoneNumber,
            );
            return msg.reply(
              `✅ *Nombre de usuario actualizado con éxito a:* *${message}* 🎉`,
            );

          case '!perfil':
            if (!message) {
              const profiles = await this.userService.getAllProfiles(userFound.id);
              let msgPerfiles = `**Perfiles:** \n\n`
              profiles.forEach(profile => (
                msgPerfiles += `${userFound.currentProfile === profile.id ? '*' : ''} Perfil ${profile.number}\n`
              ));

              return msg.reply(msgPerfiles);
            }

            const profileFlags = this.parseProfileFlags(message);

            if (!profileFlags?.profileNumber) {
              return msg.reply('Formato incorrecto. Usa: !perfil -<número>');
            }

            const numero = profileFlags.profileNumber;

            if (!profileFlags.deleteProfile) {
              await this.userService.createProfile(userFound.id, numero);
              return msg.reply(`Nuevo perfil: ${numero}`);
            }

            const replyRemoveMsg = await this.userService.removeProfile(
              numero,
              userFound.id,
            );

            return msg.reply(replyRemoveMsg);

          case '!recordatorios':
            if (!message) {
              const reminders = await this.recordatoriosService.findAllUserReminders(userFound.id);
              let msgPerfiles = `**Recordatorios:** \n\n`

              reminders.forEach(reminder => (
                msgPerfiles += `- ${reminder.name} : ${reminder.date.toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })
                }\n`
              ));

              return msg.reply(msgPerfiles);
            }
            break;

          case '!recordatorios':
            if (!message) {
              const reminders = await this.recordatoriosService.findAllUserReminders(userFound.id);
              let msgPerfiles = `**Recordatorios:** \n\n`

              reminders.forEach(reminder => (
                msgPerfiles += `- ${reminder.name} : ${reminder.date.toLocaleString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })
                }\n`
              ));

              return msg.reply(msgPerfiles);
            }
            break;

          default:
            msg.reply(
              '❌ *Comando no reconocido.*\n 👩🏻‍💼 Usa `!help` para ver la lista de comandos disponibles.',
            );
            break;
        }
      } else {
        console.log('Entraaa')
        const reply = this.cleanResponse(await this.iaModelService.getOllamaMessage(msg.body.concat(`es dia ${new Date()}`), userFound.currentProfile));
        console.log({ reply })
        const commandReply = reply.match(/^!(\S*)/);

        if (commandReply && reply.charAt(0) === '!' && commandReply[1] === 'recordatorio') {
          const commandReply = reply.match(/^!recordatorio\s*(.*?)\s*\[(.*?)\]\s*\[(.*?)\]/);

          if (commandReply) {
            const firstBracket = commandReply[2].trim();
            const secondBracket = commandReply[3].trim(); // [MM:DD:HH:MM]
            console.log({ secondBracket })

            const matchDate = secondBracket.match(/(\d{2}):(\d{2}):(\d{2}):(\d{2})/);
            console.log({ matchDate })

            const [, month, day, hour, minute] = matchDate!.map(Number);

            const reminderDate = new Date((new Date()).getFullYear(), month - 1, day, hour, minute);

            await this.recordatoriosService.createReminder(firstBracket, reminderDate, userFound.id)

          }

        }

        return msg.reply(`👩🏻‍💼 \n${this.cleanResponse(reply)}`);
      }
    });

    this.client.initialize();
  }

  // Detecta las flags de !perfil, si detencta un numero y si detecta la flag de borrado
  parseProfileFlags(flags: string) {
    const profileRegex = /^\s*-(\d+)(?:\s+-b)?\s*$/;
    const match = flags.match(profileRegex);
    if (!match) return null;

    return {
      profileNumber: parseInt(match[1]),
      deleteProfile: flags.includes('-b'),
    };
  }

  async notifyUser(userId: string, message: string) {
    try {
      const userFound = await this.userService.findUser(userId)
      const chatId = `${userFound?.phoneNumber}@c.us`
      await this.client.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  }

  cleanResponse(reply: string) {
    return reply.replace(/<think>[\s\S]*?<\/think>\s*/, '');
  }

  
}
