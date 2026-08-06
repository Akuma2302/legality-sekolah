# Deployment Guide — Legality Sekolah Tengah

Stack: **MongoDB Atlas** (database) → **Render** (backend API + auth) → **Netlify** (frontend).

Do the steps in this order — each one produces a value the next step needs.

---

## 1. MongoDB Atlas (database)

1. Go to https://www.mongodb.com/cloud/atlas → sign up / log in → **Create a deployment**. The free M0 tier is enough to start.
2. Pick a cloud provider/region close to your users (e.g. Singapore for Malaysia).
3. **Database Access** → add a database user with a username + password (not your Atlas login — a separate DB user). Save the password somewhere safe.
4. **Network Access** → add IP address `0.0.0.0/0` (allow from anywhere) so Render can reach it. You can tighten this later once you know Render's static IPs (paid plans only) or use Atlas's private networking.
5. **Database → Connect → Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
   ```
   Add a database name before the `?`, e.g. `.../legality_sekolah?retryWrites=true...` — this becomes your `MONGODB_URI`.

No manual schema setup needed — Mongoose creates collections automatically the first time data is written.

---

## 2. Render (backend API)

1. Push the `backend/` folder to a GitHub repo (or the whole project — Render lets you set a root directory).
2. Go to https://render.com → New → Web Service → connect your repo.
3. Settings:
   - **Root Directory:** `backend` (if you pushed the whole project)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free is fine to start
4. Add environment variables (**Environment → Add Environment Variable**):
   - `MONGODB_URI` = your connection string from step 1
   - `JWT_SECRET` = a long random string. Generate one locally with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - `FRONTEND_URL` = leave as `http://localhost:5173` for now — you'll update this after step 3
   - `PORT` = `4000` (Render sets its own `PORT` automatically, but this is a safe default)
5. Deploy. Once live, copy your service URL, e.g. `https://legality-sekolah-backend.onrender.com`. Test it by opening it in a browser — you should see `{"status":"ok", ...}`.

> Free Render web services spin down after inactivity and take ~30–60s to wake up on the first request. Upgrade to a paid instance if that delay is a problem.

---

## 3. Netlify (frontend)

1. Push the `frontend/` folder to GitHub (same repo is fine).
2. Go to https://netlify.com → Add new site → Import an existing project → connect your repo.
3. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist` (Netlify usually detects this from `netlify.toml`)
4. Add environment variable (**Site configuration → Environment variables**):
   - `VITE_API_URL` = your Render backend URL from step 2
5. Deploy. Netlify gives you a URL like `https://legality-sekolah.netlify.app`.

### Wire it back together
Back in **Render → your backend service → Environment**, set `FRONTEND_URL` to your real Netlify URL, then redeploy the backend so CORS allows it.

---

## 4. Creating the admin account

There's no signup flow anywhere in this app — the user portal has no login at
all, and the admin portal has no "create account" option either. The one
admin account is created by you, directly in the database, using the seed
script:

1. From your machine, with the same `MONGODB_URI` your Render backend uses
   (put it in a local `backend/.env`), or by opening **Render → your backend
   service → Shell**:
   ```bash
   cd backend
   npm run seed-admin
   ```
2. With no arguments, that creates:
   - **username:** `adminlegality`
   - **password:** `leg@lity!admin`

   To use different credentials instead: `npm run seed-admin -- yourUsername yourPassword`.
3. Go to your Netlify URL → **Admin login** (top right) → sign in with those
   credentials → you'll land in the admin portal (`/admin`).

The script is safe to re-run — it upserts on username, so running it again
(with the same or different password) just resets that account rather than
creating a duplicate. That's also how you recover if the password is lost.

If you don't have Node set up locally and don't want to use the Render Shell,
you can also connect to your Atlas cluster with MongoDB Compass and edit the
`users` collection by hand — but you'd need to paste in a bcrypt hash rather
than a plain password (see the note on this further down if you go that route).

---

## 5. Try it end to end

1. Open your Netlify URL — you should land straight on the homepage, no login prompt.
2. Legality → Sekolah → **+ Add school** → fill in School Name, PIC Name, Type → click into the card → fill in branch/state/contacts → add a teacher → add a MOM note → **Save**. None of this requires an account.
3. Legality → Alumni → same workflow, but the detail view has a **Status** dropdown (outreach progress) instead of a legality field — also no account needed.
4. Click **Admin login** → sign in with `adminlegality` / `leg@lity!admin` (or whatever you seeded in step 4 above).
5. As an admin: sidebar → **Legality → Schools** → you should see the school you just added as a card → click **View**/**Edit** to see the full detail view, now with a **Legality Status** dropdown at the top → change it and **Save**.

---

## Local development (optional, before deploying)

```bash
# Backend
cd backend
cp .env.example .env   # fill in your MongoDB URI + JWT secret
npm install
npm run seed-admin       # create the admin account (adminlegality / leg@lity!admin by default)
npm run dev               # http://localhost:4000

# Frontend (separate terminal)
cd frontend
cp .env.example .env    # fill in your local API URL
npm install
npm run dev               # http://localhost:5173
```

For local MongoDB without Atlas, install MongoDB Community Server and use
`MONGODB_URI=mongodb://localhost:27017/legality_sekolah` instead.

---

## Notes & next steps
- **The user portal has no access control at all.** Anyone with the link can view, add, and edit every school record — there's no per-visitor identity, so nothing stops one visitor from editing a school someone else added. That was the explicit goal ("accessible for anyone"), but it does mean this only makes sense for a trusted-audience internal tool (shared link, not indexed publicly) rather than something exposed to the open internet with sensitive data. If you later need "only the PIC who added a school can edit it," that requires bringing back some form of lightweight identity (e.g. a per-browser edit token, or optional accounts) — worth flagging if that becomes a concern.
- **Change the default admin password before going live.** `adminlegality` / `leg@lity!admin` is a known, documented credential — anyone with this codebase knows it. Run `npm run seed-admin -- yourUsername yourStrongerPassword` once you're ready for real use, and it'll replace the default account.
- There's no self-service admin creation by design — the seed script is the only way in. If you need a second admin, just run `npm run seed-admin -- secondUsername theirPassword` again with different credentials.
- The four Legality Status options are: `Legal w/ BnW`, `Legal w/o BnW`, `Potentially Legal`, `Not Legal`. Adjust the enum in `backend/src/models/school.model.js` (and `frontend/src/utils/constants.js` to match) if that wording isn't right.
- The five Alumni Status options are: `Done messaging teacher`, `Done proposing talk`, `Done getting talk date`, `Done talk preparation`, `Done creating program report`. Adjust the enum in `backend/src/models/alumni.model.js` (and `frontend/src/utils/constants.js`) if that wording isn't right.
- Both the **user portal's** "Alumni" tab and the **admin portal's** Legality → Alumni page are fully built now. What's still a Coming Soon placeholder: "Kit Legality" / "Template form" / "TDS chart" on the user portal.
- JWTs are valid for 7 days (see `backend/src/utils/jwt.js`) and stored in the browser's `localStorage`. There's no refresh-token flow yet — admins just sign in again after expiry.
