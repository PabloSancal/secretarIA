# 🤝 Contributing to SecretarIA

Thank you for your interest in contributing to **SecretarIA**. Your contributions help enhance the quality and functionality of this project. Please adhere to the following guidelines to ensure a structured and efficient contribution process.

## 🛠 Development Setup

### Prerequisites
Ensure the following dependencies are installed:
- **Node.js** (>= 16)
- **npm**
- **Docker & Docker Compose** (for database containerization)
- **Google Chrome** (for automation compatibility)

### Installation
```sh
git clone https://github.com/your-username/SecretarIA.git
cd SecretarIA
npm install
```

### Configuration
Create a `.env` file in the root directory with the following environment variables:
```ini
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgresDb
DATABASE_URL="postgresql://postgres:123456@localhost:5432/postgresDb?schema=public"
MESSAGE_KEY='yourSecureMessageKey'
```

### Running the Application
```sh
npm run start
```

## 🔄 Contribution Workflow

1. **Fork the repository** and clone it locally.
2. **Create a new branch** for your feature or fix:
   ```sh
   git checkout -b featureName
   ```
3. **Adhere to coding conventions**:
   - Use **camelCase** for variables and functions.
   - Use **PascalCase** for classes and components.
   - Ensure **proper indentation and spacing**.
   - Keep modules and functions **concise and single-responsibility**.
4. **Thoroughly test your modifications** before committing.
5. **Follow conventional commit standards:**
   ```sh
   git commit -m "feat: Implement new feature description"
   ```
6. **Push your branch** and submit a **Pull Request (PR)**.

## 📋 Code Style and Best Practices

- Follow **existing project conventions**.
- **Commit messages must follow structured formatting:**
  - `feat`: Introduces a new feature.
  - `fix`: Resolves a bug.
  - `docs`: Updates to documentation.
  - `style`: Code formatting with no functional changes.
  - `refactor`: Code restructuring without altering functionality.
  - `perf`: Performance optimizations.
  - `test`: Adds or improves tests.
  - `chore`: General maintenance tasks (e.g., dependency updates).
- Ensure **unit and integration tests pass** before submission.
- Keep PRs **concise and topic-focused** to streamline review processes.

## 🛠 Reporting Issues
If you encounter a bug, submit an [issue](https://github.com/your-username/SecretarIA/issues) including:
- A **detailed problem description**.
- Steps to **reproduce the issue**.
- Expected vs. actual behavior.
- Screenshots or logs (if applicable).

## 🚀 Feature Requests
To propose new features, open a **feature request issue** with:
- A detailed **feature description**.
- A strong **justification for inclusion**.
- Possible **implementation strategies**.

## 🔗 Additional Resources
- [SecretarIA Repository](https://github.com/your-username/SecretarIA)
- [NestJS Documentation](https://docs.nestjs.com/)
- [WhatsApp Web.js Documentation](https://github.com/pedroslopez/whatsapp-web.js/)
- [DeepSeek AI Models](https://deepseek.ai/)

## 🎯 Final Notes
All contributions undergo review prior to merging. Your efforts are highly valued—thank you for helping improve **SecretarIA**.

