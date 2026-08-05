# Legality Sekolah Tengah — Backend

Node.js + Express API, deployed on Render. Talks to MongoDB via Mongoose.
Authentication is handled entirely in this backend (email + password, JWT
sessions) — there's no external auth provider.

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
│   └── createAdmin.js  # CLI: promote an existing account to admin
├── .env / .env.example
├── .gitignore
├── package.json
└── README.md
```

## Request flow

```
Client → Routes → Middleware (auth) → Controller → Service → Repository → MongoDB
```

- **Routes** map an HTTP verb + path to a controller function.
- **Controllers** read `req`, call a service, write `res`. No business logic here.
- **Services** hold the actual rules — e.g. "a PIC can only edit their own school",
  "only admins can change legality status" — and call one or more repositories.
- **Repositories** are the only files that talk to MongoDB directly (via Mongoose models).
- **Validators** check request payloads before a service acts on them.
- **Models** are Mongoose schemas, plus shared constants (school types, states, legality statuses).

## Authentication

There's no Supabase Auth (or any external provider) — this backend issues its
own JWTs:

1. `POST /api/auth/signup` — hashes the password with bcrypt, creates a `User`
   document (`role: 'user'` by default), returns `{ token, user }`.
2. `POST /api/auth/signin` — verifies the password, returns `{ token, user }`.
3. The frontend stores the token and sends it as `Authorization: Bearer <token>`
   on every request. `requireAuth` middleware verifies it and loads the user.

### Making someone an admin

```bash
npm run create-admin -- someone@example.com
```

This flips their `role` to `admin` directly in MongoDB. Run it from the
`backend/` folder with your `.env` (or Render env vars) in place.

## Local development

```bash
cp .env.example .env   # fill in your MongoDB + JWT values
npm install
npm run dev              # http://localhost:4000
```

See `../DEPLOYMENT.md` for deploying this to Render with MongoDB Atlas.
