# Store Rating Platform — Backend

NestJS API server with TypeORM, PostgreSQL, and JWT authentication.

## Setup

```bash
npm install
cp .env.example .env   # Edit with your DB credentials
npm run migration:run   # Create tables
npm run seed            # Seed admin user
npm run start:dev       # Start in watch mode (port 3000)
```

## Scripts

| Script               | Description                     |
| -------------------- | ------------------------------- |
| `npm run start:dev`  | Start in watch mode             |
| `npm run build`      | Build for production            |
| `npm run start:prod` | Start production build          |
| `npm run migration:run` | Run pending migrations       |
| `npm run seed`       | Seed the default admin account  |
| `npm test`           | Run unit tests                  |
| `npm run test:e2e`   | Run e2e tests                   |
