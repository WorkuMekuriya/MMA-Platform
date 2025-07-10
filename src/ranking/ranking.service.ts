// Ranking Algorithm:
// Win via KO or Submission: +4 points
// Win via Decision: +3 points
// Draw: +1 point
// Loss: 0 points
// Tiebreakers: win percentage, most recent activity

import {
  Injectable,
  BadRequestException,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Ranking } from './ranking.entity';
import { CreateRankingInput } from './dto/create-ranking.input';
import { UpdateRankingInput } from './dto/update-ranking.input';
import { Fighter } from '../fighter/fighter.entity';
import { Fight } from '../fight/fight.entity';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Ranking)
    private readonly rankingRepository: Repository<Ranking>,
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
  ) {}

  async create(createRankingInput: CreateRankingInput): Promise<Ranking> {
    const ranking = this.rankingRepository.create(createRankingInput);
    return this.rankingRepository.save(ranking);
  }

  async findAll(): Promise<Ranking[]> {
    return this.rankingRepository.find({
      relations: ['fighter', 'weight_class'],
    });
  }

  async findOne(id: number): Promise<Ranking | null> {
    return this.rankingRepository.findOne({
      where: { id },
      relations: ['fighter', 'weight_class'],
    });
  }

  async update(
    id: number,
    updateRankingInput: UpdateRankingInput,
  ): Promise<Ranking | null> {
    if (!id) {
      throw new BadRequestException('Ranking id must be provided for update.');
    }
    await this.rankingRepository.update(id, updateRankingInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.rankingRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async recalculateRankings(weightClassId: number): Promise<void> {
    // Get all fighters in the weight class
    const fighters = await this.fighterRepository.find({
      where: { weight_class: { id: weightClassId } },
    });
    // Get all fights in this weight class
    const fighterIds = fighters.map((f) => f.id);
    const fights = await this.fightRepository.find({
      where: [
        { fighter_red: In(fighterIds) },
        { fighter_blue: In(fighterIds) },
      ],
      relations: ['fighter_red', 'fighter_blue', 'winner'],
    });
    // Calculate points for each fighter
    const pointsMap: Record<
      number,
      {
        points: number;
        wins: number;
        losses: number;
        draws: number;
        fights: number;
        lastFight: Date | null;
      }
    > = {};
    for (const fighter of fighters) {
      pointsMap[fighter.id] = {
        points: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        fights: 0,
        lastFight: null,
      };
    }
    for (const fight of fights) {
      if (!fight.winner) continue; // skip unfinished fights
      const redId: number = fight.fighter_red.id;
      const blueId: number = fight.fighter_blue.id;
      const winnerId: number = fight.winner.id;
      // Only count if both fighters are in this weight class
      if (!pointsMap[redId] || !pointsMap[blueId]) continue;
      // Draw
      if (winnerId === 0) {
        pointsMap[redId].points += 1;
        pointsMap[blueId].points += 1;
        pointsMap[redId].draws++;
        pointsMap[blueId].draws++;
      } else {
        // Win/Loss
        let winPoints: number = 0;
        if (
          fight.method &&
          (fight.method.toLowerCase().includes('ko') ||
            fight.method.toLowerCase().includes('submission'))
        ) {
          winPoints = 4;
        } else if (
          fight.method &&
          fight.method.toLowerCase().includes('decision')
        ) {
          winPoints = 3;
        } else {
          winPoints = 3; // default to decision if unknown
        }
        if (winnerId === redId) {
          pointsMap[redId].points += winPoints;
          pointsMap[redId].wins++;
          pointsMap[blueId].losses++;
        } else if (winnerId === blueId) {
          pointsMap[blueId].points += winPoints;
          pointsMap[blueId].wins++;
          pointsMap[redId].losses++;
        }
      }
      pointsMap[redId].fights++;
      pointsMap[blueId].fights++;
      // Track last fight date
      const fightDate: Date = fight.updated_at || fight.created_at;
      if (!pointsMap[redId].lastFight || fightDate > pointsMap[redId].lastFight)
        pointsMap[redId].lastFight = fightDate;
      if (
        !pointsMap[blueId].lastFight ||
        fightDate > pointsMap[blueId].lastFight
      )
        pointsMap[blueId].lastFight = fightDate;
    }
    // Sort fighters by points, then win %, then last activity
    const sorted = fighters.slice().sort((a: Fighter, b: Fighter) => {
      const pa = pointsMap[a.id];
      const pb = pointsMap[b.id];
      if (pb.points !== pa.points) return pb.points - pa.points;
      const wa = pa.fights ? pa.wins / pa.fights : 0;
      const wb = pb.fights ? pb.wins / pb.fights : 0;
      if (wb !== wa) return wb - wa;
      const da = pa.lastFight ? pa.lastFight.getTime() : 0;
      const db = pb.lastFight ? pb.lastFight.getTime() : 0;
      return db - da;
    });
    // Remove fighters with no fights
    const filtered = sorted.filter((f: Fighter) => pointsMap[f.id].fights > 0);
    // Update rankings in DB
    for (let i = 0; i < filtered.length; i++) {
      const fighter = filtered[i];
      let ranking = await this.rankingRepository.findOne({
        where: {
          fighter: { id: fighter.id },
          weight_class: { id: weightClassId },
        },
      });
      if (!ranking) {
        ranking = this.rankingRepository.create({
          fighter,
          weight_class: { id: weightClassId },
          points: pointsMap[fighter.id].points,
          rank: i + 1,
        });
      } else {
        ranking.points = pointsMap[fighter.id].points;
        ranking.rank = i + 1;
        ranking.last_updated = new Date();
      }
      await this.rankingRepository.save(ranking);
    }
  }

  async findByWeightClass(weightClassId: number): Promise<Ranking[]> {
    return this.rankingRepository.find({
      where: { weight_class: { id: weightClassId } },
      relations: ['fighter', 'weight_class'],
    });
  }
}
