/// <reference types="node" />
// seed-dummy-data.ts
// ---------------------------------------------
// Purpose: Populate the MMA platform database with dummy data for development/testing.
// Usage: Run manually with `yarn seed` or `npx ts-node src/common/utils/seed-dummy-data.ts`.
// This script is also called automatically after DB creation by ensure-database.ts.
// It will only insert data if the tables are empty.
// ---------------------------------------------

import { DataSource } from 'typeorm';
import { Fighter } from '../../fighter/fighter.entity';
import { Event } from '../../event/event.entity';
import { Fight } from '../../fight/fight.entity';
import { WeightClass } from '../../weight-class/weight-class.entity';
import { Ranking } from '../../ranking/ranking.entity';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'hope',
  password: process.env.DB_PASSWORD || '63587492',
  database: process.env.DB_DATABASE || 'mma-platform',
  entities: [Fighter, Event, Fight, WeightClass, Ranking],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  const fighterRepo = AppDataSource.getRepository(Fighter);
  const eventRepo = AppDataSource.getRepository(Event);
  const fightRepo = AppDataSource.getRepository(Fight);
  const weightClassRepo = AppDataSource.getRepository(WeightClass);
  const rankingRepo = AppDataSource.getRepository(Ranking);

  const fightersCount = await fighterRepo.count();
  const eventsCount = await eventRepo.count();
  const weightClassCount = await weightClassRepo.count();
  if (fightersCount > 0 || eventsCount > 0 || weightClassCount > 0) {
    console.log('Database already seeded.');
    await AppDataSource.destroy();
    return;
  }

  // Create weight classes
  const wc1 = weightClassRepo.create({
    name: 'Lightweight',
    min_weight_kg: 66,
    max_weight_kg: 70,
  });
  const wc2 = weightClassRepo.create({
    name: 'Welterweight',
    min_weight_kg: 71,
    max_weight_kg: 77,
  });
  await weightClassRepo.save([wc1, wc2]);

  // Create fighters (3 per class)
  const f1 = fighterRepo.create({
    first_name: 'John',
    last_name: 'Doe',
    nickname: 'The Hammer',
    nationality: 'USA',
    weight_class: wc1,
  });
  const f2 = fighterRepo.create({
    first_name: 'Alex',
    last_name: 'Smith',
    nickname: 'The Eagle',
    nationality: 'Brazil',
    weight_class: wc1,
  });
  const f3 = fighterRepo.create({
    first_name: 'Carlos',
    last_name: 'Santos',
    nickname: 'El Toro',
    nationality: 'Mexico',
    weight_class: wc1,
  });
  const f4 = fighterRepo.create({
    first_name: 'Mike',
    last_name: 'Lee',
    nickname: 'The Tiger',
    nationality: 'UK',
    weight_class: wc2,
  });
  const f5 = fighterRepo.create({
    first_name: 'Ivan',
    last_name: 'Petrov',
    nickname: 'The Bear',
    nationality: 'Russia',
    weight_class: wc2,
  });
  const f6 = fighterRepo.create({
    first_name: 'Sam',
    last_name: 'Kim',
    nickname: 'The Dragon',
    nationality: 'Korea',
    weight_class: wc2,
  });
  await fighterRepo.save([f1, f2, f3, f4, f5, f6]);

  // Create events
  const event1 = eventRepo.create({
    name: 'MMA Test Event 1',
    date: new Date(),
    location: 'Test Arena 1',
  });
  const event2 = eventRepo.create({
    name: 'MMA Test Event 2',
    date: new Date(Date.now() + 86400000), // tomorrow
    location: 'Test Arena 2',
  });
  await eventRepo.save([event1, event2]);

  // Create fights (at least 2 per event, covering all fighters)
  const fight1 = fightRepo.create({
    event: event1,
    fighter_red: f1,
    fighter_blue: f2,
    winner: f1,
    method: 'KO',
    round: 1,
    time: '2:30',
    result_details: 'Knockout in round 1',
  });
  const fight2 = fightRepo.create({
    event: event1,
    fighter_red: f3,
    fighter_blue: f2,
    winner: f3,
    method: 'Submission',
    round: 2,
    time: '3:10',
    result_details: 'Armbar submission',
  });
  const fight3 = fightRepo.create({
    event: event2,
    fighter_red: f4,
    fighter_blue: f5,
    winner: f5,
    method: 'Decision',
    round: 3,
    time: '5:00',
    result_details: 'Unanimous decision',
  });
  const fight4 = fightRepo.create({
    event: event2,
    fighter_red: f6,
    fighter_blue: f4,
    winner: f6,
    method: 'KO',
    round: 2,
    time: '1:45',
    result_details: 'Head kick KO',
  });
  await fightRepo.save([fight1, fight2, fight3, fight4]);

  // Create rankings for all fighters in their weight class
  const rankings = [
    rankingRepo.create({ fighter: f1, weight_class: wc1, points: 10, rank: 1 }),
    rankingRepo.create({ fighter: f3, weight_class: wc1, points: 8, rank: 2 }),
    rankingRepo.create({ fighter: f2, weight_class: wc1, points: 5, rank: 3 }),
    rankingRepo.create({ fighter: f5, weight_class: wc2, points: 12, rank: 1 }),
    rankingRepo.create({ fighter: f6, weight_class: wc2, points: 9, rank: 2 }),
    rankingRepo.create({ fighter: f4, weight_class: wc2, points: 6, rank: 3 }),
  ];
  await rankingRepo.save(rankings);

  console.log('Dummy data seeded successfully.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Error seeding dummy data:', err);
  process.exit(1);
});
