import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fight } from './fight.entity';
import { CreateFightInput } from './dto/create-fight.input';
import { UpdateFightInput } from './dto/update-fight.input';
import { Fighter } from '../fighter/fighter.entity';
import { RankingService } from '../ranking/ranking.service';

@Injectable()
export class FightService {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    @Inject(forwardRef(() => RankingService))
    private readonly rankingService: RankingService,
  ) {}

  async create(createFightInput: CreateFightInput): Promise<Fight> {
    const fight = this.fightRepository.create(createFightInput);
    const saved = await this.fightRepository.save(fight);
    // Reload with all relations before triggering ranking update
    const savedWithRelations = await this.fightRepository.findOne({
      where: { id: saved.id },
      relations: ['event', 'fighter_red', 'fighter_blue', 'winner'],
    });
    if (!savedWithRelations) {
      throw new Error('Fight not found after save');
    }
    this.triggerRankingUpdate(savedWithRelations);
    return savedWithRelations;
  }

  async findAll(): Promise<Fight[]> {
    return this.fightRepository.find({
      relations: ['event', 'fighter_red', 'fighter_blue', 'winner'],
    });
  }

  async findOne(id: number): Promise<Fight | null> {
    return this.fightRepository.findOne({
      where: { id },
      relations: ['event', 'fighter_red', 'fighter_blue', 'winner'],
    });
  }

  async update(
    id: number,
    updateFightInput: UpdateFightInput,
  ): Promise<Fight | null> {
    if (!id) {
      throw new BadRequestException('Fight id must be provided for update.');
    }
    // Patch: handle winner_id assignment
    if ((updateFightInput as any).winner_id) {
      // Fetch the fight
      const fight = await this.fightRepository.findOne({
        where: { id },
        relations: ['event', 'fighter_red', 'fighter_blue', 'winner'],
      });
      if (!fight) throw new NotFoundException('Fight not found');
      // Fetch the winner fighter
      const winner = await this.fighterRepository.findOne({ where: { id: (updateFightInput as any).winner_id } });
      if (!winner) throw new NotFoundException('Winner fighter not found');
      // Assign winner and other fields
      fight.winner = winner;
      const input = updateFightInput as any;
      if (typeof input.method !== 'undefined') fight.method = input.method;
      if (typeof input.round !== 'undefined') fight.round = input.round;
      if (typeof input.time !== 'undefined') fight.time = input.time;
      if (typeof input.result_details !== 'undefined') fight.result_details = input.result_details;
      await this.fightRepository.save(fight);
      this.triggerRankingUpdate(fight);
      return this.fightRepository.findOne({
        where: { id },
        relations: ['event', 'fighter_red', 'fighter_blue', 'winner'],
      });
    } else {
      await this.fightRepository.update(id, updateFightInput);
      const updated = await this.fightRepository.findOne({
        where: { id },
        relations: ['event', 'fighter_red', 'fighter_blue', 'winner'],
      });
      this.triggerRankingUpdate(updated);
      return updated;
    }
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.fightRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }

  private async triggerRankingUpdate(fight: Fight | null) {
    if (!fight || !fight.fighter_red) return;
    // Get the weight class from one of the fighters
    const fighter = await this.fighterRepository.findOne({
      where: { id: fight.fighter_red.id },
      relations: ['weight_class'],
    });
    if (fighter && fighter.weight_class) {
      this.rankingService.recalculateRankings(fighter.weight_class.id);
    }
  }
}
