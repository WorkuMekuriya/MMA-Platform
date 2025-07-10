# MMA Platform API Documentation

## Overview
This backend provides a GraphQL API for managing MMA Fighters, Events, Fights, Rankings, and Weight Classes. It supports CRUD operations, statistics, and a dynamic ranking system.

---

## GraphQL Schema

### Main Types
- **Fighter**: id, first_name, last_name, nickname, nationality, birthdate, weight_class, record, red_corner_fights, blue_corner_fights, wins, etc.
- **Event**: id, name, date, location, fights
- **Fight**: id, event, fighter_red, fighter_blue, winner, method, round, time, result_details
- **Ranking**: id, fighter, weight_class, rank, points
- **WeightClass**: id, name, min_weight_kg, max_weight_kg

### Main Queries
- `fighters`, `fighter(id: Int!)`
- `events`, `event(id: Int!)`
- `fights`, `fight(id: Int!)`
- `rankings(weight_class_id: Int)`
- `weightClasses`, `weightClass(id: Int!)`

### Main Mutations
- `createFighter(createFighterInput: CreateFighterInput)`
- `updateFighter(updateFighterInput: UpdateFighterInput)`
- `removeFighter(id: Int!)`
- `createEvent(createEventInput: CreateEventInput)`
- `updateEvent(updateEventInput: UpdateEventInput)`
- `removeEvent(id: Int!)`
- `createFight(createFightInput: CreateFightInput)`
- `updateFight(updateFightInput: UpdateFightInput)`
- `removeFight(id: Int!)`
- `createRanking(createRankingInput: CreateRankingInput)`
- `updateRanking(updateRankingInput: UpdateRankingInput)`
- `removeRanking(id: Int!)`
- `createWeightClass(createWeightClassInput: CreateWeightClassInput)`
- `updateWeightClass(updateWeightClassInput: UpdateWeightClassInput)`
- `removeWeightClass(id: Int!)`

---

## Additional Usage Examples & Features

### 1. List Upcoming Events
Retrieve only events with a date in the future (if supported by your API):
```graphql
query {
  events(upcoming: true) {
    id
    name
    date
    location
  }
}
```
*Note: If the `upcoming` argument is not supported, consider adding it to your API for convenience.*

### 2. Retrieve Detailed Fighter Statistics
Get a fighter's profile, record, and statistics:
```graphql
query {
  fighter(id: 1) {
    id
    first_name
    last_name
    nickname
    nationality
    weight_class { name }
    record {
      wins
      losses
      draws
      knockouts
      submissions
      decisions
    }
    red_corner_fights { id method winner { first_name last_name } }
    blue_corner_fights { id method winner { first_name last_name } }
  }
}
```
*Note: The `record` field should summarize the fighter's stats. If not present, consider adding it to the schema.*

### 3. List Fight Cards for an Event
Get all fights (fight card) for a specific event:
```graphql
query {
  event(id: 1) {
    name
    date
    fights {
      id
      fighter_red { first_name last_name }
      fighter_blue { first_name last_name }
      winner { first_name last_name }
      method
      round
      time
    }
  }
}
```

### 4. Filtering, Pagination, and Sorting
If your API supports filtering, pagination, or sorting, here are example usages:
```graphql
query {
  fighters(limit: 10, offset: 0, sort: "last_name_ASC") {
    id
    first_name
    last_name
  }
}
```
*Note: Replace arguments as per your schema. If not supported, consider implementing these features for scalability.*

### 5. Ranking Updates After Fight Results
Rankings are automatically updated in the background after a fight result is recorded. No manual action is required. To see updated rankings, simply query the rankings endpoint after a fight result is saved:
```graphql
query {
  rankings(weight_class_id: 1) {
    fighter { first_name last_name }
    points
    rank
  }
}
```
*Note: If you want to notify users of ranking changes, consider implementing GraphQL subscriptions or a polling mechanism on the client side.*

---

## Example Queries & Mutations

### Fighter

#### Get All Fighters
```graphql
query {
  fighters {
    id
    first_name
    last_name
    nickname
    nationality
    weight_class { name }
    red_corner_fights { id }
    blue_corner_fights { id }
    wins { id }
  }
}
```

#### Create a New Fighter
```graphql
mutation {
  createFighter(createFighterInput: {
    first_name: "Jane",
    last_name: "Doe",
    nickname: "The Panther",
    nationality: "USA",
    weight_class_id: 1
  }) {
    id
    first_name
    last_name
  }
}
```

#### Get Fighter by ID (with fight history)
```graphql
query {
  fighter(id: 1) {
    id
    first_name
    last_name
    weight_class { name }
    red_corner_fights { id method winner { first_name last_name } }
    blue_corner_fights { id method winner { first_name last_name } }
    wins { id method }
  }
}
```

#### Update a Fighter
```graphql
mutation {
  updateFighter(updateFighterInput: {
    id: 1,
    nickname: "The Lioness"
  }) {
    id
    nickname
  }
}
```

#### Remove a Fighter
```graphql
mutation {
  removeFighter(id: 1)
}
```

---

### Event

#### Get All Events
```graphql
query {
  events {
    id
    name
    date
    location
    fights { id }
  }
}
```

#### Create a New Event
```graphql
mutation {
  createEvent(createEventInput: {
    name: "MMA Grand Prix",
    date: "2025-08-01T18:00:00.000Z",
    location: "Arena X"
  }) {
    id
    name
    date
  }
}
```

#### Get Event Card (with fight details)
```graphql
query {
  event(id: 1) {
    name
    date
    location
    fights {
      id
      fighter_red { first_name last_name }
      fighter_blue { first_name last_name }
      winner { first_name last_name }
      method
      round
      time
    }
  }
}
```

#### Update an Event
```graphql
mutation {
  updateEvent(updateEventInput: {
    id: 1,
    location: "Updated Arena"
  }) {
    id
    location
  }
}
```

#### Remove an Event
```graphql
mutation {
  removeEvent(id: 1)
}
```

---

### Fight

#### Get All Fights
```graphql
query {
  fights {
    id
    event { name }
    fighter_red { first_name last_name }
    fighter_blue { first_name last_name }
    winner { first_name last_name }
    method
    round
    time
    result_details
  }
}
```

#### Create a New Fight
```graphql
mutation {
  createFight(createFightInput: {
    event_id: 1,
    fighter_red_id: 2,
    fighter_blue_id: 3,
    method: "KO",
    round: 1,
    time: "2:30"
  }) {
    id
    method
    winner { first_name last_name }
  }
}
```

#### Get Fight by ID
```graphql
query {
  fight(id: 1) {
    id
    event { name }
    fighter_red { first_name last_name }
    fighter_blue { first_name last_name }
    winner { first_name last_name }
    method
    round
    time
    result_details
  }
}
```

#### Update a Fight
```graphql
mutation {
  updateFight(updateFightInput: {
    id: 1,
    method: "Submission"
  }) {
    id
    method
  }
}
```

#### Remove a Fight
```graphql
mutation {
  removeFight(id: 1)
}
```

---

### Ranking

#### Get All Rankings (optionally filter by weight class)
```graphql
query {
  rankings(weight_class_id: 1) {
    id
    fighter { first_name last_name }
    weight_class { name }
    points
    rank
  }
}
```

#### Create a New Ranking
```graphql
mutation {
  createRanking(createRankingInput: {
    fighter_id: 1,
    weight_class_id: 1,
    points: 10,
    rank: 1
  }) {
    id
    points
    rank
  }
}
```

#### Get Ranking by ID
```graphql
query {
  ranking(id: 1) {
    id
    fighter { first_name last_name }
    weight_class { name }
    points
    rank
  }
}
```

#### Update a Ranking
```graphql
mutation {
  updateRanking(updateRankingInput: {
    id: 1,
    points: 12
  }) {
    id
    points
  }
}
```

#### Remove a Ranking
```graphql
mutation {
  removeRanking(id: 1)
}
```

---

### Weight Class

#### Get All Weight Classes
```graphql
query {
  weightClasses {
    id
    name
    min_weight_kg
    max_weight_kg
  }
}
```

#### Create a New Weight Class
```graphql
mutation {
  createWeightClass(createWeightClassInput: {
    name: "Featherweight",
    min_weight_kg: 61,
    max_weight_kg: 65
  }) {
    id
    name
  }
}
```

#### Get Weight Class by ID
```graphql
query {
  weightClass(id: 1) {
    id
    name
    min_weight_kg
    max_weight_kg
  }
}
```

#### Update a Weight Class
```graphql
mutation {
  updateWeightClass(updateWeightClassInput: {
    id: 1,
    name: "Super Featherweight"
  }) {
    id
    name
  }
}
```

#### Remove a Weight Class
```graphql
mutation {
  removeWeightClass(id: 1)
}
```

---

## Error Response Example
```json
{
  "errors": [
    {
      "message": "Fighter not found",
      "locations": [ { "line": 2, "column": 3 } ],
      "path": [ "createFight" ]
    }
  ],
  "data": null
}
```

---

## Notes
- All input is validated and sanitized.
- Only whitelisted fields are accepted.
- Errors are returned in GraphQL-compliant format. 