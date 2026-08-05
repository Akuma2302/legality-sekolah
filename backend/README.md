# Legality Sekolah Tengah — Backend

Node.js + Express API, deployed on Render. Talks to MongoDB via Mongoose.
Authentication is handled entirely in this backend (username + password, JWT
sessions) — there's no external auth provider, and no public signup.

## Folder structure

```
backend/
├── src/
│   ├── config/         # App configuration (env vars, MongoDB connection)
│   ├── controllers/    # Handle req/res, call services, stay thin
│   ├── routes/         # Define API endpoints, wire up middleware
│   ├── services/       # Business logic (authorization, validation orchestration)
│   ├── middlewares/    # Auth guard, centralized error handler
│   ├── models/         # Mongoose schemas (User, School, Teacher, MomNote) + shared enums
│   ├── repositories/   # Raw MongoDB data access via Mongoose, nothing else
│   ├── utils/          # asyncHandler, ApiError, JWT sign/verify
│   ├── validators/     # Request payload validation
│   ├── app.js          # Express app setup (middleware, routes, error handling)
│   └── server.js       # Entry point — connects to MongoDB, then starts the HTTP server
├── scripts/
│   └── seedAdmin.js    # CLI: create/update the admin account
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

## Request flow

```
Client → Routes → Middleware (auth, only on the one protected route) → Controller → Service → Repository → MongoDB
```

- **Routes** map an HTTP verb + path to a controller function.
- **Controllers** read `req`, call a service, write `res`. No business logic here.
- **Services** hold the actual rules — e.g. "the general school update route never
  accepts legality_status" — and call one or more repositories.
- **Repositories** are the only files that talk to MongoDB directly (via Mongoose models).
- **Validators** check request payloads before a service acts on them.
- **Models** are Mongoose schemas, plus shared constants (school types, states, legality statuses).

## Access model

- **Everything under `/api/schools`, `/api/teachers`, `/api/mom-notes` is public** —
  no login required. This matches the frontend: the user portal has no accounts,
  so anyone with the link can view, add, and edit school records. There's no
  ownership concept (no `owner_id` on schools) — it's one shared pool of records.
- **`PATCH /api/schools/:id/legality-status` is the one protected route** — it
  requires an admin login (`requireAuth` + `requireAdmin`). This is the only
  thing an admin account actually gates.
- There's exactly one kind of account in this system: admin. There's no public
  signup — accounts are only ever created with the seed script below.

## Authentication

There's no Supabase Auth (or any external provider) — this backend issues its
own JWTs, used only for admin login:

1. `POST /api/auth/signin` — takes `{ username, password }`, verifies the
   password against the stored hash, returns `{ token, user }`.
2. The frontend stores the token and sends it as `Authorization: Bearer <token>`
   on every request. `requireAuth` middleware verifies it and loads the user —
   but as noted above, almost nothing actually requires it.

There is deliberately no `POST /signup` route — the only way to create or
reset an admin account is the seed script below, run by whoever controls the
deployment.

### Creating the admin account

```bash
npm run seed-admin
```

With no arguments, this creates (or resets the password for) the default
account:

- **username:** `adminlegality`
- **password:** `leg@lity!admin`

To use different credentials instead:

```bash
npm run seed-admin -- someUsername someP@ssword
```

It's idempotent (upserts on username), so re-running it is a safe way to
reset a forgotten password too. Run it from the `backend/` folder with your
`.env` (or Render env vars) in place — see `../DEPLOYMENT.md` for running it
against your deployed database.

## Local development

```bash
cp .env.example .env   # fill in your MongoDB + JWT values
npm install
npm run seed-admin       # create the admin account (see above)
npm run dev               # http://localhost:4000
```

See `../DEPLOYMENT.md` for deploying this to Render with MongoDB Atlas.
