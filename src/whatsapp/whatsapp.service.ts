import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class WhatsappService implements OnModuleInit {

    private client: Client = new Client({
        authStrategy: new LocalAuth(),
    });
    private readonly logger = new Logger(WhatsappService.name);

    constructor(
        private eventEmitter: EventEmitter2,
        private configService: ConfigService,
        private messagesService: MessagesService,
    ) { }

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

        this.client.on('message', (msg) => {
            this.logger.verbose(`${msg.from}: ${msg.body}`);

            const command = msg.body.match(/^!(\S*)/);
            if (command && msg.body.charAt(0) === '!') {

                if (command[0] === '!hi') {
                    msg.reply('Buenas y santas');

                } else if (command[0] === '!message') {
                    const message = msg.body.slice(command[0].length + 1)
                    this.messagesService.createMessage('a2946dce-4719-40f8-97e8-95121b8230b6', message)
                }

            }
        });
        this.client.initialize();
    }
}
