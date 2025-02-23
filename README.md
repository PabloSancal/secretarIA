# SecretarIA - Whatsapp Virtual Secretary

<p align="center">
  <img src="secretarIA_logo.png" alt="SecretarIA Logo" width="200">
</p>

SecretarIA is a **virtual secretary** powered by WhatsApp Web automation, designed to streamline message management and automate responses with a Local AI Model.

## ✨ Simplicity & Ease of Use
The key strength of SecretarIA lies in its **simplicity**. By registering a phone number on WhatsApp and adding it as a contact, you instantly have access to your own **private chatbot**. With no complex setup required, SecretarIA enables you to:
- 📅 **Schedule events** effortlessly
- 💬 **Chat naturally** with the AI-powered assistant
- ⚡ **Automate responses** for enhanced productivity

## ⚠️ Disclaimer
This project was developed in **36 hours** during the **HACKUDC hackathon** by a team of two people. It is an experimental project and may require further improvements for production use.

## 🛡️ Key Feature: Local AI Processing & Free Usage
One of the standout features of SecretarIA is that **all AI processing runs locally on your machine**, ensuring:
- 🔒 **No data is sent to external servers**
- 🛑 **Full privacy is maintained**
- 🧠 **DeepSeek AI model** is used for message automation without exposing sensitive information
- 🆓 **Completely free to use** with DeepSeek's open-source models
- 🧠 **Emotional analysis** with user questions.

This project has been tested using **DeepSeek's first-generation of reasoning models**, which offer comparable performance to **OpenAI-o1**. It includes six dense models distilled from **DeepSeek-R1**, based on **Llama** and **Qwen** architectures.

## 🚀 Technologies Used
- 🟢 **Node.js** - JavaScript runtime for backend execution
- 🏗 **NestJS** - Progressive Node.js framework for scalable applications
- 📲 **whatsapp-web.js** - WhatsApp Web automation library
- 🎭 **Puppeteer** - Headless browser automation
- 🗄 **PostgreSQL** - Database for storing messages
- 🐳 **Docker** - Containerized deployment (by default running on 5432)
- 🌐 **Express.js** - Web server framework
- 🔄 **EventEmitter** - Event-driven architecture

## 🛠 Installation & Setup

### ✅ Prerequisites


| 🛠 Software          | 📌 Version                      | ℹ️ Description                          |
|---------------------|--------------------------------|----------------------------------------|
| **Node.js**        | v22.14.0                         | JavaScript runtime for backend execution |
| **npm**            | 10.9.2                          | Node Package Manager                   |
| **Docker**         | 26.1.3 (build 26.1.3) | Containerization platform              |
| **Docker Compose** | 1.29.2          | Tool for managing multi-container apps |
| **Chromium**       | 131.0.6778.85           | Required for Puppeteer automation      |


## 🔐 Encryption Details

### 🔑 Encryption Algorithm
- Uses **ChaCha20-Poly1305** for **authenticated encryption**.
- Ensures **data integrity and confidentiality**.

### 🛠 Key & IV Specifications
- **Key length:** 🔑 **256 bits (32 bytes)**.
- **IV length:** 🏷️ **12 bytes (96 bits)**, randomly generated for each encryption.

### 🔄 Encryption & Decryption Process
- 🔒 **Encryption:** Generates a random IV, encrypts the message, and concatenates **IV + Encrypted Message**.
- 🔓 **Decryption:** Extracts the IV, decrypts the message using the same key.

----

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/SecretarIA.git
cd SecretarIA
npm install
npm i whatsapp-web.js
npm i qrcode
```

### ⚙️ Configure Environment Variablesure Environment Variables
Create a `.env` file in the root directory with the following variables defined, as an example we will provide a simple config:

```sql
PORT=3000
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL="your-database-url"
MESSAGE_KEY='your-message-key'
```


### ▶️ Run the Application


```bash
npx prisma migrate dev
npm run start
```
Or to see the full process:

```bash
npx prisma migrate dev
npm run start:dev
```

The result should be something like this:

```bash
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [NestFactory] Starting Nest application...
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] UsersModule dependencies initialized +17ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] RecordatoriosModule dependencies initialized +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] ConfigHostModule dependencies initialized +1ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] DiscoveryModule dependencies initialized +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] ScheduleModule dependencies initialized +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] EventEmitterModule dependencies initialized +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] AppModule dependencies initialized +1ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] IaModelModule dependencies initialized +1ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] MessagesModule dependencies initialized +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [InstanceLoader] WhatsappModule dependencies initialized +1ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [RoutesResolver] MessagesController {/messages}: +3ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [RouterExplorer] Mapped {/messages, POST} route +2ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [RouterExplorer] Mapped {/messages/all, GET} route +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [RoutesResolver] WhatsappController {/whatsapp}: +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [RouterExplorer] Mapped {/whatsapp/qrcode, GET} route +0ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG Model "deepseek_assistant" already exists.
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [NestApplication] Nest application successfully started +214ms
[Nest] 67788  - 22/02/2025, 23:50:35     LOG [Main] SecretarIA running on PORT 3000
[Nest] 67788  - 22/02/2025, 23:50:39     LOG [WhatsappService] Connection successful
```

Once the application ends loading, and after the database is set a QR-Code should be opent in Google Chrome. Once the code is scanned by the Server-Side WhatsApp phone number the bot is set up and ready to use.


## 🎨 Code Style & Project Structure

SecretarIA follows a **modular** approach using **NestJS**. To maintain code quality and consistency, adhere to the following guidelines:

### 📌 General Guidelines
- ✅ **TypeScript** as the primary language.
- ✅ Use of **Decorators** (`@Injectable()`, `@Controller()`, `@OnEvent()`, etc.).
- ✅ Modular code with **separation of concerns** (`WhatsappService`, `MessagesService`, etc.).
- ✅ Clear logging with **NestJS Logger** for debugging and monitoring.

### 📁 Project Structure    
The project follows a **well-organized modu   lar structure**:

```bash
📦 SecretarIA   
├── 📂 src    
│   ├── 📜 main.ts                            # Entry point of the application
│   ├── 📜 app.module.ts                      # Main module of the application
│   ├── 📂 config   
│   │   ├── 📜 config.ts                      # Configuration settings
│   ├── 📂 ia-model   
│   │   ├── 📜 ia-model.module.ts             # AI Model module
│   │   ├── 📜 ia-model.service.ts            # AI Model service
│   ├── 📂 messages   
│   │   ├── 📂 CryptoUtils    
│   │   │   ├── 📜 CryptoUtils.ts             # Utility functions for cryptography
│   │   ├── 📂 dto    
│   │   │   ├── 📜 create-message.dto.ts      # DTO for creating messages
│   │   │   ├── 📜 find-user-messages.dto.ts  # DTO for fetching user messages
│   │   ├── 📜 messages.module.ts             # Messages module definition
│   │   ├── 📜 messages.service.ts            # Messages service logic
│   ├── 📂 models   
│   │   ├── 📜 deepseek-assistant.ModelFile    # DeepSeek AI model file
│   ├── 📂 personality
│   │   ├── 📜 personality.module.ts           # Personality Emotions Module 
│   │   ├── 📜 personality.service.ts          # Personality Emotions Service
│   │   └── 📜 questions.json                  # Personality Questions
│   ├── 📂 prisma
│   │   ├── 📜 prisma.module.ts
│   │   └── 📜 prisma.service.ts
│   ├── 📂 recordatorios    
│   │   ├── 📜 recordatorios.module.ts        # Reminders module
│   │   ├── 📜 recordatorios.service.ts       # Reminders service
│   ├── 📂 users    
│   │   ├── 📜 users.module.ts                # Users module
│   │   ├── 📜 users.service.ts               # Users service
│   ├── 📂 whatsapp   
│   │   ├── 📜 whatsapp.controller.ts         # WhatsApp API controller
│   │   ├── 📜 whatsapp.module.ts             # WhatsApp module definition
│   │   ├── 📜 whatsapp.service.ts            # WhatsApp service logic
├── 📜 tsconfig.build.json                    # TypeScript configuration for build
└── 📜 tsconfig.json                          # TypeScript configuration file

```   

The project uses **dependency injection** t   o manage services without manual instantiation:
```ts   
constructor(    
  private eventEmitter: EventEmitter2,    
  private configService: ConfigService,
  private iaModelService: IaModelService,
  private userService: UsersService,
) {}
```


## 📜 License  

This project is licensed under the **MIT License**.  

📄 The full license text can be found in [LICENSE](LICENSE).  

💡 **Feel free to use it or modify it for your own needs.** 🚀  

🤝 **Contributions are welcome!** Feel free to fork this repository and submit pull requests. ✨  

For contribution guidelines, please check [CONTRIBUTING](CONTRIBUTING.md). 📜  