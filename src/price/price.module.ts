
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { Price } from './price.entity';
import { EmailModule } from '../email/email.module';
import { AlertModule } from '../alert/alert.module';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), EmailModule, AlertModule],
  providers: [PriceService, Logger],
  controllers: [PriceController],
  exports: [PriceService],
})
export class PriceModule {}