import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { FightService } from './fight.service';
import { Fight } from './fight.entity';
import { CreateFightInput } from './dto/create-fight.input';
import { UpdateFightInput } from './dto/update-fight.input';

@Resolver(() => Fight)
export class FightResolver {
  constructor(private readonly fightService: FightService) {}

  @Mutation(() => Fight)
  createFight(@Args('createFightInput') createFightInput: CreateFightInput) {
    return this.fightService.create(createFightInput);
  }

  @Query(() => [Fight], { name: 'fights' })
  findAll() {
    return this.fightService.findAll();
  }

  @Query(() => Fight, { name: 'fight' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const fight = await this.fightService.findOne(id);
    if (!fight) {
      throw new NotFoundException(`Fight with id ${id} not found`);
    }
    return fight;
  }

  @Mutation(() => Fight)
  updateFight(@Args('updateFightInput') updateFightInput: UpdateFightInput) {
    return this.fightService.update(updateFightInput.id, updateFightInput);
  }

  @Mutation(() => Boolean)
  removeFight(@Args('id', { type: () => Int }) id: number) {
    return this.fightService.remove(id);
  }
}
