# 🔒 Security Policy for SecretarIA

## 🚀 Supported Versions

SecretarIA was developed as part of a **hackathon project**, and while it currently lacks a formal versioning system, the following structure is planned for future releases:

- **Major updates (`+1.0`)**: Introduce significant changes or new features.
- **Minor updates (`+0.1`)**: Contain small improvements, optimizations, or bug fixes.

All security-related updates will be documented, tagged, and communicated transparently.

---


## 📦 Security Considerations for Dependencies

### **Key Dependencies**
SecretarIA relies on several dependencies that require regular security reviews:

#### **Core Dependencies**
| Package                 | Version  | Purpose |
|-------------------------|---------|---------|
| `nestjs/common`         | ^11.0.1 | Core NestJS framework |
| `nestjs/config`         | ^4.0.0  | Environment configuration |
| `nestjs/event-emitter`  | ^3.0.0  | Event-driven architecture |
| `whatsapp-web.js`       | ^1.26.0 | WhatsApp Web automation |
| `prisma`               | ^6.4.1  | ORM for database management |
| `qrcode`               | ^1.5.4  | QR Code generation |

#### **Development Dependencies**
| Package                | Version  | Purpose |
|------------------------|---------|---------|
| `jest`                | ^29.7.0 | Testing framework |
| `eslint`              | ^9.18.0 | Linting and formatting |
| `prettier`            | ^3.4.2  | Code formatting |

Security vulnerabilities within **whatsapp-web.js**, **Prisma**, or **NestJS** core packages could impact data privacy, so you should **regularly monitor and apply patches** to these dependencies.


---

## 📢 Reporting a Vulnerability

If you discover a security vulnerability, please report it **privately** before disclosing it publicly. This allows us to mitigate the risk before users are affected.

### 🔹 How to Report
- GitHub Security Advisory: [Submit here](https://github.com/pablosancal/SecretarIA/security/advisories)

### 🔹 What to Include
- **Detailed description** of the vulnerability.
- Steps to **reproduce the issue**.
- **Potential impact** and affected versions.
- Any suggested **mitigations or fixes**.

We aim to acknowledge receipt within **48 hours** and address the issue as quickly as possible.

---

## 🔄 Dependency Security Monitoring

SecretarIA relies on various **third-party dependencies**, primarily within **Node.js** and **NestJS**. Security is monitored through:

- **Regular dependency audits** (`npm audit`).
- **Automated vulnerability scans** (GitHub Dependabot).
- **Reviewing security patches** from upstream libraries.

If a **critical vulnerability** is found in any dependency, we will:
1. Investigate and validate the impact.
2. Patch or update affected packages.
3. Notify users through:
   - GitHub Security Advisories
   - Release notes

---

## ✅ Security Update Process

To maintain security, we:
1. **Monitor vulnerabilities** in dependencies using automated security scans.
2. **Regularly release updates** with security patches.
3. **Notify users** of critical security fixes via:
   - GitHub Releases
   - Security Advisories
   - Email notifications (if subscribed)

To ensure security, **always use the latest stable version**.

---

## 🔍 Disclosure Policy  

We are a team of two people and follow a **responsible disclosure policy** to ensure vulnerabilities are addressed before public disclosure. However, given our small team size, some processes may take longer than usual.  

### Standard Process:  

1. **Initial Report** → The vulnerability is submitted privately.  
2. **Acknowledgment** → We do our best to confirm receipt within **48 hours**, but it may take a bit longer in some cases.  
3. **Investigation** → We assess the impact and mitigation timeline (**this may take up to 10 days**).  
4. **Fix Development** → A patch is developed, tested, and refined (**typically within 21 days, but complex issues may take longer**).  
5. **Security Update Release** → Affected users are notified.  
6. **Public Disclosure** → The vulnerability is disclosed publicly, with credit to the researcher if requested.  

For **critical vulnerabilities**, we try to prioritize and expedite the process, but we appreciate your patience and understanding given our small team.  


---

## 📌 Additional Resources
- [SecretarIA Repository](https://github.com/pablosancal/SecretarIA)
- [GitHub Security Advisories](https://github.com/pablosancal/SecretarIA/security/advisories)
- [OWASP Security Guidelines](https://owasp.org/)

**Thank you for helping us keep SecretarIA secure!** 🔒🚀
