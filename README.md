# MMA Platform

A backend API for managing MMA fighters, events, fight records, and dynamic rankings. Built with **NestJS**, **TypeORM**, **GraphQL**, and **PostgreSQL**, following CLEAN Architecture principles.

---

## Table of Contents
- [Overview](#overview)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [API Functionality](#api-functionality)
- [API Usage Examples](#api-usage-examples)
- [Ranking Algorithm](#ranking-algorithm)
- [Error Handling & Validation](#error-handling--validation)
- [Contributing](#contributing)
- [Submission Checklist](#submission-checklist)
- [Contact & Support](#contact--support)
- [License](#license)

---

## Overview
The MMA Platform provides a robust backend for managing:
- Fighter profiles with detailed stats and fight history
- Event and fight card management
- Individual fight records and results
- Dynamic, background-updated fighter rankings
- GraphQL API for all CRUD and query operations

The project is designed with modularity, maintainability, and scalability in mind, adhering to CLEAN Architecture and best practices.

---

## Tech Stack & Architecture
- **Backend Framework:** [NestJS](https://nestjs.com/) (modular, scalable, and maintainable)
- **Database:** PostgreSQL (relational, robust)
- **ORM:** TypeORM (entities, migrations, repository pattern)
- **API:** GraphQL (flexible, strongly-typed)
- **Architecture:** CLEAN Architecture (separation of concerns: Database, Business Logic, Routing, Domain)
- **Validation:** class-validator, class-transformer, global ValidationPipe
- **Error Handling:** Global exception filter for informative error responses
- **Testing:** Jest (unit and e2e)
- **Documentation:** Markdown docs, auto-generated GraphQL schema
- **Commit History:** Structured and descriptive commit messages are maintained throughout the project

---

## Features
- **Fighter Profiles:** Personal info, statistics, and fight history
- **Event Management:** Create and manage events, locations, dates, and fight cards
- **Fight Records:** Track individual fight results, methods, and participants
- **Dynamic Rankings:** Automated, algorithm-driven fighter rankings per weight class
- **GraphQL API:** Comprehensive, validated, and documented API for all operations

---

## Folder Structure

```
mma-platform/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── common/
│   │   └── filters/
│   │       └── all-exceptions.filter.ts
│   │── utils
│   │     └── ensure-database.ts
│   │     └── seed-dummy-data.ts
│   ├── event/
│   │   ├── dto/
│   │   ├── event.entity.ts
│   │   ├── event.module.ts
│   │   ├── event.resolver.ts
│   │   └── event.service.ts
│   ├── fight/
│   │   ├── dto/
│   │   ├── fight.entity.ts
│   │   ├── fight.module.ts
│   │   ├── fight.resolver.ts
│   │   └── fight.service.ts
│   ├── fighter/
│   │   ├── dto/
│   │   ├── fighter.entity.ts
│   │   ├── fighter.module.ts
│   │   ├── fighter.resolver.ts
│   │   └── fighter.service.ts
│   ├── ranking/
│   │   ├── dto/
│   │   ├── ranking.entity.ts
│   │   ├── ranking.module.ts
│   │   ├── ranking.resolver.ts
│   │   └── ranking.service.ts
│   └── weight-class/
│       ├── dto/
│       ├── weight-class.entity.ts
│       ├── weight-class.module.ts
│       ├── weight-class.resolver.ts
│       └── weight-class.service.ts
├── test/
│   └── app.e2e-spec.ts
├── API_DOCS.md
├── ERD.svg
├── RANKING_ALGORITHM.md
├── schema.sql
├── schema.gql
├── README.md
└── ...
```

- Each domain (fighter, event, fight, ranking, weight-class) is organized in its own folder with entities, DTOs, resolvers, services, and modules.
- Common utilities and filters are under `src/common`.
- Documentation and schema files are at the root.

---

## Entity Relationship Diagram (ERD)

See [`ERD.svg`](./ERD.svg) for a visual representation of the database schema.

---

## Requirements
- Node.js v18+
- Yarn
- PostgreSQL (local or remote instance)

---

## Environment Variables

The following environment variables are required (see `.env.example` for details):

| Variable         | Description                  | Example                |
|------------------|-----------------------------|------------------------|
| DB_HOST          | Database host               | localhost              |
| DB_PORT          | Database port               | 5432                   |
| DB_USER          | Database username           | mma_user               |
| DB_PASS          | Database password           | secret                 |
| DB_NAME          | Database name               | mma-platform           |
| PORT             | App port (optional)         | 3000                   |

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WorkuMekuriya/MMA-Platform.git
   cd mma-platform
   ```
2. **Install dependencies:**
   ```bash
   yarn install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update with your PostgreSQL credentials if needed.
4. **Set up the database:**
   - Ensure PostgreSQL is running and accessible.
   - Run the SQL DDL in `schema.sql` if you want to manually create tables, or let TypeORM auto-create them on first run.

---

## Running the Project

```bash
# Development
yarn start:dev

# Production
yarn build
yarn start:prod
```

---

## Testing

```bash
# Unit tests
yarn test

# End-to-end tests
yarn test:e2e
```

---

## API Documentation
- See [`API_DOCS.md`](./API_DOCS.md) for detailed schema, queries, mutations, and error responses.
- The GraphQL playground is enabled in development mode for interactive exploration.

---

## API Functionality
- **CRUD Operations:** Fighters, Fights, Events, Rankings
- **Fighter Statistics:** Retrieve detailed stats and fight histories
- **Event Listings:** List upcoming events and fight cards, including fighters and event details
- **Ranking:** Retrieve and update dynamic fighter rankings per weight class
- **Validation:** All input is validated and sanitized
- **Error Handling:** Informative, structured error responses

---

## Ranking Algorithm
- The ranking system is fully documented in [`RANKING_ALGORITHM.md`](./RANKING_ALGORITHM.md).
- Rankings are recalculated automatically after each fight result, using a transparent, point-based system with tiebreakers.
- **Background Update:** Rankings are updated in the background after fight results are published, ensuring users do not experience delays.

---

## Error Handling & Validation
- **Validation:** All incoming data is validated and sanitized using `class-validator` and global `ValidationPipe`.
- **Error Handling:** A global exception filter provides comprehensive and informative error responses for both HTTP and GraphQL APIs. See `src/common/filters/all-exceptions.filter.ts` for implementation.

---

## Contributing
1. Fork the repository and create your branch from `main`.
2. Ensure your code follows the existing style and passes linting/tests:
   ```bash
   yarn lint
   yarn test
   ```
3. Submit a pull request with a clear description of your changes.

---

## Submission Checklist
- [x] **Entity Relationship Diagram (ERD):** See [`ERD.svg`](./ERD.svg)
- [x] **SQL DDL Scripts:** See [`schema.sql`](./schema.sql)
- [x] **Full Source Code Repository:** (add your GitHub/GitLab link here)
- [x] **Documented Ranking Algorithm:** See [`RANKING_ALGORITHM.md`](./RANKING_ALGORITHM.md)
- [x] **API Documentation & Usage Examples:** See [`API_DOCS.md`](./API_DOCS.md)
- [x] **Structured Commit History:** Maintained throughout the project

---

## Contact & Support
For questions, issues, or support, please contact:
- **Author:** Mekuriya Worku (<mekuriya185@gmail.com>)
- Or open an issue in the repository

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
