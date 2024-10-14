import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API);
  }

  async sendAlert(chain: string, oldPrice: number, newPrice: number) {
    await this.resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: 'hyperhire_assignment@hyperhire.in',
      subject: `Price Alert: ${chain} price increased by more than 3%`,
      html: `<p>The price of ${chain} has increased from <strong>$${oldPrice}</strong> to <strong>$${newPrice}</strong>!</p>`
    })
  }

  async sendPriceAlert(chain: string, targetPrice: number, currentPrice: number, email: string) {
    await this.resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Price Alert: ${chain} reached target price`,
      html: `<p>The price of ${chain} has reached your target price of <strong>$${targetPrice}</strong>. Current price: <strong>$${currentPrice}</strong>!</p>`
    })
  }
}