import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventInput: CreateEventInput): Promise<Event> {
    const event = this.eventRepository.create(createEventInput);
    return this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event | null> {
    return this.eventRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateEventInput: UpdateEventInput,
  ): Promise<Event | null> {
    if (!id) {
      throw new BadRequestException('Event id must be provided for update.');
    }
    await this.eventRepository.update(id, updateEventInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.eventRepository.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
