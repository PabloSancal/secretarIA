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
 * @brief WhatsappService - Handles interactions with WhatsApp Web using whatsapp-web.js.
 */
@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly isMacOS: boolean = os.platform() === 'darwin';
  private client: Client;
  private readonly logger = new Logger(WhatsappService.name);
  private userQuestion: string;

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
   * @brief Initializes the WhatsApp client and sets up event listeners.
   */
  onModuleInit() {
    this.client.on('qr', (qr) => {
      const port = this.configService.get<number>('PORT');
      const apiPath = this.configService.get<string>('API_URL');
      this.logger.log(`QrCode: ${apiPath}:${port}/whatsapp/qrcode`);
      this.eventEmitter.emit('qrcode.created', qr);
    });

    this.client.on('ready', () => {
      this.logger.log('Connection successful!!');
    });

    /**
     * @brief Listens for incoming messages and processes commands.
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

      if (msg.hasQuotedMsg) {
        const quotedMsg = await msg.getQuotedMessage();

        if (quotedMsg.body === this.userQuestion) {
          const userEmotion = `The user responded to ${quotedMsg.body} feeling ${msg.body}`;
          this.messageService.createMessage(userFound.currentProfile, userEmotion);
          return msg.reply(`🔍 Gracias por responder la pregunta!`);
        }
      }

      const command = msg.body.match(/^!(\S*)/);

      if (command && msg.body.charAt(0) === '!') {
        const commandName = command[0];
        const message = msg.body.slice(commandName.length + 1);
        switch (commandName) {
          case '!personalidad':
            const questions = this.personalityService.getQuestions();

            if (!questions || questions.length === 0) {
              return msg.reply('⚠️ No hay preguntas de personalidad disponibles de momento ⌛️');
            }

            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

            this.userQuestion = ` ${randomQuestion.question}\nOptions: ${randomQuestion.options.join(', ')}❓`;

            await msg.reply(
              `❓_*${randomQuestion.question}*_\n*Opciones*: ${randomQuestion.options.join(', ')}`,
            );
            break;

          case '!help':
            msg.reply(
              "🌟 *SecretarIA - Comandos Disponibles* 🌟\n" +
              "📌 `!help` - Muestra esta lista de comandos.\n" +
              "💬 `<texto>` - Chatea con el modelo de IA.\n" +
              "📝 `!username <nombre>` - Cambia tu nombre de usuario.\n" +
              "❤️‍🩹 `!personalidad` - Test de personalidad que se aplica al contexto actual.\n" +
              "👤 `!perfil` - Muestra todos tus perfiles.\n" +
              "👤 `!perfil -n` - Crea un nuevo perfil (n es un número).\n" +

              "❓ *Ejemplo de uso:*\n" +
              "👉 `Hola, ¿cómo estás?`\n" +
              "👉 `!username JuanPerez`\n" +
              "👉 `!recordatorios - Ver todos tus recordatorios`\n\n" +
              "⚡ _Escribe un comando y explora SecretarIA!_\n"
            );
            break;

          case '!remove':
            const deletedUser = await this.userService.removeUser(phoneNumber);
            return msg.reply(
              `🚫 *${deletedUser.name}* con número 📞 *${deletedUser.phoneNumber}* ha sido borrado.`,
            );


          case '!perfil':
            const profiles = await this.userService.getAllProfiles(userFound.id);
            if (!message) {
              let msgPerfiles = `*Perfiles:*\n`
              profiles.forEach(profile => (
                msgPerfiles += `\n${userFound.currentProfile === profile.id ? '🟢' : ''} Perfil ${profile.number}`
              ));

              return msg.reply(msgPerfiles);
            }

            const profileFlags = this.parseProfileFlags(message);

            if (!profileFlags?.profileNumber) {
              return msg.reply('Formato incorrecto. Usa: !perfil -<número>');
            }

            const numero = profileFlags.profileNumber;

            if (!profileFlags.deleteProfile) {
              const profileFound = profiles.find(profile => profileFlags.profileNumber === profile.number)

              if (profileFound) {
                this.userService.changeProfile(profileFound.id, userFound.id)
                return msg.reply(`Cambiando a perfil ${profileFound.number}`)
              } else {

                await this.userService.createProfile(userFound.id, numero);
                return msg.reply(`Nuevo perfil: ${numero}`);
              }
            }

            const replyRemoveMsg = await this.userService.removeProfile(
              numero,
              userFound.id,
            );

            return msg.reply(replyRemoveMsg);


          case '!username':
            if (!message)
              return msg.reply(
                '⚠️ *Debes espicificar un nombre de usuario.*\n\n📝 Ejemplo: `!username Pablo`',
              );
            const userName = await this.userService.changeName(message, phoneNumber);
            return msg.reply(`✅ *Nombre de usuari actualizado:* *${message}* 🎉`);

          case '!recordatorios':
            if (!message) {
              const reminders = await this.recordatoriosService.findAllUserReminders(userFound.id);
              let msgPerfiles = `*Recordatorios:* \n\n`

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

          default:
            msg.reply(
              '❌ *Comando no reconocido.*\n 👩🏻‍💼 Usa `!help` para ver la lista de comandos.',
            );
            break;
        }
      } else {
        const reply = this.cleanResponse(await this.iaModelService.getOllamaMessage(msg.body.concat(`es dia ${new Date()}`), userFound.currentProfile));

        const commandReply = reply.match(/!recordatorio\s*(.*?)\s*\[(.*?)\]\s*\[(.*?)\]/);

        if (commandReply) {
          const commandReply = reply.match(/!recordatorio\s*(.*?)\s*\[(.*?)\]\s*\[(.*?)\]/);
          if (commandReply) {
            const firstBracket = commandReply[2].trim();
            const secondBracket = commandReply[3].trim(); // [MM:DD:HH:MM]
            const matchDate = secondBracket.match(/(\d{2}):(\d{2}):(\d{2}):(\d{2})/);

            const [, month, day, hour, minute] = matchDate!.map(Number);

            const reminderDate = new Date((new Date()).getFullYear(), month - 1, day, hour, minute);

            await this.recordatoriosService.createReminder(firstBracket, reminderDate, userFound.id)
            return msg.reply(`👩🏻‍💼 Recordatorio añadido !!`);
          }

        }

        await this.messageService.createMessage(userFound.currentProfile, msg.body)

        return msg.reply(`👩🏻‍💼 \n${this.cleanResponse(reply)}`);
      }
    });

    this.client.initialize();
  }

  /**
   * @brief Parses profile flags from a given string.
   * @param flags - The input flags string.
   * @returns Parsed profile information.
   */
  parseProfileFlags(flags: string) {
    const profileRegex = /^\s*-(\d+)(?:\s+-b)?\s*$/;
    const match = flags.match(profileRegex);
    if (!match) return null;

    return {
      profileNumber: parseInt(match[1]),
      deleteProfile: flags.includes('-b'),
    };
  }

  /**
   * @brief Notifies a user by sending a message through WhatsApp.
   * @param userId - The ID of the user.
   * @param message - The message to send.
   */
  async notifyUser(userId: string, message: string) {
    try {
      const userFound = await this.userService.findUser(userId);
      const chatId = `${userFound?.phoneNumber}@c.us`;
      await this.client.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  /**
   * @brief Cleans the response text by removing unnecessary tags.
   * @param reply - The input reply string.
   * @returns Cleaned response string.
   */
  cleanResponse(reply: string) {
    return reply.replace(/<think>[\s\S]*?<\/think>\s*/, '');
  }
}
