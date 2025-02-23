import { Controller, Get, Res } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import { OnEvent } from '@nestjs/event-emitter';

/**
 * @brief Controller for handling WhatsApp-related requests.
 */
@Controller('whatsapp')
export class WhatsappController {
  private qrCode: string;

  constructor(private readonly whatsappService: WhatsappService) {}

  /**
   * @brief Event listener for QR code creation.
   * @param qrCode - The generated QR code string.
   */
  @OnEvent('qrcode.created')
  handleQrcodeCreatedEvent(qrCode: string) {
    this.qrCode = qrCode;
  }

  /**
   * @brief Retrieves the latest WhatsApp QR code.
   * @param response - Express response object.
   * @returns QR code as an image or a 404 error if not found.
   */
  @Get('qrcode')
  async getQrCode(@Res() response: Response) {
    if (!this.qrCode) {
      return response.status(404).send('QR code not found');
    }

    response.setHeader('Content-Type', 'image/png');
    QRCode.toFileStream(response, this.qrCode);
  }
}
