export const SCHOOL_TYPES = ['A', 'B', 'C', 'New'];

export const BRANCHES = ['Tengah', 'Utara', 'Pantai Timur', 'Borneo'];

export const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak',
  'Perlis', 'Penang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Putrajaya',
];

export const LEGALITY_STATUS_STYLES = {
  'Legal w/ BnW': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Legal w/o BnW': 'bg-sky-50 text-sky-700 border-sky-200',
  'Potentially Legal': 'bg-amber-50 text-amber-700 border-amber-200',
  'Not Legal': 'bg-red-50 text-red-700 border-red-200',
};

export const LEGALITY_STATUSES = Object.keys(LEGALITY_STATUS_STYLES);

export const ALUMNI_STATUSES = [
  'Done messaging teacher',
  'Done proposing talk',
  'Done getting talk date',
  'Done talk preparation',
  'Done creating program report',
];

export const ALUMNI_STATUS_STYLES = {
  'Done messaging teacher': 'bg-amber-50 text-amber-700 border-amber-200',
  'Done proposing talk': 'bg-amber-50 text-amber-700 border-amber-200',
  'Done getting talk date': 'bg-sky-50 text-sky-700 border-sky-200',
  'Done talk preparation': 'bg-sky-50 text-sky-700 border-sky-200',
  'Done creating program report': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

/** Empty status ("Not started") falls back to this. */
export const NOT_STARTED_STYLE = 'bg-slate-100 text-slate-500 border-slate-200';

export const SCHOOL_TYPE_OPTIONS = ['Harian', 'Asrama', 'Harian & Asrama'];
