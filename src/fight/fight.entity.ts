import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Event } from '../event/event.entity';
import { Fighter } from '../fighter/fighter.entity';

@ObjectType()
@Entity()
export class Fight {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Event)
  @ManyToOne(() => Event, (event: Event) => event.fights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Field(() => Fighter)
  @ManyToOne(() => Fighter, (fighter: Fighter) => fighter.red_corner_fights)
  @JoinColumn({ name: 'fighter_red_id' })
  fighter_red: Fighter;

  @Field(() => Fighter)
  @ManyToOne(() => Fighter, (fighter: Fighter) => fighter.blue_corner_fights)
  @JoinColumn({ name: 'fighter_blue_id' })
  fighter_blue: Fighter;

  @Field(() => Fighter, { nullable: true })
  @ManyToOne(() => Fighter, (fighter: Fighter) => fighter.wins, {
    nullable: true,
  })
  @JoinColumn({ name: 'winner_id' })
  winner: Fighter;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  method: string;

  @Field({ nullable: true })
  @Column({ type: 'int', nullable: true })
  round: number;

  @Field({ nullable: true })
  @Column({ length: 10, nullable: true })
  time: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  result_details: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
