import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { FighterService } from './fighter.service';
import { Fighter } from './fighter.entity';
import { CreateFighterInput } from './dto/create-fighter.input';
import { UpdateFighterInput } from './dto/update-fighter.input';

@Resolver(() => Fighter)
export class FighterResolver {
  constructor(private readonly fighterService: FighterService) {}

  @Mutation(() => Fighter)
  createFighter(
    @Args('createFighterInput') createFighterInput: CreateFighterInput,
  ) {
    return this.fighterService.create(createFighterInput);
  }

  @Query(() => [Fighter], { name: 'fighters' })
  findAll() {
    return this.fighterService.findAll();
  }

  @Query(() => Fighter, { name: 'fighter' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const fighter = await this.fighterService.findOne(id);
    if (!fighter) {
      throw new NotFoundException(`Fighter with id ${id} not found`);
    }
    return fighter;
  }

  @Mutation(() => Fighter)
  updateFighter(
    @Args('updateFighterInput') updateFighterInput: UpdateFighterInput,
  ) {
    return this.fighterService.update(
      updateFighterInput,
    );
  }

  @Mutation(() => Boolean)
  removeFighter(@Args('id', { type: () => Int }) id: number) {
    return this.fighterService.remove(id);
  }
}
