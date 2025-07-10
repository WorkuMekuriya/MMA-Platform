import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fight } from './fight.entity';
import { FightService } from './fight.service';
import { FightResolver } from './fight.resolver';
import { Fighter } from '../fighter/fighter.entity';
import { RankingModule } from '../ranking/ranking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fight, Fighter]),
    forwardRef(() => RankingModule),
  ],
  providers: [FightService, FightResolver],
  exports: [FightService],
})
export class FightModule {}
