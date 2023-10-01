import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Price } from './price.entity';
import { EmailService } from './../email/email.service';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    private emailService: EmailService,
    private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async trackPrices() {
    const chains = [{
      network: 'ethereum',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    }, 
    {
      network: 'polygon',
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0'
    }];

    for (const chain of chains) {
      this.logger.log(`Track Price is fetching now ${chain.network}...`, 'Price');

      const price = await this.fetchPrice(chain.address);

      await this.savePrice(chain.network, price);
      await this.checkPriceIncrease(chain.network, price);
    }
  }

  private async fetchPrice(address: string): Promise<number> {
    try {
      const response = await axios.get(`https://deep-index.moralis.io/api/v2.2/erc20/${address}/price`, {
        params: { 
          chain: 'eth',
          include: 'percent_change'
         },  // Pass the chain as a query parameter
        headers: { 'X-API-Key': process.env.MORALIS_API_KEY || '' },
      });
  
      // Ensure the response contains the data you need
      if (response.data && response.data.usdPrice) {
        return response.data.usdPrice;
      } else {
        throw new Error('Price data not available in response');
      }
    } catch (error) {
      console.error('Error fetching price:', error.code);
    }
  }

  private async savePrice(chain: string, price: number) {
    const priceEntity = new Price();
    priceEntity.chain = chain;
    priceEntity.price = price;
    await this.priceRepository.save(priceEntity);
  }

  private async checkPriceIncrease(chain: string, currentPrice: number) {
    // const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 1000);
    
    const oldPriceResult = await this.priceRepository.query(`
      SELECT id, chain, price, timestamp
      FROM price
      WHERE chain = $1 AND timestamp <= $2
      ORDER BY timestamp DESC
      LIMIT 1
    `, [chain, oneHourAgo]);

    
    if (oldPriceResult.length > 0) {
      const oldPrice = oldPriceResult[0];
      
      if (currentPrice > oldPrice.price * 1.03) {
        await this.emailService.sendAlert(chain, oldPrice.price, currentPrice);
      }

      await this.emailService.sendAlert(chain, oldPrice.price, currentPrice);
    }
  }

  async getHourlyPrices(chain: string) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return this.priceRepository.query(`
      WITH hourly_prices AS (
        SELECT *,
               ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('hour', timestamp) ORDER BY timestamp) as rn
        FROM price
        WHERE chain = $1 AND timestamp > $2
      )
      SELECT id, chain, price, timestamp
      FROM hourly_prices
      WHERE rn = 1
      ORDER BY timestamp DESC
    `, [chain, twentyFourHoursAgo]);
  }
}