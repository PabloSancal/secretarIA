# 🤝 Contributing to SecretarIA

Thank you for considering contributing to **SecretarIA**! We welcome all kinds of contributions, from fixing minor bugs to implementing new features and improving documentation. 🚀

## 🛠 How to Contribute

### 1️⃣ Fork the Repository
1. Navigate to the [SecretarIA GitHub repository](https://github.com/your-username/SecretarIA).
2. Click on the **Fork** button in the top right corner.
3. Clone your forked repository locally:
   ```sh
   git clone https://github.com/your-username/SecretarIA.git
   cd SecretarIA
   ```
4. Add the original repository as a remote:
   ```sh
   git remote add upstream https://github.com/original-username/SecretarIA.git
   ```

### 2️⃣ Set Up the Development Environment
Ensure you have the following prerequisites installed:
- **Node.js** (>= 16)
- **npm** (Node Package Manager)
- **Docker & Docker Compose** (optional for database setup)
- **Google Chrome**

#### Install Dependencies
```sh
npm install
```

#### Configure Environment Variables
Create a `.env` file in the root directory and add:
```ini
PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres-db
DATABASE_URL="postgresql://postgres:123456@localhost:5432/postgres-db?schema=public"
MESSAGE_KEY='your-secure-message-key'
```

### 3️⃣ Run the Application
To start the application locally:
```sh
npm run start
```
This will launch the NestJS server. If everything is set up correctly, you should see logs indicating that the server is running.

### 4️⃣ Create a New Branch
Always create a new branch for your work before making changes:
```sh
git checkout -b feature-name
```

### 5️⃣ Make Your Changes
- Follow the existing **code style and structure**.
- Ensure your changes **do not break existing functionality**.
- Test your code before committing.

### 6️⃣ Commit and Push Changes
```sh
git add .
git commit -m "Add new feature: description"
git push origin feature-name
```

### 7️⃣ Submit a Pull Request (PR)
1. Go to your fork on GitHub.
2. Click on **Compare & pull request**.
3. Write a clear **title** and **description** for your PR.
4. Submit the PR for review!

## 📋 Contribution Guidelines

✔ Follow **clean code principles** and maintain readability.
✔ Always **test your code** before submitting a PR.
✔ Keep PRs **small and focused**—one feature/fix per PR.
✔ Use **meaningful commit messages**.
✔ Ensure all **dependencies are installed** before running the project.
✔ Respect and follow the **code of conduct**.

## 🔍 Reporting Issues
If you find a bug, please open an [issue](https://github.com/your-username/SecretarIA/issues) with:
- A **clear description** of the problem.
- Steps to **reproduce** the issue.
- Expected and actual behavior.
- Screenshots (if applicable).

## 🌟 Feature Requests
Have an idea for a feature? Open a **feature request issue** with:
- A clear **explanation of the feature**.
- Why it would be useful.
- Potential implementation suggestions.

## 🛡️ Code of Conduct
All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, inclusive, and professional. 🤝

## 🔗 Resources
- [SecretarIA Repository](https://github.com/your-username/SecretarIA)
- [NestJS Documentation](https://docs.nestjs.com/)
- [WhatsApp Web.js Documentation](https://github.com/pedroslopez/whatsapp-web.js/)
- [DeepSeek AI Models](https://deepseek.ai/)

## 🎉 Thank You!
Your contributions make **SecretarIA** better! 🚀
Happy coding! 💻😃

