import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private emailService: EmailService,
  ) {}

  async setAlert(chain: string, targetPrice: number, email: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { chain } });
    if (alert) {
      alert.targetPrice = targetPrice;
      alert.email = email;
      return this.alertRepository.save(alert);
    } else {
      const newAlert = new Alert();
      newAlert.chain = chain;
      newAlert.targetPrice = targetPrice;
      newAlert.email = email;
      return this.alertRepository.save(newAlert);
    }
  }

  async checkAlerts(chain: string, currentPrice: number): Promise<void> {
    const alert = await this.alertRepository.findOne({ where: { chain } });

    if (alert) {
      if ((alert.targetPrice >= currentPrice && alert.targetPrice < currentPrice * 1.01) ||
          (alert.targetPrice <= currentPrice && alert.targetPrice > currentPrice * 0.99)) {
        await this.emailService.sendPriceAlert(chain, alert.targetPrice, currentPrice, alert.email);
        // await this.alertRepository.remove(alert);
      }
    }
  }

  async getAlert(chain: string): Promise<Alert | undefined> {
    return this.alertRepository.findOne({ where: { chain } });
  }

  async removeAlert(chain: string): Promise<void> {
    await this.alertRepository.delete({ chain });
  }
}