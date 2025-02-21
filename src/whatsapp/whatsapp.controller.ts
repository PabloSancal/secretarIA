import { Controller, Get, Res } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import { OnEvent } from '@nestjs/event-emitter';

@Controller('whatsapp')
export class WhatsappController {
  private qrCode: string;

  constructor(private readonly whatsappService: WhatsappService) { }

  @OnEvent('qrcode.created')
  handleQrcodeCreatedEvent(qrCode: string) {
    this.qrCode = qrCode;
  }

  @Get('qrcode')
  async getQrCode(@Res() response: Response) {
    if (!this.qrCode) {
      return response.status(404).send('QR code not found');
    }

    response.setHeader('Content-Type', 'image/png');
    QRCode.toFileStream(response, this.qrCode);
  }
}
