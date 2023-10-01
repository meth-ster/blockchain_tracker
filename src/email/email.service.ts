import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendAlert(chain: string, oldPrice: number, newPrice: number) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Alert: ${chain} price increased by more than 3%`,
      text: `The price of ${chain} has increased from $${oldPrice} to $${newPrice}.`,
    });
  }

  async sendPriceAlert(chain: string, targetPrice: number, currentPrice: number, email: string) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Price Alert: ${chain} reached target price`,
      text: `The price of ${chain} has reached your target price of $${targetPrice}. Current price: $${currentPrice}.`,
    });
  }
}