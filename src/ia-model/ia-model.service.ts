import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
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
        private configService: ConfigService

    ) {}

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
            const modelContent = this.configService.get<string>('MODEL_CONTEXT')!;

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
