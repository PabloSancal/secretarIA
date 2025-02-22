import { Controller, Get, Res } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import { OnEvent } from '@nestjs/event-emitter';

/**
 * @brief Handles HTTP requests related to WhatsApp, specifically managing QR code generation.
 */
@Controller('whatsapp')
export class WhatsappController {
  private qrCode: string;  // Holds the generated QR code as a string

  /**
   * @brief Initializes the controller with the WhatsApp service.
   */
  constructor(private readonly whatsappService: WhatsappService) { }

  /**
   * @brief Event listener that handles when a QR code is created.
   */
  @OnEvent('qrcode.created')
  handleQrcodeCreatedEvent(qrCode: string) {
    this.qrCode = qrCode;  // Store the QR code when the event is emitted
  }

  /**
   * @brief Endpoint to retrieve the generated QR code as a PNG image.
   * @returns A PNG image of the QR code or a 404 error if the QR code is not found.
   */
  @Get('qrcode')
  async getQrCode(@Res() response: Response) {
    if (!this.qrCode) {
      return response.status(404).send('QR code not found');  // Return 404 if QR code isn't available
    }

    // Set response headers and generate the QR code PNG image
    response.setHeader('Content-Type', 'image/png');
    QRCode.toFileStream(response, this.qrCode);  // Stream the QR code image to the response
  }
}
