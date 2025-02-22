import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, ClientOptions, LocalAuth } from 'whatsapp-web.js';
import { MessagesService } from '../messages/messages.service';
import { IaModelService } from 'src/ia-model/ia-model.service';
import { UsersService } from 'src/users/users.service';
import * as os from 'os';



@Injectable()
export class WhatsappService implements OnModuleInit {
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
            );
            this.eventEmitter.emit('qrcode.created', qr);
        });

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


                } else if (command[0] === '!username') {
                    const message = msg.body.slice(command[0].length + 1)
                    const userName = await this.userService.changeName(message, phoneNumber)
                    return msg.reply(userName.name)

                } else if (command[0] === '!message') {
                    const message = msg.body.slice(command[0].length + 1)
                    const reply = await this.iaModelService.getOllamaMessage(message, userFound.id)
                    return msg.reply(reply)
                }

            }
        });
        this.client.initialize();
    }
}