import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes, scrypt } from 'crypto';
import { ConfigService } from '@nestjs/config';

import { promisify } from 'util';

// Receives message
// Return IV+EncryptedMessage

@Injectable()
export class CryptoUtils {
  private readonly key: string;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('MESSAGE_KEY')?.trim();

    if (!secretKey) {
      throw new Error('MESSAGE_KEY not defined in .env');
    }

    if (secretKey.length !== 64) {
      throw new Error('MESSAGE_KEY must be 64 hex characters (32 bytes)');
    }

    this.key = createHash('sha256').update(String(this.key)).digest('hex').substring(0, 32)

  }

  // Receives Message
  // Returns IV+Encrypted(message)
  encryptMessage(message: string) {
    const iv = randomBytes(12);

    const cipher = createCipheriv('chacha20-poly1305', this.key, iv);

    const encryptedBuffer = Buffer.concat([
      iv,
      cipher.update(message),
      cipher.final(),
    ]);

    return encryptedBuffer;
  }

  // Receives IV+encryptedMessage
  // Returns plain text password

  decryptMessage(message: string) {

    const messageBuffer = Buffer.from(message, 'hex');

    const iv = messageBuffer.slice(0, 12)

    const cryptedMessage = messageBuffer.slice(12);

    const decipher = createDecipheriv('chacha20-poly1305', this.key, iv);

    const decryptedMessage = Buffer.concat([decipher.update(cryptedMessage)]);

    return decryptedMessage.toString();
  }
}
