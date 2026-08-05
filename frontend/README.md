# Legality Sekolah Tengah — Frontend

React + Vite + Tailwind, deployed on Netlify. Two portals in one app: a user
(PIC) portal at `/` and an admin portal at `/admin`, gated by the account role
returned from the backend on login.

## Folder structure

```
frontend/
├── public/              # Static files served as-is
├── src/
│   ├── assets/           # Images, icons, static media
│   ├── components/       # Small reusable UI pieces used across features (Modal, ComingSoon, ProtectedRoute)
│   ├── layout/            # Page shells — top nav + outlet (UserLayout, AdminLayout)
│   ├── pages/              # Route-level components (one per URL)
│   ├── features/            # Feature-based modules — each owns its components + hooks
│   │   ├── schools/
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

Each domain — schools, teachers, MOM notes — owns its own `components/` and
`hooks/` folder instead of dumping everything into one flat `components/`
directory. E.g. `features/schools/hooks/useMySchools.js` handles all the
fetching/state for the school list, and `features/schools/components/SchoolCard.jsx`
just renders what it's given. `TeacherCRM` and `MomNoteSection` are nested
inside `SchoolDetailModal` but live in their own feature folders since they're
independent domains with their own hooks.

## Local development

```bash
cp .env.example .env   # fill in your backend API URL
npm install
npm run dev              # http://localhost:5173
```

See `../DEPLOYMENT.md` for deploying this to Netlify.
