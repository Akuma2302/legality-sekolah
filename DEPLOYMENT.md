# Deployment Guide — Legality Sekolah Tengah

Stack: **Supabase** (database + auth) → **Render** (backend API) → **Netlify** (frontend).

Do the steps in this order — each one produces a value the next step needs.

---

## 1. Supabase (database + auth)

1. Go to https://supabase.com → New project. Pick a name, a strong DB password, and a region close to your users (e.g. Singapore).
2. Once it's ready, open **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql`, and run it. This creates the `profiles`, `schools`, `teachers`, and `mom_notes` tables plus row-level security.
3. Go to **Project Settings → API**. Copy these three values — you'll need them shortly:
   - `Project URL` → this is `SUPABASE_URL`
   - `anon` `public` key → this is `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → this is `SUPABASE_SERVICE_ROLE_KEY` (keep secret, backend only)
4. Go to **Authentication → Providers** and make sure **Email** is enabled (it is by default).
5. Optional but recommended: **Authentication → URL Configuration** — add your future Netlify URL once you have it (step 3) so email confirmation links redirect correctly.

### Creating your first admin user
Sign-ups default to `role = 'user'` (see the `handle_new_user` trigger). To make someone an admin:
1. Have them sign up normally from the app's login page.
2. In Supabase, go to **Table Editor → profiles**, find their row, and change `role` from `user` to `admin`.
3. They'll see the admin portal (`/admin`) next time they sign in.

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
   - `SUPABASE_URL` = your Project URL from step 1
   - `SUPABASE_SERVICE_ROLE_KEY` = your service_role key from step 1
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
4. Add environment variables (**Site configuration → Environment variables**):
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
   - `VITE_API_URL` = your Render backend URL from step 2
5. Deploy. Netlify gives you a URL like `https://legality-sekolah.netlify.app`.

### Wire it back together
1. Back in **Render → your backend service → Environment**, set `FRONTEND_URL` to your real Netlify URL, then redeploy the backend so CORS allows it.
2. Back in **Supabase → Authentication → URL Configuration**, set the Site URL to your Netlify URL so email confirmation links work.

---

## 4. Try it end to end

1. Open your Netlify URL → Sign up as a normal user.
2. In Supabase Table Editor, flip your own `profiles.role` to `admin` if you want to test the admin portal too (use a second account for a normal PIC test).
3. As a user: Legality → Sekolah → **+ Add school** → fill in School Name, PIC Name, Type → click into the card → fill in branch/state/contacts → add a teacher → add a MOM note → **Save**.
4. As an admin: **Legality (Sekolah)** tab → you should see that school in the table → change its **Legality Status** dropdown.

---

## Local development (optional, before deploying)

```bash
# Backend
cd backend
cp .env.example .env   # fill in your Supabase values
npm install
npm run dev             # http://localhost:4000

# Frontend (separate terminal)
cd frontend
cp .env.example .env    # fill in your Supabase + local API values
npm install
npm run dev              # http://localhost:5173
```

---

## Notes & next steps
- Admin roles are assigned manually in Supabase for now — build an "invite admin" flow later if you need self-service.
- The four Legality Status options are: `Legal w/ BnW`, `Legal w/o BnW`, `Potentially Legal`, `Not Legal`. Your original notes listed "Legal w/ BnW" twice — adjust the wording in `supabase/schema.sql` (the `legality_status` check constraint) and `AdminSchoolTable.jsx` if that's not right.
- "Alumni" (both portals) and "Kit Legality" / "Template form" / "TDS chart" (user portal) are Coming Soon placeholders — build these out once you have the specs.
