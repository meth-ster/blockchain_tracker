import { Injectable, OnModuleInit } from '@nestjs/common';

import { PriceService } from './price/price.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly priceService: PriceService,
  ) {}

  onModuleInit() {
    this.priceService.trackPrices();
  }
}
