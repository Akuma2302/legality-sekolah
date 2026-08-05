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

## 4. Creating your first admin user

There's no signup flow for regular visitors — the user portal has no login at
all. Admin accounts are the only accounts in the system, created directly by
you:

1. Go to your Netlify URL → click **Admin login** (top right of the user
   portal) → **Don't have an account? Sign up** → create the account with the
   email/password you want to use as admin.
2. From your machine (with the same `MONGODB_URI` in a local `.env`, or by
   running this against your Render shell):
   ```bash
   cd backend
   npm run create-admin -- their-email@example.com
   ```
3. Sign in again (or refresh if already signed in) — they'll now land in the
   admin portal (`/admin`).

If you don't have Node set up locally, you can also open **Render → your backend service → Shell** and run the same command there, or connect to your Atlas cluster with MongoDB Compass and edit the `role` field on their document in the `users` collection directly.

---

## 5. Try it end to end

1. Open your Netlify URL — you should land straight on the homepage, no login prompt.
2. Legality → Sekolah → **+ Add school** → fill in School Name, PIC Name, Type → click into the card → fill in branch/state/contacts → add a teacher → add a MOM note → **Save**. None of this requires an account.
3. Click **Admin login** → sign up, then run `npm run create-admin -- <your-email>` (step 4 above), then sign in again.
4. As an admin: **Legality (Sekolah)** tab → you should see the school you just added → click into it to see the full detail view, now with a **Legality Status** dropdown at the top → change it and **Save**.

---

## Local development (optional, before deploying)

```bash
# Backend
cd backend
cp .env.example .env   # fill in your MongoDB URI + JWT secret
npm install
npm run dev              # http://localhost:4000

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
- Admin roles are assigned via the `create-admin` script for now — build an in-app "invite admin" flow later if you need self-service.
- The four Legality Status options are: `Legal w/ BnW`, `Legal w/o BnW`, `Potentially Legal`, `Not Legal`. Adjust the enum in `backend/src/models/school.model.js` (and `frontend/src/utils/constants.js` to match) if that wording isn't right.
- "Alumni" (both portals) and "Kit Legality" / "Template form" / "TDS chart" (user portal) are Coming Soon placeholders — build these out once you have the specs.
- JWTs are valid for 7 days (see `backend/src/utils/jwt.js`) and stored in the browser's `localStorage`. There's no refresh-token flow yet — admins just sign in again after expiry.
