import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeightClass } from './weight-class.entity';
import { WeightClassService } from './weight-class.service';
import { WeightClassResolver } from './weight-class.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([WeightClass])],
  providers: [WeightClassService, WeightClassResolver],
  exports: [WeightClassService],
})
export class WeightClassModule {}
