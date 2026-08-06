# Legality Sekolah Tengah — Frontend

React + Vite + Tailwind, deployed on Netlify. Two portals in one app:

- **User portal** (`/`) — fully public, no login. Anyone with the link can view,
  add, and edit school legality records.
- **Admin portal** (`/admin`) — requires an admin login. Sidebar navigation with
  Dashboard, Legality → Schools, and Legality → Alumni. Adds a Legality Status
  control on top of the same data the user portal writes to.

## Admin UI pattern

Every admin list page (`AdminSchools.jsx`, `AdminAlumni.jsx`) follows the same
standardized layout, built from shared components in `components/`:

- `StatCard.jsx` — the summary numbers at the top (Total / Completed / Pending / etc.)
- `SearchFilterBar.jsx` — the search box + dropdown filters row
- `Pagination.jsx` — page numbers + "Showing X to Y of Z" + per-page selector

Filtering and pagination happen client-side (the data sets are small enough
that this is simpler than adding query params to the API). Each page loads
its full list via its feature hook (`useAllSchools`, `useAlumni`), then
filters/paginates in a `useMemo`. Add a new admin list page by following the
same shape: stats → `SearchFilterBar` → a card grid → `Pagination`.

## Folder structure

```
frontend/
├── public/              # Static files served as-is
├── src/
│   ├── assets/           # Images, icons, static media
│   ├── components/       # Small reusable UI pieces used across features (Modal, ComingSoon, ProtectedRoute)
│   ├── layout/            # Page shells — sidebar nav + outlet (UserLayout, AdminLayout)
│   ├── pages/              # Route-level components (one per URL)
│   ├── features/            # Feature-based modules — each owns its components + hooks
│   │   ├── schools/
│   │   ├── alumni/
│   │   ├── teachers/
│   │   └── mom-notes/
│   ├── hooks/                # Cross-cutting custom hooks (useAuth)
│   ├── context/                # React context providers (AuthContext)
│   ├── redux/                   # Reserved for global state if the app outgrows Context — unused for now
│   ├── services/                 # API calls to the backend (api.js) and JWT storage (authToken.js)
│   ├── utils/                     # Helper functions and shared constants
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .eslintrc.json
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

`tailwind.config.js` and `postcss.config.js` also live at the project root —
required by the build tooling, not shown in the diagram this structure follows.

## Why `features/`

Each domain — schools, alumni, teachers, MOM notes — owns its own `components/`
and `hooks/` folder instead of dumping everything into one flat `components/`
directory. E.g. `features/schools/hooks/useSchools.js` handles all the
fetching/state for the school list, and `features/schools/components/SchoolCard.jsx`
just renders what it's given.

`TeacherCRM` and `MomNoteSection` are **shared** between `SchoolDetailModal`
and `AlumniDetailModal` rather than duplicated — a school and an alumni entry
can each have their own teachers and MOM notes, so both components take a
`parentType` (`"school"` or `"alumni"`) and `parentId` prop instead of a
school-specific one. The backend's `Teacher` and `MomNote` models mirror this
with a polymorphic `parent_type`/`parent_id` reference rather than two
separate collections.

## Local development

```bash
cp .env.example .env   # fill in your backend API URL
npm install
npm run dev              # http://localhost:5173
```

See `../DEPLOYMENT.md` for deploying this to Netlify.
