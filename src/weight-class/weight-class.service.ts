import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeightClass } from './weight-class.entity';
import { CreateWeightClassInput } from './dto/create-weight-class.input';
import { UpdateWeightClassInput } from './dto/update-weight-class.input';

@Injectable()
export class WeightClassService {
  constructor(
    @InjectRepository(WeightClass)
    private readonly weightClassRepository: Repository<WeightClass>,
  ) {}

  async create(
    createWeightClassInput: CreateWeightClassInput,
  ): Promise<WeightClass> {
    const weightClass = this.weightClassRepository.create(
      createWeightClassInput,
    );
    return this.weightClassRepository.save(weightClass);
  }

  async findAll(): Promise<WeightClass[]> {
    return this.weightClassRepository.find();
  }

  async findOne(id: number): Promise<WeightClass | null> {
    return this.weightClassRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateWeightClassInput: UpdateWeightClassInput,
  ): Promise<WeightClass | null> {
    if (!id) {
      throw new BadRequestException(
        'WeightClass id must be provided for update.',
      );
    }
    await this.weightClassRepository.update(id, updateWeightClassInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.weightClassRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
