import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Fighter } from './fighter.entity'
import { CreateFighterInput } from './dto/create-fighter.input'
import { UpdateFighterInput } from './dto/update-fighter.input'
import { Fight } from '../fight/fight.entity'

@Injectable()
export class FighterService {
  constructor (
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
  ) {}

  async create (createFighterInput: CreateFighterInput): Promise<Fighter> {
    const fighter = this.fighterRepository.create(createFighterInput)
    return this.fighterRepository.save(fighter)
  }

  async findAll (): Promise<Fighter[]> {
    return this.fighterRepository.find({ relations: ['weight_class'] })
  }

  async findOne (id: number): Promise<Fighter | null> {
    return this.fighterRepository.findOne({
      where: { id },
      relations: ['weight_class'],
    })
  }

  async update (
    updateFighterInput: UpdateFighterInput,
  ): Promise<Fighter | null> {
    let id = updateFighterInput.id
    if (!id) {
      throw new BadRequestException('Fighter id must be provided for update.')
    }
    await this.fighterRepository.update(id, updateFighterInput)
    return this.findOne(id)
  }

  async remove (id: number): Promise<boolean> {
    // Check if fighter is referenced in any fights
    const fightCount = await this.fightRepository.count({
      where: [{ fighter_red: { id } }, { fighter_blue: { id } }],
    })
    if (fightCount > 0) {
      throw new BadRequestException(
        'Cannot delete fighter: fighter has participated in fights.',
      )
    }
    const result = await this.fighterRepository.delete(id)
    return !!result.affected && result.affected > 0
  }
}
