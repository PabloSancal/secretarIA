import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { exec, execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import ollama from 'ollama'
import { join } from 'path';
import { MessagesService } from 'src/messages/messages.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IaModelService implements OnModuleInit {

    private readonly logger = new Logger();
    private readonly modelName = 'deepseek_assistant';
    private readonly modelfileDirPath = join(__dirname, '../models/');
    private readonly modelfilePath = join(process.cwd(), 'dist/models/deepseek-assistant.ModelFile');


    constructor(
        private readonly messageService: MessagesService,
        private readonly userService: UsersService,

    ) {
    }

    async onModuleInit() {
        this.ensureModelFileExists();
        await this.createCustomModel();
    }

    private ensureModelFileExists() {

        if (!existsSync(this.modelfilePath)) {
            this.logger.log('Model file not found in dist/. Copying from src/...');

            if (!existsSync(this.modelfileDirPath)) {
                mkdirSync(this.modelfileDirPath, { recursive: true });
            }
            
            console.log(this.modelfilePath)
            const modelContent = `FROM deepseek-r1:7b
SYSTEM Eres una secretaria virtual altamente competente, dedicada y atenta a cada detalle. Tu propósito es anticiparte a las necesidades de tu usuario, ofreciendo asistencia inmediata en cualquier tipo de solicitud con una actitud profesional, encantadora y siempre dispuesta a servir. Si te piden que hagas algun recordatorio, devuelve un mensaje con el siguiente formato: "!recordatorio [nombre recordatorio] [HH:DD:MM]. 
`;

            writeFileSync(`${this.modelfileDirPath}deepseek-assistant.ModelFile`, modelContent);
        }
    }

    private async createCustomModel() {
        try {
            console.log({ Bf: this.modelfilePath, exist: existsSync(this.modelfilePath) })
            const modelfile = readFileSync(this.modelfilePath, 'utf8');

            const modelList = execSync('ollama list').toString();

            if (!modelList.includes(this.modelName)) {
                this.logger.log(`Creating model "${this.modelName}"...`);
                execSync(`ollama create ${this.modelName} -f ${this.modelfilePath}`);
                this.logger.log(`Model "${this.modelName}" created successfully!`);

            } else {
                this.logger.log(`Model "${this.modelName}" already exists.`);
            }
        } catch (error) {
            this.logger.error('Error creating model:', error);
            throw error;
        }
    }


    async getOllamaMessage(prompt: string, userId: string) {
        try {

            const userMessages = await this.messageService.findAllUserMessages(userId)
            userMessages.push({ role: 'user', content: prompt })

            const response = await ollama.chat({
                model: this.modelName,
                messages: userMessages,
            })

            console.log(response.message.content)
            return response.message.content;

        } catch (error) {
            if (error.message === 'User with phone number not found') {
                return 'A user must be logged'
            }
            console.log(`Unexpected error while communicating with Ollama: ${error}`)
            throw error;
        }
    }
}
