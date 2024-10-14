import { Controller, Post, Get, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import { Alert } from './alert.entity';

@ApiTags('alerts')
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post(':chain')
  @ApiOperation({ summary: 'Set or update a price alert for a specific chain' })
  @ApiParam({ name: 'chain', enum: ['ethereum', 'polygon'] })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        targetPrice: { type: 'number' },
        email: { type: 'string' },
      },
    },
  })
  async setAlert(
    @Param('chain') chain: string,
    @Body() alertData: { targetPrice: number; email: string }
  ): Promise<Alert> {
    return this.alertService.setAlert(chain, alertData.targetPrice, alertData.email);
  }

  @Get(':chain')
  @ApiOperation({ summary: 'Get the current price alert for a specific chain' })
  @ApiParam({ name: 'chain', enum: ['ethereum', 'polygon'] })
  async getAlert(@Param('chain') chain: string): Promise<Alert> {
    const alert = await this.alertService.getAlert(chain);
    if (!alert) {
      throw new NotFoundException(`No alert found for chain: ${chain}`);
    }
    return alert;
  }

  @Delete(':chain')
  @ApiOperation({ summary: 'Remove the price alert for a specific chain' })
  @ApiParam({ name: 'chain', enum: ['ethereum', 'polygon'] })
  async removeAlert(@Param('chain') chain: string): Promise<void> {
    await this.alertService.removeAlert(chain);
  }
}