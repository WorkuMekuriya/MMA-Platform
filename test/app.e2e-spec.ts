import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Backend for mixed martial arts (MMA) Platform!');
  });

  // Refactored: Create and get fighter by ID
  it('should create a fighter and get it by ID', async () => {
    const fighterName = `TestFighter_${Date.now()}`;
    const createFighterMutation = `mutation { createFighter(createFighterInput: { first_name: "${fighterName}", last_name: "Smith", nationality: "USA", weight_class_id: 1 }) { id first_name } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createFighterMutation })
      .expect(200);
    expect(createRes.body.errors).toBeUndefined();
    const fighterId = createRes.body.data.createFighter.id;

    const getFighterQuery = `query { fighter(id: ${fighterId}) { id first_name last_name } }`;
    const getRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: getFighterQuery })
      .expect(200);
    expect(getRes.body.errors).toBeUndefined();
    expect(getRes.body.data.fighter).toHaveProperty('id', fighterId);
    expect(getRes.body.data.fighter).toHaveProperty('first_name', fighterName);
  });

  // Refactored: Update a fighter
  it('should create and update a fighter', async () => {
    const fighterName = `UpdateFighter_${Date.now()}`;
    const createFighterMutation = `mutation { createFighter(createFighterInput: { first_name: "${fighterName}", last_name: "Jones", nationality: "USA", weight_class_id: 1 }) { id first_name } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createFighterMutation })
      .expect(200);
    expect(createRes.body.errors).toBeUndefined();
    const fighterId = createRes.body.data.createFighter.id;

    const updateFighterMutation = `mutation { updateFighter(updateFighterInput: { id: ${fighterId}, nickname: "The Lioness" }) { id nickname } }`;
    const updateRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: updateFighterMutation })
      .expect(200);
    expect(updateRes.body.errors).toBeUndefined();
    expect(updateRes.body.data.updateFighter).toHaveProperty('id', fighterId);
    expect(updateRes.body.data.updateFighter).toHaveProperty('nickname', 'The Lioness');
  });

  it('should remove a fighter', async () => {
    // Create a fighter to remove
    const fighterName = `RemoveFighter_${Date.now()}`;
    const createFighterMutation = `mutation { createFighter(createFighterInput: { first_name: "${fighterName}", last_name: "Smith", nationality: "USA", weight_class_id: 1 }) { id } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createFighterMutation })
      .expect(200);
    const fighterId = createRes.body.data.createFighter.id;
    const mutation = `mutation { removeFighter(id: ${fighterId}) }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
  });

  it('should get all events', async () => {
    const query = `query { events { id name date location fights { id } } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.events).toBeInstanceOf(Array);
  });

  it('should get event by ID', async () => {
    // Create an event and get its ID
    const eventName = `GetEvent_${Date.now()}`;
    const createEventMutation = `mutation { createEvent(createEventInput: { name: "${eventName}", date: "2025-01-01T00:00:00.000Z", location: "Test Arena" }) { id name } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createEventMutation })
      .expect(200);
    const eventId = createRes.body.data.createEvent.id;
    const query = `query { event(id: ${eventId}) { name date location fights { id } } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.event).toHaveProperty('name');
  });

  it('should create a new event', async () => {
    const mutation = `mutation { createEvent(createEventInput: { name: "MMA Grand Prix", date: "2025-08-01T18:00:00.000Z", location: "Arena X" }) { id name date } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createEvent).toHaveProperty('id');
  });

  it('should update an event', async () => {
    // Create an event to update
    const eventName = `UpdateEvent_${Date.now()}`;
    const createEventMutation = `mutation { createEvent(createEventInput: { name: "${eventName}", date: "2025-01-01T00:00:00.000Z", location: "Test Arena" }) { id name } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createEventMutation })
      .expect(200);
    const eventId = createRes.body.data.createEvent.id;
    const mutation = `mutation { updateEvent(updateEventInput: { id: ${eventId}, location: "Updated Arena" }) { id location } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.updateEvent).toHaveProperty('id');
  });

  it('should remove an event', async () => {
    // Create an event to remove
    const eventName = `RemoveEvent_${Date.now()}`;
    const createEventMutation = `mutation { createEvent(createEventInput: { name: "${eventName}", date: "2025-01-01T00:00:00.000Z", location: "Test Arena" }) { id name } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createEventMutation })
      .expect(200);
    const eventId = createRes.body.data.createEvent.id;
    const mutation = `mutation { removeEvent(id: ${eventId}) }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
  });

  it('should get all fights', async () => {
    const query = `query { fights { id event { name } fighter_red { first_name last_name } fighter_blue { first_name last_name } winner { first_name last_name } method round time result_details } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.fights).toBeInstanceOf(Array);
  });

  it('should create a new fight', async () => {
    // Dynamically create event and fighters
    const eventName = `CreateFightEvent_${Date.now()}`;
    const createEventMutation = `mutation { createEvent(createEventInput: { name: "${eventName}", date: "2025-01-01T00:00:00.000Z", location: "Test Arena" }) { id } }`;
    const eventRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createEventMutation })
      .expect(200);
    const eventId = eventRes.body.data.createEvent.id;
    const createFighter = (name: string) => `mutation { createFighter(createFighterInput: { first_name: "${name}", last_name: "Test", nationality: "USA", weight_class_id: 1 }) { id } }`;
    const fighter1Res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createFighter('Alpha') })
      .expect(200);
    const fighter2Res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createFighter('Bravo') })
      .expect(200);
    const fighter1Id = fighter1Res.body.data.createFighter.id;
    const fighter2Id = fighter2Res.body.data.createFighter.id;
    const mutation = `mutation { createFight(createFightInput: { event_id: ${eventId}, fighter_red_id: ${fighter1Id}, fighter_blue_id: ${fighter2Id}, method: "KO", round: 1, time: "2:30" }) { id method winner { first_name last_name } } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createFight).toHaveProperty('id');
  });

  it('should update a fight', async () => {
    // NOTE: Adjust the ID as needed based on your seed data
    const mutation = `mutation { updateFight(updateFightInput: { id: 1, method: "Submission" }) { id method } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.updateFight).toHaveProperty('id');
  });

  it('should remove a fight', async () => {
    // NOTE: Adjust the ID as needed based on your seed data
    const mutation = `mutation { removeFight(id: 1) }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
  });

  it('should get all rankings', async () => {
    const query = `query { rankings(weight_class_id: 1) { id fighter { first_name last_name } weight_class { name } points rank } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.rankings).toBeInstanceOf(Array);
  });

  it('should get ranking by ID', async () => {
    // NOTE: Adjust the ID as needed based on your seed data
    const query = `query { ranking(id: 1) { id fighter { first_name last_name } weight_class { name } points rank } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.ranking).toHaveProperty('id');
  });

  it('should create a new ranking', async () => {
    // NOTE: Adjust the IDs as needed based on your seed data
    const mutation = `mutation { createRanking(createRankingInput: { fighter_id: 1, weight_class_id: 1, points: 10, rank: 1 }) { id points rank } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createRanking).toHaveProperty('id');
  });

  it('should update a ranking', async () => {
    // NOTE: Adjust the ID as needed based on your seed data
    const mutation = `mutation { updateRanking(updateRankingInput: { id: 1, points: 12 }) { id points } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.updateRanking).toHaveProperty('id');
  });

  it('should remove a ranking', async () => {
    // NOTE: Adjust the ID as needed based on your seed data
    const mutation = `mutation { removeRanking(id: 1) }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
  });

  it('should get all weight classes', async () => {
    const query = `query { weightClasses { id name min_weight_kg max_weight_kg } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.weightClasses).toBeInstanceOf(Array);
  });

  it('should get weight class by ID', async () => {
    // NOTE: Adjust the ID as needed based on your seed data
    const query = `query { weightClass(id: 1) { id name min_weight_kg max_weight_kg } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.weightClass).toHaveProperty('id');
  });

  it('should create a new weight class', async () => {
    const mutation = `mutation { createWeightClass(createWeightClassInput: { name: "Featherweight", min_weight_kg: 61, max_weight_kg: 65 }) { id name } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.createWeightClass).toHaveProperty('id');
  });

  it('should update a weight class', async () => {
    // NOTE: Adjust the ID as needed based on your seed data
    const mutation = `mutation { updateWeightClass(updateWeightClassInput: { id: 1, name: "Super Featherweight" }) { id name } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.updateWeightClass).toHaveProperty('id');
  });

  it('should remove a weight class', async () => {
    // Create a weight class and a fighter in it
    const weightClassName = `RemoveWeightClass_${Date.now()}`;
    const createWeightClass = `mutation { createWeightClass(createWeightClassInput: { name: "${weightClassName}", min_weight_kg: 60, max_weight_kg: 70 }) { id } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createWeightClass })
      .expect(200);
    const weightClassId = createRes.body.data.createWeightClass.id;
    // Create a fighter in this weight class
    const createFighterMutation = `mutation { createFighter(createFighterInput: { first_name: "Remove", last_name: "Test", nationality: "USA", weight_class_id: ${weightClassId} }) { id } }`;
    const fighterRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createFighterMutation })
      .expect(200);
    const fighterId = fighterRes.body.data.createFighter.id;
    // Remove the fighter first
    const removeFighterMutation = `mutation { removeFighter(id: ${fighterId}) }`;
    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: removeFighterMutation })
      .expect(200);
    // Now remove the weight class
    const removeWeightClass = `mutation { removeWeightClass(id: ${weightClassId}) }`;
    const removeRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: removeWeightClass })
      .expect(200);
    expect(removeRes.body.errors).toBeUndefined();
    expect(removeRes.body.data.removeWeightClass).toBe(true);
  });

  // Create and get event by ID
  it('should create an event and get it by ID', async () => {
    const eventName = `Test Event ${Date.now()}`;
    const createEventMutation = `mutation { createEvent(createEventInput: { name: "${eventName}", date: "2025-01-01T00:00:00.000Z", location: "Test Arena" }) { id name } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createEventMutation })
      .expect(200);
    expect(createRes.body.errors).toBeUndefined();
    const eventId = createRes.body.data.createEvent.id;

    const getEventQuery = `query { event(id: ${eventId}) { id name location } }`;
    const getRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: getEventQuery })
      .expect(200);
    expect(getRes.body.errors).toBeUndefined();
    expect(getRes.body.data.event).toHaveProperty('id', eventId);
    expect(getRes.body.data.event).toHaveProperty('name', eventName);
  });

  // Create and remove a weight class
  it('should create and remove a weight class', async () => {
    const weightClassName = `RemoveTestWeight_${Date.now()}`;
    const createWeightClass = `mutation { createWeightClass(createWeightClassInput: { name: "${weightClassName}", min_weight_kg: 60, max_weight_kg: 70 }) { id } }`;
    const createRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: createWeightClass })
      .expect(200);
    expect(createRes.body.errors).toBeUndefined();
    const weightClassId = createRes.body.data.createWeightClass.id;

    const removeWeightClass = `mutation { removeWeightClass(id: ${weightClassId}) }`;
    const removeRes = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: removeWeightClass })
      .expect(200);
    expect(removeRes.body.errors).toBeUndefined();
    expect(removeRes.body.data.removeWeightClass).toBe(true);
  });
});
