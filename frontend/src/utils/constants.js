export const SCHOOL_TYPES = ['A', 'B', 'C', 'New'];

export const BRANCHES = ['Central', 'North', 'East Coast', 'Borneo'];

export const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak',
  'Perlis', 'Penang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu',
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

export const SCHOOL_TYPE_OPTIONS = ['Harian', 'Asrama', 'Harian & Asrama'];