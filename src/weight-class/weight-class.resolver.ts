import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { WeightClassService } from './weight-class.service';
import { WeightClass } from './weight-class.entity';
import { CreateWeightClassInput } from './dto/create-weight-class.input';
import { UpdateWeightClassInput } from './dto/update-weight-class.input';

@Resolver(() => WeightClass)
export class WeightClassResolver {
  constructor(private readonly weightClassService: WeightClassService) {}

  @Mutation(() => WeightClass)
  createWeightClass(
    @Args('createWeightClassInput')
    createWeightClassInput: CreateWeightClassInput,
  ) {
    return this.weightClassService.create(createWeightClassInput);
  }

  @Query(() => [WeightClass], { name: 'weightClasses' })
  findAll() {
    return this.weightClassService.findAll();
  }

  @Query(() => WeightClass, { name: 'weightClass' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const weightClass = await this.weightClassService.findOne(id);
    if (!weightClass) {
      throw new NotFoundException(`WeightClass with id ${id} not found`);
    }
    return weightClass;
  }

  @Mutation(() => WeightClass)
  updateWeightClass(
    @Args('updateWeightClassInput')
    updateWeightClassInput: UpdateWeightClassInput,
  ) {
    return this.weightClassService.update(
      updateWeightClassInput.id,
      updateWeightClassInput,
    );
  }

  @Mutation(() => Boolean)
  removeWeightClass(@Args('id', { type: () => Int }) id: number) {
    return this.weightClassService.remove(id);
  }
}
