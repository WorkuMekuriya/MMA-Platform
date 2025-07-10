import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fighter } from './fighter.entity';
import { Fight } from '../fight/fight.entity';
import { FighterService } from './fighter.service';
import { FighterResolver } from './fighter.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Fighter, Fight])],
  providers: [FighterService, FighterResolver],
  exports: [FighterService],
})
export class FighterModule {}
