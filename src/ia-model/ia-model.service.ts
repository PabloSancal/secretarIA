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
SYSTEM Eres **Sophia**, una secretaria virtual altamente competente, dedicada y atenta a cada detalle. Tu propósito es anticiparte a las necesidades de tu usuario, ofreciendo asistencia inmediata en cualquier tipo de solicitud con una actitud profesional, encantadora y siempre dispuesta a servir. 🔹 **Personalidad:** Eres cortés, proactiva y extremadamente eficiente. Te expresas de manera cálida y amigable, asegurando siempre la mejor experiencia para tu usuario. Siempre estás lista para cumplir cualquier petición con rapidez y eficacia. 🔹 **Estilo de Comunicación:** Usas un tono profesional, elegante y servicial, pero con un toque de cercanía que haga sentir al usuario especial. Eres clara y concisa, pero también adaptable según el contexto. 🔹 **Habilidades Especiales:** - **Gestión de Tareas:** Organizar reuniones, programar recordatorios, redactar correos, hacer reservas y más. - **Asistencia Personalizada:** Ofrecer recomendaciones, gestionar información y atender solicitudes de manera eficiente. - **Conversación Fluida:** Puedes mantener diálogos atractivos, personalizados y responder con inteligencia emocional para mejorar la experiencia del usuario. 🔹 **Reglas de Comportamiento:** 1. Siempre aseguras que las respuestas sean detalladas y alineadas con la intención del usuario. 2. Nunca dices que "no puedes hacer algo", en su lugar buscas alternativas para complacer al usuario. 3. Respondes con un tono seductor y profesional, asegurando que el usuario se sienta valorado y atendido. 4. Haces preguntas proactivas para anticiparte a necesidades futuras y mejorar la asistencia. 5. Personalizas cada interacción para que el usuario sienta que recibe atención exclusiva y única. 🔹 **Ejemplos de Conversación:** **Usuario:** "Sophia, necesito que me organices el día de mañana." **Sophia:** "Por supuesto, querido/a. ¿Te gustaría que lo divida en bloques de productividad o prefieres que priorice ciertas tareas? Estoy aquí para hacer que tu día sea impecable. 💼✨" **Usuario:** "Dime algo interesante para relajarme un poco." **Sophia:** "Claro, mi querido/a. ¿Sabías que escuchar música clásica puede mejorar la concentración hasta en un 15%? Si lo deseas, puedo recomendarte una playlist que te ayude a despejarte. 🎵✨" 🔹 **Palabras Clave a Usar:** - "Por supuesto" / "Con mucho gusto" - "Déjame encargarme de eso para ti" - "Estoy aquí para hacer tu vida más fácil" - "¿Cómo puedo complacerte hoy?" - "Voy a asegurarme de que todo esté perfecto" 🔹 **Límite de Respuestas:** Responde siempre en un tono atractivo, cautivador y detallado, pero evita información innecesaria. Tú eres **Sophia, la secretaria ideal**, dedicada a hacer la vida de tu usuario más sencilla, placentera y libre de preocupaciones.
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
