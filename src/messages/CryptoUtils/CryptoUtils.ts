import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { ConfigService } from '@nestjs/config';

import { promisify } from 'util';

// Receives message
// Return IV+EncryptedMessage

@Injectable()
export class CryptoUtils {
  private readonly key: Buffer;

  // Gets the key from the .env
  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('MESSAGE_KEY');

    if (!secretKey) {
      throw new Error('MESSAGE_KEY not defined in .env');
    }

    if (secretKey.length != 32) {
      throw new Error('MESSAGE_KEY must be 32 characters long');
    }

    this.key = Buffer.from(secretKey, 'hex');
  }

  // Receives Message
  // Returns IV+Encrypted(message)
  encryptMessage(message: string): string {
    const iv = randomBytes(12);

    const cipher = createCipheriv('chacha20-poly1305', this.key, iv);

    const encryptedBuffer = Buffer.concat([
      iv,
      cipher.update(message, 'utf8'),
      cipher.final(),
    ]);

    return `${encryptedBuffer}`;
  }

  // Receives IV+encryptedMessage
  // Returns plain text password
  decryptMessage(message: string): string {
    const iv = message.slice(0, 12);

    const cryptedMessage = message.slice(16, message.length);

    const decipher = createDecipheriv('chacha20-poly1305', this.key, iv);

    const decryptedMessage = decipher.update(cryptedMessage, 'utf8');

    return `${decryptedMessage}`;
  }
}
