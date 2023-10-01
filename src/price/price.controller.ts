import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PriceService } from './price.service';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get(':chain')
  @ApiOperation({ summary: 'Get hourly prices for a chain' })
  @ApiParam({ name: 'chain', enum: ['ethereum', 'polygon'] })
  async getHourlyPrices(@Param('chain') chain: string) {
    return this.priceService.getHourlyPrices(chain);
  }
}