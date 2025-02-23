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
          return msg.reply(`🔍 Thank you for answering the question!`);
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
              return msg.reply('⚠️ No personality questions available at the moment.');
            }

            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

            this.userQuestion = `❓ ${randomQuestion.question}\nOptions: ${randomQuestion.options.join(', ')}`;

            await msg.reply(
              `❓ ${randomQuestion.question}\nOptions: ${randomQuestion.options.join(', ')}`,
            );
            break;

          case '!help':
            msg.reply(
              "🌟 *SecretarIA - Comandos Disponibles* 🌟\n\n" +
              "📌 `!help` - Muestra esta lista de comandos.\n" +
              "💬 `<texto>` - Chatea con el modelo de IA.\n" +
              "📝 `!username <nombre>` - Cambia tu nombre de usuario.\n\n" +
              "👤 `!perfil` - Muestra todos tus perfiles.\n\n" +
              "👤 `!perfil -n` - Crea un nuevo perfil (n es un número).\n\n" +
              
              "❓ *Ejemplo de uso:*\n" +
              "👉 `Hola, ¿cómo estás?`\n" +
              "👉 `!username JuanPerez`\n\n" +
              "👉 `!recordatorios - Ver todos tus recordatorios`\n\n" +
              "⚡ _Escribe un comando y explora SecretarIA!_\n\n"
                );
            break;

          case '!remove':
            const deletedUser = await this.userService.removeUser(phoneNumber);
            return msg.reply(
              `🚫 *${deletedUser.name}* with number 📞 *${deletedUser.phoneNumber}* has been successfully deleted.`,
            );

          case '!username':
            if (!message)
              return msg.reply(
                '⚠️ *You must specify a new username.*\n\n📝 Example: `!username Pablo`',
              );
            const userName = await this.userService.changeName(message, phoneNumber);
            return msg.reply(`✅ *Username successfully updated to:* *${message}* 🎉`);

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

          default:
            msg.reply(
              '❌ *Unrecognized command.*\n 👩🏻‍💼 Use `!help` to see the list of available commands.',
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
