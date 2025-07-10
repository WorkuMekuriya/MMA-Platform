import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { Ranking } from './ranking.entity';
import { CreateRankingInput } from './dto/create-ranking.input';
import { UpdateRankingInput } from './dto/update-ranking.input';

@Resolver(() => Ranking)
export class RankingResolver {
  constructor(private readonly rankingService: RankingService) {}

  @Mutation(() => Ranking)
  createRanking(
    @Args('createRankingInput') createRankingInput: CreateRankingInput,
  ) {
    return this.rankingService.create(createRankingInput);
  }

  @Query(() => [Ranking], { name: 'rankings' })
  findAll(
    @Args('weight_class_id', { type: () => Int, nullable: true })
    weightClassId?: number,
  ) {
    if (weightClassId) {
      return this.rankingService.findByWeightClass(weightClassId);
    }
    return this.rankingService.findAll();
  }

  @Query(() => Ranking, { name: 'ranking' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const ranking = await this.rankingService.findOne(id);
    if (!ranking) {
      throw new NotFoundException(`Ranking with id ${id} not found`);
    }
    return ranking;
  }

  @Mutation(() => Ranking)
  updateRanking(
    @Args('updateRankingInput') updateRankingInput: UpdateRankingInput,
  ) {
    return this.rankingService.update(
      updateRankingInput.id,
      updateRankingInput,
    );
  }

  @Mutation(() => Boolean)
  removeRanking(@Args('id', { type: () => Int }) id: number) {
    return this.rankingService.remove(id);
  }
}
