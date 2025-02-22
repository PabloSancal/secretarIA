# 🤖 SecretarIA - Whatsapp Virtual Secretary

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
Ensure you have the following installed on your system:
- **Node.js** (>= 16)
- **npm** (Node Package Manager)
- **Docker & Docker Compose**
- **Google Chrome**

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
npm install npm i whatsapp-web.js npm i qrcode
```

### ⚙️ Configure Environment Variablesure Environment Variables
Create a `.env` file in the root directory with the following variables defined, as an example we will provide a simple config:

```sql
PORT=3000

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres-db
DATABASE_URL="postgresql://postgres:123456@localhost:5432/postgres-db?schema=public"

MESSAGE_KEY='f3b3a1c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1'
```

### ▶️ Run the Application
```bash
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [NestFactory] Starting Nest application...
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] ConfigHostModule dependencies initialized +11ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] DiscoveryModule dependencies initialized +0ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] ConfigModule dependencies initialized +0ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] EventEmitterModule dependencies initialized +1ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] AppModule dependencies initialized +0ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] MessagesModule dependencies initialized +4ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [InstanceLoader] WhatsappModule dependencies initialized +0ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [RoutesResolver] MessagesController {/messages}: +3ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [RouterExplorer] Mapped {/messages, POST} route +2ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [RouterExplorer] Mapped {/messages/all, GET} route +1ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [RoutesResolver] WhatsappController {/whatsapp}: +0ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [RouterExplorer] Mapped {/whatsapp/qrcode, GET} route +0ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [NestApplication] Nest application successfully started +69ms
[Nest] 14178  - 22/02/2025, 4:17:16     LOG [Main] SecretarIA running on PORT 3000
```

Once the application ends loading, and after the database is set a QR-Code should be opent in Google Chrome. Once the code is scanned by the Server-Side WhatsApp phone number the bot is set up and ready to use.


---

## 📜 License
This project is licensed under the **MIT License**.

💡 **Feel free to use it or modify it for your own needs.** 🚀

💡 **Contributions are welcome!** Feel free to fork this repository and submit pull requests. 🤝✨