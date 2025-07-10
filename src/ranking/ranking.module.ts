import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from './ranking.entity';
import { RankingService } from './ranking.service';
import { RankingResolver } from './ranking.resolver';
import { Fighter } from '../fighter/fighter.entity';
import { Fight } from '../fight/fight.entity';
import { FightModule } from '../fight/fight.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ranking, Fighter, Fight]),
    forwardRef(() => FightModule),
  ],
  providers: [RankingService, RankingResolver],
  exports: [RankingService],
})
export class RankingModule {}
