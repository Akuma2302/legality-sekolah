# Legality Sekolah Tengah — Backend

Node.js + Express API, deployed on Render. Talks to Supabase Postgres using the
service-role key (bypasses RLS — the backend enforces access control itself).

## Folder structure

```
backend/
├── src/
│   ├── config/         # App configuration (env vars, Supabase client)
│   ├── controllers/    # Handle req/res, call services, stay thin
│   ├── routes/         # Define API endpoints, wire up middleware
│   ├── services/       # Business logic (authorization, validation orchestration)
│   ├── middlewares/    # Auth guard, centralized error handler
│   ├── models/         # Shared enums/constants (no ORM — schema lives in Supabase)
│   ├── repositories/   # Raw Supabase data access, nothing else
│   ├── utils/          # asyncHandler, ApiError
│   ├── validators/     # Request payload validation
│   ├── app.js          # Express app setup (middleware, routes, error handling)
│   └── server.js        # Entry point — starts the HTTP server
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

## Request flow

```
Client → Routes → Middleware (auth) → Controller → Service → Repository → Supabase
```

- **Routes** map an HTTP verb + path to a controller function.
- **Controllers** read `req`, call a service, write `res`. No business logic here.
- **Services** hold the actual rules — e.g. "a PIC can only edit their own school",
  "only admins can change legality status" — and call one or more repositories.
- **Repositories** are the only files that talk to Supabase directly.
- **Validators** check request payloads before a service acts on them.
- **Models** hold shared constants (school types, states, legality statuses).

## Local development

```bash
cp .env.example .env   # fill in your Supabase values
npm install
npm run dev              # http://localhost:4000
```

See `../DEPLOYMENT.md` for deploying this to Render.
